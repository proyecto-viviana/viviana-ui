/**
 * Link component for proyecto-viviana-silapse
 *
 * Styled link component built on top of solidaria-components.
 */

import { type JSX, splitProps } from 'solid-js';
import {
  Link as HeadlessLink,
  type LinkProps as HeadlessLinkProps,
  type LinkRenderProps,
} from '@proyecto-viviana/solidaria-components';

// ============================================
// TYPES
// ============================================

export type LinkVariant = 'primary' | 'secondary' | 'subtle';

export interface LinkProps extends Omit<HeadlessLinkProps, 'class' | 'style' | 'children'> {
  /** The visual style of the link. @default 'primary' */
  variant?: LinkVariant;
  /** Whether the link is on its own vs inside a longer string of text. */
  isStandalone?: boolean;
  /** Whether the link should be displayed with a quiet style (no underline by default). */
  isQuiet?: boolean;
  /** Additional CSS class name. */
  class?: string;
  /** The content of the link. */
  children?: JSX.Element;
}

// ============================================
// STYLES
// ============================================

const variantStyles = {
  primary: 'text-accent hover:text-accent-300',
  secondary: 'text-primary-300 hover:text-primary-200',
  subtle: 'text-primary-400 hover:text-primary-300',
};

// ============================================
// LINK COMPONENT
// ============================================

/**
 * Links allow users to navigate to a different location.
 * They can be presented inline inside a paragraph or as standalone text.
 *
 * Built on solidaria-components Link for full accessibility support.
 *
 * @example
 * ```tsx
 * <Link href="/about">About Us</Link>
 *
 * // Secondary variant
 * <Link href="/help" variant="secondary">Help</Link>
 *
 * // Standalone (bold, no underline until hover)
 * <Link href="/home" isStandalone isQuiet>Home</Link>
 * ```
 */
export function Link(props: LinkProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, [
    'variant',
    'isStandalone',
    'isQuiet',
    'class',
  ]);

  const variant = local.variant ?? 'primary';
  const customClass = local.class ?? '';

  // Generate class based on render props
  const getClassName = (renderProps: LinkRenderProps): string => {
    const base = 'transition-colors duration-200 cursor-pointer rounded-sm outline-none';

    // Variant colors
    const variantClass = variantStyles[variant];

    // Underline behavior
    let underlineClass: string;
    if (local.isStandalone && local.isQuiet) {
      // Quiet standalone: no underline by default, underline on hover/focus
      underlineClass = renderProps.isHovered || renderProps.isFocusVisible
        ? 'underline'
        : 'no-underline';
    } else {
      // Inline links always have underline for accessibility
      underlineClass = 'underline';
    }

    // Font weight for standalone
    const weightClass = local.isStandalone ? 'font-medium' : '';

    // Focus ring
    const focusClass = renderProps.isFocusVisible
      ? 'ring-2 ring-accent-300 ring-offset-2 ring-offset-bg-400'
      : '';

    // Disabled state
    const disabledClass = renderProps.isDisabled
      ? 'opacity-50 cursor-not-allowed'
      : '';

    // Pressed state
    const pressedClass = renderProps.isPressed ? 'opacity-80' : '';

    return [
      base,
      variantClass,
      underlineClass,
      weightClass,
      focusClass,
      disabledClass,
      pressedClass,
      customClass,
    ].filter(Boolean).join(' ');
  };

  return (
    <HeadlessLink
      {...headlessProps}
      class={getClassName}
    >
      {props.children}
    </HeadlessLink>
  );
}
