# Sprint 002 — Implementation Tasks

Status: PROPOSED; separate human commit required before coding.
Plan baseline: `9db0ba3`; user confirmed five colors and authorized proceeding.
Dependencies: [Plan](01-sprint-plan.md) and [corrected contracts](02-components-and-contracts.md).
Execution branch: `codex/sprint-002-local-color-editing` (already created).

## Ordered tasks
### T01 — Local data module
Owned paths: `app/data/model.ts`, new `app/data/local-colors.ts`, and their unit tests.
Define a shared five-color type/list; preserve null and unknown as distinct read states.
Implement versioned owner-scoped storage and in-memory session mode behind the same operations.
Store overrides and pending metadata in one atomic record; serialize trusted writes with Web Locks.
Preserve the original base value across repeated edits; advance revision and mutation identity.
Project condition independently and action only for the matching explicit openDay.
Expose load, edit, pending-read, change-subscription, and cleanup operations for session integration.
Validate stored records; surface failed or malformed storage without silently resetting pending data.
Verify coalescing, day isolation, white/null distinction, owner isolation, and failure preservation.

### T02 — Session integration (after T01)
Owned paths: `app/data/client.ts` and session-specific unit tests.
Expose `setLocalColor` using active authenticated ownership, existing rows, and current openDay.
Load local data before publishing ready views and overlay every incoming Firestore snapshot.
Reject edits from expired sessions; coordinate writes and cleanup to prevent stale-tab resurrection.
Publish pending count and storage errors; refresh trusted tabs after local storage notifications.
Clear pending data in the existing retryable device-cleanup lifecycle; reset session-only state.
Verify snapshot refresh, owner switching, cleanup races, and failed saves through this interface.

### T03 — Life map UI (after T02)

Owned paths: `app/features/life-map/**`.
Replace lucket indicators with accessible palette triggers; keep category expansion unchanged.
Offer exactly blue, green, white, yellow, red, labeled by name with current selection marked.
Support keyboard selection, Escape/outside dismissal, focus return, and mobile positioning.
Call the supplied edit callback; show busy/error feedback and close only after a successful save.
Disable action editing without openDay; preserve condition editing and independent fields.

### T04 — Session integration UI (after T03)

Owned paths: `app/routes/home.tsx`, `app/shell/base.css`.
Connect the edit callback and pending status; distinguish device persistence from session memory.
Warn before discarding pending edits on sign-out; cancellation must leave the session unchanged.

### T05 — Verification (after T04)

Owned paths: `e2e/**`, `docs/09-build-and-test/sprint-002-*`.
Extend the existing browser gate for both palettes, five choices, independent saves, and keyboard/mobile use.
Prove trusted reload/offline restart, session-only lifetime, snapshot refresh, multi-tab edits, and cleanup isolation.
Assert no server writes; run typecheck, build, unit, Firestore rules, and browser suites.
Record actual results and failures; do not claim sync, deployment, independent review, or acceptance.
