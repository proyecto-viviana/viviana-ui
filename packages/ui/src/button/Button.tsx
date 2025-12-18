import { type JSX, splitProps, mergeProps as solidMergeProps, createMemo } from 'solid-js';
import { createButton } from '@proyecto-viviana/solidaria';
import type { ButtonProps } from './types';

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
    const base = 'vui-button';
    const variant = `vui-button--${local.variant}`;
    // Ghost and link variants don't use fill/outline style
    const style = local.variant === 'ghost' || local.variant === 'link' ? '' : `vui-button--${local.style}`;
    const size = `vui-button--${local.size}`;
    const pressed = isPressed() ? 'is-pressed' : '';
    const fullWidth = local.fullWidth ? 'vui-button--full-width' : '';
    const staticColor = local.staticColor ? `vui-button--static-${local.staticColor}` : '';
    const custom = local.class || '';

    return [base, variant, style, size, pressed, fullWidth, staticColor, custom].filter(Boolean).join(' ');
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
