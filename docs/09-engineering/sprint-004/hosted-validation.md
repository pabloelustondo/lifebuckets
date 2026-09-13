# Sprint 004 — Hosted Candidate Validation

Status: implementation proposal after Tasks commit 3991f2c; no cloud publication.
Date: 2026-09-12. Reviewer: implementing agent; no independent review claimed.

## Implemented

- Production requires the exact project, approved model/provider, owner UID and server credential.
- Missing/invalid authentication returns 401; another authenticated owner returns 403 before protocol/provider work.
- Missing threads return 404; New chat clears the error and recovers; temporary-history copy explains restarts.
- Container runs one non-root Python worker, binds PORT and uses a verified immutable Python 3.14.6 base image.
- Build uploads allow only five server modules, lockfile, Dockerfile and two ignore files; no credentials or fixtures.
- Hosting routes the exact ChatKit API and subpaths to Montréal Cloud Run before the SPA fallback.
- Hosted builds reject missing/local domain keys and alternate API endpoint configuration.
- Deployment steps verify project/owner/billing and refuse cloud mutation without an exact clean reviewed commit.
- Secret transfer uses stdin, numeric version binding and secret-scoped access; no key enters image arguments.

## Passed locally

- Node 24.21.0: typecheck, application build and 18 existing unit tests.
- Python: 30 tests, including production refusal, owner gating and restart recovery.
- Node configuration checks: 3 tests, including missing domain key and wrong-target refusal.
- Real ChatKit browser recovery check: simulated backend on port 8002; expired conversation, New chat, 390/1440 layouts.
- [Phone evidence](hosted-recovery-390.png) and [desktop evidence](hosted-recovery-1440.png).
- Public-build credential scan and `git diff --check`; cloud upload allowlist inspected.
- Python base manifest verified to include linux/amd64; Dockerfile pins the returned digest.

## Reproduce

Run `server/.venv/bin/python -m pytest server/tests -q` and `node --test e2e/chatkit/production-config.test.mjs`.
Use Node 24 for `npm run typecheck`, `npm run build` and `npm run test:unit`.
For browser recovery, keep the demo Auth/Firestore emulators and preview server running.
Start a separate simulated backend with the exact demo project/Auth emulator on port 8002.
Run `CHATKIT_HOSTED_CHECK=1 PLAYWRIGHT_BROWSERS_PATH=.cache/browsers npx playwright test e2e/chatkit/hosted.spec.ts`.
The recovery spec routes only its browser requests to port 8002; it does not use the live GPT process.

## Remaining release evidence

Read-only verification confirmed the existing enabled production owner; billingEnabled=False for lifebuckets-bd43d.
The registered production ChatKit domain key is absent; no placeholder was written into hosted configuration.
No local Docker executable is installed; the final container build must be verified in Cloud Build after billing/provisioning.
Production image execution, Cloud Run IAM, proxy streaming, live owner chat and physical phone keyboard remain unverified.
The production-config test checks syntax only; it does not prove domain registration.
No additional paid GPT calls, rules changes, account creation, data seeding or cloud mutation occurred.
Existing full browser/rules evidence is retained from the local implementation; only affected recovery checks reran here.
Initial sandbox-only build failed to bind the prerender server; rerunning with local server permission passed.
The initial browser attempt lacked the default browser cache; rerunning with the project's existing cache passed.
See [release handoff](../../10-review-and-release/sprint-004-review.md) for the next gate.
