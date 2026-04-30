/**
 * Table state management for Table components.
 * Based on @react-stately/table/useTableState.
 */
import { type Accessor } from "solid-js";
import type { TableState, TableStateOptions, TableCollection } from "./types";
/**
 * Creates state management for a table component.
 * Extends grid state with sorting and table-specific features.
 */
export declare function createTableState<
  T extends object,
  C extends TableCollection<T> = TableCollection<T>,
>(options: Accessor<TableStateOptions<T, C>>): TableState<T, C>;
//# sourceMappingURL=createTableState.d.ts.map
