/**
 * TextField component for solidaria-components
 *
 * A pre-wired headless text field that combines state + aria hooks.
 * Port of react-aria-components/src/TextField.tsx
 */

import {
  type JSX,
  createContext,
  useContext,
  createMemo,
  splitProps,
} from 'solid-js';
import {
  createTextField,
  createFocusRing,
  createHover,
  type AriaTextFieldProps,
} from '@proyecto-viviana/solidaria';
import { createTextFieldState } from '@proyecto-viviana/solid-stately';
import {
  type RenderChildren,
  type ClassNameOrFunction,
  type StyleOrFunction,
  type SlotProps,
  useRenderProps,
  filterDOMProps,
} from './utils';

// ============================================
// TYPES
// ============================================

export interface TextFieldRenderProps {
  /** Whether the text field is disabled. */
  isDisabled: boolean;
  /** Whether the value is invalid. */
  isInvalid: boolean;
  /** Whether the text field is read only. */
  isReadOnly: boolean;
  /** Whether the text field is required. */
  isRequired: boolean;
  /** Whether the text field is currently hovered with a mouse. */
  isHovered: boolean;
  /** Whether the text field is focused, either via a mouse or keyboard. */
  isFocused: boolean;
  /** Whether the text field is keyboard focused. */
  isFocusVisible: boolean;
}

export interface TextFieldProps
  extends Omit<AriaTextFieldProps, 'children'>,
    SlotProps {
  /** The children of the component. A function may be provided to receive render props. */
  children?: RenderChildren<TextFieldRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<TextFieldRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<TextFieldRenderProps>;
}

// ============================================
// CONTEXT
// ============================================

export interface TextFieldContextValue {
  labelProps: JSX.LabelHTMLAttributes<HTMLLabelElement>;
  inputProps: JSX.InputHTMLAttributes<HTMLInputElement>;
  descriptionProps: JSX.HTMLAttributes<HTMLElement>;
  errorMessageProps: JSX.HTMLAttributes<HTMLElement>;
  isInvalid: boolean;
}

export const TextFieldContext = createContext<TextFieldContextValue | null>(null);

// ============================================
// SUB-COMPONENTS
// ============================================

export interface LabelProps extends JSX.LabelHTMLAttributes<HTMLLabelElement> {
  children?: JSX.Element;
}

/**
 * A label element that automatically wires up to the parent TextField context.
 * This enables the proper htmlFor/id relationship between label and input.
 */
export function Label(props: LabelProps): JSX.Element {
  const context = useContext(TextFieldContext);

  // Merge context labelProps with local props (local props take precedence)
  const mergedProps = () => {
    if (context) {
      const { ref: _ref, ...contextLabelProps } = context.labelProps as Record<string, unknown>;
      return { ...contextLabelProps, ...props };
    }
    return props;
  };

  return <label {...mergedProps()}>{props.children}</label>;
}

export interface InputProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'children'> {}

/**
 * An input element that automatically wires up to the parent TextField context.
 * This enables focus tracking, validation, and accessibility props to flow from
 * the TextField to the actual input element.
 */
export function Input(props: InputProps): JSX.Element {
  const context = useContext(TextFieldContext);

  // Merge context inputProps with local props (local props take precedence)
  const mergedProps = () => {
    if (context) {
      // Remove ref from context props to avoid conflicts
      const { ref: _ref, ...contextInputProps } = context.inputProps as Record<string, unknown>;
      return { ...contextInputProps, ...props };
    }
    return props;
  };

  return <input {...mergedProps()} />;
}

export interface TextAreaProps extends Omit<JSX.TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'> {}

/**
 * A textarea element that automatically wires up to the parent TextField context.
 * This enables focus tracking, validation, and accessibility props to flow from
 * the TextField to the actual textarea element.
 */
