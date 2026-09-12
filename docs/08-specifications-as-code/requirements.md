# First-Screen Requirements

Status: proposed for review; these IDs are stable traceability anchors.
Source: [product baseline](../reference/product-baseline.md).

| ID | Requirement | Delivery boundary |
| --- | --- | --- |
| LB-001 | Preserve category names, lucket codes/names, and order in taxonomy.json. | First display |
| LB-002 | Expand multiple categories in place, retaining all surrounding categories. | First display |
| LB-003 | Full-width rows without progressive indentation or horizontal clipping at 320px. | First display |
| LB-004 | Row order: ID, condition circle, action square, name, optional details. | First display |
| LB-005 | Both font-sized shapes have thin black outlines. | First display |
| LB-006 | Condition and action remain independent, with distinguishable shapes and accessible labels. | First display; final meanings pending |
| LB-007 | Compact header contains only LifeBuckets, avatar P, and open date. | First display; no-day state pending |
| LB-008 | Persist open day; midnight, refresh, reconnect, clock changes, and gaps never advance it. | Persisted display |
| LB-009 | Daily actions retain their explicit business date, including stale-device updates. | Reads now; writes gated |
| LB-010 | Previously loaded shell and owner data reopen offline; missing cache is explicit. | Offline increment |
| LB-011 | Distinguish pending local changes from server acknowledgement and rejection. | When writes enabled |
| LB-012 | Enforce authenticated ownership on reads and writes, including offline session boundaries. | Connected data |

| LB-013 | Category row replaces count/chevron with a left-aligned matrix in a shared right-hand area: condition circles above action squares, one column per lucket (maximum 10), no aggregation. | Sprint 003 |

## Supporting constraints

- Category controls are keyboard-operable, expose aria-expanded, and have visible focus.
- Wrap long names/descriptions without hiding codes or indicators.
- Prototype yellow/red/blue/green must retain distinguishable blue and green; meaning is not color alone.
- Never invent an action completion merely because a condition has a particular color.
- A deeper populated hierarchy level requires every intermediate level.
- Date-only values must survive time-zone changes without changing calendar day.
- No unreviewed close-day header control, automatic closing/reset, or generated skipped days.
- No source-system synchronization or private status imports in the first delivery.

## Verification

[Acceptance scenarios](acceptance/README.md) map requirement IDs to planned checks.
[Taxonomy JSON](taxonomy.json) defines only the level-one code/name snapshot.
No schema here finalizes status enums, authentication, history storage, or conflict resolution.
