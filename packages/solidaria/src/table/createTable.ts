/**
 * createTable - Provides accessibility for a table component.
 * Based on @react-aria/table/useTable.
 */

import { createMemo, createEffect, on, type Accessor } from 'solid-js';
import type { JSX } from 'solid-js';
import { createId } from '@proyecto-viviana/solid-stately';
import type { TableState, TableCollection, Key, GridNode } from '@proyecto-viviana/solid-stately';
import type { AriaTableProps, TableAria } from './types';
import { useLocale } from '../i18n';
import { announce } from '../live-announcer';

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
 * Helper to get cells from a row by iterating children
 */
function getChildCells<T>(collection: TableCollection<T>, rowKey: Key): GridNode<T>[] {
  const children = collection.getChildren(rowKey);
  return [...children].filter(node => node.type === 'cell' || node.type === 'rowheader');
}

/**
 * Helper to get cell at specific index in a row
 */
function getCellAtIndex<T>(collection: TableCollection<T>, rowKey: Key, index: number): GridNode<T> | null {
  const cells = getChildCells(collection, rowKey);
  return cells[index] ?? null;
}

/**
 * Helper to check if a node is a cell
 */
function isCell<T>(node: GridNode<T> | null): boolean {
  return node?.type === 'cell' || node?.type === 'rowheader';
}

/**
 * Helper to check if a node is a row
 */
