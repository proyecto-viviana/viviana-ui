/**
 * Table component for solidaria-components
 *
 * A pre-wired headless table that combines state + aria hooks.
 * Based on react-aria-components/src/Table.tsx
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
  Show,
} from 'solid-js';
import {
  createTable,
  createTableColumnHeader,
  createTableRow,
  createTableCell,
  createTableRowGroup,
  createTableSelectionCheckbox,
  createTableSelectAllCheckbox,
  createFocusRing,
  createHover,
  mergeProps,
  type AriaTableProps,
} from '@proyecto-viviana/solidaria';
import {
  createTableState,
  createTableCollection,
  type TableState,
  type TableCollection,
  type Key,
  type SortDescriptor,
  type ColumnDefinition,
  type GridNode,
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
import { SharedElementTransition } from './SharedElementTransition';
import { type DragAndDropHooks } from './useDragAndDrop';
import { CollectionRendererContext, type CollectionRendererContextValue, useCollectionRenderer } from './Collection';
import { useVirtualizerContext } from './Virtualizer';
import {
  getNormalizedDropTargetKey,
  mergePersistedKeysIntoVirtualRange,
  useDndPersistedKeys,
  useRenderDropIndicator,
} from './DragAndDrop';

// ============================================
// TYPES
// ============================================

export interface TableRenderProps {
  /** Whether the table has focus. */
  isFocused: boolean;
  /** Whether the table has keyboard focus. */
  isFocusVisible: boolean;
  /** Whether the table is disabled. */
  isDisabled: boolean;
  /** Whether the table is empty. */
  isEmpty: boolean;
}

export interface TableProps<T extends object> extends Omit<AriaTableProps, 'children'>, SlotProps {
  /** The data items to render in the table. */
  items: T[];
  /** The column definitions. */
  columns: ColumnDefinition<T>[];
  /** Function to get the key from an item. */
  getKey?: (item: T) => Key;
  /** Function to get the text value from an item for a column. */
  getTextValue?: (item: T, column: ColumnDefinition<T>) => string;
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
  /** The current sort descriptor. */
  sortDescriptor?: SortDescriptor;
  /** Handler called when sort changes. */
  onSortChange?: (descriptor: SortDescriptor) => void;
  /** Whether to show selection checkboxes. */
  showSelectionCheckboxes?: boolean;
  /** The children of the component. */
  children?: JSX.Element | RenderChildren<TableRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<TableRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<TableRenderProps>;
  /** A function to render when the table is empty. */
  renderEmptyState?: () => JSX.Element;
  /** Drag and drop hooks from `useDragAndDrop`. */
  dragAndDropHooks?: DragAndDropHooks<T>;
}

export interface TableHeaderRenderProps {
  /** Whether the header has focus. */
  isFocused: boolean;
}

export interface TableHeaderProps extends SlotProps {
  /** The children (usually TableColumn components). */
  children?: JSX.Element;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<TableHeaderRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<TableHeaderRenderProps>;
}

export interface TableColumnRenderProps {
  /** Whether the column is focused. */
  isFocused: boolean;
  /** Whether the column has keyboard focus. */
  isFocusVisible: boolean;
  /** Whether the column is sortable. */
  isSortable: boolean;
  /** The current sort direction ('ascending', 'descending', or undefined). */
  sortDirection: 'ascending' | 'descending' | undefined;
  /** Whether the column is being hovered. */
  isHovered: boolean;
}

export interface TableColumnProps extends SlotProps {
  /** The unique key for the column. */
  id: Key;
  /** Whether the column allows sorting. */
  allowsSorting?: boolean;
  /** The children of the column. */
  children?: RenderChildren<TableColumnRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<TableColumnRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<TableColumnRenderProps>;
}

export interface TableBodyRenderProps {
  /** Whether the body is empty. */
  isEmpty: boolean;
}

export interface TableBodyProps<T> extends SlotProps {
  /** The items to render. If not provided, uses items from Table. */
  items?: T[];
  /** The children (usually a render function for TableRow). */
  children?: (item: T) => JSX.Element;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<TableBodyRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<TableBodyRenderProps>;
  /** A function to render when the body is empty. */
  renderEmptyState?: () => JSX.Element;
  /** Whether there are more rows to load. */
  hasMore?: boolean;
  /** Whether additional rows are currently loading. */
  isLoading?: boolean;
  /** Called when the load more sentinel becomes visible. */
  onLoadMore?: () => void | Promise<void>;
}

