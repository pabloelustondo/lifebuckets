# Sprint 001 — Integration Tasks

Status: part of proposed [Tasks](05-sprint-plan-tasks.md).

## T05 — C-MAP: accessible read-only map

Dependency: T04. Own app/features/life-map/ and colocated tests.
Render the typed view passed by C-APP; no direct Firebase or credential access.
Implement compact title/P/date header, dark category rows, lighter full-width lucket rows, independent expansion, and wrapping.
Keep ID → square → circle → name → details; preserve codes, outlines, keyboard controls, aria-expanded, and visible focus.
Render independent null/unknown/synthetic labels honestly; do not invent final status semantics.
Provide explicit state views and session-action callbacks through the avatar; business-data editing is absent.
Inspect actual source-guide illustrations before styling; record any unavailable visual reference as a gap.
Verify: npm run test:unit for meaningful expansion/label behavior; T06 supplies browser viewport and keyboard evidence for S1-01–03.

## T06 — C-APP: compose connected review

Dependency: T05. Own route/shell composition and e2e/ paths.
Connect C-DATA to C-MAP with sign-in, trusted-device choice, and session action routing outside the compact map header.
Until T07, persistent choice must clearly be unavailable rather than falsely promising offline restart.
Extend test:e2e to start emulators, invoke fixture provisioning, sign in, load the complete owner hierarchy, and inspect the real UI.
Check 320px/desktop layout, dual expansion, header, labels, date stability, and missing/empty/error states.
Use the real Firebase browser SDK and emulator services; do not mock internal data operations.
Verify: npm run typecheck, npm run build, npm run test:e2e; record S1-01–04, S1-06–07 coverage and remaining gaps.

## T07 — C-DATA: trusted persistence and cleanup

Dependency: T06. Own app/data/ and colocated tests.
Enable persistent authenticated session and Firestore caching only after the explicit trusted-device choice.
Keep session-only mode truthful; expose cache provenance independently of connectivity.
On sign-out, immediately remove access to the old view, stop subscriptions, coordinate tabs, terminate persistence users, and clear personal caches.
Block owner switching when cleanup is incomplete; report actionable failure and recovery without exposing old data.
Suppress late old-owner callbacks; reconcile server rejection or revoked access when connectivity returns.
Verify: targeted tests for old-owner callback suppression, state transitions, and cleanup failure; T08 verifies real multi-tab/restart behavior.
Record S1-05–06 and S1-08 evidence boundaries; mock success alone cannot establish persistent cleanup.

## T08 — C-APP: cached shell and offline gate

Dependency: T07. Own public shell/service-worker composition, root configs, and e2e/.
Connect trusted persistence to the UI and cache only versioned public application assets; exclude personal HTTP responses.
Prevent stale shell/version mismatches from silently serving incompatible code; show available update/error states without changing openDay.
Use a persistent browser profile: load online, close the browser, reopen offline, and verify owner rows and unchanged date.
Test session-only mode, evicted/missing cache, unavailable persistence, sign-out/account switching, and blocked multi-tab cleanup.
Verify: npm run build and npm run test:e2e; retain actual restart and cleanup evidence for S1-05–06 and S1-08.
A reload-only check cannot substitute for the required restart.
