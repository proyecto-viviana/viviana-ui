/**
 * Modal component for proyecto-viviana-ui
 *
 * A styled ModalOverlay + Modal combination.
 */

import { type JSX, splitProps } from 'solid-js';
import {
  Modal as HeadlessModal,
  ModalOverlay as HeadlessModalOverlay,
  type ModalProps as HeadlessModalProps,
  type ModalOverlayProps as HeadlessModalOverlayProps,
  type ModalRenderProps,
} from '@proyecto-viviana/solidaria-components';

// ============================================
// TYPES
// ============================================

export type ModalSize = 'sm' | 'md' | 'lg' | 'fullscreen';

export interface StyledModalProps extends Omit<HeadlessModalOverlayProps, 'class'> {
  /** The size of the modal. @default 'md' */
  size?: ModalSize;
  /** Additional CSS class name. */
  class?: string;
  /** The content of the modal. */
  children?: JSX.Element;
}

// ============================================
// STYLES
// ============================================

const sizeStyles: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-3xl',
  fullscreen: 'max-w-full h-full',
};

// ============================================
// COMPONENT
// ============================================

/**
 * A styled modal overlay with sizing options.
 */
export function StyledModal(props: StyledModalProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['size', 'class', 'children']);

  return (
    <HeadlessModalOverlay
      {...headlessProps}
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <HeadlessModal
        class={`w-full ${sizeStyles[local.size ?? 'md']} bg-bg-300 rounded-lg shadow-xl border border-primary-700 ${local.class ?? ''}`}
      >
        {local.children}
      </HeadlessModal>
    </HeadlessModalOverlay>
  );
}
