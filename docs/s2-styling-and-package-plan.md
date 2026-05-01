# S2 Styling Plan

This file is a pointer, not the full plan.

The controlling decision is
[`ADR 0001: S2 Styling Source Of Truth`](./adr/0001-s2-styling-source-of-truth.md).

## Current Rule

`solid-spectrum` styling comes from an S2-compatible tokens/theme/style
declaration system. The comparison app verifies parity; it does not implement
component styling.

## Current Migration State

- The existing app-local Spectrum skin is legacy.
- Components still depending on it should be treated as missing/gap during the
  reset.
- Provider/theme is the first target for the corrected styling system.
