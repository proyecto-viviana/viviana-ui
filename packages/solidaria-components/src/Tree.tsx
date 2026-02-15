/**
 * Tree component for solidaria-components
 *
 * A pre-wired headless tree that combines state + aria hooks.
 * Based on react-aria-components/src/Tree.tsx
 *
 * Tree displays hierarchical data with expandable/collapsible nodes,
 * supporting keyboard navigation and selection.
 */

import {
  type JSX,
  onCleanup,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  splitProps,
  useContext,
  For,
  Show,
} from 'solid-js';
import {
  createTree,
  createTreeItem,
  createTreeSelectionCheckbox,
  createFocusRing,
  createHover,
  type AriaTreeProps,
} from '@proyecto-viviana/solidaria';
import {
  createTreeState,
  createTreeCollection,
  type TreeState,
  type TreeCollection,
  type TreeNode,
  type TreeItemData,
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

export interface TreeRenderProps {
  /** Whether the tree has focus. */
  isFocused: boolean;
  /** Whether the tree has keyboard focus. */
  isFocusVisible: boolean;
  /** Whether the tree is disabled. */
  isDisabled: boolean;
  /** Whether the tree is empty. */
  isEmpty: boolean;
}

export interface TreeProps<T extends object> extends Omit<AriaTreeProps, 'children'>, SlotProps {
  /** The hierarchical items to render in the tree. */
  items: TreeItemData<T>[];
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
  /** Currently expanded keys (controlled). */
  expandedKeys?: Iterable<Key>;
  /** Default expanded keys (uncontrolled). */
  defaultExpandedKeys?: Iterable<Key>;
  /** Handler called when expansion changes. */
  onExpandedChange?: (keys: Set<Key>) => void;
  /** The children of the component. A function provided to render each item. */
  children: (item: TreeItemData<T>, state: TreeRenderItemState) => JSX.Element;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<TreeRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<TreeRenderProps>;
  /** A function to render when the tree is empty. */
  renderEmptyState?: () => JSX.Element;
  /** Whether there are more items to load. */
  hasMore?: boolean;
  /** Whether additional items are currently loading. */
  isLoading?: boolean;
  /** Called when the load more sentinel becomes visible. */
  onLoadMore?: () => void | Promise<void>;
}

export interface TreeRenderItemState {
  /** Whether the item is expanded. */
  isExpanded: boolean;
  /** Whether the item is expandable (has children). */
  isExpandable: boolean;
  /** The nesting level (0 = root). */
  level: number;
}

export interface TreeItemRenderProps {
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
  /** Whether the item is expanded. */
  isExpanded: boolean;
  /** Whether the item is expandable (has children). */
  isExpandable: boolean;
  /** The nesting level (0 = root). */
  level: number;
}

export interface TreeItemProps<T extends object> extends SlotProps {
  /** The unique key for the item. */
  id: Key;
  /** The item value. */
  item?: TreeItemData<T>;
  /** The children of the item. A function may be provided to receive render props. */
  children?: RenderChildren<TreeItemRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<TreeItemRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<TreeItemRenderProps>;
  /** The text value of the item (for accessibility). */
  textValue?: string;
  /** Handler called when the item is activated. */
  onAction?: () => void;
}

export interface TreeExpandButtonProps {
  /** CSS class name for the button. */
  class?: string;
  /** CSS style for the button. */
  style?: JSX.CSSProperties;
  /** Children to render inside the button. */
  children?: JSX.Element | ((props: { isExpanded: boolean }) => JSX.Element);
}

export interface TreeLoadMoreItemProps extends SlotProps {
  onLoadMore: () => void | Promise<void>;
  isLoading?: boolean;
  children?: JSX.Element;
  class?: ClassNameOrFunction<{ isLoading: boolean }>;
  style?: StyleOrFunction<{ isLoading: boolean }>;
}

// ============================================
// CONTEXT
// ============================================

interface TreeContextValue<T extends object> {
  state: TreeState<T, TreeCollection<T>>;
  collection: TreeCollection<T>;
  isDisabled: boolean;
  renderItem: (item: TreeItemData<T>, state: TreeRenderItemState) => JSX.Element;
}

interface TreeItemContextValue<T extends object> {
  node: TreeNode<T>;
  isExpanded: boolean;
  isExpandable: boolean;
  level: number;
}

export const TreeContext = createContext<TreeContextValue<object> | null>(null);
export const TreeStateContext = createContext<TreeState<object, TreeCollection<object>> | null>(null);
export const TreeItemContext = createContext<TreeItemContextValue<object> | null>(null);

// ============================================
// COMPONENTS
// ============================================

/**
 * A tree displays hierarchical data with expandable/collapsible nodes,
 * supporting keyboard navigation and selection.
 */
export function Tree<T extends object>(props: TreeProps<T>): JSX.Element {
  const [local, stateProps, ariaProps] = splitProps(
    props,
    ['class', 'style', 'slot', 'renderEmptyState', 'hasMore', 'isLoading', 'onLoadMore'],
    [
      'items',
      'disabledKeys',
      'selectionMode',
      'selectedKeys',
      'defaultSelectedKeys',
      'onSelectionChange',
      'expandedKeys',
      'defaultExpandedKeys',
      'onExpandedChange',
    ]
  );

  // Create ref signal
  const [ref, setRef] = createSignal<HTMLDivElement | null>(null);

  // Create tree state
  const state = createTreeState<T, TreeCollection<T>>(() => ({
    collectionFactory: (expandedKeys) =>
      createTreeCollection(stateProps.items, expandedKeys) as TreeCollection<T>,
    disabledKeys: stateProps.disabledKeys,
    selectionMode: stateProps.selectionMode,
    selectedKeys: stateProps.selectedKeys,
    defaultSelectedKeys: stateProps.defaultSelectedKeys,
    onSelectionChange: stateProps.onSelectionChange,
    expandedKeys: stateProps.expandedKeys,
    defaultExpandedKeys: stateProps.defaultExpandedKeys,
    onExpandedChange: stateProps.onExpandedChange,
  }));

  // Create tree aria props
  const { treeProps } = createTree<T, TreeCollection<T>>(
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
  const renderValues = createMemo<TreeRenderProps>(() => ({
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
      defaultClassName: 'solidaria-Tree',
    },
    renderValues
  );

  // Filter DOM props
  const domProps = createMemo(() => {
    const filtered = filterDOMProps(ariaProps as Record<string, unknown>, { global: true });
    return filtered;
  });

  // Remove ref from spread props
  const cleanTreeProps = () => {
    const { ref: _ref1, ...rest } = treeProps as Record<string, unknown>;
    return rest;
  };
  const cleanFocusProps = () => {
    const { ref: _ref2, ...rest } = focusProps as Record<string, unknown>;
    return rest;
  };

  const isEmpty = () => stateProps.items.length === 0;

  const contextValue = createMemo<TreeContextValue<T>>(() => ({
    state,
    collection: state.collection,
    isDisabled: ariaProps.isDisabled ?? false,
    renderItem: props.children,
  }));

  // Render visible rows (flat list based on expansion state)
  const visibleRows = createMemo(() => state.collection.rows);
  const virtualizer = useVirtualizerContext();
  const parentCollectionRenderer = useCollectionRenderer<TreeItemData<T>>();
  const virtualRange = createMemo(() => {
    if (!virtualizer || !parentCollectionRenderer?.isVirtualized) return null;
    return virtualizer.getVisibleRange(visibleRows().length);
  });
  const virtualizedVisibleRows = createMemo(() => {
    const range = virtualRange();
    if (!range) return visibleRows();
    return visibleRows().slice(range.start, range.end);
  });
  createEffect(() => {
    if (!virtualizer || !parentCollectionRenderer?.isVirtualized) return;
    virtualizer.setDropTargetItemCountResolver(() => visibleRows().length);
    virtualizer.setDropTargetIndexResolver((key) => {
      const rows = visibleRows();
      const index = rows.findIndex((node) => node.key === key);
      return index >= 0 ? index : null;
    });
    virtualizer.setDropTargetResolver((target) => {
      const node = visibleRows()[target.index];
      if (!node) return target;
      return {
        ...target,
        key: typeof node.key === 'string' || typeof node.key === 'number' ? node.key : undefined,
        parentKey:
          typeof node.parentKey === 'string' || typeof node.parentKey === 'number'
            ? node.parentKey
            : node.parentKey == null
              ? null
              : undefined,
        level: typeof node.level === 'number' ? node.level : undefined,
      };
    });
    onCleanup(() => {
      virtualizer.setDropTargetIndexResolver(undefined);
      virtualizer.setDropTargetItemCountResolver(undefined);
      virtualizer.setDropTargetResolver(undefined);
    });
  });
  const rowIndexByKey = createMemo(() => {
    const map = new Map<Key, number>();
    const rows = visibleRows();
    for (let i = 0; i < rows.length; i += 1) {
      map.set(rows[i].key, i);
    }
    return map;
  });
  const getAfterIndicatorIndexes = (absoluteIndex: number): number[] => {
    const rows = visibleRows();
    const current = rows[absoluteIndex];
    if (!current) return [];
    const next = rows[absoluteIndex + 1];
    // "after" is equivalent to next sibling's "before" when next row is at same or deeper level.
    if (next && next.level >= current.level) {
      return [];
    }

    const result: number[] = [];
    let cursorIndex: number | null = absoluteIndex;

    // Emit after indicators for current and ancestor boundary levels, matching RAC branch exit semantics.
    while (cursorIndex != null) {
      const cursor: TreeNode<T> | undefined = rows[cursorIndex];
      if (!cursor) break;
      const shouldRender =
        !next || (cursor.parentKey !== next.parentKey && next.level < cursor.level);
      if (!shouldRender) break;
      result.push(cursorIndex);
      if (cursor.parentKey == null) break;
      cursorIndex = rowIndexByKey().get(cursor.parentKey) ?? null;
    }
    return result;
  };

  return (
    <TreeContext.Provider value={contextValue() as unknown as TreeContextValue<object>}>
      <TreeStateContext.Provider value={state as unknown as TreeState<object, TreeCollection<object>>}>
        <div
          ref={setRef}
          {...domProps()}
          {...cleanTreeProps()}
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
                ? <div role="presentation" aria-hidden="true" style={{ height: `${virtualRange()!.offsetTop}px` }} data-virtualizer-spacer="top" />
                : null}
              <For each={virtualizedVisibleRows()}>
              {(node, index) => {
                const itemIndex = () => (virtualRange()?.start ?? 0) + index();
                const beforeIndicator = () => parentCollectionRenderer?.renderDropIndicator?.(itemIndex(), 'before');
                const onIndicator = () => parentCollectionRenderer?.renderDropIndicator?.(itemIndex(), 'on');
                const afterIndicatorIndexes = () => getAfterIndicatorIndexes(itemIndex());
                // Find the original item data to pass to render function
                const itemData: TreeItemData<T> = {
                  key: node.key,
                  value: node.value as T,
                  textValue: node.textValue,
                  children: node.hasChildNodes
                    ? node.childNodes.map((child) => ({
                        key: child.key,
                        value: child.value as T,
                        textValue: child.textValue,
                      }))
                    : undefined,
                };
                const itemState: TreeRenderItemState = {
                  isExpanded: node.isExpanded ?? false,
                  isExpandable: node.isExpandable ?? false,
                  level: node.level,
                };
                return (
                  <>
                    {beforeIndicator()}
                    {onIndicator()}
                    {props.children(itemData, itemState)}
                    <For each={afterIndicatorIndexes()}>
                      {(afterIndex) => parentCollectionRenderer?.renderDropIndicator?.(afterIndex, 'after')}
                    </For>
                  </>
                );
              }}
              </For>
              {virtualRange()?.offsetBottom
                ? <div role="presentation" aria-hidden="true" style={{ height: `${virtualRange()!.offsetBottom}px` }} data-virtualizer-spacer="bottom" />
                : null}
            </>
          )}
          {local.hasMore && local.onLoadMore && (
            <TreeLoadMoreItem onLoadMore={local.onLoadMore} isLoading={local.isLoading} />
          )}
        </div>
      </TreeStateContext.Provider>
    </TreeContext.Provider>
  );
}

