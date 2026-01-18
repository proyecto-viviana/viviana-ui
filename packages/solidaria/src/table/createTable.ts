/**
 * createTable - Provides accessibility for a table component.
 * Based on @react-aria/table/useTable.
 */

import { createMemo, type Accessor } from 'solid-js';
import type { JSX } from 'solid-js';
import { createId } from '@proyecto-viviana/solid-stately';
import type { TableState, TableCollection, Key } from '@proyecto-viviana/solid-stately';
import type { AriaTableProps, TableAria } from './types';

// Global map to store table metadata for child components
const tableMap = new WeakMap<
  object,
  {
    tableId: string;
    actions: { onRowAction?: (key: Key) => void; onCellAction?: (key: Key) => void };
    shouldSelectOnPressUp?: boolean;
    focusMode?: 'row' | 'cell';
  }
>();

/**
 * Get the table metadata for child components.
 */
export function getTableData<T>(state: TableState<T, TableCollection<T>>) {
  return tableMap.get(state);
}

/**
 * Creates accessibility props for a table component.
 */
export function createTable<T extends object>(
  props: Accessor<AriaTableProps>,
  state: Accessor<TableState<T, TableCollection<T>>>,
  ref: Accessor<HTMLTableElement | null>
): TableAria {
  const id = createId(props().id);

  // Store metadata for child components
  const storeTableData = () => {
    const s = state();
    const p = props();
    tableMap.set(s, {
      tableId: id,
      actions: {
        onRowAction: p.onRowAction,
        onCellAction: p.onCellAction,
      },
      shouldSelectOnPressUp: p.shouldSelectOnPressUp,
      focusMode: p.focusMode,
    });
  };

  // Update table data whenever props/state changes
  createMemo(() => {
    storeTableData();
  });

  // Keyboard navigation handler
  const onKeyDown = (e: KeyboardEvent) => {
    const s = state();
    const collection = s.collection;

    if (s.isKeyboardNavigationDisabled) {
      return;
    }

    const focusedKey = s.focusedKey;
    if (focusedKey == null) {
      // If nothing is focused, focus the first item
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Home' || e.key === 'End') {
        const firstKey = collection.getFirstKey();
        if (firstKey != null) {
          e.preventDefault();
          s.setFocusedKey(firstKey);
        }
      }
      return;
    }

    let nextKey: Key | null = null;

    switch (e.key) {
      case 'ArrowDown':
        nextKey = collection.getKeyAfter(focusedKey);
        break;
      case 'ArrowUp':
        nextKey = collection.getKeyBefore(focusedKey);
        break;
      case 'Home':
        if (e.ctrlKey) {
          nextKey = collection.getFirstKey();
        }
        break;
      case 'End':
        if (e.ctrlKey) {
          nextKey = collection.getLastKey();
        }
        break;
      case 'Escape':
        s.clearSelection();
        return;
      case 'a':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          if (s.selectionMode === 'multiple') {
            s.selectAll();
          }
        }
        return;
      case ' ':
      case 'Enter':
        e.preventDefault();
        // Toggle selection or trigger action
        if (s.selectionMode !== 'none') {
          if (e.shiftKey && s.selectionMode === 'multiple') {
            s.extendSelection(focusedKey);
          } else {
            s.toggleSelection(focusedKey);
          }
        }
        return;
      default:
        return;
    }

    if (nextKey != null) {
      e.preventDefault();
      s.setFocusedKey(nextKey);

      // Handle shift+arrow for range selection
      if (e.shiftKey && s.selectionMode === 'multiple') {
        s.extendSelection(nextKey);
      }
    }
  };

  // Focus handling
  const onFocus = (e: FocusEvent) => {
    const s = state();
    const el = ref();

    if (!el?.contains(e.target as Element)) {
      return;
    }

    if (!s.isFocused) {
      s.setFocused(true);

      // If no key is focused, focus the first one
      if (s.focusedKey == null) {
        const firstKey = s.collection.getFirstKey();
        if (firstKey != null) {
          s.setFocusedKey(firstKey);
        }
      }
    }
  };

  const onBlur = (e: FocusEvent) => {
    const s = state();
    const el = ref();

    // Only blur if focus is leaving the table entirely
    if (el && !el.contains(e.relatedTarget as Element)) {
      s.setFocused(false);
    }
  };

  // Warn if no label is provided
  createMemo(() => {
    const p = props();
    if (!p['aria-label'] && !p['aria-labelledby']) {
      console.warn('Table: An aria-label or aria-labelledby prop is required for accessibility.');
    }
  });

  const gridProps = createMemo(() => {
    const p = props();
    const s = state();

    const baseProps: Record<string, unknown> = {
      role: 'grid',
      id,
      'aria-label': p['aria-label'],
      'aria-labelledby': p['aria-labelledby'],
      'aria-describedby': p['aria-describedby'],
      'aria-multiselectable': s.selectionMode === 'multiple' ? 'true' : undefined,
      tabIndex: s.collection.size === 0 ? 0 : -1,
      onKeyDown,
      onFocus,
      onBlur,
    };

    if (p.isVirtualized) {
      baseProps['aria-rowcount'] = s.collection.rowCount;
      baseProps['aria-colcount'] = s.collection.columnCount;
    }

    return baseProps as JSX.HTMLAttributes<HTMLTableElement>;
  });

  return {
    get gridProps() {
      return gridProps();
    },
  };
}
