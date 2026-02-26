/**
 * Form components for proyecto-viviana-silapse
 *
 * Styling-only wrappers around solidaria-components form primitives.
 */

import { type JSX, splitProps } from 'solid-js';
import {
  Form as HeadlessForm,
  FieldError as HeadlessFieldError,
  type FormProps as HeadlessFormProps,
  type FieldErrorProps as HeadlessFieldErrorProps,
} from '@proyecto-viviana/solidaria-components';

export interface FormProps extends Omit<HeadlessFormProps, 'class'> {
  class?: string;
}

export interface FieldErrorProps extends Omit<HeadlessFieldErrorProps, 'class'> {
  class?: string;
}

export function Form(props: FormProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class']);
  return (
    <HeadlessForm
      {...headlessProps}
      class={`flex flex-col gap-4 ${local.class ?? ''}`}
    />
  );
}

export function FieldError(props: FieldErrorProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class']);
  return (
    <HeadlessFieldError
      {...headlessProps}
      class={`text-sm text-danger-400 ${local.class ?? ''}`}
    />
  );
}

// Sub-component re-exports
export { Field } from './Field';
export type { FieldProps, FieldSize } from './Field';
export { HelpText } from './HelpText';
export type { HelpTextProps } from './HelpText';

