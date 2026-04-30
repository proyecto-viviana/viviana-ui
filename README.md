# Proyecto Viviana

SolidJS port of Adobe's React Aria and Spectrum 2 stack. The repo is layered as state, behavior, headless components, and styled components.

## Packages

| Package | npm | Purpose |
|---|---|---|
| [`solid-stately`](./packages/solid-stately) | `@proyecto-viviana/solid-stately` | State hooks — port of `@react-stately/*` |
| [`solidaria`](./packages/solidaria) | `@proyecto-viviana/solidaria` | ARIA behavior hooks — port of `@react-aria/*` |
| [`solidaria-components`](./packages/solidaria-components) | `@proyecto-viviana/solidaria-components` | Headless/stylable components — port of `react-aria-components` |
| [`solid-spectrum`](./packages/solid-spectrum) | `@proyecto-viviana/solid-spectrum` | Spectrum 2-compatible styled Solid components |

```
solid-spectrum        Spectrum 2-compatible styled components
  ↑
solidaria-components  headless/stylable components
  ↑
solidaria             ARIA behavior
  ↑
solid-stately         state
```

Consumers can opt into any layer; higher layers compose lower ones without pulling extras. `solid-spectrum` is the package compared pixel-for-pixel against Adobe Spectrum 2 in the comparison app. `viviana-ui` is planned as Proyecto Viviana's own design system, separate from S2 parity.

## Quick start

```bash
pnpm install
vp run dev                 # docs + playground on localhost:3000
vp run comparison:dev      # side-by-side parity harness
vp test run packages         # unit suite
```

## Contributing

Working docs live under [`.claude/`](./.claude). New contributors read in order:

1. [`.claude/docs/PLAN.md`](./.claude/docs/PLAN.md) — current plan and status
2. [`.claude/docs/architecture.md`](./.claude/docs/architecture.md)
3. [`docs/s2-styling-and-package-plan.md`](./docs/s2-styling-and-package-plan.md)
4. [`.claude/docs/skin-system-research.md`](./.claude/docs/skin-system-research.md)
5. [`.claude/docs/getting-started.md`](./.claude/docs/getting-started.md)
6. [`.claude/docs/contributing.md`](./.claude/docs/contributing.md)
7. [`.claude/reference/patterns.md`](./.claude/reference/patterns.md)

## License

[Apache-2.0](./LICENSE).
