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
  };

  const merged = solidMergeProps(defaultProps, props);

  const [local, buttonOptions] = splitProps(merged, [
    'children',
    'variant',
    'style',
    'staticColor',
    'class',
    'ref',
  ]);

  const { buttonProps, isPressed } = createButton(buttonOptions);

  const classes = createMemo(() => {
    const base = 'vui-button';
    const variant = `vui-button--${local.variant}`;
    const style = `vui-button--${local.style}`;
    const pressed = isPressed() ? 'is-pressed' : '';
    const staticColor = local.staticColor ? `vui-button--static-${local.staticColor}` : '';
    const custom = local.class || '';

    return [base, variant, style, pressed, staticColor, custom].filter(Boolean).join(' ');
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
