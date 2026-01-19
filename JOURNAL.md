# Proyecto Viviana - Development Journal

A SolidJS port of Adobe's React Spectrum component library, following a 4-layer architecture pattern.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  @proyecto-viviana/ui                                           │
│  Styled, ready-to-use components with design system             │
├─────────────────────────────────────────────────────────────────┤
│  @proyecto-viviana/solidaria-components                         │
│  Unstyled, composable components with render props              │
├─────────────────────────────────────────────────────────────────┤
│  @proyecto-viviana/solidaria                                    │
│  ARIA hooks - accessibility patterns and keyboard navigation    │
├─────────────────────────────────────────────────────────────────┤
│  @proyecto-viviana/solid-stately                                │
│  State hooks - headless state management                        │
└─────────────────────────────────────────────────────────────────┘
```

## Completed Phases

### Phase 1-7: Core Foundation
- Toggle state (`createToggleState`)
- Checkbox/Radio groups (`createCheckboxGroupState`, `createRadioGroupState`)
- Text/Number/Search fields
- Overlays and modals
- Collections and selection (`createListState`, `createSelectionState`)
- Tabs, Menu, Select, ComboBox
- Slider, Tooltip, Toast, Disclosure
- Calendar and DatePicker
- Focus management (`FocusScope`, `createFocusRing`)

### Phase 8: Grid/Table
- **solid-stately**: `createGridState`, `createTableState`, `TableCollection`
- **solidaria**: `createGrid`, `createTable`, `createGridList` with full ARIA support
- **solidaria-components**: `Table`, `GridList` unstyled components
- **ui**: Styled Table with sorting, selection, and column resizing

### Phase 9: Tree
- **solid-stately**: `createTreeState`, `TreeCollection`
- **solidaria**: `createTree`, `createTreeItem` with expand/collapse
- **solidaria-components**: `Tree` component with nested items
- **ui**: Styled Tree with indicators and selection

### Phase 10: Color
- **solid-stately**: `createColorSliderState`, `createColorAreaState`, `createColorWheelState`, `createColorFieldState`
- **solidaria**: `createColorSlider`, `createColorArea`, `createColorWheel`, `createColorField`, `createColorSwatch`
- **solidaria-components**: Color picker components
- **ui**: Styled color components

### Phase 11: Drag and Drop
- **solid-stately**: `createDragState`, `createDropState`, `createDraggableCollectionState`, `createDroppableCollectionState`
- **solidaria**: `createDrag`, `createDrop`, `createDraggableCollection`, `createDroppableCollection`, `createDraggableItem`, `createDroppableItem`
- Full HTML5 drag and drop with custom drag preview support

### Phase 12: Landmarks
- **solidaria**: `createLandmark`, `getLandmarkController`
- F6 keyboard navigation between landmark regions
- Support for all ARIA landmark roles

### Phase 13: Accessibility Utilities
- **solidaria**: `createVisuallyHidden`, `visuallyHiddenStyles`
- **solidaria**: `announce`, `clearAnnouncer`, `destroyAnnouncer` (LiveAnnouncer)
- Screen reader announcements via ARIA live regions

### Phase 14: Form Validation
- **solid-stately**: `createFormValidationState`, `mergeValidation`
  - Realtime (aria) and native (on submit) validation behaviors
  - Server-side validation via context
  - `ValidationResult`, `ValidityState` types
- **solidaria**: `createFormValidation`
  - Native HTML form validation integration
  - Custom validity, invalid event handling
- **solidaria**: `createInteractionModality`
  - Tracks keyboard/pointer/virtual interaction modes
  - Refactored `createFocusRing` to use shared modality

### Phase 15: i18n / Internationalization
- **solidaria**: Locale context and provider
  - `I18nProvider`, `useLocale`, `createDefaultLocale`
  - Automatic browser locale detection
  - Language change event handling
- **solidaria**: RTL support
  - `isRTL()` - RTL detection using Intl.Locale API
  - Support for Arabic, Hebrew, Persian, Urdu, and more
- **solidaria**: Number formatting
  - `NumberFormatter` class with caching and polyfills
  - `createNumberFormatter` hook
  - Currency, percent, unit formatting
  - signDisplay and unit polyfills for older browsers
- **solidaria**: Date formatting
  - `createDateFormatter` hook with caching
- **solidaria**: String utilities
  - `createCollator` for locale-aware sorting
  - `createFilter` for locale-aware string filtering (startsWith, endsWith, contains)

### Phase 16: SSR Support
- **solidaria**: Enhanced SSR utilities
  - `SSRProvider` with nested prefix support for micro-frontends
  - `createHydrationState`, `useIsSSR` for hydration tracking
  - `createBrowserEffect`, `createBrowserValue` for client-only code
  - `getWindow`, `getDocument`, `getOwnerDocument`, `getOwnerWindow` for safe DOM access
  - `getPortalContainer` for SSR-safe portal containers
- **solidaria**: Enhanced live announcer
  - `useAnnouncer` hook with SSR safety
- **solidaria**: Enhanced interaction modality
  - `useIsKeyboardFocused` hook with SSR safety

## Current Status

**Tests**: 2161 passing
**Packages**: 4 (solid-stately, solidaria, solidaria-components, ui)

## Roadmap: Future Phases

### Phase 17: Focus Management Enhancements
**Priority: Medium**

Advanced focus management patterns.

- [ ] **solidaria**
  - Focus restoration on unmount
  - Focus containment improvements
  - Virtual focus for large lists
  - Auto-focus management

### Phase 18: Search Autocomplete
**Priority: Medium**

SearchAutocomplete component (distinct from ComboBox).

- [ ] **solid-stately**: `createSearchAutocompleteState`
- [ ] **solidaria**: `createSearchAutocomplete`
- [ ] **solidaria-components**: `SearchAutocomplete`

### Phase 19: Toolbar
**Priority: Medium**

Toolbar component with keyboard navigation.

- [ ] **solidaria**: `createToolbar`, `createToolbarItem`
- [ ] **solidaria-components**: `Toolbar`
- [ ] **ui**: Styled Toolbar

### Phase 20: Breadcrumbs Enhancement
**Priority: Low**

Enhanced breadcrumbs with overflow handling.

- [ ] **solidaria-components**: `Breadcrumbs` with menu overflow
- [ ] **ui**: Styled Breadcrumbs

### Phase 21: ActionGroup / ActionBar
**Priority: Low**

Grouped actions with selection.

- [ ] **solid-stately**: `createActionGroupState`
- [ ] **solidaria**: `createActionGroup`
- [ ] **solidaria-components**: `ActionGroup`, `ActionBar`

### Phase 22: StepList / Wizard
**Priority: Low**

Multi-step form wizard pattern.

- [ ] **solid-stately**: `createStepListState`
- [ ] **solidaria**: `createStepList`
- [ ] **solidaria-components**: `StepList`

### Phase 23: Virtualizer
**Priority: Medium**

Virtual scrolling for large lists.

- [ ] **solidaria**: Virtual scrolling utilities
- [ ] Integration with ListBox, Table, Tree

### Phase 24: TagField
**Priority: Low**

Editable tag input with suggestions.

- [ ] **solid-stately**: `createTagFieldState`
- [ ] **solidaria**: `createTagField`
- [ ] **solidaria-components**: `TagField`

## Development Notes

### Testing
- Uses Vitest with `vmThreads` pool (Windows compatibility)
- jsdom environment for DOM testing
- `@solidjs/testing-library` for component tests

### Build
- tsup for bundling
- Separate SSR and browser builds
- TypeScript declarations

### Patterns
- `MaybeAccessor` for reactive props
- Context for shared state (validation, modality)
- Props spreading pattern for ARIA attributes
- Ref accessor pattern: `() => ref`

## Changelog

### 2026-01-19
- Completed Phase 16: SSR Support
  - Enhanced SSR module with `SSRProvider`, hydration hooks
  - Added `createBrowserEffect`, `createBrowserValue` for client-only code
  - Added safe DOM accessors (`getWindow`, `getDocument`, etc.)
  - Added `useAnnouncer` hook with SSR safety
  - Added `useIsKeyboardFocused` hook with SSR safety
  - 26 new tests (2161 total)
- Completed Phase 15: i18n / Internationalization
  - Added `I18nProvider`, `useLocale`, `createDefaultLocale`, `getDefaultLocale`
  - Added `isRTL()` for RTL language detection
  - Added `NumberFormatter` class with polyfills
  - Added `createNumberFormatter`, `createDateFormatter`, `createCollator`, `createFilter`
  - 71 new tests (2135 total)
- Completed Phase 14: Form Validation
  - Added `createFormValidationState` to solid-stately
  - Added `createFormValidation` to solidaria
  - Added `createInteractionModality` module
  - Fixed Vitest runner issue on Windows (vmThreads pool)
  - 49 new tests (2064 total)

### Previous
- Phases 1-13 completed (see git history for details)
