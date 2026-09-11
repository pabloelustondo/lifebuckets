# Sprint 002 — Local Color Editing Evidence

Implementation date: 2026-09-11. Baseline: `4d3611a`; branch `codex/sprint-002-local-color-editing`.
Implementation remains an uncommitted working diff; no merge, release, or deployment is claimed.

## Delivered behavior

- Condition squares and action circles open a five-color palette: blue, green, white, yellow, red.
- The current choice is marked; labels name colors without importing legacy urgency rankings.
- Condition saves `status`; action saves `actionStatusDay` and the explicitly open business date.
- Independent local overrides appear after a successful local write; incoming Firestore reads retain them.
- Trusted-device mode persists owner-scoped versioned records in localStorage. Session-only mode uses memory.
- One atomic local record stores pending values, original base values, mutation IDs, revisions, and edit timestamps.
- The existing Web Locks session mutex serializes changes and cleanup; storage events refresh other tabs.
- No synchronization worker or server write was added. Firestore still denies client business-data writes.
- Pending local changes are disclosed; sign-out asks before discarding them and clears them with device data.
- Missing openDay disables action editing. Quota errors retain the previous saved choice; corrupt local data remains untouched and editing is disabled.

## Verification

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passed |
| `npm run test:unit` | 14 tests passed in 3 files |
| `npm run build` (inside browser gate) | Passed |
| `npm run test:e2e` | 18 tests passed, including 7 new color-editing scenarios |
| `npm run test:rules` | 3 tests passed |
| `git diff --check` | Passed |

The browser gate started isolated loopback emulators under `demo-lifebuckets`, seeded synthetic users, and shut them down afterward.
Existing Sprint 001 browser assertions were retained; screenshots now go to Sprint 002 evidence to preserve historical artifacts.
New browser coverage includes five choices, independent properties, current marking, keyboard selection/cancel/focus return, narrow-screen fit, offline browser restart, reconnect refresh, concurrent tabs, owner cleanup, session-only lifetime, quota failure, missing date, and malformed local storage.
A request monitor observed no Firestore Write/Commit requests during palette edits; deny-write rules were separately exercised.
Session integration is exercised through real browser/emulator tests rather than new mocked session unit tests.
An initial run found lost focus after Escape. Closing the native dialog before returning focus fixed it; the full rerun passed.
The 320px palette screenshot was visually inspected for visible labels, current-choice marking, and viewport fit.

## Evidence and limits

- [Browser log](sprint-002-evidence/browser-run.log)
- [Rules log](sprint-002-evidence/rules-run.log)
- [Tested source hashes](sprint-002-evidence/source-sha256.txt)
- [Mobile palette](sprint-002-evidence/palette-320.png)
- Additional map and offline screenshots are in `sprint-002-evidence/`.

This is implementer verification, not independent review or human acceptance.
No remote backup exists: browser storage removal or confirmed device cleanup discards unsynchronized changes.
The future synchronization process must still define server conflicts, delivery retries, and acknowledgement.
Long suspended-tab timing and arbitrary storage failure combinations were not exhaustively tested.

## Try locally

Run `npm run local`, then open http://127.0.0.1:4173/.
Use synthetic `owner@example.test` / `review-only-123`; select “Remember data on this trusted device” to retain local edits after restart.
Expand a category and click a square or circle. The footer reports local changes not sent to the server.
