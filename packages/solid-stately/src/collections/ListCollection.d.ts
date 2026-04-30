/**
 * A simple list collection implementation.
 * Provides a Collection interface over an array of nodes.
 */
import type { Collection, CollectionNode, Key } from "./types";
/**
 * A basic implementation of Collection for list-based components.
 */
export declare class ListCollection<T = unknown> implements Collection<T> {
  private nodes;
  private keyMap;
  constructor(nodes: CollectionNode<T>[]);
  get size(): number;
  [Symbol.iterator](): Iterator<CollectionNode<T>>;
  getKeys(): Iterable<Key>;
  getItem(key: Key): CollectionNode<T> | null;
  at(index: number): CollectionNode<T> | null;
  getKeyBefore(key: Key): Key | null;
  getKeyAfter(key: Key): Key | null;
  getFirstKey(): Key | null;
  getLastKey(): Key | null;
  getChildren(key: Key): Iterable<CollectionNode<T>>;
  getTextValue(key: Key): string;
  /**
   * Get all items (excluding sections, including items within sections).
   */
  private getAllItems;
}
/**
 * Create a collection from an array of items.
 */
export declare function createListCollection<T>(
  items: T[],
  options?: {
    getKey?: (item: T, index: number) => Key;
    getTextValue?: (item: T) => string;
    getDisabled?: (item: T) => boolean;
  },
): ListCollection<T>;
//# sourceMappingURL=ListCollection.d.ts.map
