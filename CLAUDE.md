# Proyecto Viviana

SolidJS port of Adobe's React Spectrum - accessible UI primitives with world-class a11y.

## Quick Context

**What**: 4-layer component library (state → aria → components → styled) ported from React Spectrum to SolidJS
**Why**: SolidJS lacks a mature accessible component library - this fills that gap
**Status**: 4128+ tests passing, Phases 1-31 + Endgame + Parity Completion + A11y Wave 1 + Component Parity Waves 0-7 + Performance Optimization complete

## IMPORTANT: Reference Code is Local

**React Spectrum source is in `react-spectrum/` directory** - no need to fetch from web.

When porting or referencing React Aria/Spectrum:
```
react-spectrum/packages/@react-stately/    → State hooks (reference for solid-stately)
react-spectrum/packages/@react-aria/       → ARIA hooks (reference for solidaria)
react-spectrum/packages/react-aria-components/ → Components (reference for solidaria-components)
react-spectrum/packages/@react-spectrum/s2/src/ → S2 styled (reference for silapse)
```

## Package Architecture

```
solid-stately          → State hooks (createToggleState, createListState, etc.)
       ↓
solidaria              → ARIA hooks (createButton, createMenu, etc.)
       ↓
solidaria-components   → Headless components with render props
       ↓
silapse                → Styled components (Tailwind CSS)
```

## Commands

```bash
pnpm install          # Install dependencies
pnpm run dev          # Start dev server (localhost:3000)
vp test run packages  # Run all tests
pnpm run build        # Typecheck and build all packages
pnpm run pr:check:fast # Mirror blocking non-Playwright PR checks
pnpm run pr:check     # Mirror full blocking PR checks, including a11y
```

### Publishing

```bash
pnpm run changeset         # Create release note + bump intent
pnpm run changeset:status  # Preview release plan
pnpm run changeset:version # Apply version bumps + changelogs
pnpm run ci:changesets     # Mirror Changesets Check workflow
pnpm run ci:release-readiness # Mirror Release Readiness workflow
pnpm run ci:a11y           # Mirror blocking Accessibility Gate workflow (contrast excluded)
pnpm run release:prepare   # Version, build, test
pnpm run release:publish   # Publish npm packages
pnpm run changeset:publish # Build + publish releasable packages to npm
pnpm run release           # Full release flow: prepare, then publish
```

Release metadata rules:
- `package.json` is the version source of truth for releasable packages.
- Before pushing, prefer `pnpm run pr:check:fast`.
- When touching web app accessibility or CI wiring, prefer `pnpm run pr:check`.
- `pnpm run ci:a11y` temporarily excludes axe `color-contrast`; use `pnpm run a11y:full` for the stricter contrast-inclusive audit.

## Key Patterns

**Ref accessor pattern** - Pass refs as functions:
```tsx
let ref;
const { buttonProps } = createButton(props, () => ref);
return <button {...buttonProps} ref={ref} />;
```

**MaybeAccessor** - Props can be values or accessors:
```tsx
// Both work:
createButton({ isDisabled: true });
createButton({ isDisabled: () => isDisabled() });
```

**Props spreading** - Hooks return prop objects to spread:
```tsx
const { inputProps, labelProps } = createTextField(props);
return <><label {...labelProps} /><input {...inputProps} /></>;
```

**splitProps with DOM forwarding** - Always capture rest props in sub-components:
```tsx
// ✅ Captures domProps (aria-label, data-testid, etc.) for forwarding
const [local, domProps] = splitProps(props, ['class', 'style', 'slot', 'children']);
return <button {...domProps} {...ariaProps}>{local.children}</button>;
```

## Documentation

See [.claude/README.md](.claude/README.md) for full documentation:
- [Architecture](.claude/docs/architecture.md) - Package design & decisions
- [Getting Started](.claude/docs/getting-started.md) - Setup & workflow
- [Contributing](.claude/docs/contributing.md) - How to add components
- [Changesets Runbook](.claude/docs/changesets-runbook.md) - Release/version workflow
- [Roadmap](.claude/docs/roadmap.md) - Development phases
- [Patterns](.claude/reference/patterns.md) - SolidJS-specific patterns

