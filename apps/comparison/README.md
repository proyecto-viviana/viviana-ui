# Comparison App

This Astro app is the side-by-side parity harness for React Spectrum and
Proyecto Viviana.

## Scope

- External dependencies are intended to stay local to `apps/comparison`.
- The Solid layers are resolved from the repo source via Vite aliases.
- The app is intentionally separate from the root Deno workspace so it can
  evolve without affecting `apps/web`.
- Astro stays app-local. Cloudflare runtime tooling stays at the monorepo root
  with the rest of the repo.
- `deno task` remains the command entrypoint from the repo root, but
  installation is delegated to local `npm` so the Astro package set stays
  inside this app.
- The app ships an app-local `.npmrc` with `workspaces=false` to stop npm from
  traversing the root monorepo workspace during install.

## Commands

From the monorepo root:

```bash
deno task comparison:install
deno task comparison:dev
```

Root-level commands also exist for:

```bash
deno task comparison:build
deno task comparison:preview
deno task comparison:check
deno task comparison:dev:worker
deno task comparison:deploy
```

The root wrappers build the local Proyecto Viviana package outputs first so the
comparison app always consumes current local package builds.

```bash
cd apps/comparison
deno task install
deno task dev
```

Additional tasks:

```bash
deno task check
deno task build
deno task preview
deno task dev:worker
deno task deploy
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
deno task comparison:install
deno task comparison:deploy
```

Or from inside `apps/comparison`:

```bash
deno task install
deno task deploy
```

For local Worker-style runtime validation, use:

```bash
deno task comparison:dev:worker
```

Optional:

```bash
deno task comparison:types
```

`wrangler types` is useful for generated binding types, but it is not required
for deployment.

## Root Command Note

The root runner is:

```bash
deno task comparison:dev
```

The earlier root failure came from Deno trying to resolve a new npm dependency
from the root workspace lock when `@astrojs/cloudflare` was added only inside
this app. Keeping Astro local and Cloudflare deployment separate avoids that
coupling.
