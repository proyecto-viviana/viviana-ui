/**
 * Label component for proyecto-viviana-silapse
 *
 * Styling-only wrapper around solidaria-components Label.
 */

import { type JSX, splitProps } from 'solid-js';
import {
  Label as HeadlessLabel,
  type LabelProps as HeadlessLabelProps,
} from '@proyecto-viviana/solidaria-components';

export type LabelSize = 'sm' | 'md' | 'lg';

export interface LabelProps extends Omit<HeadlessLabelProps, 'class'> {
  size?: LabelSize;
  class?: string;
}

const sizeStyles: Record<LabelSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export function Label(props: LabelProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['size', 'class']);
  const size = () => local.size ?? 'md';
  return (
    <HeadlessLabel
      {...headlessProps}
      class={`font-medium text-primary-200 ${sizeStyles[size()]} ${local.class ?? ''}`}
    />
  );
}

export { Field } from '../form/Field';
export type { FieldProps, FieldSize } from '../form/Field';
export { HelpText } from '../form/HelpText';
export type { HelpTextProps } from '../form/HelpText';
