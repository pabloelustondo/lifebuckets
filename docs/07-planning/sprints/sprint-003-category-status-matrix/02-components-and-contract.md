# Category Matrix — Proposed Component Contract

Status: PROPOSED; dependency of the Sprint 003 Plan.

## Component responsibilities

Life map presentation owns category matrices, expanded indicators, picker shapes, and accessible text.
The existing data/session modules supply owner-scoped groups and local pending-color projections unchanged.
Verification owns focused UI tests and synthetic evidence; it must not seed or modify production.

## Input and mapping

Use each existing `Group.children` array in its supplied order; use stable row IDs as keys.
Each column reads `Row.status`, `Row.actionStatus`, and `Row.actionAvailable`.
Condition uses a circle; action uses a square, consistently in summaries, rows, and palettes.
An action with `actionAvailable=false` remains unavailable for the current openDay.
The existing data layer remains responsible for excluding stale-day actions.
No aggregation, numeric color rank, category property, or additional persistence is introduced.

## Visual states

Explicit blue, green, white, yellow, and red reuse the current palette.
Null condition: unfilled outlined circle, labeled not recorded.
Unavailable/unrecorded action: unfilled outlined square with the existing precise accessible wording.
Unknown value: patterned mark and unknown label; do not substitute white or a severity.
Each column's two marks remain aligned; the matrix contains only actual luckets.
Use 10–11px marks with 1–2px gaps, subject to 320px visual verification.
Right-align the matrix as a whole without reserving empty columns for missing luckets.
Zero luckets renders no marks; retain accessible empty-category context.
More than 10 luckets renders an explicit overflow notice instead of a misleading truncated matrix.

## Interaction and accessibility

The category row remains one button with its existing accessible category name and aria-expanded.
Remove its count and chevron; do not replace them with another aggregate or toggle icon.
Provide an accessible description listing lucket codes and both values; tiny marks are decorative.
Do not make each tiny mark an independent touch target or nest buttons in the category button.
Expansion exposes existing per-lucket palette controls; those continue to perform local edits.
No new header legend is required; shape labels remain available through accessible descriptions and pickers.

## Compatibility

This deliberately reverses Sprint 001/002's visual shape mapping without exchanging stored properties.
Storage/API names and values remain unchanged; no data migration or rewritten production records.
The current LB-004 and screen scenarios adopt this convention after Plan review.
