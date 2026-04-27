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
  mergeProps,
  type AriaButtonProps,
  type HoverEvent,
  type PressEvent,
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
  /** Whether the button is currently in a pending state. */
  isPending: boolean;
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
  /** Custom renderer for the outer button element. */
  render?: (
    props: JSX.ButtonHTMLAttributes<HTMLButtonElement>,
    renderProps: ButtonRenderProps
  ) => JSX.Element;
  /** Whether the button is in a pending state. */
  isPending?: boolean;
  /** Handler called when hover starts. */
  onHoverStart?: (e: HoverEvent) => void;
  /** Handler called when hover ends. */
  onHoverEnd?: (e: HoverEvent) => void;
  /** Handler called when hover state changes. */
  onHoverChange?: (isHovered: boolean) => void;
}

// ============================================
// CONTEXT
// ============================================

export interface ButtonContextValue extends ButtonProps {
  slots?: Record<string, ButtonProps>;
}

export const ButtonContext = createContext<ButtonContextValue | null>(null);

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
  const contextProps = useContext(ButtonContext);
  const contextSlotProps = contextProps?.slots?.[props.slot ?? 'default'];
  const contextBaseProps = createMemo<ButtonProps>(() => {
    if (!contextProps) return {};
    const { slots: _slots, ...rest } = contextProps;
    return rest;
  });
  const mergedProps = (contextProps ? mergeProps(contextBaseProps(), contextSlotProps ?? {}, props) : props) as ButtonProps;

  // Split props
  const [local, ariaProps] = splitProps(mergedProps, [
    'children',
    'class',
    'style',
    'render',
    'slot',
    'isPending',
    'onHoverStart',
    'onHoverEnd',
    'onHoverChange',
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

  const resolvePending = (): boolean => !!local.isPending;

  let buttonEl: HTMLButtonElement | undefined;

  // Explicit trigger ownership: a button toggles overlays only when it is the
  // registered trigger element for the surrounding trigger context.
  const isDialogTrigger = () =>
    !!dialogTriggerContext && !!buttonEl && dialogTriggerContext.triggerRef() === buttonEl;
  const isPopoverTrigger = () =>
    !!popoverTriggerContext && !!buttonEl && popoverTriggerContext.triggerRef() === buttonEl;

  // Wrap onPress to also toggle dialog/popover if this is a trigger button
  const handlePress = (e: PressEvent) => {
    if (resolvePending()) {
      return;
    }
    // Call original onPress if provided
    if (typeof ariaProps.onPress === 'function') {
      ariaProps.onPress(e);
    }
    // Toggle only when this exact button is the registered trigger element.
    if (isDialogTrigger()) {
      dialogTriggerContext!.state.toggle();
    }
    if (isPopoverTrigger()) {
      popoverTriggerContext!.state.toggle();
    }
  };

  // Create button aria props
  const buttonAria = createButton({
    ...ariaProps,
    onPress: handlePress,
    get onPressStart() {
      return resolvePending() ? undefined : ariaProps.onPressStart;
    },
    get onPressEnd() {
      return resolvePending() ? undefined : ariaProps.onPressEnd;
    },
    get onPressUp() {
      return resolvePending() ? undefined : ariaProps.onPressUp;
    },
    get onPressChange() {
      return resolvePending() ? undefined : ariaProps.onPressChange;
    },
    get onClick() {
      return resolvePending() ? undefined : ariaProps.onClick;
    },
    get isDisabled() {
      return resolveDisabled() || resolvePending();
    },
  });

  // Create focus ring
  const { isFocused, isFocusVisible, focusProps } = createFocusRing();

  // Create hover
  const { isHovered, hoverProps } = createHover({
    get isDisabled() {
      return resolveDisabled() || resolvePending();
    },
    onHoverStart: local.onHoverStart,
    onHoverEnd: local.onHoverEnd,
    onHoverChange: local.onHoverChange,
  });

  // Render props values
  const renderValues = createMemo<ButtonRenderProps>(() => ({
    isHovered: isHovered(),
    isPressed: buttonAria.isPressed() && !resolvePending(),
    isFocused: isFocused(),
    isFocusVisible: isFocusVisible(),
    isDisabled: resolveDisabled(),
    isPending: resolvePending(),
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      // Use merged children so ButtonContext can supply slot/default content.
      children: local.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Button',
    },
    renderValues
  );

  // Filter DOM props
  // Remove onClick from DOM props - it's already handled by createPress
  // This matches React Aria Components behavior (Button.tsx line 144: delete DOMProps.onClick)
  const domProps = createMemo(() => {
    const filtered = filterDOMProps(ariaProps, { global: true });
    // onClick is handled by createPress, not passed directly to DOM
    delete (filtered as Record<string, unknown>).onClick;
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
    buttonEl = el;

    // Call the focusable ref for autoFocus support
    buttonPropsRef?.(el);
    focusPropsRef?.(el);
    hoverPropsRef?.(el);

    // Register trigger ownership for surrounding trigger contexts.
    if (dialogTriggerContext?.setTriggerRef) {
      if (!el.id) {
        el.id = dialogTriggerContext.triggerId;
      }
      dialogTriggerContext.setTriggerRef(el);
    }
    if (popoverTriggerContext?.setTriggerRef) {
      popoverTriggerContext.setTriggerRef(el);
    }
  };
  const buttonType = () =>
    (buttonAria.buttonProps as Record<string, unknown>).type === 'submit' && resolvePending()
      ? 'button'
      : (buttonAria.buttonProps as Record<string, unknown>).type as
          | 'button'
          | 'submit'
          | 'reset'
          | undefined;
  const buttonChildren = () => renderProps.renderChildren();
  const rootProps = () => ({
    ...domProps(),
    ...cleanButtonProps(),
    ...cleanFocusProps(),
    ...cleanHoverProps(),
    type: buttonType(),
    class: renderProps.class(),
    style: renderProps.style(),
    slot: local.slot,
    'data-pressed': (buttonAria.isPressed() && !resolvePending()) || undefined,
    'data-hovered': isHovered() || undefined,
    'data-focused': isFocused() || undefined,
    'data-focus-visible': isFocusVisible() || undefined,
    'data-disabled': resolveDisabled() || undefined,
    'data-pending': resolvePending() || undefined,
  }) as JSX.ButtonHTMLAttributes<HTMLButtonElement>;
  const customRootProps = () => ({
    ...rootProps(),
    ref: handleRef,
    children: buttonChildren(),
  }) as JSX.ButtonHTMLAttributes<HTMLButtonElement>;
  const customRendered = createMemo(() =>
    local.render?.(customRootProps(), renderValues())
  );

  return local.render ? customRendered() : (
    <button
      ref={handleRef}
      {...rootProps()}
    >
      {buttonChildren()}
    </button>
  );
}
