# Sprint 001 — Read-Only Life Map

Date: 2026-09-10. Status: PROPOSED; approval requires Pablo's commit.
This plan authorizes no coding or deployment by itself.

## Goal and user stories

Deliver a runnable phone-friendly life map with authenticated owner reads, a persisted business date, and offline reopening.
As the owner, I can scan all categories, expand several in place, and distinguish condition from daily action.
As the owner, I can resume an older open day and review previously loaded data without connectivity.

## Existing foundation and dependencies

The repository contains documentation and specifications; no application or end-to-end command exists.
Dependencies: root agent rules and governance, [intent](../../../02-intent/intent.md), [architecture](../../../06-solution-design-and-architecture/architecture.md), and [data model](../../../06-solution-design-and-architecture/data-model.md).
Behavior: [requirements](../../../08-specifications-as-code/requirements.md), [taxonomy](../../../08-specifications-as-code/taxonomy.json), and [scenarios](../../../08-specifications-as-code/acceptance/README.md).
This package adds [scope decisions](02-scope-decisions.md), [acceptance](03-acceptance.md), and [component contracts](04-components-and-contracts.md); all remain proposals.

## Scope

- Scaffold React/TypeScript, React Router framework mode with Vite, Tailwind, and useful shadcn/ui elements; retain a compatible lockfile.
- Render the compact header and full-width category/lucket rows, exact taxonomy, independent indicators, and accessible expansion.
- Integrate Firebase Authentication and owner-scoped Firestore reads, including persisted openDay.
- Provide explicit authentication, loading, empty, no-open-day, data-error, and cache-unavailable states.
- Enable trusted-device persistent data caching and a service-worker application shell.
- Verify restart offline after one authenticated online load, with unchanged business date.
- Supply isolated synthetic fixtures, setup instructions, configuration placeholders, and a runnable review build.
- Prepare hosting configuration for review; bind live configuration only after target verification.

## Exclusions

No condition/action editing, date initialization UI, closing, history transitions, or offline business-data writes.
No live deployment, real-data seed, tracker/Drive/Reminders synchronization, AI, native packaging, or collaboration.
No account registration/reset administration or cross-device UI-context persistence.
Final color semantics, live account setup, and production readiness are not claimed by this increment.

## Completion and evidence

Meet S1-01 through S1-09 in [acceptance](03-acceptance.md).
Create a one-command local end-to-end gate from the walking skeleton; extend it as integration is added.
Deliver scope reconciliation, actual test evidence, limitations, and independent review for human disposition.

## Review gates and risks

Read the proposed choices and environment boundary in [scope decisions](02-scope-decisions.md).
Caching/session cleanup and true offline restart are the highest integration risks; a failure remains a failed gate.
Pablo commits the Plan and dependencies first; only then draft separate component-scoped Tasks.
After Tasks approval and explicit implementation authorization, create codex/sprint-001-read-only-life-map.
