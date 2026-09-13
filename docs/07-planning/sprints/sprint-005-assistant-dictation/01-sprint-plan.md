# Sprint 005 — Assistant Voice Dictation

Status: PROPOSED REVISION after implementation stop; no renewed Tasks or coding authority.
Baseline: remote and local dev at 25f6c42; original Plan approval is 90d3cb8.
Previous gate: Sprint 004 is in remote dev; its local and remote sprint branches are removed.

## Goal and user story

Let the signed-in user dictate text into the existing Assistant composer.
As Pablo, I can tap a microphone, speak, review or edit the transcription, and choose whether to send it.
Typed chat and the current server-side GPT conversation continue to work unchanged.

## Existing capability and approach

ChatKit exposes composer dictation, but the custom Python backend must implement `transcribe()`.
Use ChatKit's recorder UI and protocol; add only the required authenticated transcription adapter.
Keep the React/TypeScript browser and Python server boundary with the permanent API key server-side.
Process bounded audio ephemerally; add no audio or transcript persistence.

## Scope and exclusions

Enable dictation and accept authenticated `input.transcribe` requests through the existing endpoint.
Cover idle, listening, transcribing, permission-denied, unavailable and retry states.
Preserve editable text before send; dictation must never submit a message automatically.
Provide a usable typed-message fallback when dictation is unsupported or denied.
Validate MIME type and size, transcribe through the server provider, and sanitize failures.
Exclude continuous voice, spoken replies, wake words, history, Drive, Sheets, deployment, migration and main promotion.

## Acceptance criteria

- S005-AC01: On a supported browser, the composer offers a clearly labeled microphone control.
- S005-AC02: Starting dictation requests microphone access and visibly indicates the active state.
- S005-AC03: Recognized speech becomes editable composer text and is sent only by an explicit user action.
- S005-AC04: Denial, cancellation, silence and transcription failure leave typed chat usable with clear recovery.
- S005-AC05: Existing greeting, follow-up, New chat, offline handling and Life map return still pass.
- S005-AC06: Audio is bounded, authenticated and ephemeral; no recording or transcript enters storage or logs.
- S005-AC07: Phone and desktop checks record actual browser/device support and limitations.

## Verification and environment boundary

Test authenticated transcription routing, limits and sanitized provider failures with a simulated adapter.
Perform a deliberate real-device microphone check because simulated UI cannot prove capture or transcription.
Compare implementation screenshots with the approved mockup and run current app and Python regressions.
Any paid/provider request, hosted deployment or cloud change remains separately authorized and evidenced.

## UI design and next gate

The committed mockup shows microphone idle/listening, editable transcription, denial and typed fallback.
Revise Tasks to add the server transcription component only after Pablo commits this corrected Plan.
The existing Sprint 005 branch remains unused until corrected Tasks are separately committed and authorized.
