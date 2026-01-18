/**
 * createTableColumnHeader - Provides accessibility for a table column header.
 * Based on @react-aria/table/useTableColumnHeader.
 */

import { createMemo, createSignal, type Accessor } from 'solid-js';
import type { JSX } from 'solid-js';
import type { TableState, TableCollection } from '@proyecto-viviana/solid-stately';
import type { AriaTableColumnHeaderProps, TableColumnHeaderAria } from './types';
import { getTableData } from './createTable';

/**
 * Creates accessibility props for a table column header.
 */
export function createTableColumnHeader<T extends object>(
  props: Accessor<AriaTableColumnHeaderProps>,
  state: Accessor<TableState<T, TableCollection<T>>>,
  _ref: Accessor<HTMLTableCellElement | null>
): TableColumnHeaderAria {
  const [_isPressed, setIsPressed] = createSignal(false);

  const isFocused = createMemo(() => {
    const s = state();
    const p = props();
    return s.focusedKey === p.node.key;
  });

  // Handle click for sorting
  const onClick = () => {
    const s = state();
    const p = props();

    if (p.allowsSorting) {
      s.sort(p.node.key);
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const p = props();
    const s = state();

    if (p.allowsSorting && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      s.sort(p.node.key);
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

  const columnHeaderProps = createMemo(() => {
    const s = state();
    const p = props();
    const node = p.node;
    const tableData = getTableData(s);

    // Determine sort state
    let ariaSort: 'none' | 'ascending' | 'descending' | undefined = undefined;
    if (p.allowsSorting) {
      const sortDescriptor = s.sortDescriptor;
      if (sortDescriptor?.column === node.key) {
        ariaSort = sortDescriptor.direction;
      } else {
        ariaSort = 'none';
      }
    }

    const baseProps: Record<string, unknown> = {
      role: 'columnheader',
      id: tableData ? `${tableData.tableId}-${node.key}` : undefined,
      'aria-sort': ariaSort,
      tabIndex: isFocused() ? 0 : -1,
      onFocus,
    };

    // Add click handler if sortable
    if (p.allowsSorting) {
      baseProps.onClick = onClick;
      baseProps.onKeyDown = onKeyDown;
      baseProps.onPointerDown = onPointerDown;
      baseProps.onPointerUp = onPointerUp;
      baseProps.style = { cursor: 'pointer' };
    }

    // Add aria-colindex for virtualized tables
    if (p.isVirtualized && node.column != null) {
      baseProps['aria-colindex'] = node.column + 1; // 1-based
    }

    // Add colspan if present
    if (node.colspan != null && node.colspan > 1) {
      baseProps['aria-colspan'] = node.colspan;
      baseProps.colSpan = node.colspan;
    }

    return baseProps as JSX.HTMLAttributes<HTMLTableCellElement>;
  });

  return {
    get columnHeaderProps() {
      return columnHeaderProps();
    },
  };
}
