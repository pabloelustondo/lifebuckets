# Environment Separation

Declare each environment in the repository before deployment.
Bind deployment authority and evidence to that environment's exact infrastructure identity.

## Declaration

Use the [environment template](../templates/environment.md) under Operational Reality.
Name the environment, infrastructure identifiers, purpose, data classification, and deployment authority.
One infrastructure identity serves one environment; an undeclared environment cannot receive a deployment.
Do not infer an environment designation from a project name or a work order.

## Boundaries

Test environments contain no production data; permitted load, failure, and destructive tests need declared scope.
Create production deliberately on separate infrastructure; never rename a test environment to production.
Production deployment requires release-specific authorization and minimal agent access.
Decide privacy, residency, retention, and access before introducing real user data.
If repository, work order, and infrastructure disagree, stop the affected deployment and report the contradiction.
Environment creation and promotion are recorded human decisions, not incidental deployment steps.

## Evidence

Every operational or deployment record names its environment and exact revision.
A passing test-environment result qualifies that environment only.
No deployment environment or deployment authority is declared by this methodology setup.
