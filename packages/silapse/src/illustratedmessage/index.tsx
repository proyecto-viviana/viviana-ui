/**
 * IllustratedMessage component for proyecto-viviana-silapse.
 *
 * Styling-only empty-state/message primitive.
 */

import { type JSX, Show, splitProps } from 'solid-js';

export interface IllustratedMessageProps extends JSX.HTMLAttributes<HTMLDivElement> {
  illustration?: JSX.Element;
  heading?: JSX.Element;
  description?: JSX.Element;
  class?: string;
}

export function IllustratedMessage(props: IllustratedMessageProps): JSX.Element {
  const [local, domProps] = splitProps(props, [
    'illustration',
    'heading',
    'description',
    'class',
    'children',
  ]);

  return (
    <div
      {...domProps}
      class={`flex flex-col items-center justify-center gap-3 rounded-lg border border-primary-600 bg-bg-300 p-6 text-center ${local.class ?? ''}`}
    >
      <Show when={local.illustration}>
        <div class="text-primary-300">{local.illustration}</div>
      </Show>
      <Show when={local.heading}>
        <h3 class="text-lg font-semibold text-primary-100">{local.heading}</h3>
      </Show>
      <Show when={local.description}>
        <p class="text-sm text-primary-300">{local.description}</p>
      </Show>
      <Show when={local.children}>
        <div class="mt-1">{local.children}</div>
      </Show>
    </div>
  );
}
