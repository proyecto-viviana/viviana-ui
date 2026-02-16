/**
 * Image component for proyecto-viviana-ui.
 *
 * Styling-only wrapper for semantic images.
 */

import { type JSX, splitProps } from 'solid-js';

export interface ImageProps extends JSX.ImgHTMLAttributes<HTMLImageElement> {
  class?: string;
}

export function Image(props: ImageProps): JSX.Element {
  const [local, domProps] = splitProps(props, ['class']);
  return (
    <img
      {...domProps}
      class={`max-w-full h-auto ${local.class ?? ''}`}
    />
  );
}

