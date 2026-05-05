/*
 * Auto-generated from vendored React Spectrum S2 icon sources.
 * Do not edit by hand.
 */

import { type JSX } from "solid-js";
import { createIcon } from "../spectrum-icon";

export type LinkOutProps = JSX.SvgSVGAttributes<SVGSVGElement> & {
  size?: "M" | "L" | "XL" | "XXL";
};

function LinkOut_MSvg(props: JSX.SvgSVGAttributes<SVGSVGElement>): JSX.Element {
  const { class: className, width: _width, height: _height, ...rest } = props;
  return (
    <svg
      id="strokes"
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      {...rest}
      class={className}
    >
      <path
        d="m8.125,1H3.74121c-.4834,0-.875.3916-.875.875s.3916.875.875.875h2.27051L1.13086,7.63086c-.34082.3418-.34082.89648,0,1.23828.1709.1709.39551.25586.61914.25586s.44824-.08496.61914-.25586L7.25,3.98828v2.27051c0,.4834.3916.875.875.875s.875-.3916.875-.875V1.875c0-.4834-.3916-.875-.875-.875Z"
        fill="var(--iconPrimary, #222)"
        stroke-width="0"
      />
    </svg>
  );
}

function LinkOut_LSvg(props: JSX.SvgSVGAttributes<SVGSVGElement>): JSX.Element {
  const { class: className, width: _width, height: _height, ...rest } = props;
  return (
    <svg
      id="strokes"
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      {...rest}
      class={className}
    >
      <path
        d="m10.08887,1h-5.51074c-.50293,0-.91113.4082-.91113.91113s.4082.91113.91113.91113h3.31055L1.35547,9.35547c-.35645.35645-.35645.93262,0,1.28906.17773.17773.41113.2666.64453.2666s.4668-.08887.64453-.2666l6.5332-6.5332v3.31055c0,.50293.4082.91113.91113.91113s.91113-.4082.91113-.91113V1.91113c0-.50293-.4082-.91113-.91113-.91113Z"
        fill="var(--iconPrimary, #222)"
        stroke-width="0"
      />
    </svg>
  );
}

function LinkOut_XLSvg(props: JSX.SvgSVGAttributes<SVGSVGElement>): JSX.Element {
  const { class: className, width: _width, height: _height, ...rest } = props;
  return (
    <svg
      id="strokes"
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      {...rest}
      class={className}
    >
      <path
        d="m12.05078,1h-6.8877c-.52441,0-.94922.4248-.94922.94922s.4248.94922.94922.94922h4.59473L1.57812,11.07813c-.37012.37109-.37012.97266,0,1.34375.18555.18457.42871.27734.67188.27734s.48633-.09277.67188-.27734L11.10156,4.24219v4.59473c0,.52441.4248.94922.94922.94922s.94922-.4248.94922-.94922V1.94922c0-.52441-.4248-.94922-.94922-.94922Z"
        fill="var(--iconPrimary, #222)"
        stroke-width="0"
      />
    </svg>
  );
}

function LinkOut_XXLSvg(props: JSX.SvgSVGAttributes<SVGSVGElement>): JSX.Element {
  const { class: className, width: _width, height: _height, ...rest } = props;
  return (
    <svg
      id="strokes"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      {...rest}
      class={className}
    >
      <path
        d="m14.01074,1H6.01074c-.5459,0-.98926.44336-.98926.98926s.44336.98926.98926.98926h5.6123L1.55078,13.05078c-.38672.38574-.38672,1.0127,0,1.39844.19336.19336.44629.29004.69922.29004s.50586-.09668.69922-.29004L13.02148,4.37695v5.6123c0,.5459.44336.98926.98926.98926s.98926-.44336.98926-.98926V1.98926c0-.5459-.44336-.98926-.98926-.98926Z"
        fill="var(--iconPrimary, #222)"
        stroke-width="0"
      />
    </svg>
  );
}

const LinkOut_M = createIcon(LinkOut_MSvg);
const LinkOut_L = createIcon(LinkOut_LSvg);
const LinkOut_XL = createIcon(LinkOut_XLSvg);
const LinkOut_XXL = createIcon(LinkOut_XXLSvg);

export default function LinkOut(props: LinkOutProps): JSX.Element {
  const { size = "M", class: className, width: _width, height: _height, ...rest } = props;
  switch (size) {
    case "M":
      return <LinkOut_M {...rest} class={className} />;
    case "L":
      return <LinkOut_L {...rest} class={className} />;
    case "XL":
      return <LinkOut_XL {...rest} class={className} />;
    case "XXL":
      return <LinkOut_XXL {...rest} class={className} />;
    default:
      return <LinkOut_M {...rest} class={className} />;
  }
}

export const LinkOutIcon = LinkOut;
