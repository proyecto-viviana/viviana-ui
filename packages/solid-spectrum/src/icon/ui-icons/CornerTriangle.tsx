/*
 * Auto-generated from vendored React Spectrum S2 icon sources.
 * Do not edit by hand.
 */

import { type JSX } from "solid-js";
import { createIcon } from "../spectrum-icon";

export type CornerTriangleProps = JSX.SvgSVGAttributes<SVGSVGElement> & {
  size?: "S" | "M" | "L" | "XL";
};

function CornerTriangle_SSvg(props: JSX.SvgSVGAttributes<SVGSVGElement>): JSX.Element {
  const { class: className, width: _width, height: _height, ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="5"
      height="5"
      viewBox="0 0 5 5"
      {...rest}
      class={className}
    >
      <path
        d="m.76379,4.48791L4.48941.76228c.18901-.18901.51219-.05511.51213.2122l-.00069,3.2759c-.00009.41417-.33587.74986-.75004.74984l-3.27491-.00018c-.26726-.00001-.4011-.32315-.21212-.51213Z"
        fill="var(--iconPrimary, #222)"
      />
    </svg>
  );
}

function CornerTriangle_MSvg(props: JSX.SvgSVGAttributes<SVGSVGElement>): JSX.Element {
  const { class: className, width: _width, height: _height, ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="5"
      height="5"
      viewBox="0 0 5 5"
      {...rest}
      class={className}
    >
      <path
        d="m.15411,4.14619L4.14677.15375c.31502-.315.85364-.09183.85354.35367l-.00079,3.7427c-.00009.41417-.33587.74986-.75004.74984l-3.74186-.00021c-.44545-.00002-.6685-.53859-.35352-.85356Z"
        fill="var(--iconPrimary, #222)"
      />
    </svg>
  );
}

function CornerTriangle_LSvg(props: JSX.SvgSVGAttributes<SVGSVGElement>): JSX.Element {
  const { class: className, width: _width, height: _height, ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="6"
      height="6"
      viewBox="0 0 6 6"
      {...rest}
      class={className}
    >
      <path
        d="m.82619,5.14621L5.14704.8256c.31502-.315.85364-.09183.85354.35367l-.00086,4.07089c-.00009.41417-.33587.74986-.75004.74984l-4.06998-.00023c-.44545-.00002-.6685-.53859-.35352-.85356Z"
        fill="var(--iconPrimary, #222)"
      />
    </svg>
  );
}

function CornerTriangle_XLSvg(props: JSX.SvgSVGAttributes<SVGSVGElement>): JSX.Element {
  const { class: className, width: _width, height: _height, ...rest } = props;
  return (
    <svg
      id="e"
      data-name="ICONS"
      xmlns="http://www.w3.org/2000/svg"
      width="7"
      height="7"
      viewBox="0 0 7 7"
      {...rest}
      class={className}
    >
      <path
        d="m.82095,6.14616L6.1465.82091c.31502-.315.85364-.09183.85354.35367l-.00107,5.07559c-.00009.41417-.33587.74986-.75004.74984l-5.07447-.00028c-.44545-.00002-.6685-.53859-.35352-.85356Z"
        fill="var(--iconPrimary, #222)"
        stroke-width="0"
      />
    </svg>
  );
}

const CornerTriangle_S = createIcon(CornerTriangle_SSvg);
const CornerTriangle_M = createIcon(CornerTriangle_MSvg);
const CornerTriangle_L = createIcon(CornerTriangle_LSvg);
const CornerTriangle_XL = createIcon(CornerTriangle_XLSvg);

export default function CornerTriangle(props: CornerTriangleProps): JSX.Element {
  const { size = "M", class: className, width: _width, height: _height, ...rest } = props;
  switch (size) {
    case "S":
      return <CornerTriangle_S {...rest} class={className} />;
    case "M":
      return <CornerTriangle_M {...rest} class={className} />;
    case "L":
      return <CornerTriangle_L {...rest} class={className} />;
    case "XL":
      return <CornerTriangle_XL {...rest} class={className} />;
    default:
      return <CornerTriangle_M {...rest} class={className} />;
  }
}

export const CornerTriangleIcon = CornerTriangle;
