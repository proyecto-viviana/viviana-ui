# @proyecto-viviana/solid-stately

A SolidJS port of [React Stately](https://react-spectrum.adobe.com/react-stately/) - headless state management for UI components.

## Installation

```bash
pnpm add @proyecto-viviana/solid-stately solid-js
```

## Overview

solid-stately provides state management hooks that handle the complex logic for UI components like toggles, selections, overlays, and collections. These hooks return reactive state and update functions that you can use with any UI.

This package is the foundation layer of the Proyecto Viviana component library, providing the state logic that powers the accessibility hooks in `@proyecto-viviana/solidaria`.

## Available Hooks

### Toggle & Selection

| Hook | Description |
|------|-------------|
| `createToggleState` | Boolean toggle state for checkboxes, switches |
| `createCheckboxGroupState` | Multi-selection checkbox group |
| `createRadioGroupState` | Single-selection radio group |

### Overlays

| Hook | Description |
|------|-------------|
| `createOverlayTriggerState` | Open/close state for modals, popovers, menus |

### Collections & Lists

| Hook | Description |
|------|-------------|
| `createListState` | List with selection and keyboard focus |
| `createSingleSelectListState` | Single-selection list (e.g., for select dropdowns) |
| `createSelectionState` | Low-level selection management |
| `createMenuState` | Menu state with action support |
| `createMenuTriggerState` | Menu trigger open/close state |
| `createSelectState` | Select dropdown state |
| `ListCollection` | Collection data structure for lists |
| `createListCollection` | Create a list collection from items |

### Navigation

| Hook | Description |
|------|-------------|
| `createTabListState` | Tab navigation state with keyboard support |

### Form Controls

| Hook | Description |
|------|-------------|
| `createTextFieldState` | Text input state |
| `createNumberFieldState` | Numeric input with validation |
| `createSearchFieldState` | Search input with clear functionality |
| `createSliderState` | Range slider state |
| `createFormValidationState` | Form validation state with realtime/native modes |

### Grid & Table

| Hook | Description |
|------|-------------|
| `createGridState` | Grid state with keyboard navigation |
| `createTableState` | Table state with sorting and selection |
| `TableCollection` | Collection data structure for tables |

### Tree

| Hook | Description |
|------|-------------|
| `createTreeState` | Tree state with expand/collapse |
| `TreeCollection` | Collection data structure for trees |

### Color

| Hook | Description |
|------|-------------|
| `createColorSliderState` | Color channel slider state |
| `createColorAreaState` | 2D color area picker state |
| `createColorWheelState` | Circular hue wheel state |
| `createColorFieldState` | Color text input state |

### Drag & Drop

| Hook | Description |
|------|-------------|
| `createDragState` | Drag operation state |
| `createDropState` | Drop target state |
| `createDraggableCollectionState` | Collection-level drag state |
| `createDroppableCollectionState` | Collection-level drop state |

### Utilities

| Hook | Description |
|------|-------------|
| `createId` | Generate unique IDs (SSR-safe) |
| `createIsSSR` | Detect server-side rendering |
| `canUseDOM` | Check if DOM is available |

## Usage Examples

### Toggle State

```tsx
import { createToggleState } from '@proyecto-viviana/solid-stately';

function Checkbox(props) {
  const state = createToggleState({
    isSelected: props.isSelected,
    defaultSelected: props.defaultSelected,
    onChange: props.onChange,
  });

  return (
    <label>
      <input
        type="checkbox"
        checked={state.isSelected()}
        onChange={() => state.toggle()}
      />
      {props.children}
    </label>
  );
}
```

### List State with Selection

```tsx
import { createListState } from '@proyecto-viviana/solid-stately';

function ListBox(props) {
  const state = createListState({
    items: props.items,
    getKey: (item) => item.id,
    getTextValue: (item) => item.name,
    selectionMode: 'single',
    onSelectionChange: props.onSelectionChange,
  });

  return (
    <ul>
      <For each={props.items}>
        {(item) => {
          const key = item.id;
          const isSelected = () => state.selectionManager.isSelected(key);
          
          return (
            <li
              onClick={() => state.selectionManager.toggleSelection(key)}
              style={{ background: isSelected() ? 'blue' : 'white' }}
            >
              {item.name}
            </li>
          );
        }}
      </For>
    </ul>
  );
}
```

### Overlay State

```tsx
import { createOverlayTriggerState } from '@proyecto-viviana/solid-stately';

function Modal(props) {
  const state = createOverlayTriggerState({
    isOpen: props.isOpen,
    defaultOpen: props.defaultOpen,
    onOpenChange: props.onOpenChange,
  });

  return (
    <>
      <button onClick={() => state.open()}>Open Modal</button>
      <Show when={state.isOpen()}>
        <div class="modal">
          {props.children}
          <button onClick={() => state.close()}>Close</button>
        </div>
      </Show>
    </>
  );
}
```

### Tab State

```tsx
import { createTabListState } from '@proyecto-viviana/solid-stately';

function Tabs(props) {
  const state = createTabListState({
    items: props.tabs,
    getKey: (tab) => tab.id,
    selectedKey: props.selectedKey,
    onSelectionChange: props.onSelectionChange,
  });

  return (
    <div>
      <div role="tablist">
        <For each={props.tabs}>
          {(tab) => (
            <button
              role="tab"
              aria-selected={state.selectedKey() === tab.id}
              onClick={() => state.setSelectedKey(tab.id)}
            >
              {tab.label}
            </button>
          )}
        </For>
      </div>
      <div role="tabpanel">
        {props.tabs.find(t => t.id === state.selectedKey())?.content}
      </div>
    </div>
  );
}
```

### Slider State

```tsx
import { createSliderState } from '@proyecto-viviana/solid-stately';

function Slider(props) {
  const state = createSliderState({
    value: props.value,
    defaultValue: props.defaultValue ?? 50,
    minValue: props.minValue ?? 0,
    maxValue: props.maxValue ?? 100,
    step: props.step ?? 1,
    onChange: props.onChange,
  });

  const percent = () => state.getValuePercent() * 100;

  return (
    <div>
      <input
        type="range"
        min={state.minValue}
        max={state.maxValue}
        step={state.step}
        value={state.value()}
        onInput={(e) => state.setValue(parseFloat(e.target.value))}
      />
      <span>{state.getFormattedValue()}</span>
    </div>
  );
}
```

## Key Concepts

### Controlled vs Uncontrolled

All state hooks support both controlled and uncontrolled patterns:

```tsx
// Uncontrolled - uses internal state
const state = createToggleState({
  defaultSelected: false,
  onChange: (isSelected) => console.log('Changed:', isSelected),
});

// Controlled - uses external state
const [isSelected, setIsSelected] = createSignal(false);
const state = createToggleState({
  isSelected: isSelected(),
  onChange: setIsSelected,
});
```

### MaybeAccessor Pattern

Props can be passed as values or accessors for reactive updates:

```tsx
// Static value
createToggleState({ defaultSelected: true });

// Reactive accessor
createToggleState({ 
  get isDisabled() { return props.isDisabled; } 
});
```

## TypeScript

All hooks are fully typed. Import types as needed:

```tsx
import { 
  createListState,
  type ListState,
  type ListStateProps,
  type Key,
  type Selection,
} from '@proyecto-viviana/solid-stately';
```

## License

MIT
