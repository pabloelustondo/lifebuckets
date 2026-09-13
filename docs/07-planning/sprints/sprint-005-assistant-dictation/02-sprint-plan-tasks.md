# Sprint 005 — Implementation Tasks

Status: ON HOLD; discovery proved the custom backend requires a transcription contract outside this scope.
Approved Plan commit: 90d3cb8. Development baseline: dev at 90d3cb8.
Authorization context: Pablo requested implementation after committing the Plan; Tasks approval remains a separate gate.
Read the [Plan](01-sprint-plan.md) and [visual specification](../../../06-solution-design-and-architecture/mockups/assistant-dictation.md).

## T1 — Assistant dictation UI

Dependency: approved visual specification. Component: Assistant UI.
Own only `app/features/assistant/AssistantChat.tsx` and `app/features/assistant/assistant.css`.
Enable ChatKit composer dictation and preserve the established authenticated chat boundary.
Expose usable idle/listening/transcription/denial or fallback behavior supported by ChatKit.
Keep dictated text editable and require explicit Send; typed chat must always remain usable.
Verify S005-AC01 through AC06 with typecheck, build and focused component/browser checks.
Stop if ChatKit cannot satisfy the approved interaction without a new audio/backend contract.

## T2 — Assistant regression and device proof

Dependency: T1. Component: Assistant verification.
Own only `e2e/chatkit/*` and new `docs/09-engineering/sprint-005/*` evidence.
Extend deterministic UI checks for enabled dictation and typed fallback without faking real capture success.
Run app unit/browser regressions and Python server tests; compare phone/desktop screenshots with the mockup.
Perform a deliberate real-device microphone check for permission, speech-to-text, editing and explicit send.
Verify S005-AC01 through AC07; record browser/device versions, limitations and exact results.
Stop on credential exposure, automatic sending, loss of typed input, or unexplained regression.

## Integration and boundaries

Order is T1 then T2; each task changes exactly one approved component.
No server/provider/store, Firebase data, deployment configuration or LifeBucket synchronization change is allowed.
No paid/provider call or production deployment is implied; deployment requires separate concrete authorization.
Any custom recorder, transcription endpoint, new dependency or contract change returns to Plan review.
After Pablo commits these Tasks and mockups, create `codex/sprint-005-assistant-dictation` from current verified dev.
