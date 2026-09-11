# Sprint 001 — Sprint Plan Tasks

Status: PROPOSED; Pablo's separate commit is required before coding.
Approved baseline: commit 83f4e59 (Sprint Plan and governed dependencies).
The user requested Tasks definition and coding after committing the Plan; execution intent is recorded, but the Tasks commit gate still applies.

## Dependencies and execution

Read [Plan](01-sprint-plan.md), [scope](02-scope-decisions.md), [acceptance](03-acceptance.md), and [contracts](04-components-and-contracts.md) at the approved baseline.
This Tasks artifact includes [foundation tasks](06-foundation-tasks.md), [integration tasks](07-integration-tasks.md), and [verification tasks](08-verification-tasks.md).
After these documents are committed, create codex/sprint-001-read-only-life-map from the reviewed Tasks commit.
Do not create commits, push, merge, or deploy; implementation authority covers only approved local work.
Verify prerequisites before coding; unavailable infrastructure is an explicit blocker, never permission to substitute live services.

## Ordered component tasks

| ID | Component | Deliverable | Dependency |
| --- | --- | --- | --- |
| T01 | C-APP | Toolchain, route skeleton, isolated browser gate. | Approved Tasks |
| T02 | C-RULES | Owner-read policy and denied browser writes. | T01 |
| T03 | C-FIXTURE | Demo-only accounts, taxonomy, older day, edge cases. | T02 |
| T04 | C-DATA | Session and date-safe owner-read API. | T03 |
| T05 | C-MAP | Pure accessible map with all display states. | T04 |
| T06 | C-APP | Compose authenticated review flow and connected gate. | T05 |
| T07 | C-DATA | Trusted persistent data and coordinated cleanup. | T06 |
| T08 | C-APP | Public shell cache and true offline restart gate. | T07 |
| T09 | C-APP | Full browser acceptance and review build. | T08 |

Each task changes only its component's approved paths, plus its own evidence/documentation.
Reading other components and running integration checks is allowed; cross-component fixes become ordered component-specific correction tasks.
All command names in this package are intended deliverables, not commands proven to exist.

## Reporting and stop conditions

Track actual task state and changed files in a delivered-scope report under Build and Test.
Record tested revision plus working-diff identity, commands, environment, outputs, and remaining gaps.
After implementation, perform the [review handoff](08-verification-tasks.md); independent review is not implementer self-approval.
Stop affected work for scope/contract changes, live-target fallback, exposed owner data, or a required failed gate.
Revise and reapprove changed Tasks or Plan as required; do not silently absorb expanded scope.
