# Local Color Editing — Proposed Contracts

Status: PROPOSED; reviewed with the Sprint 002 Plan.

## Components

- Life map UI: accessible palette, independent shape triggers, saving/error feedback.
- Local data module: owner-scoped edits, persistence, pending records, and view projection.
- Session integration: active owner, trusted-device policy, snapshot overlay, and cleanup.
- Verification: local storage, browser editing, offline reload, isolation, and no server writes.

## UI to local data

Operation: `setLocalColor({rowId, field, color, openDay})` returns a local-save result.
The session supplies owner identity; UI input cannot select another owner.
`field` is `status` or `actionStatusDay`; color is one of the seven palette values.
Validate row ownership/existence and ensure the active session has not changed before saving.
For action edits, require a valid openDay matching the current view and save actionDay with it.
Condition changes have no date dependency and must not modify action fields.
Failure leaves the last successfully saved view intact and returns a visible error.

## Local persistence and pending changes

Use a versioned owner-scoped local store; persist only under trusted-device consent.
Session-only mode uses an in-memory store; clearly disclose its lifetime.
Each pending record contains mutationId, ownerId, rowId, field, value, base value, and editedAt.
Action records additionally contain actionDay; retain distinct records across different days.
Use a monotonically advancing local revision for ordering; timestamps do not choose the business day.
Commit the override and pending record atomically, then publish the updated view.
Serialize concurrent tab writes and notify tabs after committed changes.
Re-editing the same field/day may coalesce to the latest value while preserving its original base value.
Future sync may read pending changes; this sprint neither transmits nor acknowledges them.

## Projection and session lifecycle

Project local overrides over each incoming server view, keyed by owner and stable row ID.
Apply action overrides only to their matching openDay; do not erase edits for another day.
Retain pending edits for temporarily absent rows without recreating rows in the visible hierarchy.
Extend the status parser for white/purple/black; unknown server values remain unknown.
On storage failure, avoid replacing readable server data with a misleading empty local state.
Owner changes detach listeners and in-memory state before another owner can render.
Explicit sign-out/device cleanup clears local edits as well as the existing cache.
Warn that pending local changes will be discarded and permit cancellation before cleanup starts.
Interrupted cleanup must remain retryable and continue to block account switching.

## Compatibility

Firestore remains read-only; no SDK writes are used as a local persistence shortcut.
This adds a client overlay, not a migration of server records or the legacy Sheets architecture.
Server conflict resolution, retries, acknowledgement, and deployment require a later approved contract.
