/**
 * ActionBar component for proyecto-viviana-ui.
 *
 * Styling-only action container surface.
 */

import { type JSX, splitProps } from 'solid-js';

export interface ActionBarProps extends JSX.HTMLAttributes<HTMLDivElement> {
  class?: string;
}

export function ActionBar(props: ActionBarProps): JSX.Element {
  const [local, domProps] = splitProps(props, ['class', 'children']);
  return (
    <div
      {...domProps}
      role={domProps.role ?? 'toolbar'}
      class={`flex items-center gap-2 rounded-lg border border-primary-600 bg-bg-300 p-2 ${local.class ?? ''}`}
    >
      {local.children}
    </div>
  );
}

