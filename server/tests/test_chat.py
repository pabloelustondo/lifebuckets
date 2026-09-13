import asyncio
import json
from datetime import datetime, timezone

import httpx
import pytest
from chatkit.types import ThreadMetadata
from server.app import create_app, AssistantServer
from server.auth import AuthenticationError, FirebaseVerifier
from server.provider import SimulatedProvider
from server.store import MemoryStore, OwnershipError, NotFoundError


class Verifier:
    async def verify(self, token):
        if token not in {"alice", "bob"}:
            raise AuthenticationError()
        return token


class Provider(SimulatedProvider):
    def __init__(self):
        self.calls = []

    async def reply(self, messages):
        self.calls.append(messages)
        yield "Hello "
        yield "from test GPT."


def message(text="Hi", thread=None):
    params = {"input": {"content": [{"type": "input_text", "text": text}],
                         "attachments": [], "inference_options": {}}}
    if thread:
        params["thread_id"] = thread
    return {"type": "threads.add_user_message" if thread else "threads.create", "params": params}


def events(response):
    return [json.loads(line[6:]) for line in response.text.splitlines() if line.startswith("data: ")]


@pytest.fixture
async def setup():
    provider = Provider()
    app = create_app(Verifier(), provider)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        yield app, client, provider


async def test_greeting_followup_is_streamed_and_private(setup):
    app, client, provider = setup
    response = await client.post('/api/chatkit', json=message(), headers={'Authorization': 'Bearer alice'})
    assert response.status_code == 200
    assert response.headers['cache-control'] == 'no-store'
    assert response.headers['content-type'].startswith('text/event-stream')
    stream = events(response)
    thread = stream[0]['thread']['id']
    assert any(e['type'] == 'thread.item.updated' for e in stream)
    assert stream[-1]['item']['content'][0]['text'] == 'Hello from test GPT.'
    second = await client.post('/api/chatkit', json=message('How are you?', thread), headers={'Authorization': 'Bearer alice'})
    assert second.status_code == 200
    assert [m['role'] for m in provider.calls[-1]] == ['user', 'assistant', 'user']
    assert all(set(m) == {'role', 'content'} for m in provider.calls[-1])
    for kind in ['threads.get_by_id', 'items.list', 'threads.delete', 'threads.add_user_message']:
        body = message('steal', thread) if kind.endswith('add_user_message') else {'type': kind, 'params': {'thread_id': thread}}
        denied = await client.post('/api/chatkit', json=body, headers={'Authorization': 'Bearer bob'})
        assert denied.status_code == 403
    listing = await client.post('/api/chatkit', json={'type': 'threads.list', 'params': {}}, headers={'Authorization': 'Bearer bob'})
    assert listing.json()['data'] == []
    assert len(provider.calls) == 2
    assert not app.state.active


@pytest.mark.parametrize('header', ['', 'Bearer invalid', 'Basic alice'])
async def test_auth_before_provider(setup, header):
    _, client, provider = setup
    response = await client.post('/api/chatkit', json=message(), headers={'Authorization': header})
    assert response.status_code == 401
    assert not provider.calls


async def test_limits_and_disabled_inputs(setup):
    _, client, provider = setup
    headers = {'Authorization': 'Bearer alice'}
    for text in ['', ' ' * 2, 'x' * 2001]:
        assert (await client.post('/api/chatkit', json=message(text), headers=headers)).status_code == 400
    assert (await client.post('/api/chatkit', content='x' * 16385, headers=headers)).status_code == 413
    for field, value in [('attachments', ['file']), ('quoted_text', 'extra context'), ('inference_options', {'model': 'expensive-model'})]:
        body = message()
        body['params']['input'][field] = value
        assert (await client.post('/api/chatkit', json=body, headers=headers)).status_code == 400
    assert not provider.calls
    for _ in range(10):
        assert (await client.post('/api/chatkit', json=message(), headers=headers)).status_code == 200
    assert (await client.post('/api/chatkit', json=message(), headers=headers)).status_code == 429


async def test_expiry_and_store_ownership():
    now = [0]
    store = MemoryStore(ttl=1800, clock=lambda: now[0])
    thread = ThreadMetadata(id='thread', created_at=datetime.now(timezone.utc))
    await store.save_thread(thread, 'alice')
    with pytest.raises(OwnershipError):
        await store.save_thread(thread, 'bob')
    with pytest.raises(OwnershipError):
        await store.delete_thread('thread', 'bob')
    now[0] = 1800
    with pytest.raises(NotFoundError):
        await store.load_thread('thread', 'alice')
    assert not store.records


async def test_provider_failure_sanitized(caplog):
    class Broken(Provider):
        async def reply(self, messages):
            raise RuntimeError('PRIVATE provider payload and key')
            yield ''
    app = create_app(Verifier(), Broken())
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://test') as client:
        response = await client.post('/api/chatkit', json=message(), headers={'Authorization': 'Bearer alice'})
    assert any(e['type'] == 'error' for e in events(response))
    assert 'PRIVATE' not in response.text + caplog.text
    assert not app.state.active


async def test_one_concurrent_run_and_cancellation():
    started, closed = asyncio.Event(), asyncio.Event()
    class Slow(Provider):
        async def reply(self, messages):
            try:
                started.set()
                await asyncio.sleep(100)
                yield 'late'
            finally:
                closed.set()
    app = create_app(Verifier(), Slow())
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://test') as client:
        task = asyncio.create_task(client.post('/api/chatkit', json=message(), headers={'Authorization': 'Bearer alice'}))
        await asyncio.wait_for(started.wait(), 3)
        denied = await client.post('/api/chatkit', json=message(), headers={'Authorization': 'Bearer alice'})
        assert denied.status_code == 429
        task.cancel()
        with pytest.raises(asyncio.CancelledError):
            await task
        await asyncio.wait_for(closed.wait(), 3)
        assert not app.state.active


def test_production_refuses_emulator(monkeypatch):
    monkeypatch.setenv('FIREBASE_AUTH_EMULATOR_HOST', '127.0.0.1:9099')
    with pytest.raises(ValueError):
        FirebaseVerifier('real-project')


async def test_timeout_is_recoverable_and_releases_slot():
    class TimedOut(Provider):
        async def reply(self, messages):
            raise TimeoutError()
            yield ''
    app = create_app(Verifier(), TimedOut())
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://test') as client:
        for _ in range(2):
            response = await client.post('/api/chatkit', json=message(), headers={'Authorization': 'Bearer alice'})
            assert response.status_code == 200
            assert any(e['type'] == 'error' and 'try again' in e['message'] for e in events(response))
            assert not app.state.active
