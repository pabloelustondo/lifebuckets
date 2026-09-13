# Sprint 004 — Review Handoff

Status: ACCEPTED FOR DEV INTEGRATION; hosted GPT and user journey passed.
Reviewer: implementing agent; no independent technical review or reviewer initials claimed.
Release commit: 0d4ccfa86c8dd47f0f9c74129ee8e8f5e26f10c9; date 2026-09-12.
Pablo reviewed/committed the candidate and authorized deployment and the exact server-key transfer.

## Validation before publication

[Hosted validation](../09-engineering/sprint-004/hosted-validation.md) records the candidate checks and then-open prerequisites.
Node 24 build/typecheck and 18 app unit tests passed; all 30 Python checks passed.
Three hosted-configuration tests and a real-widget recovery test passed without paid GPT calls.
The cloud upload excluded credentials/fixtures, and the local public-build scan found no server key.
The candidate added production owner authorization, container packaging and explicit release tooling.

## Hosted release

[Deployment evidence](../11-operational-reality/sprint-004-hosted-deployment.md) records revision, image and Hosting identities.
Billing was enabled by Pablo; cloud resources and secret binding were provisioned in the declared project.
Cloud Build succeeded; the Python container is running under the dedicated runtime identity.
Backend and proxied Hosting health passed; anonymous chat requests were rejected.
The production domain was registered for ChatKit, and Hosting was published with its public domain key.
Real GPT greeting and follow-up passed through the live Assistant under the existing owner session.
Map return worked; 18 existing local color changes remained visible and unsent.

## Acceptance and handoff

Pablo exercised the hosted Assistant, confirmed real GPT responses and reported that all works well.
He explicitly requested the Sprint 004 merge into dev and branch closure on 2026-09-12.
Temporary chats can disappear on refresh/restart; the deployed UI explains recovery with New chat.
Existing tabs may need to close and reopen to activate the new application shell; do not clear personal site data.
The [runbook](../09-engineering/sprint-004/hosted-runbook.md) retains release and rollback steps.
Review and commit this post-release evidence separately; no reviewer initials are entered.
Dev integration and local/remote branch cleanup remain distinct human-governed steps.
No main promotion, rules deployment or personal data migration occurred.
