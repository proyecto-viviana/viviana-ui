/**
 * FieldButton component for proyecto-viviana-solid-spectrum
 *
 * A button embedded inside input fields (e.g., date picker trigger, combobox button).
 */

import { type JSX, splitProps } from "solid-js";
import {
  Button as HeadlessButton,
  type ButtonProps as HeadlessButtonProps,
  type ButtonRenderProps,
} from "@proyecto-viviana/solidaria-components";
import { useProviderProps } from "../provider";

// ============================================
// TYPES
// ============================================

export interface FieldButtonProps extends Omit<HeadlessButtonProps, "class" | "style"> {
  /** Additional CSS class name. */
  class?: string;
}

// ============================================
// COMPONENT
// ============================================

/**
 * A button designed to sit inside an input field.
 */
export function FieldButton(props: FieldButtonProps): JSX.Element {
  const mergedProps = useProviderProps(props);
  const [local, headlessProps] = splitProps(mergedProps, ["class"]);

  const getClassName = (renderProps: ButtonRenderProps): string => {
    const base =
      "inline-flex items-center justify-center px-2 rounded-r-md transition-colors outline-none border-l border-primary-600";

    let stateClass: string;
    if (renderProps.isDisabled) {
      stateClass = "text-primary-500 cursor-not-allowed";
    } else if (renderProps.isPressed) {
      stateClass = "bg-bg-200 text-primary-100";
    } else if (renderProps.isHovered) {
      stateClass = "bg-bg-300 text-primary-200";
    } else {
      stateClass = "bg-bg-400 text-primary-300";
    }

    const focusClass = renderProps.isFocusVisible ? "ring-2 ring-inset ring-accent" : "";

    return [base, stateClass, focusClass, local.class ?? ""].filter(Boolean).join(" ");
  };

  return <HeadlessButton {...headlessProps} class={getClassName} />;
}
