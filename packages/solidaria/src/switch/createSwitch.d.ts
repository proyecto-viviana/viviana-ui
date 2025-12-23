/**
 * Switch hook for Solidaria
 *
 * Provides the behavior and accessibility implementation for a switch component.
 * A switch is similar to a checkbox, but represents on/off values as opposed to selection.
 *
 * This is a 1:1 port of @react-aria/switch's useSwitch hook.
 */
import { JSX, Accessor } from 'solid-js';
import { type AriaToggleProps } from '../toggle/createToggle';
import { type ToggleState } from '@proyecto-viviana/solid-stately';
import { type MaybeAccessor } from '../utils/reactivity';
export interface AriaSwitchProps extends AriaToggleProps {
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
/**
 * Provides the behavior and accessibility implementation for a switch component.
 * A switch is similar to a checkbox, but represents on/off values as opposed to selection.
 */
export declare function createSwitch(props: MaybeAccessor<AriaSwitchProps>, state: ToggleState, ref: () => HTMLInputElement | null): SwitchAria;
//# sourceMappingURL=createSwitch.d.ts.map