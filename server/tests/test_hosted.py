"""Hosted contract checks without cloud mutation or paid model requests."""
import importlib.util
from pathlib import Path
from unittest.mock import Mock

import httpx
import pytest
import server.app as module
from test_chat import Provider, Verifier, message, events


async def test_owner_gate_precedes_body_dispatch_and_provider():
    provider = Provider()
    app = module.create_app(Verifier(), provider, allowed_owner='alice')
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://test') as client:
        for token, status in [('', 401), ('invalid', 401), ('bob', 403)]:
            response = await client.post('/api/chatkit', content='not json', headers={'Authorization': 'Bearer '+token})
            assert response.status_code == status
            assert response.headers['cache-control'] == 'no-store'
        assert not provider.calls
        response = await client.post('/api/chatkit', json=message(), headers={'Authorization': 'Bearer alice'})
        assert response.status_code == 200
        assert events(response)[-1]['item']['content'][0]['text'] == 'Hello from test GPT.'
        assert len(provider.calls) == 1


async def test_restart_loses_thread_and_new_chat_recovers():
    provider = Provider()
    original = module.create_app(Verifier(), provider, allowed_owner='alice')
    headers = {'Authorization': 'Bearer alice'}
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=original), base_url='http://test') as client:
        reply = await client.post('/api/chatkit', json=message(), headers=headers)
        thread = events(reply)[0]['thread']['id']
    restarted = module.create_app(Verifier(), provider, allowed_owner='alice')
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=restarted), base_url='http://test') as client:
        lost = await client.post('/api/chatkit', json=message('Continue', thread), headers=headers)
        assert lost.status_code == 404
        assert 'new chat' in lost.json()['error'].lower()
        fresh = await client.post('/api/chatkit', json=message(), headers=headers)
        assert fresh.status_code == 200


@pytest.fixture
def production(monkeypatch):
    for key in list(module.os.environ):
        if key.startswith('CHATKIT_') or 'EMULATOR' in key or key in {'OPENAI_API_KEY', 'K_SERVICE'}:
            monkeypatch.delenv(key, raising=False)
    for key, value in {'CHATKIT_ENV': 'production', 'CHATKIT_FIREBASE_PROJECT': 'lifebuckets-bd43d',
                       'CHATKIT_PROVIDER': 'openai', 'CHATKIT_MODEL': 'gpt-4.1-mini',
                       'CHATKIT_OWNER_UID': 'alice', 'OPENAI_API_KEY': 'unit-test-only'}.items():
        monkeypatch.setenv(key, value)
    verifier, provider = Mock(return_value=Verifier()), Mock(return_value=Provider())
    monkeypatch.setattr(module, 'FirebaseVerifier', verifier)
    monkeypatch.setattr(module, 'OpenAIProvider', provider)
    return verifier, provider


@pytest.mark.parametrize('key,value', [
    ('CHATKIT_FIREBASE_PROJECT', ''), ('CHATKIT_FIREBASE_PROJECT', 'other-project'),
    ('CHATKIT_FIREBASE_PROJECT', 'demo-lifebuckets'), ('CHATKIT_PROVIDER', ''),
    ('CHATKIT_PROVIDER', 'simulated'), ('CHATKIT_MODEL', ''), ('CHATKIT_MODEL', 'unapproved'),
    ('CHATKIT_OWNER_UID', ''), ('CHATKIT_OWNER_UID', ' '), ('CHATKIT_OWNER_UID', 'x'*129),
    ('OPENAI_API_KEY', ''), ('FIREBASE_AUTH_EMULATOR_HOST', '127.0.0.1:9099'),
    ('FIRESTORE_EMULATOR_HOST', '127.0.0.1:8080'),
])
def test_invalid_production_refused_before_clients(production, monkeypatch, key, value):
    monkeypatch.setenv(key, value)
    with pytest.raises(ValueError):
        module.configured_app()
    assert not production[0].called and not production[1].called


@pytest.mark.parametrize('cloud_marker', [False, True])
def test_cannot_bypass_hosted_checks_by_omitting_env(production, monkeypatch, cloud_marker):
    monkeypatch.delenv('CHATKIT_ENV')
    monkeypatch.delenv('CHATKIT_OWNER_UID')
    if cloud_marker:
        monkeypatch.setenv('K_SERVICE', 'lifebuckets-chat')
        monkeypatch.delenv('CHATKIT_FIREBASE_PROJECT')
    with pytest.raises(ValueError):
        module.configured_app()


async def test_valid_hosted_configuration_enforces_owner(production):
    app = module.configured_app()
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://test') as client:
        denied = await client.post('/api/chatkit', json=message(), headers={'Authorization': 'Bearer bob'})
        allowed = await client.post('/api/chatkit', json=message(), headers={'Authorization': 'Bearer alice'})
    assert denied.status_code == 403 and allowed.status_code == 200


def deployment_module():
    path = Path(__file__).resolve().parents[2] / 'scripts/chatkit/deploy.py'
    spec = importlib.util.spec_from_file_location('deployment', path)
    deployment = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(deployment)
    return deployment


def test_deployment_refuses_dirty_or_wrong_candidate(monkeypatch):
    deployment = deployment_module()
    monkeypatch.setattr(deployment, 'run', lambda args: 'abc' if args[1] == 'rev-parse' else ' M server/app.py')
    with pytest.raises(RuntimeError, match='exact reviewed'):
        deployment.committed_candidate('other')
    with pytest.raises(RuntimeError, match='Commit the reviewed'):
        deployment.committed_candidate('abc')


def test_key_transfer_failure_does_not_log_subprocess_output(monkeypatch, capsys):
    deployment = deployment_module()
    monkeypatch.setattr(deployment.subprocess, 'run', lambda *a, **kw: Mock(returncode=1, stderr='SECRET echo', stdout='SECRET echo'))
    with pytest.raises(RuntimeError):
        deployment.run(['gcloud', 'secrets'], secret_input='SECRET')
    assert 'SECRET' not in str(capsys.readouterr())
