# LifeBuckets Personal Production

Status: configured and deployed after explicit user confirmation in this task on 2026-09-11.
Date: 2026-09-11.

## Purpose and authority

User selected “Personal production with real luckets” and requested deployment in this task.
This is the personal LifeBuckets app, with the Sprint 002 local color editor.
Hosting does not add server synchronization; color changes remain local to the selected device/session.

## Infrastructure identity

Firebase project: `lifebuckets-bd43d` (project number previously verified as `118747582700`).
Existing Hosting site: `lifebuckets-bd43d`; intended URL: https://lifebuckets-bd43d.web.app.
Web app: `1:118747582700:web:29acd685a795f81c3dd5c9` (LifeBuckets Web).
Firestore API enabled; `(default)` database created and verified as Firestore Native.
Database region: Montréal, Canada (`northamerica-northeast1`), explicitly confirmed by the user.
Do not use legacy `lifebuckets-c3050`, AI Shop, or any other project's infrastructure.

## Data and access

Real owner data only; no synthetic fixture accounts or seeded sample colors.
Initial records: 7 categories and 49 luckets, blank colors, openDay `2026-09-11`; no legacy import.
Sign-in: Google, enabled. Owner: `pablo.elustondo@gmail.com`, explicitly supplied by the user.
Firestore reads remain owner-scoped; client business-data writes remain denied.
UI/code assets may be public, but personal data requires authentication and owner authorization.
Trusted-device local color changes persist on that browser; explicit cleanup discards unsynchronized edits.
Production data must never be used for emulator load/destructive tests or copied into test evidence.

## Isolation and operations

Local tests continue exclusively under `demo-lifebuckets` with loopback emulators and synthetic accounts.
Use explicit project arguments for all production operations; do not inherit a CLI default project.
Production deployed; see [deployment record](production-deployment-2026-09-11.md) for evidence and remaining live verification.
Preserve prior Hosting release identity for rollback; rollback must not erase user records.
Review [deployment tasks](../07-planning/sprints/sprint-002-local-color-editing/04-production-deployment-tasks.md) before dependent executable changes.
