# Sprint 003 — Release and Closure

Status: DEPLOYED; closure record prepared under the user's explicit request.
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

Deployed source: `5799be0`; working tree was clean before deployment.
Hosting version: `19ef15029c1f2c67`; release: `1789190879345000`.
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

## Release outcome

Hosting released 2026-09-12T05:27:59.345Z; live index and service worker matched build hashes.
Authenticated owner data, new matrices, neutral theme and compact expanded rows verified live.
Existing pending local colors survived update activation; no personal records were modified.
Fresh production color edits and offline restart were not exercised; these passed locally.
Independent technical review and merge remain outstanding; neither is claimed as completed.
This closure evidence remains uncommitted for Pablo to retain in Git.
