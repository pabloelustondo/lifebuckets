# Sprint 001 — Component Boundaries and Contracts

Status: PROPOSED catalogue and interface intent; approve before component-scoped Tasks.
Paths below are proposed ownership boundaries, not existing files.

## Components

| ID | Responsibility | Owned paths |
| --- | --- | --- |
| C-APP | Build, route composition, public shell, service-worker lifecycle, local gate orchestration. | Root package/config files; app/root.tsx; app/routes.ts; app/routes/; app/shell/; public/; e2e/ |
| C-MAP | Compact screen, rows, indicators, keyboard behavior, in-memory expansion. | app/features/life-map/ |
| C-DATA | Firebase client initialization, session lifecycle, owner reads, date-safe view model, persistent-data cleanup. | app/data/ |
| C-RULES | Owner read policy and deny browser business-data writes. | firestore.rules; firestore.indexes.json; tests/rules/ |
| C-FIXTURE | Synthetic emulator accounts, hierarchy and explicit date provisioning. | scripts/fixtures/ |

Colocated unit tests belong to their component; documentation follows the decision/evidence area it describes.
Cross-component validation may observe every component; each implementation task modifies only one component's files.

## Intended interfaces

- C-APP → C-DATA: configure local/live endpoints explicitly, request session/trusted-device initialization, observe session/data state, request sign-out.
- C-DATA → C-APP: session state and asynchronous cleanup outcome; blocked cleanup prevents owner switching.
- C-APP → C-MAP: render owner view with explicit openDay, ordered hierarchy rows, and loading/empty/error/cache state.
- C-MAP → C-APP: request session actions; expansion stays local. C-MAP never invokes Firebase.
- C-DATA → Firebase SDK: subscribe to users/{uid} and luckets filtered by ownerId equal to authenticated UID.
- C-RULES → those reads: enforce UID ownership independently of client filtering; deny all client business-data writes this sprint.
- C-FIXTURE → emulators: privileged synthetic provisioning only after loopback/demo-target verification; no browser write capability.
- C-APP shell cache: public static assets only; owner data and credentials are never cached as HTTP responses.

## Data and failure semantics

The [data proposal](../../../06-solution-design-and-architecture/data-model.md) defines row fields and explicit hierarchy depths.
The view carries date-only openDay or a missing-day state, independent condition/action values, and each action's explicit date.
A mismatched actionDay must not be shown as the open day's action; expose unavailable action-for-day instead.
Unknown status values are reported as unknown; do not infer final color meanings.
Distinguish loading, ready, empty, missing-day, unauthenticated, error, and cache-unavailable states.
Expose cache provenance and connectivity separately; cached data does not prove recent server contact.
Rejected reads, malformed records, and failed cleanup remain actionable errors; never silently fabricate replacement records.
Task design may refine TypeScript names, but changes to ownership, date semantics, or interface behavior require explicit contract revision.
