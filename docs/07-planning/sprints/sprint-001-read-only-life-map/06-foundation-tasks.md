# Sprint 001 — Foundation Tasks

Status: part of proposed [Tasks](05-sprint-plan-tasks.md).
Allowed paths are those in [component contracts](04-components-and-contracts.md); no task borrows another component's files.

## T01 — C-APP: scaffold and gate

Dependency: approved Tasks commit. Own root package/config files, route/shell/public paths, and e2e/.
Verify Node/package manager, Java/emulator prerequisites, browser tooling, and compatible stable package versions.
Scaffold client-rendered React Router framework mode, TypeScript, Vite, Tailwind, and the lockfile.
Create npm run build, npm run typecheck, npm run test:unit, npm run test:rules, and npm run test:e2e entry points.
Build a minimal real route and a non-interactive browser gate that serves the built app and returns PASS/FAIL.
Configure demo-lifebuckets and loopback-only emulator endpoints; reject live targets and missing prerequisites.
At this stage the gate proves only the shell; record unimplemented S1 gates explicitly.
Verify: npm run typecheck, npm run build, npm run test:e2e; record walking-skeleton results for S1-09.

## T02 — C-RULES: read-only owner policy

Dependency: T01. Own firestore.rules, firestore.indexes.json, and tests/rules/.
Permit authenticated reads of users/{uid} only for that UID and lucket reads only for matching ownerId.
Deny every browser business-data create/update/delete and all unmatched paths.
Test own document/query success, unfiltered query denial, unauthenticated/cross-owner denial, and denied writes including owner writes.
Verify: npm run test:rules against isolated emulators; retain cases and actual results for S1-07.

## T03 — C-FIXTURE: repeatable synthetic provisioning

Dependency: T02. Own scripts/fixtures/.
Read the approved taxonomy; seed seven category rows and 49 luckets per normal owner with stable synthetic identities.
Provision synthetic accounts, an explicit older openDay, null statuses, and separately labeled illustrative colors.
Include separate empty-owner, missing-day, malformed-row, and mismatched-action-day cases.
Require exact demo project and loopback endpoints before privileged access; never load live credentials or production identities.
Use deterministic fixture reset scoped to the demo environment; preserve the taxonomy source as a specification.
Verify: fixture runner rejects a non-demo target before network access and confirms expected owner-scoped counts/date through emulator readback.
Evidence supports S1-01, S1-04, S1-06, and S1-07.

## T04 — C-DATA: session and read model

Dependency: T03. Own app/data/ and colocated tests.
Expose typed initialize, email/password sign-in, observe-session, observe-owner-view, and sign-out operations under the approved contract.
Initially use nonpersistent data/session behavior; persistent mode arrives in T07.
Subscribe only after authenticated identity is established; tear down old-owner listeners before identity changes.
Parse explicit hierarchy/date fields; distinguish invalid records, empty hierarchy, missing user/day, denied reads, and loading.
Suppress an action whose actionDay differs from openDay; never derive a replacement business date from the clock.
Verify: npm run test:unit covers date-only parsing/formatting across zones, grouping, invalid hierarchy, and action-date mismatch.
Connected SDK behavior is exercised by T06; record that dependency rather than claiming integration already passed.
