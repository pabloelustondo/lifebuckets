# Sprint 002 — Local Color Editing

Status: PROPOSED. Human commit approval is pending.

## Goal and user intent
Select a condition or action color directly from a lucket and save it locally.
The user requested implementation on 2026-09-11; another process will send changes to the server later.
This extends Sprint 001, which explicitly excluded editing.

## Scope
- Clicking a condition square or action circle opens a labeled palette for that lucket.
- Offer blue, green, white, yellow, red show the current choice.
- Save condition to `status`; save action to `actionStatusDay` with the explicit `actionDay`.
- Update the displayed lucket immediately after successful local storage.
- Retain unsynchronized changes across reloads on trusted devices; session-only accounts use memory.
- Preserve local overrides when Firestore read snapshots arrive.
- Store pending changes separately from server data for a future synchronization process.
- Show local-only/pending status; never claim a server save.
- Preserve owner isolation and clear local edits during explicit device cleanup.

## Exclusions
No server writes, synchronization worker, deployment, points, weekly editing, date advance, or closing.
No automatic relationship between condition and action, color ranking, or action completion.
White is an explicit chosen color; null remains unrecorded.

## Acceptance

- Selecting either shape changes only the corresponding property of the selected lucket.
- Keyboard and touch users can open, choose, cancel, and return focus to the trigger.
- Escape/outside click cancels; the palette fits narrow screens and long lucket names.
- An action selection uses openDay, never today's clock date; no openDay disables action editing.
- Trusted-device selections survive reload and offline restart; session-only edits remain in memory.
- Server snapshots do not erase pending local selections; other owners never receive them.
- Storage failures show an error and do not claim success or discard a prior saved selection.
- Sign-out cleanup removes local pending changes and explains this consequence before confirmation.
- Existing read-only behavior, account isolation, and Firestore deny-write rules remain verified.
- Tests prove local edit/reload/offline behavior and that editing issues no server write.

## Dependencies and risks

Review [contracts](02-components-and-contracts.md) with this plan.
Browser storage loss and explicit cleanup can discard unsynchronized edits; communicate local-only scope.
Multi-tab editing must serialize local writes and refresh other tabs on trusted devices.
Future sync conflict resolution is outside this sprint; preserve base values and mutation identities.

## Execution gate

Pablo commits this Plan and its dependencies before separate component-scoped Tasks are drafted.
Tasks require their own approval commit before coding on `codex/sprint-002-local-color-editing`.
