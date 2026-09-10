# Acceptance Scenarios

Status: proposed behavior specifications, not executable tests or completed evidence.
The Gherkin files have no runner or step definitions yet.
Dates and user identities are synthetic examples.

- [Screen](screen.feature): LB-001 through LB-007.
- [Business day](business-day.feature): LB-008 and LB-009.
- [Offline and ownership](offline-and-ownership.feature): LB-010 through LB-012.

Scenarios tagged @future_writes remain gated by the editing/history/conflict decisions.
A rejected or explicitly reported conflict may satisfy date safety; silently changing its day cannot.
Do not skip gated scenarios and report the whole specification as a passing implementation.

See [requirements](../requirements.md) and the [test strategy](../../04-benchmarks-test-strategy-and-success-criteria/test-strategy.md).
