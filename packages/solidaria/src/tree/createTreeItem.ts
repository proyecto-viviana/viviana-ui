/**
 * createTreeItem - Provides accessibility for a tree item.
 * Based on @react-aria/tree/useTreeItem.
 */

import { createMemo, createSignal, type Accessor } from 'solid-js';
import type { JSX } from 'solid-js';
import type { TreeState, TreeCollection } from '@proyecto-viviana/solid-stately';
import type { AriaTreeItemProps, TreeItemAria } from './types';
import { getTreeData } from './createTree';

/**
 * Creates accessibility props for a tree item.
 */
export function createTreeItem<T extends object, C extends TreeCollection<T> = TreeCollection<T>>(
  props: Accessor<AriaTreeItemProps<T>>,
  state: Accessor<TreeState<T, C>>,
  _ref: Accessor<HTMLDivElement | null>
): TreeItemAria {
  const [isPressed, setIsPressed] = createSignal(false);

  const isSelected = createMemo(() => {
    const s = state();
    const p = props();
    return s.isSelected(p.node.key);
  });

  const isDisabled = createMemo(() => {
    const s = state();
    const p = props();
    return s.isDisabled(p.node.key);
  });

  const isFocused = createMemo(() => {
    const s = state();
    const p = props();
    return s.focusedKey === p.node.key;
  });

  const isExpanded = createMemo(() => {
    const s = state();
    const p = props();
    return s.isExpanded(p.node.key);
  });

  const isExpandable = createMemo(() => {
    const p = props();
    return p.node.isExpandable ?? false;
  });

  const level = createMemo(() => {
    const p = props();
    return p.node.level;
  });

  // Handle click/press for selection and actions
  const onClick = (e: MouseEvent) => {
    const s = state();
    const p = props();

    if (isDisabled()) return;

    // Get tree metadata for actions
    const treeData = getTreeData(s);
    const onAction = treeData?.actions.onAction;

    // Handle selection
    if (s.selectionMode !== 'none') {
      if (e.shiftKey && s.selectionMode === 'multiple') {
        s.extendSelection(p.node.key);
      } else if (e.ctrlKey || e.metaKey) {
        s.toggleSelection(p.node.key);
      } else {
        // Replace selection or toggle if already selected
        if (isSelected() && s.selectedKeys !== 'all') {
          const selectedKeys = s.selectedKeys as Set<unknown>;
          if (selectedKeys.size === 1) {
            // Single selection, trigger action
            if (onAction) {
              onAction(p.node.key);
            }
            if (p.onAction) {
              p.onAction();
            }
          } else {
            s.replaceSelection(p.node.key);
          }
        } else {
          s.replaceSelection(p.node.key);
        }
      }
    } else {
      // No selection mode, just trigger action
      if (onAction) {
        onAction(p.node.key);
      }
      if (p.onAction) {
        p.onAction();
      }
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const s = state();
    const p = props();

    if (isDisabled()) return;

    if (e.key === 'Enter') {
      // Get tree metadata for actions
      const treeData = getTreeData(s);
      const onAction = treeData?.actions.onAction;

      if (onAction || p.onAction) {
        e.preventDefault();

        if (onAction) {
          onAction(p.node.key);
        }

        if (p.onAction) {
          p.onAction();
        }
      }
    } else if (e.key === ' ') {
      // Space toggles selection
      if (s.selectionMode !== 'none') {
        e.preventDefault();
        s.toggleSelection(p.node.key);
      }
    }
  };

  const onFocus = () => {
    const s = state();
    const p = props();
    s.setFocusedKey(p.node.key);
  };

  const onPointerDown = () => {
    setIsPressed(true);
  };

  const onPointerUp = () => {
    setIsPressed(false);
  };

  const rowProps = createMemo(() => {
    const s = state();
    const p = props();
    const node = p.node;

    const baseProps: Record<string, unknown> = {
      role: 'row',
      'aria-selected': s.selectionMode !== 'none' ? isSelected() : undefined,
      'aria-disabled': isDisabled() || undefined,
      'aria-expanded': isExpandable() ? isExpanded() : undefined,
      'aria-level': node.level + 1, // 1-based for ARIA
      tabIndex: isFocused() ? 0 : -1,
      onClick,
      onKeyDown,
      onFocus,
      onPointerDown,
      onPointerUp,
    };

    // Add aria-rowindex for virtualized trees
    if (p.isVirtualized && node.rowIndex != null) {
      baseProps['aria-rowindex'] = node.rowIndex + 1; // 1-based
    }

    return baseProps as JSX.HTMLAttributes<HTMLDivElement>;
  });

  const gridCellProps = createMemo(() => {
    return {
      role: 'gridcell',
    } as JSX.HTMLAttributes<HTMLDivElement>;
  });

  // Expand button handler
  const onExpandClick = (e: MouseEvent) => {
    e.stopPropagation(); // Don't trigger row click
    const s = state();
    const p = props();

    if (isDisabled()) return;

    s.toggleKey(p.node.key);
  };

  const expandButtonProps = createMemo(() => {
    const baseProps: Record<string, unknown> = {
      type: 'button',
      'aria-label': isExpanded() ? 'Collapse' : 'Expand',
      onClick: onExpandClick,
      tabIndex: -1, // Not in tab order, use arrow keys
      'aria-hidden': !isExpandable() ? true : undefined,
    };

    return baseProps as JSX.ButtonHTMLAttributes<HTMLButtonElement>;
  });

  return {
    get rowProps() {
      return rowProps();
    },
    get gridCellProps() {
      return gridCellProps();
    },
    get expandButtonProps() {
      return expandButtonProps();
    },
    get isSelected() {
      return isSelected();
    },
    get isDisabled() {
      return isDisabled();
    },
    get isPressed() {
      return isPressed();
    },
    get isExpanded() {
      return isExpanded();
    },
    get isExpandable() {
      return isExpandable();
    },
    get level() {
      return level();
    },
  };
}
