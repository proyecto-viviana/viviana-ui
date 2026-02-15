/**
 * GridList component for solidaria-components
 *
 * A pre-wired headless grid list that combines state + aria hooks.
 * Based on react-aria-components/src/GridList.tsx
 *
 * GridList is similar to ListBox but supports interactive elements within items
 * and uses grid keyboard navigation.
 */

import {
  type JSX,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  splitProps,
  useContext,
  For,
} from 'solid-js';
import {
  createGridList,
  createGridListItem,
  createGridListSelectionCheckbox,
  createFocusRing,
  createHover,
  type AriaGridListProps,
} from '@proyecto-viviana/solidaria';
import {
  createGridState,
  type GridState,
  type GridCollection,
  type GridNode,
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
import { useCollectionRenderer } from './Collection';
import { useVirtualizerContext } from './Virtualizer';

// ============================================
// TYPES
// ============================================

export interface GridListRenderProps {
  /** Whether the grid list has focus. */
  isFocused: boolean;
  /** Whether the grid list has keyboard focus. */
  isFocusVisible: boolean;
  /** Whether the grid list is disabled. */
  isDisabled: boolean;
  /** Whether the grid list is empty. */
  isEmpty: boolean;
}

export interface GridListProps<T extends object> extends Omit<AriaGridListProps, 'children'>, SlotProps {
  /** The items to render in the grid list. */
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
  class?: ClassNameOrFunction<GridListRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<GridListRenderProps>;
  /** A function to render when the grid list is empty. */
  renderEmptyState?: () => JSX.Element;
  /** Whether there are more items to load. */
  hasMore?: boolean;
  /** Whether additional items are currently loading. */
  isLoading?: boolean;
  /** Called when the load more sentinel becomes visible. */
  onLoadMore?: () => void | Promise<void>;
}

export interface GridListItemRenderProps {
  /** Whether the item is selected. */
  isSelected: boolean;
  /** Whether the item is focused. */
  isFocused: boolean;
  /** Whether the item has keyboard focus. */
  isFocusVisible: boolean;
  /** Whether the item is pressed. */
  isPressed: boolean;
  /** Whether the item is hovered. */
  isHovered: boolean;
  /** Whether the item is disabled. */
  isDisabled: boolean;
}

export interface GridListItemProps<T extends object> extends SlotProps {
  /** The unique key for the item. */
  id: Key;
  /** The item value. */
  item?: T;
  /** The children of the item. A function may be provided to receive render props. */
  children?: RenderChildren<GridListItemRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<GridListItemRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<GridListItemRenderProps>;
  /** The text value of the item (for accessibility). */
  textValue?: string;
  /** Handler called when the item is activated. */
  onAction?: () => void;
}

export interface GridListLoadMoreItemProps extends SlotProps {
  onLoadMore: () => void | Promise<void>;
  isLoading?: boolean;
  children?: JSX.Element;
  class?: ClassNameOrFunction<{ isLoading: boolean }>;
  style?: StyleOrFunction<{ isLoading: boolean }>;
}

// ============================================
// CONTEXT
// ============================================

interface GridListContextValue<T extends object> {
  state: GridState<T, GridCollection<T>>;
  collection: GridCollection<T>;
  isDisabled: boolean;
}

export const GridListContext = createContext<GridListContextValue<object> | null>(null);
export const GridListStateContext = createContext<GridState<object, GridCollection<object>> | null>(null);

// ============================================
// HELPER: Build GridCollection from items
// ============================================

function buildGridCollection<T extends object>(
  items: T[],
  getKey?: (item: T) => Key,
  getTextValue?: (item: T) => string,
  getDisabled?: (item: T) => boolean
): GridCollection<T> {
  const nodes: GridNode<T>[] = items.map((item, index) => {
    const key = getKey?.(item) ?? index;
    return {
      type: 'item' as const,
      key,
      value: item,
      textValue: getTextValue?.(item) ?? String(key),
      level: 0,
      index,
      hasChildNodes: false,
      childNodes: [],
      isDisabled: getDisabled?.(item),
    };
  });

  const keyMap = new Map<Key, GridNode<T>>();
  nodes.forEach((node) => keyMap.set(node.key, node));

  return {
    rows: nodes,
    columns: [],
    headerRows: [],
    get rowCount() {
      return nodes.length;
    },
    get columnCount() {
      return 1;
    },
    get size() {
      return nodes.length;
    },
    getKeys() {
      return nodes.map((n) => n.key);
    },
    getItem(key: Key) {
      return keyMap.get(key) ?? null;
    },
    at(index: number) {
      return nodes[index] ?? null;
    },
    getKeyBefore(key: Key) {
      const node = keyMap.get(key);
      if (!node) return null;
      return node.index > 0 ? nodes[node.index - 1].key : null;
    },
    getKeyAfter(key: Key) {
      const node = keyMap.get(key);
      if (!node) return null;
      return node.index < nodes.length - 1 ? nodes[node.index + 1].key : null;
    },
    getFirstKey() {
      return nodes[0]?.key ?? null;
    },
    getLastKey() {
      return nodes[nodes.length - 1]?.key ?? null;
    },
    getChildren(_key: Key) {
      return [];
    },
    getTextValue(key: Key) {
      return keyMap.get(key)?.textValue ?? '';
    },
    getCell(_rowKey: Key, _columnKey: Key) {
      return null;
    },
    [Symbol.iterator]() {
      return nodes[Symbol.iterator]();
    },
  };
}

// ============================================
// COMPONENTS
// ============================================

/**
 * A grid list displays a list of interactive items, with support for
 * keyboard navigation, single or multiple selection, and row actions.
 */
export function GridList<T extends object>(props: GridListProps<T>): JSX.Element {
  const [local, stateProps, ariaProps] = splitProps(
    props,
    ['children', 'class', 'style', 'slot', 'renderEmptyState', 'hasMore', 'isLoading', 'onLoadMore'],
    [
      'items',
      'getKey',
      'getTextValue',
      'getDisabled',
      'disabledKeys',
      'selectionMode',
      'selectedKeys',
      'defaultSelectedKeys',
      'onSelectionChange',
    ]
  );

  // Create ref signal
  const [ref, setRef] = createSignal<HTMLUListElement | null>(null);

  // Build collection
  const collection = createMemo(() =>
    buildGridCollection(
      stateProps.items,
      stateProps.getKey,
      stateProps.getTextValue,
      stateProps.getDisabled
    )
  );

  // Get disabled keys from items + explicit disabledKeys
  const allDisabledKeys = createMemo(() => {
    const keys = new Set<Key>();

    // Add explicitly disabled keys
    if (stateProps.disabledKeys) {
      for (const key of stateProps.disabledKeys) {
        keys.add(key);
      }
    }

    // Add keys from items marked as disabled
    for (const node of collection().rows) {
      if (node.isDisabled) {
        keys.add(node.key);
      }
    }

    return keys;
  });

  // Create grid state
  const state = createGridState<T, GridCollection<T>>(() => ({
    collection: collection(),
    disabledKeys: allDisabledKeys(),
    selectionMode: stateProps.selectionMode,
    selectedKeys: stateProps.selectedKeys,
    defaultSelectedKeys: stateProps.defaultSelectedKeys,
    onSelectionChange: stateProps.onSelectionChange,
  }));

  // Create grid list aria props
  const { gridProps } = createGridList<T, GridCollection<T>>(
    () => ({
      id: ariaProps.id,
      'aria-label': ariaProps['aria-label'],
      'aria-labelledby': ariaProps['aria-labelledby'],
      'aria-describedby': ariaProps['aria-describedby'],
      isVirtualized: ariaProps.isVirtualized,
      onAction: ariaProps.onAction,
      isDisabled: ariaProps.isDisabled,
    }),
    () => state,
    ref
  );

  // Create focus ring
  const { isFocused, isFocusVisible, focusProps } = createFocusRing();

  // Render props values
  const renderValues = createMemo<GridListRenderProps>(() => ({
    isFocused: state.isFocused || isFocused(),
    isFocusVisible: isFocusVisible(),
    isDisabled: ariaProps.isDisabled ?? false,
    isEmpty: stateProps.items.length === 0,
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-GridList',
    },
    renderValues
  );

  // Filter DOM props
  const domProps = createMemo(() => {
    const filtered = filterDOMProps(ariaProps as Record<string, unknown>, { global: true });
    return filtered;
  });

  // Remove ref from spread props
  const cleanGridProps = () => {
    const { ref: _ref1, ...rest } = gridProps as Record<string, unknown>;
    return rest;
  };
  const cleanFocusProps = () => {
    const { ref: _ref2, ...rest } = focusProps as Record<string, unknown>;
    return rest;
  };

  const isEmpty = () => stateProps.items.length === 0;
  const virtualizer = useVirtualizerContext();
  const parentCollectionRenderer = useCollectionRenderer<T>();
  const virtualRange = createMemo(() => {
    if (!virtualizer || !parentCollectionRenderer?.isVirtualized) return null;
    return virtualizer.getVisibleRange(stateProps.items.length);
  });
  createEffect(() => {
    if (!virtualizer || !parentCollectionRenderer?.isVirtualized) return;
    virtualizer.setDropTargetItemCountResolver(() => state.collection.size);
    virtualizer.setDropTargetIndexResolver((key) => {
      const entries = Array.from(state.collection);
      const index = entries.findIndex((node) => node.key === key);
      return index >= 0 ? index : null;
    });
    virtualizer.setDropTargetResolver((target) => {
      const node = Array.from(state.collection)[target.index];
      if (!node) return target;
      return {
        ...target,
        key: typeof node.key === 'string' || typeof node.key === 'number' ? node.key : undefined,
      };
    });
    onCleanup(() => {
      virtualizer.setDropTargetIndexResolver(undefined);
      virtualizer.setDropTargetItemCountResolver(undefined);
      virtualizer.setDropTargetResolver(undefined);
    });
  });
  const visibleItems = createMemo(() => {
    const range = virtualRange();
    if (!range) return stateProps.items;
    return stateProps.items.slice(range.start, range.end);
  });

  const contextValue = createMemo<GridListContextValue<T>>(() => ({
    state,
    collection: collection(),
    isDisabled: ariaProps.isDisabled ?? false,
  }));

  return (
    <GridListContext.Provider value={contextValue() as GridListContextValue<object>}>
      <GridListStateContext.Provider value={state as unknown as GridState<object, GridCollection<object>>}>
        <ul
          ref={setRef}
          {...domProps()}
          {...cleanGridProps()}
          {...cleanFocusProps()}
          class={renderProps.class()}
          style={renderProps.style()}
          data-focused={state.isFocused || undefined}
          data-focus-visible={isFocusVisible() || undefined}
          data-disabled={ariaProps.isDisabled || undefined}
          data-empty={isEmpty() || undefined}
        >
          {isEmpty() && local.renderEmptyState ? (
            local.renderEmptyState()
          ) : (
            <>
              {virtualRange()?.offsetTop
                ? <li role="presentation" aria-hidden="true" style={{ height: `${virtualRange()!.offsetTop}px` }} data-virtualizer-spacer="top" />
                : null}
              <For each={visibleItems()}>
                {(item, index) => {
                  const itemIndex = () => (virtualRange()?.start ?? 0) + index();
                  const beforeIndicator = () => parentCollectionRenderer?.renderDropIndicator?.(itemIndex(), 'before');
                  const onIndicator = () => parentCollectionRenderer?.renderDropIndicator?.(itemIndex(), 'on');
                  const afterIndicator = () => parentCollectionRenderer?.renderDropIndicator?.(itemIndex(), 'after');
                  return (
                    <>
                      {beforeIndicator()}
                      {onIndicator()}
                      {props.children(item)}
                      {afterIndicator()}
                    </>
                  );
                }}
              </For>
              {virtualRange()?.offsetBottom
                ? <li role="presentation" aria-hidden="true" style={{ height: `${virtualRange()!.offsetBottom}px` }} data-virtualizer-spacer="bottom" />
                : null}
            </>
          )}
          {local.hasMore && local.onLoadMore && (
            <GridListLoadMoreItem onLoadMore={local.onLoadMore} isLoading={local.isLoading} />
          )}
        </ul>
      </GridListStateContext.Provider>
    </GridListContext.Provider>
  );
}

/**
 * An item in a grid list.
 */
export function GridListItem<T extends object>(props: GridListItemProps<T>): JSX.Element {
  const [local] = splitProps(props, [
    'class',
    'style',
    'slot',
    'id',
    'item',
    'textValue',
    'onAction',
  ]);

  // Get state from context
  const context = useContext(GridListStateContext);
  if (!context) {
    throw new Error('GridListItem must be used within a GridList');
  }
  const state = context as GridState<T, GridCollection<T>>;

  // Create ref signal
  const [ref, setRef] = createSignal<HTMLLIElement | null>(null);

  // Find or create the item node
  const itemNode = createMemo(() => {
    const node = state.collection.getItem(local.id);
    if (!node) {
      // Create a simple node for the item
      return {
        type: 'item' as const,
        key: local.id,
        value: local.item ?? null,
        textValue: local.textValue ?? String(local.id),
        level: 0,
        index: 0,
        hasChildNodes: false,
        childNodes: [],
      } as GridNode<T>;
    }
    return node as GridNode<T>;
  });

  // Create item aria props
  const { rowProps, gridCellProps, isSelected, isDisabled, isPressed } = createGridListItem<T, GridCollection<T>>(
    () => ({
      node: itemNode(),
      onAction: local.onAction,
    }),
    () => state,
    ref
  );

  // Create hover
  const { isHovered, hoverProps } = createHover({
    get isDisabled() {
      return isDisabled;
    },
  });

  // Create focus ring
  const { isFocusVisible, focusProps } = createFocusRing();

  // Check if focused
  const isFocused = createMemo(() => state.focusedKey === local.id);

  // Render props values
  const renderValues = createMemo<GridListItemRenderProps>(() => ({
    isSelected,
    isFocused: isFocused(),
    isFocusVisible: isFocusVisible() && isFocused(),
    isPressed,
    isHovered: isHovered(),
    isDisabled,
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: props.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-GridList-item',
    },
    renderValues
  );

  // Remove ref from spread props
  const cleanRowProps = () => {
    const { ref: _ref1, ...rest } = rowProps as Record<string, unknown>;
    return rest;
  };
  const cleanHoverProps = () => {
    const { ref: _ref2, ...rest } = hoverProps as Record<string, unknown>;
    return rest;
  };
  const cleanFocusProps = () => {
    const { ref: _ref3, ...rest } = focusProps as Record<string, unknown>;
    return rest;
  };

  return (
    <li
      ref={setRef}
      {...cleanRowProps()}
      {...cleanHoverProps()}
      {...cleanFocusProps()}
      class={renderProps.class()}
      style={renderProps.style()}
      data-selected={isSelected || undefined}
      data-focused={isFocused() || undefined}
      data-focus-visible={(isFocusVisible() && isFocused()) || undefined}
      data-pressed={isPressed || undefined}
      data-hovered={isHovered() || undefined}
      data-disabled={isDisabled || undefined}
    >
      <div {...gridCellProps}>{renderProps.renderChildren()}</div>
    </li>
  );
}

/**
 * A checkbox for item selection in a grid list.
 */
export function GridListSelectionCheckbox(props: { itemKey: Key }): JSX.Element {
  const context = useContext(GridListStateContext);
  if (!context) {
    throw new Error('GridListSelectionCheckbox must be used within a GridList');
  }

  const state = context as GridState<object, GridCollection<object>>;

  const { checkboxProps } = createGridListSelectionCheckbox<object, GridCollection<object>>(
    () => ({ key: props.itemKey }),
    () => state
  );

  return <input {...checkboxProps} />;
}

export function GridListLoadMoreItem(props: GridListLoadMoreItemProps): JSX.Element {
  let ref: HTMLLIElement | undefined;
  const [isPending, setIsPending] = createSignal(false);
  const isLoading = () => !!props.isLoading || isPending();

  const triggerLoadMore = async () => {
    if (isLoading()) return;
    setIsPending(true);
    try {
      await props.onLoadMore();
    } finally {
      setIsPending(false);
    }
  };

  createEffect(() => {
    if (!ref || typeof IntersectionObserver !== 'function') return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        void triggerLoadMore();
      }
    });
    observer.observe(ref);
    return () => observer.disconnect();
  });

  const renderProps = useRenderProps(
    {
      children: props.children ?? (() => (isLoading() ? 'Loading more...' : 'Load more')),
      class: props.class,
      style: props.style,
      defaultClassName: 'solidaria-GridList-loadMore',
    },
    () => ({ isLoading: isLoading() })
  );

  return (
    <li
      ref={ref}
      role="row"
      tabIndex={0}
      onFocus={() => {
        void triggerLoadMore();
      }}
      class={renderProps.class()}
      style={renderProps.style()}
      data-loading={isLoading() || undefined}
    >
      {renderProps.renderChildren()}
    </li>
  );
}

// Attach Item and SelectionCheckbox as static properties
GridList.Item = GridListItem;
GridList.SelectionCheckbox = GridListSelectionCheckbox;
GridList.LoadMoreItem = GridListLoadMoreItem;
