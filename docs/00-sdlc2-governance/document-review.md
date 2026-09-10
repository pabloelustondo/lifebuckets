# Document Review

## Scope and approval

Every project-owned Markdown file at the root and under docs/ is governed, including READMEs and templates.
Pablo's commit after reviewing the diff approves those exact contents.
Uncommitted or staged changes are proposals. Later edits need their own review and commit.
An approved blank template approves a format, not future filled-in decisions.

## Agent boundary

Agents write and may stage; they never commit, push, merge, rebase, amend, or delete branches.
Git identity alone cannot prove human review when an agent can use the same identity.
Never write reviewer initials or import historical signatures as current approval.
An agent may propose a governed file deletion; Pablo's commit approves the deletion.
If coding needs an uncommitted governed dependency, report it and wait for the human commit.
Documentation drafting and revision can continue within the authorized scope.

## Limits

Decision documents have at most 50 physical lines, as defined in [AGENTS.md](../../AGENTS.md).
Split focused concerns rather than compressing prose to fit the limit.
Document approval does not itself authorize implementation, deployment, publication, or release.
Record explicit execution authority separately from document approval.
