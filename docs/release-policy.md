# Release Policy

## Source Of Truth

- `package.json` is the source of truth for releasable package `name`, `version`, `description`, and npm dependency ranges.
- `deno.json` and `jsr.json` mirror release metadata for Deno/JSR packages and must stay aligned with the corresponding `package.json` where fields overlap.
- Do not hand-edit releasable package versions in `deno.json` or `jsr.json`.
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

Recommended local flow:

1. Add or merge Changesets for releasable npm packages.
2. Run `npm run release:prepare`.
3. Review the generated version, changelog, and manifest updates.
4. Run `npm run release:publish` when the tree is ready to publish.

If you want the full end-to-end flow in one command, run `npm run release`.

What `npm run release:prepare` does:

1. Runs `npm run changeset:version` to apply package version bumps and changelog updates.
2. Runs `npm run check:manifest-versions` to verify Deno/JSR metadata mirrors match `package.json`.
3. Runs `npm run build`.
4. Runs `bun run vitest run`.
5. Runs `npm run jsr:dry-run` in dependency order.

PR enforcement:

- The `Release Readiness` workflow mirrors the non-publishing checks from `npm run release:prepare`.
- It validates manifest sync, build health, the Vitest suite, and JSR dry-run packaging on pull requests without mutating versions or publishing packages.

What `npm run release:publish` does:

1. Publishes npm packages through Changesets.
2. Publishes JSR packages separately in dependency order.

What `npm run release` does:

1. Runs `npm run release:prepare`.
2. Runs `npm run release:publish`.

## Workspace Scope

- Root npm workspace management covers `packages/*` and `apps/web`.
- `apps/comparison` is intentionally managed as a standalone app and keeps its local `file:` package links outside the release workspace scope.
