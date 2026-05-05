import { type JSX, splitProps } from "solid-js";
import {
  Button as HeadlessButton,
  type ButtonProps as HeadlessButtonProps,
  type ButtonRenderProps,
} from "@proyecto-viviana/solidaria-components";
import { useProviderProps } from "../provider";
import { IconContext } from "../icon/spectrum-icon";
import { centerBaseline } from "../icon/center-baseline";
import CrossIcon from "../icon/ui-icons/Cross";

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

const sizeStyles: Record<ClearButtonSize, { button: string; icon: JSX.CSSProperties }> = {
  sm: { button: "w-5 h-5", icon: { width: "0.75rem", height: "0.75rem" } },
  md: { button: "w-6 h-6", icon: { width: "1rem", height: "1rem" } },
  lg: { button: "w-8 h-8", icon: { width: "1.25rem", height: "1.25rem" } },
};

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
      <IconContext.Provider value={{ slot: "icon", render: centerBaseline({ slot: "icon" }) }}>
        <CrossIcon style={size().icon} />
      </IconContext.Provider>
    </HeadlessButton>
  );
}
