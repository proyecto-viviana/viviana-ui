/**
 * Radio group hook for Solidaria
 *
 * Provides the behavior and accessibility implementation for a radio group component.
 * Radio groups allow users to select a single item from a list of mutually exclusive options.
 *
 * This is a 1:1 port of @react-aria/radio's useRadioGroup hook.
 */
import { JSX } from 'solid-js';
import { type MaybeAccessor } from '../utils/reactivity';
import { type RadioGroupState } from '@proyecto-viviana/solid-stately';
export interface AriaRadioGroupProps {
    /** The content to display as the label. */
    label?: JSX.Element;
    /** A description for the radio group. Provides additional context. */
    description?: JSX.Element;
    /** An error message for the radio group. */
    errorMessage?: JSX.Element | ((validation: {
        isInvalid: boolean;
        validationErrors: string[];
    }) => JSX.Element);
    /** Whether the radio group is disabled. */
    isDisabled?: boolean;
    /** Whether the radio group is read only. */
    isReadOnly?: boolean;
    /** Whether the radio group is required. */
    isRequired?: boolean;
    /** Whether the radio group is invalid. */
    isInvalid?: boolean;
    /** The axis the Radio Button(s) should align with. Defaults to 'vertical'. */
    orientation?: 'horizontal' | 'vertical';
    /** The name of the radio group, used when submitting an HTML form. */
    name?: string;
    /** The form to associate the radio group with. */
    form?: string;
    /** Validation behavior for the radio group. */
    validationBehavior?: 'aria' | 'native';
    /** Handler that is called when the radio group receives focus. */
    onFocus?: (e: FocusEvent) => void;
    /** Handler that is called when the radio group loses focus. */
    onBlur?: (e: FocusEvent) => void;
    /** Handler that is called when the radio group's focus status changes. */
    onFocusChange?: (isFocused: boolean) => void;
    /** Defines a string value that labels the current element. */
    'aria-label'?: string;
    /** Identifies the element (or elements) that labels the current element. */
    'aria-labelledby'?: string;
    /** Identifies the element (or elements) that describes the object. */
    'aria-describedby'?: string;
    /** Identifies the element (or elements) that provide an error message for the object. */
    'aria-errormessage'?: string;
    /** The element's unique identifier. */
    id?: string;
}
export interface RadioGroupAria {
    /** Props for the radio group wrapper element. */
    radioGroupProps: JSX.HTMLAttributes<HTMLDivElement>;
    /** Props for the radio group's visible label (if any). */
    labelProps: JSX.HTMLAttributes<HTMLElement>;
    /** Props for the radio group description element, if any. */
    descriptionProps: JSX.HTMLAttributes<HTMLElement>;
    /** Props for the radio group error message element, if any. */
    errorMessageProps: JSX.HTMLAttributes<HTMLElement>;
    /** Whether the radio group is invalid. */
    isInvalid: boolean;
    /** Validation errors, if any. */
    validationErrors: string[];
    /** Validation details, if any. */
    validationDetails: Record<string, boolean>;
}
interface RadioGroupData {
    name: string;
    form: string | undefined;
    descriptionId: string | undefined;
    errorMessageId: string | undefined;
    validationBehavior: 'aria' | 'native';
}
export declare const radioGroupData: WeakMap<RadioGroupState, RadioGroupData>;
/**
 * Provides the behavior and accessibility implementation for a radio group component.
 * Radio groups allow users to select a single item from a list of mutually exclusive options.
 */
export declare function createRadioGroup(props: MaybeAccessor<AriaRadioGroupProps>, state: RadioGroupState): RadioGroupAria;
export {};
//# sourceMappingURL=createRadioGroup.d.ts.map