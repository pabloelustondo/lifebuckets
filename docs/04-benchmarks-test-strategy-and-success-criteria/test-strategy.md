# First-Screen Test Strategy

Status: planned checks, not completed test results.
Evaluate scanability, preserved context, date correctness, persistence, and ownership against personal review use.

| Area | Required evidence | Requirements |
| --- | --- | --- |
| Mobile | At 320px and desktop, no horizontal clipping; codes/shapes visible; long text wraps. | LB-003–005 |
| Navigation | Expand Work and Life together; collapse one without losing the other or surrounding categories. | LB-001–002 |
| Interpretation | Independent shape labels, thin black outlines, keyboard operation, visible focus. | LB-005–007 |
| Open day | Refresh, midnight, clock changes, reconnection, and gaps leave stored date unchanged. | LB-008–009 |
| Offline reading | After online loading, restart the application offline with the same owner and hierarchy. | LB-010 |
| Offline limits | First uncached visit, missing data, eviction, and unavailable persistence are reported honestly. | LB-010 |
| Ownership | Emulator checks deny unauthenticated/cross-owner reads and writes; owner reads succeed. | LB-012 |
| Editing, when enabled | Pending changes survive reload; acknowledgement or rejection is surfaced. | LB-011 |
| Multiple devices, when enabled | A stale day's actions cannot silently overwrite or become another day's actions. | LB-009 |

## Validation design

Use proportionate unit checks for pure date/grouping behavior and emulator integration checks for ownership.
The first vertical increment must supply one isolated local end-to-end command using production composition.
Document explicitly simulated edges; do not substitute mocked internals for whole-system proof.
Include browser/manual layout and accessibility evidence; retain actual builds, environments, commands, and results.
Independent review reproduces the end-to-end run.
The [acceptance scenarios](../08-specifications-as-code/acceptance/README.md) describe intended checks; no runner exists yet.

## Evidence boundary

No measured benchmark, application run, or security result is established by this document.
Future reports belong in Build and Test and must distinguish passed, failed, skipped, and blocked checks.
