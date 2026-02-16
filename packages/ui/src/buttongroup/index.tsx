/**
 * ButtonGroup component for proyecto-viviana-ui.
 *
 * Styling-only button grouping primitive.
 */

import { type JSX, splitProps } from 'solid-js';

export interface ButtonGroupProps extends JSX.HTMLAttributes<HTMLDivElement> {
  class?: string;
}

export function ButtonGroup(props: ButtonGroupProps): JSX.Element {
  const [local, domProps] = splitProps(props, ['class', 'children']);
  return (
    <div
      {...domProps}
      role={domProps.role ?? 'group'}
      class={`inline-flex items-center gap-2 ${local.class ?? ''}`}
    >
      {local.children}
    </div>
  );
}

