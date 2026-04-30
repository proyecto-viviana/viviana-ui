/**
 * createTableCell - Provides accessibility for a table cell.
 * Based on @react-aria/table/useTableCell.
 */

import { createMemo, createSignal, type Accessor } from "solid-js";
import type { JSX } from "solid-js";
import type { TableState, TableCollection } from "@proyecto-viviana/solid-stately";
import type { AriaTableCellProps, TableCellAria } from "./types";
import { getTableData } from "./createTable";

/**
 * Creates accessibility props for a table cell.
 */
export function createTableCell<T extends object>(
  props: Accessor<AriaTableCellProps>,
  state: Accessor<TableState<T, TableCollection<T>>>,
  _ref: Accessor<HTMLTableCellElement | null>,
): TableCellAria {
  const [isPressed, setIsPressed] = createSignal(false);

  const isDisabled = createMemo(() => {
    const s = state();
    const p = props();
    // Check if parent row is disabled
    const node = p.node;
    if (node.parentKey != null) {
      return s.isDisabled(node.parentKey);
    }
    return false;
  });

  const isFocused = createMemo(() => {
    const s = state();
    const p = props();
    return s.focusedKey === p.node.key;
  });

  // Handle click for cell actions
  const onClick = () => {
    const s = state();
    const p = props();

    if (isDisabled()) return;

    // Get table metadata for actions
    const tableData = getTableData(s);
    const onCellAction = tableData?.actions.onCellAction;

    // Call cell action handler
    if (onCellAction) {
      onCellAction(p.node.key);
    }

    if (p.onAction) {
      p.onAction();
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const s = state();
    const p = props();

    if (isDisabled()) return;

    // Enter triggers cell action
    if (e.key === "Enter") {
      const tableData = getTableData(s);
      const onCellAction = tableData?.actions.onCellAction;

      if (onCellAction || p.onAction) {
        e.preventDefault();

        if (onCellAction) {
          onCellAction(p.node.key);
        }

        if (p.onAction) {
          p.onAction();
        }
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

  const gridCellProps = createMemo(() => {
    const s = state();
    const p = props();
    const node = p.node;
    const tableData = getTableData(s);

    // Determine the role based on node type
    let role: string = "gridcell";
    if (node.type === "rowheader") {
      role = "rowheader";
    }

    const baseProps: Record<string, unknown> = {
      role,
      id:
        tableData && node.parentKey != null
          ? `${tableData.tableId}-${node.parentKey}-${node.key}`
          : undefined,
      "aria-disabled": isDisabled() || undefined,
      tabIndex: isFocused() ? 0 : -1,
      onClick,
      onKeyDown,
      onFocus,
      onPointerDown,
      onPointerUp,
    };

    // Add aria-colindex for virtualized tables
    if (p.isVirtualized && node.column != null) {
      baseProps["aria-colindex"] = node.column + 1; // 1-based
    }

    // Add colspan if present
    if (node.colspan != null && node.colspan > 1) {
      baseProps["aria-colspan"] = node.colspan;
      baseProps.colSpan = node.colspan;
    }

    return baseProps as JSX.HTMLAttributes<HTMLTableCellElement>;
  });

  return {
    get gridCellProps() {
      return gridCellProps();
    },
    get isPressed() {
      return isPressed();
    },
  };
}
