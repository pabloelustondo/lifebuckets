# Sprint 004 — Review Handoff

Status: HOSTED CANDIDATE IMPLEMENTED; NOT DEPLOYED OR ACCEPTED IN PRODUCTION.
Reviewer: implementing agent; no independent technical review or reviewer initials claimed.
Baseline: implementation aab5081 and approved hosted Tasks 3991f2c; date 2026-09-12.
Pablo requested deployment; this handoff covers the resulting uncommitted release candidate.

## Review scope and evidence

Local React ChatKit/Python GPT behavior was previously reviewed with real replies.
The hosted candidate adds production owner authorization, container packaging and explicit release tooling.
[Hosted validation](../09-engineering/sprint-004/hosted-validation.md) records checks, screenshots and limitations.
Node 24 build/typecheck and 18 app unit tests pass; all 30 Python checks pass.
Three hosted-configuration tests and one real-widget browser recovery test pass without paid GPT calls.
The cloud upload excludes credentials/fixtures; the public build does not contain the authorized server key.
The container base manifest/digest is verified, but the final container has not been built or run.

## Remaining publication prerequisites

1. Pablo reviews and commits these release changes, preserving the exact-candidate gate.
2. Billing is disabled for lifebuckets-bd43d; Pablo must enable it with the intended account.
3. Register the exact production ChatKit domain and configure the public domain key.
4. Verify provisioning authority, then build/run the container and validate cloud permissions and secret binding.
5. Publish backend before Hosting; record revision/digest and prior/current Hosting releases.
6. Verify hosted owner chat, proxy streaming, map/local edits and physical phone keyboard.

These are remaining release prerequisites; a local build does not prove hosted behavior.
The [runbook](../09-engineering/sprint-004/hosted-runbook.md) provides separate preflight/provision/backend/hosting steps.
The [hosted Plan](../07-planning/sprints/sprint-004-chatkit-poc/05-hosted-deployment-plan.md) and Tasks retain authority boundaries.

## Handoff

No cloud mutation, paid GPT test, account creation, rules deployment or data migration occurred in this candidate work.
Pablo's commit approves the exact review; the agent never commits, pushes or merges.
Suggested commit message: `Prepare Sprint 004 owner-only Cloud Run deployment`.
After prerequisites, existing deployment authorization covers the declared resources and release checks.
No main promotion, previous-branch cleanup or sprint closure is implied by implementation or deployment.
