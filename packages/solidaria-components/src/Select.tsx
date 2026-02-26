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
  createInteractOutside,
  FocusScope,
  type AriaSelectProps,
  type AriaListBoxProps,
  type AriaOptionProps,
} from '@proyecto-viviana/solidaria';
import {
  createSelectState,
  type ListState,
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
import {
  SelectionIndicatorContext,
  type SelectionIndicatorContextValue,
} from './SelectionIndicator';

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
  /** Selection mode. */
  selectionMode?: 'single' | 'multiple';
  /** The currently selected key (controlled). */
  selectedKey?: Key | null;
  /** The default selected key (uncontrolled). */
  defaultSelectedKey?: Key | null;
  /** Currently selected keys (controlled, for multiple selection). */
  selectedKeys?: 'all' | Iterable<Key>;
  /** Default selected keys (uncontrolled, for multiple selection). */
  defaultSelectedKeys?: 'all' | Iterable<Key>;
  /** Handler called when selection changes. */
  onSelectionChange?: (key: Key | null) => void;
  /** Handler called when selected keys change. */
  onSelectionChangeKeys?: (keys: 'all' | Set<Key>) => void;
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
  labelProps: JSX.HTMLAttributes<HTMLElement>;
  menuProps: JSX.HTMLAttributes<HTMLElement>;
  isOpen: Accessor<boolean>;
  isFocused: Accessor<boolean>;
  isFocusVisible: Accessor<boolean>;
  isDisabled: Accessor<boolean>;
  placeholder?: string;
  items: T[];
  renderItem?: (item: T) => JSX.Element;
}

export const SelectContext = createContext<SelectContextValue<unknown> | null>(null);
export const SelectStateContext = createContext<SelectState<unknown> | null>(null);
export const SelectValueContext = SelectContext;

// ============================================
// COMPONENTS
// ============================================

/**
 * A select displays a collapsible list of options and allows a user to select one of them.
 */
export function Select<T>(props: SelectProps<T>): JSX.Element {
  const [local, stateProps, ariaProps] = splitProps(
    props,
    ['class', 'style', 'slot'],
    ['items', 'getKey', 'getTextValue', 'getDisabled', 'disabledKeys', 'selectionMode', 'selectedKey', 'defaultSelectedKey', 'selectedKeys', 'defaultSelectedKeys', 'onSelectionChange', 'onSelectionChangeKeys', 'isOpen', 'defaultOpen', 'onOpenChange', 'name']
  );

  const resolveDisabled = (): boolean => {
    const disabled = ariaProps.isDisabled;
    if (typeof disabled === 'function') {
      return (disabled as () => boolean)();
    }
    return !!disabled;
  };

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
    get selectionMode() {
      return stateProps.selectionMode;
    },
    get selectedKey() {
      return stateProps.selectedKey;
    },
    get defaultSelectedKey() {
      return stateProps.defaultSelectedKey;
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
    get onSelectionChangeKeys() {
      return stateProps.onSelectionChangeKeys;
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
      return resolveDisabled();
    },
    get isRequired() {
      return ariaProps.isRequired;
    },
  });

  // Create select aria props
  const { labelProps, triggerProps, valueProps, menuProps, isFocused, isFocusVisible, isOpen } = createSelect<T>(
    ariaProps,
    state
  );

  // Create hover for wrapper
  const { isHovered, hoverProps } = createHover({
    get isDisabled() {
      return resolveDisabled();
    },
  });

  // Render props values
  const renderValues = createMemo<SelectRenderProps>(() => ({
    isOpen: isOpen(),
    isFocused: isFocused(),
    isFocusVisible: isFocusVisible(),
    isDisabled: resolveDisabled(),
    isRequired: !!ariaProps.isRequired,
    isSelected: state.selectionMode() === 'multiple'
      ? state.selectedKeys() === 'all' || (state.selectedKeys() as Set<Key>).size > 0
      : state.selectedKey() != null,
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
  const cleanLabelProps = () => {
    const { ref: _ref, ...rest } = labelProps as Record<string, unknown>;
    return rest;
  };

  // Create hidden select for form submission
  const { containerProps, selectProps: hiddenSelectProps } = createHiddenSelect({
    state,
    name: stateProps.name,
    get isDisabled() {
      return resolveDisabled();
    },
  });

  return (
    <SelectContext.Provider
      value={{
        state,
        triggerProps,
        valueProps,
        labelProps,
        menuProps,
        isOpen,
        isFocused,
        isFocusVisible,
        isDisabled: resolveDisabled,
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
          data-disabled={resolveDisabled() || undefined}
          data-required={ariaProps.isRequired || undefined}
          data-hovered={isHovered() || undefined}
        >
          {/* Hidden select for form submission */}
          <div {...containerProps}>
            <select {...hiddenSelectProps}>
              <option />
              <For each={stateProps.items}>
                {(item) => {
                  const itemRecord = isObjectRecord(item) ? item : null;
                  const fallbackKey = itemRecord != null
                    ? toKey(itemRecord.key) ?? toKey(itemRecord.id)
                    : undefined;
                  const key = stateProps.getKey?.(item) ?? fallbackKey ?? String(item);
                  const fallbackTextValue = itemRecord != null
                    ? toTextValue(itemRecord.textValue) ?? toTextValue(itemRecord.label)
                    : undefined;
                  const textValue = stateProps.getTextValue?.(item) ?? fallbackTextValue ?? String(item);
                  const selectedKeys = state.selectedKeys();
                  const isSelected = state.selectionMode() === 'multiple'
                    ? selectedKeys === 'all'
                      ? true
                      : (selectedKeys as Set<Key>).has(key)
                    : key === state.selectedKey();
                  return (
                    <option value={String(key)} selected={isSelected}>
                      {textValue}
                    </option>
                  );
                }}
              </For>
            </select>
          </div>
          <Show when={ariaProps.label}>
            <span {...cleanLabelProps()}>{ariaProps.label as JSX.Element}</span>
          </Show>
          {props.children}
        </div>
      </SelectStateContext.Provider>
    </SelectContext.Provider>
  );
}

/**
 * The trigger button for a select.
 */
export function SelectTrigger(props: SelectTriggerProps): JSX.Element {
  const [local, domProps] = splitProps(props, ['class', 'style', 'slot', 'children']);

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
      children: props.children,
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
      {...domProps}
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
      {renderProps.renderChildren()}
    </button>
  );
}

// Default children function for SelectValue - defined at module level for SSR stability
function defaultSelectValueChildren<T>(values: SelectValueRenderProps<T>) {
  return values.selectedText ?? values.placeholder ?? '';
}

/**
 * Displays the selected value in a select.
 */
export function SelectValue<T>(props: SelectValueProps<T>): JSX.Element {
  const [local, domProps] = splitProps(props, ['class', 'style', 'slot', 'placeholder', 'children']);

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
    const selectedItems = state.selectedItems();
    const selectedText = state.selectionMode() === 'multiple'
      ? selectedItems.map((item) => item.textValue).join(', ')
      : selectedItem?.textValue ?? null;
    return {
      selectedItem,
      selectedText,
      isSelected: state.selectionMode() === 'multiple' ? selectedItems.length > 0 : selectedItem != null,
      placeholder: placeholder(),
    };
  });

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: props.children ?? defaultSelectValueChildren,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Select-value',
    },
    renderValues
  );

  return (
    <span
      {...domProps}
      {...valueProps}
      class={renderProps.class()}
      style={renderProps.style()}
      data-placeholder={!renderValues().isSelected || undefined}
    >
      {renderProps.renderChildren()}
    </span>
  );
}

