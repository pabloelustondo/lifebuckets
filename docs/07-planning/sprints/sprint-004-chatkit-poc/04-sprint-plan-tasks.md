# Sprint 004 — Implementation Tasks

Status: PROPOSED for Pablo's review; no coding or deployment authorized by this document.
Approved baseline: 7fa6d60. Branch: codex/sprint-004-chatkit-poc, from dev at 02a01ab.
Read [Plan](01-sprint-plan.md), [design](02-integration-design.md), [readiness](03-readiness-decisions.md) and [mockup](../../../06-solution-design-and-architecture/mockups/assistant-chatkit.md).
Goal: open Assistant, ask GPT to say hello, and send one follow-up.

## 1. Make it runnable locally — Composition

Own: package.json/package-lock.json, vite.config.ts, server/pyproject.toml and lockfile, scripts/chatkit/*, .gitignore, e2e/serve.mjs and e2e/build-shell.mjs.
Add locked dependencies, ignored server configuration, startup and an unbuffered /api/chatkit proxy.
Support direct /assistant navigation; exclude chat API traffic from the offline cache and client build secrets.
Done: local startup/build works; the proxy streams and chat responses are never cached.

## 2. Reuse sign-in safely — Session bridge

Own: app/data/client.ts. Depends on 1.
Expose a current Firebase ID token; reject session changes during retrieval. Reuse sign-out notifications.
Done: valid session supplies a token; signed-out/changed sessions cannot send a request.

## 3. Generate GPT replies — Provider adapter

Own: server/provider.py. Depends on 1 and authorized credential setup before API implementation.
Stream only conversation/greeting context with server-only key/model configuration, output/time limits and cancellation.
Done: simulated replies stream; timeout/provider errors are sanitized, with no token or chat-body logging.

## 4. Accept authenticated chat — Backend transport

Own: server/app.py, server/auth.py and server/store.py. Depends on 1 and 3.
Implement POST /api/chatkit through the Python SDK; verify Firebase tokens before calling the provider.
Keep threads owner-scoped in memory with a 30-minute expiry; enforce the design's limits and errors.
Done: greeting/follow-up work; invalid tokens and cross-owner access fail; no lucket database access.

## 5. Build the Assistant page — Assistant UI

Own: app/routes.ts, app/routes/home.tsx, app/routes/assistant.tsx and app/features/assistant/*. Depends on 2 and 4.
Follow the approved mockup with React ChatKit, Say hello, composer and New chat.
Add return navigation, streaming/loading/error/offline states; reset chat on re-entry, reload and sign-out.
Done: usable at 320px, 390px and desktop; returning to the map preserves pending local colors.

## 6. Prove the complete flow — Verification

Own: server/tests/*, e2e/chatkit/* and docs/09-engineering/sprint-004/* evidence. Depends on 1–5.
Test auth/ownership, expiry, limits, cancellation, streaming and failures with a simulated provider.
Run typecheck/build, existing unit/browser/rules regressions; check the phone keyboard and save screenshots.
Separately prove a real GPT greeting/follow-up using an authorized key, model and small test budget.
Done: record commands/results and unresolved gaps; Pablo reviews the working page before acceptance.

Before coding: resolve readiness, commit Tasks and changed dependencies, finish branch cleanup, authorize implementation.
Keep each task within its component; contract/scope changes return to review. Deployment needs separate authorization.
