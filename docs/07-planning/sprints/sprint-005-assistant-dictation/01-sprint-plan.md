# Sprint 005 — Assistant Voice Dictation

Status: PROPOSED PLAN; no Tasks or implementation authority. Pablo selected voice dictation from the backlog.
Baseline: remote and local dev at 34f9ff7 after Sprint 004 PR #3.
Previous gate: Sprint 004 is in remote dev; its local and remote sprint branches are removed.

## Goal and user story

Let the signed-in user dictate text into the existing Assistant composer.
As Pablo, I can tap a microphone, speak, review or edit the transcription, and choose whether to send it.
Typed chat and the current server-side GPT conversation continue to work unchanged.

## Existing capability and approach

The installed ChatKit React integration already exposes composer dictation and currently disables it.
Use that supported capability first; do not build a separate recorder or transcription service unless validation blocks it.
Keep the current React/TypeScript browser and Python server boundary.
The LifeBuckets server adds no audio storage, transcript persistence, or new model endpoint in this sprint.

## Scope and exclusions

Enable dictation in the existing Assistant composer and explain microphone permission when needed.
Cover idle, listening, transcribing, permission-denied, unavailable and retry states.
Preserve editable text before send; dictation must never submit a message automatically.
Provide a usable typed-message fallback when dictation is unsupported or denied.
Exclude continuous voice conversation, spoken GPT replies, wake words, audio uploads and chat history.
Exclude Drive access, Sheets synchronization, deployment, data migration and main promotion.

## Acceptance criteria

- S005-AC01: On a supported browser, the composer offers a clearly labeled microphone control.
- S005-AC02: Starting dictation requests microphone access and visibly indicates the active state.
- S005-AC03: Recognized speech becomes editable composer text and is sent only by an explicit user action.
- S005-AC04: Denial, cancellation, silence and transcription failure leave typed chat usable with clear recovery.
- S005-AC05: Existing greeting, follow-up, New chat, offline handling and Life map return still pass.
- S005-AC06: No permanent credential or recorded audio is added to LifeBuckets storage or logs.
- S005-AC07: Phone and desktop checks record actual browser/device support and limitations.

## Verification and environment boundary

Extend the existing Assistant browser suite for enabled/fallback/error states without real microphone automation.
Perform a deliberate real-device microphone check because simulated UI cannot prove capture or transcription.
Compare implementation screenshots with the approved mockup and run current app and Python regressions.
Any paid/provider request, hosted deployment or cloud change remains separately authorized and evidenced.

## UI design and next gate

Create a reviewable mockup plus phone and desktop images under the approved mockups folder.
Show microphone idle/listening, editable transcription, permission denial and typed fallback.
Pablo commits this Plan first; only then may mockup/design work and separate Tasks be finalized and approved.
