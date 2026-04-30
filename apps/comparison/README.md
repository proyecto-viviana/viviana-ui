# Comparison App

This Astro app is the side-by-side parity harness for React Spectrum and
Proyecto Viviana.

## Scope

- External dependencies are intended to stay local to `apps/comparison`.
- The Proyecto Viviana packages are installed into this app as local `file:`
  dependencies so the app resolves them through package metadata, like
  `apps/web`, instead of bespoke Vite aliases.
- The app is intentionally separate from the root pnpm workspace so it can
  evolve without affecting `apps/web`.
- Astro stays app-local. Cloudflare runtime tooling stays at the monorepo root
  with the rest of the repo.
- Root commands forward into this app's local `package.json` scripts, while
  dependency installation stays local so the Astro package set remains
  isolated from the publishable package workspace.

## Commands

From the monorepo root:

```bash
vp run comparison:install
vp run comparison:dev
```

Root-level commands also exist for:

```bash
vp run comparison:build
vp run comparison:preview
vp run comparison:typecheck
vp run comparison:dev:worker
vp run comparison:deploy:dry-run
vp run comparison:deploy
```

The root wrappers invoke Astro or Wrangler directly; they do not rebuild the
Proyecto Viviana packages first.

```bash
cd apps/comparison
pnpm install
vp run dev
```

Additional tasks:

```bash
vp run typecheck
vp run build
vp run test:contract
vp run test:default
vp run test:buttons
vp run preview
vp run dev:worker
vp run deploy:dry-run
vp run deploy
```

## Current Coverage

The manifest starts from the official React Spectrum S2 component catalogue in
documentation order. Every official entry gets a route; entries without a wired
React Spectrum reference and Solid parity demo stay visible as non-failing gaps.

Use the gap report to see the current roadmap shape:

```bash
vp run comparison:report:gaps
```

The report separates route coverage from visual state coverage:

- missing official React Spectrum entries stay non-failing roadmap gaps
- committed screenshots are counted only when both React and Solid baselines
  exist
- every implemented React/Solid visual state must also have a strict
  zero-tolerance pair diff; mismatches fail the comparison test instead of being
  accepted as visual drift

The first live official comparisons include:

- `Provider` on the styled layer
- `ActionButton`, `ActionButtonGroup`, `ButtonGroup`, and `ToggleButton` on the
  styled layer
- `Button` on the styled, component, and headless layers
- `Tabs` on the styled and component layers
- `TextField`, `Checkbox`, `Dialog`, `DatePicker`, `SearchField`, and `Tooltip`
  on the styled layer
- `Toast` on the Solid styled layer, with the React Spectrum reference still
  tracked

Legacy routes such as `Select`, `Radio`, `Table`, `Tree`, and `Toolbar` are
retained for continuity, but the official S2 entries remain the source of truth
for roadmap status.

## What The App Imports

The app is using the real local Proyecto Viviana packages, not copied component
code:

- Styled layer imports `@proyecto-viviana/silapse`
- Headless component layer imports `@proyecto-viviana/solidaria-components`
- ARIA/headless primitive layer imports `@proyecto-viviana/solidaria`

Those package names resolve through app-local `file:` dependencies, matching the
package-oriented setup already used by `apps/web`.

The only app-local code is the comparison shell, fixture data, route manifest,
and minimal mount wrappers that place React and Solid examples side by side.

The current imports are visible in:

- [`src/components/solid/ComparisonIsland.tsx`](./src/components/solid/ComparisonIsland.tsx)
- [`src/components/react/ComparisonIsland.jsx`](./src/components/react/ComparisonIsland.jsx)

## Visual Reference Contract

Every live comparison cell is wrapped in a `.comparison-reference-frame` and
declares:

- `data-comparison-contract`
- `data-comparison-component`
- `data-comparison-framework`
- `data-comparison-layer`
- `data-comparison-reference`

The shared contract lives in
[`src/data/comparison-contract.ts`](./src/data/comparison-contract.ts). It is the
single place for fixture data, Spectrum-skin class names, and the rule that says
whether a cell is real React Spectrum, the Spectrum skin adapter, Silapse,
React Aria Components, or solidaria-components.

Use the contract test whenever a component is added or moved to `live`:

```bash
vp run comparison:test:contract
```

Pixel tests can still compare individual components, but this guard catches the
systemic failure mode where one side silently renders in the app chrome instead
of the intended reference surface.

Component state coverage lives in
[`src/data/visual-state-matrix.ts`](./src/data/visual-state-matrix.ts). Add a
state there whenever a visual or behavioral state is covered, and commit the
Playwright snapshots next to the spec when the state is visual.

Use [`COMPONENT_PLAYBOOK.md`](./COMPONENT_PLAYBOOK.md) as the repeatable
component-by-component process for establishing the S2 reference, matching Solid
behavior, adding screenshots, and marking gaps.

Default static screenshots for live official components are covered by:

```bash
vp run comparison:test:default
```

Button-family interaction contracts are covered by:

```bash
vp run comparison:test:buttons
```

The Button pilot has a focused visual and behavior loop:

```bash
vp run comparison:test:button
```

## Validation Notes

- The Solid comparison root now mounts cleanly in preview; the earlier
  `React is not defined` runtime failure is resolved.
- Live status is intentionally conservative. Only the Solid demos that were
  validated in-browser are marked `live`; context-heavy overlay and collection
  demos remain `tracked` until they are verified in this app.

## Cloudflare Worker Deploy

The deploy target is a regular Cloudflare Worker plus static assets:

- Astro builds static files into `dist/`
- [`src/worker.ts`](./src/worker.ts) serves those files through the `ASSETS`
  binding
- [`wrangler.jsonc`](./wrangler.jsonc) is app-scoped, but `wrangler` itself is
  expected from the monorepo root like the other Cloudflare apps in this repo

This app does not need Astro's Cloudflare adapter because the comparison
surface is static and the Worker is only acting as an asset host.

Typical flow:

```bash
vp run comparison:install
vp run comparison:deploy
```

Or from inside `apps/comparison`:

```bash
pnpm install
vp run deploy
```

For local Worker-style runtime validation, use:

```bash
vp run comparison:dev:worker
```

Optional:

```bash
vp run comparison:types
```

`wrangler types` is useful for generated binding types, but it is not required
for deployment.

## Root Command Note

The root runner is:

```bash
vp run comparison:dev
```

Keeping Astro local and Cloudflare deployment separate avoids root workspace
coupling with this app's dependency graph.
