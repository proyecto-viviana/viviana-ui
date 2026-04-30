# Release Policy

## Source Of Truth

- `package.json` is the source of truth for releasable package `name`, `version`, `description`, and npm dependency ranges.
- The canonical license declaration is the root `LICENSE` file plus the package manifest metadata that points to it.
- Versioning is independent per releasable package. This repository does not use lockstep versioning.
- Release intent for npm packages is expressed through Changesets.

## Release Matrix

| Workspace                            | Classification    | Registry target | Privacy | Versioning  |
| ------------------------------------ | ----------------- | --------------- | ------- | ----------- |
| `packages/solid-stately`             | releasable        | npm             | public  | independent |
| `packages/solidaria`                 | releasable        | npm             | public  | independent |
| `packages/solidaria-components`      | releasable        | npm             | public  | independent |
| `packages/solid-spectrum`            | releasable        | npm             | public  | independent |
| `packages/solidaria-test-utils`      | private/test-only | none            | private | n/a         |
| `packages/solid-spectrum-test-utils` | private/test-only | none            | private | n/a         |
| `apps/web`                           | app-only          | none            | private | n/a         |
| `apps/comparison`                    | app-only          | none            | private | n/a         |

## Release Flow

Recommended local flow:

1. Add or merge Changesets for releasable npm packages.
2. Run `vp run pr:check:fast` before pushing.
3. If the PR touches the web app, accessibility surface, or CI workflow logic, run `vp run pr:check`.
4. Run `vp run release:prepare`.
5. Review the generated version and changelog updates.
6. Run `vp run release:publish` when the tree is ready to publish.

If you want the full end-to-end flow in one command, run `vp run release`.

What `vp run release:prepare` does:

1. Runs `vp run changeset:version` to apply package version bumps and changelog updates.
2. Runs `vp run ci:release-readiness`.

What `vp run pr:check:fast` does:

1. Runs `vp run ci:changesets`.
2. Runs `vp run ci:release-readiness`.

What `vp run pr:check` does:

1. Runs `vp run pr:check:fast`.
2. Runs `vp run ci:a11y`.

PR enforcement:

- The `Changesets Check` workflow mirrors `vp run ci:changesets`.
- The `Release Readiness` workflow mirrors `vp run ci:release-readiness`.
- The `Accessibility Gate` workflow mirrors `vp run ci:a11y`.
- Together, those checks match `vp run pr:check`.
- `vp run ci:a11y` is intentionally the blocking accessibility bar: WCAG 2.2 AA plus smoke coverage, with axe `color-contrast` temporarily excluded.
- `vp run a11y:full` remains available for stricter contrast, best-practice, AAA, and experimental audits without blocking PRs.

What `vp run release:publish` does:

1. Publishes npm packages through Changesets.

What `vp run release` does:

1. Runs `vp run release:prepare`.
2. Runs `vp run release:publish`.

## GitHub Automation

On `push` to `main`, the `Release` workflow handles registry publishing in two stages:

1. If unpublished changesets are present, it creates or updates the Changesets version PR.
2. When that version PR is merged into `main`, it publishes the changed npm packages.

This means:

- a normal feature PR merge to `main` triggers release automation
- the actual registry publish happens when the generated version PR merges

One-time GitHub setup:

- configure npm trusted publishing for `.github/workflows/release.yml`
- keep `id-token: write` in the workflow for npm trusted publishing

## Workspace Scope

- Root workspace management covers `packages/*`, `apps/web`, and `apps/comparison`.
- `apps/web` and `apps/comparison` are private apps, ignored by Changesets for publishing, but kept in the workspace graph so internal package dependency ranges stay in sync.
