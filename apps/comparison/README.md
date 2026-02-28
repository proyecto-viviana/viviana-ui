# Comparison App

This Astro app is the side-by-side parity harness for React Spectrum and
Proyecto Viviana.

## Scope

- External dependencies are intended to stay local to `apps/comparison`.
- The Solid layers are resolved from the repo source via Vite aliases.
- The app is intentionally separate from the root Deno workspace so it can
  evolve without affecting `apps/web`.
- `deno task` remains the command entrypoint, but installation is delegated to
  local `npm` so the package set stays inside this app.
- The app ships an app-local `.npmrc` with `workspaces=false` to stop npm from
  traversing the root monorepo workspace during install.

## Commands

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
```

## Current Coverage

The scaffold includes live comparisons for:

- `Provider` on the styled layer
- `Button` on the styled, component, and headless layers
- React `Popover` on the component layer
- React `Tabs` on the styled and component layers

The rest of the manifest is intentionally explicit about gaps so the app doubles
as a parity backlog.

## Validation Notes

- The Solid comparison root now mounts cleanly in preview; the earlier
  `React is not defined` runtime failure is resolved.
- Live status is intentionally conservative. Only the Solid demos that were
  validated in-browser are marked `live`; context-heavy overlay and collection
  demos remain `tracked` until they are verified in this app.
