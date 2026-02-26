/**
 * Card component for proyecto-viviana-silapse.
 *
 * Styling-only surface container primitive.
 */

import { type JSX, splitProps } from 'solid-js';

export interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {
  class?: string;
}

export function Card(props: CardProps): JSX.Element {
  const [local, domProps] = splitProps(props, ['class', 'children']);
  return (
    <div
      {...domProps}
      class={`rounded-xl border border-primary-600 bg-bg-300 p-4 ${local.class ?? ''}`}
    >
      {local.children}
    </div>
  );
}

