"""Firebase verification, isolated to the explicitly declared environment."""
import asyncio
import os
import uuid

import firebase_admin
from firebase_admin import auth


class AuthenticationError(Exception):
    pass


class FirebaseVerifier:
    def __init__(self, project: str):
        emulator = os.environ.get("FIREBASE_AUTH_EMULATOR_HOST")
        if not project:
            raise ValueError("Declare CHATKIT_FIREBASE_PROJECT")
        if project.startswith("demo-"):
            if project != "demo-lifebuckets" or emulator != "127.0.0.1:9099":
                raise ValueError("Use the exact local LifeBuckets Auth emulator")
        elif emulator:
            raise ValueError("Emulator tokens must never be accepted for a live project")
        self.app = firebase_admin.initialize_app(options={"projectId": project}, name="chat-" + uuid.uuid4().hex)

    async def verify(self, token: str) -> str:
        try:
            claims = await asyncio.to_thread(auth.verify_id_token, token, app=self.app)
            return claims["uid"]
        except Exception:
            raise AuthenticationError("Sign in again to use Assistant.") from None
