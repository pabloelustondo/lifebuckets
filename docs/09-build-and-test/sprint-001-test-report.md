# Sprint 001 — Implementer Test Report

Date: 2026-09-10 local / 2026-09-11 UTC.
Environment: LOCAL-EMULATOR, demo-lifebuckets, loopback only, synthetic data.
Baseline: b967e41; branch: codex/sprint-001-read-only-life-map.
Code was uncommitted when tested. Exact source identities: [manifest](sprint-001-evidence/source-sha256.txt).
Manifest SHA-256: beb00053a4e0cd70502b0a6f27110a74c99df2784b71c931a7daa7fe88b79e7d.

## Reproduction and observed results

Use the [setup guide](sprint-001-setup.md).
Runtime: Node 24.19.0, Java 21.0.10; Chromium 153.0.8010.12, Playwright 1.63.0.
React 19.3.0, React Router 8.3.1, Vite 8.3.0, Firebase 12.19.0, TypeScript 7.0.2.
- npm run typecheck: PASS.
- npm run test:unit: PASS, 7 tests.
- npm run test:rules: PASS, 3 suites of ownership/write-denial assertions; [raw log](sprint-001-evidence/rules-run.log).
- npm run build: PASS, included in the end-to-end gate; SPA and public shell generated.
- npm run test:e2e: PASS, 11 tests, 13.5 seconds of browser testing; [raw log](sprint-001-evidence/browser-run.log).
- Fixture guard: non-demo identity rejected before network; emulator readback verified 56 rows per nonempty synthetic owner.
- npm audit --omit=dev: 0 findings; [runtime audit](sprint-001-evidence/runtime-audit.json).
- Full npm audit: 9 moderate findings in local tooling dependencies; [audit details](sprint-001-evidence/dependency-audit.json).

## Acceptance reconciliation

| Gate | Observed result |
| --- | --- |
| S1-01 | Exact source codes/names/order and counts; multiple expanded categories, independent collapse. |
| S1-02 | 320px and 1440px screenshots, long detail wrapping, no horizontal overflow. |
| S1-03 | Keyboard activation, expansion state, separate accessible labels, outlines, compact header. |
| S1-04 | Older explicit date survives actual offline restart, time-zone change, later clock date, reload, and reconnect. |
| S1-05 | A new Chromium process with the same persistent profile reopens the cached shell and owner hierarchy offline. |
| S1-06 | Empty, missing day, malformed hierarchy, evicted cache, unsupported IndexedDB, and session-only reload checks pass. |
| S1-07 | Own reads succeed; unfiltered, cross-owner, unauthenticated reads and all client writes denied. |
| S1-08 | Multi-tab sign-out removes map access; a real held IndexedDB connection blocks switching until cleanup is retried. |
| S1-09 | Pinned dependencies, setup, local gate, built output, and evidence exist; independent review is pending. |

## Visual inspection

The implementation was compared with both embedded guide illustrations fetched from the supplied Google Doc.
Reviewed [collapsed 420px](sprint-001-evidence/collapsed-420.png), [expanded 320px](sprint-001-evidence/expanded-320.png), and [desktop](sprint-001-evidence/expanded-1440.png).
Dark textured category rows, lighter children, spacing, shape order, full-width layout, and compact header follow the references.
The stored sample date and independently generated illustrative colors intentionally differ from the source image.
[Offline restart screenshot](sprint-001-evidence/offline-restart.png) records the actual cached view.

## Corrections and limits

An early build needed local server permissions; Node 24 replaced unsupported Node 26 tooling.
Initial cache eviction waited indefinitely when the browser reported connectivity; a bounded unavailable-cache state fixed it.
Legacy persistence setup did not reliably surface unavailable storage; explicit storage probing and the current cache API fixed it.
A later correction latches read failures so another listener cannot restore an invalid view.
The initial skeleton gate passed before connected work; each integration added coverage.
No live deployment, personal-data import, offline writes, closing, independent review, Safari, Firefox, or physical-phone run is claimed.
