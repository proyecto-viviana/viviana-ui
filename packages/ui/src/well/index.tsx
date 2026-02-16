/**
 * Well component for proyecto-viviana-ui.
 *
 * Styling-only emphasized container primitive.
 */

import { type JSX, splitProps } from 'solid-js';

export interface WellProps extends JSX.HTMLAttributes<HTMLDivElement> {
  class?: string;
}

export function Well(props: WellProps): JSX.Element {
  const [local, domProps] = splitProps(props, ['class', 'children']);
  return (
    <div
      {...domProps}
      class={`rounded-lg border border-primary-600 bg-bg-300 p-4 ${local.class ?? ''}`}
    >
      {local.children}
    </div>
  );
}