export function TextArea(props: TextAreaProps): JSX.Element {
  const context = useContext(TextFieldContext);

  // Merge context inputProps with local props (local props take precedence)
  // Note: TextArea uses inputProps from context since it's an input variant
  const mergedProps = () => {
    if (context) {
      const { ref: _ref, type: _type, ...contextInputProps } = context.inputProps as Record<string, unknown>;
      return { ...contextInputProps, ...props };
    }
    return props;
  };

  return <textarea {...mergedProps()} />;
}

// ============================================
// COMPONENT
// ============================================

/**
 * A text field allows a user to enter a plain text value with a keyboard.
 *
 * This is a headless component that provides accessibility and state management.
 * Style it using the render props pattern or data attributes.
 *
 * @example
 * ```tsx
 * <TextField>
 *   {({ isInvalid }) => (
 *     <>
 *       <Label>Email</Label>
 *       <Input class={isInvalid ? 'border-red-500' : 'border-gray-300'} />
 *     </>
 *   )}
 * </TextField>
 * ```
 */
export function TextField(props: TextFieldProps): JSX.Element {
  // Split props
  const [local, ariaProps] = splitProps(props, [
    'children',
    'class',
    'style',
    'slot',
  ]);

  // Create text field state
  // Use getters to ensure props are read lazily inside reactive contexts
  const state = createTextFieldState({
    get value() { return ariaProps.value; },
    get defaultValue() { return ariaProps.defaultValue; },
    get onChange() { return ariaProps.onChange; },
  });

  // Create text field aria props
  const textFieldAria = createTextField(() => ({
    ...ariaProps,
    value: state.value(),
    onChange: state.setValue,
  }));

  // Create focus ring
  const { isFocused, isFocusVisible, focusProps } = createFocusRing();

  // Create hover
  const { isHovered, hoverProps } = createHover({
    get isDisabled() {
      return ariaProps.isDisabled;
    },
  });

  // Render props values
  const renderValues = createMemo<TextFieldRenderProps>(() => ({
    isDisabled: ariaProps.isDisabled || false,
    isInvalid: textFieldAria.isInvalid,
    isReadOnly: ariaProps.isReadOnly || false,
    isRequired: ariaProps.isRequired || false,
    isHovered: isHovered(),
    isFocused: isFocused(),
    isFocusVisible: isFocusVisible(),
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: local.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-TextField',
    },
    renderValues
  );

  // Filter DOM props
  const domProps = createMemo(() => {
    const filtered = filterDOMProps(ariaProps, { global: true });
    delete (filtered as Record<string, unknown>).id;
    return filtered;
  });

  // Remove ref from spread props to avoid type conflicts
  const cleanHoverProps = () => {
    const { ref: _ref, ...rest } = hoverProps as Record<string, unknown>;
    return rest;
  };

  // Context value for sub-components
  // Note: We create the value object directly (not in a memo) so it's available
  // immediately when children access the context
  const contextValue: TextFieldContextValue = {
    labelProps: textFieldAria.labelProps as JSX.LabelHTMLAttributes<HTMLLabelElement>,
    inputProps: { ...textFieldAria.inputProps, ...focusProps } as JSX.InputHTMLAttributes<HTMLInputElement>,
    descriptionProps: textFieldAria.descriptionProps as JSX.HTMLAttributes<HTMLElement>,
    errorMessageProps: textFieldAria.errorMessageProps as JSX.HTMLAttributes<HTMLElement>,
    isInvalid: textFieldAria.isInvalid,
  };

  return (
    <TextFieldContext.Provider value={contextValue}>
      <div
        {...domProps()}
        {...cleanHoverProps()}
        class={renderProps().class}
        style={renderProps().style}
        data-disabled={ariaProps.isDisabled || undefined}
        data-invalid={textFieldAria.isInvalid || undefined}
        data-readonly={ariaProps.isReadOnly || undefined}
        data-required={ariaProps.isRequired || undefined}
        data-hovered={isHovered() || undefined}
        data-focused={isFocused() || undefined}
        data-focus-visible={isFocusVisible() || undefined}
      >
        {renderProps().children}
      </div>
    </TextFieldContext.Provider>
  );
}
