/**
 * createFocus - Handles focus events for the immediate target.
 *
 * This is a 1-1 port of React-Aria's useFocus hook adapted for SolidJS.
 * Focus events on child elements will be ignored.
 */

import { JSX, onCleanup } from 'solid-js';
import { getOwnerDocument, getEventTarget } from '../utils';

export interface FocusEvents {
  /** Handler that is called when the element receives focus. */
  onFocus?: (e: FocusEvent) => void;
  /** Handler that is called when the element loses focus. */
  onBlur?: (e: FocusEvent) => void;
  /** Handler that is called when the element's focus status changes. */
  onFocusChange?: (isFocused: boolean) => void;
}

export interface CreateFocusProps extends FocusEvents {
  /** Whether the focus events should be disabled. */
  isDisabled?: boolean;
}

export interface FocusResult {
  /** Props to spread onto the target element. */
  focusProps: JSX.HTMLAttributes<HTMLElement>;
}

/**
 * Synthetic blur event handler for Firefox bug workaround.
 * React (and we) don't fire onBlur when an element is disabled.
 * Most browsers fire a native focusout event in this case, except for Firefox.
 * We use a MutationObserver to watch for the disabled attribute.
 */
function createSyntheticBlurHandler(
  onBlur: ((e: FocusEvent) => void) | undefined
): (_e: FocusEvent, target: Element) => (() => void) | undefined {
  let isFocused = false;
  let observer: MutationObserver | null = null;

  return (_e: FocusEvent, target: Element) => {
    if (
      target instanceof HTMLButtonElement ||
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement
    ) {
      isFocused = true;

      const onBlurHandler = (blurEvent: Event) => {
        isFocused = false;

        if ((target as HTMLButtonElement).disabled && onBlur) {
          onBlur(blurEvent as FocusEvent);
        }

        if (observer) {
          observer.disconnect();
          observer = null;
        }
      };

      target.addEventListener('focusout', onBlurHandler, { once: true });

      observer = new MutationObserver(() => {
        if (isFocused && (target as HTMLButtonElement).disabled) {
          observer?.disconnect();
          const relatedTarget = target === document.activeElement ? null : document.activeElement;
          target.dispatchEvent(new FocusEvent('blur', { relatedTarget }));
          target.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget }));
        }
      });

      observer.observe(target, { attributes: true, attributeFilter: ['disabled'] });

      // Return cleanup function
      return () => {
        if (observer) {
          observer.disconnect();
          observer = null;
        }
      };
    }

    return undefined;
  };
}

/**
 * Handles focus events for the immediate target.
 * Focus events on child elements will be ignored.
 *
 * Based on react-aria's useFocus but adapted for SolidJS.
 */
export function createFocus(props: CreateFocusProps = {}): FocusResult {
  const { isDisabled, onFocus: onFocusProp, onBlur: onBlurProp, onFocusChange } = props;

  let cleanupRef: (() => void) | undefined;
  const syntheticBlurHandler = createSyntheticBlurHandler(onBlurProp);

  // Cleanup on unmount
  onCleanup(() => {
    if (cleanupRef) {
      cleanupRef();
    }
  });

  const onBlur: JSX.EventHandler<HTMLElement, FocusEvent> = (e) => {
    // Only handle if target is the currentTarget (not bubbled from children)
    if (e.target === e.currentTarget) {
      if (onBlurProp) {
        onBlurProp(e);
      }

      if (onFocusChange) {
        onFocusChange(false);
      }
    }
  };

  const onFocus: JSX.EventHandler<HTMLElement, FocusEvent> = (e) => {
    // Double check that document.activeElement actually matches e.target
    // in case a previously chained focus handler already moved focus somewhere else.
    const ownerDocument = getOwnerDocument(e.target);
    const activeElement = ownerDocument?.activeElement;

    if (e.target === e.currentTarget && activeElement === getEventTarget(e)) {
      if (onFocusProp) {
        onFocusProp(e);
      }

      if (onFocusChange) {
        onFocusChange(true);
      }

      // Set up synthetic blur handler for Firefox bug
      cleanupRef = syntheticBlurHandler(e, e.target);
    }
  };

  // If disabled or no handlers, return empty props
  if (isDisabled) {
    return {
      focusProps: {},
    };
  }

  const hasHandlers = onFocusProp || onFocusChange || onBlurProp;

  return {
    focusProps: {
      onFocus: hasHandlers ? onFocus : undefined,
      onBlur: onBlurProp || onFocusChange ? onBlur : undefined,
    },
  };
}
