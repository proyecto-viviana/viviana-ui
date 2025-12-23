/**
 * Radio hook for Solidaria
 *
 * Provides the behavior and accessibility implementation for an individual
 * radio button in a radio group.
 *
 * This is a 1:1 port of @react-aria/radio's useRadio hook.
 */
import { JSX, Accessor } from 'solid-js';
import { type MaybeAccessor } from '../utils/reactivity';
import { type RadioGroupState } from '@proyecto-viviana/solid-stately';
import { type PressEvent } from '../interactions/PressEvent';
export interface AriaRadioProps {
    /** The value of the radio button, used when submitting an HTML form. */
    value: string;
    /** Whether the radio button is disabled. */
    isDisabled?: boolean;
    /** The label for the radio button. */
    children?: JSX.Element;
    /** Defines a string value that labels the current element. */
    'aria-label'?: string;
    /** Identifies the element (or elements) that labels the current element. */
    'aria-labelledby'?: string;
    /** Identifies the element (or elements) that describes the object. */
    'aria-describedby'?: string;
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
    /** Whether to autofocus the element. */
    autoFocus?: boolean;
}
export interface RadioAria {
    /** Props for the label wrapper element. */
    labelProps: JSX.LabelHTMLAttributes<HTMLLabelElement>;
    /** Props for the input element. */
    inputProps: JSX.InputHTMLAttributes<HTMLInputElement>;
    /** Whether the radio is disabled. */
    isDisabled: boolean;
    /** Whether the radio is currently selected. */
    isSelected: Accessor<boolean>;
    /** Whether the radio is in a pressed state. */
    isPressed: Accessor<boolean>;
}
/**
 * Provides the behavior and accessibility implementation for an individual
 * radio button in a radio group.
 */
export declare function createRadio(props: MaybeAccessor<AriaRadioProps>, state: RadioGroupState, ref: () => HTMLInputElement | null): RadioAria;
//# sourceMappingURL=createRadio.d.ts.map