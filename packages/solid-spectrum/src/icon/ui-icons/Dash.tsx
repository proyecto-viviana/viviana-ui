/*
 * Auto-generated from vendored React Spectrum S2 icon sources.
 * Do not edit by hand.
 */

import { type JSX } from "solid-js";
import { createIcon } from "../spectrum-icon";

export type DashProps = JSX.SvgSVGAttributes<SVGSVGElement> & {
  size?: "XS" | "S" | "M" | "L" | "XL";
};

function Dash_XSSvg(props: JSX.SvgSVGAttributes<SVGSVGElement>): JSX.Element {
  const { class: className, width: _width, height: _height, ...rest } = props;
  return (
    <svg
      id="ICONS"
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="8"
      viewBox="0 0 8 8"
      {...rest}
      class={className}
    >
      <path
        d="m6.63379,4.92188H1.36621c-.50879,0-.92188-.41309-.92188-.92188s.41309-.92188.92188-.92188h5.26758c.50879,0,.92188.41309.92188.92188s-.41309.92188-.92188.92188Z"
        fill="var(--iconPrimary, #222)"
        stroke-width="0"
      />
    </svg>
  );
}

function Dash_SSvg(props: JSX.SvgSVGAttributes<SVGSVGElement>): JSX.Element {
  const { class: className, width: _width, height: _height, ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="8"
      viewBox="0 0 8 8"
      {...rest}
      class={className}
    >
      <path
        d="m6.99023,4.95996H1.00977c-.53027,0-.95996-.42969-.95996-.95996s.42969-.95996.95996-.95996h5.98047c.53027,0,.95996.42969.95996.95996s-.42969.95996-.95996.95996Z"
        fill="var(--iconPrimary, #222)"
      />
    </svg>
  );
}

function Dash_MSvg(props: JSX.SvgSVGAttributes<SVGSVGElement>): JSX.Element {
  const { class: className, width: _width, height: _height, ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      {...rest}
      class={className}
    >
      <path
        d="m8.5,6H1.5c-.55273,0-1-.44727-1-1s.44727-1,1-1h7c.55273,0,1,.44727,1,1s-.44727,1-1,1Z"
        fill="var(--iconPrimary, #222)"
      />
    </svg>
  );
}

function Dash_LSvg(props: JSX.SvgSVGAttributes<SVGSVGElement>): JSX.Element {
  const { class: className, width: _width, height: _height, ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      {...rest}
      class={className}
    >
      <path
        d="m10.02148,7.04102H1.97852c-.5752,0-1.04102-.46582-1.04102-1.04102s.46582-1.04102,1.04102-1.04102h8.04297c.5752,0,1.04102.46582,1.04102,1.04102s-.46582,1.04102-1.04102,1.04102Z"
        fill="var(--iconPrimary, #222)"
      />
    </svg>
  );
}

function Dash_XLSvg(props: JSX.SvgSVGAttributes<SVGSVGElement>): JSX.Element {
  const { class: className, width: _width, height: _height, ...rest } = props;
  return (
    <svg
      id="ICONS"
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      {...rest}
      class={className}
    >
      <path
        d="m10.61035,7.08496H1.38965c-.59961,0-1.08496-.48535-1.08496-1.08496s.48535-1.08496,1.08496-1.08496h9.2207c.59961,0,1.08496.48535,1.08496,1.08496s-.48535,1.08496-1.08496,1.08496Z"
        fill="var(--iconPrimary, #222)"
        stroke-width="0"
      />
    </svg>
  );
}

const Dash_XS = createIcon(Dash_XSSvg);
const Dash_S = createIcon(Dash_SSvg);
const Dash_M = createIcon(Dash_MSvg);
const Dash_L = createIcon(Dash_LSvg);
const Dash_XL = createIcon(Dash_XLSvg);

export default function Dash(props: DashProps): JSX.Element {
  const { size = "M", class: className, width: _width, height: _height, ...rest } = props;
  switch (size) {
    case "XS":
      return <Dash_XS {...rest} class={className} />;
    case "S":
      return <Dash_S {...rest} class={className} />;
    case "M":
      return <Dash_M {...rest} class={className} />;
    case "L":
      return <Dash_L {...rest} class={className} />;
    case "XL":
      return <Dash_XL {...rest} class={className} />;
    default:
      return <Dash_M {...rest} class={className} />;
  }
}

export const DashIcon = Dash;
