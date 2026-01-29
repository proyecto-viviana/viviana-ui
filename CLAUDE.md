# Proyecto Viviana

SolidJS port of Adobe's React Spectrum - accessible UI primitives with world-class a11y.

## Quick Context

**What**: 4-layer component library (state → aria → components → styled) ported from React Spectrum to SolidJS
**Why**: SolidJS lacks a mature accessible component library - this fills that gap
**Status**: 2763 tests passing, Phases 1-29 complete

## IMPORTANT: Reference Code is Local

**React Spectrum source is in `react-spectrum/` directory** - no need to fetch from web.

When porting or referencing React Aria/Spectrum:
```
react-spectrum/packages/@react-stately/    → State hooks (reference for solid-stately)
react-spectrum/packages/@react-aria/       → ARIA hooks (reference for solidaria)
react-spectrum/packages/react-aria-components/ → Components (reference for solidaria-components)
react-spectrum/packages/@react-spectrum/s2/src/ → S2 styled (reference for ui)
```

## Package Architecture

```
solid-stately          → State hooks (createToggleState, createListState, etc.)
       ↓
solidaria              → ARIA hooks (createButton, createMenu, etc.)
       ↓
solidaria-components   → Headless components with render props
       ↓
ui                     → Styled components (Tailwind CSS)
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
deno task publish:npm   # Publish to npm
deno task publish:jsr   # Publish to JSR (jsr.io)
deno task version:set <version>  # Sync versions across all packages
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

## Documentation

See [.claude/README.md](.claude/README.md) for full documentation:
- [Architecture](.claude/docs/architecture.md) - Package design & decisions
- [Getting Started](.claude/docs/getting-started.md) - Setup & workflow
- [Contributing](.claude/docs/contributing.md) - How to add components
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

## Next Steps

Future phases (not started):
- Search Autocomplete
- Virtualizer (for large lists)
- ActionGroup / ActionBar
