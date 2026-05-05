import { type Component, type JSX, createContext, splitProps, useContext } from "solid-js";
import { iconStyle, type StyleString } from "../s2-style";
import { mergeStyles } from "../s2-style/runtime";

export interface IconContextValue {
  slot?: string;
  styles?: StyleString | (() => StyleString | undefined);
  render?: (icon: JSX.Element) => JSX.Element;
}

export const IconContext = createContext<IconContextValue>({});

export interface SpectrumIconProps extends JSX.SvgSVGAttributes<SVGSVGElement> {
  slot?: string;
  styles?: StyleString;
  class?: string;
  style?: JSX.CSSProperties | string;
  "aria-label"?: string;
  "aria-hidden"?: boolean | "false" | "true";
}

export function createIcon(
  Component: Component<JSX.SvgSVGAttributes<SVGSVGElement>>,
  context = IconContext,
) {
  return (props: SpectrumIconProps): JSX.Element => {
    const ctx = useContext(context);
    const [local, rest] = splitProps(props, [
      "slot",
      "styles",
      "class",
      "style",
      "aria-label",
      "aria-hidden",
    ]);
    const slot = () => local.slot ?? ctx.slot ?? "icon";
    const contextStyles = () => (typeof ctx.styles === "function" ? ctx.styles() : ctx.styles);

    const mergedClass = () =>
      [local.class, mergeStyles(iconStyle({ size: "M" }), contextStyles(), local.styles)]
        .filter(Boolean)
        .join(" ");

    const ariaHidden = () => {
      if (local["aria-label"]) {
        return local["aria-hidden"] || undefined;
      }

      return true;
    };

    const svg = (
      <Component
        {...rest}
        role="img"
        aria-label={local["aria-label"]}
        aria-hidden={ariaHidden()}
        data-slot={slot()}
        class={mergedClass()}
        style={local.style}
      />
    );

    return ctx.render ? ctx.render(svg) : svg;
  };
}
