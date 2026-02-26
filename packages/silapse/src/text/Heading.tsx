/**
 * Heading component for proyecto-viviana-silapse
 *
 * Styled heading (h1-h6) with configurable level and size.
 */

import { type JSX, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

// ============================================
// TYPES
// ============================================

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps {
  /** The heading level (1-6). @default 3 */
  level?: HeadingLevel;
  /** Additional CSS class name. */
  class?: string;
  /** An accessibility id. */
  id?: string;
  /** The content of the heading. */
  children?: JSX.Element;
}

// ============================================
// STYLES
// ============================================

const levelStyles: Record<HeadingLevel, string> = {
  1: 'text-4xl font-bold',
  2: 'text-3xl font-bold',
  3: 'text-2xl font-semibold',
  4: 'text-xl font-semibold',
  5: 'text-lg font-medium',
  6: 'text-base font-medium',
};

// ============================================
// COMPONENT
// ============================================

/**
 * A styled heading component with configurable level.
 */
export function Heading(props: HeadingProps): JSX.Element {
  const [local, rest] = splitProps(props, ['level', 'class', 'children']);
  const level = () => local.level ?? 3;
  const tag = () => `h${level()}` as keyof JSX.IntrinsicElements;

  return (
    <Dynamic
      component={tag()}
      {...rest}
      class={`text-primary-100 ${levelStyles[level()]} ${local.class ?? ''}`}
    >
      {local.children}
    </Dynamic>
  );
}
