/**
 * Select component for solidaria-components
 *
 * A pre-wired headless select that combines state + aria hooks.
 * Port of react-aria-components/src/Select.tsx
 */

import {
  type JSX,
  type Accessor,
  createContext,
  createMemo,
  splitProps,
  useContext,
  For,
  Show,
} from 'solid-js';
import {
  createSelect,
  createHiddenSelect,
  createListBox,
  createOption,
  createHover,
  type AriaSelectProps,
  type AriaOptionProps,
} from '@proyecto-viviana/solidaria';
import {
  createSelectState,
  type SelectState,
  type Key,
  type CollectionNode,
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

export interface SelectRenderProps {
  /** Whether the select is open. */
  isOpen: boolean;
  /** Whether the select is focused. */
  isFocused: boolean;
  /** Whether the select has keyboard focus. */
  isFocusVisible: boolean;
  /** Whether the select is disabled. */
  isDisabled: boolean;
  /** Whether the select is required. */
  isRequired: boolean;
  /** Whether a value is selected. */
  isSelected: boolean;
}

export interface SelectProps<T>
  extends Omit<AriaSelectProps, 'children'>,
    SlotProps {
  /** The items to render in the select. */
  items: T[];
  /** Function to get the key from an item. */
  getKey?: (item: T) => Key;
  /** Function to get the text value from an item. */
  getTextValue?: (item: T) => string;
  /** Function to check if an item is disabled. */
  getDisabled?: (item: T) => boolean;
  /** Keys of disabled items. */
  disabledKeys?: Iterable<Key>;
  /** The currently selected key (controlled). */
  selectedKey?: Key | null;
  /** The default selected key (uncontrolled). */
  defaultSelectedKey?: Key | null;
  /** Handler called when selection changes. */
  onSelectionChange?: (key: Key | null) => void;
  /** Whether the select is open (controlled). */
  isOpen?: boolean;
  /** Whether the select is open by default (uncontrolled). */
  defaultOpen?: boolean;
  /** Handler called when the open state changes. */
  onOpenChange?: (isOpen: boolean) => void;
  /** Placeholder text when no option is selected. */
  placeholder?: string;
  /** The name of the select, used when submitting an HTML form. */
  name?: string;
  /** The children of the component (compound components: SelectTrigger, SelectListBox). */
  children: JSX.Element;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<SelectRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<SelectRenderProps>;
}

export interface SelectValueRenderProps<T> {
  /** The selected item. */
  selectedItem: CollectionNode<T> | null;
  /** The text value of the selected item. */
  selectedText: string | null;
  /** Whether a value is selected. */
  isSelected: boolean;
  /** The placeholder text. */
  placeholder: string | undefined;
}

export interface SelectValueProps<T> extends SlotProps {
  /** The children of the value. A function may be provided to receive render props. */
  children?: RenderChildren<SelectValueRenderProps<T>>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<SelectValueRenderProps<T>>;
  /** The inline style for the element. */
  style?: StyleOrFunction<SelectValueRenderProps<T>>;
  /** Placeholder text when no option is selected. Overrides the placeholder from Select. */
  placeholder?: string;
}

export interface SelectTriggerRenderProps {
  /** Whether the select is open. */
  isOpen: boolean;
  /** Whether the trigger is focused. */
  isFocused: boolean;
  /** Whether the trigger has keyboard focus. */
  isFocusVisible: boolean;
  /** Whether the trigger is hovered. */
  isHovered: boolean;
  /** Whether the trigger is disabled. */
  isDisabled: boolean;
}

export interface SelectTriggerProps extends SlotProps {
  /** The children of the trigger. A function may be provided to receive render props. */
  children?: RenderChildren<SelectTriggerRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<SelectTriggerRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<SelectTriggerRenderProps>;
}

export interface SelectListBoxRenderProps {
  /** Whether the listbox is focused. */
  isFocused: boolean;
}

export interface SelectListBoxProps<T> extends SlotProps {
  /** The children of the listbox. A function may be provided to render each item. */
  children?: (item: T) => JSX.Element;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<SelectListBoxRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<SelectListBoxRenderProps>;
}

export interface SelectOptionRenderProps {
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

export interface SelectOptionProps<T>
  extends Omit<AriaOptionProps, 'children' | 'key'>,
    SlotProps {
  /** The unique key for the option. */
  id: Key;
  /** The item value. */
  item?: T;
  /** The children of the option. A function may be provided to receive render props. */
  children?: RenderChildren<SelectOptionRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<SelectOptionRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<SelectOptionRenderProps>;
  /** The text value of the option (for typeahead). */
  textValue?: string;
}

// ============================================
// CONTEXT
// ============================================

interface SelectContextValue<T> {
  state: SelectState<T>;
  triggerProps: JSX.HTMLAttributes<HTMLElement>;
  valueProps: JSX.HTMLAttributes<HTMLElement>;
  menuProps: JSX.HTMLAttributes<HTMLElement>;
  isOpen: Accessor<boolean>;
  isFocused: Accessor<boolean>;
  isFocusVisible: Accessor<boolean>;
  placeholder?: string;
  items: T[];
  renderItem?: (item: T) => JSX.Element;
}

export const SelectContext = createContext<SelectContextValue<unknown> | null>(null);
export const SelectStateContext = createContext<SelectState<unknown> | null>(null);

// ============================================
// COMPONENTS
// ============================================

/**
 * A select displays a collapsible list of options and allows a user to select one of them.
 */
export function Select<T>(props: SelectProps<T>): JSX.Element {
  const [local, stateProps, ariaProps] = splitProps(
    props,
    ['children', 'class', 'style', 'slot'],
    ['items', 'getKey', 'getTextValue', 'getDisabled', 'disabledKeys', 'selectedKey', 'defaultSelectedKey', 'onSelectionChange', 'isOpen', 'defaultOpen', 'onOpenChange', 'name']
  );

  // Create select state
  const state = createSelectState<T>({
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
    get selectedKey() {
      return stateProps.selectedKey;
    },
    get defaultSelectedKey() {
      return stateProps.defaultSelectedKey;
    },
    get onSelectionChange() {
      return stateProps.onSelectionChange;
    },
    get isOpen() {
      return stateProps.isOpen;
    },
    get defaultOpen() {
      return stateProps.defaultOpen;
    },
    get onOpenChange() {
      return stateProps.onOpenChange;
    },
    get isDisabled() {
      return ariaProps.isDisabled;
    },
    get isRequired() {
      return ariaProps.isRequired;
    },
  });

  // Create select aria props
  const { triggerProps, valueProps, menuProps, isFocused, isFocusVisible, isOpen } = createSelect<T>(
    ariaProps,
    state
  );

  // Create hover for wrapper
  const { isHovered, hoverProps } = createHover({
    get isDisabled() {
      return ariaProps.isDisabled;
    },
  });

  // Render props values
  const renderValues = createMemo<SelectRenderProps>(() => ({
    isOpen: isOpen(),
    isFocused: isFocused(),
    isFocusVisible: isFocusVisible(),
    isDisabled: !!ariaProps.isDisabled,
    isRequired: !!ariaProps.isRequired,
    isSelected: state.selectedKey() != null,
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Select',
    },
    renderValues
  );

  // Filter DOM props
  const domProps = createMemo(() => {
    const filtered = filterDOMProps(ariaProps as Record<string, unknown>, { global: true });
    return filtered;
  });

  // Remove ref from hover props
  const cleanHoverProps = () => {
    const { ref: _ref, ...rest } = hoverProps as Record<string, unknown>;
    return rest;
  };

  // Create hidden select for form submission
  const { containerProps, selectProps: hiddenSelectProps } = createHiddenSelect({
    state,
    name: stateProps.name,
    get isDisabled() {
      return ariaProps.isDisabled;
    },
  });

  return (
    <SelectContext.Provider
      value={{
        state,
        triggerProps,
        valueProps,
        menuProps,
        isOpen,
        isFocused,
        isFocusVisible,
        placeholder: ariaProps.placeholder,
        items: stateProps.items,
      }}
    >
      <SelectStateContext.Provider value={state}>
        <div
          {...domProps()}
          {...cleanHoverProps()}
          class={renderProps.class()}
          style={renderProps.style()}
          data-open={isOpen() || undefined}
          data-focused={isFocused() || undefined}
          data-focus-visible={isFocusVisible() || undefined}
          data-disabled={ariaProps.isDisabled || undefined}
          data-required={ariaProps.isRequired || undefined}
          data-hovered={isHovered() || undefined}
        >
          {/* Hidden select for form submission */}
          <div {...containerProps}>
            <select {...hiddenSelectProps}>
              <option />
              <For each={stateProps.items}>
                {(item) => {
                  const key = stateProps.getKey?.(item) ?? (item as any).key ?? (item as any).id;
                  const textValue = stateProps.getTextValue?.(item) ?? (item as any).textValue ?? (item as any).label ?? String(item);
                  return (
                    <option value={String(key)} selected={key === state.selectedKey()}>
                      {textValue}
                    </option>
                  );
                }}
              </For>
            </select>
          </div>
          {local.children}
        </div>
      </SelectStateContext.Provider>
    </SelectContext.Provider>
  );
}

/**
 * The trigger button for a select.
 */
export function SelectTrigger(props: SelectTriggerProps): JSX.Element {
  const [local] = splitProps(props, ['children', 'class', 'style', 'slot']);

  // Get context
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('SelectTrigger must be used within a Select');
  }
  const { triggerProps, isOpen, isFocused, isFocusVisible, state } = context;

  // Create hover
  const { isHovered, hoverProps } = createHover({
    get isDisabled() {
      return state.isDisabled;
    },
  });

  // Render props values
  const renderValues = createMemo<SelectTriggerRenderProps>(() => ({
    isOpen: isOpen(),
    isFocused: isFocused(),
    isFocusVisible: isFocusVisible(),
    isHovered: isHovered(),
    isDisabled: state.isDisabled,
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: local.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Select-trigger',
    },
    renderValues
  );

  // Remove ref from spread props
  const cleanTriggerProps = () => {
    const { ref: _ref1, ...rest } = triggerProps as Record<string, unknown>;
    return rest;
  };
  const cleanHoverProps = () => {
    const { ref: _ref2, ...rest } = hoverProps as Record<string, unknown>;
    return rest;
  };

  return (
    <button
      {...cleanTriggerProps()}
      {...cleanHoverProps()}
      type="button"
      class={renderProps.class()}
      style={renderProps.style()}
      data-open={isOpen() || undefined}
      data-focused={isFocused() || undefined}
      data-focus-visible={isFocusVisible() || undefined}
      data-hovered={isHovered() || undefined}
      data-disabled={state.isDisabled || undefined}
    >
      {renderProps.children}
    </button>
  );
}

/**
 * Displays the selected value in a select.
 */
export function SelectValue<T>(props: SelectValueProps<T>): JSX.Element {
  const [local] = splitProps(props, ['children', 'class', 'style', 'slot', 'placeholder']);

  // Get context
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('SelectValue must be used within a Select');
  }
  const { valueProps, placeholder: contextPlaceholder } = context;
  const state = context.state as SelectState<T>;

  // Use local placeholder if provided, otherwise fall back to context
  const placeholder = () => local.placeholder ?? contextPlaceholder;

  // Render props values
  const renderValues = createMemo<SelectValueRenderProps<T>>(() => {
    const selectedItem = state.selectedItem();
    return {
      selectedItem,
      selectedText: selectedItem?.textValue ?? null,
      isSelected: selectedItem != null,
      placeholder: placeholder(),
    };
  });

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: local.children ?? (() => {
        const values = renderValues();
        return values.selectedText ?? values.placeholder ?? '';
      }),
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Select-value',
    },
    renderValues
  );

  return (
    <span
      {...valueProps}
      class={renderProps.class()}
      style={renderProps.style()}
      data-placeholder={!renderValues().isSelected || undefined}
    >
      {renderProps.children}
    </span>
  );
}

