# Sprint 001 — Delivered Scope

Implementation baseline: b967e41; branch: codex/sprint-001-read-only-life-map.
Status: local implementation and implementer validation complete; independent review and human acceptance pending.
Authority: committed Plan/Tasks plus the user's explicit implementation request.
See [test report](sprint-001-test-report.md) and [local setup](sprint-001-setup.md).

## Task reconciliation

| Task | Component | Delivered files and behavior |
| --- | --- | --- |
| T01 | C-APP | Root toolchain/configuration, route scaffold, build and browser orchestration under e2e/. |
| T02 | C-RULES | firestore.rules, firestore.indexes.json, tests/rules/: owner reads, all browser writes denied. |
| T03 | C-FIXTURE | scripts/fixtures/seed.mjs: exact demo-only guard, synthetic accounts/rows, readback checks. |
| T04 | C-DATA | app/data/model.ts and client.ts: typed owner view, explicit dates, validation, session/read lifecycle. |
| T05 | C-MAP | app/features/life-map/: map, independent indicators, expansion, wrapping, keyboard and state rendering. |
| T06 | C-APP | app/routes/home.tsx: sign-in and data/map composition, connected browser gate. |
| T07 | C-DATA | Trusted persistence, cache errors, stale-listener suppression, epoch and multi-tab cleanup. |
| T08 | C-APP | Versioned public shell generation, OfflineShell, actual browser restart/cleanup tests. |
| T09 | C-APP | Full local test suite, review server, hosting placeholders, setup, screenshot evidence. |

Corrections remained component-scoped: C-DATA cache/error handling, then C-APP fault-injection and acceptance coverage.
The [source manifest](sprint-001-evidence/source-sha256.txt) enumerates exact executable/configuration files and hashes.
Documentation and screenshots accompany the code as review evidence; they do not grant release authority.

## Delivered behavior

All seven categories and 49 luckets render from authenticated owner-scoped Firestore rows.
The explicit business day and daily action date are independent of the device clock.
Previously loaded shell/data reopen offline on a trusted device.
Sign-out clears visible personal data immediately and locks switching until cache cleanup succeeds.
Session-only, absent/invalid data, storage failures, and missing open day are explicit.
Public shell updates wait for old tabs to close; personal HTTP responses are not service-worker-cached.

## Remaining boundaries

Accounts and dates are pre-provisioned synthetic fixtures; no real personal onboarding is delivered.
No condition/action editing, day closing, history transitions, synchronization, or live deployment.
Cached data is a trusted-device convenience, not encrypted storage or forensic secure deletion.
Server-side revocation cannot be detected while fully offline.
Nine moderate local-tooling dependency findings remain documented; runtime audit reports zero.
The Firebase bundle emits a size warning; the local production build and offline tests pass.
Independent review and human disposition must follow before sprint acceptance or release.
No commit, push, merge, or deployment was performed by the agent.
