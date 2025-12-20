/**
 * Switch hook for Solidaria
 *
 * Provides the behavior and accessibility implementation for a switch component.
 * A switch is similar to a checkbox, but represents on/off values as opposed to selection.
 *
 * This is a 1:1 port of @react-aria/switch's useSwitch hook.
 */

import { JSX, Accessor } from 'solid-js';
import { createToggle, type AriaToggleProps } from '../toggle/createToggle';
import { type ToggleState } from 'solid-stately';
import { type MaybeAccessor } from '../utils/reactivity';

// ============================================
// TYPES
// ============================================

export interface AriaSwitchProps extends AriaToggleProps {
  // Switch uses the same props as toggle
}

export interface SwitchAria {
  /** Props for the label wrapper element. */
  labelProps: JSX.LabelHTMLAttributes<HTMLLabelElement>;
  /** Props for the input element. */
  inputProps: JSX.InputHTMLAttributes<HTMLInputElement>;
  /** Whether the switch is selected. */
  isSelected: Accessor<boolean>;
  /** Whether the switch is in a pressed state. */
  isPressed: Accessor<boolean>;
  /** Whether the switch is disabled. */
  isDisabled: boolean;
  /** Whether the switch is read only. */
  isReadOnly: boolean;
}

// ============================================
// IMPLEMENTATION
// ============================================

/**
 * Provides the behavior and accessibility implementation for a switch component.
 * A switch is similar to a checkbox, but represents on/off values as opposed to selection.
 */
export function createSwitch(
  props: MaybeAccessor<AriaSwitchProps>,
  state: ToggleState,
  ref: () => HTMLInputElement | null
): SwitchAria {
  // Don't destructure inputProps - it's a getter that needs to be evaluated each time
  const toggle = createToggle(props, state, ref);

  return {
    labelProps: toggle.labelProps,
    get inputProps() {
      // Access toggle.inputProps (the getter) each time to get fresh values
      const baseProps = toggle.inputProps;
      return {
        ...baseProps,
        role: 'switch' as const,
        checked: toggle.isSelected(),
      };
    },
    isSelected: toggle.isSelected,
    isPressed: toggle.isPressed,
    isDisabled: toggle.isDisabled,
    isReadOnly: toggle.isReadOnly,
  };
}
