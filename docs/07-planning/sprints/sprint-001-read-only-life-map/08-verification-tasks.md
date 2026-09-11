# Sprint 001 — Verification and Handoff

Status: part of proposed [Tasks](05-sprint-plan-tasks.md).

## T09 — C-APP: acceptance and review build

Dependency: T08. Own root setup/configuration, route/shell integration, and e2e/ paths.
Complete browser coverage of S1-01 through S1-09; include source-image comparison and narrow/desktop screenshots.
Keep prerequisite installation separate from the normal isolated end-to-end run.
Provide setup, fixture reset, review-build, sign-in, trusted-device, offline, and cleanup instructions.
Prepare Firebase Hosting configuration placeholders without deploying or binding an unverified live target.
Run npm run typecheck, npm run test:unit, npm run test:rules, npm run build, and npm run test:e2e.
Repeat checks only for changes or unresolved failures; report unsupported environments honestly.
If a failure belongs to C-DATA, C-MAP, C-RULES, or C-FIXTURE, record an ordered correction for that component before editing it.
Do not report LB-011/future_writes or live deployment as passed.

## Evidence handoff — documentation only

Produce docs/09-build-and-test/sprint-001-delivered-scope.md and a linked test report with retained artifacts.
Reconcile every S1 acceptance ID, task, component, and changed file against approved scope.
Record exact commands, prerequisites/versions, environment, source commit and diff identity, observed outcomes, and unrun checks.
Include a clear local launch recipe and actual review-build location.
This documentation work changes no executable component.

## Independent review — separate reviewer

An independent reviewer reproduces the complete gate and checks scope, owner isolation, date semantics, cache cleanup, and contracts.
Record findings and unavailable checks under Review and Release; do not label implementer checks independent.
If no independent reviewer is available, mark review pending and hand off concrete reproduction instructions.
Pablo decides acceptance and any follow-up release actions.
No commit, push, merge, live deployment, or release is performed by the implementing agent.

## Completion limits

A runnable local build is the sprint deliverable; personal onboarding and live operation remain outside scope.
A failed mandatory acceptance check blocks acceptance and must stay visible in the handoff.
