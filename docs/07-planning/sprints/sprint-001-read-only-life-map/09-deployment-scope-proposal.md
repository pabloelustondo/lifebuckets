# Sprint 001 — Deployment Scope Proposal

Status: PROPOSED extension beyond the committed emulator-only scope.
Authority: user requested deployment on 2026-09-11; no second deployment permission is needed for the agreed concrete target.
The environment designation, account/data setup, and database region still require definition.
Read the [verified preflight](../../../11-operational-reality/deployment-preflight-2026-09-11.md).

## Intended outcome

A functioning HTTPS LifeBuckets application on the existing Hosting site, using its own Firebase services.
Preserve the verified read-only map and offline behavior.

## Required changes

- C-DATA: separate explicit emulator and hosted configurations, including cleanup database identity.
- C-APP: provide hosted build configuration and correct environment labels; keep emulator tests isolated.
- Register a Firebase web application and use its verified public SDK configuration.
- Enable the required Firestore service and establish a database only after selecting its environment/region.
- Configure the approved sign-in method, provision an authorized account, and establish initial owner data/date.
- Preserve C-RULES owner-scoped reads and denied client business-data writes; deploy only to the named target.
- Keep existing demo fixture tooling emulator-only; define any hosted seed separately for the selected data boundary.

## Acceptance

Repeat unit, security-rule, and browser gates for the configuration change.
Verify the hosted build contains no active loopback service endpoints.
After deployment, verify HTTPS loading, authorized sign-in, correct owner rows/date, and offline reopening.
Record exact built artifact identity, deployed version, environment, and actual smoke results.
Have a rollback procedure tied to the Hosting release and any separately changed service configuration.

## Review boundary

Current staged implementation/documentation still needs Pablo's commit.
This proposal must be reviewed and committed before dependent executable changes under repository governance.
Ordered implementation Tasks follow approval of this scope extension.
No cloud resources, user records, rules, or Hosting releases have been changed by this proposal.
