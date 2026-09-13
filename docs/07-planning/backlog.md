# Product Backlog

Status: PROPOSED. This backlog records candidate work; it is not an approved Sprint Plan or Tasks document.
Updated: 2026-09-12.

## Proposed sprint sequence

| Candidate | Goal | User-visible outcome | Key dependency |
| --- | --- | --- | --- |
| [Sprint 005](sprints/sprint-005-assistant-dictation/01-sprint-plan.md) | Voice dictation in the Assistant chat box | The user can dictate a message, review the transcription and send it to GPT. | Browser/device microphone permission and a chosen transcription approach. |
| Sprint 006 | User Google Drive access | The signed-in user can explicitly connect Google Drive and the server can access only the approved resources. | OAuth consent, minimum scopes, token storage and disconnect/revocation design. |
| Sprint 007 | LifeBuckets UI-to-server-to-Sheets synchronization | LifeBucket changes made in the UI reach the server and update the designated Google Sheet. | Approved Sheet mapping, ownership, conflict handling, retry/error states and Sprint 006 authorization. |

## Backlog definitions

### Voice dictation

Add a microphone control to the existing Assistant composer. Dictation creates editable input; it does not send automatically. The Sprint Plan must define supported browsers, permission denial, recording state and accessibility behavior. Because this changes UI, it requires a reviewed mockup before Tasks are finalized.

### Google Drive connection

Add an explicit connection flow for the current LifeBuckets user. The Sprint Plan must identify the exact Drive/Sheets scopes, server-side credential handling, approved files, disconnect behavior and hosted acceptance evidence. Broad account-wide access is not assumed.

### LifeBuckets synchronization

Define a server-owned synchronization contract between local LifeBucket changes and one approved Google Sheet. The Sprint Plan must specify data mapping, direction of sync, batching, idempotency, offline queue behavior, conflicts, visible pending/error states and recovery. No personal data migration is implied by this backlog entry.

## Promotion into a sprint

Select one candidate, resolve its blocking decisions and draft a dedicated Sprint Plan from verified `dev`. Pablo commits the approved Plan before Tasks are drafted; implementation begins only after the separate Tasks approval and explicit authorization.
