# Sprint 002 — Personal Production Deployment Tasks

Status: PROPOSED; separate human commit required before dependent code or provisioning.
Authority: user requested deployment and selected personal production with real luckets on 2026-09-11.
Scope baseline: committed [deployment proposal](../sprint-001-read-only-life-map/09-deployment-scope-proposal.md).
Includes the Sprint 002 local color editor; server synchronization remains outside this deployment.
Target declaration: [production](../../../11-operational-reality/production-environment.md).

## Ordered component tasks
### D01 — Data and session configuration
Owned paths: `app/data/**`.
Introduce explicit emulator versus production configuration; validate required public Firebase SDK values.
Connect loopback emulators only in emulator mode; prohibit demo project IDs in production.
Use the same selected Firebase identity for sign-in, reads, persistence, and interrupted cleanup.
Keep local pending colors scoped to the active owner and retain cleanup protections.
Implement the selected production sign-in method while preserving emulator email/password tests.

### D02 — App build and sign-in flow
Owned paths: `app/routes/home.tsx`, `app/shell/**`, build/configuration files, environment examples.
Provide a named production build with no active loopback endpoints and accurate production labels.
Remove synthetic credentials/help from production; keep emulator setup explicitly local.
Keep the local-only color-save disclosure: hosting does not enable server synchronization.
Protect offline shell versioning and ensure users can activate the new build.

### D03 — Production account and initial data

Owned boundary: Firebase web registration, Auth setup, Firestore setup, production provisioning script.
Use only `lifebuckets-bd43d`; never redirect the existing emulator fixture tool to this project.
Resolve sign-in choice, owner identity, source data, and database region before creating resources.
Register the web application and obtain its public SDK configuration.
Enable required services, configure sign-in, and create a database only if absent.
Provision only the selected real owner and reviewed initial records; preserve existing data if discovered.
Do not copy synthetic users, fixture labels, historical passwords, or legacy credential files.
Verify row IDs, ownership, initial openDay, and record counts before publication.

### D04 — Security and hosting

Owned paths/boundary: `firestore.rules`, `firestore.indexes.json`, `firebase.json`, Hosting release.
Retain owner-scoped reads and denied client writes; verify exact project before each deployment.
Deploy required rules before exposing personal data; publish only the validated production build.
Record the prior Hosting release and new release identity for rollback.
Never delete or reset production data as a rollback operation.

### D05 — Verification and handoff

Owned paths: `e2e/**`, `docs/09-build-and-test/`, `docs/11-operational-reality/`.
Run relevant unit, type, build, browser, and emulator security checks after configuration changes.
Inspect the hosted artifact for emulator configuration and synthetic account leakage.
Verify live HTTPS loading, chosen sign-in, correct owner rows/date, local color save, and offline reopening.
Record limitations and exact deployed artifact; distinguish local tests from live acceptance.
