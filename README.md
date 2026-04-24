# Proyecto Viviana

SolidJS port of Adobe's React Aria and React Spectrum. Four published packages following the same 4-layer architecture as upstream.

## Packages

| Package | npm | Purpose |
|---|---|---|
| [`solid-stately`](./packages/solid-stately) | `@proyecto-viviana/solid-stately` | State hooks — port of `@react-stately/*` |
| [`solidaria`](./packages/solidaria) | `@proyecto-viviana/solidaria` | ARIA behavior hooks — port of `@react-aria/*` |
| [`solidaria-components`](./packages/solidaria-components) | `@proyecto-viviana/solidaria-components` | Headless components — port of `react-aria-components` |
| [`silapse`](./packages/silapse) | `@proyecto-viviana/silapse` | Tailwind-styled components — inspired by `@react-spectrum/s2` |

```
silapse               styled (Tailwind)
  ↑
solidaria-components  headless
  ↑
solidaria             ARIA behavior
  ↑
solid-stately         state
```

Consumers can opt into any layer; higher layers compose lower ones without pulling extras.

## Quick start

```bash
pnpm install
pnpm run dev                 # docs + playground on localhost:3000
pnpm run comparison:dev      # side-by-side parity harness
vp test run packages         # unit suite
```

## Contributing

Working docs live under [`.claude/`](./.claude). New contributors read in order:

1. [`.claude/docs/PLAN.md`](./.claude/docs/PLAN.md) — current plan and status
2. [`.claude/docs/architecture.md`](./.claude/docs/architecture.md)
3. [`.claude/docs/getting-started.md`](./.claude/docs/getting-started.md)
4. [`.claude/docs/contributing.md`](./.claude/docs/contributing.md)
5. [`.claude/reference/patterns.md`](./.claude/reference/patterns.md)

## License

[Apache-2.0](./LICENSE).
