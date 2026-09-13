"""ChatKit endpoint: authenticate before protocol dispatch or provider work."""
import asyncio
import logging
import os
import time
import uuid
from collections import deque
from contextlib import aclosing
from datetime import datetime, timezone

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, Response, StreamingResponse
from pydantic import TypeAdapter, ValidationError
from chatkit.errors import CustomStreamError
from chatkit.server import ChatKitServer, StreamingResult
from chatkit.store import NotFoundError
from chatkit.types import (ChatKitReq, AssistantMessageItem, AssistantMessageContent,
    ThreadItemAddedEvent, ThreadItemUpdatedEvent, ThreadItemDoneEvent,
    AssistantMessageContentPartTextDelta, ErrorEvent, UserMessageItem)

from server.auth import FirebaseVerifier, AuthenticationError
from server.provider import OpenAIProvider, SimulatedProvider, ProviderUnavailable
from server.store import MemoryStore, OwnershipError, CapacityError

LOG = logging.getLogger("lifebuckets.chat")
HEADERS = {"Cache-Control": "no-store", "X-Content-Type-Options": "nosniff"}
GENERATE = {"threads.create", "threads.add_user_message"}
ALLOWED = GENERATE | {"threads.get_by_id", "threads.list", "items.list", "threads.delete"}


class AssistantServer(ChatKitServer[str]):
    def __init__(self, store, provider):
        super().__init__(store)
        self.provider = provider

    async def respond(self, thread, input, context):
        page = await self.store.load_thread_items(thread.id, None, 20, "desc", context)
        messages = []
        for item in reversed(page.data):
            if isinstance(item, (UserMessageItem, AssistantMessageItem)):
                messages.append({"role": "user" if isinstance(item, UserMessageItem) else "assistant",
                                 "content": "".join(part.text for part in item.content)})
        item = AssistantMessageItem(id=self.store.generate_item_id("message", thread, context),
            thread_id=thread.id, created_at=datetime.now(timezone.utc), content=[AssistantMessageContent(text="")])
        yield ThreadItemAddedEvent(item=item)
        text = ""
        try:
            async with asyncio.timeout(30), aclosing(self.provider.reply(messages)) as stream:
                async for delta in stream:
                    text += delta
                    yield ThreadItemUpdatedEvent(item_id=item.id,
                        update=AssistantMessageContentPartTextDelta(content_index=0, delta=delta))
        except asyncio.CancelledError:
            raise
        except (ProviderUnavailable, TimeoutError):
            raise CustomStreamError("The reply could not finish. Please try again.", allow_retry=False) from None
        except Exception:
            # Do not let the SDK log provider exception bodies or messages.
            raise CustomStreamError("Assistant is unavailable. Please try again.", allow_retry=False) from None
        if not text.strip():
            raise CustomStreamError("No reply received. Please try again.", allow_retry=False)
        item.content = [AssistantMessageContent(text=text)]
        yield ThreadItemDoneEvent(item=item)


