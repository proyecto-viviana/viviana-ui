/**
 * Toggle state for Solid Stately
 *
 * Provides state management for toggle components like checkboxes and switches.
 *
 * This is a 1:1 port of @react-stately/toggle's useToggleState.
 */

import { createSignal, Accessor } from "solid-js";
import { type MaybeAccessor, access } from "../utils";

export interface ToggleStateOptions {
  /** Whether the element should be selected (controlled). */
  isSelected?: boolean;
  /** Whether the element should be selected by default (uncontrolled). */
  defaultSelected?: boolean;
  /** Handler that is called when the element's selection state changes. */
  onChange?: (isSelected: boolean) => void;
  /** Whether the element is read only. */
  isReadOnly?: boolean;
}

export interface ToggleState {
  /** Whether the toggle is selected. */
  readonly isSelected: Accessor<boolean>;
  /** Whether the toggle is selected by default. */
  readonly defaultSelected: boolean;
  /** Updates selection state. */
  setSelected(isSelected: boolean): void;
  /** Toggle the selection state. */
  toggle(): void;
}

/**
 * Provides state management for toggle components like checkboxes and switches.
 */
export function createToggleState(props: MaybeAccessor<ToggleStateOptions> = {}): ToggleState {
  const getProps = () => access(props);

  const initialProps = getProps();
  const initialSelected = initialProps.isSelected ?? initialProps.defaultSelected ?? false;

  const [internalSelected, setInternalSelected] = createSignal(initialSelected);

  const isControlled = () => getProps().isSelected !== undefined;

  const isSelected: Accessor<boolean> = () => {
    const p = getProps();
    return isControlled() ? (p.isSelected ?? false) : internalSelected();
  };

  function setSelected(value: boolean): void {
    const p = getProps();
    if (p.isReadOnly) {
      return;
    }

    if (!isControlled()) {
      setInternalSelected(value);
    }

    p.onChange?.(value);
  }

  function toggle(): void {
    const p = getProps();
    if (p.isReadOnly) {
      return;
    }

    setSelected(!isSelected());
  }

  return {
    isSelected,
    defaultSelected: initialProps.defaultSelected ?? initialSelected,
    setSelected,
    toggle,
  };
}
