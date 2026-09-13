# Assistant Dictation Visual Specification

Status: PROPOSED for Sprint 005 review. The mockup is simulated and proves no microphone or GPT behavior.
Source: Sprint 005 Plan and the deployed Sprint 004 Assistant.

## Review artifacts

- [Interactive mockup](assistant-dictation.html)
- [Desktop listening state](assistant-dictation-desktop-listening.png)
- [Phone editable-transcript state](assistant-dictation-phone-transcript.png)

## Intended interaction

The existing composer gains a microphone button immediately before Send.
Idle text says that tapping the microphone starts dictation.
Listening uses a restrained red control and explicit status; tapping again stops capture.
Completed speech appears as editable composer text and never sends automatically.
Permission denial shows a recoverable message while leaving typed input available.
Unsupported browsers retain the typed composer without promising dictation.

## Review checks

Confirm button placement, active-state visibility, status wording and touch size.
Confirm the transcript is visibly editable and Send remains a separate deliberate action.
Confirm denial/failure does not replace or disable typed messaging.
Implementation must use actual ChatKit states where available and record any visual deviation.
