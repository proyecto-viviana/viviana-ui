import { Accessor, createSignal } from "solid-js";
import { createButton } from "./createButton";
import { mergeProps } from "../utils";
import type { AriaButtonProps, ButtonAria } from "./types";
import type { PressEvent } from "../interactions";

export interface AriaToggleButtonProps extends Omit<AriaButtonProps, "aria-pressed"> {
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

function getSelectedValue(isSelected: Accessor<boolean> | boolean | undefined): boolean {
  if (typeof isSelected === "function") {
    return isSelected();
  }
  return isSelected ?? false;
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
export function createToggleButton(props: AriaToggleButtonProps = {}): ToggleButtonAria {
  // Handle controlled vs uncontrolled state
  const isControlled = props.isSelected !== undefined;
  const [uncontrolledSelected, setUncontrolledSelected] = createSignal(
    props.defaultSelected ?? false,
  );

  const isSelected = (): boolean => {
    if (isControlled) {
      return getSelectedValue(props.isSelected);
    }
    return uncontrolledSelected();
  };

  const toggleSelection = () => {
    const newValue = !isSelected();
    if (!isControlled) {
      setUncontrolledSelected(newValue);
    }
    props.onChange?.(newValue);
  };

  // Create the press handler that toggles selection
  const onPress = (e: PressEvent) => {
    toggleSelection();
    props.onPress?.(e);
  };

  // Get button props with our custom press handler
  const { buttonProps: baseButtonProps, isPressed } = createButton(
    mergeProps(props, {
      onPress,
    }) as AriaButtonProps,
  );

  // Create buttonProps with a getter for aria-pressed so it stays reactive
  const buttonProps = {
    ...baseButtonProps,
    get "aria-pressed"() {
      return isSelected();
    },
  };

  return {
    buttonProps,
    isPressed,
    isSelected,
  };
}
