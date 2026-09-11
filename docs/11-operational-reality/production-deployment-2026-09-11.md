# Personal Production Deployment — 2026-09-11

Status: Hosting deployed; final authenticated browser acceptance awaits owner's Google passkey verification.
User confirmed Google sign-in, current 49-lucket structure with blank colors, and Montréal after specifying the owner email.
Production: `lifebuckets-bd43d`; https://lifebuckets-bd43d.web.app.

## Artifacts and resources

App source: commit `f8c2a4843083a5a8d9e8a00117fb7ca7d2442e94`, with ignored `.env.hosted` containing registered public SDK configuration.
Provisioning script and this operational evidence remain uncommitted; the deployed app source was unchanged this turn.
Web app: `1:118747582700:web:29acd685a795f81c3dd5c9`.
Firestore: `(default)`, Native, STANDARD, `northamerica-northeast1`; created 2026-09-11T04:42:23.973272Z.
Google provider enabled; production `.web.app` and `.firebaseapp.com` are authorized sign-in domains.
Owner identity created without a password or a forged email-verification assertion; Google will verify the identity on sign-in.
Verified 7 categories and 49 owner-scoped luckets with blank condition/action colors; initial openDay is `2026-09-11`.
Rules deployed before personal records; owner reads only, all client business-data writes denied.

## Hosting release

Version: `sites/lifebuckets-bd43d/versions/e8605d5a2672eaed`.
Release: `sites/lifebuckets-bd43d/releases/1789102092890000`.
Release time: `2026-09-11T04:48:12.890Z`.
Prior releases query returned none: this is the first observed Hosting release, with no prior release to roll back to.
Do not delete production records for rollback; rebuild/redeploy this recorded version to recover the app.
App shell version: `e82c9334463d3c1c`.
index.html SHA256: `e33e71b7edd730773fd884a90ae02436ce213946ee3479adabc40474797c4c4e`.
sw.js SHA256: `4b06a09762110852f652c7589dfe6f4dbe68a2dd6f930cf105a474f7b533db2d`.

## Verification

Production build passed; Hosted config selected the production project and Google provider.
The bundle retains inactive emulator branches; verified config selects hosted mode, and live Google OAuth opened for the correct project.
HTTPS page loaded and displayed “Sign in with Google,” with no synthetic credentials or local-review labels.
Selecting the owner account reached Google's passkey verification challenge in Chrome.
Live authenticated owner reads, color saving, and offline reopening remain unverified until the owner completes that challenge.
Local configuration validation previously passed 18 unit and 18 browser tests; security rules previously passed 3 emulator tests.
The initializer verified 56 records and refused any overwrite using create-only Firestore write preconditions.
An initial SDK credential-format failure and then a missing quota-project error occurred before records were written; corrected API calls succeeded.
Logs: [build](production-evidence/build.log), [rules](production-evidence/rules-deploy.log), [hosting](production-evidence/hosting-deploy.log).

## Limits

Colors still save locally; this deployment does not implement server synchronization or remote backup of color changes.
Localhost browser data does not transfer automatically to the production origin.
No legacy data, synthetic users, or fixture colors were imported.
