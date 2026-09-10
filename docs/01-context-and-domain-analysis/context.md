# LifeBuckets Context and Domain

Status: proposed for repository review. Source: [product baseline](../reference/product-baseline.md).

LifeBuckets is a personal system for observing, organizing, and improving one's life.
It represents areas needing attention, areas being maintained, and areas requiring no current action.

## Rhythms and existing representations

Support broad life reviews, daily observing/thinking/acting/reviewing, and operational days spent simply doing tasks.
Do not impose a daily completion ritual.
Google Drive folders, a Google Sheets tracker, and Apple Reminders already represent the system.
Their consistency is maintained by the person over time; the app does not automatically reconcile them in Sprint One.
The primary user manages their own life across multiple devices; collaboration is a future possibility.

## Domain vocabulary

| Concept | Meaning |
| --- | --- |
| Category | Broad life area: Life, Things, Work, Friends, Muse, Beyond, or Fun. |
| Lucket | Identifiable area with its own condition, attention, and activities. |
| Sub-bucket | Optional deeper subdivision in the shallow hierarchy. |
| Status | Actual condition of an area of life. |
| Action status | Planning or execution of intended action during a particular period. |
| Open day | Explicit business date being reviewed; stays open until deliberately closed. |

The current appendix has seven categories and 49 level-one luckets; deeper nodes are not enumerated.
Preserve existing codes and names; see the [taxonomy specification](../08-specifications-as-code/taxonomy.json).