/**
 * The listbox popup for a select.
 */
export function SelectListBox<T>(props: SelectListBoxProps<T>): JSX.Element {
  const [local, domProps] = splitProps(props, ['class', 'style', 'slot', 'children']);

  // Get context
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('SelectListBox must be used within a Select');
  }
  const { menuProps, state: selectState, isOpen } = context;
  const state = selectState as SelectState<T>;

  // Ref for the listbox element (for click outside detection)
  let listBoxRef: HTMLUListElement | undefined;

  // Handle click outside to close select
  createInteractOutside({
    ref: () => listBoxRef ?? null,
    onInteractOutside: () => {
      if (isOpen()) {
        state.close();
      }
    },
    get isDisabled() {
      return !isOpen();
    },
  });

  // Create listbox aria props - reuse select's internal list state via collection
  const { listBoxProps } = createListBox(
    {
      ...(menuProps as unknown as AriaListBoxProps),
      get isDisabled() {
        return state.isDisabled;
      },
    },
    createSelectListStateAdapter(state)
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
      <FocusScope restoreFocus autoFocus>
        <ul
          ref={(el) => (listBoxRef = el)}
          {...domProps}
          {...cleanMenuProps()}
          {...cleanListBoxProps()}
          class={renderProps.class()}
          style={renderProps.style()}
          data-focused={state.isFocused() || undefined}
        >
          <Show when={props.children} fallback={
            <For each={items()}>
              {(node) => (
                <SelectOption id={node.key}>
                  {node.textValue}
                </SelectOption>
              )}
            </For>
          }>
            <For each={items()}>
              {(node) => node.value != null ? props.children!(node.value) : null}
            </For>
          </Show>
        </ul>
      </FocusScope>
    </Show>
  );
}

/**
 * An option in a select listbox.
 */