/**
 * The listbox popup for a select.
 */
export function SelectListBox<T>(props: SelectListBoxProps<T>): JSX.Element {
  const [local] = splitProps(props, ['children', 'class', 'style', 'slot']);

  // Get context
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('SelectListBox must be used within a Select');
  }
  const { menuProps, state: selectState, isOpen } = context;
  const state = selectState as SelectState<T>;

  // Create listbox aria props - reuse select's internal list state via collection
  const { listBoxProps } = createListBox(
    {},
    {
      collection: state.collection,
      focusedKey: state.focusedKey,
      setFocusedKey: state.setFocusedKey,
      isFocused: state.isFocused,
      setFocused: state.setFocused,
      selectedKeys: () => {
        const key = state.selectedKey();
        return key != null ? new Set([key]) : new Set();
      },
      isSelected: (key: Key) => state.selectedKey() === key,
      isDisabled: state.isKeyDisabled,
      selectionMode: () => 'single' as const,
      disallowEmptySelection: () => true,
      select: (key: Key) => state.setSelectedKey(key),
      toggleSelection: (key: Key) => state.setSelectedKey(key),
      replaceSelection: (key: Key) => state.setSelectedKey(key),
      extendSelection: () => {},
      selectAll: () => {},
      clearSelection: () => state.setSelectedKey(null),
      childFocusStrategy: () => null,
    } as any
  );

  // Render props values
  const renderValues = createMemo<SelectListBoxRenderProps>(() => ({
    isFocused: state.isFocused(),
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Select-listbox',
    },
    renderValues
  );

  // Remove ref from spread props
  const cleanMenuProps = () => {
    const { ref: _ref1, ...rest } = menuProps as Record<string, unknown>;
    return rest;
  };
  const cleanListBoxProps = () => {
    const { ref: _ref2, ...rest } = listBoxProps as Record<string, unknown>;
    return rest;
  };

  const items = () => Array.from(state.collection());

  return (
    <Show when={isOpen()}>
      <ul
        {...cleanMenuProps()}
        {...cleanListBoxProps()}
        class={renderProps.class()}
        style={renderProps.style()}
        data-focused={state.isFocused() || undefined}
      >
        <Show when={local.children} fallback={
          <For each={items()}>
            {(node) => (
              <SelectOption id={node.key}>
                {node.textValue}
              </SelectOption>
            )}
          </For>
        }>
          <For each={items()}>
            {(node) => node.value != null ? local.children!(node.value) : null}
          </For>
        </Show>
      </ul>
    </Show>
  );
}

