/**
 * createTableRow - Provides accessibility for a table row.
 * Based on @react-aria/table/useTableRow.
 */

import { createMemo, createSignal, type Accessor } from 'solid-js';
import type { JSX } from 'solid-js';
import type { TableState, TableCollection } from '@proyecto-viviana/solid-stately';
import type { AriaTableRowProps, TableRowAria } from './types';
import { getTableData } from './createTable';

/**
 * Creates accessibility props for a table row.
 */
export function createTableRow<T extends object>(
  props: Accessor<AriaTableRowProps>,
  state: Accessor<TableState<T, TableCollection<T>>>,
  _ref: Accessor<HTMLTableRowElement | null>
): TableRowAria {
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

  // Handle click/press for selection
  const onClick = (e: MouseEvent) => {
    const s = state();
    const p = props();

    if (isDisabled()) return;

    // Get table metadata for actions
    const tableData = getTableData(s);
    const onRowAction = tableData?.actions.onRowAction;

    // Handle selection
    if (s.selectionMode !== 'none') {
      if (e.shiftKey && s.selectionMode === 'multiple') {
        s.extendSelection(p.node.key);
      } else if (e.ctrlKey || e.metaKey) {
        s.toggleSelection(p.node.key);
      } else {
        // Replace selection
        s.replaceSelection(p.node.key);
      }
    }

    // Call action handler
    if (onRowAction) {
      onRowAction(p.node.key);
    }

    if (p.onAction) {
      p.onAction();
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const s = state();
    const p = props();

    if (isDisabled()) return;

    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Space' || e.key === 'Spacebar') {
      e.preventDefault();

      // Get table metadata for actions
      const tableData = getTableData(s);
      const onRowAction = tableData?.actions.onRowAction;

      // Handle selection
      if (s.selectionMode !== 'none') {
        s.toggleSelection(p.node.key);
      }

      // Call action handler
      if (onRowAction) {
        onRowAction(p.node.key);
      }

      if (p.onAction) {
        p.onAction();
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
      tabIndex: isFocused() ? 0 : -1,
      onClick,
      onKeyDown,
      onFocus,
      onPointerDown,
      onPointerUp,
    };

    // Add aria-rowindex for virtualized tables
    if (p.isVirtualized && node.rowIndex != null) {
      baseProps['aria-rowindex'] = node.rowIndex + 1; // 1-based
    }

    return baseProps as JSX.HTMLAttributes<HTMLTableRowElement>;
  });

  return {
    get rowProps() {
      return rowProps();
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
  };
}
