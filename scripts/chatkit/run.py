"""Explicit local launcher. Only the Python process loads provider credentials."""
import argparse
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--provider", choices=["simulated", "openai"], default="simulated")
    parser.add_argument("--model")
    args = parser.parse_args()
    if args.provider == "openai":
        if not args.model:
            parser.error("Choose the approved live-test model with --model")
        from dotenv import load_dotenv
        load_dotenv(ROOT / ".env.local", override=False)
        if not os.environ.get("OPENAI_API_KEY"):
            parser.error("Server credential is not configured")
    # Local runner never connects to a real Firebase project.
    os.environ["CHATKIT_FIREBASE_PROJECT"] = "demo-lifebuckets"
    os.environ["FIREBASE_AUTH_EMULATOR_HOST"] = "127.0.0.1:9099"
    os.environ["CHATKIT_PROVIDER"] = args.provider
    os.environ["CHATKIT_MODEL"] = args.model or ""
    import uvicorn
    uvicorn.run("server.app:app", host="127.0.0.1", port=8001, access_log=False)
