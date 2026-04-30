/**
 * createTableRowGroup - Provides accessibility for a table row group.
 * Based on @react-aria/grid/useTableRowGroup.
 */

import { createMemo, type Accessor } from "solid-js";
import type { JSX } from "solid-js";
import type { AriaTableRowGroupProps, TableRowGroupAria } from "./types";

/**
 * Creates accessibility props for a table row group (thead, tbody, tfoot).
 */
export function createTableRowGroup(props: Accessor<AriaTableRowGroupProps>): TableRowGroupAria {
  const rowGroupProps = createMemo(() => {
    // Access props for reactivity tracking, even though not currently used
    void props();

    const baseProps: Record<string, unknown> = {
      role: "rowgroup",
    };

    return baseProps as JSX.HTMLAttributes<HTMLTableSectionElement>;
  });

  return {
    get rowGroupProps() {
      return rowGroupProps();
    },
  };
}
