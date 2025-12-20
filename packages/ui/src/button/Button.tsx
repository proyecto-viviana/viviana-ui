import { type JSX, splitProps, mergeProps as solidMergeProps, createMemo } from 'solid-js';
import { createButton } from '@proyecto-viviana/solidaria';
import type { ButtonProps } from './types';

/**
 * Buttons allow users to perform an action or to navigate to another page.
 * They have multiple styles for various needs, and are ideal for calling attention to
 * where a user needs to do something in order to move forward in a flow.
 *
 * Styles are defined in components.css using the vui-button class system.
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
    const classList = [
      'vui-button',
      `vui-button--${local.style}`,
      `vui-button--${local.variant}`,
      `vui-button--${local.size}`,
    ];

    if (isPressed()) {
      classList.push('is-pressed');
    }

    if (local.fullWidth) {
      classList.push('vui-button--full-width');
    }

    if (local.class) {
      classList.push(local.class);
    }

    return classList.join(' ');
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
