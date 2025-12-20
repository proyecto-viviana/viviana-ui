import { JSX } from "solid-js";

export type LogoSize = "sm" | "md" | "lg" | "xl";

export interface LogoProps {
  /** Size variant of the logo */
  size?: LogoSize;
  /** Additional CSS classes */
  class?: string;
}

/**
 * Proyecto Viviana Logo with retro synthwave 3D effect.
 * Features cyan text with pink/magenta 3D shadow offset.
 */
export function Logo(props: LogoProps): JSX.Element {
  const sizeClass = () => {
    switch (props.size) {
      case "sm":
        return "logo-sm";
      case "lg":
        return "logo-lg";
      case "xl":
        return "logo-xl";
      case "md":
      default:
        return "logo-md";
    }
  };

  return (
    <span
      class={`logo-3d ${sizeClass()} ${props.class ?? ""}`}
      style={{
        "font-family": "'Jost', system-ui, sans-serif",
      }}
    >
      <span class="logo-proyecto">Proyecto</span>
      <span class="logo-viviana">Viviana</span>
    </span>
  );
}