function isRow<T>(node: GridNode<T> | null): boolean {
  return node?.type === 'item';
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
  const { direction } = useLocale();

  // Track previous sort descriptor for announcements
  let prevSortDescriptor: { column: Key; direction: 'ascending' | 'descending' } | null = null;
  let isFirstRender = true;

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

  // Announce sort changes (only after initial render)
  createEffect(on(
    () => state().sortDescriptor,
    (sortDescriptor) => {
      if (isFirstRender) {
        isFirstRender = false;
        prevSortDescriptor = sortDescriptor;
        return;
      }

      if (sortDescriptor && (
        sortDescriptor.column !== prevSortDescriptor?.column ||
        sortDescriptor.direction !== prevSortDescriptor?.direction
      )) {
        const collection = state().collection;
        const column = collection.columns.find(c => c.key === sortDescriptor.column);
        const columnName = column?.textValue ?? String(sortDescriptor.column);
        const directionText = sortDescriptor.direction === 'ascending' ? 'ascending' : 'descending';

        announce(`Sorted by ${columnName}, ${directionText}`, 'assertive', 500);
      }

      prevSortDescriptor = sortDescriptor;
    }
  ));

  // Keyboard navigation handler with full 2D navigation
  const onKeyDown = (e: KeyboardEvent) => {
    const s = state();
    const collection = s.collection;
    const p = props();
    const focusMode = p.focusMode ?? 'row';
    const isRTL = direction() === 'rtl';

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

    const focusedItem = collection.getItem(focusedKey);
    if (!focusedItem) return;

    let nextKey: Key | null = null;

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        // If focused on a cell, move to the same column in the next row
        if (isCell(focusedItem) && focusedItem.parentKey != null) {
          const nextRowKey = collection.getKeyAfter(focusedItem.parentKey);
          if (nextRowKey != null) {
            const cellIndex = focusedItem.index;
            const nextCell = getCellAtIndex(collection, nextRowKey, cellIndex);
            nextKey = nextCell?.key ?? nextRowKey;
          }
        } else {
          // Move to next row
          nextKey = collection.getKeyAfter(focusedKey);
        }
        break;
      }

      case 'ArrowUp': {
        e.preventDefault();
        // If focused on a cell, move to the same column in the previous row
        if (isCell(focusedItem) && focusedItem.parentKey != null) {
          const prevRowKey = collection.getKeyBefore(focusedItem.parentKey);
          if (prevRowKey != null) {
            const cellIndex = focusedItem.index;
            const prevCell = getCellAtIndex(collection, prevRowKey, cellIndex);
            nextKey = prevCell?.key ?? prevRowKey;
          }
        } else {
          // Move to previous row
          nextKey = collection.getKeyBefore(focusedKey);
        }
        break;
      }

      case 'ArrowRight': {
        e.preventDefault();
        const goNext = !isRTL;

        if (isRow(focusedItem)) {
          // If on a row, go to the first/last cell
          const cells = getChildCells(collection, focusedKey);
          if (cells.length > 0) {
            nextKey = goNext ? cells[0].key : cells[cells.length - 1].key;
          }
        } else if (isCell(focusedItem) && focusedItem.parentKey != null) {
          // If on a cell, go to the next/prev cell
          const cells = getChildCells(collection, focusedItem.parentKey);
          const currentIndex = focusedItem.index;
          const targetIndex = goNext ? currentIndex + 1 : currentIndex - 1;

          if (targetIndex >= 0 && targetIndex < cells.length) {
            nextKey = cells[targetIndex].key;
          } else if (focusMode === 'row') {
            // Wrap to row
            nextKey = focusedItem.parentKey;
          } else {
            // Wrap to first/last cell
            nextKey = goNext ? cells[0].key : cells[cells.length - 1].key;
          }
        }
        break;
      }

      case 'ArrowLeft': {
        e.preventDefault();
        const goNext = isRTL;

        if (isRow(focusedItem)) {
          // If on a row, go to the last/first cell
          const cells = getChildCells(collection, focusedKey);
          if (cells.length > 0) {
            nextKey = goNext ? cells[0].key : cells[cells.length - 1].key;
          }
        } else if (isCell(focusedItem) && focusedItem.parentKey != null) {
          // If on a cell, go to the prev/next cell
          const cells = getChildCells(collection, focusedItem.parentKey);
          const currentIndex = focusedItem.index;
          const targetIndex = goNext ? currentIndex + 1 : currentIndex - 1;

          if (targetIndex >= 0 && targetIndex < cells.length) {
            nextKey = cells[targetIndex].key;
          } else if (focusMode === 'row') {
            // Wrap to row
            nextKey = focusedItem.parentKey;
          } else {
            // Wrap to first/last cell
            nextKey = goNext ? cells[0].key : cells[cells.length - 1].key;
          }
        }
        break;
      }

      case 'Home': {
        e.preventDefault();
        if (e.ctrlKey) {
          // Ctrl+Home: Go to first row/cell
          const firstRowKey = collection.getFirstKey();
          if (firstRowKey != null) {
            if (isCell(focusedItem) || focusMode === 'cell') {
              const cells = getChildCells(collection, firstRowKey);
              nextKey = cells[0]?.key ?? firstRowKey;
            } else {
              nextKey = firstRowKey;
            }
          }
        } else if (isCell(focusedItem) && focusedItem.parentKey != null) {
          // Home: Go to first cell in current row
          const cells = getChildCells(collection, focusedItem.parentKey);
          nextKey = cells[0]?.key ?? null;
        } else {
          // On row: go to first row
          nextKey = collection.getFirstKey();
        }
        break;
      }

      case 'End': {
        e.preventDefault();
        if (e.ctrlKey) {
          // Ctrl+End: Go to last row/cell
          const lastRowKey = collection.getLastKey();
          if (lastRowKey != null) {
            if (isCell(focusedItem) || focusMode === 'cell') {
              const cells = getChildCells(collection, lastRowKey);
              nextKey = cells[cells.length - 1]?.key ?? lastRowKey;
            } else {
              nextKey = lastRowKey;
            }
          }
        } else if (isCell(focusedItem) && focusedItem.parentKey != null) {
          // End: Go to last cell in current row
          const cells = getChildCells(collection, focusedItem.parentKey);
          nextKey = cells[cells.length - 1]?.key ?? null;
        } else {
          // On row: go to last row
          nextKey = collection.getLastKey();
        }
        break;
      }

      case 'PageDown': {
        e.preventDefault();
        // Move down by roughly a page (using DOM measurements if available)
        const el = ref();
        if (el) {
          const visibleHeight = el.clientHeight;
          let currentKey: Key | null = focusedKey;
          let traveled = 0;

          // If on a cell, start from the parent row
          if (isCell(focusedItem) && focusedItem.parentKey != null) {
            currentKey = focusedItem.parentKey;
          }

          // Move down until we've traveled approximately one page
          while (currentKey != null && traveled < visibleHeight) {
            const next = collection.getKeyAfter(currentKey);
            if (next == null) break;

            // Estimate row height (default to 40px if we can't measure)
            const rowElement = el.querySelector(`[data-key="${currentKey}"]`);
            traveled += rowElement?.clientHeight ?? 40;
            currentKey = next;
          }

          if (currentKey != null) {
            // If we started on a cell, focus the same column in the new row
            if (isCell(focusedItem)) {
              const cellIndex = focusedItem.index;
              const targetCell = getCellAtIndex(collection, currentKey, cellIndex);
              nextKey = targetCell?.key ?? currentKey;
            } else {
              nextKey = currentKey;
            }
          }
        } else {
          // Fallback: move 10 rows
          let count = 10;
          let current: Key | null = isCell(focusedItem) && focusedItem.parentKey != null
            ? focusedItem.parentKey
            : focusedKey;
          while (count > 0 && current != null) {
            const next = collection.getKeyAfter(current);
            if (next == null) break;
            current = next;
            count--;
          }
          if (current != null && isCell(focusedItem)) {
            const targetCell = getCellAtIndex(collection, current, focusedItem.index);
            nextKey = targetCell?.key ?? current;
          } else {
            nextKey = current;
          }
        }
        break;
      }

      case 'PageUp': {
        e.preventDefault();
        // Move up by roughly a page
        const el = ref();
        if (el) {
          const visibleHeight = el.clientHeight;
          let currentKey: Key | null = focusedKey;
          let traveled = 0;

          // If on a cell, start from the parent row
          if (isCell(focusedItem) && focusedItem.parentKey != null) {
            currentKey = focusedItem.parentKey;
          }

          // Move up until we've traveled approximately one page
          while (currentKey != null && traveled < visibleHeight) {
            const prev = collection.getKeyBefore(currentKey);
            if (prev == null) break;

            const rowElement = el.querySelector(`[data-key="${currentKey}"]`);
            traveled += rowElement?.clientHeight ?? 40;
            currentKey = prev;
          }

          if (currentKey != null) {
            if (isCell(focusedItem)) {
              const cellIndex = focusedItem.index;
              const targetCell = getCellAtIndex(collection, currentKey, cellIndex);
              nextKey = targetCell?.key ?? currentKey;
            } else {
              nextKey = currentKey;
            }
          }
        } else {
          // Fallback: move 10 rows
          let count = 10;
          let current: Key | null = isCell(focusedItem) && focusedItem.parentKey != null
            ? focusedItem.parentKey
            : focusedKey;
          while (count > 0 && current != null) {
            const prev = collection.getKeyBefore(current);
            if (prev == null) break;
            current = prev;
            count--;
          }
          if (current != null && isCell(focusedItem)) {
            const targetCell = getCellAtIndex(collection, current, focusedItem.index);
            nextKey = targetCell?.key ?? current;
          } else {
            nextKey = current;
          }
        }
        break;
      }

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
          // For cells, select the parent row
          const keyToSelect = isCell(focusedItem) && focusedItem.parentKey != null
            ? focusedItem.parentKey
            : focusedKey;

          if (e.shiftKey && s.selectionMode === 'multiple') {
            s.extendSelection(keyToSelect);
          } else {
            s.toggleSelection(keyToSelect);
          }
        }
        return;

      default:
        return;
    }

    if (nextKey != null) {
      s.setFocusedKey(nextKey);

      // Handle shift+arrow for range selection
      if (e.shiftKey && s.selectionMode === 'multiple') {
        // For cells, select the parent row
        const focusedNode = collection.getItem(nextKey);
        const keyToSelect = focusedNode && isCell(focusedNode) && focusedNode.parentKey != null
          ? focusedNode.parentKey
          : nextKey;
        s.extendSelection(keyToSelect);
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
