/**
 * createVisuallyHidden hook for solidaria
 *
 * Provides styles and props to visually hide content while keeping it
 * accessible to screen readers.
 *
 * Port of react-aria's useVisuallyHidden.
 */

import { type Accessor, type JSX, createMemo, createSignal } from 'solid-js';
import { createFocusWithin } from '../interactions/createFocusWithin';
import { access, type MaybeAccessor } from '../utils';

// ============================================
// TYPES
// ============================================

export interface AriaVisuallyHiddenProps {
  /** Inline styles to merge with the visually hidden styles. */
  style?: JSX.CSSProperties;
  /** Whether the element should become visible when focused (e.g., skip links). */
  isFocusable?: boolean;
}

export interface VisuallyHiddenAria {
  /** Props to spread on the visually hidden element. */
  visuallyHiddenProps: Accessor<JSX.HTMLAttributes<HTMLElement>>;
}

// ============================================
// STYLES
// ============================================

/**
 * CSS styles that visually hide an element while keeping it accessible.
 * These styles ensure the element is read by screen readers but not visible on screen.
 */
export const visuallyHiddenStyles: JSX.CSSProperties = {
  border: '0',
  clip: 'rect(0 0 0 0)',
  'clip-path': 'inset(50%)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: '0',
  position: 'absolute',
  width: '1px',
  'white-space': 'nowrap',
};

// ============================================
// HOOK
// ============================================

/**
 * Provides props for an element that hides its children visually
 * but keeps content visible to assistive technology.
 *
 * @example
 * ```tsx
 * function SkipLink() {
 *   let ref: HTMLAnchorElement | undefined;
 *   const { visuallyHiddenProps } = createVisuallyHidden({ isFocusable: true });
 *
 *   return (
 *     <a
 *       ref={ref}
 *       href="#main-content"
 *       {...visuallyHiddenProps()}
 *     >
 *       Skip to main content
 *     </a>
 *   );
 * }
 *
 * // For content that should always be hidden
 * function ScreenReaderOnly(props: ParentProps) {
 *   const { visuallyHiddenProps } = createVisuallyHidden();
 *
 *   return (
 *     <span {...visuallyHiddenProps()}>
 *       {props.children}
 *     </span>
 *   );
 * }
 * ```
 */
export function createVisuallyHidden(
  props: MaybeAccessor<AriaVisuallyHiddenProps> = {}
): VisuallyHiddenAria {
  const [isFocused, setIsFocused] = createSignal(false);

  const isFocusable = () => access(props).isFocusable ?? false;
  const style = () => access(props).style;

  // Track focus within for focusable visually hidden elements
  const { focusWithinProps } = createFocusWithin({
    get isDisabled() {
      return !isFocusable();
    },
    onFocusWithinChange: (val: boolean) => setIsFocused(val),
  });

  // Compute combined styles
  const combinedStyles = createMemo<JSX.CSSProperties>(() => {
    if (isFocused()) {
      // If focused, show the element (for skip links, etc.)
      return style() ?? {};
    } else if (style()) {
      return { ...visuallyHiddenStyles, ...style() };
    } else {
      return visuallyHiddenStyles;
    }
  });

  const visuallyHiddenProps = createMemo<JSX.HTMLAttributes<HTMLElement>>(() => ({
    ...focusWithinProps,
    style: combinedStyles(),
  }));

  return {
    visuallyHiddenProps,
  };
}
