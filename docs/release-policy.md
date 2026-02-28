# Release Policy

## Source Of Truth

- `package.json` is the source of truth for releasable package `name`, `version`, `description`, and npm dependency ranges.
- `deno.json` and `jsr.json` mirror release metadata for Deno/JSR packages and must stay aligned with the corresponding `package.json` where fields overlap.
- The canonical license declaration is the root `LICENSE` file plus the package manifest metadata that points to it.
- Versioning is independent per releasable package. This repository does not use lockstep versioning.
- Release intent for npm packages is expressed through Changesets.

## Release Matrix

| Workspace | Classification | Registry target | Privacy | Versioning |
| --- | --- | --- | --- | --- |
| `packages/solid-stately` | releasable | npm + JSR | public | independent |
| `packages/solidaria` | releasable | npm + JSR | public | independent |
| `packages/solidaria-components` | releasable | npm + JSR | public | independent |
| `packages/silapse` | releasable | npm + JSR | public | independent |
| `packages/solidaria-test-utils` | private/test-only | none | private | n/a |
| `packages/silapse-test-utils` | private/test-only | none | private | n/a |
| `apps/web` | app-only | none | private | n/a |
| `apps/comparison` | app-only | none | private | n/a |

## Release Flow

1. Add or merge Changesets for releasable npm packages.
2. Run manifest/version consistency checks before versioning.
3. Run Changesets versioning for npm package manifests and changelogs.
4. Synchronize mirrored Deno/JSR manifest fields from package manifests.
5. Publish npm packages through Changesets.
6. Publish JSR packages separately in dependency order.

## Workspace Scope

- Root npm workspace management covers `packages/*` and `apps/web`.
- `apps/comparison` is intentionally managed as a standalone app and keeps its local `file:` package links outside the release workspace scope.
