# Inter-Component Contract Gate

Before implementing communication across a component boundary, define and approve its intended contract.
A self-contained change with no affected boundary does not trigger this gate.

## Sprint start

Identify participating components and their responsibilities, then specify:

- Direction and purpose of communication.
- Mechanism or protocol and principal operations.
- Data crossing the boundary, identifiers, ownership, and security assumptions.
- Success, failure, retry, and compatibility semantics where applicable.
- Authoritative contract artifact and unresolved details.

Use machine-readable contracts when practical: OpenAPI, JSON Schema, message or persistence schemas.
Concise Markdown is acceptable when a formal format is not justified.
Unknown details may remain only if both sides share enough architectural intent to proceed.
Use the [component card](../templates/component.md) and [contract template](../templates/contract.md).

## Implementation and closure

Evolve contracts explicitly; never silently invent or reinterpret the opposite side.
Material changes follow document and scope review before dependent implementation.
Review both sides for conformance, identifiers, compatibility, errors, security, and failure behavior.
The final contract must represent the shipped interface; unresolved contract drift blocks closure.
