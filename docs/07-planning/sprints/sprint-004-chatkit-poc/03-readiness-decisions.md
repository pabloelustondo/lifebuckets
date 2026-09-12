# Sprint 004 — Readiness Decisions

Status: PROPOSED; resolve these before committing the final Plan and drafting Tasks.

## Runtime and contract

Recommended: official Python ChatKit server SDK plus React bindings; confirm before Tasks.
AI Shop uses Node 22 Firebase Functions with server-side Responses API requests.
Its provider adapter cannot be substituted directly for a ChatKit protocol endpoint.
Do not assume the hosted-workflow session/client-secret approach from the supplied spec.
Current official guidance reserves that approach for existing Agent Builder workflows.
Verify exact ChatKit package versions and peer compatibility before locking implementation Tasks.

## Credentials and live proof

No OpenAI key was read, copied, provisioned or used during this planning pass.
Before API implementation, decide whether to reuse an authorized LifeBuckets key or create one.
Use the credential setup workflow; never paste a key into chat or commit it.
Select an available GPT model and a small explicit live-test budget before paid validation.
Proposed limits: 2000 characters per message, 256 output tokens, one concurrent run per user,
10 requests per minute per user and a 30-second generation timeout; validate SDK support.
Local test credentials/emulator tokens must never be accepted by a future production backend.

## Hosting and baseline

This sprint proves local integration; production resource creation needs separate authority.
Before any hosted release, declare service identity, region, runtime, secret binding and storage.
Do not inherit AI Shop's environment or deployment configuration.
Local dev has not incorporated Sprint 003 in the observed refs; verify current remote before branching.
Pablo performs merges and commits; agents do not move dev or merge sprint branches.

## Inspected AI Shop reference files

server/src/firebase.js: Firebase Functions entry, secret binding and lazy service construction.
server/src/firebase-vista-token-verifier.js: server verification of Firebase tokens.
server/src/firebase-agent-handler.js: injected services/provider and safe unconfigured behavior.
server/src/firebase-agent-config.js: emulator isolation and revision metadata.
server/src/openai-analyzer.js: server-only provider call, configuration and error handling.
firebase.json: Hosting-to-function routing pattern, not a LifeBuckets deployment template.
All references were inspected read-only in /Users/paboelustodo/-PROJECTS/aishop.
