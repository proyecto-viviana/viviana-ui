/**
 * UIIcon component for proyecto-viviana-solid-spectrum
 *
 * A utility icon component for internal UI icons (chevrons, close, etc).
 */

import { type JSX, splitProps } from 'solid-js';

// ============================================
// TYPES
// ============================================

export type UIIconSize = 'xs' | 'sm' | 'md' | 'lg';

export interface UIIconProps {
  /** The size of the icon. @default 'md' */
  size?: UIIconSize;
  /** Additional CSS class name. */
  class?: string;
  /** The SVG content or icon element. */
  children?: JSX.Element;
  /** Accessibility label. */
  'aria-label'?: string;
  /** Whether the icon is hidden from screen readers. @default true */
  'aria-hidden'?: boolean;
}

// ============================================
// STYLES
// ============================================

const sizeStyles: Record<UIIconSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

// ============================================
// COMPONENT
// ============================================

/**
 * A utility icon wrapper for internal UI icons.
 */
export function UIIcon(props: UIIconProps): JSX.Element {
  const [local, rest] = splitProps(props, ['size', 'class', 'children']);

  return (
    <span
      {...rest}
      role={rest['aria-label'] ? 'img' : undefined}
      aria-hidden={rest['aria-hidden'] ?? !rest['aria-label']}
      class={`inline-flex items-center justify-center shrink-0 ${sizeStyles[local.size ?? 'md']} ${local.class ?? ''}`}
    >
      {local.children}
    </span>
  );
}
