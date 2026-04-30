/**
 * createTableHeaderRow - Provides accessibility for a table header row.
 * Based on @react-aria/table/useTableHeaderRow.
 */

import { createMemo, type Accessor } from "solid-js";
import type { JSX } from "solid-js";
import type { TableState, TableCollection } from "@proyecto-viviana/solid-stately";
import type { AriaTableHeaderRowProps, TableHeaderRowAria } from "./types";

/**
 * Creates accessibility props for a table header row.
 */
export function createTableHeaderRow<T extends object>(
  props: Accessor<AriaTableHeaderRowProps>,
  _state: Accessor<TableState<T, TableCollection<T>>>,
  _ref: Accessor<HTMLTableRowElement | null>,
): TableHeaderRowAria {
  const rowProps = createMemo(() => {
    const p = props();
    const node = p.node;

    const baseProps: Record<string, unknown> = {
      role: "row",
    };

    // Add aria-rowindex for virtualized tables
    if (p.isVirtualized && node.rowIndex != null) {
      baseProps["aria-rowindex"] = node.rowIndex + 1; // 1-based
    }

    return baseProps as JSX.HTMLAttributes<HTMLTableRowElement>;
  });

  return {
    get rowProps() {
      return rowProps();
    },
  };
}
