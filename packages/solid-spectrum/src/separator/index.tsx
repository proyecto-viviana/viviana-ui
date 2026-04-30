/**
 * Separator component for proyecto-viviana-solid-spectrum
 *
 * Styled separator component built on top of solidaria-components.
 */

import { type JSX, splitProps, createMemo } from 'solid-js';
import {
  Separator as HeadlessSeparator,
  type SeparatorProps as HeadlessSeparatorProps,
} from '@proyecto-viviana/solidaria-components';

// ============================================
// TYPES
// ============================================

export type SeparatorVariant = 'default' | 'subtle' | 'strong';
export type SeparatorSize = 'sm' | 'md' | 'lg';

export interface SeparatorProps
  extends Omit<HeadlessSeparatorProps, 'class' | 'style'> {
  /** The visual style variant. @default 'default' */
  variant?: SeparatorVariant;
  /** The size/thickness of the separator. @default 'md' */
  size?: SeparatorSize;
  /** Additional CSS class name. */
  class?: string;
}

// ============================================
// STYLES
// ============================================

const variantStyles = {
  default: 'bg-bg-100',
  subtle: 'bg-bg-200',
  strong: 'bg-primary-600',
};

const horizontalSizeStyles = {
  sm: 'h-px',
  md: 'h-0.5',
  lg: 'h-1',
};

const verticalSizeStyles = {
  sm: 'w-px',
  md: 'w-0.5',
  lg: 'w-1',
};

// ============================================
// SEPARATOR COMPONENT
// ============================================

/**
 * A separator is a visual divider between two groups of content,
 * e.g. groups of menu items or sections of a page.
 *
 * @example
 * ```tsx
 * <Separator />
 *
 * // Vertical separator
 * <div class="flex items-center gap-4">
 *   <span>Item 1</span>
 *   <Separator orientation="vertical" />
 *   <span>Item 2</span>
 * </div>
 *
 * // Different variants
 * <Separator variant="strong" />
 * ```
 */
export function Separator(props: SeparatorProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, [
    'orientation',
    'variant',
    'size',
    'class',
  ]);

  const orientation = () => local.orientation ?? 'horizontal';
  const variant = () => local.variant ?? 'default';
  const size = () => local.size ?? 'md';

  // Build class string
  const className = createMemo(() => {
    const isVertical = orientation() === 'vertical';
    const sizeStyles = isVertical ? verticalSizeStyles : horizontalSizeStyles;

    const base = [
      variantStyles[variant()],
      sizeStyles[size()],
      isVertical ? 'h-full self-stretch' : 'w-full',
      'border-0', // Reset hr default border
      local.class ?? '',
    ];

    return base.filter(Boolean).join(' ');
  });

  return (
    <HeadlessSeparator
      {...headlessProps}
      orientation={orientation()}
      class={className()}
    />
  );
}