export interface TableRowRenderProps {
  /** Whether the row is selected. */
  isSelected: boolean;
  /** Whether the row is focused. */
  isFocused: boolean;
  /** Whether the row has keyboard focus. */
  isFocusVisible: boolean;
  /** Whether the row is pressed. */
  isPressed: boolean;
  /** Whether the row is hovered. */
  isHovered: boolean;
  /** Whether the row is disabled. */
  isDisabled: boolean;
}

export interface TableRowProps<T> extends SlotProps {
  /** The unique key for the row. */
  id: Key;
  /** The item value. */
  item?: T;
  /** The children of the row (usually TableCell components). */
  children?: JSX.Element | RenderChildren<TableRowRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<TableRowRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<TableRowRenderProps>;
  /** Handler called when the row is activated (double-click or Enter). */
  onAction?: () => void;
}

export interface TableCellRenderProps {
  /** Whether the cell is focused. */
  isFocused: boolean;
  /** Whether the cell has keyboard focus. */
  isFocusVisible: boolean;
  /** Whether the cell is pressed. */
  isPressed: boolean;
  /** Whether the cell is hovered. */
  isHovered: boolean;
}

export interface TableCellProps extends SlotProps {
  /** The unique key for the cell. */
  id?: Key;
  /** The children of the cell. */
  children?: RenderChildren<TableCellRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<TableCellRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<TableCellRenderProps>;
}

export interface TableLoadMoreItemProps extends SlotProps {
  onLoadMore: () => void | Promise<void>;
  isLoading?: boolean;
  colSpan?: number;
  children?: JSX.Element;
  class?: ClassNameOrFunction<{ isLoading: boolean }>;
  style?: StyleOrFunction<{ isLoading: boolean }>;
}

// ============================================
// CONTEXT
// ============================================

interface TableContextValue<T extends object> {
  state: TableState<T, TableCollection<T>>;
  collection: TableCollection<T>;
  items: T[];
  columns: ColumnDefinition<T>[];
  isDisabled: boolean;
  showSelectionCheckboxes: boolean;
  dragAndDropHooks?: DragAndDropHooks<T>;
  dragState?: unknown;
  dropState?: unknown;
}

export const TableContext = createContext<TableContextValue<object> | null>(null);
export const TableStateContext = createContext<TableState<object, TableCollection<object>> | null>(null);
export const TableColumnResizeStateContext = createContext<null>(null);

// Row-level context for cells
interface TableRowContextValue {
  rowKey: Key;
  rowNode: GridNode<unknown>;
}

export const TableRowContext = createContext<TableRowContextValue | null>(null);

// ============================================
// COMPONENTS
// ============================================

/**
 * A table displays data in rows and columns and enables a user to navigate its contents via directional navigation keys,
 * and optionally supports row selection and sorting.
 */
