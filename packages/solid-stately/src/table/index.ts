/**
 * Table state management module.
 * Provides state hooks for Table components.
 */

export { createTableState } from './createTableState';
export { createTableColumnResizeState } from './createTableColumnResizeState';
export { TableCollection, createTableCollection } from './TableCollection';
export type {
  TableState,
  TableStateOptions,
  TableCollection as ITableCollection,
  SortDescriptor,
  SortDirection,
  Sortable,
  ColumnDefinition,
  RowDefinition,
  TableCollectionOptions,
} from './types';
export type {
  ColumnSize,
  ColumnResizeDefinition,
  TableColumnResizeStateProps,
  TableColumnResizeState,
} from './createTableColumnResizeState';
