/**
 * ClearButton component for proyecto-viviana-solid-spectrum
 *
 * An icon-only clear/dismiss button.
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

export type ClearButtonSize = "sm" | "md" | "lg";

export interface ClearButtonProps extends Omit<
  HeadlessButtonProps,
  "class" | "style" | "children"
> {
  /** The size of the button. @default 'md' */
  size?: ClearButtonSize;
  /** Additional CSS class name. */
  class?: string;
}

// ============================================
// STYLES
// ============================================

const sizeStyles: Record<ClearButtonSize, { button: string; icon: string }> = {
  sm: { button: "w-5 h-5", icon: "w-3 h-3" },
  md: { button: "w-6 h-6", icon: "w-4 h-4" },
  lg: { button: "w-8 h-8", icon: "w-5 h-5" },
};

// ============================================
// COMPONENT
// ============================================

/**
 * An icon-only clear/dismiss button, typically used in search fields and tags.
 */
export function ClearButton(props: ClearButtonProps): JSX.Element {
  const mergedProps = useProviderProps(props);
  const [local, headlessProps] = splitProps(mergedProps, ["size", "class"]);
  const size = () => sizeStyles[local.size ?? "md"];

  const getClassName = (renderProps: ButtonRenderProps): string => {
    const base =
      "inline-flex items-center justify-center rounded-full transition-colors outline-none";
    const sizeClass = size().button;

    let stateClass: string;
    if (renderProps.isDisabled) {
      stateClass = "text-primary-500 cursor-not-allowed";
    } else if (renderProps.isPressed) {
      stateClass = "bg-bg-200 text-primary-100";
    } else if (renderProps.isHovered) {
      stateClass = "bg-bg-300 text-primary-200";
    } else {
      stateClass = "text-primary-400 hover:text-primary-200";
    }

    const focusClass = renderProps.isFocusVisible ? "ring-2 ring-accent" : "";

    return [base, sizeClass, stateClass, focusClass, local.class ?? ""].filter(Boolean).join(" ");
  };

  return (
    <HeadlessButton
      {...headlessProps}
      aria-label={headlessProps["aria-label"] ?? "Clear"}
      class={getClassName}
    >
      <svg
        class={size().icon}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </HeadlessButton>
  );
}
