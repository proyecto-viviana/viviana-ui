/**
 * createFocusWithin - Handles focus events for the target and its descendants.
 *
 * This is a 1-1 port of React-Aria's useFocusWithin hook adapted for SolidJS.
 */

import { JSX, onCleanup } from 'solid-js';
import { getOwnerDocument, getEventTarget, nodeContains, createGlobalListeners } from '../utils';
import { setEventTarget } from '../utils/events';

export interface FocusWithinProps {
  /** Whether the focus within events should be disabled. */
  isDisabled?: boolean;
  /** Handler that is called when the target element or a descendant receives focus. */
  onFocusWithin?: (e: FocusEvent) => void;
  /** Handler that is called when the target element and all descendants lose focus. */
  onBlurWithin?: (e: FocusEvent) => void;
  /** Handler that is called when the focus within state changes. */
  onFocusWithinChange?: (isFocusWithin: boolean) => void;
}

export interface FocusWithinResult {
  /** Props to spread onto the target element. */
  focusWithinProps: JSX.HTMLAttributes<HTMLElement>;
}

/**
 * Handles focus events for the target and its descendants.
 *
 * Based on react-aria's useFocusWithin but adapted for SolidJS.
 */
export function createFocusWithin(props: FocusWithinProps = {}): FocusWithinResult {
  const { isDisabled, onBlurWithin, onFocusWithin, onFocusWithinChange } = props;

  // State tracking
  let isFocusWithin = false;

  // Global listeners manager
  const { addGlobalListener, removeAllGlobalListeners } = createGlobalListeners();

  // Cleanup on unmount
  onCleanup(() => {
    removeAllGlobalListeners();
  });

  const onBlur: JSX.EventHandler<HTMLElement, FocusEvent> = (e) => {
    // Ignore events bubbling through portals
    if (!e.currentTarget.contains(e.target as Node)) {
      return;
    }

    // We don't want to trigger onBlurWithin and then immediately onFocusWithin again
    // when moving focus inside the element. Only trigger if the currentTarget doesn't
    // include the relatedTarget (where focus is moving).
    if (isFocusWithin && !e.currentTarget.contains(e.relatedTarget as Node)) {
      isFocusWithin = false;
      removeAllGlobalListeners();

      if (onBlurWithin) {
        onBlurWithin(e);
      }

      if (onFocusWithinChange) {
        onFocusWithinChange(false);
      }
    }
  };

  const onFocus: JSX.EventHandler<HTMLElement, FocusEvent> = (e) => {
    // Ignore events bubbling through portals
    if (!e.currentTarget.contains(e.target as Node)) {
      return;
    }

    // Double check that document.activeElement actually matches e.target
    // in case a previously chained focus handler already moved focus somewhere else.
    const ownerDocument = getOwnerDocument(e.target);
    const activeElement = ownerDocument?.activeElement;

    if (!isFocusWithin && activeElement === getEventTarget(e)) {
      if (onFocusWithin) {
        onFocusWithin(e);
      }

      if (onFocusWithinChange) {
        onFocusWithinChange(true);
      }

      isFocusWithin = true;

      // Browsers don't fire blur events when elements are removed from the DOM.
      // However, if a focus event occurs outside the element we're tracking, we
      // can manually fire onBlur.
      const currentTarget = e.currentTarget;

      addGlobalListener(
        'focus',
        (focusEvent: Event) => {
          if (isFocusWithin && !nodeContains(currentTarget, (focusEvent as FocusEvent).target as Element)) {
            // Create a synthetic blur event
            const window = ownerDocument?.defaultView;
            if (window) {
              const nativeEvent = new window.FocusEvent('blur', {
                relatedTarget: (focusEvent as FocusEvent).target as Element,
              });
              setEventTarget(nativeEvent, currentTarget);

              isFocusWithin = false;
              removeAllGlobalListeners();

              if (onBlurWithin) {
                onBlurWithin(nativeEvent);
              }

              if (onFocusWithinChange) {
                onFocusWithinChange(false);
              }
            }
          }
        },
        { capture: true }
      );
    }
  };

  if (isDisabled) {
    return {
      focusWithinProps: {
        onFocus: undefined,
        onBlur: undefined,
      },
    };
  }

  return {
    focusWithinProps: {
      onFocus,
      onBlur,
    },
  };
}
