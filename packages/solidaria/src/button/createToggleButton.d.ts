import { Accessor } from 'solid-js';
import type { AriaButtonProps, ButtonAria } from './types';
export interface AriaToggleButtonProps extends Omit<AriaButtonProps, 'aria-pressed'> {
    /** Whether the button is selected (controlled). */
    isSelected?: Accessor<boolean> | boolean;
    /** Handler called when the button's selection state changes. */
    onChange?: (isSelected: boolean) => void;
    /** The default selected state (uncontrolled). */
    defaultSelected?: boolean;
}
export interface ToggleButtonAria extends ButtonAria {
    /** Whether the button is currently selected. */
    isSelected: Accessor<boolean>;
}
/**
 * Provides the behavior and accessibility implementation for a toggle button component.
 * Toggle buttons allow users to toggle a selection on or off.
 *
 * Based on react-aria's useToggleButton but adapted for SolidJS.
 *
 * @example
 * ```tsx
 * import { createToggleButton } from 'solidaria';
 *
 * function ToggleButton(props) {
 *   const { buttonProps, isPressed, isSelected } = createToggleButton(props);
 *
 *   return (
 *     <button
 *       {...buttonProps}
 *       class={isSelected() ? 'selected' : ''}
 *       style={{ opacity: isPressed() ? 0.8 : 1 }}
 *     >
 *       {props.children}
 *     </button>
 *   );
 * }
 * ```
 */
export declare function createToggleButton(props?: AriaToggleButtonProps): ToggleButtonAria;
//# sourceMappingURL=createToggleButton.d.ts.map