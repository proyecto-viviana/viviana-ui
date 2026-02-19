/**
 * Illustration component for proyecto-viviana-ui
 *
 * A styled illustration container for decorative or explanatory images.
 */

import { type JSX, splitProps } from 'solid-js';

// ============================================
// TYPES
// ============================================

export type IllustrationSize = 'sm' | 'md' | 'lg';

export interface IllustrationProps {
  /** The size of the illustration. @default 'md' */
  size?: IllustrationSize;
  /** Additional CSS class name. */
  class?: string;
  /** The illustration content (SVG or image). */
  children?: JSX.Element;
  /** Accessibility label. */
  'aria-label'?: string;
}

// ============================================
// STYLES
// ============================================

const sizeStyles: Record<IllustrationSize, string> = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
};

// ============================================
// COMPONENT
// ============================================

/**
 * A styled container for decorative illustrations.
 */
export function Illustration(props: IllustrationProps): JSX.Element {
  const [local, rest] = splitProps(props, ['size', 'class', 'children']);

  return (
    <div
      {...rest}
      role={rest['aria-label'] ? 'img' : 'presentation'}
      class={`inline-flex items-center justify-center text-primary-300 ${sizeStyles[local.size ?? 'md']} ${local.class ?? ''}`}
    >
      {local.children}
    </div>
  );
}
