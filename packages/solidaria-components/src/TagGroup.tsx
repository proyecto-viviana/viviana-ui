/**
 * TagGroup component for solidaria-components
 *
 * Pre-wired headless tag group component that combines aria hooks.
 * Port of react-aria-components/src/TagGroup.tsx
 *
 * A tag group is a focusable list of labels, categories, keywords, filters, or other items,
 * with support for keyboard navigation, selection, and removal.
 */

import {
  type JSX,
  createContext,
  createMemo,
  createSignal,
  splitProps,
  useContext,
  For,
  Show,
} from 'solid-js';
import {
  createTagGroup,
  createTag,
  type AriaTagGroupProps,
} from '@proyecto-viviana/solidaria';
import {
  createListState,
  type ListState,
  type Key,
  type SelectionMode,
  type SelectionBehavior,
} from '@proyecto-viviana/solid-stately';
import {
  type RenderChildren,
  type ClassNameOrFunction,
  type StyleOrFunction,
  type SlotProps,
  useRenderProps,
  filterDOMProps,
  dataAttr,
} from './utils';

// ============================================
// TYPES
// ============================================

export interface TagGroupRenderProps {
  /** Whether the tag group is disabled. */
  isDisabled: boolean;
  /** Whether the tag list is empty. */
  isEmpty: boolean;
}

export interface TagGroupProps
  extends Omit<AriaTagGroupProps, 'id'>,
    SlotProps {
  /** The children of the component. */
  children?: JSX.Element;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<TagGroupRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<TagGroupRenderProps>;
}

export interface TagListRenderProps {
  /** Whether the tag list is empty. */
  isEmpty: boolean;
  /** Whether the tag list is focused. */
  isFocused: boolean;
}

export interface TagListProps<T> extends SlotProps {
  /** The items to display in the tag list. */
  items: T[];
  /** Function to render each item. */
  children: (item: T) => JSX.Element;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<TagListRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<TagListRenderProps>;
  /** Content to render when the list is empty. */
  renderEmptyState?: () => JSX.Element;
  /** The selection mode for the tag list. */
  selectionMode?: SelectionMode;
  /** How selection behaves in the collection. */
  selectionBehavior?: SelectionBehavior;
  /** The currently selected keys (controlled). */
  selectedKeys?: Iterable<Key>;
  /** The default selected keys (uncontrolled). */
  defaultSelectedKeys?: Iterable<Key>;
  /** Handler called when selection changes. */
  onSelectionChange?: (keys: 'all' | Set<Key>) => void;
  /** Keys that are disabled. */
  disabledKeys?: Iterable<Key>;
  /** Function to get a unique key from an item. */
  getKey?: (item: T) => Key;
  /** Accessibility label. */
  label?: string;
  /** Custom aria-label. */
  'aria-label'?: string;
  /** Reference to external label element. */
  'aria-labelledby'?: string;
  /** Reference to description element. */
  'aria-describedby'?: string;
  /** Whether the tag list is disabled. */
  isDisabled?: boolean;
  /** Handler called when tags are removed. */
  onRemove?: (keys: Set<Key>) => void;
}

export interface TagRenderProps {
  /** Whether the tag is selected. */
  isSelected: boolean;
  /** Whether the tag is disabled. */
  isDisabled: boolean;
  /** Whether the tag is focused. */
  isFocused: boolean;
  /** Whether the tag is pressed. */
  isPressed: boolean;
  /** Whether the tag allows removal. */
  allowsRemoving: boolean;
  /** The selection mode. */
  selectionMode: SelectionMode;
}

export interface TagProps extends SlotProps {
  /** A unique key for this tag. */
  id: Key;
  /** Whether the tag is disabled. */
  isDisabled?: boolean;
  /** A text value for accessibility. */
  textValue?: string;
  /** The children of the component. A function may be provided to receive render props. */
  children?: RenderChildren<TagRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<TagRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<TagRenderProps>;
}

// ============================================
// CONTEXT
// ============================================

interface TagGroupContextValue {
  state: ListState;
  onRemove?: (keys: Set<Key>) => void;
}

export const TagGroupContext = createContext<TagGroupContextValue | null>(null);
export const TagListStateContext = createContext<ListState | null>(null);

export function useTagGroupContext(): TagGroupContextValue | null {
  return useContext(TagGroupContext);
}

// ============================================
// TAG GROUP COMPONENT
// ============================================

/**
 * A tag group is a focusable list of labels, categories, keywords, filters, or other items,
 * with support for keyboard navigation, selection, and removal.
 *
 * @example
 * ```tsx
 * <TagGroup label="Categories" onRemove={(keys) => removeItems(keys)}>
 *   <TagList items={items}>
 *     {(item) => <Tag id={item.id}>{item.name}</Tag>}
 *   </TagList>
 * </TagGroup>
 * ```
 */
export function TagGroup(props: TagGroupProps): JSX.Element {
  const [local] = splitProps(props, [
    'children',
    'class',
    'style',
    'slot',
  ]);

  // We need TagList to provide the state, so TagGroup just provides context
  return (
    <div
      class={typeof local.class === 'string' ? local.class : 'solidaria-TagGroup'}
      style={typeof local.style === 'object' ? local.style : undefined}
      slot={local.slot}
    >
      {local.children}
    </div>
  );
}

// ============================================
// TAG LIST COMPONENT
// ============================================

/**
 * TagList contains the list of tags within a TagGroup.
 */
