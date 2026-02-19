/**
 * Overlay component for proyecto-viviana-ui
 *
 * A generic overlay container for positioning content above the page.
 */

import { type JSX, splitProps, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

// ============================================
// TYPES
// ============================================

export interface OverlayProps {
  /** Whether the overlay is currently open. */
  isOpen?: boolean;
  /** The content of the overlay. */
  children?: JSX.Element;
  /** Additional CSS class name. */
  class?: string;
  /** The container element to render the overlay into. */
  container?: HTMLElement;
}

// ============================================
// COMPONENT
// ============================================

/**
 * A generic overlay container that renders content above the page via a portal.
 */
export function Overlay(props: OverlayProps): JSX.Element {
  const [local] = splitProps(props, ['isOpen', 'children', 'class', 'container']);

  return (
    <Show when={local.isOpen}>
      <Portal mount={local.container}>
        <div class={`fixed z-50 ${local.class ?? ''}`}>
          {local.children}
        </div>
      </Portal>
    </Show>
  );
}
