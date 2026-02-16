/**
 * ActionGroup components for proyecto-viviana-ui.
 *
 * Styling-only wrappers around solidaria-components toggle-button primitives.
 */

import { type JSX, splitProps } from 'solid-js';
import {
  ToggleButtonGroup as HeadlessToggleButtonGroup,
  ToggleButton as HeadlessToggleButton,
  type ToggleButtonGroupProps as HeadlessToggleButtonGroupProps,
  type ToggleButtonProps as HeadlessToggleButtonProps,
  type ToggleButtonGroupRenderProps,
  type ToggleButtonRenderProps,
} from '@proyecto-viviana/solidaria-components';

export interface ActionGroupProps extends Omit<HeadlessToggleButtonGroupProps, 'class' | 'style'> {
  class?: string;
}

export interface ActionButtonProps extends Omit<HeadlessToggleButtonProps, 'class' | 'style'> {
  class?: string;
}

export function ActionGroup(props: ActionGroupProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class']);
  const getClassName = (_renderProps: ToggleButtonGroupRenderProps): string =>
    `inline-flex items-center gap-1 rounded-lg border border-primary-600 bg-bg-300 p-1 ${local.class ?? ''}`;

  return (
    <HeadlessToggleButtonGroup
      {...headlessProps}
      class={getClassName}
    />
  );
}

export function ActionButton(props: ActionButtonProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class']);
  const getClassName = (renderProps: ToggleButtonRenderProps): string => {
    const stateClass = renderProps.isSelected
      ? 'bg-accent text-white'
      : 'bg-transparent text-primary-200 hover:bg-bg-400';
    const disabledClass = renderProps.isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer';
    return [
      'inline-flex items-center rounded-md px-3 py-1.5 text-sm transition-colors duration-150',
      stateClass,
      disabledClass,
      local.class ?? '',
    ].filter(Boolean).join(' ');
  };

  return (
    <HeadlessToggleButton
      {...headlessProps}
      class={getClassName}
    />
  );
}

