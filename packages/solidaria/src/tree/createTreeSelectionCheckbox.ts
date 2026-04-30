/**
 * createTreeSelectionCheckbox - Provides accessibility for a tree item's selection checkbox.
 * Based on @react-aria/gridlist/useGridListSelectionCheckbox.
 */

import { createMemo, type Accessor } from "solid-js";
import type { JSX } from "solid-js";
import type { TreeState, TreeCollection } from "@proyecto-viviana/solid-stately";
import type { AriaTreeSelectionCheckboxProps, TreeSelectionCheckboxAria } from "./types";

/**
 * Creates accessibility props for a tree selection checkbox.
 */
export function createTreeSelectionCheckbox<
  T extends object,
  C extends TreeCollection<T> = TreeCollection<T>,
>(
  props: Accessor<AriaTreeSelectionCheckboxProps>,
  state: Accessor<TreeState<T, C>>,
): TreeSelectionCheckboxAria {
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

  const onChange = (e: Event) => {
    const s = state();
    const p = props();
    const target = e.target as HTMLInputElement;

    if (isDisabled()) return;

    if (target.checked) {
      s.toggleSelection(p.key);
    } else {
      s.toggleSelection(p.key);
    }
  };

  const onClick = (e: MouseEvent) => {
    // Stop propagation to prevent row click from also firing
    e.stopPropagation();
  };

  const checkboxProps = createMemo(() => {
    const baseProps: Record<string, unknown> = {
      type: "checkbox",
      "aria-label": "Select",
      checked: isSelected(),
      disabled: isDisabled(),
      onChange,
      onClick,
      tabIndex: -1, // Use arrow keys to navigate, not tab
    };

    return baseProps as JSX.InputHTMLAttributes<HTMLInputElement>;
  });

  return {
    get checkboxProps() {
      return checkboxProps();
    },
  };
}
