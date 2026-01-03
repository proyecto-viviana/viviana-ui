/**
 * createDisclosure hook for Solidaria
 *
 * Provides the behavior and accessibility implementation for a disclosure component.
 *
 * Port of @react-aria/disclosure useDisclosure.
 */

import { type JSX, createEffect } from 'solid-js';
import { type DisclosureState } from '@proyecto-viviana/solid-stately';
import { createId, canUseDOM } from '../ssr';
import { createPress } from '../interactions/createPress';
import { mergeProps } from '../utils/mergeProps';

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
 *   const { buttonProps, panelProps } = createDisclosure(
 *     { get isDisabled() { return props.isDisabled; } },
 *     state,
 *     () => panelRef
 *   );
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
  props: AriaDisclosureProps | (() => AriaDisclosureProps),
  state: DisclosureState,
  panelRef: () => HTMLElement | null
): DisclosureAria {
  // Handle both plain object and accessor function patterns
  const getProps = typeof props === 'function' ? props : () => props;

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

  // Use createPress for proper interaction handling (matches Select/Menu pattern)
  const { pressProps } = createPress({
    get isDisabled() {
      return getProps().isDisabled;
    },
    onPress() {
      state.toggle();
    },
  });

  return {
    // Button props - merge with pressProps for consistent interaction handling
    // Using getter (not createMemo) to match createSelect pattern
    get buttonProps(): JSX.ButtonHTMLAttributes<HTMLButtonElement> {
      const p = getProps();
      // Note: Don't add duplicate onKeyDown handler here!
      // createPress already handles Enter/Space via its onPress callback.
      // Adding another toggle call would double-toggle (toggle on keydown, toggle again on keyup).
      return mergeProps(
        pressProps as Record<string, unknown>,
        {
          id: triggerId,
          type: 'button',
          'aria-expanded': state.isExpanded(),
          'aria-controls': panelId,
          disabled: p.isDisabled,
        } as Record<string, unknown>
      ) as JSX.ButtonHTMLAttributes<HTMLButtonElement>;
    },
    // Panel props
    get panelProps(): JSX.HTMLAttributes<HTMLElement> {
      return {
        id: panelId,
        role: 'region',
        'aria-labelledby': triggerId,
        hidden: !state.isExpanded() || undefined,
      };
    },
  };
}