export function TagList<T extends { id?: Key; key?: Key }>(props: TagListProps<T>): JSX.Element {
  const [local] = splitProps(props, [
    'items',
    'children',
    'class',
    'style',
    'slot',
    'renderEmptyState',
    'selectionMode',
    'selectionBehavior',
    'selectedKeys',
    'defaultSelectedKeys',
    'onSelectionChange',
    'disabledKeys',
    'getKey',
    'label',
    'aria-label',
    'aria-labelledby',
    'aria-describedby',
    'isDisabled',
    'onRemove',
  ]);

  // Create a ref for the grid
  const [gridRef, setGridRef] = createSignal<HTMLDivElement | null>(null);

  // Default getKey function
  const getKey = (item: T): Key => {
    if (local.getKey) return local.getKey(item);
    if (item.id !== undefined) return item.id;
    if (item.key !== undefined) return item.key;
    return String(item);
  };

  // Create list state
  const state = createListState({
    get items() { return local.items; },
    getKey,
    get selectionMode() { return local.selectionMode ?? 'none'; },
    get selectionBehavior() { return local.selectionBehavior ?? 'toggle'; },
    get selectedKeys() { return local.selectedKeys; },
    get defaultSelectedKeys() { return local.defaultSelectedKeys; },
    get onSelectionChange() { return local.onSelectionChange; },
    get disabledKeys() { return local.disabledKeys; },
  });

  // Create tag group accessibility props
  const tagGroupAria = createTagGroup(
    {
      get label() { return local.label; },
      get 'aria-label'() { return local['aria-label']; },
      get 'aria-labelledby'() { return local['aria-labelledby']; },
      get 'aria-describedby'() { return local['aria-describedby']; },
      get isDisabled() { return local.isDisabled; },
      get onRemove() { return local.onRemove; },
    },
    state,
    gridRef
  );

  // Track focus
  const [isFocused, setIsFocused] = createSignal(false);

  // Render props values
  const renderValues = createMemo<TagListRenderProps>(() => ({
    isEmpty: local.items.length === 0,
    isFocused: isFocused(),
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-TagList',
    },
    renderValues
  );

  // Context value
  const contextValue: TagGroupContextValue = {
    state,
    get onRemove() { return local.onRemove; },
  };

  return (
    <TagGroupContext.Provider value={contextValue}>
      <TagListStateContext.Provider value={state}>
        <div
          ref={setGridRef}
          {...tagGroupAria.gridProps}
          class={renderProps.class()}
          style={renderProps.style()}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          data-empty={dataAttr(local.items.length === 0)}
          data-focused={dataAttr(isFocused())}
        >
          <Show
            when={local.items.length > 0}
            fallback={local.renderEmptyState?.()}
          >
            <For each={local.items}>
              {(item) => local.children(item)}
            </For>
          </Show>
        </div>
      </TagListStateContext.Provider>
    </TagGroupContext.Provider>
  );
}

// ============================================
// TAG COMPONENT
// ============================================

/**
 * A Tag is an individual item within a TagList.
 */
export function Tag(props: TagProps): JSX.Element {
  const [local, rest] = splitProps(props, [
    'id',
    'children',
    'class',
    'style',
    'slot',
    'isDisabled',
    'textValue',
  ]);

  const state = useContext(TagListStateContext);

  // Create a ref for the tag
  const [tagRef, setTagRef] = createSignal<HTMLDivElement | null>(null);

  // Create tag accessibility props
  const tagAria = createTag(
    {
      get key() { return local.id; },
      get isDisabled() { return local.isDisabled; },
      get textValue() { return local.textValue; },
    },
    state!,
    tagRef
  );

  // Render props values
  const renderValues = createMemo<TagRenderProps>(() => ({
    isSelected: tagAria.isSelected,
    isDisabled: tagAria.isDisabled,
    isFocused: tagAria.isFocused,
    isPressed: tagAria.isPressed,
    allowsRemoving: tagAria.allowsRemoving,
    selectionMode: state?.selectionMode() ?? 'none',
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: local.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Tag',
    },
    renderValues
  );

  // Filter DOM props
  const domProps = createMemo(() => filterDOMProps(rest, { global: true }));

  return (
    <div
      ref={setTagRef}
      {...domProps()}
      {...tagAria.rowProps}
      class={renderProps.class()}
      style={renderProps.style()}
      data-selected={dataAttr(tagAria.isSelected)}
      data-disabled={dataAttr(tagAria.isDisabled)}
      data-focused={dataAttr(tagAria.isFocused)}
      data-pressed={dataAttr(tagAria.isPressed)}
      data-allows-removing={dataAttr(tagAria.allowsRemoving)}
    >
      <div {...tagAria.gridCellProps} style={{ display: 'contents' }}>
        {renderProps.renderChildren()}
      </div>
    </div>
  );
}

// ============================================
// TAG REMOVE BUTTON COMPONENT
// ============================================

export interface TagRemoveButtonProps {
  /** The children of the button (usually an X icon). */
  children?: JSX.Element;
  /** The CSS className for the element. */
  class?: string;
  /** The inline style for the element. */
  style?: JSX.CSSProperties;
}

/**
 * TagRemoveButton is the button used to remove a tag.
 * It should be placed inside a Tag component.
 */
export function TagRemoveButton(props: TagRemoveButtonProps): JSX.Element {
  // This is a simplified version - in a full implementation,
  // we'd get the remove button props from the Tag context
  return (
    <button
      type="button"
      class={props.class ?? 'solidaria-TagRemoveButton'}
      style={props.style}
      aria-label="Remove"
    >
      {props.children ?? '×'}
    </button>
  );
}

// Re-export types
export type { Key, SelectionMode, SelectionBehavior };
