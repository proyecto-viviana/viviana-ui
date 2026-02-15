/**
 * ListBox component for solidaria-components
 *
 * A pre-wired headless listbox that combines state + aria hooks.
 * Port of react-aria-components/src/ListBox.tsx
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
  createListBox,
  createOption,
  createFocusRing,
  createHover,
  mergeProps,
  type AriaListBoxProps,
  type AriaOptionProps,
} from '@proyecto-viviana/solidaria';
import {
  createListState,
  type ListState,
  type Key,
  type DropTarget,
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
import { useVirtualizerContext } from './Virtualizer';
import { type DragAndDropHooks } from './useDragAndDrop';
import {
  getNormalizedDropTargetKey,
  mergePersistedKeysIntoVirtualRange,
  useDndPersistedKeys,
  useRenderDropIndicator,
} from './DragAndDrop';
import {
  CollectionRendererContext,
  Section,
  Header,
  Group,
  type CollectionEntry,
  type CollectionRendererContextValue,
  type SectionProps,
  useCollectionRenderer,
  isCollectionSection,
  flattenCollectionEntries,
} from './Collection';

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
  items: CollectionEntry<T>[];
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
  /** Whether there are more items to load. */
  hasMore?: boolean;
  /** Whether additional items are currently loading. */
  isLoading?: boolean;
  /** Called when the load more sentinel becomes visible. */
  onLoadMore?: () => void | Promise<void>;
  /** Drag and drop hooks from `useDragAndDrop`. */
  dragAndDropHooks?: DragAndDropHooks<T>;
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

export interface ListBoxLoadMoreItemProps extends SlotProps {
  /** Called when the sentinel becomes visible. */
  onLoadMore: () => void | Promise<void>;
  /** Whether additional items are currently loading. */
  isLoading?: boolean;
  /** Content for the load more row. */
  children?: JSX.Element;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<{ isLoading: boolean }>;
  /** The inline style for the element. */
  style?: StyleOrFunction<{ isLoading: boolean }>;
}

export interface ListBoxSectionProps extends SectionProps {}

// ============================================
// CONTEXT
// ============================================

interface ListBoxContextValue<T> {
  state: ListState<T>;
  dragAndDropHooks?: DragAndDropHooks<unknown>;
  dragState?: unknown;
  dropState?: unknown;
}

export const ListBoxContext = createContext<ListBoxContextValue<unknown> | null>(null);
export const ListBoxStateContext = createContext<ListState<unknown> | null>(null);
export const ListStateContext = ListBoxStateContext;

// ============================================
// COMPONENTS
// ============================================

/**
 * A listbox displays a list of options and allows a user to select one or more of them.
 */
