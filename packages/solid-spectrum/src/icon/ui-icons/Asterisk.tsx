/*
 * Auto-generated from vendored React Spectrum S2 icon sources.
 * Do not edit by hand.
 */

import { type JSX } from "solid-js";
import { createIcon } from "../spectrum-icon";

export type AsteriskProps = JSX.SvgSVGAttributes<SVGSVGElement> & {
  size?: "M" | "L" | "XL";
};

function Asterisk_MSvg(props: JSX.SvgSVGAttributes<SVGSVGElement>): JSX.Element {
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
        id="e"
        data-name="Shape"
        d="m6.575,6.55499c.055.05603.092.13,0,.20001l-1.149.74103c-.092.05603-.129.01898-.166-.07397l-1.426-2.48199-1.871,2.05994c-.019.03601-.074.073-.129,0l-.889-.927c-.093-.05499-.074-.11102,0-.16602l2.111-1.76001-2.408-.90698c-.037,0-.092-.07397-.056-.16699l.63-1.25897c.01632-.05072.06953-.07971.121-.06598.01784.00549.03377.01593.046.03003l2.111,1.37.13-2.70001c-.00673-.05261.02882-.10138.081-.11102.00997-.00104.02003-.00104.03,0l1.537.20001c.093,0,.111.03699.093.13l-.723,2.64697,2.445-.74103c.055-.03699.111-.03699.148.07397l.241,1.37c.018.09302,0,.13-.074.13l-2.556.20001,1.723,2.20801Z"
        fill="var(--iconPrimary, #222)"
      />
    </svg>
  );
}

function Asterisk_LSvg(props: JSX.SvgSVGAttributes<SVGSVGElement>): JSX.Element {
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
        id="e"
        data-name="Shape"
        d="m7.861,7.95302c.062.06299.1.146,0,.22998l-1.293.83398c-.1.06299-.145.021-.187-.08301l-1.6-2.79303-2.105,2.31403c-.021.03998-.083.08197-.145,0l-1-1.04303c-.1-.06201-.083-.125,0-.18701l2.375-1.98102-2.715-1.02594c-.042,0-.1-.08301-.063-.18799l.707-1.41199c.01782-.05743.07811-.09021.136-.07397.02012.00635.03811.01813.052.034l2.378,1.53998.146-3.04303c-.009-.05957.03156-.1153.091-.125.0113-.00116.0227-.00116.034,0l1.73.22998c.1,0,.125.04199.1.146l-.814,2.979,2.751-.83398c.062-.04199.125-.04199.167.08301l.271,1.54199c.02.09998,0,.146-.083.146l-2.876.22998,1.943,2.48108Z"
        fill="var(--iconPrimary, #222)"
      />
    </svg>
  );
}

function Asterisk_XLSvg(props: JSX.SvgSVGAttributes<SVGSVGElement>): JSX.Element {
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
        id="e"
        data-name="Shape"
        d="m8.266,8.32399c.07.07098.116.164,0,.258l-1.454.93799c-.116.07098-.163.02399-.21-.09399l-1.8-3.14099-2.367,2.59998c-.024.04498-.094.09198-.163,0l-1.13-1.16699c-.118-.07001-.094-.14099,0-.21002l2.671-2.22699-3.047-1.15094c-.047,0-.116-.09399-.071-.211l.8-1.59302c.01933-.06525.0876-.10272.153-.08398.02242.0072.04247.02032.058.03802l2.669,1.73798.164-3.422c-.00974-.06598.03444-.12781.1-.14001.01263-.00128.02537-.00128.038,0l1.945.258c.118,0,.14.047.118.164l-.915,3.349,3.094-.93799c.07-.047.14-.047.187.09399l.3,1.73401c.023.11798,0,.164-.094.164l-3.234.258,2.188,2.78497Z"
        fill="var(--iconPrimary, #222)"
      />
    </svg>
  );
}

const Asterisk_M = createIcon(Asterisk_MSvg);
const Asterisk_L = createIcon(Asterisk_LSvg);
const Asterisk_XL = createIcon(Asterisk_XLSvg);

export default function Asterisk(props: AsteriskProps): JSX.Element {
  const { size = "M", class: className, width: _width, height: _height, ...rest } = props;
  switch (size) {
    case "M":
      return <Asterisk_M {...rest} class={className} />;
    case "L":
      return <Asterisk_L {...rest} class={className} />;
    case "XL":
      return <Asterisk_XL {...rest} class={className} />;
    default:
      return <Asterisk_M {...rest} class={className} />;
  }
}

export const AsteriskIcon = Asterisk;
