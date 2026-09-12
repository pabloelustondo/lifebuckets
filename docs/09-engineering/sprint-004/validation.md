# Sprint 004 — Validation Evidence

Date: 2026-09-12. Implementation working tree on approved baseline a2a4fdd.
Environment: local demo-lifebuckets Auth/Firestore emulators; synthetic accounts only.
Provider: simulated, through the actual Python ChatKit SDK and React ChatKit CDN widget.

## Passed

- `npm run typecheck` and `npm run build`.
- `npm run test:unit`: 18 existing unit tests.
- `npm run test:chat`: 10 Python tests, including greeting/follow-up streaming, auth rejection,
  owner isolation, unsupported inputs, request/message/rate limits, expiry, safe provider errors,
  timeout recovery, concurrent-run rejection, cancellation cleanup, and live/emulator separation.
- Existing browser suite: 18 app/color tests plus the matrix test (19 total).
- Existing Firestore ownership rules: 3 tests; all business writes remain denied.
- New browser integration: greeting, follow-up, New chat, reload, offline draft preservation,
  320/390/1440px layout and pending local color preservation when returning to the map.
- Actual Firebase emulator verification runs behind the browser flow; test tokens stay local.
- The configured OpenAI key is absent from every public build file; `.env.local` is Git-ignored.
- Direct `/assistant` navigation serves the SPA; chat API responses use no-store.

Browser command: `PLAYWRIGHT_BROWSERS_PATH=.cache/browsers npx playwright test e2e/chatkit/assistant.spec.ts`.
Matrix and rules runs also declare `GCLOUD_PROJECT=demo-lifebuckets`,
`FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099`, `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080`.
Both local review and simulated chat server must be running for the integration command.
Historical Sprint 003 screenshots produced by regressions were restored from pre-run copies.

## Corrections during validation

A follow-up exposed mixed timezone-aware/naive SDK timestamps; store ordering now compares timestamps.
The phone layout initially left unused space; the chat now fills the available viewport height.
Screenshot capture now waits for the CDN widget's message-entry animation after response completion.
An initial browser selector was corrected; a matrix run missing emulator variables was rerun successfully.
The sandbox blocked Vite's loopback preview server; the build passed with approved local-server access.

## Remaining evidence

Real GPT greeting/follow-up passed using gpt-4.1-mini after explicit US$0.10 test authorization.
See live-result.json and assistant-live-phone.png. The final browser check made two requests.
Diagnostic greeting retries remained within the budget; token charges are not measured by this harness.
An initial network-event assertion missed replies; the final check validates rendered messages instead.
A physical phone keyboard check and Pablo's UI acceptance have not been performed.
Independent review, commits, merge and deployment remain separate gates.
Follow-up review: build, typecheck and 18 unit tests passed on supported Node 24.21.0.
All 19 existing browser regressions also passed on Node 24.21.0.
The matrix rerun required deleting its leftover synthetic Auth fixture before recreating it.
Python reports upstream ChatKit widget deprecation warnings; no application test failures remain.
Production domain registration, service identity, durable storage/scaling and hosting are out of scope.
