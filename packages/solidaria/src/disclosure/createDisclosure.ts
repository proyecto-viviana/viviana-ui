/**
 * createDisclosure hook for Solidaria
 *
 * Provides the behavior and accessibility implementation for a disclosure component.
 *
 * Port of @react-aria/disclosure useDisclosure.
 */

import { type JSX, createMemo, createEffect } from 'solid-js';
import { type DisclosureState } from '@proyecto-viviana/solid-stately';
import { createId, canUseDOM } from '../ssr';

// ============================================
// TYPES
// ============================================

export interface AriaDisclosureProps {
  /** Whether the disclosure is disabled. */
  isDisabled?: boolean;
}

export interface DisclosureAria {
  /** Props for the disclosure trigger button. */
  buttonProps: JSX.ButtonHTMLAttributes<HTMLButtonElement>;
  /** Props for the disclosure panel. */
  panelProps: JSX.HTMLAttributes<HTMLElement>;
}

// ============================================
// IMPLEMENTATION
// ============================================

/**
 * Provides the behavior and accessibility implementation for a disclosure component.
 *
 * A disclosure is a widget that can be toggled to show or hide content.
 * It consists of a trigger button and a panel.
 *
 * @example
 * ```tsx
 * import { createDisclosure } from 'solidaria';
 * import { createDisclosureState } from 'solid-stately';
 *
 * function Disclosure(props) {
 *   const state = createDisclosureState(props);
 *   let panelRef;
 *   const { buttonProps, panelProps } = createDisclosure(props, state, () => panelRef);
 *
 *   return (
 *     <div>
 *       <button {...buttonProps}>Toggle</button>
 *       <div {...panelProps} ref={panelRef}>
 *         {props.children}
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 */
export function createDisclosure(
  props: AriaDisclosureProps,
  state: DisclosureState,
  panelRef: () => HTMLElement | null
): DisclosureAria {
  const triggerId = createId();
  const panelId = createId();

  // Handle panel visibility with hidden attribute
  createEffect(() => {
    if (!canUseDOM) return;

    const panel = panelRef();
    if (!panel) return;

    if (state.isExpanded()) {
      panel.removeAttribute('hidden');
    } else {
      // Use 'until-found' for find-in-page support where available
      panel.setAttribute('hidden', 'until-found');
    }
  });

  // Button props
  const buttonProps = createMemo<JSX.ButtonHTMLAttributes<HTMLButtonElement>>(() => ({
    id: triggerId,
    type: 'button',
    'aria-expanded': state.isExpanded(),
    'aria-controls': panelId,
    disabled: props.isDisabled,
    onClick: () => {
      if (!props.isDisabled) {
        state.toggle();
      }
    },
    onKeyDown: (e: KeyboardEvent) => {
      if (props.isDisabled) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        state.toggle();
      }
    },
  }));

  // Panel props
  const panelProps = createMemo<JSX.HTMLAttributes<HTMLElement>>(() => ({
    id: panelId,
    role: 'region',
    'aria-labelledby': triggerId,
    hidden: !state.isExpanded() || undefined,
  }));

  return {
    get buttonProps() { return buttonProps(); },
    get panelProps() { return panelProps(); },
  };
}