/**
 * An item in a tree.
 */
export function TreeItem<T extends object>(props: TreeItemProps<T>): JSX.Element {
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
  const context = useContext(TreeStateContext);
  if (!context) {
    throw new Error('TreeItem must be used within a Tree');
  }
  const state = context as TreeState<T, TreeCollection<T>>;

  // Create ref signal
  const [ref, setRef] = createSignal<HTMLDivElement | null>(null);

  // Find the item node
  const itemNode = createMemo(() => {
    const node = state.collection.getItem(local.id);
    if (!node) {
      // Create a simple node for the item
      return {
        type: 'item' as const,
        key: local.id,
        value: local.item?.value ?? null,
        textValue: local.textValue ?? String(local.id),
        level: 0,
        index: 0,
        hasChildNodes: false,
        childNodes: [],
        isExpandable: false,
        isExpanded: false,
      } as TreeNode<T>;
    }
    return node;
  });

  // Create item aria props
  const {
    rowProps,
    gridCellProps,
    expandButtonProps: _expandButtonProps,
    isSelected,
    isDisabled,
    isPressed,
    isExpanded,
    isExpandable,
    level,
  } = createTreeItem<T, TreeCollection<T>>(
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
  const renderValues = createMemo<TreeItemRenderProps>(() => ({
    isSelected,
    isFocused: isFocused(),
    isFocusVisible: isFocusVisible() && isFocused(),
    isPressed,
    isHovered: isHovered(),
    isDisabled,
    isExpanded,
    isExpandable,
    level,
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: props.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Tree-item',
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

  // Item context for nested components
  const itemContextValue = createMemo<TreeItemContextValue<T>>(() => ({
    node: itemNode(),
    isExpanded,
    isExpandable,
    level,
  }));

  return (
    <TreeItemContext.Provider value={itemContextValue() as TreeItemContextValue<object>}>
      <div
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
        data-expanded={isExpanded || undefined}
        data-expandable={isExpandable || undefined}
        data-level={level}
      >
        <div {...gridCellProps} class="solidaria-Tree-item-content">
          {renderProps.renderChildren()}
        </div>
      </div>
    </TreeItemContext.Provider>
  );
}

/**
 * A button to expand/collapse a tree item.
 */
export function TreeExpandButton(props: TreeExpandButtonProps): JSX.Element {
  // Get item context
  const itemContext = useContext(TreeItemContext);
  if (!itemContext) {
    throw new Error('TreeExpandButton must be used within a Tree');
  }

  // Get state context
  const stateContext = useContext(TreeStateContext);
  if (!stateContext) {
    throw new Error('TreeExpandButton must be used within a Tree');
  }

  const state = stateContext as TreeState<object, TreeCollection<object>>;

  // Create expand button props
  const { expandButtonProps } = createTreeItem(
    () => ({ node: itemContext.node }),
    () => state,
    () => null
  );

  // Remove ref and add custom handling
  const cleanExpandProps = () => {
    const { ref: _ref, ...rest } = expandButtonProps as Record<string, unknown>;
    return rest;
  };

  const isExpanded = createMemo(() => state.isExpanded(itemContext.node.key));

  // Render children
  const renderChildren = () => {
    if (typeof props.children === 'function') {
      return props.children({ isExpanded: isExpanded() });
    }
    return props.children;
  };

  return (
    <Show when={itemContext.isExpandable}>
      <button
        {...cleanExpandProps()}
        class={props.class ?? 'solidaria-Tree-expand-button'}
        style={props.style}
        data-expanded={isExpanded() || undefined}
      >
        {renderChildren()}
      </button>
    </Show>
  );
}

/**
 * A checkbox for item selection in a tree.
 */
export function TreeSelectionCheckbox(props: { itemKey: Key }): JSX.Element {
  const context = useContext(TreeStateContext);
  if (!context) {
    throw new Error('TreeSelectionCheckbox must be used within a Tree');
  }

  const state = context as TreeState<object, TreeCollection<object>>;

  const { checkboxProps } = createTreeSelectionCheckbox<object, TreeCollection<object>>(
    () => ({ key: props.itemKey }),
    () => state
  );

  return <input {...checkboxProps} class="solidaria-Tree-checkbox" />;
}

export function TreeLoadMoreItem(props: TreeLoadMoreItemProps): JSX.Element {
  let ref: HTMLDivElement | undefined;
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
      defaultClassName: 'solidaria-Tree-loadMore',
    },
    () => ({ isLoading: isLoading() })
  );

  return (
    <div
      ref={ref}
      role="treeitem"
      tabIndex={0}
      aria-disabled={true}
      onFocus={() => {
        void triggerLoadMore();
      }}
      class={renderProps.class()}
      style={renderProps.style()}
      data-loading={isLoading() || undefined}
    >
      {renderProps.renderChildren()}
    </div>
  );
}

// Attach static properties
Tree.Item = TreeItem;
Tree.ExpandButton = TreeExpandButton;
Tree.SelectionCheckbox = TreeSelectionCheckbox;
Tree.LoadMoreItem = TreeLoadMoreItem;
