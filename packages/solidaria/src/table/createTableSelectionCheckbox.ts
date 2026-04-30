/**
 * createTableSelectionCheckbox - Provides accessibility for a table row selection checkbox.
 * Based on @react-aria/table/useTableSelectionCheckbox.
 */

import { createMemo, type Accessor } from "solid-js";
import type { JSX } from "solid-js";
import { createId } from "@proyecto-viviana/solid-stately";
import type { TableState, TableCollection } from "@proyecto-viviana/solid-stately";
import type { AriaTableSelectionCheckboxProps, TableSelectionCheckboxAria } from "./types";

/**
 * Creates accessibility props for a table row selection checkbox.
 */
export function createTableSelectionCheckbox<T extends object>(
  props: Accessor<AriaTableSelectionCheckboxProps>,
  state: Accessor<TableState<T, TableCollection<T>>>,
): TableSelectionCheckboxAria {
  const checkboxId = createId();

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

  const onChange = () => {
    const s = state();
    const p = props();
    if (!isDisabled()) {
      s.toggleSelection(p.key);
    }
  };

  const checkboxProps = createMemo(() => {
    const baseProps: Record<string, unknown> = {
      id: checkboxId,
      type: "checkbox",
      checked: isSelected(),
      disabled: isDisabled(),
      onChange,
      "aria-label": "Select",
    };

    return baseProps as JSX.InputHTMLAttributes<HTMLInputElement>;
  });

  return {
    get checkboxProps() {
      return checkboxProps();
    },
  };
}
