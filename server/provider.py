"""Text-only provider boundary: no identities, tokens, or lucket data cross it."""
import asyncio
from collections.abc import AsyncIterator


class ProviderUnavailable(Exception):
    """A safe public error. Never attach a provider response body."""


class SimulatedProvider:
    mode = "simulated"

    async def reply(self, messages: list[dict[str, str]]) -> AsyncIterator[str]:
        text = ("Hi! I'm your LifeBuckets assistant. This is a simulated reply for local testing. "
                "What would you like to talk about?") if len(messages) == 1 else (
                "I'm here to listen. This simulated follow-up confirms our conversation is connected.")
        for word in text.split(' '):
            await asyncio.sleep(0.025)
            yield word + ' '


class OpenAIProvider:
    mode = "openai"

    def __init__(self, key: str, model: str):
        from openai import AsyncOpenAI
        if not key or not model:
            raise ValueError("Server key and model are required")
        self.client = AsyncOpenAI(api_key=key, max_retries=0, timeout=30)
        self.model = model

    async def reply(self, messages: list[dict[str, str]]) -> AsyncIterator[str]:
        try:
            async with asyncio.timeout(30):
                async with self.client.responses.stream(
                    model=self.model,
                    instructions="You are the LifeBuckets assistant. Greet warmly, then respond briefly and helpfully. You have no access to the user's life map or personal data. Do not claim otherwise.",
                    input=messages,
                    max_output_tokens=256,
                    store=False,
                ) as stream:
                    async for event in stream:
                        if event.type == "response.output_text.delta":
                            yield event.delta
                    response = await stream.get_final_response()
                    if response.status != "completed":
                        raise ProviderUnavailable("The reply could not finish. Please try a shorter message.")
        except asyncio.CancelledError:
            raise
        except TimeoutError:
            raise ProviderUnavailable("The reply timed out. Please try again.") from None
        except ProviderUnavailable:
            raise
        except Exception:
            raise ProviderUnavailable("GPT is unavailable right now. Please try again.") from None
