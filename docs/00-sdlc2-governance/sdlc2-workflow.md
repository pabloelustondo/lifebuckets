# SDLC2 Workflow

Move from intent to operational learning in small, traceable increments.
The [lifecycle index](../README.md) assigns decisions and evidence to their owning areas.

## Sequence

1. Pass the [previous-sprint merge and cleanup gate](branch-lifecycle.md), then inspect the checkout and constraints.
2. Define intent, use cases, measurable acceptance, architecture, and affected contracts.
3. For UI changes, produce a mockup and linked visual specification; draft a Sprint Plan: goal, stories, scope, exclusions, dependencies, acceptance, and risks.
4. Pablo reviews and commits the Plan and its governed dependencies.
5. Draft separate Sprint Plan Tasks with ordered work, one approved component per task.
6. Pablo reviews and commits Tasks and their governed dependencies.
7. With explicit implementation authorization, create a dedicated sprint branch from verified current dev and execute.
8. Record delivered scope and test evidence, including the end-to-end gate.
9. Obtain independent review; distinguish reproduced evidence from implementer claims.
10. Pablo decides acceptance, commits the completed sprint, merges it into dev and removes its branches.
11. Deploy or release only with explicit authority for the declared target; record live results.
12. Promote dev to main separately after real-user end-to-end validation and explicit approval.
13. Feed observations and lessons back into context, intent, design, and planning.

## Working rules

- Add focused documents for distinct concerns; revise existing ones when decisions become inconsistent.
- Follow [document review](document-review.md) and the root decision-document size rule.
- A sprint folder, template, status label, or recent timestamp never authorizes execution.
- Tasks may observe other components during integration validation without modifying them.
- Routine reversible work inside an authorized sprint proceeds autonomously.
- Scope changes revise the Plan; execution-detail changes revise Tasks before dependent coding.
- Corrections repeat affected validation and review; preserve prior evidence with linked follow-ups.
- Review recommends; Pablo decides. Acceptance does not imply deployment or release.

## Completion

Requested artifacts and required evidence must exist before reporting completion.
Record missing, skipped, failed, or unavailable checks and remaining decisions explicitly.
Build, test, review, merge, deployment, and operational observation establish different facts.
