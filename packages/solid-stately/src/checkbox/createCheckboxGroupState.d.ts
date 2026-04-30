/**
 * Checkbox group state for Solid Stately
 *
 * Provides state management for a checkbox group component.
 * Provides a name for the group, and manages selection and focus state.
 *
 * This is a 1:1 port of @react-stately/checkbox's useCheckboxGroupState.
 */
import { Accessor } from "solid-js";
import { type MaybeAccessor } from "../utils";
export interface CheckboxGroupProps {
  /** The current selected values (controlled). */
  value?: string[];
  /** The default selected values (uncontrolled). */
  defaultValue?: string[];
  /** Handler that is called when the value changes. */
  onChange?: (value: string[]) => void;
  /** Whether the checkbox group is disabled. */
  isDisabled?: boolean;
  /** Whether the checkbox group is read only. */
  isReadOnly?: boolean;
  /** Whether the checkbox group is required. */
  isRequired?: boolean;
  /** Whether the checkbox group is invalid. */
  isInvalid?: boolean;
  /** The name of the checkbox group, used when submitting an HTML form. */
  name?: string;
  /** The form to associate the checkbox group with. */
  form?: string;
  /** The label for the checkbox group. */
  label?: string;
  /** Handler that is called when the checkbox group receives focus. */
  onFocus?: (e: FocusEvent) => void;
  /** Handler that is called when the checkbox group loses focus. */
  onBlur?: (e: FocusEvent) => void;
  /** Handler that is called when the checkbox group's focus status changes. */
  onFocusChange?: (isFocused: boolean) => void;
}
export interface CheckboxGroupState {
  /** Current selected values. */
  readonly value: Accessor<readonly string[]>;
  /** Default selected values. */
  readonly defaultValue: readonly string[];
  /** Whether the checkbox group is disabled. */
  readonly isDisabled: boolean;
  /** Whether the checkbox group is read only. */
  readonly isReadOnly: boolean;
  /** Whether the checkbox group is invalid. */
  readonly isInvalid: boolean;
  /**
   * Whether the checkboxes in the group are required.
   * This changes to false once at least one item is selected.
   */
  readonly isRequired: Accessor<boolean>;
  /** Returns whether the given value is selected. */
  isSelected(value: string): boolean;
  /** Sets the selected values. */
  setValue(value: string[]): void;
  /** Adds a value to the set of selected values. */
  addValue(value: string): void;
  /** Removes a value from the set of selected values. */
  removeValue(value: string): void;
  /** Toggles a value in the set of selected values. */
  toggleValue(value: string): void;
}
/**
 * Provides state management for a checkbox group component.
 * Provides a name for the group, and manages selection and focus state.
 */
export declare function createCheckboxGroupState(
  props?: MaybeAccessor<CheckboxGroupProps>,
): CheckboxGroupState;
//# sourceMappingURL=createCheckboxGroupState.d.ts.map
