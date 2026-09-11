# LifeBuckets

A read-only life map with an explicit business day and trusted-device offline access.
Sprint 001 is implemented locally; independent review and human acceptance remain pending.

## Run locally

Use Node 22.12+ or Node 24, Java 21, and npm.
Follow the [setup guide](docs/09-build-and-test/sprint-001-setup.md), then run:

```sh
npm run local
```

Open http://127.0.0.1:4173 and sign in with the synthetic account owner@example.test / review-only-123.
Use colors@example.test for illustrative indicators; the same local password applies.
No live Firebase deployment or personal-data import is configured.

## Review

- [Delivered scope](docs/09-build-and-test/sprint-001-delivered-scope.md)
- [Test report](docs/09-build-and-test/sprint-001-test-report.md)
- [SDLC2 documentation](docs/README.md) and [agent rules](AGENTS.md)

Agents do not commit, push, merge, or deploy this work.
