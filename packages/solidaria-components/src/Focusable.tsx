/**
 * Focusable component for solidaria-components
 *
 * A render-prop component that wraps createFocusable to make an element
 * focusable and capable of auto focus. Port of React Aria's Focusable.
 */

import { type JSX, children as resolveChildren, createEffect, onCleanup, splitProps } from 'solid-js';
import { createFocusable, type CreateFocusableProps } from '@proyecto-viviana/solidaria';

// ============================================
// TYPES
// ============================================

export interface FocusableProps extends CreateFocusableProps {
  /** A single child element to make focusable. */
  children: JSX.Element;
  /** Ref callback. */
  ref?: HTMLElement | ((el: HTMLElement) => void);
}

// ============================================
// COMPONENT
// ============================================

/**
 * Makes its child element focusable and capable of auto focus.
 * Applies focus and keyboard event handlers from createFocusable.
 *
 * @example
 * ```tsx
 * <Focusable onFocus={() => console.log('focused')}>
 *   <div tabIndex={0}>Focusable content</div>
 * </Focusable>
 * ```
 */
export function Focusable(props: FocusableProps): JSX.Element {
  const [local, focusableProps] = splitProps(props, ['children', 'ref']);

  let ref!: HTMLElement;
  const { focusableProps: domProps } = createFocusable(focusableProps, () => ref);

  const resolved = resolveChildren(() => local.children);

  createEffect(() => {
    const child = resolved() as HTMLElement;
    if (child instanceof HTMLElement) {
      ref = child;
      // Forward ref
      if (typeof local.ref === 'function') {
        local.ref(child);
      }

      // Apply focusable props to the child element
      const props = domProps;
      const listeners: Array<[string, EventListener]> = [];
      const addListener = (eventName: string, handler: unknown) => {
        if (typeof handler === 'function') {
          const listener = handler as EventListener;
          child.addEventListener(eventName, listener);
          listeners.push([eventName, listener]);
        }
      };

      addListener('focus', props.onFocus);
      addListener('blur', props.onBlur);
      addListener('keydown', props.onKeyDown);
      addListener('keyup', props.onKeyUp);

      onCleanup(() => {
        for (const [eventName, listener] of listeners) {
          child.removeEventListener(eventName, listener);
        }
      });
    }
  });

  return <>{resolved()}</>;
}
