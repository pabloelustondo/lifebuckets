# Production Configuration — Progress

Date: 2026-09-11. Approved task baseline: `40a9c60`.
Target: personal production, Firebase `lifebuckets-bd43d`.

## Completed locally

- Separated demo emulator configuration from production public SDK configuration.
- Added strict project/auth-domain validation and a named `build:production` command.
- Production builds reject missing configuration before building an artifact.
- Session initialization and interrupted cleanup use the same selected Firebase identity.
- Added configurable Google popup or email/password sign-in; cloud provider selection remains pending.
- Kept local synthetic sign-in labels out of the production UI.
- Preserved local color saves and the explicit disclosure that server synchronization is not connected.

## Verification

`npm run typecheck`: passed.
`npm run test:unit`: 18 passed.
`npm run test:e2e`: 18 passed, with a rebuilt local artifact and isolated demo emulators.
`node scripts/check-production.mjs` with absent production configuration: correctly refused the build.
Browser run: [log](production-config-evidence/browser-run.log).
Google popup API reference: https://firebase.google.com/docs/auth/web/google-signin.
No production build or live sign-in has been validated yet; registered web app configuration is still absent.

## Awaiting required user details

Asked whether to use Google sign-in, the current 49-lucket structure with blank colors, and Montréal, Canada.
Asked which Google email should own the records. No answer received when this progress note was written.
The committed deployment tasks explicitly require these choices before cloud resource creation.
No production resources, personal records, rules, or Hosting releases were changed.
