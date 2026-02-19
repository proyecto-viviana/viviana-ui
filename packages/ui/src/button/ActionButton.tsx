/**
 * ActionButton component for proyecto-viviana-ui
 *
 * A quiet/subtle button variant for toolbar and secondary actions.
 */

import { type JSX, splitProps } from 'solid-js';
import {
  Button as HeadlessButton,
  type ButtonProps as HeadlessButtonProps,
  type ButtonRenderProps,
} from '@proyecto-viviana/solidaria-components';

// ============================================
// TYPES
// ============================================

export type ActionButtonSize = 'sm' | 'md' | 'lg';

export interface ActionButtonProps extends Omit<HeadlessButtonProps, 'class' | 'style'> {
  /** The size of the button. @default 'md' */
  size?: ActionButtonSize;
  /** Whether the button is quiet (no background until hover). @default true */
  isQuiet?: boolean;
  /** Additional CSS class name. */
  class?: string;
}

// ============================================
// STYLES
// ============================================

const sizeStyles: Record<ActionButtonSize, string> = {
  sm: 'px-2 py-1 text-xs rounded',
  md: 'px-3 py-1.5 text-sm rounded-md',
  lg: 'px-4 py-2 text-base rounded-lg',
};

// ============================================
// COMPONENT
// ============================================

/**
 * A quiet/subtle button for toolbar and secondary actions.
 */
export function ActionButton(props: ActionButtonProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['size', 'isQuiet', 'class']);
  const isQuiet = () => local.isQuiet ?? true;

  const getClassName = (renderProps: ButtonRenderProps): string => {
    const base = 'inline-flex items-center justify-center font-medium transition-colors outline-none';
    const sizeClass = sizeStyles[local.size ?? 'md'];

    let stateClass: string;
    if (renderProps.isDisabled) {
      stateClass = 'text-primary-500 cursor-not-allowed';
    } else if (renderProps.isPressed) {
      stateClass = 'bg-bg-200 text-primary-100';
    } else if (renderProps.isHovered) {
      stateClass = 'bg-bg-300 text-primary-100';
    } else if (isQuiet()) {
      stateClass = 'bg-transparent text-primary-200';
    } else {
      stateClass = 'bg-bg-400 text-primary-200 border border-primary-600';
    }

    const focusClass = renderProps.isFocusVisible ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg-100' : '';

    return [base, sizeClass, stateClass, focusClass, local.class ?? ''].filter(Boolean).join(' ');
  };

  return (
    <HeadlessButton
      {...headlessProps}
      class={getClassName}
    />
  );
}
