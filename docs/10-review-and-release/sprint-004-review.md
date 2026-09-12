# Sprint 004 — Review Handoff

Status: LOCAL PROOF REVIEWED; NOT READY FOR PRODUCTION DEPLOYMENT.
Reviewer: implementing agent; no independent technical review or reviewer initials claimed.
Baseline: a2a4fdd plus the current uncommitted implementation; date 2026-09-12.
Pablo reviewed real GPT behavior in the supplied Borges screenshot and requested review/commit/deploy.

## Review scope and evidence

Inspected session-token retrieval, custom fetch, SDK dispatch, ownership, provider, store and local proxy.
The local flow uses actual React ChatKit and Python SDK streaming; no lucket data reaches GPT.
[Validation](../09-engineering/sprint-004/validation.md) records tests and known limitations.
Real GPT greeting and follow-up were visually verified; credential stays outside Git and the public build.
Build, typecheck, 18 unit tests and all 19 existing browser regressions pass on Node 24.21.0.
Python tests cover auth, owner isolation, limits, expiry, cancellation and safe provider failures.
No blocking defect identified for the approved local demonstration.

## Production blockers

1. Hosting has no Python endpoint: the current launcher binds loopback and forces the demo environment.
2. Cloud deployment configuration, runtime identity and secret binding are not implemented or approved yet.
3. Production must restrict paid chat to the personal owner; a valid project token alone is insufficient.
4. The production ChatKit domain key is not configured; the UI deliberately refuses hosted activation.
5. Memory-only history requires explicit restart/scale-to-zero behavior and a single-instance rollout policy.
6. A physical phone keyboard check and hosted owner acceptance remain unverified.

These are release prerequisites, not claims that the locally reviewed page is already hosted.
See the [hosted deployment Plan](../07-planning/sprints/sprint-004-chatkit-poc/05-hosted-deployment-plan.md).
Pablo's Plan commit precedes separate deployment Tasks; their commit precedes infrastructure implementation.

## Commit handoff

All implementation, tests, screenshots, review evidence and the proposed deployment Plan are staged together.
Secrets, Python virtual environment, installed dependencies and generated builds remain ignored.
Suggested message: `Implement Sprint 004 ChatKit proof and plan hosted deployment`.
Pablo performs the commit. This commit does not close the sprint or assert deployment acceptance.
