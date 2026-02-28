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

## GitHub Automation

On `push` to `main`, the `Release` workflow handles registry publishing in two stages:

1. If unpublished changesets are present, it creates or updates the Changesets version PR.
2. When that version PR is merged into `main`, it publishes the changed npm packages first, then publishes the matching JSR packages.

This means:

- a normal feature PR merge to `main` triggers release automation
- the actual registry publish happens when the generated version PR merges
- JSR publishing is scoped to the packages that Changesets actually published to npm

One-time GitHub setup:

- add `NPM_TOKEN` with npm publish access
- no `JSR_TOKEN` is required when publishing from GitHub Actions via JSR's OIDC flow
- the workflow must keep `id-token: write`

## Silapse Bootstrap

`@proyecto-viviana/silapse` is a new package name. The currently published upstream package is still `@proyecto-viviana/ui`, so `silapse` needs one-time bootstrap setup on both registries.

JSR bootstrap:

1. Create `@proyecto-viviana/silapse` in JSR.
2. Link the package to this GitHub repository in JSR package settings.
3. After that, the `Release` workflow can publish `silapse` from GitHub Actions without a JSR token by using OIDC.

npm bootstrap:

1. Publish the first `@proyecto-viviana/silapse` release so the package exists on npm.
2. Until that first publish exists, keep `NPM_TOKEN` in GitHub Actions for npm publication.
3. After the package exists, configure npm trusted publishing for `.github/workflows/release.yml` if you want to remove `NPM_TOKEN` later.

Important npm limitation:

- npm trusted publishing cannot configure a package that does not exist yet, so it does not solve the very first `silapse` publish by itself.

After bootstrap:

- npm does not rename packages in place. Keep `@proyecto-viviana/ui` as the old package name, publish `@proyecto-viviana/silapse` as the new package, and deprecate `@proyecto-viviana/ui` with a migration message.
- JSR also treats `silapse` as a separate package. Create and publish `@proyecto-viviana/silapse`, then archive `@proyecto-viviana/ui` if you want to stop new releases there.

## Workspace Scope

- Root npm workspace management covers `packages/*` and `apps/web`.
- `apps/comparison` is intentionally managed as a standalone app and keeps its local `file:` package links outside the release workspace scope.
