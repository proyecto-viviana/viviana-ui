/**
 * Tray component for proyecto-viviana-ui
 *
 * A bottom-sheet mobile overlay.
 */

import { type JSX, splitProps } from 'solid-js';
import {
  ModalOverlay as HeadlessModalOverlay,
  Modal as HeadlessModal,
  type ModalOverlayProps as HeadlessModalOverlayProps,
} from '@proyecto-viviana/solidaria-components';

// ============================================
// TYPES
// ============================================

export interface TrayProps extends Omit<HeadlessModalOverlayProps, 'class'> {
  /** Additional CSS class name. */
  class?: string;
  /** The content of the tray. */
  children?: JSX.Element;
}

// ============================================
// COMPONENT
// ============================================

/**
 * A bottom-sheet overlay for mobile contexts.
 */
export function Tray(props: TrayProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class', 'children']);

  return (
    <HeadlessModalOverlay
      {...headlessProps}
      class="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
    >
      <HeadlessModal
        class={`w-full max-h-[90vh] bg-bg-300 rounded-t-2xl shadow-xl border-t border-primary-700 overflow-auto ${local.class ?? ''}`}
      >
        <div class="w-12 h-1 rounded-full bg-primary-500 mx-auto mt-2 mb-4" />
        {local.children}
      </HeadlessModal>
    </HeadlessModalOverlay>
  );
}
