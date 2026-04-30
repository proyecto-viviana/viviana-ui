/**
 * TextField state for Solid Stately
 *
 * Provides state management for text input components.
 *
 * This is a port of @react-stately/utils's useControlledState pattern
 * as used by @react-aria/textfield.
 */

import { createSignal, Accessor } from "solid-js";
import { type MaybeAccessor, access } from "../utils";

export interface TextFieldStateOptions {
  /** The current value (controlled). */
  value?: string;
  /** The default value (uncontrolled). */
  defaultValue?: string;
  /** Handler that is called when the value changes. */
  onChange?: (value: string) => void;
}

export interface TextFieldState {
  /** The current value of the text field. */
  readonly value: Accessor<string>;
  /** Sets the value of the text field. */
  setValue(value: string): void;
}

/**
 * Provides state management for text input components.
 * Supports both controlled and uncontrolled modes.
 */
export function createTextFieldState(
  props: MaybeAccessor<TextFieldStateOptions> = {},
): TextFieldState {
  const getProps = () => access(props);

  // Get initial value
  const initialProps = getProps();
  const initialValue = initialProps.value ?? initialProps.defaultValue ?? "";

  // Create internal signal for uncontrolled mode
  const [internalValue, setInternalValue] = createSignal(initialValue);

  // Determine if controlled
  const isControlled = () => getProps().value !== undefined;

  // Get current value
  const value: Accessor<string> = () => {
    const p = getProps();
    return isControlled() ? (p.value ?? "") : internalValue();
  };

  // Update value
  function setValue(newValue: string): void {
    const p = getProps();

    if (!isControlled()) {
      setInternalValue(newValue);
    }

    p.onChange?.(newValue);
  }

  return {
    value,
    setValue,
  };
}
