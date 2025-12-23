/**
 * ListBox component for solidaria-components
 *
 * A pre-wired headless listbox that combines state + aria hooks.
 * Port of react-aria-components/src/ListBox.tsx
 */

import {
  type JSX,
  createContext,
  createMemo,
  splitProps,
  useContext,
  For,
} from 'solid-js';
import {
  createListBox,
  createOption,
  createFocusRing,
  createHover,
  type AriaListBoxProps,
  type AriaOptionProps,
} from '@proyecto-viviana/solidaria';
import {
  createListState,
  type ListState,
  type Key,
} from '@proyecto-viviana/solid-stately';
import {
  type RenderChildren,
  type ClassNameOrFunction,
  type StyleOrFunction,
  type SlotProps,
  useRenderProps,
  filterDOMProps,
} from './utils';

// ============================================
// TYPES
// ============================================

export interface ListBoxRenderProps {
  /** Whether the listbox has focus. */
  isFocused: boolean;
  /** Whether the listbox has keyboard focus. */
  isFocusVisible: boolean;
  /** Whether the listbox is disabled. */
  isDisabled: boolean;
  /** Whether the listbox is empty. */
  isEmpty: boolean;
}

export interface ListBoxProps<T>
  extends Omit<AriaListBoxProps, 'children'>,
    SlotProps {
  /** The items to render in the listbox. */
  items: T[];
  /** Function to get the key from an item. */
  getKey?: (item: T) => Key;
  /** Function to get the text value from an item. */
  getTextValue?: (item: T) => string;
  /** Function to check if an item is disabled. */
  getDisabled?: (item: T) => boolean;
  /** The selection mode. */
  selectionMode?: 'none' | 'single' | 'multiple';
  /** Keys of disabled items. */
  disabledKeys?: Iterable<Key>;
  /** Currently selected keys (controlled). */
  selectedKeys?: 'all' | Iterable<Key>;
  /** Default selected keys (uncontrolled). */
  defaultSelectedKeys?: 'all' | Iterable<Key>;
  /** Handler called when selection changes. */
  onSelectionChange?: (keys: 'all' | Set<Key>) => void;
  /** The children of the component. A function may be provided to render each item. */
  children: (item: T) => JSX.Element;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<ListBoxRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<ListBoxRenderProps>;
  /** A function to render when the listbox is empty. */
  renderEmptyState?: () => JSX.Element;
}

export interface ListBoxOptionRenderProps {
  /** Whether the option is selected. */
  isSelected: boolean;
  /** Whether the option is focused. */
  isFocused: boolean;
  /** Whether the option has keyboard focus. */
  isFocusVisible: boolean;
  /** Whether the option is pressed. */
  isPressed: boolean;
  /** Whether the option is hovered. */
  isHovered: boolean;
  /** Whether the option is disabled. */
  isDisabled: boolean;
}

export interface ListBoxOptionProps<T>
  extends Omit<AriaOptionProps, 'children' | 'key'>,
    SlotProps {
  /** The unique key for the option. */
  id: Key;
  /** The item value. */
  item?: T;
  /** The children of the option. A function may be provided to receive render props. */
  children?: RenderChildren<ListBoxOptionRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<ListBoxOptionRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<ListBoxOptionRenderProps>;
  /** The text value of the option (for typeahead). */
  textValue?: string;
}

// ============================================
// CONTEXT
// ============================================

interface ListBoxContextValue<T> {
  state: ListState<T>;
}

export const ListBoxContext = createContext<ListBoxContextValue<unknown> | null>(null);
export const ListBoxStateContext = createContext<ListState<unknown> | null>(null);

// ============================================
// COMPONENTS
// ============================================

/**
 * A listbox displays a list of options and allows a user to select one or more of them.
 */
