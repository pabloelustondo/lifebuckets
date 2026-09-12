# ChatKit — Proposed Integration Design

Status: PROPOSED; affected interface contract for Sprint 004; [UI mockup](../../../06-solution-design-and-architecture/mockups/assistant-chatkit.md).
Current app: React 19.3.0, React Router 8.3.1, Firebase 12.19.0; one home route.
Firebase Hosting serves a static app; no application GPT endpoint or ChatKit package exists.

## Proposed flow

React ChatKit /assistant → authenticated POST /api/chatkit → ChatKit server → OpenAI model.
Use @openai/chatkit-react and its supported custom-server transport.
Browser supplies a current Firebase ID token to the LifeBuckets endpoint only.
Server verifies signature, expiry, issuer and audience for the declared LifeBuckets environment.
Derive owner identity from the verified token; never trust a user ID submitted by the browser.
Apply ownership to every thread load, update and streaming request; return no cross-user data.
No long-lived OpenAI key or Agent Builder workflow credential reaches the client.
Serve the protocol's streaming responses without buffering; JSON for nonstreaming operations.
Return 401 for unauthenticated, 403 for unauthorized, 429 for throttling, safe errors for failures.
No-store applies to chat responses; service worker must exclude API traffic and credentials.

## Runtime proposal

Current OpenAI guidance directs new apps to a self-hosted ChatKit server integration.
The documented server SDK is openai-chatkit (Python), with Agents SDK streaming helpers.
Propose a small isolated Python service rather than hand-writing ChatKit protocol in Node.
Retain React/TypeScript frontend; the existing app does not need a backend rewrite.
AI Shop's Node Firebase Functions implementation is a pattern reference, not ChatKit protocol support.
Confirm this runtime choice before Tasks; investigate an official Node server path if Node is required.
For this local proof, run a single process with an owner-scoped in-memory thread store and TTL.
Clear browser thread identity on reload/sign-out; expire server memory after 30 minutes.
No durable-history claim; a later hosted release must explicitly decide storage and scaling.

## Component boundaries

Assistant UI: route, ChatKit lifecycle, composer, stream/error presentation and return navigation.
Session bridge: exposes fresh Firebase token and sign-out changes without exposing permanent secrets.
Backend transport: token verification, owner context, limits and protocol dispatch.
Provider adapter: model/prompt configuration, bounded generation, cancellation and sanitized errors.
Composition: local startup/proxy, configuration, dependency locks and build exclusions.
Verification: mock-provider contracts, existing app regressions and separate real-provider evidence.

## AI Shop patterns to reuse

Authenticate before provider work; separate request handling, services and provider adapter.
Inject provider/config dependencies for tests; no paid provider calls in the default emulator suite.
Read secrets only in server runtime; configure model and limits independently of frontend assets.
Use request IDs, durations and error classes for diagnostics without logging tokens or chat bodies.
Do not copy AI Shop keys, identities, region, prompts, database collections, roles or approval history.

Sources checked 2026-09-12: [ChatKit](https://developers.openai.com/api/docs/guides/chatkit),
[custom server](https://developers.openai.com/api/docs/guides/custom-chatkit).
