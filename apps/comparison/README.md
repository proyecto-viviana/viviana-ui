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
pnpm run comparison:install
pnpm run comparison:dev
```

Root-level commands also exist for:

```bash
pnpm run comparison:build
pnpm run comparison:preview
pnpm run comparison:typecheck
pnpm run comparison:dev:worker
pnpm run comparison:deploy:dry-run
pnpm run comparison:deploy
```

The root wrappers invoke Astro or Wrangler directly; they do not rebuild the
Proyecto Viviana packages first.

```bash
cd apps/comparison
pnpm install
pnpm run dev
```

Additional tasks:

```bash
pnpm run typecheck
pnpm run build
pnpm run preview
pnpm run dev:worker
pnpm run deploy:dry-run
pnpm run deploy
```

## Current Coverage

The scaffold includes live comparisons for:

- `Provider` on the styled layer
- `Button` on the styled, component, and headless layers
- React `Popover` on the component layer
- React `Tabs` on the styled and component layers

The rest of the manifest is intentionally explicit about gaps so the app doubles
as a parity backlog.

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
pnpm run comparison:install
pnpm run comparison:deploy
```

Or from inside `apps/comparison`:

```bash
pnpm install
pnpm run deploy
```

For local Worker-style runtime validation, use:

```bash
pnpm run comparison:dev:worker
```

Optional:

```bash
pnpm run comparison:types
```

`wrangler types` is useful for generated binding types, but it is not required
for deployment.

## Root Command Note

The root runner is:

```bash
pnpm run comparison:dev
```

Keeping Astro local and Cloudflare deployment separate avoids root workspace
coupling with this app's dependency graph.
