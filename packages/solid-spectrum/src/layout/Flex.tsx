/**
 * Flex component for proyecto-viviana-solid-spectrum
 *
 * A styled flex container with gap, direction, wrap, align, and justify props.
 */

import { type JSX, splitProps } from 'solid-js';

// ============================================
// TYPES
// ============================================

export interface FlexProps {
  /** The flex direction. @default 'row' */
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  /** The gap between items. Accepts Tailwind gap values. @default '0' */
  gap?: string | number;
  /** Whether items should wrap. @default false */
  wrap?: boolean | 'wrap' | 'nowrap' | 'wrap-reverse';
  /** The alignment of items. */
  alignItems?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /** The justification of items. */
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  /** Whether the flex container is inline. */
  inline?: boolean;
  /** Additional CSS class name. */
  class?: string;
  /** The content. */
  children?: JSX.Element;
}

// ============================================
// HELPERS
// ============================================

const directionMap: Record<string, string> = {
  'row': 'flex-row',
  'column': 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'column-reverse': 'flex-col-reverse',
};

const alignMap: Record<string, string> = {
  'start': 'items-start',
  'center': 'items-center',
  'end': 'items-end',
  'stretch': 'items-stretch',
  'baseline': 'items-baseline',
};

const justifyMap: Record<string, string> = {
  'start': 'justify-start',
  'center': 'justify-center',
  'end': 'justify-end',
  'between': 'justify-between',
  'around': 'justify-around',
  'evenly': 'justify-evenly',
};

// ============================================
// COMPONENT
// ============================================

/**
 * A flex container layout component.
 */
export function Flex(props: FlexProps): JSX.Element {
  const [local, rest] = splitProps(props, [
    'direction', 'gap', 'wrap', 'alignItems', 'justifyContent', 'inline', 'class', 'children',
  ]);

  const classes = (): string => {
    const parts: string[] = [local.inline ? 'inline-flex' : 'flex'];

    if (local.direction) parts.push(directionMap[local.direction] ?? 'flex-row');
    if (local.gap !== undefined) {
      parts.push(typeof local.gap === 'number' ? `gap-${local.gap}` : `gap-${local.gap}`);
    }
    if (local.wrap) {
      parts.push(local.wrap === true || local.wrap === 'wrap' ? 'flex-wrap' : local.wrap === 'wrap-reverse' ? 'flex-wrap-reverse' : 'flex-nowrap');
    }
    if (local.alignItems) parts.push(alignMap[local.alignItems] ?? '');
    if (local.justifyContent) parts.push(justifyMap[local.justifyContent] ?? '');
    if (local.class) parts.push(local.class);

    return parts.filter(Boolean).join(' ');
  };

  return (
    <div {...rest} class={classes()}>
      {local.children}
    </div>
  );
}
