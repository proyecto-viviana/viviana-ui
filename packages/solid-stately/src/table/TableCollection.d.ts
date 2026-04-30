/**
 * TableCollection - A collection class for table data.
 * Based on @react-stately/table/TableCollection.
 */
import type { Key } from "../collections/types";
import type { GridNode } from "../grid/types";
import type { TableCollection as ITableCollection, TableCollectionOptions } from "./types";
/**
 * Creates a table collection from column and row definitions.
 */
export declare class TableCollection<T = unknown> implements ITableCollection<T> {
  private _columns;
  private _rows;
  private _headerRows;
  private _body;
  private _head;
  private _keyMap;
  private _rowHeaderColumnKeys;
  private _size;
  constructor(options: TableCollectionOptions<T>);
  private buildColumns;
  private buildColumnNode;
  private getDefaultRowHeaderColumnKeys;
  private buildHeaderRows;
  private buildRows;
  private isRowDefinition;
  get size(): number;
  get rows(): GridNode<T>[];
  get columns(): GridNode<T>[];
  get headerRows(): GridNode<T>[];
  get head(): GridNode<T> | undefined;
  get body(): GridNode<T>;
  get rowCount(): number;
  get columnCount(): number;
  get rowHeaderColumnKeys(): Set<Key>;
  getKeys(): Iterable<Key>;
  getItem(key: Key): GridNode<T> | null;
  at(index: number): GridNode<T> | null;
  getChildren(key: Key): Iterable<GridNode<T>>;
  getTextValue(key: Key): string;
  getCell(rowKey: Key, columnKey: Key): GridNode<T> | null;
  getFirstKey(): Key | null;
  getLastKey(): Key | null;
  getKeyBefore(key: Key): Key | null;
  getKeyAfter(key: Key): Key | null;
  [Symbol.iterator](): Iterator<GridNode<T>>;
}
/**
 * Creates a table collection from options.
 */
export declare function createTableCollection<T>(
  options: TableCollectionOptions<T>,
): TableCollection<T>;
//# sourceMappingURL=TableCollection.d.ts.map
