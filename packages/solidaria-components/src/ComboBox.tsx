/**
 * ComboBox component for solidaria-components
 *
 * A pre-wired headless combobox that combines state + aria hooks.
 * Port of react-aria-components/src/ComboBox.tsx
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
  createComboBox,
  createListBox,
  createOption,
  createHover,
  createInteractOutside,
  type AriaComboBoxProps,
  type AriaOptionProps,
} from '@proyecto-viviana/solidaria';
import {
  createComboBoxState,
  defaultContainsFilter,
  type ComboBoxState,
  type Key,
  type FilterFn,
  type MenuTriggerAction,
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

export interface ComboBoxRenderProps {
  /** Whether the combobox listbox is open. */
  isOpen: boolean;
  /** Whether the combobox input is focused. */
  isFocused: boolean;
  /** Whether the combobox input has keyboard focus. */
  isFocusVisible: boolean;
  /** Whether the combobox is disabled. */
  isDisabled: boolean;
  /** Whether the combobox is required. */
  isRequired: boolean;
  /** Whether a value is selected. */
  isSelected: boolean;
  /** The current input value. */
  inputValue: string;
}

export interface ComboBoxProps<T>
  extends Omit<AriaComboBoxProps, 'children'>,
    SlotProps {
  /** The items to render in the combobox. */
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
  /** The current input value (controlled). */
  inputValue?: string;
  /** The default input value (uncontrolled). */
  defaultInputValue?: string;
  /** Handler called when input value changes. */
  onInputChange?: (value: string) => void;
  /** Whether the combobox is open (controlled). */
  isOpen?: boolean;
  /** Whether the combobox is open by default (uncontrolled). */
  defaultOpen?: boolean;
  /** Handler called when the open state changes. */
  onOpenChange?: (isOpen: boolean, trigger?: MenuTriggerAction) => void;
  /** The filter function to use for filtering items. */
  defaultFilter?: FilterFn;
  /** Whether to allow custom values that don't match any item. */
  allowsCustomValue?: boolean;
  /** Whether to allow an empty collection (show listbox even with no matches). */
  allowsEmptyCollection?: boolean;
  /** The trigger mechanism for the combobox menu. */
  menuTrigger?: 'focus' | 'input' | 'manual';
  /** The name of the combobox, used when submitting an HTML form. */
  name?: string;
  /** The children of the component (compound components: ComboBoxInput, ComboBoxButton, ComboBoxListBox). */
  children: JSX.Element;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<ComboBoxRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<ComboBoxRenderProps>;
}

export interface ComboBoxInputRenderProps {
  /** Whether the combobox is open. */
  isOpen: boolean;
  /** Whether the input is focused. */
  isFocused: boolean;
  /** Whether the input has keyboard focus. */
  isFocusVisible: boolean;
  /** Whether the input is hovered. */
  isHovered: boolean;
  /** Whether the input is disabled. */
  isDisabled: boolean;
  /** The current input value. */
  inputValue: string;
}

export interface ComboBoxInputProps extends SlotProps {
  /** The children of the input. */
  children?: RenderChildren<ComboBoxInputRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<ComboBoxInputRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<ComboBoxInputRenderProps>;
}

export interface ComboBoxButtonRenderProps {
  /** Whether the combobox is open. */
  isOpen: boolean;
  /** Whether the button is focused. */
  isFocused: boolean;
  /** Whether the button is hovered. */
  isHovered: boolean;
  /** Whether the button is pressed. */
  isPressed: boolean;
  /** Whether the button is disabled. */
  isDisabled: boolean;
}

export interface ComboBoxButtonProps extends SlotProps {
  /** The children of the button. */
  children?: RenderChildren<ComboBoxButtonRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<ComboBoxButtonRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<ComboBoxButtonRenderProps>;
}

export interface ComboBoxListBoxRenderProps {
  /** Whether the listbox is focused. */
  isFocused: boolean;
}

export interface ComboBoxListBoxProps<T> extends SlotProps {
  /** The children of the listbox. A function may be provided to render each item. */
  children?: (item: T) => JSX.Element;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<ComboBoxListBoxRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<ComboBoxListBoxRenderProps>;
}

