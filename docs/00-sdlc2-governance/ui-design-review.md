# UI Design Review

Every new page or visible UI change requires a mockup before implementation.
This rule covers layout, navigation, controls, spacing, colors and interaction changes.
Mockups are design artifacts, not implemented features or proof of backend behavior.

## Required artifacts

Store the mockup under docs/06-solution-design-and-architecture/mockups/.
Provide a reviewable page or image; prefer an interactive page for stateful interactions.
Save representative phone and desktop images alongside the visual specification.
Label proposed status, provenance, sample content and any simulated responses.
Describe the intended states, navigation, behavior and differences from an earlier image.
Link the visual specification from the Sprint Plan and affected component contract.

## Review sequence

Develop the mockup during planning/detailed design, before finalizing implementation Tasks.
Pablo reviews and commits the mockup and governed design dependencies before UI coding.
For a requested UI refinement, update its mockup/specification before changing implementation.
Explicit user instructions can authorize a bounded exception; record its scope and reason.
Never infer backend correctness or API integration from a polished mockup.

## Verification

Check phone and desktop rendering for clipping, wrapping, readable controls and keyboard focus.
During implementation review, compare actual screenshots with the approved design.
Record intentional deviations and revised approval; retain superseded references as historical.
