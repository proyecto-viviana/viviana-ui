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
deno task install     # Install dependencies
deno task dev         # Start dev server (localhost:3000)
deno task test        # Run all tests (uses Bun as runtime for vitest)
deno task build       # Build all packages with Deno/esbuild
```

### Publishing

```bash
npm run changeset         # Create release note + bump intent
npm run changeset:status  # Preview release plan
npm run changeset:version # Apply version bumps + changelogs
npm run changeset:publish # Build + publish releasable packages to npm
```

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

Future phases (not started):
- A11y Wave 2-8 (Selection, Overlays, Dates, Collections, Color, Utilities, Styled)
- Playground axe-core automation
