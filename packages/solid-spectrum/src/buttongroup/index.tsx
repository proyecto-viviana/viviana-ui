import { type JSX, splitProps } from "solid-js";
import type { StyleString } from "../s2-style";
import { style } from "../s2-style";
import { ButtonGroupContext } from "../button/group-context";
import { s2ButtonGroup } from "../button/s2-action-button-styles";
import type { ButtonSize } from "../button/types";

export interface ButtonGroupProps extends Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  "class" | "style" | "children"
> {
  /** The Buttons contained within the ButtonGroup. */
  children?: JSX.Element;
  /** The axis the ButtonGroup should align with. @default 'horizontal' */
  orientation?: "horizontal" | "vertical";
  /** The alignment of the Buttons within the ButtonGroup. @default 'start' */
  align?: "start" | "end" | "center";
  /** The size of the Buttons within the ButtonGroup. @default 'M' */
  size?: ButtonSize;
  /** Whether the Buttons in the ButtonGroup are all disabled. */
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

export function ButtonGroup(props: ButtonGroupProps): JSX.Element {
  const [local, domProps] = splitProps(props, [
    "class",
    "UNSAFE_className",
    "UNSAFE_style",
    "styles",
    "children",
    "orientation",
    "align",
    "size",
    "isDisabled",
  ]);
  const size = () => local.size ?? "M";
  const orientation = () => local.orientation ?? "horizontal";
  const align = () => local.align ?? "start";
  const className = () =>
    [
      local.UNSAFE_className,
      local.class,
      s2ButtonGroup(
        {
          size: size(),
          orientation: orientation(),
          align: align(),
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
    get isDisabled() {
      return local.isDisabled;
    },
    get styles() {
      return style({ flexShrink: 0 });
    },
  };

  return (
    <div
      {...domProps}
      role={domProps.role ?? "group"}
      class={className()}
      style={local.UNSAFE_style}
      data-orientation={orientation()}
      data-disabled={local.isDisabled || undefined}
    >
      <ButtonGroupContext.Provider value={contextValue}>
        {local.children}
      </ButtonGroupContext.Provider>
    </div>
  );
}
