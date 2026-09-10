# Sprint 001 — Acceptance and Evidence

Status: planned acceptance, not test results.
Requirement IDs refer to the [catalogue](../../../08-specifications-as-code/requirements.md).

| ID | Required observable result | Traceability |
| --- | --- | --- |
| S1-01 | Exact seven categories and 49 luckets; independently expand Work and Life, collapse one, retain context. | LB-001–002 |
| S1-02 | At 320px and desktop, no horizontal clipping; full-width rows order ID, square, circle, name, details; long text wraps. | LB-003–005 |
| S1-03 | Independent outlined indicators with accessible labels; keyboard expansion, aria-expanded, visible focus; compact header only. | LB-005–007 |
| S1-04 | Seeded older openDay survives midnight, reload, reconnect, skipped days, and time-zone/clock change. | LB-008–009 |
| S1-05 | After trusted online load, terminate/reopen browser context offline: shell, owner hierarchy, and unchanged date remain usable. | LB-010 |
| S1-06 | Loading, empty owner, missing day, errors, unsupported/evicted cache, and session-only mode are honest; never invent data. | LB-008, LB-010 |
| S1-07 | Emulator sign-in and own reads succeed; unauthenticated/cross-owner reads fail; all browser business-data writes fail. | LB-012 |
| S1-08 | Sign-out/account switching and multi-tab cleanup cannot expose the previous owner's data, including offline reopening. | LB-012 |
| S1-09 | Reproducible install/build/end-to-end instructions, lockfile, configuration placeholders, review build, and evidence exist. | SDLC2 gates |

## One-command gate

Proposed command: npm run test:e2e; it does not exist yet.
It starts isolated Authentication/Firestore emulators, seeds synthetic owners/rows, builds and serves the app, and runs browser checks.
Use the real application composition and Firebase browser SDK; emulator services are explicitly simulated edges.
Use a demo project and reject live endpoints/credentials; fail visibly on missing prerequisites.
Return a nonzero status on failure, retain diagnostic artifacts, and clean up processes.
Document prerequisite downloads; normal runs must not contact live application infrastructure.
Use a persistent browser profile for offline restart, not merely a page reload with networking disabled.
The first vertical increment establishes this gate; subsequent work extends the same command.

## Required evidence

Record revision and uncommitted diff identity, runtime versions, environment, fixtures, exact commands, and actual outcomes.
Include narrow/desktop screenshots and manual keyboard/accessibility observations.
Use emulator ownership checks and targeted date/grouping tests alongside whole-system browser checks.
Compare the UI against the source guide's actual images during implementation; text-only reconstruction is insufficient visual evidence.
Independent review reproduces the gate; disclose unavailable browser/platform checks.

## Deferred coverage

LB-011 and scenarios tagged future_writes are not implemented or reported as passed.
LB-009 proves date-safe reading here; stale concurrent writes and close-day conflicts remain deferred.
First-ever uncached offline access requires connectivity and is not promised.
No local test result establishes live deployment or production acceptance.
