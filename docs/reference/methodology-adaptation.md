# Methodology Adaptation Record

Date: 2026-09-10.
Requested scope: bring the methodology, documentation structure, rules, and templates into LifeBuckets.

## Source inspected

The local AI Shop checkout was clean at commit a13c2c5.
Read its root AGENTS.md, docs index, lifecycle READMEs, governance documents, sprint registry, current sprint format, component architecture, and component-contracts-rule.
Source repository: https://github.com/pabloelustondo/aishop
No source files were modified.

## Adaptation decisions

- Retained the twelve lifecycle areas and the separate governance area.
- Retained human commit approval, separate Plan and Tasks review, component-scoped work, end-to-end proof, and environment separation.
- Used the root rule's decision-document-only 50-line limit; the older workflow's broader text-file limit was inconsistent with it.
- Converted the standalone component contract rule into a linked governance document.
- Omitted retired reviewer-initial fields and the historical reconciliation narrative.
- Omitted draft exact-hash/initials approval and NEXT_WORK_ITEM activation machinery; these were explicitly non-authoritative drafts in the source.
- Retained independent review as a workflow step without promoting the source's draft activation protocol.
- Created reusable blank templates from the artifact definitions; did not copy completed source sprint records.
- Copied no product architecture, component names, infrastructure identifiers, deployment grants, credentials, private fixtures, benchmark results, or historical approvals.

## Current boundary

This is methodology setup only. No application, real-data seed, Sprint One plan, or environment declaration is created.
The supplied implementation guide can inform subsequent planning; it is not silently converted into approved repository scope.
All new governance contents remain uncommitted proposals until Pablo reviews and commits them.
