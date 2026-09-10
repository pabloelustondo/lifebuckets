# Sprint 001 — Proposed Scope Decisions

Status: PROPOSED choices for Plan review; no open decision is marked approved.

## Authentication and initial data

Propose email/password sign-in for pre-provisioned accounts; no registration or account-management flow.
Local acceptance uses synthetic accounts in the Authentication emulator.
Fixture setup provisions owner records and an explicit older openDay; the application only reads business data.
A missing user record or openDay produces a deliberate setup-needed state outside the compact header.
Real account provisioning, first-date selection, and personal-data import remain separate work.
This provides a connected technical review build, not a completed personal onboarding flow.

## Indicators and interface context

Use null/unset values for unrecorded statuses; label them as condition/action not recorded.
Use separate clearly labeled synthetic examples to demonstrate yellow, red, blue, and green; do not invent final meanings.
Keep expanded categories in component memory for this sprint; cross-device or reload persistence is not promised.
Retain title, P avatar, and stored date as the map header; put sign-in/setup/cache feedback outside it.
Propose session/sign-out controls accessed through the avatar, without adding header items.

## Trusted device and session boundary

Ask whether to remember data on this trusted device before enabling persistent personal-data caching.
Without that choice, use session-only access and state that offline restart is unavailable.
On sign-out, stop owner subscriptions, remove rendered data, and clear persisted personal data before another owner opens it.
Coordinate other tabs; if cleanup is blocked, report it and prevent access to the previous owner's data.
Retain only the public application shell across sign-out; do not service-worker-cache personal responses.
An offline restart may reuse a persisted authenticated session; it must not manufacture a session or bypass owner isolation.
Immediate detection of server-side revocation while fully offline is not promised; reconcile on reconnect.

## Environment and release boundary

Propose LOCAL-EMULATOR using demo-lifebuckets, loopback endpoints, and synthetic data only.
The test command must fail closed rather than fall back to a live service.
lifebuckets-bd43d is a supplied future target; live identity and environment designation remain unverified.
No deployment, live provider/rules change, or real-data seed is authorized by this Plan.
Local account/fixture setup and local build validation are proposed sprint scope.

## Decisions carried forward

These choices propose bounded answers for OD-06 through OD-09 and OD-12.
OD-01 final semantics, OD-02–05 editing/closing, OD-10 live environment, and OD-11 real import remain deferred.
Approval of this Plan does not silently resolve those deferred decisions.
