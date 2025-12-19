/**
 * createPress - Handles press interactions across mouse, touch, keyboard, and virtual clicks.
 *
 * This is a 1-1 port of React-Aria's usePress hook adapted for SolidJS.
 * All behaviors, edge cases, and platform-specific handling are preserved.
 */

import { createSignal, JSX, Accessor, onCleanup } from 'solid-js';
import { PressEvent, PointerType, createPressEvent } from './PressEvent';
import {
  nodeContains,
  getEventTarget,
  isValidKeyboardEvent,
  isHTMLAnchorLink,
  shouldPreventDefaultKeyboard,
  isVirtualClick,
  isVirtualPointerEvent,
  isPointOverTarget,
  getTouchFromEvent,
  getTouchById,
  disableTextSelection,
  restoreTextSelection,
  focusWithoutScrolling,
  preventFocus,
  openLink,
  isMac,
  createGlobalListeners,
} from '../utils';

// Re-export PressEvent types
export { PressEvent, type PointerType } from './PressEvent';
export type { IPressEvent, PressEventType } from './PressEvent';

export interface CreatePressProps {
  /** Whether the target is currently disabled. */
  isDisabled?: Accessor<boolean> | boolean;
  /** Handler called when the press is released over the target. */
  onPress?: (e: PressEvent) => void;
  /** Handler called when a press interaction starts. */
  onPressStart?: (e: PressEvent) => void;
  /**
   * Handler called when a press interaction ends, either
   * over the target or when the pointer leaves the target.
   */
  onPressEnd?: (e: PressEvent) => void;
  /** Handler called when a press is released over the target, regardless of whether it started on the target. */
  onPressUp?: (e: PressEvent) => void;
  /** Handler called when the press state changes. */
  onPressChange?: (isPressed: boolean) => void;
  /** Whether the press should be visual only, not triggering onPress. */
  isPressed?: Accessor<boolean> | boolean;
  /** Whether to prevent focus when pressing. */
  preventFocusOnPress?: boolean;
  /** Whether long press should cancel when pointer moves out of target. */
  shouldCancelOnPointerExit?: boolean;
  /** Whether text selection should be allowed during press. */
  allowTextSelectionOnPress?: boolean;
}

export interface PressResult {
  /** Whether the target is currently pressed. */
  isPressed: Accessor<boolean>;
  /** Props to spread on the target element. */
  pressProps: JSX.HTMLAttributes<HTMLElement>;
}

function isDisabledValue(isDisabled: Accessor<boolean> | boolean | undefined): boolean {
  if (typeof isDisabled === 'function') {
    return isDisabled();
  }
  return isDisabled ?? false;
}

function isPressedValue(isPressed: Accessor<boolean> | boolean | undefined): boolean {
  if (typeof isPressed === 'function') {
    return isPressed();
  }
  return isPressed ?? false;
}

// Symbol to track if a link click was handled by us
const LINK_CLICKED = Symbol('linkClicked');

// CSS for preventing double-tap zoom delay
let pressableCSSInjected = false;
function injectPressableCSS(): void {
  if (pressableCSSInjected || typeof document === 'undefined') return;

  const style = document.createElement('style');
  style.id = 'solidaria-pressable-style';
  style.textContent = `
    [data-solidaria-pressable] {
      touch-action: pan-x pan-y pinch-zoom;
    }
  `;
  document.head.appendChild(style);
  pressableCSSInjected = true;
}

/**
 * Handles press interactions across mouse, touch, keyboard, and screen readers.
 * Provides consistent press behavior regardless of input method.
 *
 * Based on react-aria's usePress but adapted for SolidJS.
 */
