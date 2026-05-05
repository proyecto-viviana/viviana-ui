import { type JSX, splitProps } from "solid-js";
import type { StyleString } from "../s2-style";
import {
  ActionButtonGroupContext,
  type ActionButtonDensity,
  type ActionButtonOrientation,
  type ActionButtonSize,
} from "../button/group-context";
import { s2ActionButtonGroup } from "../button/s2-action-button-styles";
import type { StaticColor } from "../button/types";

export interface ActionButtonGroupProps extends Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  "class" | "style" | "children"
> {
  /** The children of the group. */
  children?: JSX.Element;
  /** Size of the buttons. @default 'M' */
  size?: ActionButtonSize;
  /** Spacing between the buttons. @default 'regular' */
  density?: ActionButtonDensity;
  /** Whether the buttons should be displayed with a quiet style. */
  isQuiet?: boolean;
  /** Whether the buttons should divide the container width equally. */
  isJustified?: boolean;
  /** The static color style to apply. Useful when the group appears over a color background. */
  staticColor?: StaticColor;
  /** The axis the group should align with. @default 'horizontal' */
  orientation?: ActionButtonOrientation;
  /** Whether the group is disabled. */
  isDisabled?: boolean;
  /** Spectrum-defined generated classes. */
  styles?: StyleString;
  /** Additional CSS class name. Use only as a last resort. */
  UNSAFE_className?: string;
  /** Additional inline styles. Use only as a last resort. */
  UNSAFE_style?: JSX.CSSProperties;
  /** Backward-compatible class alias. Prefer UNSAFE_className for S2 parity. */
  class?: string;
}

/**
 * An ActionButtonGroup is a grouping of related ActionButtons.
 */
export function ActionButtonGroup(props: ActionButtonGroupProps): JSX.Element {
  const [local, domProps] = splitProps(props, [
    "children",
    "size",
    "density",
    "isQuiet",
    "isJustified",
    "staticColor",
    "orientation",
    "isDisabled",
    "styles",
    "UNSAFE_className",
    "UNSAFE_style",
    "class",
  ]);
  const size = () => local.size ?? "M";
  const density = () => local.density ?? "regular";
  const orientation = () => local.orientation ?? "horizontal";
  const className = () =>
    [
      local.UNSAFE_className,
      local.class,
      s2ActionButtonGroup(
        {
          size: size(),
          density: density(),
          orientation: orientation(),
          isJustified: local.isJustified,
        },
        local.styles,
      ),
    ]
      .filter(Boolean)
      .join(" ");

  const contextValue = {
    get size() {
      return size();
    },
    get density() {
      return density();
    },
    get orientation() {
      return orientation();
    },
    get isQuiet() {
      return local.isQuiet;
    },
    get isJustified() {
      return local.isJustified;
    },
    get staticColor() {
      return local.staticColor;
    },
    get isDisabled() {
      return local.isDisabled;
    },
  };

  return (
    <div
      {...domProps}
      role={domProps.role ?? "toolbar"}
      aria-orientation={orientation() === "vertical" ? "vertical" : undefined}
      class={className()}
      style={local.UNSAFE_style}
      data-orientation={orientation()}
      data-density={density()}
      data-disabled={local.isDisabled || undefined}
    >
      <ActionButtonGroupContext.Provider value={contextValue}>
        {local.children}
      </ActionButtonGroupContext.Provider>
    </div>
  );
}
