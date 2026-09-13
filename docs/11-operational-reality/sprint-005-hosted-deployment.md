# Sprint 005 — Hosted Deployment Evidence

Status: DEPLOYED; authenticated hosted microphone acceptance pending.
Date: 2026-09-13. Source: reviewed commit `a4026bb7cf3e46b08bff37a1c2e91146a7d89af5`.
Target: `lifebuckets-bd43d`; https://lifebuckets-bd43d.web.app/assistant.

## Candidate validation

- Node 24 production build and TypeScript checks passed.
- All 18 application unit tests passed.
- All 33 Python server tests passed with four existing ChatKit widget deprecation warnings.
- The existing large frontend chunk warning remains; it did not fail the build.

## Backend release

Cloud Build: `ad1f0689-35d1-4214-9fa2-75c0259e90d6`, status SUCCESS.
Image digest: `sha256:2dc594960d0c341318e3462ace18e48328fa754ff020df02008f5e31ca622ee5`.
Cloud Run revision: `lifebuckets-chat-00002-t8b`, ready and serving 100 percent of traffic.
The existing runtime identity, owner restriction, model, secret version, and scaling configuration were preserved.
Direct and Hosting-proxied health returned `openai/temporary`; anonymous POST returned HTTP 401.

## Frontend release

Hosting release: `sites/lifebuckets-bd43d/releases/1789271380259000`.
Hosting version: `sites/lifebuckets-bd43d/versions/d369e00b6623fead`.
Previous release: `sites/lifebuckets-bd43d/releases/1789236640206000`.
The authenticated hosted Assistant rendered “A conversation with GPT” and displayed the microphone control.

## Remaining acceptance

Pablo verifies hosted microphone permission, capture, editable transcription, explicit Send, and GPT response on phone or desktop.
No hosted audio request was sent by the deployment smoke check.
Merge to `dev`, branch cleanup, and promotion to `main` remain separate decisions.
