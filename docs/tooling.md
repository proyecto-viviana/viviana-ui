# Tooling

`vp` is the repo command layer. It uses the configured package manager from
`packageManager` (`pnpm@10.33.0`) underneath, but repo documentation and scripts
should prefer Vite Plus commands.

## Daily Commands

```bash
vp install
vp run dev
vp run comparison:dev
vp test run packages
vp run check
```

Use `vp install`, `vp add`, `vp remove`, `vp update`, `vp why`, and `vp list`
for dependency work. Use raw `pnpm` only when debugging pnpm-specific behavior;
otherwise the command should go through `vp`.

## Lint And Format

The canonical lint and format tools are the Vite Plus wrappers:

```bash
vp run lint
vp run fmt:check
vp run check
```

`vp lint` runs Oxlint. `vp fmt` runs Oxfmt. `vp check` runs format, lint, and
type checks together.

The current daily gate is `vp run check`, which runs Oxlint and TypeScript
without forcing a repo-wide Oxfmt rewrite. `vp run check:full` is the direct
Vite Plus full check and should become the normal gate after the formatter
baseline is accepted.

Oxlint is currently wired as an advisory lint pass: warnings are visible, but
they do not fail `vp run check`. Oxfmt is also wired, but `vp run fmt:check`
will report the existing unformatted baseline until we intentionally accept a
repo-wide format commit.

## Vite Plus Stack

Apps should use Vite Plus commands directly where they map cleanly:

- `vp dev`
- `vp build`
- `vp preview`
- `vp test`
- `vp exec <tool>`

Prefer native Vite Plus/Vite capabilities over compatibility plugins when the
project can express the same behavior directly. For example, `apps/web` uses
Vite's native `resolve.tsconfigPaths` support instead of `vite-tsconfig-paths`.
