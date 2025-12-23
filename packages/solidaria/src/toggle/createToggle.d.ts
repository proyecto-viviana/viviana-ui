/**
 * Toggle hook for Solidaria
 *
 * Handles interactions for toggle elements, e.g. Checkboxes and Switches.
 *
 * This is a 1:1 port of @react-aria/toggle's useToggle hook.
 */
import { JSX, Accessor } from 'solid-js';
import { type MaybeAccessor } from '../utils/reactivity';
import { type ToggleState } from '@proyecto-viviana/solid-stately';
import { type PressEvent } from '../interactions/PressEvent';
export interface AriaToggleProps {
    /** Whether the element should be selected (controlled). */
    isSelected?: boolean;
    /** Whether the element should be selected by default (uncontrolled). */
    defaultSelected?: boolean;
    /** Handler that is called when the element's selection state changes. */
    onChange?: (isSelected: boolean) => void;
    /** The value of the input element, used when submitting an HTML form. */
    value?: string;
    /** The name of the input element, used when submitting an HTML form. */
    name?: string;
    /** The form to associate the input with. */
    form?: string;
    /** Whether the element is disabled. */
    isDisabled?: boolean;
    /** Whether the element is read only. */
    isReadOnly?: boolean;
    /** Whether the element is required. */
    isRequired?: boolean;
    /** Whether the element is invalid. */
    isInvalid?: boolean;
    /** The element's children. */
    children?: JSX.Element;
    /** Defines a string value that labels the current element. */
    'aria-label'?: string;
    /** Identifies the element (or elements) that labels the current element. */
    'aria-labelledby'?: string;
    /** Identifies the element (or elements) that describes the object. */
    'aria-describedby'?: string;
    /** Identifies the element (or elements) that provide an error message for the object. */
    'aria-errormessage'?: string;
    /** Identifies the element (or elements) whose contents or presence are controlled by the current element. */
    'aria-controls'?: string;
    /** The element's unique identifier. */
    id?: string;
    /** Handler that is called when the press is released over the target. */
    onPress?: (e: PressEvent) => void;
    /** Handler that is called when a press interaction starts. */
    onPressStart?: (e: PressEvent) => void;
    /** Handler that is called when a press interaction ends, either over the target or when the pointer leaves the target. */
    onPressEnd?: (e: PressEvent) => void;
    /** Handler that is called when the press state changes. */
    onPressChange?: (isPressed: boolean) => void;
    /** Handler that is called when a press is released over the target, regardless of whether it started on the target or not. */
    onPressUp?: (e: PressEvent) => void;
    /** Handler that is called when the element is clicked. */
    onClick?: (e: MouseEvent) => void;
    /** Handler that is called when the element receives focus. */
    onFocus?: (e: FocusEvent) => void;
    /** Handler that is called when the element loses focus. */
    onBlur?: (e: FocusEvent) => void;
    /** Handler that is called when the element's focus status changes. */
    onFocusChange?: (isFocused: boolean) => void;
    /** Handler that is called when a key is pressed. */
    onKeyDown?: (e: KeyboardEvent) => void;
    /** Handler that is called when a key is released. */
    onKeyUp?: (e: KeyboardEvent) => void;
    /** Whether to exclude the element from the tab order. */
    excludeFromTabOrder?: boolean;
    /** Whether to autofocus the element. */
    autoFocus?: boolean;
}
export interface ToggleAria {
    /** Props to be spread on the label element. */
    labelProps: JSX.LabelHTMLAttributes<HTMLLabelElement>;
    /** Props to be spread on the input element. */
    inputProps: JSX.InputHTMLAttributes<HTMLInputElement>;
    /** Whether the toggle is selected. */
    isSelected: Accessor<boolean>;
    /** Whether the toggle is in a pressed state. */
    isPressed: Accessor<boolean>;
    /** Whether the toggle is disabled. */
    isDisabled: boolean;
    /** Whether the toggle is read only. */
    isReadOnly: boolean;
    /** Whether the toggle is invalid. */
    isInvalid: boolean;
}
/**
 * Handles interactions for toggle elements, e.g. Checkboxes and Switches.
 */
export declare function createToggle(props: MaybeAccessor<AriaToggleProps>, state: ToggleState, ref: () => HTMLInputElement | null): ToggleAria;
//# sourceMappingURL=createToggle.d.ts.map