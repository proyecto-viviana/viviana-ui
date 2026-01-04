/**
 * Button component for solidaria-components
 *
 * A pre-wired headless button that combines state + aria hooks.
 * Port of react-aria-components/src/Button.tsx
 */

import {
  type JSX,
  createContext,
  createMemo,
  splitProps,
  useContext,
} from 'solid-js';
import {
  createButton,
  createFocusRing,
  createHover,
  type AriaButtonProps,
} from '@proyecto-viviana/solidaria';
import {
  type RenderChildren,
  type ClassNameOrFunction,
  type StyleOrFunction,
  type SlotProps,
  useRenderProps,
  filterDOMProps,
} from './utils';
import { DialogTriggerContext, PopoverTriggerContext } from './contexts';

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
  // Split props
  const [local, ariaProps] = splitProps(props, [
    'children',
    'class',
    'style',
    'slot',
  ]);

  // Check if inside a DialogTrigger or PopoverTrigger - if so, toggle on press
  // NOTE: Context is captured at component creation time. For Buttons inside a Modal,
  // the Modal provides OverlayTriggerStateContext, but due to SolidJS's eager JSX evaluation,
  // components inside Modal children are created before the Modal's Show renders.
  // So we can't reliably use context here to determine if we're inside a Modal.
  const dialogTriggerContext = useContext(DialogTriggerContext);
  const popoverTriggerContext = useContext(PopoverTriggerContext);

  // Helper to resolve isDisabled (handles both boolean and Accessor<boolean>)
  const resolveDisabled = (): boolean => {
    const disabled = ariaProps.isDisabled;
    if (typeof disabled === 'function') {
      return disabled();
    }
    return !!disabled;
  };

  // Determine if this button should act as a dialog/popover trigger
  // We only toggle if:
  // 1. We have DialogTriggerContext or PopoverTriggerContext (we're inside a trigger)
  // 2. AND there is NO onPress handler (the trigger button typically has no onPress,
  //    while close buttons inside dialogs have onPress={close})
  // This heuristic works because:
  // - Trigger buttons: don't have onPress, should toggle
  // - Close buttons: have onPress={close}, should NOT toggle (just call onPress)
  const isDialogTrigger = () => dialogTriggerContext && !ariaProps.onPress;
  const isPopoverTrigger = () => popoverTriggerContext && !ariaProps.onPress;

  // Wrap onPress to also toggle dialog/popover if this is a trigger button
  const handlePress = (e: any) => {
    // Call original onPress if provided
    if (typeof ariaProps.onPress === 'function') {
      ariaProps.onPress(e);
    }
    // Toggle dialog only if this is a trigger button (has no onPress handler)
    if (isDialogTrigger()) {
      dialogTriggerContext!.state.toggle();
    }
    // Toggle popover only if this is a trigger button (has no onPress handler)
    if (isPopoverTrigger()) {
      popoverTriggerContext!.state.toggle();
    }
  };

  // Create button aria props
  const buttonAria = createButton({
    ...ariaProps,
    onPress: handlePress,
    get isDisabled() {
      return resolveDisabled();
    },
  });

  // Create focus ring
  const { isFocused, isFocusVisible, focusProps } = createFocusRing();

  // Create hover
  const { isHovered, hoverProps } = createHover({
    get isDisabled() {
      return resolveDisabled();
    },
  });

  // Render props values
  const renderValues = createMemo<ButtonRenderProps>(() => ({
    isHovered: isHovered(),
    isPressed: buttonAria.isPressed(),
    isFocused: isFocused(),
    isFocusVisible: isFocusVisible(),
    isDisabled: resolveDisabled(),
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

  // Extract refs from props to combine them manually
  const buttonPropsRef = (buttonAria.buttonProps as Record<string, unknown>).ref as ((el: HTMLElement) => void) | undefined;
  const focusPropsRef = (focusProps as Record<string, unknown>).ref as ((el: HTMLElement) => void) | undefined;
  const hoverPropsRef = (hoverProps as Record<string, unknown>).ref as ((el: HTMLElement) => void) | undefined;

  // Remove ref from spread props to avoid type conflicts
  const cleanButtonProps = () => {
    const { ref: _ref1, ...rest } = buttonAria.buttonProps as Record<string, unknown>;
    return rest;
  };
  const cleanFocusProps = () => {
    const { ref: _ref2, ...rest } = focusProps as Record<string, unknown>;
    return rest;
  };
  const cleanHoverProps = () => {
    const { ref: _ref3, ...rest } = hoverProps as Record<string, unknown>;
    return rest;
  };

  // Ref callback that combines all refs
  const handleRef = (el: HTMLButtonElement) => {
    // Call the focusable ref for autoFocus support
    buttonPropsRef?.(el);
    focusPropsRef?.(el);
    hoverPropsRef?.(el);

    // If this button is a popover trigger, register it
    if (isPopoverTrigger() && popoverTriggerContext?.setTriggerRef) {
      popoverTriggerContext.setTriggerRef(el);
    }
  };

  return (
    <button
      ref={handleRef}
      {...domProps()}
      {...cleanButtonProps()}
      {...cleanFocusProps()}
      {...cleanHoverProps()}
      class={renderProps.class()}
      style={renderProps.style()}
      data-pressed={buttonAria.isPressed() || undefined}
      data-hovered={isHovered() || undefined}
      data-focused={isFocused() || undefined}
      data-focus-visible={isFocusVisible() || undefined}
      data-disabled={resolveDisabled() || undefined}
    >
      {renderProps.renderChildren()}
    </button>
  );
}
