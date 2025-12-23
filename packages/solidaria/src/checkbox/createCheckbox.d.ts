/**
 * Checkbox hook for Solidaria
 *
 * Provides the behavior and accessibility implementation for a checkbox component.
 * Checkboxes allow users to select multiple items from a list of individual items,
 * or to mark one individual item as selected.
 *
 * This is a 1:1 port of @react-aria/checkbox's useCheckbox hook.
 */
import { JSX, Accessor } from 'solid-js';
import { type AriaToggleProps } from '../toggle';
import { type ToggleState } from '@proyecto-viviana/solid-stately';
import { type MaybeAccessor } from '../utils/reactivity';
export interface AriaCheckboxProps extends AriaToggleProps {
    /**
     * Indeterminism is presentational only.
     * The indeterminate visual representation remains regardless of user interaction.
     */
    isIndeterminate?: boolean;
    /**
     * Whether the checkbox is required.
     */
    isRequired?: boolean;
    /**
     * The validation behavior for the checkbox.
     * @default 'aria'
     */
    validationBehavior?: 'aria' | 'native';
}
export interface CheckboxAria {
    /** Props for the label wrapper element. */
    labelProps: JSX.LabelHTMLAttributes<HTMLLabelElement>;
    /** Props for the input element. */
    inputProps: JSX.InputHTMLAttributes<HTMLInputElement>;
    /** Whether the checkbox is selected. */
    isSelected: Accessor<boolean>;
    /** Whether the checkbox is in a pressed state. */
    isPressed: Accessor<boolean>;
    /** Whether the checkbox is disabled. */
    isDisabled: boolean;
    /** Whether the checkbox is read only. */
    isReadOnly: boolean;
    /** Whether the checkbox is invalid. */
    isInvalid: boolean;
}
/**
 * Provides the behavior and accessibility implementation for a checkbox component.
 * Checkboxes allow users to select multiple items from a list of individual items,
 * or to mark one individual item as selected.
 *
 * @param props - Props for the checkbox.
 * @param state - State for the checkbox, as returned by `createToggleState`.
 * @param inputRef - A ref accessor for the HTML input element.
 */
export declare function createCheckbox(props: MaybeAccessor<AriaCheckboxProps>, state: ToggleState, inputRef: () => HTMLInputElement | null): CheckboxAria;
//# sourceMappingURL=createCheckbox.d.ts.map