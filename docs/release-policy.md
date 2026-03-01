# Release Policy

## Source Of Truth

- `package.json` is the source of truth for releasable package `name`, `version`, `description`, and npm dependency ranges.
- The canonical license declaration is the root `LICENSE` file plus the package manifest metadata that points to it.
- Versioning is independent per releasable package. This repository does not use lockstep versioning.
- Release intent for npm packages is expressed through Changesets.

## Release Matrix

| Workspace | Classification | Registry target | Privacy | Versioning |
| --- | --- | --- | --- | --- |
| `packages/solid-stately` | releasable | npm | public | independent |
| `packages/solidaria` | releasable | npm | public | independent |
| `packages/solidaria-components` | releasable | npm | public | independent |
| `packages/silapse` | releasable | npm | public | independent |
| `packages/solidaria-test-utils` | private/test-only | none | private | n/a |
| `packages/silapse-test-utils` | private/test-only | none | private | n/a |
| `apps/web` | app-only | none | private | n/a |
| `apps/comparison` | app-only | none | private | n/a |

## Release Flow

Recommended local flow:

1. Add or merge Changesets for releasable npm packages.
2. Run `bun run pr:check:fast` before pushing.
3. If the PR touches the web app, accessibility surface, or CI workflow logic, run `bun run pr:check`.
4. Run `bun run release:prepare`.
5. Review the generated version and changelog updates.
6. Run `bun run release:publish` when the tree is ready to publish.

If you want the full end-to-end flow in one command, run `bun run release`.

What `bun run release:prepare` does:

1. Runs `bun run changeset:version` to apply package version bumps and changelog updates.
2. Runs `bun run ci:release-readiness`.

What `bun run pr:check:fast` does:

1. Runs `bun run ci:changesets`.
2. Runs `bun run ci:release-readiness`.

What `bun run pr:check` does:

1. Runs `bun run pr:check:fast`.
2. Runs `bun run ci:a11y`.

PR enforcement:

- The `Changesets Check` workflow mirrors `bun run ci:changesets`.
- The `Release Readiness` workflow mirrors `bun run ci:release-readiness`.
- The `Accessibility Gate` workflow mirrors `bun run ci:a11y`.
- Together, those checks match `bun run pr:check`.
- `bun run ci:a11y` is intentionally the blocking accessibility bar: WCAG 2.2 AA plus smoke coverage.
- `bun run a11y:full` remains available for stricter best-practice, AAA, and experimental audits without blocking PRs.

What `bun run release:publish` does:

1. Publishes npm packages through Changesets.

What `bun run release` does:

1. Runs `bun run release:prepare`.
2. Runs `bun run release:publish`.

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

- Root npm workspace management covers `packages/*` and `apps/web`.
- `apps/comparison` is intentionally managed as a standalone app and keeps its local `file:` package links outside the release workspace scope.
