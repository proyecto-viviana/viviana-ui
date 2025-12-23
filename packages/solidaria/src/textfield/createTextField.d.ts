/**
 * TextField hook for Solidaria
 *
 * Provides the behavior and accessibility implementation for a text field.
 *
 * This is a 1:1 port of @react-aria/textfield's useTextField hook.
 */
import { JSX } from 'solid-js';
import { type AriaFieldProps, type FieldAria } from '../label';
import { type FocusableProps } from '../interactions';
import { type MaybeAccessor } from '../utils/reactivity';
export interface AriaTextFieldProps extends AriaFieldProps, FocusableProps {
    /** The current value (controlled). */
    value?: string;
    /** The default value (uncontrolled). */
    defaultValue?: string;
    /** Handler that is called when the value changes. */
    onChange?: (value: string) => void;
    /** Whether the input is disabled. */
    isDisabled?: boolean;
    /** Whether the input is read only. */
    isReadOnly?: boolean;
    /** Whether the input is required. */
    isRequired?: boolean;
    /** The type of input to render. */
    type?: 'text' | 'search' | 'url' | 'tel' | 'email' | 'password' | string;
    /** The input mode hint for virtual keyboards. */
    inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
    /** The name of the input element, used when submitting an HTML form. */
    name?: string;
    /** Regex pattern to validate the input value. */
    pattern?: string;
    /** The maximum number of characters supported by the input. */
    maxLength?: number;
    /** The minimum number of characters required by the input. */
    minLength?: number;
    /** Placeholder text for the input. */
    placeholder?: string;
    /** Whether to enable auto complete. */
    autoComplete?: string;
    /** Whether to enable auto correct. */
    autoCorrect?: string;
    /** Whether to enable spell check. */
    spellCheck?: 'true' | 'false';
    /** Controls whether and how text input is automatically capitalized. */
    autoCapitalize?: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters';
    /** The element type to use for the input. Defaults to 'input'. */
    inputElementType?: 'input' | 'textarea';
    onCopy?: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, ClipboardEvent>;
    onCut?: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, ClipboardEvent>;
    onPaste?: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, ClipboardEvent>;
    onCompositionStart?: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, CompositionEvent>;
    onCompositionEnd?: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, CompositionEvent>;
    onCompositionUpdate?: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, CompositionEvent>;
    onSelect?: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, Event>;
    onBeforeInput?: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, InputEvent>;
    onInput?: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, InputEvent>;
}
export interface TextFieldAria<T extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement> extends Omit<FieldAria, 'fieldProps'> {
    /** Props for the input element. */
    inputProps: JSX.InputHTMLAttributes<T>;
    /** Whether the text field is invalid. */
    isInvalid: boolean;
}
/**
 * Provides the behavior and accessibility implementation for a text field.
 * Text fields allow users to input text with a keyboard.
 *
 * @param props - Props for the text field.
 * @param ref - Optional ref callback for the input element.
 */
export declare function createTextField<T extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement>(props: MaybeAccessor<AriaTextFieldProps>, ref?: (el: T) => void): TextFieldAria<T>;
//# sourceMappingURL=createTextField.d.ts.map