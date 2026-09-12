# Sprint 003 — Release and Closure

Status: RELEASE PREPARATION; final commit and production verification pending.
User reviewed the local UI and explicitly requested deployment and sprint closure on 2026-09-12.
Final refinements: neutral gray surfaces, shared left matrix edge, compact lucket rows,
and condition/action/code/name ordering.

## Release scope

Deploy Hosting only to Firebase project and site `lifebuckets-bd43d`.
URL: https://lifebuckets-bd43d.web.app.
Use the existing approved production configuration and Google sign-in.
Do not deploy rules, provision users, write personal records, or enable server synchronization.
The approved local color persistence behavior remains unchanged.

## Source and evidence

Current committed baseline: `90c43dd`; subsequent reviewed refinements await Pablo's commit.
Record the exact final commit and Hosting release after deployment.
Local validation: [Sprint 003 report](../09-build-and-test/sprint-003-validation.md).
Pablo's visual review is recorded in this conversation; no independent technical review is claimed.
Merge remains Pablo's responsibility and has not been performed by this agent.

## Deployment procedure

1. Verify final reviewed source and governed documents are committed and the tree is clean.
2. Build using `npm run build:production`; verify project `lifebuckets-bd43d`.
3. Record the current Hosting release for rollback before replacing it.
4. Deploy with explicit project `lifebuckets-bd43d` and `--only hosting`.
5. Record release identity, deployed revision and build hashes.
6. Verify hosted HTTPS loads the new assets and owner login remains available.
7. Verify authenticated matrices and local editing with the owner; record any unverified checks.
8. Record sprint closure after release verification, without inventing independent review evidence.

## Operational notes

An older open tab can keep a service worker update waiting; close all app tabs and reopen.
Never clear trusted local data to resolve an app update: unsynchronized edits must be preserved.
Rollback restores the previously recorded Hosting release without deleting personal records.
