/**
 * LogicButton component for proyecto-viviana-silapse
 *
 * An AND/OR toggle button for logic-based UIs.
 */

import { type JSX, splitProps } from 'solid-js';
import {
  ToggleButton as HeadlessToggleButton,
  type ToggleButtonProps as HeadlessToggleButtonProps,
  type ToggleButtonRenderProps,
} from '@proyecto-viviana/solidaria-components';
import { useProviderProps } from '../provider';

// ============================================
// TYPES
// ============================================

export interface LogicButtonProps extends Omit<HeadlessToggleButtonProps, 'class' | 'style' | 'children'> {
  /** Additional CSS class name. */
  class?: string;
}

// ============================================
// COMPONENT
// ============================================

/**
 * An AND/OR logic toggle button. Displays "AND" when selected (default), "OR" when not.
 */
export function LogicButton(props: LogicButtonProps): JSX.Element {
  const mergedProps = useProviderProps(props);
  const [local, headlessProps] = splitProps(mergedProps, ['class']);

  const getClassName = (renderProps: ToggleButtonRenderProps): string => {
    const base = 'inline-flex items-center justify-center px-2 py-0.5 text-xs font-mono font-bold rounded transition-colors outline-none min-w-[3rem]';

    let stateClass: string;
    if (renderProps.isDisabled) {
      stateClass = 'bg-bg-300 text-primary-500 cursor-not-allowed';
    } else if (renderProps.isSelected) {
      stateClass = 'bg-accent text-bg-400';
    } else {
      stateClass = 'bg-bg-400 text-primary-300 border border-primary-600';
    }

    const focusClass = renderProps.isFocusVisible ? 'ring-2 ring-accent ring-offset-1 ring-offset-bg-100' : '';

    return [base, stateClass, focusClass, local.class ?? ''].filter(Boolean).join(' ');
  };

  return (
    <HeadlessToggleButton
      {...headlessProps}
      class={getClassName}
    >
      {(renderProps: ToggleButtonRenderProps) => (
        <span>{renderProps.isSelected ? 'AND' : 'OR'}</span>
      )}
    </HeadlessToggleButton>
  );
}