export function Table<T extends object>(props: TableProps<T>): JSX.Element {
  const [local, stateProps, ariaProps] = splitProps(
    props,
    ['class', 'style', 'slot', 'renderEmptyState', 'dragAndDropHooks'],
    [
      'items',
      'columns',
      'getKey',
      'getTextValue',
      'disabledKeys',
      'selectionMode',
      'selectedKeys',
      'defaultSelectedKeys',
      'onSelectionChange',
      'sortDescriptor',
      'onSortChange',
      'showSelectionCheckboxes',
    ]
  );

  // Create ref signal
  const [ref, setRef] = createSignal<HTMLTableElement | null>(null);

  // Create collection
  const collection = createMemo(() =>
    createTableCollection<T>({
      columns: stateProps.columns,
      rows: stateProps.items,
      getKey: stateProps.getKey,
      getTextValue: stateProps.getTextValue,
      showSelectionCheckboxes: stateProps.showSelectionCheckboxes ?? false,
    })
  );

  // Create table state
  const state = createTableState<T, TableCollection<T>>(() => ({
    collection: collection(),
    disabledKeys: stateProps.disabledKeys,
    selectionMode: stateProps.selectionMode,
    selectedKeys: stateProps.selectedKeys,
    defaultSelectedKeys: stateProps.defaultSelectedKeys,
    onSelectionChange: stateProps.onSelectionChange,
    sortDescriptor: stateProps.sortDescriptor,
    onSortChange: stateProps.onSortChange,
    showSelectionCheckboxes: stateProps.showSelectionCheckboxes,
  }));

  // Create table aria props
  const { gridProps } = createTable<T>(
    () => ({
      id: ariaProps.id,
      'aria-label': ariaProps['aria-label'],
      'aria-labelledby': ariaProps['aria-labelledby'],
      'aria-describedby': ariaProps['aria-describedby'],
      isVirtualized: ariaProps.isVirtualized,
      onRowAction: ariaProps.onRowAction,
      onCellAction: ariaProps.onCellAction,
      focusMode: ariaProps.focusMode,
    }),
    () => state,
    ref
  );

  // Create focus ring
  const { isFocused, isFocusVisible, focusProps } = createFocusRing();

  // Render props values
  const renderValues = createMemo<TableRenderProps>(() => ({
    isFocused: state.isFocused || isFocused(),
    isFocusVisible: isFocusVisible(),
    isDisabled: false, // Tables don't have a global disabled state
    isEmpty: stateProps.items.length === 0,
  }));

  // Resolve render props (class and style only — children rendered directly in JSX
  // to avoid eager evaluation before context providers mount)
  const renderProps = useRenderProps(
    {
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Table',
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
  const parentCollectionRenderer = useCollectionRenderer<T>();
  const getItemNodes = () => Array.from(state.collection).filter((node) => node.type === 'item');
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
      (hooks.dropTargetDelegate || parentCollectionRenderer?.dropTargetDelegate || hooks.ListDropTargetDelegate)
    );
  });
  const hasDraggableDnd = createMemo(() => {
    const hooks = local.dragAndDropHooks;
    return Boolean(hooks?.useDraggableCollectionState && hooks.useDraggableCollection);
  });
  const dragState = createMemo(() => {
    if (!hasDraggableDnd()) return undefined;
    return local.dragAndDropHooks?.useDraggableCollectionState?.({
      items: stateProps.items,
    });
  });
  const dropState = createMemo(() => {
    if (!hasDroppableDnd()) return undefined;
    return local.dragAndDropHooks?.useDroppableCollectionState?.({});
  });
  createEffect(() => {
    if (!hasDraggableDnd()) return;
    const hooks = local.dragAndDropHooks;
    const activeDragState = dragState();
    if (!hooks?.useDraggableCollection || !activeDragState) return;
    hooks.useDraggableCollection({}, activeDragState, () => ref());
  });
  const droppableCollection = createMemo(() => {
    if (!hasDroppableDnd()) return undefined;
    const hooks = local.dragAndDropHooks;
    const activeDropState = dropState();
    if (!hooks?.useDroppableCollection || !activeDropState) return undefined;
    const resolveDirection = (): 'ltr' | 'rtl' => {
      const el = ref();
      if (el && typeof window !== 'undefined' && typeof window.getComputedStyle === 'function') {
        const dir = window.getComputedStyle(el).direction;
        if (dir === 'rtl') return 'rtl';
      }
      return typeof document !== 'undefined' && document.dir === 'rtl' ? 'rtl' : 'ltr';
    };
    const dropTargetDelegate = hooks.dropTargetDelegate
      ?? parentCollectionRenderer?.dropTargetDelegate
      ?? (hooks.ListDropTargetDelegate
        ? new hooks.ListDropTargetDelegate(
          () => state.collection,
          () => ref(),
          { layout: 'grid', orientation: 'vertical', direction: resolveDirection() }
        )
        : undefined);
    if (!dropTargetDelegate) return undefined;
    return hooks.useDroppableCollection(
      {
        dropTargetDelegate,
        keyboardDelegate: {
          getFirstKey: () => state.collection.getFirstKey?.() ?? null,
          getLastKey: () => state.collection.getLastKey?.() ?? null,
          getKeyBelow: (key) => state.collection.getKeyAfter?.(key) ?? null,
          getKeyAbove: (key) => state.collection.getKeyBefore?.(key) ?? null,
          getKeyLeftOf: (key) =>
            resolveDirection() === 'rtl'
              ? state.collection.getKeyAfter?.(key) ?? null
              : state.collection.getKeyBefore?.(key) ?? null,
          getKeyRightOf: (key) =>
            resolveDirection() === 'rtl'
              ? state.collection.getKeyBefore?.(key) ?? null
              : state.collection.getKeyAfter?.(key) ?? null,
          getKeyPageBelow: (key) => state.collection.getKeyAfter?.(key) ?? null,
          getKeyPageAbove: (key) => state.collection.getKeyBefore?.(key) ?? null,
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

  const contextValue = createMemo<TableContextValue<T>>(() => ({
    state,
    collection: collection(),
    items: stateProps.items,
    columns: stateProps.columns,
    isDisabled: false,
    showSelectionCheckboxes: stateProps.showSelectionCheckboxes ?? false,
    dragAndDropHooks: local.dragAndDropHooks,
    dragState: dragState(),
    dropState: dropState(),
  }));
  const collectionRenderer = createMemo<CollectionRendererContextValue<unknown>>(() => ({
    ...parentCollectionRenderer,
    renderItem: (item) => item as JSX.Element,
    renderDropIndicator: (index: number, position: 'before' | 'after' | 'on') =>
      dndDropIndicator(index, position) ?? parentCollectionRenderer?.renderDropIndicator?.(index, position),
  }));

  return (
    <TableContext.Provider value={contextValue() as unknown as TableContextValue<object>}>
      <TableStateContext.Provider value={state as unknown as TableState<object, TableCollection<object>>}>
        <CollectionRendererContext.Provider value={collectionRenderer()}>
          <table
            ref={setRef}
            {...mergeProps(
              domProps(),
              cleanGridProps(),
              cleanFocusProps(),
              (droppableCollection()?.collectionProps as Record<string, unknown> | undefined) ?? {}
            )}
            class={renderProps.class()}
            style={renderProps.style()}
            data-focused={state.isFocused || undefined}
            data-focus-visible={isFocusVisible() || undefined}
            data-empty={stateProps.items.length === 0 || undefined}
            data-drop-target={isRootDropTarget() || undefined}
          >
            {typeof props.children === 'function'
              ? props.children(renderValues())
              : props.children}
          </table>
        </CollectionRendererContext.Provider>
      </TableStateContext.Provider>
    </TableContext.Provider>
  );
}

/**
 * A header row in a table containing column headers.
 */
export function TableHeader(props: TableHeaderProps): JSX.Element {
  const [local, domProps] = splitProps(props, ['class', 'style', 'slot', 'children']);

  // Get context
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('TableHeader must be used within a Table');
  }

  const { rowGroupProps } = createTableRowGroup(() => ({ type: 'thead' }));

  // Render props values
  const renderValues = createMemo<TableHeaderRenderProps>(() => ({
    isFocused: false,
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Table-header',
    },
    renderValues
  );

  const cleanRowGroupProps = () => {
    const { ref: _ref, ...rest } = rowGroupProps as Record<string, unknown>;
    return rest;
  };

  return (
    <thead {...domProps} {...cleanRowGroupProps()} class={renderProps.class()} style={renderProps.style()}>
      <tr role="row">{local.children}</tr>
    </thead>
  );
}

/**
 * A column header in a table.
 */
export function TableColumn(props: TableColumnProps): JSX.Element {
  const [local, domProps] = splitProps(props, ['class', 'style', 'slot', 'id', 'allowsSorting', 'children']);

  // Get context
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('TableColumn must be used within a Table');
  }
  const { state, collection } = context;

  // Create ref signal
  const [ref, setRef] = createSignal<HTMLTableCellElement | null>(null);

  // Find the column node
  const columnNode = createMemo(() => {
    const node = collection.getItem(local.id);
    if (!node) {
      // Create a simple node for the column
      return {
        type: 'column' as const,
        key: local.id,
        value: null,
        textValue: String(local.id),
        level: 0,
        index: 0,
        hasChildNodes: false,
        childNodes: [],
      } as GridNode<unknown>;
    }
    return node;
  });

  // Create column header aria props
  const columnHeaderAria = createTableColumnHeader<object>(
    () => ({
      node: columnNode(),
      allowsSorting: local.allowsSorting,
    }),
    () => state as TableState<object, TableCollection<object>>,
    ref
  );

  // Create hover
  const { isHovered, hoverProps } = createHover({
    isDisabled: false,
  });

  // Create focus ring
  const { isFocusVisible, focusProps } = createFocusRing();

  // Get sort direction
  const sortDirection = createMemo(() => {
    const sortDescriptor = state.sortDescriptor;
    if (sortDescriptor?.column === local.id) {
      return sortDescriptor.direction;
    }
    return undefined;
  });

  // Render props values
  const renderValues = createMemo<TableColumnRenderProps>(() => ({
    isFocused: state.focusedKey === local.id,
    isFocusVisible: isFocusVisible() && state.focusedKey === local.id,
    isSortable: local.allowsSorting ?? false,
    sortDirection: sortDirection(),
    isHovered: isHovered(),
  }));

  // Resolve render props (children rendered directly in JSX to avoid eager evaluation)
  const renderProps = useRenderProps(
    {
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Table-column',
    },
    renderValues
  );

  // Remove ref from spread props
  const cleanColumnHeaderProps = () => {
    const { ref: _ref1, ...rest } = columnHeaderAria.columnHeaderProps as Record<string, unknown>;
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
    <th
      ref={setRef}
      {...domProps}
      {...cleanColumnHeaderProps()}
      {...cleanHoverProps()}
      {...cleanFocusProps()}
      class={renderProps.class()}
      style={renderProps.style()}
      data-sortable={local.allowsSorting || undefined}
      data-sort-direction={sortDirection() || undefined}
      data-hovered={isHovered() || undefined}
      data-focused={state.focusedKey === local.id || undefined}
      data-focus-visible={(isFocusVisible() && state.focusedKey === local.id) || undefined}
    >
      {typeof local.children === 'function'
        ? local.children(renderValues())
        : local.children}
    </th>
  );
}

/**
 * The body of a table containing data rows.
 */
export function TableBody<T extends object>(props: TableBodyProps<T>): JSX.Element {
  const [local, domProps] = splitProps(props, ['items', 'class', 'style', 'slot', 'renderEmptyState', 'hasMore', 'isLoading', 'onLoadMore', 'children']);

  // Get context
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('TableBody must be used within a Table');
  }

  const { rowGroupProps } = createTableRowGroup(() => ({ type: 'tbody' }));

  // Use provided items or context items
  const items = createMemo(() => (local.items ?? context.items) as T[]);

  // Render props values
  const renderValues = createMemo<TableBodyRenderProps>(() => ({
    isEmpty: items().length === 0,
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Table-body',
    },
    renderValues
  );

  const cleanRowGroupProps = () => {
    const { ref: _ref, ...rest } = rowGroupProps as Record<string, unknown>;
    return rest;
  };

  const isEmpty = () => items().length === 0;
  const virtualizer = useVirtualizerContext();
  const parentCollectionRenderer = useCollectionRenderer<T>();
  const rowNodes = createMemo(() => Array.from(context.collection).filter((node) => node.type === 'item'));
  const persistedKeys = useDndPersistedKeys(
    { focusedKey: () => context.state.focusedKey },
    context.dragAndDropHooks,
    context.dropState as { target?: DropTarget | null } | undefined,
    context.collection
  );
  const virtualRange = createMemo(() => {
    if (!virtualizer || !parentCollectionRenderer?.isVirtualized) return null;
    const rowCount = items().length;
    const baseRange = virtualizer.getVisibleRange(rowCount);
    const persistedIndexes = Array.from(persistedKeys())
      .map((key) => rowNodes().findIndex((node) => node.key === key))
      .filter((index) => index >= 0);
    const dropTarget = (context.dropState as { target?: DropTarget | null } | undefined)?.target;
    const normalizedDropKey = getNormalizedDropTargetKey(dropTarget, context.collection);
    const focusedKey = context.state.focusedKey;
    const focusedIndex = focusedKey != null ? rowNodes().findIndex((node) => node.key === focusedKey) : -1;
    const forceIncludeIndexes = [
      dropTarget?.type === 'item' ? rowNodes().findIndex((node) => node.key === dropTarget.key) : -1,
      normalizedDropKey != null ? rowNodes().findIndex((node) => node.key === normalizedDropKey) : -1,
      dropTarget?.type === 'item' ? -1 : focusedIndex,
    ].filter((index) => index >= 0);
    return mergePersistedKeysIntoVirtualRange(baseRange, persistedIndexes, rowCount, virtualizer, 80, {
      forceIncludeIndexes,
      forceIncludeMaxSpan: 320,
    });
  });
  createEffect(() => {
    if (!virtualizer || !parentCollectionRenderer?.isVirtualized) return;
    virtualizer.setDropTargetItemCountResolver(() => items().length);
    virtualizer.setDropTargetIndexResolver((key) => {
      const index = rowNodes().findIndex((node) => node.key === key);
      return index >= 0 ? index : null;
    });
    virtualizer.setDropTargetResolver((target) => {
      const node = rowNodes()[target.index];
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
    if (!range) return items();
    return items().slice(range.start, range.end);
  });
  const spacerColSpan = () => context.columns.length + (context.showSelectionCheckboxes ? 1 : 0);

  return (
    <tbody {...domProps} {...cleanRowGroupProps()} class={renderProps.class()} style={renderProps.style()}>
      <SharedElementTransition>
      <Show when={isEmpty() && local.renderEmptyState} fallback={
        <>
          {virtualRange()?.offsetTop
            ? (
              <tr role="presentation" aria-hidden="true" data-virtualizer-spacer="top">
                <td colSpan={spacerColSpan()} style={{ height: `${virtualRange()!.offsetTop}px`, padding: '0', border: '0' }} />
              </tr>
            )
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
                  {local.children?.(item)}
                  {afterIndicator()}
                </>
              );
            }}
          </For>
          {virtualRange()?.offsetBottom
            ? (
              <tr role="presentation" aria-hidden="true" data-virtualizer-spacer="bottom">
                <td colSpan={spacerColSpan()} style={{ height: `${virtualRange()!.offsetBottom}px`, padding: '0', border: '0' }} />
              </tr>
            )
            : null}
        </>
      }>
        {local.renderEmptyState?.()}
      </Show>
      </SharedElementTransition>
      <Show when={local.hasMore && local.onLoadMore}>
        <TableLoadMoreItem
          onLoadMore={local.onLoadMore!}
          isLoading={local.isLoading}
          colSpan={spacerColSpan()}
        />
      </Show>
    </tbody>
  );
}

export function TableLoadMoreItem(props: TableLoadMoreItemProps): JSX.Element {
  let ref: HTMLTableRowElement | undefined;
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
      defaultClassName: 'solidaria-Table-loadMore',
    },
    () => ({ isLoading: isLoading() })
  );

  return (
    <tr
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
      <td colSpan={props.colSpan ?? 1}>{renderProps.renderChildren()}</td>
    </tr>
  );
}

/**
 * A row in a table.
 */
export function TableRow<T extends object>(props: TableRowProps<T>): JSX.Element {
  const [local, domProps] = splitProps(props, ['class', 'style', 'slot', 'id', 'item', 'onAction', 'children']);

  // Get context
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('TableRow must be used within a Table');
  }
  const { state, collection } = context;
  const tableContext = context as unknown as TableContextValue<T>;

  // Create ref signal
  const [ref, setRef] = createSignal<HTMLTableRowElement | null>(null);

  // Find the row node
  const rowNode = createMemo(() => {
    const node = collection.getItem(local.id);
    if (!node) {
      // Create a simple node for the row
      return {
        type: 'item' as const,
        key: local.id,
        value: local.item ?? null,
        textValue: String(local.id),
        level: 0,
        index: 0,
        hasChildNodes: true,
        childNodes: [],
      } as GridNode<unknown>;
    }
    return node;
  });

  // Create row aria props
  const rowAria = createTableRow<object>(
    () => ({
      node: rowNode(),
      onAction: local.onAction,
    }),
    () => state as TableState<object, TableCollection<object>>,
    ref
  );
  const isSelected = () => rowAria.isSelected;
  const isDisabled = () => rowAria.isDisabled;
  const isPressed = () => rowAria.isPressed;

  // Create hover
  const { isHovered, hoverProps } = createHover({
    get isDisabled() {
      return isDisabled();
    },
  });

  // Create focus ring
  const { isFocusVisible, focusProps } = createFocusRing();

  // Check if focused
  const isFocused = createMemo(() => state.focusedKey === local.id);
  const draggableItem = createMemo(() => {
    if (!tableContext.dragAndDropHooks?.useDraggableItem || !tableContext.dragState) return undefined;
    return tableContext.dragAndDropHooks.useDraggableItem(
      {
        key: local.id as string | number,
      },
      tableContext.dragState as Parameters<NonNullable<DragAndDropHooks<T>['useDraggableItem']>>[1]
    );
  });
  const droppableItem = createMemo(() => {
    if (!tableContext.dragAndDropHooks?.useDroppableItem || !tableContext.dropState) return undefined;
    return tableContext.dragAndDropHooks.useDroppableItem(
      {
        key: local.id as string | number,
      },
      tableContext.dropState as Parameters<NonNullable<DragAndDropHooks<T>['useDroppableItem']>>[1],
      () => ref()
    );
  });

  // Render props values
  const renderValues = createMemo<TableRowRenderProps>(() => ({
    isSelected: isSelected(),
    isFocused: isFocused(),
    isFocusVisible: isFocusVisible() && isFocused(),
    isPressed: isPressed(),
    isHovered: isHovered(),
    isDisabled: isDisabled(),
  }));

  // Resolve render props (children rendered directly in JSX to avoid eager evaluation)
  const renderProps = useRenderProps(
    {
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Table-row',
    },
    renderValues
  );

  // Remove ref from spread props
  const cleanRowProps = () => {
    const { ref: _ref1, ...rest } = rowAria.rowProps as Record<string, unknown>;
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

  const rowContextValue: TableRowContextValue = {
    rowKey: local.id,
    rowNode: rowNode(),
  };

  return (
    <TableRowContext.Provider value={rowContextValue}>
      <tr
        ref={setRef}
        {...domProps}
        {...mergeProps(
          cleanRowProps(),
          cleanHoverProps(),
          cleanFocusProps(),
          (draggableItem()?.dragProps as Record<string, unknown> | undefined) ?? {},
          (droppableItem()?.dropProps as Record<string, unknown> | undefined) ?? {}
        )}
        class={renderProps.class()}
        style={renderProps.style()}
        data-selected={isSelected() || undefined}
        data-focused={isFocused() || undefined}
        data-focus-visible={(isFocusVisible() && isFocused()) || undefined}
        data-pressed={isPressed() || undefined}
        data-hovered={isHovered() || undefined}
        data-disabled={isDisabled() || undefined}
        data-dragging={draggableItem()?.isDragging || undefined}
        data-drop-target={droppableItem()?.isDropTarget || undefined}
      >
        {typeof local.children === 'function'
          ? local.children(renderValues())
          : local.children}
      </tr>
    </TableRowContext.Provider>
  );
}

/**
 * A cell in a table row.
 */
export function TableCell(props: TableCellProps): JSX.Element {
  const [local, domProps] = splitProps(props, ['class', 'style', 'slot', 'id', 'children']);

  // Get context
  const tableContext = useContext(TableContext);
  const rowContext = useContext(TableRowContext);

  if (!tableContext) {
    throw new Error('TableCell must be used within a Table');
  }
  if (!rowContext) {
    throw new Error('TableCell must be used within a Table');
  }

  const { state, collection } = tableContext;
  const { rowKey, rowNode } = rowContext;

  // Create ref signal
  const [ref, setRef] = createSignal<HTMLTableCellElement | null>(null);

  // Find the cell node
  const cellNode = createMemo(() => {
    // If id is provided, look for that specific cell
    if (local.id != null) {
      const cellKey = `${rowKey}-${local.id}`;
      const node = collection.getItem(cellKey);
      if (node) return node;
    }

    // Otherwise create a simple node
    return {
      type: 'cell' as const,
      key: local.id ?? `${rowKey}-cell`,
      value: rowNode.value,
      textValue: '',
      level: 1,
      index: 0,
      parentKey: rowKey,
      hasChildNodes: false,
      childNodes: [],
    } as GridNode<unknown>;
  });

  // Create cell aria props
  const cellAria = createTableCell<object>(
    () => ({
      node: cellNode(),
    }),
    () => state as TableState<object, TableCollection<object>>,
    ref
  );
  const isPressed = () => cellAria.isPressed;

  // Create hover
  const { isHovered, hoverProps } = createHover({
    isDisabled: false,
  });

  // Create focus ring
  const { isFocusVisible, focusProps } = createFocusRing();

  // Check if focused
  const isFocused = createMemo(() => state.focusedKey === cellNode().key);

  // Render props values
  const renderValues = createMemo<TableCellRenderProps>(() => ({
    isFocused: isFocused(),
    isFocusVisible: isFocusVisible() && isFocused(),
    isPressed: isPressed(),
    isHovered: isHovered(),
  }));

  // Resolve render props (children rendered directly in JSX to avoid eager evaluation)
  const renderProps = useRenderProps(
    {
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Table-cell',
    },
    renderValues
  );

  // Remove ref from spread props
  const cleanCellProps = () => {
    const { ref: _ref1, ...rest } = cellAria.gridCellProps as Record<string, unknown>;
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
    <td
      ref={setRef}
      {...domProps}
      {...cleanCellProps()}
      {...cleanHoverProps()}
      {...cleanFocusProps()}
      class={renderProps.class()}
      style={renderProps.style()}
      data-focused={isFocused() || undefined}
      data-focus-visible={(isFocusVisible() && isFocused()) || undefined}
      data-pressed={isPressed() || undefined}
      data-hovered={isHovered() || undefined}
    >
      {typeof local.children === 'function'
        ? local.children(renderValues())
        : local.children}
    </td>
  );
}

/**
 * A checkbox cell for row selection.
 */
export function TableSelectionCheckbox(props: { rowKey: Key }): JSX.Element {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('TableSelectionCheckbox must be used within a Table');
  }

  const { state } = context;

  const selectionCheckboxAria = createTableSelectionCheckbox<object>(
    () => ({ key: props.rowKey }),
    () => state as TableState<object, TableCollection<object>>
  );

  return <input {...selectionCheckboxAria.checkboxProps} />;
}

