/**
 * createGridRow - Provides accessibility for a grid row.
 * Based on @react-aria/grid/useGridRow.
 */

import { createMemo, createSignal, type Accessor } from "solid-js";
import type { JSX } from "solid-js";
import type { GridState, GridCollection } from "@proyecto-viviana/solid-stately";
import type { GridRowProps, GridRowAria } from "./types";
import { getGridData } from "./createGrid";

/**
 * Creates accessibility props for a grid row.
 */
export function createGridRow<T extends object>(
  props: Accessor<GridRowProps>,
  state: Accessor<GridState<T, GridCollection<T>>>,
  _ref: Accessor<HTMLElement | null>,
): GridRowAria {
  const [isPressed, setIsPressed] = createSignal(false);

  const isSelected = createMemo(() => {
    const s = state();
    const p = props();
    return s.isSelected(p.key);
  });

  const isDisabled = createMemo(() => {
    const s = state();
    const p = props();
    return s.isDisabled(p.key);
  });

  const isFocused = createMemo(() => {
    const s = state();
    const p = props();
    return s.focusedKey === p.key;
  });

  // Handle click/press for selection
  const onClick = (e: MouseEvent) => {
    const s = state();
    const p = props();

    if (isDisabled()) return;

    // Get grid metadata for actions
    const gridData = getGridData(s);
    const onRowAction = gridData?.actions.onRowAction;

    // Handle selection
    if (s.selectionMode !== "none") {
      if (e.shiftKey && s.selectionMode === "multiple") {
        s.extendSelection(p.key);
      } else if (e.ctrlKey || e.metaKey) {
        s.toggleSelection(p.key);
      } else {
        // Replace selection
        s.replaceSelection(p.key);
      }
    }

    // Call action handler
    if (onRowAction) {
      onRowAction(p.key);
    }

    if (p.onAction) {
      p.onAction();
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const s = state();
    const p = props();

    if (isDisabled()) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      // Get grid metadata for actions
      const gridData = getGridData(s);
      const onRowAction = gridData?.actions.onRowAction;

      // Handle selection
      if (s.selectionMode !== "none") {
        s.toggleSelection(p.key);
      }

      // Call action handler
      if (onRowAction) {
        onRowAction(p.key);
      }

      if (p.onAction) {
        p.onAction();
      }
    }
  };

  const onFocus = () => {
    const s = state();
    const p = props();
    s.setFocusedKey(p.key);
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

    const baseProps: Record<string, unknown> = {
      role: "row",
      "aria-selected": s.selectionMode !== "none" ? isSelected() : undefined,
      "aria-disabled": isDisabled() || undefined,
      tabIndex: isFocused() ? 0 : -1,
      onClick,
      onKeyDown,
      onFocus,
      onPointerDown,
      onPointerUp,
    };

    if (p.isVirtualized && p.index != null) {
      baseProps["aria-rowindex"] = p.index + 1; // aria-rowindex is 1-based
    }

    return baseProps as JSX.HTMLAttributes<HTMLElement>;
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
