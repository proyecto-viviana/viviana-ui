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
export class TreeCollection<T> implements ITreeCollection<T> {
  private keyMap: Map<Key, TreeNode<T>> = new Map();
  private visibleKeys: Key[] = [];
  private _rows: TreeNode<T>[] = [];

  constructor(
    items: TreeItemData<T>[],
    expandedKeys: Set<Key>
  ) {
    this.buildCollection(items, expandedKeys);
  }

  private buildCollection(items: TreeItemData<T>[], expandedKeys: Set<Key>): void {
    let globalIndex = 0;

    const visit = (
      item: TreeItemData<T>,
      level: number,
      parentKey: Key | null,
      indexInParent: number
    ): TreeNode<T> => {
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = hasChildren && expandedKeys.has(item.key);

      // Build child nodes first (even if not visible, for the map)
      const childNodes: TreeNode<T>[] = [];
      if (hasChildren && item.children) {
        for (let i = 0; i < item.children.length; i++) {
          const childNode = visit(item.children[i], level + 1, item.key, i);
          childNodes.push(childNode);
        }
      }

      const node: TreeNode<T> = {
        type: 'item',
        key: item.key,
        value: item.value,
        textValue: item.textValue || String(item.key),
        level,
        index: indexInParent,
        parentKey,
        hasChildNodes: hasChildren || false,
        childNodes,
        isDisabled: item.isDisabled,
        isExpandable: hasChildren,
        isExpanded,
      };

      // Always add to keyMap (for getItem lookups)
      this.keyMap.set(item.key, node);

      return node;
    };

    // First pass: build all nodes
    const rootNodes: TreeNode<T>[] = [];
    for (let i = 0; i < items.length; i++) {
      const node = visit(items[i], 0, null, i);
      rootNodes.push(node);
    }

    // Second pass: build visible rows list
    const addVisibleNodes = (nodes: TreeNode<T>[]): void => {
      for (const node of nodes) {
        // Update the row index for visible nodes
        node.rowIndex = globalIndex++;
        this._rows.push(node);
        this.visibleKeys.push(node.key);

        // Add children if expanded
        if (node.isExpanded && node.childNodes.length > 0) {
          addVisibleNodes(node.childNodes);
        }
      }
    };

    addVisibleNodes(rootNodes);
  }

  // Collection properties

  get size(): number {
    return this.visibleKeys.length;
  }

  get rows(): TreeNode<T>[] {
    return this._rows;
  }

  get rowCount(): number {
    return this._rows.length;
  }

  // Collection methods

  getKeys(): Iterable<Key> {
    return this.visibleKeys;
  }

  getItem(key: Key): TreeNode<T> | null {
    return this.keyMap.get(key) ?? null;
  }

  at(index: number): TreeNode<T> | null {
    if (index < 0 || index >= this._rows.length) {
      return null;
    }
    return this._rows[index];
  }

  getKeyBefore(key: Key): Key | null {
    const index = this.visibleKeys.indexOf(key);
    if (index <= 0) return null;
    return this.visibleKeys[index - 1];
  }

  getKeyAfter(key: Key): Key | null {
    const index = this.visibleKeys.indexOf(key);
    if (index < 0 || index >= this.visibleKeys.length - 1) return null;
    return this.visibleKeys[index + 1];
  }

  getFirstKey(): Key | null {
    return this.visibleKeys[0] ?? null;
  }

  getLastKey(): Key | null {
    return this.visibleKeys[this.visibleKeys.length - 1] ?? null;
  }

  getChildren(key: Key): Iterable<TreeNode<T>> {
    const node = this.keyMap.get(key);
    return node?.childNodes ?? [];
  }

  getTextValue(key: Key): string {
    const node = this.keyMap.get(key);
    return node?.textValue ?? '';
  }

  getParentKey(key: Key): Key | null {
    const node = this.keyMap.get(key);
    return node?.parentKey ?? null;
  }

  [Symbol.iterator](): Iterator<TreeNode<T>> {
    return this._rows[Symbol.iterator]();
  }
}

/**
 * Factory function to create a TreeCollection.
 * Useful for the collectionFactory pattern in TreeStateOptions.
 */
export function createTreeCollection<T>(
  items: TreeItemData<T>[],
  expandedKeys: Set<Key>
): TreeCollection<T> {
  return new TreeCollection(items, expandedKeys);
}
