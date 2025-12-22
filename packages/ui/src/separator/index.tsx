/**
 * Separator component for proyecto-viviana-ui
 *
 * Styled separator component built on top of solidaria hook directly.
 */

import { type JSX, splitProps, createMemo, Show } from 'solid-js';
import { createSeparator, type Orientation } from '@proyecto-viviana/solidaria';

// ============================================
// TYPES
// ============================================

export type SeparatorVariant = 'default' | 'subtle' | 'strong';
export type SeparatorSize = 'sm' | 'md' | 'lg';

export interface SeparatorProps {
  /** The orientation of the separator. @default 'horizontal' */
  orientation?: Orientation;
  /** The visual style variant. @default 'default' */
  variant?: SeparatorVariant;
  /** The size/thickness of the separator. @default 'md' */
  size?: SeparatorSize;
  /** Additional CSS class name. */
  class?: string;
  /** An accessibility label for the separator. */
  'aria-label'?: string;
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
  const [local, ariaProps] = splitProps(props, [
    'orientation',
    'variant',
    'size',
    'class',
  ]);

  const orientation = () => local.orientation ?? 'horizontal';
  const variant = () => local.variant ?? 'default';
  const size = () => local.size ?? 'md';

  // Determine the element type
  const elementType = createMemo(() => {
    // If vertical, use div since hr is inherently horizontal
    if (orientation() === 'vertical') {
      return 'div';
    }
    return 'hr';
  });

  // Create separator aria props
  const separatorAria = createSeparator({
    get orientation() { return orientation(); },
    get elementType() { return elementType(); },
    get 'aria-label'() { return ariaProps['aria-label']; },
  });

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

  // Extract props without ref to avoid type issues with specific element types
  const getAriaProps = () => {
    const { ref: _, ...props } = separatorAria.separatorProps as Record<string, unknown>;
    return props;
  };

  return (
    <Show
      when={orientation() === 'vertical'}
      fallback={
        <hr
          {...getAriaProps()}
          class={className()}
        />
      }
    >
      <div
        {...getAriaProps()}
        class={className()}
      />
    </Show>
  );
}
