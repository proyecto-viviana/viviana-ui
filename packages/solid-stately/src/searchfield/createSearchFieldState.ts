/**
 * Creates state for a search field component.
 * Based on @react-stately/searchfield useSearchFieldState.
 */

import { type Accessor, createSignal, createMemo } from "solid-js";
import { access, type MaybeAccessor } from "../utils";

export interface SearchFieldStateProps {
  /** The current value (controlled). */
  value?: string;
  /** The default value (uncontrolled). */
  defaultValue?: string;
  /** Handler that is called when the value changes. */
  onChange?: (value: string) => void;
}

export interface SearchFieldState {
  /** The current value of the search field. */
  value: Accessor<string>;
  /** Sets the value of the search field. */
  setValue: (value: string) => void;
}

/**
 * Provides state management for a search field.
 */
export function createSearchFieldState(
  props: MaybeAccessor<SearchFieldStateProps>,
): SearchFieldState {
  const getProps = () => access(props);

  // Controlled vs uncontrolled
  const isControlled = () => getProps().value !== undefined;

  // Internal signal for uncontrolled mode
  const [internalValue, setInternalValue] = createSignal(getProps().defaultValue ?? "");

  // Current value accessor
  const value = createMemo(() => {
    const p = getProps();
    return isControlled() ? (p.value ?? "") : internalValue();
  });

  // Set value function
  const setValue = (newValue: string) => {
    const p = getProps();

    if (!isControlled()) {
      setInternalValue(newValue);
    }

    p.onChange?.(newValue);
  };

  return {
    value,
    setValue,
  };
}