export interface ComboBoxOptionRenderProps {
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

export interface ComboBoxOptionProps<T>
  extends Omit<AriaOptionProps, 'children' | 'key'>,
    SlotProps {
  /** The unique key for the option. */
  id: Key;
  /** The item value. */
  item?: T;
  /** The children of the option. A function may be provided to receive render props. */
  children?: RenderChildren<ComboBoxOptionRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<ComboBoxOptionRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<ComboBoxOptionRenderProps>;
  /** The text value of the option (for typeahead). */
  textValue?: string;
}

// ============================================
// CONTEXT
// ============================================

interface ComboBoxContextValue<T> {
  state: ComboBoxState<T>;
  inputProps: JSX.InputHTMLAttributes<HTMLInputElement>;
  buttonProps: JSX.HTMLAttributes<HTMLElement>;
  listBoxProps: JSX.HTMLAttributes<HTMLElement>;
  labelProps: JSX.HTMLAttributes<HTMLElement>;
  isOpen: Accessor<boolean>;
  isFocused: Accessor<boolean>;
  isFocusVisible: Accessor<boolean>;
  items: T[];
  inputRef: () => HTMLInputElement | null;
  setInputRef: (el: HTMLInputElement | null) => void;
  buttonRef: () => HTMLElement | null;
  setButtonRef: (el: HTMLElement | null) => void;
}

export const ComboBoxContext = createContext<ComboBoxContextValue<unknown> | null>(null);
export const ComboBoxStateContext = createContext<ComboBoxState<unknown> | null>(null);

// ============================================
// COMPONENTS
// ============================================

/**
 * A combobox combines a text input with a listbox, allowing users to filter a list of options.
 */
export function ComboBox<T>(props: ComboBoxProps<T>): JSX.Element {
  const [local, stateProps, ariaProps] = splitProps(
    props,
    ['children', 'class', 'style', 'slot'],
    [
      'items',
      'getKey',
      'getTextValue',
      'getDisabled',
      'disabledKeys',
      'selectedKey',
      'defaultSelectedKey',
      'onSelectionChange',
      'inputValue',
      'defaultInputValue',
      'onInputChange',
      'isOpen',
      'defaultOpen',
      'onOpenChange',
      'defaultFilter',
      'allowsCustomValue',
      'allowsEmptyCollection',
      'menuTrigger',
      'name',
    ]
  );

  // Refs
  let inputRef: HTMLInputElement | null = null;
  let buttonRef: HTMLElement | null = null;

  // Create combobox state
  const state = createComboBoxState<T>({
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
    get inputValue() {
      return stateProps.inputValue;
    },
    get defaultInputValue() {
      return stateProps.defaultInputValue;
    },
    get onInputChange() {
      return stateProps.onInputChange;
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
    get defaultFilter() {
      return stateProps.defaultFilter;
    },
    get allowsCustomValue() {
      return stateProps.allowsCustomValue;
    },
    get allowsEmptyCollection() {
      return stateProps.allowsEmptyCollection;
    },
    get menuTrigger() {
      return stateProps.menuTrigger;
    },
    get isDisabled() {
      return ariaProps.isDisabled;
    },
    get isReadOnly() {
      return ariaProps.isReadOnly;
    },
    get isRequired() {
      return ariaProps.isRequired;
    },
  });

  // Create combobox aria props
  const comboBoxAria = createComboBox<T>(
    ariaProps,
    state,
    () => inputRef,
    () => buttonRef
  );

  // Create hover for wrapper
  const { isHovered, hoverProps } = createHover({
    get isDisabled() {
      return ariaProps.isDisabled;
    },
  });

  // Render props values
  const renderValues = createMemo<ComboBoxRenderProps>(() => ({
    isOpen: comboBoxAria.isOpen(),
    isFocused: comboBoxAria.isFocused(),
    isFocusVisible: comboBoxAria.isFocusVisible(),
    isDisabled: !!ariaProps.isDisabled,
    isRequired: !!ariaProps.isRequired,
    isSelected: state.selectedKey() != null,
    inputValue: state.inputValue(),
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-ComboBox',
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

  return (
    <ComboBoxContext.Provider
      value={{
        state,
        inputProps: comboBoxAria.inputProps,
        buttonProps: comboBoxAria.buttonProps,
        listBoxProps: comboBoxAria.listBoxProps,
        labelProps: comboBoxAria.labelProps,
        isOpen: comboBoxAria.isOpen,
        isFocused: comboBoxAria.isFocused,
        isFocusVisible: comboBoxAria.isFocusVisible,
        items: stateProps.items,
        inputRef: () => inputRef,
        setInputRef: (el) => { inputRef = el; },
        buttonRef: () => buttonRef,
        setButtonRef: (el) => { buttonRef = el; },
      }}
    >
      <ComboBoxStateContext.Provider value={state}>
        <div
          {...domProps()}
          {...cleanHoverProps()}
          class={renderProps.class()}
          style={renderProps.style()}
          data-open={comboBoxAria.isOpen() || undefined}
          data-focused={comboBoxAria.isFocused() || undefined}
          data-focus-visible={comboBoxAria.isFocusVisible() || undefined}
          data-disabled={ariaProps.isDisabled || undefined}
          data-required={ariaProps.isRequired || undefined}
          data-hovered={isHovered() || undefined}
        >
          {/* Hidden input for form submission */}
          <Show when={stateProps.name}>
            <input
              type="hidden"
              name={stateProps.name}
              value={state.selectedKey()?.toString() ?? ''}
            />
          </Show>
          {local.children}
        </div>
      </ComboBoxStateContext.Provider>
    </ComboBoxContext.Provider>
  );
}

/**
 * The text input for a combobox.
 */
export function ComboBoxInput(props: ComboBoxInputProps): JSX.Element {
  const [local] = splitProps(props, ['children', 'class', 'style', 'slot']);

  // Get context
  const context = useContext(ComboBoxContext);
  if (!context) {
    throw new Error('ComboBoxInput must be used within a ComboBox');
  }
  const { inputProps, isOpen, isFocused, isFocusVisible, state, setInputRef } = context;

  // Create hover
  const { isHovered, hoverProps } = createHover({
    get isDisabled() {
      return state.isDisabled;
    },
  });

  // Render props values
  const renderValues = createMemo<ComboBoxInputRenderProps>(() => ({
    isOpen: isOpen(),
    isFocused: isFocused(),
    isFocusVisible: isFocusVisible(),
    isHovered: isHovered(),
    isDisabled: state.isDisabled,
    inputValue: state.inputValue(),
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: local.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-ComboBox-input',
    },
    renderValues
  );

  // Remove ref from spread props
  const cleanInputProps = () => {
    const { ref: _ref1, value: _value, ...rest } = inputProps as Record<string, unknown>;
    return rest;
  };
  const cleanHoverProps = () => {
    const { ref: _ref2, ...rest } = hoverProps as Record<string, unknown>;
    return rest;
  };

  return (
    <input
      ref={(el) => setInputRef(el)}
      {...cleanInputProps()}
      {...cleanHoverProps()}
      value={state.inputValue()}
      class={renderProps.class()}
      style={renderProps.style()}
      data-open={isOpen() || undefined}
      data-focused={isFocused() || undefined}
      data-focus-visible={isFocusVisible() || undefined}
      data-hovered={isHovered() || undefined}
      data-disabled={state.isDisabled || undefined}
    />
  );
}

/**
 * The trigger button for a combobox.
 */
export function ComboBoxButton(props: ComboBoxButtonProps): JSX.Element {
  const [local] = splitProps(props, ['children', 'class', 'style', 'slot']);

  // Get context
  const context = useContext(ComboBoxContext);
  if (!context) {
    throw new Error('ComboBoxButton must be used within a ComboBox');
  }
  const { buttonProps, isOpen, isFocused, state, setButtonRef } = context;

  // Create hover
  const { isHovered, hoverProps } = createHover({
    get isDisabled() {
      return state.isDisabled;
    },
  });

  // Track pressed state
  let isPressed = false;

  // Render props values
  const renderValues = createMemo<ComboBoxButtonRenderProps>(() => ({
    isOpen: isOpen(),
    isFocused: isFocused(),
    isHovered: isHovered(),
    isPressed,
    isDisabled: state.isDisabled,
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: local.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-ComboBox-button',
    },
    renderValues
  );

  // Remove ref from spread props
  const cleanButtonProps = () => {
    const { ref: _ref1, ...rest } = buttonProps as Record<string, unknown>;
    return rest;
  };
  const cleanHoverProps = () => {
    const { ref: _ref2, ...rest } = hoverProps as Record<string, unknown>;
    return rest;
  };

  return (
    <button
      ref={(el) => setButtonRef(el)}
      {...cleanButtonProps()}
      {...cleanHoverProps()}
      class={renderProps.class()}
      style={renderProps.style()}
      data-open={isOpen() || undefined}
      data-focused={isFocused() || undefined}
      data-hovered={isHovered() || undefined}
      data-disabled={state.isDisabled || undefined}
    >
      {renderProps.renderChildren()}
    </button>
  );
}

/**
 * The listbox popup for a combobox.
 */
export function ComboBoxListBox<T>(props: ComboBoxListBoxProps<T>): JSX.Element {
  const [local] = splitProps(props, ['children', 'class', 'style', 'slot']);

  // Get context
  const context = useContext(ComboBoxContext);
  if (!context) {
    throw new Error('ComboBoxListBox must be used within a ComboBox');
  }
  const { listBoxProps: contextListBoxProps, state: comboBoxState, isOpen, inputRef } = context;
  const state = comboBoxState as ComboBoxState<T>;

  // Ref for the listbox element (for click outside detection)
  let listBoxRef: HTMLUListElement | undefined;

  // Handle click outside to close combobox
  createInteractOutside({
    ref: () => listBoxRef ?? null,
    onInteractOutside: (e) => {
      // Don't close if clicking the input or button
      const target = e.target as HTMLElement;
      const input = inputRef();
      if (input?.contains(target)) {
        return;
      }
      if (isOpen()) {
        state.close();
      }
    },
    get isDisabled() {
      return !isOpen();
    },
  });

  // Create listbox aria props using ComboBoxState's ListState-compatible interface
  const { listBoxProps } = createListBox(
    {},
    {
      collection: state.collection,
      focusedKey: state.focusedKey,
      setFocusedKey: state.setFocusedKey,
      isFocused: state.isFocused,
      setFocused: state.setFocused,
      // Use state's built-in methods
      selectionMode: state.selectionMode,
      select: state.select,
      isSelected: state.isSelected,
      isDisabled: state.isKeyDisabled,
      // Additional ListState interface requirements
      selectedKeys: () => {
        const key = state.selectedKey();
        return key != null ? new Set([key]) : new Set();
      },
      disallowEmptySelection: () => true,
      toggleSelection: state.select,
      replaceSelection: state.select,
      extendSelection: () => {},
      selectAll: () => {},
      clearSelection: () => state.setSelectedKey(null),
      childFocusStrategy: () => null,
    } as any
  );

  // Render props values
  const renderValues = createMemo<ComboBoxListBoxRenderProps>(() => ({
    isFocused: state.isFocused(),
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-ComboBox-listbox',
    },
    renderValues
  );

  // Remove ref from spread props
  const cleanContextProps = () => {
    const { ref: _ref1, ...rest } = contextListBoxProps as Record<string, unknown>;
    return rest;
  };
  const cleanListBoxProps = () => {
    const { ref: _ref2, ...rest } = listBoxProps as Record<string, unknown>;
    return rest;
  };

  const items = () => Array.from(state.collection());

  // Prevent focus from being lost when clicking in the listbox
  // This is critical - if we don't prevent default, the input loses focus
  // and the blur handler closes the menu before the click can be processed
  // We need to attach this in the ref callback to use capture phase
  const setupMouseDownHandler = (el: HTMLUListElement) => {
    listBoxRef = el;
    if (el) {
      const mouseHandler = (e: MouseEvent) => {
        e.preventDefault();
      };
      const pointerHandler = (e: PointerEvent) => {
        e.preventDefault();
      };
      el.addEventListener('mousedown', mouseHandler, true); // capture phase
      el.addEventListener('pointerdown', pointerHandler, true); // capture phase
    }
  };

  return (
    <Show when={isOpen()}>
      <ul
        ref={setupMouseDownHandler}
        {...cleanContextProps()}
        {...cleanListBoxProps()}
        class={renderProps.class()}
        style={renderProps.style()}
        data-focused={state.isFocused() || undefined}
      >
        <Show when={local.children} fallback={
          <For each={items()}>
            {(node) => (
              <ComboBoxOption id={node.key}>
                {node.textValue}
              </ComboBoxOption>
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
 * An option in a combobox listbox.
 */
export function ComboBoxOption<T>(props: ComboBoxOptionProps<T>): JSX.Element {
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
  const context = useContext(ComboBoxStateContext);
  if (!context) {
    throw new Error('ComboBoxOption must be used within a ComboBox');
  }
  const state = context as ComboBoxState<T>;

  // Create option aria props using ComboBoxState's ListState-compatible interface
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
      // Use state's built-in methods
      selectionMode: state.selectionMode,
      select: state.select,
      isSelected: state.isSelected,
      isDisabled: state.isKeyDisabled,
      // Additional ListState interface requirements
      selectedKeys: () => {
        const key = state.selectedKey();
        return key != null ? new Set([key]) : new Set();
      },
      disallowEmptySelection: () => true,
      toggleSelection: state.select,
      replaceSelection: state.select,
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
  const renderValues = createMemo<ComboBoxOptionRenderProps>(() => ({
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
      defaultClassName: 'solidaria-ComboBox-option',
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
      {renderProps.renderChildren()}
    </li>
  );
}

// Attach sub-components
ComboBox.Input = ComboBoxInput;
ComboBox.Button = ComboBoxButton;
ComboBox.ListBox = ComboBoxListBox;
ComboBox.Option = ComboBoxOption;

// Re-export filter function for convenience
export { defaultContainsFilter };
