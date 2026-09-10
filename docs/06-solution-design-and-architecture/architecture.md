# First-Screen Architecture

Status: proposed baseline; field names and component boundaries require review.
Source: [product baseline](../reference/product-baseline.md).

## Starting stack

React and TypeScript; React Router framework mode with Vite; client rendering initially.
Tailwind CSS and shadcn/ui where useful; focused React state/hooks, no Redux by default.
Firebase Authentication, Firestore, and Firebase Hosting.
Verify compatible stable versions during scaffolding and retain the lockfile.

## Responsibilities

Keep screen rendering separate from data access.
Candidate UI modules: LifeBucketsScreen, CompactHeader, CategoryGroup, LucketRow, StatusIndicator.
Use a focused data/open-day hook and a Firestore module.
These are proposed module names, not yet an approved component catalogue or task ownership map.
Use the browser Firebase SDK for normal reads/writes under owner-scoped rules.
Add a server service only for integrations or privileged operations that require it.

## Persistence and offline behavior

See the [data contract proposal](data-model.md).
Enable persistent Firestore caching explicitly on trusted devices and preload the small owner hierarchy.
Cache the application shell separately with a service worker.
Previously unseen or evicted data may be unavailable offline; handle unsupported caching honestly.
Show local/pending state until server acknowledgement; surface rejected writes without expanding the compact header.
Define sign-out/cache cleanup before persistent personal data ships.
Authentication checks still apply on offline reopening.
Synchronization does not provide semantic conflict merging; ordinary transactions cannot promise offline closing.

## Target boundary

The supplied target project is lifebuckets-bd43d; its live identity/configuration has not been verified here.
Its TEST/production designation and deployment authority are unresolved.
This target reference is not an environment declaration or deployment authorization.
