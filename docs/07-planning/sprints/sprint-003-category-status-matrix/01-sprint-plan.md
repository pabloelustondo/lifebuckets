# Sprint 003 — Category Status Matrix

Status: PROPOSED; human Plan commit required before separate Tasks are drafted.
Base: `dev` at merged `main` commit `d2ad031`.
Working branch: `codex/sprint-003-category-status-matrix`.

## Goal

Give a truthful, immediate view of every lucket's condition and action within its category.
Show individual colors without averages, rankings, maxima, minima, or a derived category status.

## Confirmed design

- Replace the category count and chevron with a compact two-row matrix.
- Left-align all matrices within a shared 128px area on the right, including shorter categories.
- One column per lucket, in the same order as the expanded list; no filler columns.
- Up to 10 columns by design; existing categories contain 2–9 luckets.
- Upper row: condition circles. Lower row: action squares.
- Use small, tightly spaced marks with a thin black border and the existing five colors.
- Keep category code and name on the left; the whole row remains the expansion control.
- Apply the same circle/square convention to expanded luckets and their color pickers.

## Scope and dependencies

Read [component contract](02-components-and-contract.md) and [visual specification](../../../06-solution-design-and-architecture/mockups/category-status-matrix.md).
Update LB-004's shape convention and add LB-013 in the current requirements and screen scenarios.
Earlier sprint records remain historical evidence of their original behavior.
Use the existing owner-scoped view with local overrides; introduce no category status field.

## Acceptance

- N luckets produce exactly N aligned pairs, with N no greater than 10.
- Every circle/square matches the corresponding expanded lucket, including pending local edits.
- Colors preserve lucket order; no sorting by color or severity.
- Null, unavailable action, and unknown values are not falsely shown as explicit white.
- Matrices share the same left edge; no count or chevron remains.
- At 320px and desktop widths, labels wrap without clipping or displacing the matrix offscreen.
- Keyboard expansion, visible focus, and aria-expanded remain functional.
- Screen-reader text identifies each lucket and its separate condition/action values.
- Changing a color locally updates both its expanded row and category matrix.
- Offline reload preserves the same matrix values and explicit business date.
- Unexpected categories above 10 luckets show an explicit overflow notice; expansion retains every row.
- No new network writes or production data changes occur.

## Exclusions and completion

No server synchronization, scoring, new color meanings, taxonomy editing, or date/closing changes.
No deployment is included; review the local result before a separately authorized release.
Record test results, 320px/desktop screenshots, limitations, and review disposition separately.
Pablo commits this Plan and dependencies, then separately reviews and commits implementation Tasks.
