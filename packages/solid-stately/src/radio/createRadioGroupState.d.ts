/**
 * Radio group state for Solid Stately
 *
 * Provides state management for a radio group component.
 * Provides a name for the group, and manages selection and focus state.
 *
 * This is a 1:1 port of @react-stately/radio's useRadioGroupState.
 */
import { Accessor } from 'solid-js';
import { type MaybeAccessor } from '../utils';
export interface RadioGroupProps {
    /** The current selected value (controlled). */
    value?: string | null;
    /** The default selected value (uncontrolled). */
    defaultValue?: string | null;
    /** Handler that is called when the value changes. */
    onChange?: (value: string) => void;
    /** Whether the radio group is disabled. */
    isDisabled?: boolean;
    /** Whether the radio group is read only. */
    isReadOnly?: boolean;
    /** Whether the radio group is required. */
    isRequired?: boolean;
    /** Whether the radio group is invalid. */
    isInvalid?: boolean;
    /** The name of the radio group, used when submitting an HTML form. */
    name?: string;
    /** The form to associate the radio group with. */
    form?: string;
    /** The label for the radio group. */
    label?: string;
    /** Orientation of the radio group. */
    orientation?: 'horizontal' | 'vertical';
    /** Handler that is called when the radio group receives focus. */
    onFocus?: (e: FocusEvent) => void;
    /** Handler that is called when the radio group loses focus. */
    onBlur?: (e: FocusEvent) => void;
    /** Handler that is called when the radio group's focus status changes. */
    onFocusChange?: (isFocused: boolean) => void;
}
export interface RadioGroupState {
    /** The name for the group, used for native form submission. */
    readonly name: string;
    /** Whether the radio group is disabled. */
    readonly isDisabled: boolean;
    /** Whether the radio group is read only. */
    readonly isReadOnly: boolean;
    /** Whether the radio group is required. */
    readonly isRequired: boolean;
    /** Whether the radio group is invalid. */
    readonly isInvalid: boolean;
    /** The currently selected value. */
    readonly selectedValue: Accessor<string | null>;
    /** The default selected value. */
    readonly defaultSelectedValue: string | null;
    /** Sets the selected value. */
    setSelectedValue(value: string | null): void;
    /** The value of the last focused radio. */
    readonly lastFocusedValue: Accessor<string | null>;
    /** Sets the last focused value. */
    setLastFocusedValue(value: string | null): void;
}
/**
 * Internal WeakMap to store sync version accessors for each radio group state.
 * This is used by createRadio to trigger DOM sync when native radio behavior
 * causes the DOM checked state to desync from our reactive state.
 *
 * This is kept separate from RadioGroupState to maintain API parity with React-Stately.
 * @internal
 */
export declare const radioGroupSyncVersion: WeakMap<RadioGroupState, Accessor<number>>;
/**
 * Provides state management for a radio group component.
 * Provides a name for the group, and manages selection and focus state.
 */
export declare function createRadioGroupState(props?: MaybeAccessor<RadioGroupProps>): RadioGroupState;
//# sourceMappingURL=createRadioGroupState.d.ts.map