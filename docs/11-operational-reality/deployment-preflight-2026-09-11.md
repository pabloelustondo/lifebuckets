# LifeBuckets — Deployment Preflight

Date: 2026-09-11. Read-only inspection; nothing deployed or provisioned.
User requested deployment after trying the local review build.

## Verified target

- Project: lifebuckets-bd43d, display name LifeBuckets, ACTIVE.
- Project number: 118747582700.
- Existing Hosting site: lifebuckets-bd43d.
- Hosting address: https://lifebuckets-bd43d.web.app.
- Registered Firebase apps: none returned by apps:list.
- Database inspection returned 403: Firestore API unused or disabled.
- No database existence, region, or contents could be verified.
- TEST versus production designation is awaiting the user's decision.

## Repository state

Implementation is staged but not committed; HEAD remains b967e41.
The app hardcodes demo-lifebuckets and loopback emulator endpoints.
It rejects non-local browser hosts and labels sign-in as synthetic local review.
Current fixtures are deliberately emulator-only and must not be pointed at live infrastructure.
Publishing the current build would not provide a working hosted application.

## Required preparation

See the [deployment scope proposal](../07-planning/sprints/sprint-001-read-only-life-map/09-deployment-scope-proposal.md).
Resolve the environment and data boundary before provisioning a database or account.
Keep emulator verification separate from hosted smoke tests.
Do not record local testing or the user's successful local trial as hosted acceptance.
