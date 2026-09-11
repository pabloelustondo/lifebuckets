# Sprint 001 — Local Review Setup

This is a local emulator build, using synthetic data. No live Firebase project is configured.
Use Node 22.12+ or Node 24, Java 21, and npm. Validation used Node 24.19.0.

## First installation

From the repository root:

```sh
npm ci --include=dev
PLAYWRIGHT_BROWSERS_PATH=.cache/browsers npx playwright install chromium
npx firebase setup:emulators:firestore
```

These prerequisite downloads need internet access. Dependencies are pinned in package-lock.json.
The normal gate uses demo-lifebuckets and local emulators, not live credentials.

## Open the review build

```sh
npm run local
```

Open http://127.0.0.1:4173 after the command reports that fixtures and the server are ready.
Sign in with owner@example.test and password review-only-123 (synthetic, emulator-only).
Use colors@example.test for illustrative colors; all sample accounts use the same local password.
Other cases: other@example.test, empty@example.test, missing@example.test, malformed@example.test, mismatch@example.test.
Account registration and business-data editing are intentionally unavailable.
The business day is explicitly seeded as 2026-09-09.

Check “Remember data on this trusted device” to enable offline browser restart.
Without it, the session ends on reload and offline restart is not promised.
Once server data has loaded and the app shell has installed, restart the browser with networking disabled.
Use the P avatar to sign out; this removes visible owner data and clears persistent personal data.
If cleanup is blocked, close other LifeBuckets tabs and retry; account switching remains locked.

Ctrl+C stops the local services. Stop this command before running gates; occupied ports are rejected.
Re-running npm run local recreates the synthetic fixture records in the dedicated emulators.
Ports: app 4173, Authentication 9099, Firestore 8080, all bound to 127.0.0.1.

## Validation

```sh
npm run typecheck
npm run test:unit
npm run test:rules
npm run test:e2e
```

The end-to-end command builds, starts emulators, seeds, runs Chromium, retains diagnostics, and stops services.
Build output is build/client; npm run preview serves it without starting emulators.
Firebase Hosting configuration is prepared; deployment and real account/data setup require separate work.
