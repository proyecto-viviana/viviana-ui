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
  mergeProps,
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
  type DropTarget,
  type ItemDropTarget,
} from '@proyecto-viviana/solid-stately';
import {
  type RenderChildren,
  type ClassNameOrFunction,
  type StyleOrFunction,
  type SlotProps,
  useRenderProps,
  filterDOMProps,
} from './utils';
import { type DragAndDropHooks } from './useDragAndDrop';
import {
  getNormalizedDropTargetKey,
  mergePersistedKeysIntoVirtualRange,
  useDndPersistedKeys,
  useRenderDropIndicator,
} from './DragAndDrop';
import { CollectionRendererContext, type CollectionRendererContextValue, useCollectionRenderer } from './Collection';
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
  /** Drag and drop hooks from `useDragAndDrop`. */
  dragAndDropHooks?: DragAndDropHooks<T>;
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
  dragAndDropHooks?: DragAndDropHooks<T>;
  dragState?: unknown;
  dropState?: unknown;
}

interface TreeDropTargetDelegate {
  getDropTargetFromPoint: (
    x: number,
    y: number,
    isValidDropTarget: (target: DropTarget) => boolean
  ) => DropTarget | null;
  getKeyboardNavigationTarget?: (
    target: DropTarget | null,
    direction: 'next' | 'previous',
    isValidDropTarget: (target: DropTarget) => boolean
  ) => DropTarget | null;
  getKeyboardPageNavigationTarget?: (
    target: DropTarget | null,
    direction: 'next' | 'previous',
    isValidDropTarget: (target: DropTarget) => boolean
  ) => DropTarget | null;
}

interface PointerTrackingState {
  lastY: number;
  lastX: number;
  yDirection: 'up' | 'down' | null;
  xDirection: 'left' | 'right' | null;
  boundaryContext: {
    parentKey: Key;
    lastSwitchY: number;
    lastSwitchX: number;
    preferredTargetIndex?: number;
  } | null;
}

const X_SWITCH_THRESHOLD = 10;
const Y_SWITCH_THRESHOLD = 5;
const EXPANSION_KEYS = {
  expand: { ltr: 'ArrowRight', rtl: 'ArrowLeft' },
  collapse: { ltr: 'ArrowLeft', rtl: 'ArrowRight' },
} as const;

function resolveTreeDirection(element: HTMLElement | null): 'ltr' | 'rtl' {
  if (element) {
    const dir = element.closest('[dir]')?.getAttribute('dir');
    if (dir === 'rtl') return 'rtl';
    if (dir === 'ltr') return 'ltr';
  }
  if (typeof document !== 'undefined') {
    return document.dir === 'rtl' ? 'rtl' : 'ltr';
  }
  return 'ltr';
}

