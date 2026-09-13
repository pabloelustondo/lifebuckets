# Sprint 004 — Hosted Deployment Evidence

Status: DEPLOYED AND ACCEPTED FOR DEV INTEGRATION.
Date: 2026-09-12. Source: reviewed commit 0d4ccfa86c8dd47f0f9c74129ee8e8f5e26f10c9.
Project/site: lifebuckets-bd43d (118747582700); Cloud Run region northamerica-northeast1.
Assistant: https://lifebuckets-bd43d.web.app/assistant

## Release identities

Cloud Build: 365aa0cb-12b5-454b-b292-8a4cf2987bf6, succeeded.
Cloud Run revision: lifebuckets-chat-00001-jq4, ready and receiving 100 percent of service traffic.
Image: northamerica-northeast1-docker.pkg.dev/lifebuckets-bd43d/lifebuckets-chat/server
Digest: sha256:90f9e3f1e6f981f94cd4f4a7e5c3be6e599cfe092079027026b6230160d857b3
Hosting version: 85633a9c18db043f; release 1789236640206000, 2026-09-12T18:10:40.206Z.
Previous Hosting version: 19ef15029c1f2c67; release 1789190879345000.
Backend URL: https://lifebuckets-chat-jkiva6x3za-nn.a.run.app

## Configuration and authority

Pablo linked billing and explicitly approved transfer of the existing API key to the named Secret Manager destination.
Secret lifebuckets-chat-openai version 1 is bound to OPENAI_API_KEY; its value was not logged or embedded in builds.
Runtime identity: lifebuckets-chat@lifebuckets-bd43d.iam.gserviceaccount.com, with access granted on that secret.
One Python worker, minimum zero, maximum one instance, concurrency eight; service/revision limits inspected live.
Registered only lifebuckets-bd43d.web.app in OpenAI's ChatKit domain allowlist after approved Platform sign-in.
The public domain key is in ignored hosted configuration; the permanent key stays server-side.
A first build submission returned permission denied immediately after API initialization.
Required caller permissions and service-agent initialization were verified; an unchanged retry succeeded without broader grants.

## Live checks observed

Direct backend and proxied Hosting health returned openai/temporary; anonymous chat POST returned 401.
The existing signed-in owner's Assistant loaded the actual ChatKit widget on the production domain.
Say hello returned a real GPT introduction; the next question correctly recalled the first request.
Responses finished successfully through Hosting; no claim of measured streaming latency is made.
Returning to the personal map worked and displayed 18 existing local color changes, still marked unsent.
No personal colors were edited, no local storage cleared and no rules/data migration performed during these checks.
Model remains gpt-4.1-mini; two bounded live smoke requests were sent. Exact billing was not measured.

## Human acceptance

Pablo exercised the hosted Assistant, confirmed real GPT responses and reported that all works well.
He explicitly requested the Sprint 004 merge into dev and branch closure on 2026-09-12.
Existing tabs may show the update-ready message; close all LifeBuckets tabs and reopen without clearing site data.
Chats remain temporary and may disappear after instance replacement, idle shutdown or refresh.
Dev integration and branch cleanup remain separate governance steps; no main promotion occurred.
This evidence remains proposed until Pablo commits it under the repository approval rule.