export function ListBox<T>(props: ListBoxProps<T>): JSX.Element {
  const [local, stateProps, ariaProps] = splitProps(
    props,
    ['children', 'class', 'style', 'slot', 'renderEmptyState', 'hasMore', 'isLoading', 'onLoadMore', 'dragAndDropHooks'],
    ['items', 'getKey', 'getTextValue', 'getDisabled', 'disabledKeys', 'selectionMode', 'selectedKeys', 'defaultSelectedKeys', 'onSelectionChange']
  );

  const flatItems = createMemo<T[]>(() => {
    return flattenCollectionEntries(stateProps.items);
  });

  const hasSections = createMemo(() => stateProps.items.some((item) => isCollectionSection(item)));

  // Create list state
  const state = createListState<T>({
    get items() {
      return flatItems();
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
  const [listRef, setListRef] = createSignal<HTMLElement | null>(null);

  const isEmpty = () => stateProps.items.length === 0;
  const parentCollectionRenderer = useCollectionRenderer<unknown>();
  const getItemNodes = () => Array.from(state.collection()).filter((node) => node.type === 'item');
  const getDropTargetByIndex = (index: number, position: 'before' | 'after' | 'on'): DropTarget | null => {
    const node = getItemNodes()[index];
    if (!node) return null;
    return { type: 'item', key: node.key, dropPosition: position };
  };
  const hasDroppableDnd = createMemo(() => {
    const hooks = local.dragAndDropHooks;
    return Boolean(
      hooks?.useDroppableCollectionState &&
      hooks.useDroppableCollection &&
      (hooks.dropTargetDelegate || parentCollectionRenderer?.dropTargetDelegate)
    );
  });
  const dropState = createMemo(() => {
    if (!hasDroppableDnd()) return undefined;
    return local.dragAndDropHooks?.useDroppableCollectionState?.({});
  });
  const hasDraggableDnd = createMemo(() => {
    const hooks = local.dragAndDropHooks;
    return Boolean(hooks?.useDraggableCollectionState && hooks.useDraggableCollection);
  });
  const dragState = createMemo(() => {
    if (!hasDraggableDnd()) return undefined;
    return local.dragAndDropHooks?.useDraggableCollectionState?.({
      items: flatItems(),
    });
  });
  createEffect(() => {
    if (!hasDraggableDnd()) return;
    const hooks = local.dragAndDropHooks;
    const activeDragState = dragState();
    if (!hooks?.useDraggableCollection || !activeDragState) return;
    hooks.useDraggableCollection({}, activeDragState, () => listRef());
  });
  const droppableCollection = createMemo(() => {
    if (!hasDroppableDnd()) return undefined;
    const hooks = local.dragAndDropHooks;
    const activeDropState = dropState();
    if (!hooks?.useDroppableCollection || !activeDropState) return undefined;
    const dropTargetDelegate = hooks.dropTargetDelegate ?? parentCollectionRenderer?.dropTargetDelegate;
    if (!dropTargetDelegate) return undefined;
    return hooks.useDroppableCollection(
      {
        dropTargetDelegate,
        keyboardDelegate: {
          getFirstKey: () => state.collection().getFirstKey(),
          getLastKey: () => state.collection().getLastKey(),
          getKeyBelow: (key) => state.collection().getKeyAfter(key),
          getKeyAbove: (key) => state.collection().getKeyBefore(key),
          getKeyPageBelow: (key) => state.collection().getKeyAfter(key),
          getKeyPageAbove: (key) => state.collection().getKeyBefore(key),
        },
      },
      activeDropState,
      () => listRef()
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
  const virtualizer = useVirtualizerContext();
  const persistedKeys = useDndPersistedKeys(
    { focusedKey: state.focusedKey },
    local.dragAndDropHooks,
    dropState(),
    state.collection()
  );
  const virtualRange = createMemo(() => {
    if (!virtualizer || !parentCollectionRenderer?.isVirtualized || hasSections()) return null;
    const baseRange = virtualizer.getVisibleRange(stateProps.items.length);
    const itemNodes = getItemNodes();
    const persistedIndexes = Array.from(persistedKeys())
      .map((key) => itemNodes.findIndex((node) => node.key === key))
      .filter((index) => index >= 0);
    const dropTarget = dropState()?.target;
    const normalizedDropKey = getNormalizedDropTargetKey(dropTarget, state.collection());
    const focusedKey = state.focusedKey();
    const focusedIndex = focusedKey != null ? itemNodes.findIndex((node) => node.key === focusedKey) : -1;
    const forceIncludeIndexes = [
      dropTarget?.type === 'item' ? itemNodes.findIndex((node) => node.key === dropTarget.key) : -1,
      normalizedDropKey != null ? itemNodes.findIndex((node) => node.key === normalizedDropKey) : -1,
      dropTarget?.type === 'item' ? -1 : focusedIndex,
    ].filter((index) => index >= 0);
    return mergePersistedKeysIntoVirtualRange(baseRange, persistedIndexes, stateProps.items.length, virtualizer, 80, {
      forceIncludeIndexes,
      forceIncludeMaxSpan: 320,
    });
  });
  createEffect(() => {
    if (!virtualizer || !parentCollectionRenderer?.isVirtualized) return;
    const getItemNodes = () => Array.from(state.collection()).filter((node) => node.type === 'item');
    virtualizer.setDropTargetItemCountResolver(() => getItemNodes().length);
    virtualizer.setDropTargetIndexResolver((key) => {
      const index = getItemNodes().findIndex((node) => node.key === key);
      return index >= 0 ? index : null;
    });
    virtualizer.setDropTargetResolver((target) => {
      const node = getItemNodes()[target.index];
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
  const sectionedRenderEntries = createMemo(() => {
    let globalIndex = 0;
    return stateProps.items.map((entry) => {
      if (isCollectionSection(entry)) {
        const sectionItems = entry.items.map((item) => ({
          item,
          index: globalIndex++,
        }));
        return {
          type: 'section' as const,
          section: entry,
          items: sectionItems,
        };
      }
      const indexedItem = {
        item: entry as T,
        index: globalIndex++,
      };
      return {
        type: 'item' as const,
        item: indexedItem,
      };
    });
  });
  const collectionRenderer = createMemo<CollectionRendererContextValue<unknown>>(() => ({
    ...parentCollectionRenderer,
    renderItem: (item) => props.children(item as T),
    renderDropIndicator: (index, position) =>
      dndDropIndicator(index, position) ?? parentCollectionRenderer?.renderDropIndicator?.(index, position),
  }));

  return (
    <ListBoxContext.Provider
      value={{
        state,
        dragAndDropHooks: local.dragAndDropHooks as DragAndDropHooks<unknown> | undefined,
        dragState: dragState(),
        dropState: dropState(),
      }}
    >
      <ListBoxStateContext.Provider value={state}>
        <CollectionRendererContext.Provider value={collectionRenderer()}>
          <ul
            {...mergeProps(
              domProps(),
              cleanListBoxProps(),
              cleanFocusProps(),
              (droppableCollection()?.collectionProps as Record<string, unknown> | undefined) ?? {}
            )}
            ref={(el) => {
              setListRef(el);
            }}
            class={renderProps.class()}
            style={renderProps.style()}
            data-focused={state.isFocused() || undefined}
            data-focus-visible={isFocusVisible() || undefined}
            data-disabled={resolveDisabled() || undefined}
            data-empty={isEmpty() || undefined}
            data-drop-target={isRootDropTarget() || undefined}
          >
            {isEmpty() && local.renderEmptyState
              ? local.renderEmptyState()
              : hasSections()
                ? (
                  <For each={sectionedRenderEntries()}>
                    {(entry) =>
                      entry.type === 'section'
                        ? (
                          <li role="presentation" data-section-wrapper>
                            <Section class="solidaria-ListBox-section">
                              {entry.section.title != null && (
                                <Header class="solidaria-ListBox-sectionHeader">{entry.section.title}</Header>
                              )}
                              <Group class="solidaria-ListBox-sectionGroup">
                                <ul role="group" aria-label={entry.section['aria-label']}>
                                  <For each={entry.items}>
                                    {(indexedItem) => (
                                      <>
                                        {collectionRenderer().renderDropIndicator?.(indexedItem.index, 'before')}
                                        {collectionRenderer().renderDropIndicator?.(indexedItem.index, 'on')}
                                        {props.children(indexedItem.item)}
                                        {collectionRenderer().renderDropIndicator?.(indexedItem.index, 'after')}
                                      </>
                                    )}
                                  </For>
                                </ul>
                              </Group>
                            </Section>
                          </li>
                        )
                        : (
                          <>
                            {collectionRenderer().renderDropIndicator?.(entry.item.index, 'before')}
                            {collectionRenderer().renderDropIndicator?.(entry.item.index, 'on')}
                            {props.children(entry.item.item)}
                            {collectionRenderer().renderDropIndicator?.(entry.item.index, 'after')}
                          </>
                        )
                    }
                  </For>
                )
                : (
                  <>
                    {virtualRange()?.offsetTop
                      ? <li role="presentation" aria-hidden="true" style={{ height: `${virtualRange()!.offsetTop}px` }} data-virtualizer-spacer="top" />
                      : null}
                    <For each={visibleItems()}>
                      {(item, index) => {
                        const itemIndex = () => (virtualRange()?.start ?? 0) + index();
                        const beforeIndicator = () => collectionRenderer().renderDropIndicator?.(itemIndex(), 'before');
                        const onIndicator = () => collectionRenderer().renderDropIndicator?.(itemIndex(), 'on');
                        const afterIndicator = () => collectionRenderer().renderDropIndicator?.(itemIndex(), 'after');
                        return (
                          <>
                            {beforeIndicator()}
                            {onIndicator()}
                            {props.children(item as T)}
                            {afterIndicator()}
                          </>
                        );
                      }}
                    </For>
                    {virtualRange()?.offsetBottom
                      ? <li role="presentation" aria-hidden="true" style={{ height: `${virtualRange()!.offsetBottom}px` }} data-virtualizer-spacer="bottom" />
                      : null}
                  </>
                )
            }
            {local.hasMore && local.onLoadMore && (
              <ListBoxLoadMoreItem
                onLoadMore={local.onLoadMore}
                isLoading={local.isLoading}
              />
            )}
          </ul>
        </CollectionRendererContext.Provider>
      </ListBoxStateContext.Provider>
    </ListBoxContext.Provider>
  );
}

/**
 * An option in a listbox.
 */
export function ListBoxOption<T>(props: ListBoxOptionProps<T>): JSX.Element {
  const [local, ariaProps] = splitProps(props, [
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
  const listContext = useContext(ListBoxContext) as ListBoxContextValue<T> | null;
  const [ref, setRef] = createSignal<HTMLLIElement | null>(null);

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
      children: props.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-ListBox-option',
    },
    renderValues
  );

  const selectionIndicatorContext = createMemo<SelectionIndicatorContextValue>(() => ({
    isSelected: optionAria.isSelected,
  }));
  const draggableItem = createMemo(() => {
    if (!listContext?.dragAndDropHooks?.useDraggableItem || !listContext.dragState) return undefined;
    return listContext.dragAndDropHooks.useDraggableItem(
      {
        key: local.id as string | number,
      },
      listContext.dragState as Parameters<NonNullable<DragAndDropHooks<T>['useDraggableItem']>>[1]
    );
  });
  const droppableItem = createMemo(() => {
    if (!listContext?.dragAndDropHooks?.useDroppableItem || !listContext.dropState) return undefined;
    return listContext.dragAndDropHooks.useDroppableItem(
      {
        key: local.id as string | number,
      },
      listContext.dropState as Parameters<NonNullable<DragAndDropHooks<T>['useDroppableItem']>>[1],
      () => ref()
    );
  });

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
    <SelectionIndicatorContext.Provider value={selectionIndicatorContext()}>
      <li
        ref={setRef}
        {...mergeProps(
          cleanOptionProps(),
          cleanHoverProps(),
          (draggableItem()?.dragProps as Record<string, unknown> | undefined) ?? {},
          (droppableItem()?.dropProps as Record<string, unknown> | undefined) ?? {}
        )}
        class={renderProps.class()}
        style={renderProps.style()}
        data-selected={optionAria.isSelected() || undefined}
        data-focused={optionAria.isFocused() || undefined}
        data-focus-visible={optionAria.isFocusVisible() || undefined}
        data-pressed={optionAria.isPressed() || undefined}
        data-hovered={isHovered() || undefined}
        data-disabled={optionAria.isDisabled() || undefined}
        data-dragging={draggableItem()?.isDragging || undefined}
        data-drop-target={droppableItem()?.isDropTarget || undefined}
      >
        {renderProps.renderChildren()}
      </li>
    </SelectionIndicatorContext.Provider>
  );
}

/**
 * Load more sentinel item for listbox collections.
 */
export function ListBoxLoadMoreItem(props: ListBoxLoadMoreItemProps): JSX.Element {
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
      const entry = entries[0];
      if (entry?.isIntersecting) {
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
      defaultClassName: 'solidaria-ListBox-loadMore',
    },
    () => ({ isLoading: isLoading() })
  );

  return (
    <li
      ref={ref}
      role="option"
      aria-disabled={true}
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

/**
 * Section primitive alias for ListBox composition parity.
 */
export function ListBoxSection(props: ListBoxSectionProps): JSX.Element {
  return <Section {...props} />;
}

// Attach Option as a static property
ListBox.Option = ListBoxOption;
ListBox.LoadMoreItem = ListBoxLoadMoreItem;
