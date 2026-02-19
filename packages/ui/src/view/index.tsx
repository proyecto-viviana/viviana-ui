/**
 * View component for proyecto-viviana-ui.
 *
 * Styling-only container primitive.
 */

import { type JSX, splitProps } from 'solid-js';

export interface ViewProps extends JSX.HTMLAttributes<HTMLDivElement> {
  class?: string;
}

export function View(props: ViewProps): JSX.Element {
  const [local, domProps] = splitProps(props, ['class', 'children']);
  return (
    <div
      {...domProps}
      class={`vui-view ${local.class ?? ''}`}
    >
      {local.children}
    </div>
  );
}

// Sub-component re-exports
export { Content, ViewHeader, ViewFooter } from './Content';
export type { ContentProps, ViewHeaderProps, ViewFooterProps } from './Content';

