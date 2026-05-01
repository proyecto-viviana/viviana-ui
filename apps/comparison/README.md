# Comparison App

Side-by-side parity harness for Adobe React Spectrum S2 and
`@proyecto-viviana/solid-spectrum`.

## Rule

The comparison app verifies S2 parity. It must not implement S2 component
styling.

Read
[`docs/adr/0001-s2-styling-source-of-truth.md`](../../docs/adr/0001-s2-styling-source-of-truth.md)
before adding styled component work.

## Commands

```bash
vp run comparison:dev
vp run comparison:build
vp run comparison:typecheck
vp run comparison:report:gaps
vp run comparison:test:default
vp run comparison:test:button
```

## Coverage

Routes are generated from the official React Spectrum S2 catalogue. Missing
Solid implementations stay visible as gaps.

Use the gap report as the roadmap:

```bash
vp run comparison:report:gaps
```

## CSS Boundary

Allowed comparison CSS:

- page shell
- controls
- panels
- screenshot frames

Not allowed:

- component colors
- component padding
- component radius
- component visual states
- new `.comparison-spectrum-*` component-internal rules