## Completed Phases

| Phase | Feature | Tests |
|-------|---------|-------|
| 1-7 | Core (Button, Forms, Overlays, Collections, Calendar) | ~1700 |
| 8 | Table & GridList | +150 |
| 9 | Tree | +73 |
| 10 | Color (ColorSlider, ColorArea, ColorWheel) | +60 |
| 11 | Drag & Drop | +77 |
| 12 | Landmarks (F6 navigation) | +18 |
| 13 | Accessibility (VisuallyHidden, LiveAnnouncer) | +26 |
| 14 | Form Validation | +49 |
| 15 | i18n (locale, RTL, number/date formatting) | +71 |
| 16 | SSR Support (hydration, browser-safe utilities) | +26 |
| 17 | Focus Management (restore, virtual focus, auto-focus) | +29 |
| 18 | Testing Infrastructure | +62 |
| 19-24 | Parity Improvements (keyboard nav, type-to-select, focus, forms) | +200 |
| 25 | Interaction Tests (createKeyboard, createFocus, createFocusRing) | +58 |
| 26 | Component Tests: Color, Landmark | +64 |
| 27 | Component Tests: GridList, Table, Separator, ProgressBar | +51 |
| 28 | Component Tests: Tooltip, Link, Toast, FocusManagement | +24 |
| 29 | Toolbar (all 4 layers) | +26 |
| Endgame | Re-exports, Focusable/Pressable/Router, Data hooks, UI wrappers, Layout, Theme/Provider, Virtualizer docs | +132 |
| Parity Completion | Barrel alignment, TextArea, DateRangePicker, ColorSwatchPicker, ColorEditor, ContextualHelpTrigger, OpenTransition, Theme system | +95 |
| Quality Hardening | splitProps DOM attribute forwarding fix (35 components), regression test suite (50 tests with DOM snapshots) | +50 |
| A11y Wave 1 | axe-core scans, ARIA ID integrity, DOM forwarding for 12 Core Controls (Button, Link, Separator, Checkbox, Switch, RadioGroup, TextField, TextArea, SearchField, NumberField, ProgressBar, Meter) | +71 |
| 30 | Autocomplete (all 4 layers) | +30 |
| 31 | Performance benchmarking (bundle-size, runtime) | +10 |
| Parity Waves 0-1 | Core Actions & Forms deep-dive (Button, Link, Checkbox, Switch, RadioGroup, TextField, SearchField, NumberField) | +80 |
| Parity Waves 2-3 | Selection/Navigation & Overlays (ListBox, Menu, Select, ComboBox, Tabs, Breadcrumbs, Dialog, Toast, TagGroup) | +120 |
| Parity Waves 4-5 | Date/Time & Data Collections (Calendar, RangeCalendar, DatePicker, DateRangePicker, TimeField, Table, GridList, Tree) | +100 |
| Parity Waves 6-7 | Color/Advanced & Utility/Infra (ColorArea, ColorSlider, ColorWheel, Slider, ActionBar, ActionGroup, DropZone, Focusable, Pressable, VisuallyHidden, RouterProvider, Collection) | +90 |
| Package Rename | ui → silapse (Silapse Design System rebrand) | — |
| Perf Optimization | Memoize collection/selection state accessors (3x ListBox speedup), silapse context values | — |

## Next Steps

**Start here:** [Phase 32+ Implementation Plan](.claude/docs/implementation-plan-phase-32.md)

Full audit conducted 2026-03-27 ([raw findings](.claude/docs/audit-2026-03-27.md)). Priority order:

1. **Tier 1 — Bugs:** Fix hardcoded colors in silapse, createListData dead ternary, TreeData missing methods, Tree role verification, DateRangePicker test expansion
2. **Tier 2 — Feature Parity:** Table column resize, load sentinels, Menu link items, StepList component, Skeleton components, ComboBox multi-select
3. **Tier 3 — Theming/DX:** CSS variable unification, forced colors mode, RTL tests, subpath exports evaluation
4. **Tier 4 — Polish:** Component feature gaps, test gaps, comparison app wiring, remaining styled components
