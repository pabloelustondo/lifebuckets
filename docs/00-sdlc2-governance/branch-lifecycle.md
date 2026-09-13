# Branch Lifecycle and Stable Baseline

Requested by Pablo: finish integration and cleanup before starting another sprint.
dev is the integration baseline; main preserves a deliberately validated stable version.
Deployment, sprint closure and promotion to main are separate decisions.

## Before starting a new sprint

Apply this gate before drafting the next Sprint Plan, implementation Tasks, or creating its branch.
For the first sprint only, record that there is no previous sprint.
1. Review and commit the previous sprint's code, specifications, tests and release/closure evidence.
2. Pablo merges the completed sprint into dev and publishes that integration to the remote.
3. Verify remote dev contains the reviewed changes; record the merge PR/commit and dev SHA.
4. Pablo removes the previous sprint branch from the remote and from local checkouts/worktrees.
5. Verify both branch removals and a clean development checkout before proceeding.
6. Start the next sprint from verified up-to-date dev; record the baseline in its Plan.
Do not delete a branch before verifying its work is integrated; squash merges require diff/PR evidence.
Preserve uncommitted work and resolve any active worktree using the old branch before cleanup.
Agents inspect and report missing steps; they never commit, push, merge or delete branches.
An idea can be captured in the backlog while this gate is blocked; do not advance its sprint package.
Premature existing drafts stay on hold and must not be mixed into the previous sprint's merge.

## Promotion from dev to main

Promote only when Pablo chooses to preserve a safe, solid version after serious real-user testing.
Record the exact candidate commit, hosted build/environment, test date, user and devices/browsers.
Exercise complete real-user journeys across the affected functionality, not just page loading.
Include authentication, navigation, actual provider integrations where used, persistence and recovery.
Test offline/reopen and app-update behavior where relevant, preserving unsynchronized user data.
Document expected versus actual outcomes, failures, fixes, retests and remaining accepted risks.
Use deliberate user actions; do not run destructive synthetic tests against personal production data.
Require applicable automated regressions and independent review; record gaps instead of assuming a pass.
Resolve blocking defects and obtain Pablo's explicit approval for that tested candidate.
Pablo then merges the validated candidate from dev into main and records the resulting revision.
If dev changes after validation, retest the new candidate before promotion.
Do not promote merely because a sprint ended, a build passed or a deployment succeeded.

## Closure evidence

Record acceptance, deployed revision if any, dev integration and branch cleanup separately.
A deployed sprint with an unmerged branch is not ready to hand over to the next sprint.
main may remain behind dev across several sprints until the stable-promotion gate is satisfied.
