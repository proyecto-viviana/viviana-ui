/**
 * Pressable component for solidaria-components
 *
 * A render-prop component that wraps createPress + createFocusable
 * to make an element pressable. Port of React Aria's Pressable.
 */

import { type JSX, children as resolveChildren, createEffect, onCleanup, splitProps } from 'solid-js';
import {
  createPress,
  createFocusable,
  type CreatePressProps,
  type CreateFocusableProps,
} from '@proyecto-viviana/solidaria';

// ============================================
// TYPES
// ============================================

export interface PressableProps extends CreatePressProps {
  /** A single child element to make pressable. */
  children: JSX.Element;
  /** Ref callback. */
  ref?: HTMLElement | ((el: HTMLElement) => void);
}

// ============================================
// COMPONENT
// ============================================

/**
 * Makes its child element pressable and focusable.
 * Combines createPress and createFocusable for full interaction support.
 *
 * @example
 * ```tsx
 * <Pressable onPress={() => console.log('pressed')}>
 *   <div role="button" tabIndex={0}>Click me</div>
 * </Pressable>
 * ```
 */
export function Pressable(props: PressableProps): JSX.Element {
  const [local, pressProps] = splitProps(props, ['children', 'ref']);

  let ref!: HTMLElement;
  const { pressProps: domPressProps } = createPress(pressProps);
  const { focusableProps: domFocusableProps } = createFocusable(pressProps as CreateFocusableProps, () => ref);

  const resolved = resolveChildren(() => local.children);

  createEffect(() => {
    const child = resolved() as HTMLElement;
    if (child instanceof HTMLElement) {
      ref = child;
      // Forward ref
      if (typeof local.ref === 'function') {
        local.ref(child);
      }

      // Apply press props
      const allProps = { ...domFocusableProps, ...domPressProps };
      const listeners: Array<[string, EventListener]> = [];
      for (const [key, handler] of Object.entries(allProps)) {
        if (key.startsWith('on') && typeof handler === 'function') {
          const eventName = key.slice(2).toLowerCase();
          const listener = handler as EventListener;
          child.addEventListener(eventName, listener);
          listeners.push([eventName, listener]);
        }
      }

      onCleanup(() => {
        for (const [eventName, listener] of listeners) {
          child.removeEventListener(eventName, listener);
        }
      });
    }
  });

  return <>{resolved()}</>;
}
