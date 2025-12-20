import { type JSX, splitProps, mergeProps as solidMergeProps, createMemo } from 'solid-js';
import { createButton } from 'solidaria';
import type { ButtonProps, ButtonVariant, ButtonStyle } from './types';

const variantStyles: Record<ButtonVariant, Record<ButtonStyle, string>> = {
  primary: {
    fill: 'bg-primary-700 text-primary-200 shadow-primary-chip',
    outline: 'bg-bg-400 text-primary-500 border border-primary-500',
  },
  secondary: {
    fill: 'bg-primary-600 text-primary-100',
    outline: 'bg-transparent text-primary-300 border border-primary-600',
  },
  danger: {
    fill: 'bg-danger-600 text-danger-100 border border-danger-400',
    outline: 'bg-transparent text-danger-400 border border-danger-400',
  },
  success: {
    fill: 'bg-success-600 text-success-100 border border-success-400',
    outline: 'bg-transparent text-success-400 border border-success-400',
  },
  ghost: {
    fill: 'bg-transparent text-primary-300 hover:bg-bg-200',
    outline: 'bg-transparent text-primary-300 hover:bg-bg-200',
  },
  link: {
    fill: 'bg-transparent text-accent-200 hover:text-accent-300',
    outline: 'bg-transparent text-accent-200 hover:text-accent-300',
  },
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

/**
 * Buttons allow users to perform an action or to navigate to another page.
 * They have multiple styles for various needs, and are ideal for calling attention to
 * where a user needs to do something in order to move forward in a flow.
 */
export function Button(props: ButtonProps): JSX.Element {
  const defaultProps: Partial<ButtonProps> = {
    variant: 'primary',
    style: 'fill',
    size: 'md',
  };

  const merged = solidMergeProps(defaultProps, props);

  const [local, buttonOptions] = splitProps(merged, [
    'children',
    'variant',
    'style',
    'size',
    'fullWidth',
    'staticColor',
    'class',
    'ref',
  ]);

  const { buttonProps, isPressed } = createButton(buttonOptions);

  const classes = createMemo(() => {
    const base = 'whitespace-nowrap tracking-wider font-medium uppercase rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-300 focus:ring-offset-2 focus:ring-offset-bg-400 disabled:opacity-50 disabled:cursor-not-allowed';
    const variant = variantStyles[local.variant!][local.style!];
    const size = sizeStyles[local.size!];
    const pressed = isPressed() ? 'scale-[0.98]' : '';
    const fullWidth = local.fullWidth ? 'w-full' : 'w-auto';
    const custom = local.class || '';

    return [base, variant, size, pressed, fullWidth, custom].filter(Boolean).join(' ');
  });

  return (
    <button
      {...buttonProps}
      ref={local.ref}
      class={classes()}
      data-variant={local.variant}
      data-style={local.style}
      data-static-color={local.staticColor}
    >
      {local.children}
    </button>
  );
}
