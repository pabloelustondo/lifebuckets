# Sprint 004 — Hosted Release Runbook

Status: prepared commands; cloud execution awaits a clean reviewed candidate and enabled billing.
Target: lifebuckets-bd43d, northamerica-northeast1, Cloud Run service lifebuckets-chat.
Use the project virtual environment and Node 24; no Docker Desktop is required for Cloud Build.

## Prerequisites

Pablo enables billing for this project using the intended billing account; no billing account is selected automatically.
Register lifebuckets-bd43d.web.app for ChatKit and place its public domain key in ignored .env.hosted.
The permanent API key remains in ignored .env.local until the authorized Secret Manager transfer.
Pablo reviews and commits the candidate; the agent must not commit, push or merge.
Required operator access covers the declared APIs, builds, registry, service account, secret and Hosting release.
The script stops on denied permissions; do not grant broad roles speculatively.

## Explicit steps

Use `server/.venv/bin/python scripts/chatkit/deploy.py STEP --owner-email APPROVED_EMAIL`.
`preflight` only reads project, billing and the existing owner; it never creates accounts.
For each mutation step append `--execute --commit FULL_REVIEWED_SHA`.
The exact full SHA must equal HEAD on the clean Sprint 004 branch.

1. `preflight`: verify target, billing and existing personal account.
2. `provision`: enable declared APIs; prepare dedicated registry/runtime identity/secret; securely transfer the existing key.
3. `backend`: build the allowlisted image, deploy by digest with min zero/max one, verify health and anonymous rejection.
4. `hosting`: validate/build actual hosted configuration, save prior release, publish Hosting only, check proxied health/auth.

Ignored .env.chatkit-release.json records candidate, owner UID, secret version, build/image/revision and Hosting releases.
It contains no API key. Preserve it for retry and rollback review; changing candidates requires reviewing its state.
Domain registration is a separate Platform step; the script does not create a domain key.

## Acceptance and rollback

Check owner Google sign-in, real greeting/follow-up, streaming through Hosting and phone keyboard.
Check map navigation, existing local edits, offline map behavior and temporary-chat recovery.
Anonymous rejection alone does not establish live owner acceptance.
Record live release IDs and actual checks in operational evidence before calling the sprint deployed/accepted.
For an existing backend, restore saved revision traffic if necessary; for a first backend, restore Hosting to remove its use.
Restore the saved previous Hosting release via Firebase's release history when needed.
Never delete personal data, clear browser storage or change rules to repair a release failure.
Do not promote main or close the sprint until its distinct governance gates are met.
