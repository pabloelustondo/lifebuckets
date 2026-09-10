# System Model and Use Cases

Status: proposed for repository review. Source: [product baseline](../reference/product-baseline.md).

## Model

Represent the shallow hierarchy as rows with category, bucket, sub-bucket, and optional sub-sub-bucket columns.
Stable identity is independent of names and hierarchy paths; parent traversal is not required to render the map.
Condition and action status are independent: a concerning condition may coexist with a successfully completed action.

## Open day

Persist an explicit date-only business day.
Midnight, refresh, reconnection, device clock changes, and skipped days must not advance it.
Reviewing yesterday this morning or an older day after gaps is valid.
Daily actions belong to an explicit date; never silently relabel cached actions as belonging to another day.
Handle no open day deliberately; onboarding and date selection remain [open decisions](../07-planning/open-decisions.md).
Closing eventually preserves history and selects a next date under explicit carry-forward rules; this transition is not enabled yet.

## Use cases

| ID | Use case | Expected behavior |
| --- | --- | --- |
| UC-01 | Review map | Show all categories in consistent order. |
| UC-02 | Explore categories | Expand several in place; retain surrounding categories. |
| UC-03 | Scan lucket | Read ID, square, circle, name, and available context. |
| UC-04 | Resume review | Restore the persisted open day. |
| UC-05 | Review offline | Reopen previously loaded application and owner data. |
| UC-06 | Record update, later | Associate daily changes with their intended explicit day. |
| UC-07 | Close day, later | Perform only the agreed explicit history/date transition. |

Authentication establishes whose data can be read; offline access must not bypass that boundary.
Google Drive, Sheets, and Reminders remain outside application synchronization.
