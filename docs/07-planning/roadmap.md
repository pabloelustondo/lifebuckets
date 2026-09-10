# First-Screen Roadmap

Status: proposed sequencing, not an approved Sprint Plan or Tasks document.
Source: [product baseline](../reference/product-baseline.md).

| Increment | Deliverable | Gate |
| --- | --- | --- |
| 1. Screen foundation | Agreed React layout with labeled sample data and a walking skeleton. | Approved scope/components and Plan, then Tasks. |
| 2. Persisted model | Authenticated owner hierarchy, user record, explicit open day. | Provider, onboarding, ownership contract, and import mapping decisions. |
| 3. Offline access | Previously loaded shell and owner data reopen offline. | Trusted-device/cache cleanup design and end-to-end proof. |
| 4. Editing | Agreed condition and daily-action interactions. | Legend, date-keyed history, pending/error behavior, conflict policy. |
| 5. Day closing | Explicit history, carry-forward, and next-date transition. | Entry point, history, gap handling, and concurrent-device rules. |
| 6. Release preparation | Review build, setup guide, evidence, configuration. | Declared target and independent review; deployment separately authorized. |

Editing and closing are conditional follow-ons; they must not expand the first read-only delivery silently.
Release preparation for the read-only screen need not wait for those optional follow-ons.
Unresolved later interactions do not block drafting display/navigation plans.
Existing document-review and implementation gates still apply.

## Next planning step

Review the [Sprint 001 Plan](sprints/sprint-001-read-only-life-map/01-sprint-plan.md), including proposed scope choices, component contracts, and acceptance.
Only after its Plan is committed should component-scoped Tasks be drafted.
The [sprint registry](sprints/README.md) contains Sprint 001 as a proposal; implementation is not authorized.
