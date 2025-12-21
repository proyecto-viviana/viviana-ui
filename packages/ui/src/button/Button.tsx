/**
 * Button component for proyecto-viviana-ui
 *
 * A styled button component built on top of solidaria-components.
 * This component only handles styling - all behavior and accessibility
 * is provided by the headless Button from solidaria-components.
 */

import { type JSX, splitProps, mergeProps as solidMergeProps } from 'solid-js';
import { Button as HeadlessButton, type ButtonRenderProps } from '@proyecto-viviana/solidaria-components';
import type { ButtonProps } from './types';

/**
 * Buttons allow users to perform an action or to navigate to another page.
 * They have multiple styles for various needs, and are ideal for calling attention to
 * where a user needs to do something in order to move forward in a flow.
 *
 * Built on solidaria-components Button for full accessibility support.
 * Styles are defined in components.css using the vui-button class system.
 */
export function Button(props: ButtonProps): JSX.Element {
  const defaultProps: Partial<ButtonProps> = {
    variant: 'primary',
    buttonStyle: 'fill',
    size: 'md',
  };

  const merged = solidMergeProps(defaultProps, props);

  const [local, headlessProps] = splitProps(merged, [
    'children',
    'variant',
    'buttonStyle',
    'size',
    'fullWidth',
    'staticColor',
    'class',
  ]);

  // Generate class based on render props
  const getClassName = (renderProps: ButtonRenderProps): string => {
    const classList = [
      'vui-button',
      `vui-button--${local.buttonStyle}`,
      `vui-button--${local.variant}`,
      `vui-button--${local.size}`,
    ];

    if (renderProps.isPressed) {
      classList.push('is-pressed');
    }

    if (local.fullWidth) {
      classList.push('vui-button--full-width');
    }

    if (local.class) {
      classList.push(local.class);
    }

    return classList.join(' ');
  };

  return (
    <HeadlessButton
      {...headlessProps}
      class={getClassName}
      data-variant={local.variant}
      data-style={local.buttonStyle}
      data-static-color={local.staticColor || undefined}
    >
      {local.children}
    </HeadlessButton>
  );
}
