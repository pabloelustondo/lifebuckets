# LifeBuckets Agent Rules

Read [SDLC2 governance](docs/00-sdlc2-governance/README.md) before changing documentation, plans, code, tests, or releases. These rules apply throughout this repository.

## Review

- Pablo's commit approves exact reviewed documentation. Uncommitted work, staged or not, remains a proposal.
- Agents may write and stage; they never commit, push, merge, rebase, amend, or delete branches.
- Never enter reviewer initials or infer approval from silence, praise, or staging.
- Changes to this file require Pablo's explicit instruction.
- Verify repository, branch, working tree, and target environment; preserve unrelated work.
- Decision documents contain at most 50 physical lines: root Markdown, Markdown under docs/00- through docs/08-, and any Markdown carrying an approval field.
- Evidence, reference material, code, schemas, generated reports, and other files have no line limit unless they carry an approval field. Do not disguise decisions as evidence.
- Split oversized decision documents before otherwise modifying them; verify counts on completion.

## Execution

- Before starting a new sprint, verify the previous sprint is merged into remote dev and its local/remote sprint branches are removed; see docs/00-sdlc2-governance/branch-lifecycle.md.
- Treat main as a stable baseline: promote from dev only after documented real-user end-to-end validation and explicit human approval.
- UI changes require a reviewable mockup and saved image in the visual specification before implementation Tasks are finalized; see docs/00-sdlc2-governance/ui-design-review.md.
- Approve a Sprint Plan first; only then draft and separately approve Sprint Plan Tasks.
- No sprint coding starts until Pablo has committed both artifacts and all governed Markdown dependencies, and explicitly authorized implementation.
- Create and switch to a dedicated codex/sprint-NNN-short-name branch from verified current dev before coding.
- Each task modifies exactly one approved component; split cross-component work into ordered tasks.
- Approve affected interface contracts before coding and verify both sides during review.
- Authorized work includes routine in-scope edits, builds, tests, and local checks; continue without intermediate permission.
- Scope changes return to planning. Deployment, publication, release, and risky external changes require explicit authority for the concrete action.
- Keep planning, implementation, testing, review, acceptance, merge, deployment, and release distinct.
- Report missing evidence and unresolved gaps; a build does not prove end-to-end behavior.
- No environment or external-system authority is inherited from another project.
