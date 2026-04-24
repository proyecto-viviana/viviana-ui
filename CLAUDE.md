# Proyecto Viviana

SolidJS port of Adobe's React Aria / React Spectrum. 4-layer architecture:

```
solid-stately          state hooks                   (↔ @react-stately/*)
solidaria              ARIA behavior hooks           (↔ @react-aria/*)
solidaria-components   headless components           (↔ react-aria-components)
silapse                styled components (Tailwind)  (↔ @react-spectrum/s2)
```

## Read next

- **`.claude/docs/PLAN.md`** — current plan, status, and the 4-workstream execution plan. Read this first.
- **`.claude/docs/architecture.md`** — 4-layer design, boundaries, key patterns.
- **`.claude/reference/patterns.md`** — SolidJS idioms (ref accessor, MaybeAccessor, createMemo traps, splitProps DOM forwarding).
- **`.claude/docs/contributing.md`** — how to add a component.
- **`.claude/docs/testing.md`** — test patterns and gotchas.

Anything under `.claude/docs/archive/` is historical only. If it contradicts PLAN.md, PLAN.md wins.

## Where things live

- `packages/solid-stately/`, `packages/solidaria/`, `packages/solidaria-components/`, `packages/silapse/` — the four layers.
- `apps/web/` — docs site + playground. `pnpm run dev` (localhost:3000).
- `apps/comparison/` — **side-by-side parity harness**: real React Spectrum mounted next to Solid ports. Primary surface for visual/behavioral parity work. `pnpm run comparison:dev`.
- `react-spectrum/` — read-only reference clone. Port source lives under `packages/@react-stately/`, `packages/@react-aria/`, `packages/react-aria-components/`, `packages/@react-spectrum/s2/`.
- `scripts/` — parity guards (see commands below).
- `benchmarks/runtime/` — runtime benchmarks.

## Commands

```bash
pnpm install
pnpm run dev                      # apps/web playground
pnpm run comparison:dev           # apps/comparison parity harness

vp test run packages              # unit suite (vite-plus wrapper)
pnpm run test:e2e                 # Playwright
pnpm run typecheck                # packages
pnpm run build                    # all packages

pnpm run guard:rac-parity         # parity guards — run as a set
pnpm run guard:rac-export-gap
pnpm run guard:rac-export-diff
pnpm run guard:layer-parity
pnpm run guard:dnd-keyboard-parity
pnpm run guard:virtualizer-keyboard-parity

pnpm run a11y:check               # axe AA + smoke (blocking in CI)
pnpm run a11y:full                # includes color-contrast

pnpm run pr:check:fast            # blocking non-Playwright PR checks
pnpm run pr:check                 # full blocking PR checks incl. a11y

pnpm run changeset                # release flow, see changesets-runbook.md
```

## Critical patterns (full list in `.claude/reference/patterns.md`)

**Ref accessor** — refs are passed as functions:
```tsx
let ref;
const { buttonProps } = createButton(props, () => ref);
return <button {...buttonProps} ref={ref} />;
```

**splitProps must capture rest as `domProps`** or `aria-*` / `data-testid` / `id` are silently dropped:
```tsx
const [local, domProps] = splitProps(props, ['class', 'style', 'slot', 'children']);
return <button {...domProps} {...ariaProps}>{local.children}</button>;
```

**`createMemo` for derived collections.** Plain `() => expr` re-executes on every access — O(N²) when read per-item. Wrap computations accessed multiple times:
```ts
const collection = createMemo(() => new ListCollection(nodes));  // cached
```

**No hardcoded colors in silapse** — breaks theming. Use design tokens.
