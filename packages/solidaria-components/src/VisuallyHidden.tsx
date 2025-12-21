/**
 * VisuallyHidden component for solidaria-components
 *
 * Hides content visually but keeps it accessible to screen readers.
 * Port of react-aria's VisuallyHidden.
 */

import { type JSX, type ParentProps, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

// ============================================
// TYPES
// ============================================

export interface VisuallyHiddenProps extends ParentProps {
  /** The element type to render. @default 'span' */
  elementType?: keyof JSX.IntrinsicElements;
  /** Whether the element should be focusable when focused. */
  isFocusable?: boolean;
}

// ============================================
// STYLES
// ============================================

const visuallyHiddenStyles: JSX.CSSProperties = {
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
// COMPONENT
// ============================================

/**
 * VisuallyHidden hides its children visually, while keeping content visible to screen readers.
 */
export function VisuallyHidden(props: VisuallyHiddenProps): JSX.Element {
  const [local, others] = splitProps(props, ['elementType', 'children', 'isFocusable']);

  const elementType = () => local.elementType ?? 'span';

  return (
    <Dynamic
      component={elementType()}
      style={visuallyHiddenStyles}
      {...others}
    >
      {local.children}
    </Dynamic>
  );
}