export function createPress(props: CreatePressProps = {}): PressResult {
  // Internal pressed state (for visual feedback)
  const [internalIsPressed, setInternalIsPressed] = createSignal(false);

  // Use controlled isPressed if provided, otherwise internal state
  const isPressed = (): boolean => {
    const controlledPressed = isPressedValue(props.isPressed);
    if (controlledPressed) {
      return controlledPressed;
    }
    return internalIsPressed();
  };

  // State tracking (using plain variables - SolidJS doesn't need refs for mutable state)
  let pressState = {
    isPressed: false,
    ignoreEmulatedMouseEvents: false,
    ignoreClickAfterPress: false,
    didFirePressStart: false,
    isTriggeringEvent: false,
    activePointerId: null as number | null,
    target: null as Element | null,
    isOverTarget: false,
    pointerType: null as PointerType | null,
    userSelect: undefined as string | undefined,
    metaKeyEvents: null as Map<string, KeyboardEvent> | null,
  };

  // Global listeners manager
  const { addGlobalListener, removeAllGlobalListeners } = createGlobalListeners();

  // Inject CSS on first use
  injectPressableCSS();

  // --- Event Triggers ---

  const triggerPressStart = (originalEvent: Event, pointerType: PointerType): boolean => {
    if (isDisabledValue(props.isDisabled) || pressState.didFirePressStart) {
      return false;
    }

    let shouldStopPropagation = true;
    pressState.isTriggeringEvent = true;

    if (props.onPressStart) {
      const event = createPressEvent('pressstart', pointerType, originalEvent, pressState.target!);
      props.onPressStart(event);
      shouldStopPropagation = event.shouldStopPropagation;
    }

    if (props.onPressChange) {
      props.onPressChange(true);
    }

    pressState.isTriggeringEvent = false;
    pressState.didFirePressStart = true;
    setInternalIsPressed(true);

    return shouldStopPropagation;
  };

  const triggerPressEnd = (originalEvent: Event, pointerType: PointerType, wasPressed = true): void => {
    if (!pressState.didFirePressStart) {
      return;
    }

    pressState.ignoreClickAfterPress = true;
    pressState.didFirePressStart = false;
    pressState.isTriggeringEvent = true;

    if (props.onPressEnd) {
      const event = createPressEvent('pressend', pointerType, originalEvent, pressState.target!);
      props.onPressEnd(event);
    }

    if (props.onPressChange) {
      props.onPressChange(false);
    }

    setInternalIsPressed(false);

    if (wasPressed && !isDisabledValue(props.isDisabled)) {
      if (props.onPress) {
        const event = createPressEvent('press', pointerType, originalEvent, pressState.target!);
        props.onPress(event);
      }
    }

    pressState.isTriggeringEvent = false;
  };

  const triggerPressUp = (originalEvent: Event, pointerType: PointerType): void => {
    if (isDisabledValue(props.isDisabled)) {
      return;
    }

    if (props.onPressUp) {
      pressState.isTriggeringEvent = true;
      const event = createPressEvent('pressup', pointerType, originalEvent, pressState.target!);
      props.onPressUp(event);
      pressState.isTriggeringEvent = false;
    }
  };

  const cancel = (originalEvent: Event): void => {
    if (!pressState.isPressed) {
      return;
    }

    if (pressState.isOverTarget && pressState.target) {
      triggerPressEnd(originalEvent, pressState.pointerType ?? 'mouse', false);
    }

    pressState.isPressed = false;
    pressState.isOverTarget = false;
    pressState.activePointerId = null;
    pressState.pointerType = null;

    removeAllGlobalListeners();

    if (!props.allowTextSelectionOnPress) {
      restoreTextSelection(pressState.target as HTMLElement);
    }
  };

  // --- Pointer Event Handlers ---

  const onPointerDown: JSX.EventHandler<HTMLElement, PointerEvent> = (e) => {
    // Only handle left button / primary pointer
    if (e.button !== 0 || !e.currentTarget.contains(e.target as Node)) {
      return;
    }

    // If already pressed, ignore
    if (pressState.isPressed) {
      return;
    }

    // iOS VoiceOver bug: fires pointer events with incorrect coordinates
    // Let the click handler deal with it instead
    if (isVirtualPointerEvent(e)) {
      pressState.pointerType = 'virtual';
      return;
    }

    // Ignore events that bubbled through portals
    if (!nodeContains(e.currentTarget, getEventTarget(e))) {
      return;
    }

    if (isDisabledValue(props.isDisabled)) {
      e.preventDefault();
      return;
    }

    // Prevent focus if requested
    if (props.preventFocusOnPress) {
      preventFocus(e.currentTarget);
    }

    pressState.pointerType = e.pointerType as PointerType;
    pressState.isPressed = true;
    pressState.isOverTarget = true;
    pressState.activePointerId = e.pointerId;
    pressState.target = e.currentTarget;

    if (!props.allowTextSelectionOnPress) {
      disableTextSelection(pressState.target as HTMLElement);
    }

    const shouldStopPropagation = triggerPressStart(e, pressState.pointerType);
    if (shouldStopPropagation) {
      e.stopPropagation();
    }

    // Set up global listeners for pointer events
    addGlobalListener('pointerup', onPointerUp);
    addGlobalListener('pointercancel', onPointerCancel);
  };

  const onPointerUp = (e: PointerEvent): void => {
    if (e.pointerId !== pressState.activePointerId || e.button !== 0) {
      return;
    }

    const target = pressState.target!;
    const isOverTarget = nodeContains(target, getEventTarget(e) as Element);

    if (isOverTarget && pressState.pointerType != null) {
      triggerPressUp(e, pressState.pointerType);
    }

    triggerPressEnd(e, pressState.pointerType ?? 'mouse', isOverTarget && pressState.isOverTarget);

    // Ignore the click event that will follow
    pressState.ignoreClickAfterPress = true;
    pressState.isPressed = false;
    pressState.isOverTarget = false;
    pressState.activePointerId = null;
    pressState.pointerType = null;

    removeAllGlobalListeners();

    if (!props.allowTextSelectionOnPress) {
      restoreTextSelection(target as HTMLElement);
    }

    // Focus the target if needed and we're over it
    if (!props.preventFocusOnPress && isOverTarget) {
      focusWithoutScrolling(target as HTMLElement);
    }
  };

  const onPointerCancel = (e: PointerEvent): void => {
    if (e.pointerId === pressState.activePointerId) {
      cancel(e);
    }
  };

  const onPointerEnter: JSX.EventHandler<HTMLElement, PointerEvent> = (e) => {
    if (e.pointerId !== pressState.activePointerId) {
      return;
    }

    if (pressState.target && pressState.isPressed && !pressState.isOverTarget && pressState.pointerType != null) {
      pressState.isOverTarget = true;
      triggerPressStart(e, pressState.pointerType);
    }
  };

  const onPointerLeave: JSX.EventHandler<HTMLElement, PointerEvent> = (e) => {
    if (e.pointerId !== pressState.activePointerId) {
      return;
    }

    if (pressState.target && pressState.isPressed && pressState.isOverTarget && pressState.pointerType != null) {
      pressState.isOverTarget = false;
      triggerPressEnd(e, pressState.pointerType, false);

      if (props.shouldCancelOnPointerExit) {
        cancel(e);
      }
    }
  };

  // --- Touch Event Handlers (fallback for testing/older browsers) ---

  const onTouchStart: JSX.EventHandler<HTMLElement, TouchEvent> = (e) => {
    if (isDisabledValue(props.isDisabled)) {
      return;
    }

    // If already pressed via pointer events, ignore touch events
    if (pressState.isPressed) {
      return;
    }

    const touch = getTouchFromEvent(e);
    if (!touch) {
      return;
    }

    pressState.activePointerId = touch.identifier;
    pressState.ignoreEmulatedMouseEvents = true;
    pressState.isOverTarget = true;
    pressState.isPressed = true;
    pressState.target = e.currentTarget;
    pressState.pointerType = 'touch';

    if (!props.allowTextSelectionOnPress) {
      disableTextSelection(pressState.target as HTMLElement);
    }

    const shouldStopPropagation = triggerPressStart(e, 'touch');
    if (shouldStopPropagation) {
      e.stopPropagation();
    }

    addGlobalListener('scroll', onScroll, { capture: true, isWindow: true });
  };

  const onTouchMove: JSX.EventHandler<HTMLElement, TouchEvent> = (e) => {
    if (!pressState.isPressed) {
      return;
    }

    const touch = getTouchById(e, pressState.activePointerId);
    if (!touch) {
      return;
    }

    const target = pressState.target!;
    const isOverTarget = isPointOverTarget(touch, target);

    if (isOverTarget !== pressState.isOverTarget) {
      pressState.isOverTarget = isOverTarget;
      if (isOverTarget) {
        triggerPressStart(e, 'touch');
      } else {
        triggerPressEnd(e, 'touch', false);

        if (props.shouldCancelOnPointerExit) {
          cancel(e);
        }
      }
    }
  };

  const onTouchEnd: JSX.EventHandler<HTMLElement, TouchEvent> = (e) => {
    if (!pressState.isPressed) {
      return;
    }

    const touch = getTouchById(e, pressState.activePointerId);
    if (!touch) {
      return;
    }

    const target = pressState.target!;
    const isOverTarget = isPointOverTarget(touch, target);

    if (isOverTarget) {
      triggerPressUp(e, 'touch');
    }

    triggerPressEnd(e, 'touch', isOverTarget && pressState.isOverTarget);

    pressState.isPressed = false;
    pressState.isOverTarget = false;
    pressState.activePointerId = null;
    pressState.pointerType = null;

    removeAllGlobalListeners();

    if (!props.allowTextSelectionOnPress) {
      restoreTextSelection(target as HTMLElement);
    }
  };

  const onTouchCancel: JSX.EventHandler<HTMLElement, TouchEvent> = (e) => {
    cancel(e);
  };

  const onScroll = (e: Event): void => {
    if (pressState.isPressed && nodeContains(e.target as Element, pressState.target)) {
      cancel(e);
    }
  };

  // --- Mouse Event Handlers (fallback for testing) ---

  const onMouseDown: JSX.EventHandler<HTMLElement, MouseEvent> = (e) => {
    // Only handle left button
    if (e.button !== 0) {
      return;
    }

    // If already pressed via pointer/touch, ignore
    if (pressState.isPressed) {
      return;
    }

    // Ignore emulated mouse events from touch
    if (pressState.ignoreEmulatedMouseEvents) {
      pressState.ignoreEmulatedMouseEvents = false;
      return;
    }

    if (isDisabledValue(props.isDisabled)) {
      return;
    }

    // Prevent focus if requested
    if (props.preventFocusOnPress) {
      e.preventDefault();
    }

    pressState.isPressed = true;
    pressState.isOverTarget = true;
    pressState.target = e.currentTarget;
    pressState.pointerType = 'mouse';

    const shouldStopPropagation = triggerPressStart(e, 'mouse');
    if (shouldStopPropagation) {
      e.stopPropagation();
    }

    addGlobalListener('mouseup', onMouseUp);
  };

  const onMouseUp = (e: MouseEvent): void => {
    if (e.button !== 0) {
      return;
    }

    pressState.isPressed = false;
    removeAllGlobalListeners();

    const target = pressState.target!;
    const isOverTarget = nodeContains(target, getEventTarget(e) as Element);

    if (isOverTarget) {
      triggerPressUp(e, 'mouse');
    }

    triggerPressEnd(e, 'mouse', isOverTarget && pressState.isOverTarget);

    pressState.isOverTarget = false;
  };

  const onMouseEnter: JSX.EventHandler<HTMLElement, MouseEvent> = (e) => {
    if (!pressState.isPressed || pressState.ignoreEmulatedMouseEvents) {
      return;
    }

    if (pressState.target && !pressState.isOverTarget) {
      pressState.isOverTarget = true;
      triggerPressStart(e, 'mouse');
    }
  };

  const onMouseLeave: JSX.EventHandler<HTMLElement, MouseEvent> = (e) => {
    if (!pressState.isPressed || pressState.ignoreEmulatedMouseEvents) {
      return;
    }

    if (pressState.target && pressState.isOverTarget) {
      pressState.isOverTarget = false;
      triggerPressEnd(e, 'mouse', false);

      if (props.shouldCancelOnPointerExit) {
        cancel(e);
      }
    }
  };

  // --- Keyboard Event Handlers ---

  const onKeyDown: JSX.EventHandler<HTMLElement, KeyboardEvent> = (e) => {
    if (isDisabledValue(props.isDisabled)) {
      return;
    }

    if (!isValidKeyboardEvent(e, e.currentTarget)) {
      // Allow event to propagate for invalid keys
      if (e.key === 'Enter') {
        e.stopPropagation();
      }
      return;
    }

    // Prevent key repeat
    if (e.repeat) {
      e.preventDefault();
      return;
    }

    pressState.target = e.currentTarget;
    pressState.isPressed = true;
    pressState.isOverTarget = true;
    pressState.pointerType = 'keyboard';

    const shouldStopPropagation = triggerPressStart(e, 'keyboard');
    if (shouldStopPropagation) {
      e.stopPropagation();
    }

    // Prevent default for non-native interactive elements
    if (shouldPreventDefaultKeyboard(e.currentTarget, e.key)) {
      e.preventDefault();
    }

    // macOS bug: keyup doesn't fire while Meta key is held
    // Track keydown events while Meta is held so we can manually dispatch keyup
    if (isMac() && e.metaKey && !e.ctrlKey && !e.altKey) {
      pressState.metaKeyEvents = pressState.metaKeyEvents || new Map();
      pressState.metaKeyEvents.set(e.key, e);
    }

    // For Enter key on native buttons, the click fires on keydown
    // Set flag to ignore it
    if (e.key === 'Enter') {
      pressState.ignoreClickAfterPress = true;
    }

    // Set up global keyup listener
    addGlobalListener('keyup', onKeyUp, { capture: true });
  };

  const onKeyUp = (e: KeyboardEvent): void => {
    if (!pressState.isPressed || pressState.pointerType !== 'keyboard') {
      return;
    }

    if (!isValidKeyboardEvent(e, pressState.target!)) {
      return;
    }

    // Handle macOS Meta key bug
    if (isMac() && e.key === 'Meta' && pressState.metaKeyEvents?.size) {
      // When Meta releases, dispatch keyup for any keys that were pressed during
      for (const [key, event] of pressState.metaKeyEvents) {
        pressState.target?.dispatchEvent(
          new KeyboardEvent('keyup', {
            key,
            code: event.code,
            bubbles: true,
            cancelable: true,
          })
        );
      }
      pressState.metaKeyEvents.clear();
      return;
    }

    const target = pressState.target!;
    triggerPressUp(e, 'keyboard');
    triggerPressEnd(e, 'keyboard', pressState.isOverTarget);

    pressState.isPressed = false;
    pressState.pointerType = null;

    removeAllGlobalListeners();

    // Prevent default to avoid triggering native action
    e.preventDefault();

    // Handle link activation with non-Enter keys (Space)
    // Native links only respond to Enter, but we want Space to work too
    if (e.key === ' ' && isHTMLAnchorLink(target) && !(target as any)[LINK_CLICKED]) {
      (target as any)[LINK_CLICKED] = true;
      openLink(target as HTMLAnchorElement, e);
      // Clean up the marker
      setTimeout(() => {
        delete (target as any)[LINK_CLICKED];
      }, 0);
    }

    // For Space key, the click fires after keyup
    // Set flag to ignore it
    if (e.key === ' ') {
      pressState.ignoreClickAfterPress = true;
    }
  };

  // --- Click Event Handler ---

  const onClick: JSX.EventHandler<HTMLElement, MouseEvent> = (e) => {
    // Don't handle click if it's not on the target
    if (e.currentTarget !== e.target && !nodeContains(e.currentTarget, e.target as Element)) {
      return;
    }

    // Ignore click if we already handled it via keyboard/pointer
    if (pressState.ignoreClickAfterPress) {
      pressState.ignoreClickAfterPress = false;
      return;
    }

    // Ignore emulated mouse events from touch
    if (pressState.ignoreEmulatedMouseEvents) {
      pressState.ignoreEmulatedMouseEvents = false;
      return;
    }

    // Handle virtual clicks (screen readers, element.click(), etc.)
    // Only trigger if not already pressed (prevents double-firing after pointer/touch events)
    if (!pressState.isPressed && (isVirtualClick(e) || pressState.pointerType === 'virtual')) {
      if (isDisabledValue(props.isDisabled)) {
        return;
      }

      pressState.target = e.currentTarget;
      pressState.pointerType = 'virtual';

      // Fire full press sequence for virtual clicks
      triggerPressStart(e, 'virtual');
      triggerPressUp(e, 'virtual');
      triggerPressEnd(e, 'virtual', true);

      pressState.pointerType = null;
    }
  };

  // --- Drag Event Handler ---

  const onDragStart: JSX.EventHandler<HTMLElement, DragEvent> = (e) => {
    // Safari doesn't fire pointercancel on drag, so we need to cancel manually
    if (pressState.isPressed) {
      cancel(e);
    }
  };

  // --- Build Props ---

  const pressProps = {
    onKeyDown,
    onKeyUp,
    onClick,
    onDragStart,
    // Pointer events (preferred)
    onPointerDown,
    onPointerEnter,
    onPointerLeave,
    // Touch events (fallback)
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel,
    // Mouse events (fallback)
    onMouseDown,
    onMouseEnter,
    onMouseLeave,
    // Attribute for CSS touch-action
    'data-solidaria-pressable': '',
  } as JSX.HTMLAttributes<HTMLElement> & { 'data-solidaria-pressable': string };

  // Clean up on unmount
  onCleanup(() => {
    removeAllGlobalListeners();
  });

  return {
    isPressed,
    pressProps,
  };
}
