/**
 * createTree - Provides accessibility for a tree component.
 * Based on @react-aria/tree/useTree.
 */

import { createMemo, type Accessor } from 'solid-js';
import type { JSX } from 'solid-js';
import { createId } from '@proyecto-viviana/solid-stately';
import type { TreeState, TreeCollection, Key } from '@proyecto-viviana/solid-stately';
import type { AriaTreeProps, TreeAria } from './types';

/**
 * Metadata stored for a tree instance.
 */
interface TreeData {
  /** The generated ID for the tree. */
  treeId: string;
  /** Actions registered for the tree. */
  actions: {
    onAction?: (key: Key) => void;
  };
}

/**
 * WeakMap to store tree data for child components to access.
 */
const treeDataMap = new WeakMap<object, TreeData>();

/**
 * Gets the tree data for a given state.
 */
export function getTreeData<T extends object, C extends TreeCollection<T>>(
  state: TreeState<T, C>
): TreeData | undefined {
  return treeDataMap.get(state);
}

/**
 * Creates accessibility props for a tree.
 */
export function createTree<T extends object, C extends TreeCollection<T> = TreeCollection<T>>(
  props: Accessor<AriaTreeProps>,
  state: Accessor<TreeState<T, C>>,
  _ref: Accessor<HTMLDivElement | null>
): TreeAria {
  // Generate a unique ID for the tree
  const treeId = props().id ?? createId();

  // Store tree data for child components
  const treeData: TreeData = {
    treeId,
    actions: {
      get onAction() {
        return props().onAction;
      },
    },
  };

  // Store in WeakMap using the state as key
  treeDataMap.set(state(), treeData);

  // Handle keyboard navigation
  const onKeyDown = (e: KeyboardEvent) => {
    const s = state();
    const p = props();
    const collection = s.collection;
    const focusedKey = s.focusedKey;

    if (p.isDisabled) return;

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        if (focusedKey != null) {
          const nextKey = collection.getKeyAfter(focusedKey);
          if (nextKey != null) {
            s.setFocusedKey(nextKey);
          }
        } else {
          const firstKey = collection.getFirstKey();
          if (firstKey != null) {
            s.setFocusedKey(firstKey);
          }
        }
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        if (focusedKey != null) {
          const prevKey = collection.getKeyBefore(focusedKey);
          if (prevKey != null) {
            s.setFocusedKey(prevKey);
          }
        } else {
          const lastKey = collection.getLastKey();
          if (lastKey != null) {
            s.setFocusedKey(lastKey);
          }
        }
        break;
      }
      case 'ArrowRight': {
        e.preventDefault();
        if (focusedKey != null) {
          const node = collection.getItem(focusedKey);
          if (node?.isExpandable) {
            if (!s.isExpanded(focusedKey)) {
              // Expand the node
              s.expandKey(focusedKey);
            } else {
              // Move to first child
              const children = [...collection.getChildren(focusedKey)];
              if (children.length > 0) {
                s.setFocusedKey(children[0].key);
              }
            }
          }
        }
        break;
      }
      case 'ArrowLeft': {
        e.preventDefault();
        if (focusedKey != null) {
          const node = collection.getItem(focusedKey);
          if (node?.isExpandable && s.isExpanded(focusedKey)) {
            // Collapse the node
            s.collapseKey(focusedKey);
          } else if (node?.parentKey != null) {
            // Move to parent
            s.setFocusedKey(node.parentKey);
          }
        }
        break;
      }
      case 'Home': {
        e.preventDefault();
        const firstKey = collection.getFirstKey();
        if (firstKey != null) {
          s.setFocusedKey(firstKey);
        }
        break;
      }
      case 'End': {
        e.preventDefault();
        const lastKey = collection.getLastKey();
        if (lastKey != null) {
          s.setFocusedKey(lastKey);
        }
        break;
      }
      case 'a':
      case 'A': {
        if ((e.ctrlKey || e.metaKey) && s.selectionMode === 'multiple') {
          e.preventDefault();
          s.selectAll();
        }
        break;
      }
      case 'Escape': {
        if (s.selectionMode !== 'none') {
          e.preventDefault();
          s.clearSelection();
        }
        break;
      }
      case '*': {
        // Expand all siblings at current level
        e.preventDefault();
        if (focusedKey != null) {
          const node = collection.getItem(focusedKey);
          if (node) {
            // Find all siblings at the same level
            const parentKey = node.parentKey;
            let siblings: Key[];
            if (parentKey != null) {
              siblings = [...collection.getChildren(parentKey)].map((n) => n.key);
            } else {
              // Root level siblings
              siblings = collection.rows
                .filter((n) => n.level === 0)
                .map((n) => n.key);
            }
            // Expand all expandable siblings
            for (const siblingKey of siblings) {
              const sibling = collection.getItem(siblingKey);
              if (sibling?.isExpandable && !s.isExpanded(siblingKey)) {
                s.expandKey(siblingKey);
              }
            }
          }
        }
        break;
      }
    }
  };

  const onFocus = () => {
    const s = state();
    s.setFocused(true);

    // If nothing is focused, focus the first item
    if (s.focusedKey == null) {
      const firstKey = s.collection.getFirstKey();
      if (firstKey != null) {
        s.setFocusedKey(firstKey);
      }
    }
  };

  const onBlur = () => {
    const s = state();
    s.setFocused(false);
  };

  const treeProps = createMemo(() => {
    const p = props();
    const s = state();

    const baseProps: Record<string, unknown> = {
      role: 'treegrid',
      id: treeId,
      'aria-label': p['aria-label'],
      'aria-labelledby': p['aria-labelledby'],
      'aria-describedby': p['aria-describedby'],
      'aria-multiselectable': s.selectionMode === 'multiple' ? true : undefined,
      'aria-disabled': p.isDisabled || undefined,
      tabIndex: p.isDisabled ? undefined : 0,
      onKeyDown,
      onFocus,
      onBlur,
    };

    // Add row count for virtualized trees
    if (p.isVirtualized) {
      baseProps['aria-rowcount'] = s.collection.rowCount;
    }

    return baseProps as JSX.HTMLAttributes<HTMLDivElement>;
  });

  return {
    get treeProps() {
      return treeProps();
    },
  };
}
