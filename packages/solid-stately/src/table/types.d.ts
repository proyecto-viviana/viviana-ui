/**
 * Table state types for Table components.
 * Based on @react-stately/table and @react-types/table.
 */
import type { Key } from '../collections/types';
import type { GridState, GridCollection, GridNode } from '../grid/types';
/**
 * Sort direction for table columns.
 */
export type SortDirection = 'ascending' | 'descending';
/**
 * Describes which column to sort by and in what direction.
 */
export interface SortDescriptor {
    /** The key of the column to sort by. */
    column: Key;
    /** The direction to sort by. */
    direction: SortDirection;
}
/**
 * Interface for sortable components.
 */
export interface Sortable {
    /** The current sorted column and direction. */
    sortDescriptor?: SortDescriptor;
    /** Handler that is called when the sorted column or direction changes. */
    onSortChange?: (descriptor: SortDescriptor) => void;
}
/**
 * A collection of table rows and columns.
 * Extends GridCollection with table-specific metadata.
 */
export interface TableCollection<T = unknown> extends GridCollection<T> {
    /** A list of header row nodes in the table. */
    readonly headerRows: GridNode<T>[];
    /** A list of column nodes in the table. */
    readonly columns: GridNode<T>[];
    /** A set of column keys that serve as the row header. */
    readonly rowHeaderColumnKeys: Set<Key>;
    /** The node that makes up the header of the table. */
    readonly head?: GridNode<T>;
    /** The node that makes up the body of the table. */
    readonly body: GridNode<T>;
}
/**
 * State for a table component.
 * Extends GridState with table-specific functionality.
 */
export interface TableState<T, C extends TableCollection<T> = TableCollection<T>> extends Omit<GridState<T, GridCollection<T>>, 'collection'> {
    /** The table collection. */
    readonly collection: C;
    /** Whether the row selection checkboxes should be displayed. */
    readonly showSelectionCheckboxes: boolean;
    /** The current sorted column and direction. */
    readonly sortDescriptor: SortDescriptor | null;
    /** Sort by the given column and direction. */
    sort(columnKey: Key, direction?: SortDirection): void;
}
/**
 * Options for creating table state.
 */
export interface TableStateOptions<T, C extends TableCollection<T> = TableCollection<T>> extends Sortable {
    /** The table collection. */
    collection: C;
    /** Keys of disabled rows. */
    disabledKeys?: Iterable<Key>;
    /** Focus mode: 'row' or 'cell'. */
    focusMode?: 'row' | 'cell';
    /** Selection mode. */
    selectionMode?: 'none' | 'single' | 'multiple';
    /** Selection behavior. */
    selectionBehavior?: 'toggle' | 'replace';
    /** Whether empty selection is disallowed. */
    disallowEmptySelection?: boolean;
    /** Currently selected keys (controlled). */
    selectedKeys?: 'all' | Iterable<Key>;
    /** Default selected keys (uncontrolled). */
    defaultSelectedKeys?: 'all' | Iterable<Key>;
    /** Handler for selection changes. */
    onSelectionChange?: (keys: 'all' | Set<Key>) => void;
    /** Whether the row selection checkboxes should be displayed. */
    showSelectionCheckboxes?: boolean;
}
/**
 * Column definition for building table collections.
 */
export interface ColumnDefinition<T = unknown> {
    /** The key for the column. */
    key: Key;
    /** The display name or rendered content. */
    name?: string;
    /** Text value for accessibility. */
    textValue?: string;
    /** Whether this column is a row header. */
    isRowHeader?: boolean;
    /** Whether this column allows sorting. */
    allowsSorting?: boolean;
    /** Child columns (for column groups). */
    children?: ColumnDefinition<T>[];
    /** Width of the column. */
    width?: number | string;
    /** Minimum width of the column. */
    minWidth?: number;
    /** Maximum width of the column. */
    maxWidth?: number;
}
/**
 * Row definition for building table collections.
 */
export interface RowDefinition<T = unknown> {
    /** The key for the row. */
    key: Key;
    /** The data value for the row. */
    value: T;
    /** Text value for accessibility/search. */
    textValue?: string;
    /** Whether this row has child rows (for tree tables). */
    hasChildRows?: boolean;
    /** Child rows (for tree tables). */
    childRows?: RowDefinition<T>[];
}
/**
 * Options for building a table collection.
 */
export interface TableCollectionOptions<T = unknown> {
    /** Column definitions. */
    columns: ColumnDefinition<T>[];
    /** Row definitions or data items. */
    rows: RowDefinition<T>[] | T[];
    /** Function to get the key from a data item. */
    getKey?: (item: T) => Key;
    /** Function to get the text value from a data item. */
    getTextValue?: (item: T, column: ColumnDefinition<T>) => string;
    /** Whether to show selection checkboxes. */
    showSelectionCheckboxes?: boolean;
    /** Set of column keys that serve as row headers. */
    rowHeaderColumnKeys?: Set<Key>;
}
//# sourceMappingURL=types.d.ts.map