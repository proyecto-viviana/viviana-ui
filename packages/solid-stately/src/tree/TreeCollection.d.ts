/**
 * TreeCollection implementation.
 * Based on @react-stately/tree/TreeCollection.
 *
 * A flattened view of tree nodes that respects expanded state.
 * Only visible nodes (root + expanded children) are included in iteration.
 */
import type { Key } from '../collections/types';
import type { TreeCollection as ITreeCollection, TreeNode, TreeItemData } from './types';
/**
 * Creates a TreeCollection from hierarchical data.
 * The collection is flattened based on expanded keys.
 */
export declare class TreeCollection<T> implements ITreeCollection<T> {
    private keyMap;
    private visibleKeys;
    private _rows;
    constructor(items: TreeItemData<T>[], expandedKeys: Set<Key>);
    private buildCollection;
    get size(): number;
    get rows(): TreeNode<T>[];
    get rowCount(): number;
    getKeys(): Iterable<Key>;
    getItem(key: Key): TreeNode<T> | null;
    at(index: number): TreeNode<T> | null;
    getKeyBefore(key: Key): Key | null;
    getKeyAfter(key: Key): Key | null;
    getFirstKey(): Key | null;
    getLastKey(): Key | null;
    getChildren(key: Key): Iterable<TreeNode<T>>;
    getTextValue(key: Key): string;
    getParentKey(key: Key): Key | null;
    [Symbol.iterator](): Iterator<TreeNode<T>>;
}
/**
 * Factory function to create a TreeCollection.
 * Useful for the collectionFactory pattern in TreeStateOptions.
 */
export declare function createTreeCollection<T>(items: TreeItemData<T>[], expandedKeys: Set<Key>): TreeCollection<T>;
//# sourceMappingURL=TreeCollection.d.ts.map