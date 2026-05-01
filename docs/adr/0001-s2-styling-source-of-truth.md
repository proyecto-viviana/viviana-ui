# ADR 0001: S2 Styling Source Of Truth

## Decision

`solid-spectrum` must implement Spectrum 2 styling from the same kind of source
Adobe uses:

```text
S2 tokens/theme/helpers
-> component style declarations
-> style macro/compiler
-> generated atomic CSS
```

Generated classes are build output. They are not the architecture.

## Rules

- Do not implement S2 component styling by hand.
- Do not tune handwritten colors, padding, radius, or state CSS to make
  screenshots pass.
- Do not add new `.comparison-spectrum-*` component-internal styling.
- Comparison CSS may style the docs shell, controls, panels, and screenshot
  frame only.
- Components not migrated to the S2-compatible style system must be marked
  missing/gap.

## Context Recovery

If context is lost, read this ADR before doing styled component work. Restore the
S2-compatible style system first, then migrate components.
