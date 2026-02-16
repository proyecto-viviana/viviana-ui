/**
 * DropZone component for proyecto-viviana-ui.
 *
 * Styling-only wrapper around solidaria-components DropZone primitive.
 */

import { type JSX, splitProps } from 'solid-js';
import {
  DropZone as HeadlessDropZone,
  type DropZoneProps as HeadlessDropZoneProps,
  type DropZoneRenderProps,
} from '@proyecto-viviana/solidaria-components';

export interface DropZoneProps extends Omit<HeadlessDropZoneProps, 'class'> {
  /** Additional CSS class name. */
  class?: string;
}

export function DropZone(props: DropZoneProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class']);

  const getClassName = (renderProps: DropZoneRenderProps): string => {
    const base = [
      'rounded-lg border-2 border-dashed p-4 transition-colors duration-150 outline-none',
      'focus-visible:ring-2 focus-visible:ring-accent-300 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-400',
    ].join(' ');

    const stateClass = renderProps.isDisabled
      ? 'cursor-not-allowed border-primary-600 bg-bg-300/50 opacity-60'
      : renderProps.isDropTarget
        ? 'border-accent bg-accent/10'
        : renderProps.isHovered || renderProps.isFocused
          ? 'border-accent-300 bg-bg-300'
          : 'border-primary-600 bg-bg-400';

    return [base, stateClass, local.class ?? ''].filter(Boolean).join(' ');
  };

  return (
    <HeadlessDropZone
      {...headlessProps}
      class={getClassName}
    />
  );
}

