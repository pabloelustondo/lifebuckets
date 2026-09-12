# Sprint 003 — Implementation Tasks

Status: PROPOSED; separate human commit required before coding.
Plan baseline: `5b82028` (`sprint 003 plan`).
Dependencies: [Plan](01-sprint-plan.md), [contract](02-components-and-contract.md), and linked visual specification.
Execution branch: `codex/sprint-003-category-status-matrix` (already checked out).
Target: local development and emulator verification; no production changes or deployment.

## Ordered tasks

### T01 — Life map presentation

Owned paths: `app/features/life-map/**`.
Render one compact column per supplied lucket, preserving `Group.children` order and stable IDs.
Place condition circles above action squares, using the existing projected values and palette.
Apply the same shapes to expanded indicators and palette controls without exchanging stored fields.
Replace category counts and chevrons; left-align the actual matrix in a shared 128px right-hand area without filler marks.
Use 10–11px marks, thin black borders, and 1–2px gaps; let long category labels wrap.
Preserve explicit white, null, unknown, and unavailable action as distinct contract states.
Render no marks for empty categories and an explicit notice for more than 10 luckets.
Retain every expanded lucket, including overflow, and the existing local-edit callbacks.
Keep the whole category row as one button with its accessible name, focus, and aria-expanded.
Describe each lucket's separate values accessibly; decorative marks are not nested controls.
Consume existing local projections so edits update summary and expanded indicators together.
Do not modify data/session contracts, persistence, server writes, or business-date behavior.

### T02 — Verification (after T01)

Owned paths: `e2e/**`, `docs/09-build-and-test/sprint-003-*`.
Use synthetic fixtures against local emulators; never seed or edit production data.
Verify 0, 1, 10, and overflow cases, ordered pairs, and distinct missing/unknown/white states.
Verify stale-day action remains unavailable and the new shapes do not swap property values.
Compare left edges for categories of different lengths at 320px and desktop widths.
Check long-label wrapping, clipping, thin borders, and consistent shapes in rows and pickers.
Exercise keyboard expansion, focus, descriptions, palette selection, and local summary updates.
Prove trusted offline reload retains edited colors and the same explicit business date.
Retain assertions that color editing sends no server writes and independent fields stay independent.
Run typecheck, build, unit, Firestore rules, and browser suites using the existing scripts.
Save local screenshots and actual results with limitations in Sprint 003 build/test evidence.
Report implementation and validation separately from independent review, acceptance, and release.
