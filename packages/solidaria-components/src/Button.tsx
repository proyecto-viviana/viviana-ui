/**
 * Button component for solidaria-components
 *
 * A pre-wired headless button that combines state + aria hooks.
 * Port of react-aria-components/src/Button.tsx
 */

import {
  type JSX,
  type Accessor,
  createContext,
  useContext,
  createMemo,
  splitProps,
} from 'solid-js';
import {
  createButton,
  createFocusRing,
  createHover,
  type AriaButtonProps,
} from 'solidaria';
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

export interface ButtonRenderProps {
  /** Whether the button is currently hovered with a mouse. */
  isHovered: boolean;
  /** Whether the button is currently in a pressed state. */
  isPressed: boolean;
  /** Whether the button is focused, either via a mouse or keyboard. */
  isFocused: boolean;
  /** Whether the button is keyboard focused. */
  isFocusVisible: boolean;
  /** Whether the button is disabled. */
  isDisabled: boolean;
}

export interface ButtonProps
  extends Omit<AriaButtonProps, 'children'>,
    SlotProps {
  /** The children of the component. A function may be provided to receive render props. */
  children?: RenderChildren<ButtonRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<ButtonRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<ButtonRenderProps>;
}

// ============================================
// CONTEXT
// ============================================

export const ButtonContext = createContext<ButtonProps | null>(null);

// ============================================
// COMPONENT
// ============================================

/**
 * A button allows a user to perform an action.
 *
 * This is a headless component that provides accessibility and state management.
 * Style it using the render props pattern or data attributes.
 *
 * @example
 * ```tsx
 * <Button onPress={() => alert('Pressed!')}>
 *   {({ isPressed, isHovered }) => (
 *     <span class={isPressed ? 'bg-blue-700' : isHovered ? 'bg-blue-600' : 'bg-blue-500'}>
 *       Click me
 *     </span>
 *   )}
 * </Button>
 * ```
 */
export function Button(props: ButtonProps): JSX.Element {
  let ref: HTMLButtonElement | null = null;

  // Split props
  const [local, ariaProps] = splitProps(props, [
    'children',
    'class',
    'style',
    'slot',
  ]);

  // Create button aria props
  const buttonAria = createButton(
    () => ({
      ...ariaProps,
      children: typeof local.children === 'function' ? true : local.children,
    }),
    () => ref
  );

  // Create focus ring
  const { isFocused, isFocusVisible, focusProps } = createFocusRing();

  // Create hover
  const { isHovered, hoverProps } = createHover({
    get isDisabled() {
      return ariaProps.isDisabled;
    },
  });

  // Render props values
  const renderValues = createMemo<ButtonRenderProps>(() => ({
    isHovered: isHovered(),
    isPressed: buttonAria.isPressed(),
    isFocused: isFocused(),
    isFocusVisible: isFocusVisible(),
    isDisabled: buttonAria.isDisabled,
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: local.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Button',
    },
    renderValues
  );

  // Filter DOM props
  const domProps = createMemo(() => {
    const filtered = filterDOMProps(ariaProps, { global: true });
    return filtered;
  });

  return (
    <button
      ref={(el) => (ref = el)}
      {...domProps()}
      {...buttonAria.buttonProps}
      {...focusProps}
      {...hoverProps}
      class={renderProps().class}
      style={renderProps().style}
      data-pressed={buttonAria.isPressed() || undefined}
      data-hovered={isHovered() || undefined}
      data-focused={isFocused() || undefined}
      data-focus-visible={isFocusVisible() || undefined}
      data-disabled={buttonAria.isDisabled || undefined}
    >
      {renderProps().children}
    </button>
  );
}
