# Screen Reference and Next Technical Proof

Status: proposed proof scope; no technical validation claimed.
Source: [implementation guide](../reference/product-baseline.md).

## Visual reference

The supplied narrative records agreement on:
- Compact header: LifeBuckets, avatar P, and open date.
- Dark subtly textured category rows and lighter lucket rows.
- In-place expansion with full-width rows and no progressive indentation.
- ID, condition square, action circle, name, then flexible useful details.
- Font-sized indicators with thin black outlines.

The linked guide contains the reference illustrations.
Its text was read; the images have not been visually verified in this repository task.
Mockups describe layout and interaction, not working authentication, persistence, synchronization, or closing.

## Next technical proof

Hypothesis: after one authenticated online load on a trusted device, the application shell, owner hierarchy, and explicit open date survive an offline application restart.
Use synthetic data and an isolated local environment.
Load a small representative hierarchy, persist an older business day, go offline, and restart the app.
Observe the same owner-scoped rows and unchanged day; confirm expanded rows remain usable.
Exercise missing/evicted cache and unsupported persistence without claiming unavailable data is loaded.
Record commands, build identity, fixtures, evidence, failures, and the decision to proceed or revise architecture.
This proof is planned; no PASS result exists.
