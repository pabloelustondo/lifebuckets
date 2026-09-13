# Sprint 004 — Hosted Deployment Tasks

Status: PROPOSED for Pablo's separate review and commit; no cloud changes performed yet.
Approved [deployment Plan](05-hosted-deployment-plan.md): aab5081; working tree verified clean.
Branch: codex/sprint-004-chatkit-poc. Target: lifebuckets-bd43d (118747582700); retain the [component boundaries](02-integration-design.md).

## D01 — Restrict the hosted endpoint — Backend transport

Own: server/auth.py and server/app.py. Depends on this Tasks commit.
Require production project/provider/model/key/owner UID; reject emulator settings and other UIDs before provider work.
Resolve the existing production owner's UID read-only; never create or modify accounts.
Done: missing/invalid tokens return 401; authenticated non-owner returns 403; owner can chat.

## D02 — Explain temporary hosted chats — Assistant UI

Own: app/features/assistant/*. Depends on D01's contract.
Keep the approved layout; explain restart-related history loss. Retain New chat, recovery, domain-key validation and local-color preservation.
Done: expired/lost conversations give a usable recovery path; phone and desktop remain usable.

## D03 — Prepare the deployable package — Composition

Own: server/Dockerfile, .dockerignore, .gcloudignore, scripts/chatkit/*, scripts/check-production.mjs, firebase.json, package.json/package-lock.json and ignored hosted configuration.
Package Python for one worker on the runtime PORT; exclude keys, fixtures and development environments.
Prepare explicit Cloud Run/registry/service-account/secret setup for Montréal in the declared project.
Require the registered public ChatKit domain key; add API rewrites before the existing SPA fallback.
Done: reproducible container/build, no embedded credentials, validated target and unbuffered API routing.

## D04 — Validate the release candidate — Verification

Own: server/tests/*, e2e/chatkit/* and docs/09-engineering/sprint-004/*. Depends on D01–D03.
Test production configuration refusal, owner authorization, streaming, expiry, errors and domain-key checks.
Run supported Node 24 build/typecheck and affected regressions; retain existing real-GPT evidence.
Done: record results and gaps; Pablo reviews and commits all release changes before publication.

## D05 — Provision and publish — Composition

Own: declared cloud resources, secret binding, domain registration and Hosting/Cloud Run releases.
Depends on D04 and a clean, committed final candidate; deployment authority is Pablo's current request.
Verify cloud authority/billing; create only the Plan's APIs, registry, service account and secret if absent.
Transfer the existing authorized key securely; grant accessor on that secret only; never log its value.
Register lifebuckets-bd43d.web.app with ChatKit; record the public key outside source secrets.
Deploy one-worker Cloud Run with max one instance/min zero; save revision/digest and prior Hosting release.
Publish Hosting only after backend readiness; record both identities. Never deploy rules or seed data.

## D06 — Verify the hosted release — Verification

Own: docs/09-engineering/sprint-004/*, docs/10-review-and-release/* and docs/11-operational-reality/*.
Depends on D05. Verify unauthorized rejection, owner chat, map return, local edits and phone keyboard.
Record actual evidence and outstanding human checks; roll back release assets if necessary, never user data.
No agent commit/merge/push, main promotion or sprint closure is implied by these Tasks.
