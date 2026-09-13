# End-to-End Happy Path Gate

From the first vertical increment, provide one non-interactive command that runs the assembled system locally and reports PASS or FAIL.

## Requirements

- Build the walking skeleton before adding features.
- Extend the suite in each sprint that changes observable behavior.
- Exercise production composition; label simulated external edges explicitly.
- Emulated services and replayed inputs are acceptable; mocked internals do not prove integration.
- Run in minutes on ordinary developer hardware.
- Isolate the suite from live infrastructure, real credentials, and production data.
- Plans name the suite to extend or explain why no end-to-end change applies.
- Delivered-scope reports contain the actual command, environment, result, and evidence.
- Independent review reproduces the run before recommending acceptance.
- Missing, failed, or skipped checks remain explicit gaps.

## Local inventory and stable promotion

The local gate is npm run test:e2e; record the exact revision and current result each run.
Run typecheck, unit and Firestore rules checks as required by the affected sprint.
Local/emulated checks do not replace real-user testing for promotion to main.
Follow the [main promotion gate](branch-lifecycle.md) for hosted/device evidence and human approval.
