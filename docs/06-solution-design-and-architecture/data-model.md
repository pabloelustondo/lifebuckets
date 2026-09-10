# Data Contract Proposal

Status: proposed fields; confirm mapping against the source tracker before any real-data seed.
Source: [implementation guide](../reference/product-baseline.md).

Use one Firestore database with separate luckets and users collections.
One hierarchy document represents one spreadsheet-style row; do not use one giant hierarchy document.
Read the owner's small hierarchy together and group it in memory.
Seven categories plus 49 base luckets means 56 documents before deeper nodes.

| Proposed field | Meaning |
| --- | --- |
| Document ID | Stable identity independent of name or hierarchy path. |
| ownerId | Authenticated owner UID, enforced in queries and rules. |
| itemId | Existing human code, preserved exactly. |
| category / bucket | Readable hierarchy columns; bucket empty on category rows. |
| subBucket / subSubBucket | Optional deeper columns, empty when unused. |
| name / kind / sortOrder | Display name, category/lucket type, deliberate order. |
| status | Actual condition; nullable before a meaning is recorded. |
| actionDay / actionStatusDay | Explicit business date and action value for that date. |
| description / currentFocus | Optional existing context. |
| updatedAt / schemaVersion | Audit timestamp and migration version. |

## User document

users/{uid} may contain profile and explicit date-only openDay.
Selected bucket and expansion persistence remain design choices, including whether they follow devices.
Do not silently initialize or roll the business date from the device clock.

## Invariants and unresolved semantics

A deeper populated level requires every intermediate level; sub-sub-bucket without sub-bucket is invalid.
Renaming/moving a branch must update affected denormalized paths consistently.
Store calendar dates without UTC-to-local shifts.
The action fields are a current-view proposal, not an approved history model.
Before editing or closing, choose date-keyed history and conflict rules that preserve stale-device intent.
Update only intended fields; do not overwrite a different day's actions on reconnect.
Retain weekly/monthly action, effort, friction, and link concepts for future mappings without adding required screen columns.
[Taxonomy JSON](../08-specifications-as-code/taxonomy.json) is a name/code specification, not private seed data.
