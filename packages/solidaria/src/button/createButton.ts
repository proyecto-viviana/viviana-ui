import { Accessor } from 'solid-js';
import { createPress } from '../interactions';
import { createFocusable } from '../interactions';
import { mergeProps, filterDOMProps } from '../utils';
import type { AriaButtonProps, ButtonAria } from './types';

function isDisabledValue(isDisabled: Accessor<boolean> | boolean | undefined): boolean {
  if (typeof isDisabled === 'function') {
    return isDisabled();
  }
  return isDisabled ?? false;
}

/**
 * Provides the behavior and accessibility implementation for a button component.
 * Handles press interactions across mouse, touch, keyboard and screen readers.
 *
 * Based on react-aria's useButton but adapted for SolidJS.
 *
 * @example
 * ```tsx
 * import { createButton } from '@proyecto-viviana/solidaria';
 *
 * function Button(props) {
 *   let ref;
 *   const { buttonProps, isPressed } = createButton(props);
 *
 *   return (
 *     <button
 *       {...buttonProps}
 *       ref={ref}
 *       class={isPressed() ? 'pressed' : ''}
 *     >
 *       {props.children}
 *     </button>
 *   );
 * }
 * ```
 */
export function createButton(props: AriaButtonProps = {}): ButtonAria {
  const elementType = props.elementType ?? 'button';

  const { pressProps, isPressed } = createPress({
    isDisabled: props.isDisabled,
    onPress: props.onPress,
    onPressStart: props.onPressStart,
    onPressEnd: props.onPressEnd,
    onPressUp: props.onPressUp,
    onPressChange: props.onPressChange,
    preventFocusOnPress: props.preventFocusOnPress,
  });

  const { focusableProps } = createFocusable({
    isDisabled: props.isDisabled,
    autoFocus: props.autoFocus,
    excludeFromTabOrder: props.excludeFromTabOrder,
  });

  const isNativeButton = elementType === 'button' || elementType === 'input';
  const isLink = elementType === 'a';
  const disabled = isDisabledValue(props.isDisabled);

  // Build base props based on element type
  let additionalProps: Record<string, unknown> = {};

  if (isNativeButton) {
    additionalProps = {
      type: props.type ?? 'button',
      disabled: disabled,
      // Form-related attributes
      ...(props.form && { form: props.form }),
      ...(props.formAction && { formAction: props.formAction }),
      ...(props.formEncType && { formEncType: props.formEncType }),
      ...(props.formMethod && { formMethod: props.formMethod }),
      ...(props.formNoValidate && { formNoValidate: props.formNoValidate }),
      ...(props.formTarget && { formTarget: props.formTarget }),
      ...(props.name && { name: props.name }),
      ...(props.value && { value: props.value }),
    };
  } else {
    // Non-native buttons need role and tabIndex
    additionalProps = {
      role: 'button',
      tabIndex: disabled ? undefined : 0,
      'aria-disabled': disabled ? true : undefined,
    };

    if (isLink) {
      additionalProps.href = props.href;
      additionalProps.target = props.target;
      additionalProps.rel = props.rel;
    }
  }

  // ARIA attributes
  const ariaProps: Record<string, unknown> = {};

  if (props['aria-pressed'] !== undefined) {
    ariaProps['aria-pressed'] = props['aria-pressed'];
  }
  if (props['aria-haspopup'] !== undefined) {
    ariaProps['aria-haspopup'] = props['aria-haspopup'];
  }
  if (props['aria-expanded'] !== undefined) {
    ariaProps['aria-expanded'] = props['aria-expanded'];
  }
  if (props['aria-label']) {
    ariaProps['aria-label'] = props['aria-label'];
  }
  if (props['aria-labelledby']) {
    ariaProps['aria-labelledby'] = props['aria-labelledby'];
  }
  if (props['aria-describedby']) {
    ariaProps['aria-describedby'] = props['aria-describedby'];
  }

  const buttonProps = mergeProps(
    filterDOMProps(props as Record<string, unknown>, { labelable: true }),
    additionalProps,
    ariaProps,
    focusableProps as Record<string, unknown>,
    pressProps as Record<string, unknown>
  );

  return {
    buttonProps,
    isPressed,
  };
}
