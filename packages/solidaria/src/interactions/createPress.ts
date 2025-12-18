import { createSignal, JSX, Accessor } from 'solid-js';

export interface PressEvent {
  type: 'pressstart' | 'pressend' | 'pressup' | 'press';
  pointerType: 'mouse' | 'pen' | 'touch' | 'keyboard' | 'virtual';
  target: Element;
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
}

export interface CreatePressProps {
  isDisabled?: Accessor<boolean> | boolean;
  onPress?: (e: PressEvent) => void;
  onPressStart?: (e: PressEvent) => void;
  onPressEnd?: (e: PressEvent) => void;
  onPressUp?: (e: PressEvent) => void;
  onPressChange?: (isPressed: boolean) => void;
  preventFocusOnPress?: boolean;
}

export interface PressResult {
  isPressed: Accessor<boolean>;
  pressProps: JSX.HTMLAttributes<HTMLElement>;
}

function isDisabledValue(isDisabled: Accessor<boolean> | boolean | undefined): boolean {
  if (typeof isDisabled === 'function') {
    return isDisabled();
  }
  return isDisabled ?? false;
}

/**
 * Handles press interactions across mouse, touch, keyboard and virtual clicks.
 * Provides consistent press behavior regardless of input method.
 *
 * Based on react-aria's usePress but adapted for SolidJS.
 */
export function createPress(props: CreatePressProps = {}): PressResult {
  const [isPressed, setIsPressed] = createSignal(false);

  let pressTarget: Element | null = null;
  let pointerType: PressEvent['pointerType'] = 'mouse';
  let ignoreClickAfterPress = false;

  const createPressEvent = (
    type: PressEvent['type'],
    target: Element,
    originalEvent: Event
  ): PressEvent => {
    const event = originalEvent as MouseEvent | KeyboardEvent;
    return {
      type,
      pointerType,
      target,
      shiftKey: 'shiftKey' in event ? event.shiftKey : false,
      ctrlKey: 'ctrlKey' in event ? event.ctrlKey : false,
      metaKey: 'metaKey' in event ? event.metaKey : false,
      altKey: 'altKey' in event ? event.altKey : false,
    };
  };

  const triggerPressStart = (target: Element, originalEvent: Event) => {
    if (isDisabledValue(props.isDisabled)) return;

    setIsPressed(true);
    props.onPressChange?.(true);
    props.onPressStart?.(createPressEvent('pressstart', target, originalEvent));
  };

  const triggerPressEnd = (target: Element, originalEvent: Event, wasPressed = true) => {
    setIsPressed(false);
    props.onPressChange?.(false);
    props.onPressEnd?.(createPressEvent('pressend', target, originalEvent));

    if (wasPressed && !isDisabledValue(props.isDisabled)) {
      props.onPressUp?.(createPressEvent('pressup', target, originalEvent));
      props.onPress?.(createPressEvent('press', target, originalEvent));
    }
  };

  const onKeyDown: JSX.EventHandler<HTMLElement, KeyboardEvent> = (e) => {
    if (isDisabledValue(props.isDisabled)) return;

    if (e.key === 'Enter' || e.key === ' ') {
      if (e.key === ' ') {
        e.preventDefault();
      }

      if (!e.repeat) {
        pointerType = 'keyboard';
        pressTarget = e.currentTarget;
        triggerPressStart(e.currentTarget, e);

        // For Enter on native buttons, the click fires on keydown (before keyup).
        // Set flag to ignore the synthetic click.
        if (e.key === 'Enter') {
          ignoreClickAfterPress = true;
        }
      }
    }
  };

  const onKeyUp: JSX.EventHandler<HTMLElement, KeyboardEvent> = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (pressTarget) {
        triggerPressEnd(pressTarget, e);
        pressTarget = null;
      }

      // Reset the flag after keyup (for Space which fires click after keyup)
      if (e.key === ' ') {
        ignoreClickAfterPress = true;
        setTimeout(() => {
          ignoreClickAfterPress = false;
        }, 0);
      }
    }
  };

  const onPointerDown: JSX.EventHandler<HTMLElement, PointerEvent> = (e) => {
    if (isDisabledValue(props.isDisabled) || e.button !== 0) return;

    pointerType = e.pointerType as PressEvent['pointerType'];
    pressTarget = e.currentTarget;
    triggerPressStart(e.currentTarget, e);

    const doc = e.currentTarget.ownerDocument;

    const onPointerUp = (upEvent: PointerEvent) => {
      if (pressTarget) {
        const isOverTarget = pressTarget.contains(upEvent.target as Node);
        triggerPressEnd(pressTarget, upEvent, isOverTarget);
        pressTarget = null;
      }
      cleanup();
    };

    const onPointerCancel = () => {
      if (pressTarget) {
        setIsPressed(false);
        props.onPressChange?.(false);
        pressTarget = null;
      }
      cleanup();
    };

    const cleanup = () => {
      doc.removeEventListener('pointerup', onPointerUp);
      doc.removeEventListener('pointercancel', onPointerCancel);
    };

    doc.addEventListener('pointerup', onPointerUp);
    doc.addEventListener('pointercancel', onPointerCancel);
  };

  const onClick: JSX.EventHandler<HTMLElement, MouseEvent> = (e) => {
    // Ignore click events that fire after keyboard activation
    if (ignoreClickAfterPress) {
      ignoreClickAfterPress = false;
      return;
    }

    // Handle virtual clicks (e.g., from screen readers)
    // Only trigger if pointerType is not 'keyboard' (keyboard already handled via keyup)
    if (e.detail === 0 && pointerType !== 'keyboard' && !isDisabledValue(props.isDisabled)) {
      pointerType = 'virtual';
      props.onPress?.(createPressEvent('press', e.currentTarget, e));
    }
  };

  const pressProps: JSX.HTMLAttributes<HTMLElement> = {
    onKeyDown,
    onKeyUp,
    onPointerDown,
    onClick,
  };

  return {
    isPressed,
    pressProps,
  };
}
