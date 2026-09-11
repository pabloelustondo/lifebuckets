# LifeBuckets Personal Production

Status: environment purpose selected by the user; configuration below remains a proposal pending review.
Date: 2026-09-11.

## Purpose and authority

User selected “Personal production with real luckets” and requested deployment in this task.
This is the personal LifeBuckets app, with the Sprint 002 local color editor.
Hosting does not add server synchronization; color changes remain local to the selected device/session.

## Infrastructure identity

Firebase project: `lifebuckets-bd43d` (project number previously verified as `118747582700`).
Existing Hosting site: `lifebuckets-bd43d`; intended URL: https://lifebuckets-bd43d.web.app.
2026-09-11 refresh: Firebase apps:list returned no registered applications.
Firestore database lookup returned HTTP 403: API unused or disabled; existence/region remain unverified.
Database region: unresolved; explicitly select before creating the database.
Do not use legacy `lifebuckets-c3050`, AI Shop, or any other project's infrastructure.

## Data and access

Real owner data only; no synthetic fixture accounts or seeded sample colors.
Initial records: awaiting choice between current taxonomy with blank colors and legacy data import.
Sign-in method: awaiting user selection; owner identity must be verified during account setup.
Firestore reads remain owner-scoped; client business-data writes remain denied.
UI/code assets may be public, but personal data requires authentication and owner authorization.
Trusted-device local color changes persist on that browser; explicit cleanup discards unsynchronized edits.
Production data must never be used for emulator load/destructive tests or copied into test evidence.

## Isolation and operations

Local tests continue exclusively under `demo-lifebuckets` with loopback emulators and synthetic accounts.
Use explicit project arguments for all production operations; do not inherit a CLI default project.
No production provisioning or deployment has been performed by this declaration.
Preserve prior Hosting release identity for rollback; rollback must not erase user records.
Review [deployment tasks](../07-planning/sprints/sprint-002-local-color-editing/04-production-deployment-tasks.md) before dependent executable changes.
