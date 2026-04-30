/**
 * State management for NumberField.
 * Based on @react-stately/numberfield useNumberFieldState.
 */
import { type Accessor } from "solid-js";
import { type MaybeAccessor } from "../utils";
export interface NumberFieldStateProps {
  /** The current value (controlled). */
  value?: number;
  /** The default value (uncontrolled). */
  defaultValue?: number;
  /** Handler called when the value changes. */
  onChange?: (value: number) => void;
  /** The minimum value. */
  minValue?: number;
  /** The maximum value. */
  maxValue?: number;
  /** The step value for increment/decrement. */
  step?: number;
  /** Whether the field is disabled. */
  isDisabled?: boolean;
  /** Whether the field is read-only. */
  isReadOnly?: boolean;
  /** The locale for number formatting. */
  locale?: string;
  /** Number format options. */
  formatOptions?: Intl.NumberFormatOptions;
}
export interface NumberFieldState {
  /** The current input value as a string. */
  inputValue: Accessor<string>;
  /** The current numeric value. */
  numberValue: Accessor<number>;
  /** Whether the value can be incremented. */
  canIncrement: Accessor<boolean>;
  /** Whether the value can be decremented. */
  canDecrement: Accessor<boolean>;
  /** Whether the field is disabled. */
  isDisabled: Accessor<boolean>;
  /** Whether the field is read-only. */
  isReadOnly: Accessor<boolean>;
  /** The minimum value. */
  minValue: Accessor<number | undefined>;
  /** The maximum value. */
  maxValue: Accessor<number | undefined>;
  /** Set the input value. */
  setInputValue: (value: string) => void;
  /** Validate a partial input value. */
  validate: (value: string) => boolean;
  /** Commit the current input value. */
  commit: () => void;
  /** Increment the value by step. */
  increment: () => void;
  /** Decrement the value by step. */
  decrement: () => void;
  /** Set to maximum value. */
  incrementToMax: () => void;
  /** Set to minimum value. */
  decrementToMin: () => void;
}
/**
 * Creates state for a number field.
 */
export declare function createNumberFieldState(
  props: MaybeAccessor<NumberFieldStateProps>,
): NumberFieldState;
//# sourceMappingURL=createNumberFieldState.d.ts.map
