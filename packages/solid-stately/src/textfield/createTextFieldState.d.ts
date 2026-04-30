/**
 * TextField state for Solid Stately
 *
 * Provides state management for text input components.
 *
 * This is a port of @react-stately/utils's useControlledState pattern
 * as used by @react-aria/textfield.
 */
import { Accessor } from "solid-js";
import { type MaybeAccessor } from "../utils";
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
export declare function createTextFieldState(
  props?: MaybeAccessor<TextFieldStateOptions>,
): TextFieldState;
//# sourceMappingURL=createTextFieldState.d.ts.map