function createTreeDropTargetDelegate<T extends object>(
  delegate: TreeDropTargetDelegate,
  state: TreeState<T, TreeCollection<T>>,
  direction: 'ltr' | 'rtl'
): TreeDropTargetDelegate {
  const pointerTracking: PointerTrackingState = {
    lastY: 0,
    lastX: 0,
    yDirection: null,
    xDirection: null,
    boundaryContext: null,
  };

  const getPotentialTargets = (
    originalTarget: ItemDropTarget,
    isValidDropTarget: (target: DropTarget) => boolean
  ): ItemDropTarget[] => {
    if (originalTarget.dropPosition === 'on') return [originalTarget];

    const collection = state.collection;
    const getNodeNextKey = (node: TreeNode<T> | null | undefined): Key | null => {
      if (!node) return null;
      const declaredNextKey = (node as TreeNode<T> & { nextKey?: Key | null }).nextKey;
      return declaredNextKey ?? null;
    };
    const target: ItemDropTarget = { ...originalTarget };
    let currentItem = collection.getItem(target.key);
    while (currentItem && currentItem.type !== 'item') {
      const nextKey = getNodeNextKey(currentItem);
      if (nextKey == null) break;
      target.key = nextKey;
      currentItem = collection.getItem(nextKey);
    }

    const potentialTargets: ItemDropTarget[] = [target];

    if (
      currentItem &&
      currentItem.hasChildNodes &&
      state.expandedKeys.has(currentItem.key) &&
      target.dropPosition === 'after'
    ) {
      let firstChildItemNode: TreeNode<T> | null = null;
      for (const child of collection.getChildren(currentItem.key)) {
        if (child.type === 'item') {
          firstChildItemNode = child;
          break;
        }
      }

      if (firstChildItemNode) {
        const beforeFirstChildTarget: ItemDropTarget = {
          type: 'item',
          key: firstChildItemNode.key,
          dropPosition: 'before',
        };

        if (isValidDropTarget(beforeFirstChildTarget)) {
          return [beforeFirstChildTarget];
        }
        return [];
      }
    }

    if (getNodeNextKey(currentItem) != null) {
      return [originalTarget];
    }

    let parentKey = currentItem?.parentKey ?? null;
    const ancestorTargets: ItemDropTarget[] = [];
    while (parentKey != null) {
      const parentItem = collection.getItem(parentKey);
      const nextKey = getNodeNextKey(parentItem);
      const nextItem = nextKey != null ? collection.getItem(nextKey) : null;
      const isLastChildAtLevel = !nextItem || nextItem.parentKey !== parentKey;

      if (isLastChildAtLevel) {
        const afterParentTarget: ItemDropTarget = {
          type: 'item',
          key: parentKey,
          dropPosition: 'after',
        };

        if (isValidDropTarget(afterParentTarget)) {
          ancestorTargets.push(afterParentTarget);
        }
        if (nextItem) break;
      }

      parentKey = parentItem?.parentKey ?? null;
    }

    if (ancestorTargets.length > 0) {
      potentialTargets.push(...ancestorTargets);
    }

    if (potentialTargets.length === 1) {
      const nextKey = collection.getKeyAfter(target.key);
      const nextNode = nextKey != null ? collection.getItem(nextKey) : null;
      if (
        nextKey != null &&
        nextNode &&
        currentItem &&
        nextNode.level != null &&
        currentItem.level != null &&
        nextNode.level > currentItem.level
      ) {
        const beforeTarget: ItemDropTarget = {
          type: 'item',
          key: nextKey,
          dropPosition: 'before',
        };
        if (isValidDropTarget(beforeTarget)) return [beforeTarget];
      }
    }

    return potentialTargets.filter((candidate) => isValidDropTarget(candidate));
  };

  const selectTarget = (
    potentialTargets: ItemDropTarget[],
    originalTarget: ItemDropTarget,
    x: number,
    y: number,
    currentYMovement: 'up' | 'down' | null,
    currentXMovement: 'left' | 'right' | null
  ): ItemDropTarget => {
    if (potentialTargets.length < 2) return potentialTargets[0];

    const currentItem = state.collection.getItem(originalTarget.key);
    const parentKey = currentItem?.parentKey;
    if (parentKey == null) return potentialTargets[0];

    if (!pointerTracking.boundaryContext || pointerTracking.boundaryContext.parentKey !== parentKey) {
      const initialTargetIndex = pointerTracking.yDirection === 'up' ? potentialTargets.length - 1 : 0;
      pointerTracking.boundaryContext = {
        parentKey,
        preferredTargetIndex: initialTargetIndex,
        lastSwitchY: y,
        lastSwitchX: x,
      };
    }

    const boundaryContext = pointerTracking.boundaryContext;
    const distanceFromLastXSwitch = Math.abs(x - boundaryContext.lastSwitchX);
    const distanceFromLastYSwitch = Math.abs(y - boundaryContext.lastSwitchY);

    if (distanceFromLastYSwitch > Y_SWITCH_THRESHOLD && currentYMovement) {
      const currentIndex = boundaryContext.preferredTargetIndex ?? 0;
      if (currentYMovement === 'down' && currentIndex === 0) {
        boundaryContext.preferredTargetIndex = potentialTargets.length - 1;
      } else if (currentYMovement === 'up' && currentIndex === potentialTargets.length - 1) {
        boundaryContext.preferredTargetIndex = 0;
      }
      pointerTracking.xDirection = null;
    }

    if (distanceFromLastXSwitch > X_SWITCH_THRESHOLD && currentXMovement) {
      const currentTargetIndex = boundaryContext.preferredTargetIndex ?? 0;

      if (currentXMovement === 'left') {
        if (direction === 'ltr') {
          if (currentTargetIndex < potentialTargets.length - 1) {
            boundaryContext.preferredTargetIndex = currentTargetIndex + 1;
            boundaryContext.lastSwitchX = x;
          }
        } else if (currentTargetIndex > 0) {
          boundaryContext.preferredTargetIndex = currentTargetIndex - 1;
          boundaryContext.lastSwitchX = x;
        }
      } else if (currentXMovement === 'right') {
        if (direction === 'ltr') {
          if (currentTargetIndex > 0) {
            boundaryContext.preferredTargetIndex = currentTargetIndex - 1;
            boundaryContext.lastSwitchX = x;
          }
        } else if (currentTargetIndex < potentialTargets.length - 1) {
          boundaryContext.preferredTargetIndex = currentTargetIndex + 1;
          boundaryContext.lastSwitchX = x;
        }
      }

      pointerTracking.yDirection = null;
    }

    const targetIndex = Math.max(
      0,
      Math.min(boundaryContext.preferredTargetIndex ?? 0, potentialTargets.length - 1)
    );
    return potentialTargets[targetIndex];
  };

  return {
    getDropTargetFromPoint(x, y, isValidDropTarget) {
      const baseTarget = delegate.getDropTargetFromPoint(x, y, isValidDropTarget);
      if (!baseTarget || baseTarget.type === 'root') return baseTarget;

      const deltaY = y - pointerTracking.lastY;
      const deltaX = x - pointerTracking.lastX;
      let currentYMovement: 'up' | 'down' | null = pointerTracking.yDirection;
      let currentXMovement: 'left' | 'right' | null = pointerTracking.xDirection;

      if (Math.abs(deltaY) > Y_SWITCH_THRESHOLD) {
        currentYMovement = deltaY > 0 ? 'down' : 'up';
        pointerTracking.yDirection = currentYMovement;
        pointerTracking.lastY = y;
      }

      if (Math.abs(deltaX) > X_SWITCH_THRESHOLD) {
        currentXMovement = deltaX > 0 ? 'right' : 'left';
        pointerTracking.xDirection = currentXMovement;
        pointerTracking.lastX = x;
      }

      let target: ItemDropTarget = baseTarget;
      if (target.dropPosition === 'before') {
        const keyBefore = state.collection.getKeyBefore(target.key);
        if (keyBefore != null) {
          const normalized: ItemDropTarget = {
            type: 'item',
            key: keyBefore,
            dropPosition: 'after',
          };
          if (isValidDropTarget(normalized)) target = normalized;
        }
      }

      const potentialTargets = getPotentialTargets(target, isValidDropTarget);
      if (potentialTargets.length === 0) return { type: 'root' };

      if (potentialTargets.length > 1) {
        return selectTarget(potentialTargets, target, x, y, currentYMovement, currentXMovement);
      }

      pointerTracking.boundaryContext = null;
      return potentialTargets[0];
    },
    getKeyboardNavigationTarget: delegate.getKeyboardNavigationTarget?.bind(delegate),
    getKeyboardPageNavigationTarget: delegate.getKeyboardPageNavigationTarget?.bind(delegate),
  };
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
    ['class', 'style', 'slot', 'renderEmptyState', 'hasMore', 'isLoading', 'onLoadMore', 'dragAndDropHooks'],
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

  // Render visible rows (flat list based on expansion state)
  const visibleRows = createMemo(() => state.collection.rows);
  const virtualizer = useVirtualizerContext();
  const parentCollectionRenderer = useCollectionRenderer<TreeItemData<T>>();
  const getDropTargetByIndex = (index: number, position: 'before' | 'after' | 'on'): DropTarget | null => {
    const node = visibleRows()[index];
    if (!node) return null;
    return { type: 'item', key: node.key, dropPosition: position };
  };
  const hasDroppableDnd = createMemo(() => {
    const hooks = local.dragAndDropHooks;
    return Boolean(
      hooks?.useDroppableCollectionState &&
      hooks.useDroppableCollection
    );
  });
  const hasDraggableDnd = createMemo(() => {
    const hooks = local.dragAndDropHooks;
    return Boolean(hooks?.useDraggableCollectionState && hooks.useDraggableCollection);
  });
  const dragState = createMemo(() => {
    if (!hasDraggableDnd()) return undefined;
    return local.dragAndDropHooks?.useDraggableCollectionState?.({
      items: visibleRows().map((node) => node.value as T),
    });
  });
  const dropState = createMemo(() => {
    if (!hasDroppableDnd()) return undefined;
    return local.dragAndDropHooks?.useDroppableCollectionState?.({});
  });
  createEffect(() => {
    const activeDropState = dropState();
    if (!activeDropState) return;
    const originalGetDropOperation = activeDropState.getDropOperation.bind(activeDropState);

    activeDropState.getDropOperation = (target, types, allowedOperations) => {
      const currentDraggingKeys = dragState()?.draggingKeys ?? new Set<string | number>();
      if (target.type === 'item' && currentDraggingKeys.size > 0) {
        if (currentDraggingKeys.has(target.key) && target.dropPosition === 'on') {
          return 'cancel';
        }

        let currentKey: Key | null = target.key;
        while (currentKey != null) {
          const item = state.collection.getItem(currentKey);
          const parentKey = item?.parentKey;
          if (parentKey != null && currentDraggingKeys.has(parentKey)) {
            return 'cancel';
          }
          currentKey = parentKey ?? null;
        }
      }

      return originalGetDropOperation(target, types, allowedOperations);
    };

    onCleanup(() => {
      activeDropState.getDropOperation = originalGetDropOperation;
    });
  });
  createEffect(() => {
    if (!hasDraggableDnd()) return;
    const hooks = local.dragAndDropHooks;
    const activeDragState = dragState();
    if (!hooks?.useDraggableCollection || !activeDragState) return;
    hooks.useDraggableCollection({}, activeDragState, () => ref());
  });
  const contextValue = createMemo<TreeContextValue<T>>(() => ({
    state,
    collection: state.collection,
    isDisabled: ariaProps.isDisabled ?? false,
    renderItem: props.children,
    dragAndDropHooks: local.dragAndDropHooks,
    dragState: dragState(),
    dropState: dropState(),
  }));
  const droppableCollection = createMemo(() => {
    if (!hasDroppableDnd()) return undefined;
    const hooks = local.dragAndDropHooks;
    const activeDropState = dropState();
    if (!hooks?.useDroppableCollection || !activeDropState) return undefined;
    const baseDropTargetDelegate = hooks.dropTargetDelegate
      ?? parentCollectionRenderer?.dropTargetDelegate
      ?? (hooks.ListDropTargetDelegate
        ? new hooks.ListDropTargetDelegate(
          () => state.collection,
          () => ref(),
          { layout: 'stack', orientation: 'vertical', direction: resolveTreeDirection(ref()) }
        )
        : undefined);
    if (!baseDropTargetDelegate) return undefined;
    const dropTargetDelegate = createTreeDropTargetDelegate(
      baseDropTargetDelegate as TreeDropTargetDelegate,
      state,
      resolveTreeDirection(ref())
    );
    const direction = resolveTreeDirection(ref());
    return hooks.useDroppableCollection(
      {
        dropTargetDelegate,
        keyboardDelegate: {
          getFirstKey: () => state.collection.getFirstKey(),
          getLastKey: () => state.collection.getLastKey(),
          getKeyBelow: (key) => state.collection.getKeyAfter(key),
          getKeyAbove: (key) => state.collection.getKeyBefore(key),
          getKeyPageBelow: (key) => state.collection.getKeyAfter(key),
          getKeyPageAbove: (key) => state.collection.getKeyBefore(key),
        },
        onDropActivate: (event) => {
          if (event.target.type !== 'item') return;
          const key = event.target.key;
          const item = state.collection.getItem(key);
          const isExpanded = state.isExpanded(key);
          if (item?.hasChildNodes && (!isExpanded || hooks.isVirtualDragging?.())) {
            state.toggleKey(key);
          }
        },
        onKeyDown: (event) => {
          const target = activeDropState.target;
          if (!target || target.type !== 'item' || target.dropPosition !== 'on') return;
          const item = state.collection.getItem(target.key);
          if (!item?.hasChildNodes) return;
          const expandKey = EXPANSION_KEYS.expand[direction];
          const collapseKey = EXPANSION_KEYS.collapse[direction];
          if (event.key === expandKey && !state.isExpanded(target.key)) {
            state.toggleKey(target.key);
          } else if (event.key === collapseKey && state.isExpanded(target.key)) {
            state.toggleKey(target.key);
          }
        },
      },
      activeDropState,
      () => ref()
    );
  });
  const isRootDropTarget = createMemo(() => {
    return Boolean(dropState()?.target?.type === 'root');
  });
  const dndRenderDropIndicator = createMemo(() => useRenderDropIndicator(local.dragAndDropHooks, dropState()));
  const dndDropIndicator = (index: number, position: 'before' | 'after' | 'on') => {
    const target = getDropTargetByIndex(index, position);
    if (!target || target.type !== 'item') return undefined;
    return dndRenderDropIndicator()?.(target);
  };
  const persistedKeys = useDndPersistedKeys(
    { focusedKey: () => state.focusedKey },
    local.dragAndDropHooks,
    dropState(),
    state.collection
  );
  const virtualRange = createMemo(() => {
    if (!virtualizer || !parentCollectionRenderer?.isVirtualized) return null;
    const rows = visibleRows();
    const baseRange = virtualizer.getVisibleRange(rows.length);
    const persistedIndexes = Array.from(persistedKeys())
      .map((key) => rows.findIndex((node) => node.key === key))
      .filter((index) => index >= 0);
    const dropTarget = dropState()?.target;
    const normalizedDropKey = getNormalizedDropTargetKey(dropTarget, state.collection);
    const focusedKey = state.focusedKey;
    const focusedIndex = focusedKey != null ? rows.findIndex((node) => node.key === focusedKey) : -1;
    const forceIncludeIndexes = [
      dropTarget?.type === 'item' ? rows.findIndex((node) => node.key === dropTarget.key) : -1,
      normalizedDropKey != null ? rows.findIndex((node) => node.key === normalizedDropKey) : -1,
      dropTarget?.type === 'item' ? -1 : focusedIndex,
    ].filter((index) => index >= 0);
    return mergePersistedKeysIntoVirtualRange(baseRange, persistedIndexes, rows.length, virtualizer, 80, {
      forceIncludeIndexes,
      forceIncludeMaxSpan: 320,
    });
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
  const getAfterIndicatorIndexes = (
    absoluteIndex: number,
    renderRange?: { start: number; end: number } | null
  ): number[] => {
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
    if (!renderRange) return result;
    return result.filter((index) => index >= renderRange.start && index < renderRange.end);
  };
  const collectionRenderer = createMemo<CollectionRendererContextValue<unknown>>(() => ({
    ...parentCollectionRenderer,
    renderItem: (item) => item as JSX.Element,
    renderDropIndicator: (index: number, position: 'before' | 'after' | 'on') =>
      dndDropIndicator(index, position) ?? parentCollectionRenderer?.renderDropIndicator?.(index, position),
  }));

  return (
    <TreeContext.Provider value={contextValue() as unknown as TreeContextValue<object>}>
      <TreeStateContext.Provider value={state as unknown as TreeState<object, TreeCollection<object>>}>
        <CollectionRendererContext.Provider value={collectionRenderer()}>
          <div
            ref={setRef}
            {...mergeProps(
              domProps(),
              cleanTreeProps(),
              cleanFocusProps(),
              (droppableCollection()?.collectionProps as Record<string, unknown> | undefined) ?? {}
            )}
            class={renderProps.class()}
            style={renderProps.style()}
            data-focused={state.isFocused || undefined}
            data-focus-visible={isFocusVisible() || undefined}
            data-disabled={ariaProps.isDisabled || undefined}
            data-empty={isEmpty() || undefined}
            data-drop-target={isRootDropTarget() || undefined}
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
                  const beforeIndicator = () => collectionRenderer().renderDropIndicator?.(itemIndex(), 'before');
                  const onIndicator = () => collectionRenderer().renderDropIndicator?.(itemIndex(), 'on');
                  const afterIndicatorIndexes = () => getAfterIndicatorIndexes(itemIndex(), virtualRange());
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
                        {(afterIndex) => collectionRenderer().renderDropIndicator?.(afterIndex, 'after')}
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
        </CollectionRendererContext.Provider>
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
  const treeContext = useContext(TreeContext) as TreeContextValue<T> | null;

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
  const draggableItem = createMemo(() => {
    if (!treeContext?.dragAndDropHooks?.useDraggableItem || !treeContext.dragState) return undefined;
    return treeContext.dragAndDropHooks.useDraggableItem(
      {
        key: local.id as string | number,
      },
      treeContext.dragState as Parameters<NonNullable<DragAndDropHooks<T>['useDraggableItem']>>[1]
    );
  });
  const droppableItem = createMemo(() => {
    if (!treeContext?.dragAndDropHooks?.useDroppableItem || !treeContext.dropState) return undefined;
    return treeContext.dragAndDropHooks.useDroppableItem(
      {
        key: local.id as string | number,
      },
      treeContext.dropState as Parameters<NonNullable<DragAndDropHooks<T>['useDroppableItem']>>[1],
      () => ref()
    );
  });

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
    <TreeItemContext.Provider value={itemContextValue() as unknown as TreeItemContextValue<object>}>
      <div
        ref={setRef}
        {...mergeProps(
          cleanRowProps(),
          cleanHoverProps(),
          cleanFocusProps(),
          (draggableItem()?.dragProps as Record<string, unknown> | undefined) ?? {},
          (droppableItem()?.dropProps as Record<string, unknown> | undefined) ?? {}
        )}
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
        data-dragging={draggableItem()?.isDragging || undefined}
        data-drop-target={droppableItem()?.isDropTarget || undefined}
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

export interface TreeItemContentProps<T extends object> extends TreeItemProps<T> {}
export type TreeItemContentRenderProps = TreeItemRenderProps;

export function TreeItemContent<T extends object>(props: TreeItemContentProps<T>): JSX.Element {
  return <TreeItem {...props} />;
}

// Attach static properties
Tree.Item = TreeItem;
Tree.ExpandButton = TreeExpandButton;
Tree.SelectionCheckbox = TreeSelectionCheckbox;
Tree.LoadMoreItem = TreeLoadMoreItem;