/**
 * An option in a select listbox.
 */
export function SelectOption<T>(props: SelectOptionProps<T>): JSX.Element {
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
  const context = useContext(SelectStateContext);
  if (!context) {
    throw new Error('SelectOption must be used within a Select');
  }
  const state = context as SelectState<T>;

  // Create option aria props - adapt select state to list state interface
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
    {
      collection: state.collection,
      focusedKey: state.focusedKey,
      setFocusedKey: state.setFocusedKey,
      isFocused: state.isFocused,
      setFocused: state.setFocused,
      selectedKeys: () => {
        const key = state.selectedKey();
        return key != null ? new Set([key]) : new Set();
      },
      isSelected: (key: Key) => state.selectedKey() === key,
      isDisabled: state.isKeyDisabled,
      selectionMode: () => 'single' as const,
      disallowEmptySelection: () => true,
      select: (key: Key) => {
        state.setSelectedKey(key);
        state.close();
      },
      toggleSelection: (key: Key) => {
        state.setSelectedKey(key);
        state.close();
      },
      replaceSelection: (key: Key) => {
        state.setSelectedKey(key);
        state.close();
      },
      extendSelection: () => {},
      selectAll: () => {},
      clearSelection: () => state.setSelectedKey(null),
      childFocusStrategy: () => null,
    } as any
  );

  // Create hover
  const { isHovered, hoverProps } = createHover({
    get isDisabled() {
      return optionAria.isDisabled();
    },
  });

  // Render props values
  const renderValues = createMemo<SelectOptionRenderProps>(() => ({
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
      defaultClassName: 'solidaria-Select-option',
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

// Attach sub-components
Select.Trigger = SelectTrigger;
Select.Value = SelectValue;
Select.ListBox = SelectListBox;
Select.Option = SelectOption;
