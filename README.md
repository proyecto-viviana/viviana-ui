# Solidaria

A SolidJS port of Adobe's React Aria and React Stately libraries, providing accessible UI primitives for building design systems.

## Packages

| Package | Description |
|---------|-------------|
| `@proyecto-viviana/solid-stately` | State management hooks for UI components |
| `@proyecto-viviana/solidaria` | Accessibility hooks (ARIA patterns) |
| `@proyecto-viviana/solidaria-components` | Unstyled, accessible components |
| `@proyecto-viviana/ui` | Styled component library |

## Installation

```bash
# Using bun
bun add @proyecto-viviana/solidaria @proyecto-viviana/solid-stately

# Using npm
npm install @proyecto-viviana/solidaria @proyecto-viviana/solid-stately
```

## Quick Start

```tsx
import { createButton } from '@proyecto-viviana/solidaria';

function Button(props) {
  let ref;
  const { buttonProps } = createButton(props, () => ref);

  return (
    <button {...buttonProps} ref={ref}>
      {props.children}
    </button>
  );
}
```

## Available Hooks

### State Management (solid-stately)

#### Toggle & Selection
- `createToggleState` - Boolean toggle state
- `createCheckboxGroupState` - Checkbox group selection
- `createRadioGroupState` - Radio group selection

#### Overlays
- `createOverlayTriggerState` - Overlay open/close state

#### Collections
- `createListState` - List with selection and focus
- `createSelectionState` - Selection management (single/multiple)
- `createMenuState` - Menu state with actions
- `createMenuTriggerState` - Menu trigger open/close state
- `ListCollection` - Collection data structure

### Accessibility Hooks (solidaria)

#### Button & Toggle
- `createButton` - Button with press handling
- `createToggleButton` - Toggle button with pressed state
- `createToggle` - Generic toggle behavior

#### Form Controls
- `createCheckbox` - Checkbox with indeterminate support
- `createCheckboxGroup` - Group of checkboxes
- `createRadio` - Radio button
- `createRadioGroup` - Radio button group
- `createSwitch` - Switch/toggle control
- `createTextField` - Text input field

#### Interactions
- `createPress` - Press events (mouse, touch, keyboard)
- `createHover` - Hover events
- `createFocusRing` - Focus ring visibility
- `createFocusable` - Focus management

#### Labels & Fields
- `createLabel` - Label/input association
- `createField` - Field with label, description, error

#### Navigation
- `createLink` - Accessible link

#### Feedback
- `createProgressBar` - Progress indicator
- `createSeparator` - Visual separator

#### Overlays
- `createOverlayTrigger` - Trigger for overlays
- `createOverlay` - Overlay behavior (keyboard dismiss)
- `createInteractOutside` - Click outside detection
- `createPreventScroll` - Scroll lock
- `createModal` - Modal dialog
- `ariaHideOutside` - Hide elements from screen readers

#### Collections
- `createListBox` - Listbox with keyboard navigation
- `createOption` - Listbox option
- `createMenu` - Menu with keyboard navigation
- `createMenuItem` - Menu item
- `createMenuTrigger` - Menu trigger button

#### Utilities
- `mergeProps` - Merge multiple prop objects
- `filterDOMProps` - Filter non-DOM props
- `createId` - Generate unique IDs

## Examples

### Checkbox

```tsx
import { createCheckbox, createToggleState } from '@proyecto-viviana/solidaria';

function Checkbox(props) {
  let ref;
  const state = createToggleState(props);
  const { inputProps } = createCheckbox(props, state, () => ref);

  return (
    <label>
      <input {...inputProps} ref={ref} />
      {props.children}
    </label>
  );
}
```

### Menu

```tsx
import { createMenu, createMenuItem, createMenuTrigger } from '@proyecto-viviana/solidaria';
import { createMenuState, createOverlayTriggerState } from '@proyecto-viviana/solid-stately';

function Menu(props) {
  const triggerState = createOverlayTriggerState();
  const menuState = createMenuState({
    items: props.items,
    getKey: (item) => item.key,
    onAction: props.onAction,
    onClose: () => triggerState.close(),
  });

  const { menuTriggerProps, menuProps: triggerMenuProps } = createMenuTrigger({}, triggerState);
  const { menuProps } = createMenu({ onClose: () => triggerState.close() }, menuState);

  return (
    <div>
      <button {...menuTriggerProps} onClick={menuTriggerProps.onPress}>
        {props.label}
      </button>
      <Show when={triggerState.isOpen()}>
        <ul {...menuProps} {...triggerMenuProps}>
          <For each={props.items}>
            {(item) => <MenuItem item={item} state={menuState} />}
          </For>
        </ul>
      </Show>
    </div>
  );
}
```

### ListBox

```tsx
import { createListBox, createOption } from '@proyecto-viviana/solidaria';
import { createListState } from '@proyecto-viviana/solid-stately';

function ListBox(props) {
  const state = createListState({
    items: props.items,
    getKey: (item) => item.key,
    selectionMode: 'single',
    onSelectionChange: props.onSelectionChange,
  });

  const { listBoxProps } = createListBox({}, state);

  return (
    <ul {...listBoxProps}>
      <For each={props.items}>
        {(item) => <Option item={item} state={state} />}
      </For>
    </ul>
  );
}

function Option(props) {
  const { optionProps, isSelected, isFocused } = createOption(
    { key: props.item.key },
    props.state
  );

  return (
    <li
      {...optionProps}
      style={{
        background: isSelected() ? 'blue' : isFocused() ? 'lightblue' : 'white',
      }}
    >
      {props.item.label}
    </li>
  );
}
```

## Development

```bash
# Install dependencies
bun install

# Build all packages
bun run build

# Run tests
bun run test

# Run tests in watch mode
bun run test:watch

# Start dev server
bun run dev
```

## Project Structure

```
packages/
  solid-stately/     # State management
  solidaria/         # Accessibility hooks
  solidaria-components/  # Unstyled components
  ui/                # Styled components
apps/
  web/               # Demo application
```

## License

MIT
