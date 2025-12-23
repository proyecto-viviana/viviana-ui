/**
 * Field hook for Solidaria
 *
 * Provides the accessibility implementation for input fields.
 * Fields accept user input, gain context from their label, and may display
 * a description or error message.
 *
 * This is a 1:1 port of @react-aria/label's useField hook.
 */
import { JSX } from 'solid-js';
import { type LabelAriaProps, type LabelAria } from './createLabel';
import { type MaybeAccessor } from '../utils/reactivity';
export interface HelpTextProps {
    /** A description for the field. Provides a hint such as specific requirements for what to choose. */
    description?: JSX.Element;
    /** An error message for the field. */
    errorMessage?: JSX.Element | ((validation: ValidationResult) => JSX.Element);
}
export interface ValidationResult {
    /** Whether the input value is invalid. */
    isInvalid: boolean;
    /** The current error messages for the input if it is invalid, otherwise an empty array. */
    validationErrors: string[];
    /** The native validity state for the input. */
    validationDetails: ValidityState;
}
export interface Validation<T> {
    /** Whether the input value is invalid. */
    isInvalid?: boolean;
    /** Whether the input is required before form submission. */
    isRequired?: boolean;
    /** A function that returns an error message if a given value is invalid. */
    validate?: (value: T) => string | string[] | true | null | undefined;
}
export interface AriaFieldProps extends LabelAriaProps, HelpTextProps, Omit<Validation<any>, 'isRequired'> {
}
export interface FieldAria extends LabelAria {
    /** Props for the description element, if any. */
    descriptionProps: JSX.HTMLAttributes<HTMLElement>;
    /** Props for the error message element, if any. */
    errorMessageProps: JSX.HTMLAttributes<HTMLElement>;
}
/**
 * Provides the accessibility implementation for input fields.
 * Fields accept user input, gain context from their label, and may display
 * a description or error message.
 *
 * @param props - Props for the Field.
 */
export declare function createField(props: MaybeAccessor<AriaFieldProps>): FieldAria;
//# sourceMappingURL=createField.d.ts.map