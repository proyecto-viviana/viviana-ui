/**
 * Checkbox group hook for Solidaria
 *
 * Provides the behavior and accessibility implementation for a checkbox group component.
 * Checkbox groups allow users to select multiple items from a list of options.
 *
 * This is a 1:1 port of @react-aria/checkbox's useCheckboxGroup hook.
 */
import { JSX } from 'solid-js';
import { type MaybeAccessor } from '../utils/reactivity';
import { type CheckboxGroupState, type CheckboxGroupProps } from '@proyecto-viviana/solid-stately';
export interface AriaCheckboxGroupProps extends CheckboxGroupProps {
    /** Defines a string value that labels the current element. */
    'aria-label'?: string;
    /** Identifies the element (or elements) that labels the current element. */
    'aria-labelledby'?: string;
    /** Identifies the element (or elements) that describes the object. */
    'aria-describedby'?: string;
    /** Identifies the element (or elements) that provide a detailed, extended description for the object. */
    'aria-details'?: string;
    /** A description for the field. Provides a hint such as specific requirements for what to choose. */
    description?: JSX.Element;
    /** An error message for the field. */
    errorMessage?: JSX.Element;
}
export interface CheckboxGroupAria {
    /** Props for the checkbox group wrapper element. */
    groupProps: JSX.HTMLAttributes<HTMLElement>;
    /** Props for the checkbox group's visible label (if any). */
    labelProps: JSX.HTMLAttributes<HTMLElement>;
    /** Props for the checkbox group description element, if any. */
    descriptionProps: JSX.HTMLAttributes<HTMLElement>;
    /** Props for the checkbox group error message element, if any. */
    errorMessageProps: JSX.HTMLAttributes<HTMLElement>;
    /** Whether the checkbox group is invalid. */
    isInvalid: boolean;
}
export declare const checkboxGroupData: WeakMap<CheckboxGroupState, {
    name?: string;
    form?: string;
    descriptionId?: string;
    errorMessageId?: string;
    validationBehavior: "aria" | "native";
}>;
/**
 * Provides the behavior and accessibility implementation for a checkbox group component.
 * Checkbox groups allow users to select multiple items from a list of options.
 *
 * @param props - Props for the checkbox group.
 * @param state - State for the checkbox group, as returned by `createCheckboxGroupState`.
 */
export declare function createCheckboxGroup(props: MaybeAccessor<AriaCheckboxGroupProps>, state: CheckboxGroupState): CheckboxGroupAria;
//# sourceMappingURL=createCheckboxGroup.d.ts.map