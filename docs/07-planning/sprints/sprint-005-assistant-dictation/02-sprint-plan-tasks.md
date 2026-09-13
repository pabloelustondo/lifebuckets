# Sprint 005 — Corrected Implementation Tasks

Status: PROPOSED TASKS; no coding authority until Pablo reviews and commits this corrected file.
Approved corrected Plan: 8f95a35. Development baseline: dev at 8f95a35.
Authorization context: Pablo approved the correction and requested a new implementation branch.
Read the [Plan](01-sprint-plan.md) and [visual specification](../../../06-solution-design-and-architecture/mockups/assistant-dictation.md).

## T1 — Transcription provider

Component: provider adapter. Own only `server/provider.py`.
Add simulated deterministic transcription and bounded OpenAI audio transcription behind one safe provider method.
Return text only; apply timeout/cancellation and sanitize provider errors without logging audio or transcript.
Verify S005-AC03, AC04 and AC06 with isolated provider tests; stop if a new credential or dependency is required.

## T2 — Authenticated transcription transport

Dependency: T1. Component: ChatKit backend transport. Own only `server/app.py`.
Implement `AssistantServer.transcribe()` and admit only authenticated `input.transcribe` protocol requests.
Validate supported MIME types and a bounded decoded payload before provider work; never persist or log content.
Keep text-message limits and owner/rate protections intact; return sanitized recoverable failures.
Verify S005-AC03, AC04 and AC06 with backend request tests.

## T3 — Dictation composer

Dependency: T2. Component: Assistant UI.
Own only `app/features/assistant/AssistantChat.tsx` and `app/features/assistant/assistant.css`.
Enable ChatKit dictation while preserving typed input, explicit Send, offline behavior and existing navigation.
Use ChatKit's microphone/listening/transcribing states; retain typed fallback when denied or unsupported.
Verify S005-AC01 through AC05 against the approved phone and desktop mockups.

## T4 — Integrated proof

Dependencies: T1–T3. Component: Assistant verification.
Own only `server/tests/*`, `e2e/chatkit/*` and new `docs/09-engineering/sprint-005/*` evidence.
Test auth, MIME/size bounds, simulated transcription and sanitized failures without real audio retention.
Run typecheck, build, unit, Python and Assistant browser regressions; record any blocked unrelated gate.
Perform a deliberate real-device microphone check for capture, editable text and explicit send.
Verify S005-AC01 through AC07 and record browser/device versions and limitations.

## Branch and stop boundaries

After this file is committed, recreate `codex/sprint-005-assistant-dictation` from verified current dev.
Any audio persistence, custom recorder, spoken reply, new dependency or expanded data access returns to Plan review.
No paid live check or production deployment is implied; each requires separate concrete authorization.