export function SelectOption<T>(props: SelectOptionProps<T>): JSX.Element {
  const [local, ariaProps] = splitProps(props, [
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
  const selectContext = useContext(SelectContext) as SelectContextValue<T> | null;

  // Create option aria props - adapt select state to list state interface
  const optionAria = createOption<T>(
    {
      key: local.id,
      get isDisabled() {
        return Boolean(ariaProps.isDisabled || selectContext?.isDisabled());
      },
      get 'aria-label'() {
        return ariaProps['aria-label'] ?? local.textValue;
      },
    },
    {
      ...createSelectListStateAdapter(state),
      select: (key: Key) => {
        if (state.selectionMode() === 'multiple') {
          const keys = state.selectedKeys();
          if (keys === 'all') return;
          state.setSelectedKeys(new Set([...keys, key]));
          return;
        }
        state.setSelectedKey(key);
        state.close();
      },
      toggleSelection: (key: Key) => {
        if (state.selectionMode() === 'multiple') {
          const keys = state.selectedKeys();
          if (keys === 'all') return;
          const next = new Set(keys);
          if (next.has(key)) next.delete(key);
          else next.add(key);
          state.setSelectedKeys(next);
          return;
        }
        state.setSelectedKey(key);
        state.close();
      },
      replaceSelection: (key: Key) => {
        state.setSelectedKey(key);
        if (state.selectionMode() !== 'multiple') {
          state.close();
        }
      },
    }
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
      children: props.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Select-option',
    },
    renderValues
  );
  const hasPrimitiveLabel = () => {
    return typeof props.children === 'string' || typeof props.children === 'number';
  };

  const selectionIndicatorContext = createMemo<SelectionIndicatorContextValue>(() => ({
    isSelected: optionAria.isSelected,
  }));

  // Remove ref from spread props
  const cleanOptionProps = () => {
    const {
      ref: _ref1,
      'aria-describedby': _ariaDescribedby,
      ...rest
    } = optionAria.optionProps as Record<string, unknown>;
    if (!hasPrimitiveLabel() && rest['aria-label'] == null) {
      delete rest['aria-labelledby'];
    }
    return rest;
  };
  const cleanHoverProps = () => {
    const { ref: _ref2, ...rest } = hoverProps as Record<string, unknown>;
    return rest;
  };

  return (
    <SelectionIndicatorContext.Provider value={selectionIndicatorContext()}>
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
        {hasPrimitiveLabel()
          ? <span {...optionAria.labelProps}>{renderProps.renderChildren()}</span>
          : renderProps.renderChildren()}
      </li>
    </SelectionIndicatorContext.Provider>
  );
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toKey(value: unknown): Key | undefined {
  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }
  return undefined;
}

function toTextValue(value: unknown): string | undefined {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }
  return undefined;
}

function createSelectListStateAdapter<T>(state: SelectState<T>): ListState<T> {
  const selectedKeys = createMemo(() => {
    const keys = state.selectedKeys();
    return keys === 'all'
      ? new Set(Array.from(state.collection()).map((item) => item.key))
      : keys;
  });

  const disabledKeys = createMemo(() => {
    const keys = new Set<Key>();
    for (const node of state.collection()) {
      if (node.isDisabled) keys.add(node.key);
    }
    return keys;
  });

  return {
    collection: state.collection,
    isFocused: state.isFocused,
    setFocused: state.setFocused,
    focusedKey: state.focusedKey,
    setFocusedKey: (key) => state.setFocusedKey(key ?? null),
    childFocusStrategy: () => null,
    selectionMode: () => state.selectionMode(),
    selectionBehavior: () => 'replace',
    disallowEmptySelection: () => true,
    selectedKeys,
    disabledKeys,
    disabledBehavior: () => 'all',
    isEmpty: () => selectedKeys().size === 0,
    isSelectAll: () => state.selectedKeys() === 'all',
    isSelected: (key) => selectedKeys().has(key),
    isDisabled: state.isKeyDisabled,
    setSelectionBehavior: () => {},
    toggleSelection: (key) => {
      if (state.selectionMode() !== 'multiple') {
        state.setSelectedKey(key);
        return;
      }
      const keys = state.selectedKeys();
      if (keys === 'all') return;
      const next = new Set(keys);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      state.setSelectedKeys(next);
    },
    replaceSelection: (key) => state.setSelectedKey(key),
    setSelectedKeys: (keys) => state.setSelectedKeys(keys),
    selectAll: () => {},
    clearSelection: () => state.selectionMode() === 'multiple' ? state.setSelectedKeys([]) : state.setSelectedKey(null),
    toggleSelectAll: () => {},
    extendSelection: (toKey) => state.setSelectedKey(toKey),
    select: (key) => state.selectionMode() === 'multiple'
      ? state.setSelectedKeys([...(state.selectedKeys() === 'all' ? [] : state.selectedKeys() as Set<Key>), key])
      : state.setSelectedKey(key),
  };
}

// Attach sub-components
Select.Trigger = SelectTrigger;
Select.Value = SelectValue;
Select.ListBox = SelectListBox;
Select.Option = SelectOption;
