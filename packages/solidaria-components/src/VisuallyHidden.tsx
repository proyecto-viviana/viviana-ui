/**
 * VisuallyHidden component for solidaria-components
 *
 * Hides content visually but keeps it accessible to screen readers.
 * Port of react-aria's VisuallyHidden.
 */

import { type JSX, type ParentProps, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { createVisuallyHidden, mergeProps } from "@proyecto-viviana/solidaria";

export interface VisuallyHiddenProps extends ParentProps, JSX.HTMLAttributes<HTMLElement> {
  /** The element type to render. @default 'span' */
  elementType?: keyof JSX.IntrinsicElements;
  /** Whether the element should be focusable when focused. */
  isFocusable?: boolean;
  /** Inline style object merged with visually hidden styles. */
  style?: JSX.CSSProperties;
}

/**
 * VisuallyHidden hides its children visually, while keeping content visible to screen readers.
 */
export function VisuallyHidden(props: VisuallyHiddenProps): JSX.Element {
  const [local, others] = splitProps(props, ["elementType", "isFocusable", "style"]);
  const { visuallyHiddenProps } = createVisuallyHidden(() => ({
    style: local.style,
    isFocusable: local.isFocusable,
  }));

  const elementType = () => local.elementType ?? "span";
  const mergedProps = () =>
    mergeProps<Record<string, unknown>>(
      others as unknown as Record<string, unknown>,
      visuallyHiddenProps() as unknown as Record<string, unknown>,
    );

  return (
    <Dynamic component={elementType()} {...mergedProps()}>
      {props.children}
    </Dynamic>
  );
}
