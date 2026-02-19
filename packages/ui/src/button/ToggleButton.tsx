/**
 * ToggleButton component for proyecto-viviana-ui
 *
 * A styled toggle button wrapping headless ToggleButton.
 */

import { type JSX, splitProps } from 'solid-js';
import {
  ToggleButton as HeadlessToggleButton,
  type ToggleButtonProps as HeadlessToggleButtonProps,
  type ToggleButtonRenderProps,
} from '@proyecto-viviana/solidaria-components';

// ============================================
// TYPES
// ============================================

export type ToggleButtonSize = 'sm' | 'md' | 'lg';

export interface ToggleButtonProps extends Omit<HeadlessToggleButtonProps, 'class' | 'style'> {
  /** The size of the button. @default 'md' */
  size?: ToggleButtonSize;
  /** Additional CSS class name. */
  class?: string;
}

// ============================================
// STYLES
// ============================================

const sizeStyles: Record<ToggleButtonSize, string> = {
  sm: 'px-2 py-1 text-xs rounded',
  md: 'px-3 py-1.5 text-sm rounded-md',
  lg: 'px-4 py-2 text-base rounded-lg',
};

// ============================================
// COMPONENT
// ============================================

/**
 * A styled toggle button that can be selected or deselected.
 */
export function ToggleButton(props: ToggleButtonProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['size', 'class']);

  const getClassName = (renderProps: ToggleButtonRenderProps): string => {
    const base = 'inline-flex items-center justify-center font-medium transition-colors outline-none border';
    const sizeClass = sizeStyles[local.size ?? 'md'];

    let stateClass: string;
    if (renderProps.isDisabled) {
      stateClass = 'bg-bg-300 text-primary-500 border-primary-600 cursor-not-allowed';
    } else if (renderProps.isSelected) {
      stateClass = renderProps.isHovered
        ? 'bg-accent-400 text-white border-accent-400'
        : 'bg-accent text-white border-accent';
    } else if (renderProps.isHovered) {
      stateClass = 'bg-bg-200 text-primary-100 border-primary-500';
    } else {
      stateClass = 'bg-bg-400 text-primary-200 border-primary-600';
    }

    const focusClass = renderProps.isFocusVisible ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg-100' : '';

    return [base, sizeClass, stateClass, focusClass, local.class ?? ''].filter(Boolean).join(' ');
  };

  return (
    <HeadlessToggleButton
      {...headlessProps}
      class={getClassName}
    />
  );
}