def create_app(verifier=None, provider=None, store=None, allowed_owner=None):
    app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)
    store = store or MemoryStore()
    server = AssistantServer(store, provider or SimulatedProvider())
    active: set[str] = set()
    requests: dict[str, deque] = {}
    app.state.store, app.state.server, app.state.active = store, server, active

    def error(status, message):
        return JSONResponse({"error": message}, status_code=status, headers=HEADERS)

    @app.get("/api/chatkit/health")
    async def health():
        return JSONResponse({"provider": server.provider.mode, "history": "temporary"}, headers=HEADERS)

    @app.post("/api/chatkit")
    async def chat(request: Request):
        started, request_id = time.monotonic(), uuid.uuid4().hex
        authorization = request.headers.get("authorization", "")
        if not verifier:
            return error(503, "Assistant is not configured.")
        if not authorization.startswith("Bearer ") or len(authorization) > 8192:
            return error(401, "Sign in to use Assistant.")
        try:
            owner = await verifier.verify(authorization[7:])
        except AuthenticationError:
            return error(401, "Sign in again to use Assistant.")
        if allowed_owner is not None and owner != allowed_owner:
            return error(403, "Assistant is available only to the personal owner.")
        body = bytearray()
        async for chunk in request.stream():
            body.extend(chunk)
            if len(body) > 16384:
                return error(413, "Message is too large.")
        try:
            parsed = TypeAdapter(ChatKitReq).validate_json(bytes(body))
        except (ValidationError, ValueError):
            return error(400, "Invalid chat request.")
        if parsed.type not in ALLOWED:
            return error(400, "This feature is not available in this proof of concept.")
        params = parsed.params
        thread_id = getattr(params, "thread_id", None)
        try:
            if thread_id:
                record = store.record(thread_id, owner)
                if parsed.type in GENERATE and len(record.items) >= 98:
                    return error(429, "This conversation is full. Start a new chat.")
            if parsed.type in GENERATE:
                message = params.input
                if message.attachments or message.quoted_text or any(p.type != "input_text" for p in message.content):
                    return error(400, "Only typed text is supported.")
                text = "".join(p.text for p in message.content)
                if not text.strip() or len(text) > 2000:
                    return error(400, "Send between 1 and 2000 characters.")
                # A browser-selected model/tool must not override server configuration.
                if message.inference_options.model or message.inference_options.tool_choice:
                    return error(400, "Model and tools are configured on the server.")
            if owner in active:
                return error(429, "Wait for the current reply to finish.")
            now = time.monotonic()
            for uid in list(requests):
                while requests[uid] and requests[uid][0] <= now - 60:
                    requests[uid].popleft()
                if not requests[uid]:
                    del requests[uid]
            if parsed.type in GENERATE:
                recent = requests.setdefault(owner, deque())
                if len(recent) >= 10:
                    return error(429, "Please wait a minute before sending more messages.")
                store.purge()
                if parsed.type == "threads.create" and (len(store.records) >= 200 or sum(r.owner == owner for r in store.records.values()) >= 10):
                    return error(429, "Too many conversations. Wait for older chats to expire.")
                recent.append(now)
            active.add(owner)
            try:
                result = await server.process(bytes(body), owner)
            except BaseException:
                active.discard(owner)
                raise
            if isinstance(result, StreamingResult):
                async def stream():
                    try:
                        async for event in result:
                            yield event
                    except asyncio.CancelledError:
                        raise
                    except Exception:
                        event = ErrorEvent(code="custom", message="Conversation unavailable. Start a new chat.", allow_retry=False)
                        yield b"data: " + event.model_dump_json().encode() + b"\n\n"
                    finally:
                        active.discard(owner)
                        LOG.info("chat request=%s duration_ms=%d", request_id, (time.monotonic()-started)*1000)
                return StreamingResponse(stream(), media_type="text/event-stream",
                    headers={**HEADERS, "X-Accel-Buffering": "no", "X-Request-ID": request_id})
            active.discard(owner)
            return Response(content=result.json, media_type="application/json", headers=HEADERS)
        except OwnershipError:
            return error(403, "Conversation unavailable.")
        except NotFoundError:
            return error(404, "Conversation expired. Start a new chat.")
        except CapacityError:
            return error(429, "Conversation limit reached. Start a new chat later.")
        except Exception:
            LOG.info("chat request=%s error=internal", request_id)
            return error(503, "Assistant is unavailable. Please try again.")

    return app


def configured_app():
    project = os.environ.get("CHATKIT_FIREBASE_PROJECT")
    production = os.environ.get("CHATKIT_ENV") == "production" or bool(os.environ.get("K_SERVICE"))
    # A declared non-demo project must satisfy the production contract, even outside Cloud Run.
    production = production or bool(project and not project.startswith("demo-"))
    owner = os.environ.get("CHATKIT_OWNER_UID", "").strip()
    if production:
        if project != "lifebuckets-bd43d":
            raise ValueError("Production requires the declared LifeBuckets project")
        if any(value for key, value in os.environ.items() if "EMULATOR" in key):
            raise ValueError("Production refuses emulator configuration")
        if os.environ.get("CHATKIT_PROVIDER") != "openai" or os.environ.get("CHATKIT_MODEL") != "gpt-4.1-mini":
            raise ValueError("Production requires the approved provider and model")
        if not owner or len(owner) > 128 or not os.environ.get("OPENAI_API_KEY", "").strip():
            raise ValueError("Production requires owner UID and server credential")
    if not project:
        return create_app()  # Fails closed until launched with an explicit environment.
    mode = os.environ.get("CHATKIT_PROVIDER", "simulated")
    if mode not in {"simulated", "openai"}:
        raise ValueError("Unknown provider")
    provider = SimulatedProvider() if mode == "simulated" else OpenAIProvider(
        os.environ.get("OPENAI_API_KEY", ""), os.environ.get("CHATKIT_MODEL", ""))
    return create_app(FirebaseVerifier(project), provider, allowed_owner=owner if production else None)


app = configured_app()
