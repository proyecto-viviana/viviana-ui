/**
 * Table component for solidaria-components
 *
 * A pre-wired headless table that combines state + aria hooks.
 * Based on react-aria-components/src/Table.tsx
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
  createTable,
  createTableColumnHeader,
  createTableRow,
  createTableCell,
  createTableRowGroup,
  createTableSelectionCheckbox,
  createTableSelectAllCheckbox,
  createFocusRing,
  createHover,
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
}

export const TableContext = createContext<TableContextValue<object> | null>(null);
export const TableStateContext = createContext<TableState<object, TableCollection<object>> | null>(null);

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
    ['children', 'class', 'style', 'slot', 'renderEmptyState'],
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

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: local.children,
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

  const contextValue = createMemo<TableContextValue<T>>(() => ({
    state,
    collection: collection(),
    items: stateProps.items,
    columns: stateProps.columns,
    isDisabled: false,
    showSelectionCheckboxes: stateProps.showSelectionCheckboxes ?? false,
  }));

  return (
    <TableContext.Provider value={contextValue() as TableContextValue<object>}>
      <TableStateContext.Provider value={state as unknown as TableState<object, TableCollection<object>>}>
        <table
          ref={setRef}
          {...domProps()}
          {...cleanGridProps()}
          {...cleanFocusProps()}
          class={renderProps.class()}
          style={renderProps.style()}
          data-focused={state.isFocused || undefined}
          data-focus-visible={isFocusVisible() || undefined}
          data-empty={stateProps.items.length === 0 || undefined}
        >
          {renderProps.renderChildren()}
        </table>
      </TableStateContext.Provider>
    </TableContext.Provider>
  );
}

/**
 * A header row in a table containing column headers.
 */
export function TableHeader(props: TableHeaderProps): JSX.Element {
  const [local] = splitProps(props, ['children', 'class', 'style', 'slot']);

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
    <thead {...cleanRowGroupProps()} class={renderProps.class()} style={renderProps.style()}>
      <tr role="row">{local.children}</tr>
    </thead>
  );
}

/**
 * A column header in a table.
 */
export function TableColumn(props: TableColumnProps): JSX.Element {
  const [local] = splitProps(props, ['children', 'class', 'style', 'slot', 'id', 'allowsSorting']);

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
  const { columnHeaderProps } = createTableColumnHeader<object>(
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

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: local.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Table-column',
    },
    renderValues
  );

  // Remove ref from spread props
  const cleanColumnHeaderProps = () => {
    const { ref: _ref1, ...rest } = columnHeaderProps as Record<string, unknown>;
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
      {renderProps.renderChildren()}
    </th>
  );
}

/**
 * The body of a table containing data rows.
 */
export function TableBody<T extends object>(props: TableBodyProps<T>): JSX.Element {
  const [local] = splitProps(props, ['children', 'items', 'class', 'style', 'slot', 'renderEmptyState']);

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

  return (
    <tbody {...cleanRowGroupProps()} class={renderProps.class()} style={renderProps.style()}>
      <Show when={isEmpty() && local.renderEmptyState} fallback={<For each={items()}>{(item) => local.children?.(item)}</For>}>
        {local.renderEmptyState?.()}
      </Show>
    </tbody>
  );
}

/**
 * A row in a table.
 */
export function TableRow<T extends object>(props: TableRowProps<T>): JSX.Element {
  const [local] = splitProps(props, ['children', 'class', 'style', 'slot', 'id', 'item', 'onAction']);

  // Get context
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('TableRow must be used within a Table');
  }
  const { state, collection } = context;

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
  const { rowProps, isSelected, isDisabled, isPressed } = createTableRow<object>(
    () => ({
      node: rowNode(),
      onAction: local.onAction,
    }),
    () => state as TableState<object, TableCollection<object>>,
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
  const renderValues = createMemo<TableRowRenderProps>(() => ({
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
      children: local.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Table-row',
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

  const rowContextValue: TableRowContextValue = {
    rowKey: local.id,
    rowNode: rowNode(),
  };

  return (
    <TableRowContext.Provider value={rowContextValue}>
      <tr
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
        {renderProps.renderChildren()}
      </tr>
    </TableRowContext.Provider>
  );
}

/**
 * A cell in a table row.
 */
export function TableCell(props: TableCellProps): JSX.Element {
  const [local] = splitProps(props, ['children', 'class', 'style', 'slot', 'id']);

  // Get context
  const tableContext = useContext(TableContext);
  const rowContext = useContext(TableRowContext);

  if (!tableContext) {
    throw new Error('TableCell must be used within a Table');
  }
  if (!rowContext) {
    throw new Error('TableCell must be used within a TableRow');
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
  const { gridCellProps, isPressed } = createTableCell<object>(
    () => ({
      node: cellNode(),
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

  // Check if focused
  const isFocused = createMemo(() => state.focusedKey === cellNode().key);

  // Render props values
  const renderValues = createMemo<TableCellRenderProps>(() => ({
    isFocused: isFocused(),
    isFocusVisible: isFocusVisible() && isFocused(),
    isPressed,
    isHovered: isHovered(),
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: local.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Table-cell',
    },
    renderValues
  );

  // Remove ref from spread props
  const cleanCellProps = () => {
    const { ref: _ref1, ...rest } = gridCellProps as Record<string, unknown>;
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
      {...cleanCellProps()}
      {...cleanHoverProps()}
      {...cleanFocusProps()}
      class={renderProps.class()}
      style={renderProps.style()}
      data-focused={isFocused() || undefined}
      data-focus-visible={(isFocusVisible() && isFocused()) || undefined}
      data-pressed={isPressed || undefined}
      data-hovered={isHovered() || undefined}
    >
      {renderProps.renderChildren()}
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

  const { checkboxProps } = createTableSelectionCheckbox<object>(
    () => ({ key: props.rowKey }),
    () => state as TableState<object, TableCollection<object>>
  );

  return <input {...checkboxProps} />;
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

  const { checkboxProps } = createTableSelectAllCheckbox<object>(
    () => state as TableState<object, TableCollection<object>>
  );

  return <input {...checkboxProps} />;
}

// Attach components as static properties
Table.Header = TableHeader;
Table.Column = TableColumn;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Cell = TableCell;
Table.SelectionCheckbox = TableSelectionCheckbox;
Table.SelectAllCheckbox = TableSelectAllCheckbox;
