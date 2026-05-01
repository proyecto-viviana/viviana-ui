# Component Parity Playbook

Use this checklist for each React Spectrum S2 component before calling a
comparison entry complete.

## 1. Establish The Reference

- Start from the official React Spectrum S2 catalogue order in
  `src/data/comparison-manifest.ts`.
- The React side must import the real S2 component from `@react-spectrum/s2`.
  Do not approximate it with React Aria Components unless the matrix marks that
  layer separately.
- Match the S2 docs example for the canonical fixture. If a component has
  important variants, add them deliberately and name them in the state matrix.
- Keep the comparison canvas to the component itself. Do not add decorative
  gradients, helper cards, or app-only styling inside the component fixture.
- Mirror the official S2 props and TypeScript names. Compatibility aliases are
  allowed in Solid Spectrum, but the comparison controls and fixtures use the S2 API
  names first.

## 2. Wire Matching Behavior

- Give both React and Solid fixtures the same labels, values, selected keys,
  disabled flags, open state, and callbacks.
- Theme is behavior, not page chrome. The docs shell, prop viewer, React S2
  fixture, and Solid fixture must all consume the same `system | light | dark`
  signal from `src/scripts/docs-theme.ts`.
- Add a docs-style props panel when the component has meaningful visual props.
  Controls should dispatch one typed payload that both React and Solid fixtures
  consume, and the route query string should reproduce the same state.
- Expose state through `data-comparison-*` attributes so Playwright can assert
  behavior without relying on pixels.
- For overlays, assert open state, outside-click dismissal, Escape dismissal,
  focus containment, and focus return.
- For fields and selection components, assert value changes, keyboard paths,
  disabled/read-only behavior, and selection updates.

## 3. Measure Before Styling

- Inspect the React S2 side in browser with the reusable component controls and
  record computed styles for the default state and every state being
  implemented. Ad-hoc Playwright inspection is only the discovery step; promote
  useful checks into a fixture, a state-matrix row, and a committed spec.
- Copy the visible contract into the Solid S2 skin: geometry, slot layout,
  typography, colors, focus rings, transforms, overlays, and disabled treatment.
- Prefer real package APIs and shared helpers. Only use app-local CSS when this
  comparison app is intentionally skinning a headless Solid component to match
  S2.

## 4. Keep Source Clean

Cleanup is part of parity work. Every component pass should leave the touched
code easier to audit against S2:

- Remove comments that restate imports, JSX shape, prop names, obvious branches,
  sub-component attachment, or re-export mechanics.
- Keep comments only for non-obvious S2 parity choices, accessibility constraints,
  Solid reactivity traps, browser/workaround behavior, and intentional deviations.
- Prefer small local helpers and render-state class functions over repeated
  string assembly when that makes state styling easier to compare.
- Keep documentation examples in docs or tests, not long component-source
  docblocks.
- Do not mix behavior changes into cleanup unless the component pass explicitly
  covers and tests that behavior.

## 5. Add State Coverage

For every state, add both:

- A Playwright behavior assertion when the state changes through interaction.
- A screenshot assertion when the state has any visual output.
- For time-based states, cover each visible phase separately. For example,
  Button pending has both an immediate pending state and a delayed spinner state.

Typical visual states:

- default
- hover
- pressed
- focus-visible
- disabled
- selected/checked/invalid/current
- open overlay
- keyboard navigation intermediate state
- loading/pending, if the S2 component supports it
- light and dark color schemes for every styled component. Keep existing visual
  states deterministic by pinning their scheme, and add explicit light/dark
  coverage instead of inheriting the runner machine's system preference.

Every React-vs-Solid screenshot comparison is strict: `maxMismatchRatio: 0`,
`maxDimensionDelta: 0`, and `pixelThreshold: 0`.

Use the shared helpers in `e2e/visual-diff.ts` for new component visual tests:
`pinComparisonTheme`, `expectScreenshotPair`,
`expectPreparedScreenshotPair`, and `compareScreenshots`. Component specs
should not reimplement pixel diff logic or their own theme initialization.

For controlled props, add at least one Playwright assertion that changing the
docs-style controls updates both implementations. When a prop produces a visual
state, add or plan the matching strict pair screenshot row in the matrix.
Capture each side once per assertion and use that same buffer for both the
committed snapshot and the React-vs-Solid pair diff, so timing-sensitive states
cannot pass the snapshot and fail the pair diff against a different frame.
Run the React-vs-Solid pair diff before `toMatchSnapshot`; stale baselines
should not hide a real implementation mismatch.

When a screenshot helper normalizes coordinates, preserve the rendered
state before the move: class, data attributes, and inline style. React Spectrum
can drop transient `data-pressed` and transform styles when a live element is
repositioned. Time-delayed states must wait for the intended visible phase
before capture, such as waiting for pending progressbars before snapshotting a
spinner state.

## 6. Update The Matrix

Update `src/data/visual-state-matrix.ts` in the same change:

- `snapshotted` only when committed screenshots exist for both sides.
- `asserted` only when a behavior test exists.
- `planned` when the state is known but not implemented yet.
- `missing` when one implementation cannot render the state yet.
- `blocked` when strict pair diff cannot be meaningful yet.

Large mismatches are failures for implemented states. They should never be
documented as acceptable drift.

## 7. Validate The Component

Run the component-specific loop first, then the broader app checks:

```bash
vp run comparison:typecheck
vp run comparison:test:theme
vp run comparison:test:<component>
vp run comparison:report:gaps
```

The comparison Playwright scripts build before previewing. Do not run visual
tests against a stale `dist` directory.

When snapshots intentionally change:

```bash
COMPARISON_BASE_URL=http://127.0.0.1:4325 vp exec --filter @proyecto-viviana/comparison -- playwright test <spec> --update-snapshots
```

Finish by running the strict pair diff for the component route. The full
`comparison:test:pair` suite is allowed to fail only for components whose matrix
still marks gaps or planned work.

## Button Pilot

Button is the pilot for this process:

- `src/data/button-demo.ts` is the typed control model for the Button route and
  uses React Spectrum S2 names: `variant`, `fillStyle`, `size`, `staticColor`,
  `isDisabled`, and `isPending`.
- `e2e/button-visual.spec.ts` covers default, hover, focus-visible, and pressed
  screenshots with strict pair diffs, asserts that the prop controls update both
  stacks, and snapshots the documented visual prop matrix: variants in fill and
  outline, sizes, staticColor values, disabled, immediate pending, and delayed
  pending spinner.
- `e2e/button-family-contract.spec.ts` asserts the Button press callback and the
  S2 pending behavior: pending remains focusable while suppressing press actions.
- The Button example owns the first theme contract: the page-level theme control
  drives the React `SpectrumProvider` color scheme and the Solid S2 comparison
  skin together.
- Button is not considered complete if a documented visual prop or visible
  intermediate state exists without a strict React-vs-Solid pair diff row in
  `src/data/visual-state-matrix.ts`.
