# Sprint 004 — ChatKit Greeting Proof of Concept

Status: Plan committed in 7fa6d60; runtime/baseline updates below await review and commit.
Input: Pablo requests a new React ChatKit page with a real greeting from server-side GPT.
The supplied first-iteration spec is guidance; its voice and attachment scope is deferred.
Baseline: dev and recorded origin/dev at 02a01ab include the Sprint 003 merge.
Before coding, refresh remote state and finish the previous-sprint branch cleanup gate.
Current branch: codex/sprint-004-chatkit-poc, descended from dev at 02a01ab.

## Goal

Prove one authenticated conversation from LifeBuckets through ChatKit to GPT and back.
The browser renders the UI; a LifeBuckets server owns authentication and OpenAI calls.
Model inference occurs on OpenAI infrastructure, not in the browser or on our Firebase host.

## User experience

Add an Assistant link and a separate /assistant page, with a clear return to the life map.
Follow the [visual mockup](../../../06-solution-design-and-architecture/mockups/assistant-chatkit.md): neutral styling, conversation and bottom composer.
Offer a Say hello starter that sends a real request; GPT returns a short friendly greeting.
Allow a typed follow-up and streamed reply; do not present static welcome copy as live GPT output.
Show loading, unavailable/offline, expired-authentication and recoverable provider errors.
Start a fresh chat on page reload/re-entry; explain that this proof does not retain chat history.

## Scope and dependencies

Read [integration design](02-integration-design.md) and [readiness decisions](03-readiness-decisions.md).
Reuse Firebase sign-in and session identity without changing lucket data or local color storage.
Add the smallest ChatKit-compatible backend; reuse AI Shop boundary patterns, not its domain code.
Keep permanent OpenAI credentials server-side; use no tools, uploads or LifeBuckets context.
Local demo uses synthetic users; a separately configured live-provider smoke proves real GPT.
No paid API request or new cloud resource is created during planning.

## Acceptance and evidence

Authenticated user reaches Assistant, requests a greeting and sees a streamed model response.
One follow-up works; return navigation preserves LifeBuckets and pending local colors.
Missing/invalid tokens and cross-owner thread requests are rejected server-side.
No permanent secret appears in bundles, browser storage, responses or logs.
Refresh starts a fresh conversation; errors and offline states remain usable.
Verify 320px, 390px and desktop layout; inspect the composer with a phone keyboard.
Run existing regressions plus isolated auth/stream/error tests with a simulated provider.
Record a distinct authorized live-provider greeting test, versions, screenshots and limitations.
No lucket reads are sent to GPT and no domain writes occur.

## Exclusions and next gate

No dictation, attachments, Realtime voice, agent actions, durable chat history or server color sync.
No production deployment, cloud provisioning, branch merge, or credential reuse from AI Shop.
Review and commit [Tasks](04-sprint-plan-tasks.md) and changed dependencies; explicitly authorize coding.
