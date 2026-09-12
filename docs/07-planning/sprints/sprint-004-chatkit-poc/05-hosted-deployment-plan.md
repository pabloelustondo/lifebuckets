# Sprint 004 — Hosted Deployment Plan

Status: PROPOSED; extends the approved local proof following Pablo's deployment request.
Review and commit this Plan before drafting separate deployment Tasks or changing cloud resources.
Existing [production declaration](../../../11-operational-reality/production-environment.md) remains authoritative.

## Outcome

Serve the reviewed Assistant page at the existing LifeBuckets production URL, with real server-side GPT.
Preserve Google sign-in, personal map data, local color edits and existing offline map behavior.
Do not seed accounts/data, change Firestore rules, or introduce tools, uploads or color synchronization.

## Exact infrastructure

Project/site: lifebuckets-bd43d; project number 118747582700, verified ACTIVE on 2026-09-12.
Hosting: https://lifebuckets-bd43d.web.app; new route /assistant.
Proposed Cloud Run service: lifebuckets-chat, region northamerica-northeast1 (Montréal).
Proposed runtime identity: lifebuckets-chat@lifebuckets-bd43d.iam.gserviceaccount.com.
Use a Python container with one worker, max one instance, min zero, and bounded request concurrency.
Enable Cloud Run, Cloud Build, Artifact Registry and Secret Manager only in this project.
Create a dedicated Artifact Registry repository; retain the image digest. These APIs are not enabled yet.

## Hosted contracts and safeguards

Hosting rewrites /api/chatkit and /api/chatkit/** to Cloud Run before the existing SPA fallback.
Keep Firebase bearer verification; additionally require the verified personal owner's UID server-side.
Resolve the existing owner's UID read-only; do not create or modify an Auth account.
Public HTTP reachability supports Hosting; authenticated owner checks guard every paid chat operation.
Cloud runtime refuses emulator variables, simulated mode and missing owner/model/key configuration.
Bind the existing authorized key through Secret Manager as OPENAI_API_KEY, never a build argument.
Grant the runtime identity accessor permission on that secret only; no Firestore write role is needed.
Register the exact Hosting domain with ChatKit; build with its public VITE_CHATKIT_DOMAIN_KEY.
Reject hosted builds without that public key or with a local API target.
Retain gpt-4.1-mini, 2000 input characters, 256 output tokens and a 30-second generation timeout.
Retain per-owner rate/concurrency limits and bounded memory; do not add durable chat storage.
A restart, rollout or scale-to-zero loses chats; the UI must explain this and offer New chat.
The OpenAI call sends conversation text; Montréal hosting is not a claim of OpenAI data residency.
Cloud execution and ongoing GPT use incur usage charges; the earlier US$0.10 covered local tests only.

## Verification and release gate

Approve separate Tasks, implement hosted safeguards, validate, then Pablo commits the final candidate.
Record prior Hosting release; deploy the backend first and test rejected unauthenticated requests.
Publish Hosting only after backend readiness; record image digest, Cloud Run revision and Hosting release.
Pablo checks Google sign-in, a real greeting/follow-up, map return and retained local edits on desktop/phone.
If live checks fail, restore prior Hosting/revision; never delete user data or clear local storage.
No merge or promotion to main is included; agents never commit, push, merge or delete branches.

Sources: [Hosting/Cloud Run](https://firebase.google.com/docs/hosting/cloud-run) (60-second Hosting timeout),
[secret binding](https://docs.cloud.google.com/run/docs/configuring/services/secrets).