export function ListBox<T>(props: ListBoxProps<T>): JSX.Element {
  const [local, stateProps, ariaProps] = splitProps(
    props,
    ['children', 'class', 'style', 'slot', 'renderEmptyState'],
    ['items', 'getKey', 'getTextValue', 'getDisabled', 'disabledKeys', 'selectionMode', 'selectedKeys', 'defaultSelectedKeys', 'onSelectionChange']
  );

  // Create list state
  const state = createListState<T>({
    get items() {
      return stateProps.items;
    },
    get getKey() {
      return stateProps.getKey;
    },
    get getTextValue() {
      return stateProps.getTextValue;
    },
    get getDisabled() {
      return stateProps.getDisabled;
    },
    get disabledKeys() {
      return stateProps.disabledKeys;
    },
    get selectionMode() {
      return stateProps.selectionMode;
    },
    get selectedKeys() {
      return stateProps.selectedKeys;
    },
    get defaultSelectedKeys() {
      return stateProps.defaultSelectedKeys;
    },
    get onSelectionChange() {
      return stateProps.onSelectionChange;
    },
  });

  // Helper to resolve isDisabled
  const resolveDisabled = (): boolean => {
    const disabled = ariaProps.isDisabled;
    if (typeof disabled === 'function') {
      return (disabled as () => boolean)();
    }
    return !!disabled;
  };

  // Create listbox aria props
  const { listBoxProps } = createListBox(
    {
      ...ariaProps,
      get isDisabled() {
        return resolveDisabled();
      },
    },
    state
  );

  // Create focus ring
  const { isFocused, isFocusVisible, focusProps } = createFocusRing();

  // Render props values
  const renderValues = createMemo<ListBoxRenderProps>(() => ({
    isFocused: state.isFocused() || isFocused(),
    isFocusVisible: isFocusVisible(),
    isDisabled: resolveDisabled(),
    isEmpty: state.collection().size === 0,
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-ListBox',
    },
    renderValues
  );

  // Filter DOM props
  const domProps = createMemo(() => {
    const filtered = filterDOMProps(ariaProps as Record<string, unknown>, { global: true });
    return filtered;
  });

  // Remove ref from spread props
  const cleanListBoxProps = () => {
    const { ref: _ref1, ...rest } = listBoxProps as Record<string, unknown>;
    return rest;
  };
  const cleanFocusProps = () => {
    const { ref: _ref2, ...rest } = focusProps as Record<string, unknown>;
    return rest;
  };

  const isEmpty = () => stateProps.items.length === 0;

  return (
    <ListBoxContext.Provider value={{ state }}>
      <ListBoxStateContext.Provider value={state}>
        <ul
          {...domProps()}
          {...cleanListBoxProps()}
          {...cleanFocusProps()}
          class={renderProps.class()}
          style={renderProps.style()}
          data-focused={state.isFocused() || undefined}
          data-focus-visible={isFocusVisible() || undefined}
          data-disabled={resolveDisabled() || undefined}
          data-empty={isEmpty() || undefined}
        >
          {isEmpty() && local.renderEmptyState
            ? local.renderEmptyState()
            : <For each={stateProps.items}>{(item) => local.children(item)}</For>
          }
        </ul>
      </ListBoxStateContext.Provider>
    </ListBoxContext.Provider>
  );
}

/**
 * An option in a listbox.
 */
export function ListBoxOption<T>(props: ListBoxOptionProps<T>): JSX.Element {
  const [local, ariaProps] = splitProps(props, [
    'children',
    'class',
    'style',
    'slot',
    'id',
    'item',
    'textValue',
  ]);

  // Get state from context
  const context = useContext(ListBoxStateContext);
  if (!context) {
    throw new Error('ListBoxOption must be used within a ListBox');
  }
  const state = context as ListState<T>;

  // Create option aria props
  const optionAria = createOption<T>(
    {
      key: local.id,
      get isDisabled() {
        return ariaProps.isDisabled;
      },
      get 'aria-label'() {
        return ariaProps['aria-label'];
      },
    },
    state
  );

  // Create hover
  const { isHovered, hoverProps } = createHover({
    get isDisabled() {
      return optionAria.isDisabled();
    },
  });

  // Render props values
  const renderValues = createMemo<ListBoxOptionRenderProps>(() => ({
    isSelected: optionAria.isSelected(),
    isFocused: optionAria.isFocused(),
    isFocusVisible: optionAria.isFocusVisible(),
    isPressed: optionAria.isPressed(),
    isHovered: isHovered(),
    isDisabled: optionAria.isDisabled(),
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: local.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-ListBox-option',
    },
    renderValues
  );

  // Remove ref from spread props
  const cleanOptionProps = () => {
    const { ref: _ref1, ...rest } = optionAria.optionProps as Record<string, unknown>;
    return rest;
  };
  const cleanHoverProps = () => {
    const { ref: _ref2, ...rest } = hoverProps as Record<string, unknown>;
    return rest;
  };

  return (
    <li
      {...cleanOptionProps()}
      {...cleanHoverProps()}
      class={renderProps.class()}
      style={renderProps.style()}
      data-selected={optionAria.isSelected() || undefined}
      data-focused={optionAria.isFocused() || undefined}
      data-focus-visible={optionAria.isFocusVisible() || undefined}
      data-pressed={optionAria.isPressed() || undefined}
      data-hovered={isHovered() || undefined}
      data-disabled={optionAria.isDisabled() || undefined}
    >
      {renderProps.children}
    </li>
  );
}

// Attach Option as a static property
ListBox.Option = ListBoxOption;
