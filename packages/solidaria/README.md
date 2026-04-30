# @proyecto-viviana/solidaria

A SolidJS port of [React Aria](https://react-spectrum.adobe.com/react-aria/) - accessible UI primitives and ARIA patterns.

## Installation

```bash
npm install @proyecto-viviana/solidaria @proyecto-viviana/solid-stately solid-js
```

## Overview

solidaria provides accessibility hooks that implement WAI-ARIA patterns for UI components. Each hook returns props objects that you spread onto your elements to make them accessible.

## Available Hooks

### Button & Interactions

| Hook | Description |
|------|-------------|
| createButton | Button with press handling |
| createToggleButton | Toggle button with pressed state |
| createPress | Low-level press event handling |
| createHover | Hover event handling |
| createFocusRing | Focus ring visibility |
| createFocusable | Focus management utilities |

### Form Controls

| Hook | Description |
|------|-------------|
| createCheckbox | Checkbox with indeterminate support |
| createCheckboxGroup | Checkbox group with shared state |
| createRadio | Radio button |
| createRadioGroup | Radio button group |
| createSwitch | Toggle switch |
| createTextField | Text input with label association |
| createNumberField | Numeric input with increment/decrement |
| createSearchField | Search input with clear button |
| createSlider | Range slider with thumb and track |

### Navigation

| Hook | Description |
|------|-------------|
| createLink | Accessible link |
| createBreadcrumbs | Breadcrumb navigation |
| createBreadcrumbItem | Individual breadcrumb |
| createTabList | Tab list container |
| createTab | Individual tab |
| createTabPanel | Tab panel content |
| createLandmark | ARIA landmark regions with F6 navigation |

### Selection Components

| Hook | Description |
|------|-------------|
| createListBox | Listbox with keyboard navigation |
| createOption | Listbox option |
| createMenu | Menu with keyboard navigation |
| createMenuItem | Menu item |
| createMenuTrigger | Menu trigger button |
| createSelect | Select dropdown |

### Overlays

| Hook | Description |
|------|-------------|
| createOverlayTrigger | Trigger for overlays |
| createOverlay | Overlay dismiss behavior |
| createModal | Modal dialog with focus trapping |
| createPreventScroll | Scroll lock for overlays |
| createInteractOutside | Click outside detection |

### Feedback

| Hook | Description |
|------|-------------|
| createProgressBar | Progress bar with live region |
| createSeparator | Visual separator |

### Labels & Fields

| Hook | Description |
|------|-------------|
| createLabel | Label/input association |
| createField | Field with label, description, error |

### Accessibility

| Hook/Function | Description |
|---------------|-------------|
| createVisuallyHidden | Visually hide content for screen readers |
| announce | Announce messages to screen readers |
| clearAnnouncer | Clear pending announcements |
| destroyAnnouncer | Remove live announcer from DOM |
| createLandmark | ARIA landmark regions with F6 navigation |
| createFormValidation | Form validation with native HTML integration |
| createInteractionModality | Track keyboard/pointer/virtual interaction |

### Grid & Table

| Hook | Description |
|------|-------------|
| createGrid | Grid with keyboard navigation |
| createTable | Table with sorting, selection |
| createGridList | Single-column grid list |

### Tree

| Hook | Description |
|------|-------------|
| createTree | Tree with expand/collapse |
| createTreeItem | Tree item with nested children |

### Color

| Hook | Description |
|------|-------------|
| createColorSlider | Color channel slider |
| createColorArea | 2D color picker area |
| createColorWheel | Circular hue wheel |
| createColorField | Color text input |
| createColorSwatch | Color preview swatch |

### Drag & Drop

| Hook | Description |
|------|-------------|
| createDrag | Draggable element |
| createDrop | Drop target |
| createDraggableCollection | Collection-level drag |
| createDroppableCollection | Collection-level drop |

### i18n / Internationalization

| Hook/Utility | Description |
|--------------|-------------|
| I18nProvider | Locale context provider |
| useLocale | Get current locale and direction |
| createDefaultLocale | Browser locale with change detection |
| isRTL | RTL language detection |
| createNumberFormatter | Localized number formatting |
| createDateFormatter | Localized date formatting |
| createCollator | Locale-aware string sorting |
| createFilter | Locale-aware string filtering |

### SSR / Server-Side Rendering

| Hook/Utility | Description |
|--------------|-------------|
| SSRProvider | SSR context provider with prefix support |
| createIsSSR | Check if currently rendering on server |
| useIsSSR | Reactive SSR/hydration state hook |
| createHydrationState | Track hydration completion |
| createBrowserEffect | Effect that only runs on client |
| createBrowserValue | Computed value only on client |
| getWindow | Safe window access |
| getDocument | Safe document access |
| getPortalContainer | Get container for portals |

### Focus Management

| Hook/Utility | Description |
|--------------|-------------|
| FocusScope | Focus containment and restoration |
| useFocusManager | Programmatic focus navigation |
| createFocusRestore | Save and restore focus with retry |
| pushFocusStack / popFocusStack | Cross-scope focus tracking |
| createVirtualFocus | Virtual focus for large collections |
| createAutoFocus | Priority-based auto-focus queue |

### Test Utilities

| Utility | Description |
|---------|-------------|
| setupUser | Configure userEvent for testing |
| pointerMap | Pointer map for mouse/touch/pen |
| createPointerEvent | Create pointer events for tests |
| press / hover / tabTo | High-level interaction helpers |
| getAriaRole / isAriaDisabled / etc. | ARIA attribute querying |
| getFocusableElements | Query focusable elements |
| waitForFocus | Wait for focus changes |
| createButtonTester / etc. | Component-specific testers |
| setupTestEnvironment | Install jsdom polyfills |

### Utilities

| Utility | Description |
|---------|-------------|
| mergeProps | Merge multiple prop objects |
| filterDOMProps | Filter out non-DOM props |
| createId | Generate unique IDs (SSR-safe) |

## Usage Example

```tsx
import { createButton } from "@proyecto-viviana/solidaria";

function Button(props) {
  let ref;
  const { buttonProps, isPressed } = createButton(props, () => ref);

  return (
    <button
      {...buttonProps}
      ref={ref}
      class={isPressed() ? "pressed" : ""}
    >
      {props.children}
    </button>
  );
}

// Usage
<Button onPress={() => console.log("Pressed!")}>Click me</Button>
```

## Key Concepts

### Props Spreading

All hooks return prop objects that should be spread onto elements:

```tsx
const { buttonProps } = createButton(props, ref);
return <button {...buttonProps}>Click me</button>;
```

### Ref Pattern

Most hooks require a ref accessor to access the DOM element:

```tsx
let ref;
const { inputProps } = createTextField(props, () => ref);
return <input {...inputProps} ref={ref} />;
```

### Event Handling

solidaria uses onPress instead of onClick for better cross-platform support:

```tsx
<Button onPress={() => console.log("Pressed!")}>
  Works with click, touch, and keyboard
</Button>
```

## TypeScript

All hooks are fully typed:

```tsx
import {
  createButton,
  type AriaButtonProps,
  type ButtonAria,
} from "@proyecto-viviana/solidaria";
```

## License

MIT