/**
 * A checkbox for select-all functionality.
 */
export function TableSelectAllCheckbox(): JSX.Element {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('TableSelectAllCheckbox must be used within a Table');
  }

  const { state } = context;

  const selectAllCheckboxAria = createTableSelectAllCheckbox<object>(
    () => state as TableState<object, TableCollection<object>>
  );

  return <input {...selectAllCheckboxAria.checkboxProps} />;
}

// Attach components as static properties
Table.Header = TableHeader;
Table.Column = TableColumn;
Table.Body = TableBody;
Table.LoadMoreItem = TableLoadMoreItem;
Table.Row = TableRow;
Table.Cell = TableCell;
Table.SelectionCheckbox = TableSelectionCheckbox;
Table.SelectAllCheckbox = TableSelectAllCheckbox;

export interface ColumnResizerProps extends SlotProps {
  class?: string;
  style?: JSX.CSSProperties;
}

export function ColumnResizer(props: ColumnResizerProps): JSX.Element {
  return <div role="separator" class={props.class ?? 'solidaria-Table-columnResizer'} style={props.style} />;
}

export interface ResizableTableContainerProps extends SlotProps {
  children?: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties;
}

export function ResizableTableContainer(props: ResizableTableContainerProps): JSX.Element {
  return (
    <div class={props.class ?? 'solidaria-ResizableTableContainer'} style={props.style}>
      {props.children}
    </div>
  );
}

export function useTableOptions() {
  return useContext(TableContext);
}
