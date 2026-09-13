# Sprint 004 — Local Review

Implementation is ready for local review; acceptance and deployment remain pending.
Approved Tasks: a2a4fdd. Branch: codex/sprint-004-chatkit-poc.
Remote dev verified at 02a01ab; the old Sprint 003 branch is absent locally and remotely.

## Try it

Two terminals, from the repository root:

```sh
npm run local
```

```sh
npm run chat:server
```

Open http://127.0.0.1:4173 and sign in with the synthetic account:
`owner@example.test` / `review-only-123`. Select Assistant, then Say hello.
The default server clearly labels its replies as simulated; it makes no OpenAI calls.
Return to Life map to check that local color edits remain intact.
A refresh, New chat, or leaving Assistant starts a fresh conversation.
Server conversations expire after 30 minutes and disappear when its process stops.

## First-time Python setup

```sh
python3 -m venv server/.venv
server/.venv/bin/python -m pip install -r server/requirements.lock
```

Python 3.12–3.14 is supported by the project configuration; tested here with 3.14.6.
React ChatKit 1.6.1 and Python ChatKit 1.6.5 are pinned; React peer compatibility was checked.
The UI loads the official ChatKit CDN, so its first load requires internet access.

## Real GPT check — passed

The credential is configured in ignored `.env.local`; only Python reads it for provider work.
Pablo approved a US$0.10 live-test budget. The greeting and San Martín follow-up passed.
The current local process uses real GPT. To restart that mode, stop the simulated server:

```sh
npm run chat:server -- --provider openai --model gpt-4.1-mini
```

This still uses synthetic Firebase accounts and binds only to loopback.
Real GPT was verified locally; no production deployment has been performed.
See [validation](validation.md) for results and remaining checks.
