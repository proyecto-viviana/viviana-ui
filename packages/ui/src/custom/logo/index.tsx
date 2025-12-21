import { JSX } from "solid-js";

export type LogoSize = "sm" | "md" | "lg" | "xl";

export interface LogoProps {
  /** First word (light weight, muted color) */
  firstWord?: string;
  /** Second word (bold, with 3D effect) */
  secondWord?: string;
  /** Size variant of the logo */
  size?: LogoSize;
  /** Additional CSS classes */
  class?: string;
}

/**
 * Two-word logo with retro synthwave 3D effect.
 * First word is light/muted, second word has bold styling with pink 3D shadow.
 *
 * @example
 * // Default usage
 * <Logo />
 *
 * @example
 * // Custom text
 * <Logo firstWord="My" secondWord="Brand" size="lg" />
 */
export function Logo(props: LogoProps): JSX.Element {
  const sizeClass = () => {
    switch (props.size) {
      case "sm":
        return "vui-logo--sm";
      case "lg":
        return "vui-logo--lg";
      case "xl":
        return "vui-logo--xl";
      case "md":
      default:
        return "vui-logo--md";
    }
  };

  const firstWord = () => props.firstWord ?? "Proyecto";
  const secondWord = () => props.secondWord ?? "Viviana";

  return (
    <span class={`vui-logo ${sizeClass()} ${props.class ?? ""}`}>
      <span class="vui-logo__first">{firstWord()}</span>
      <span class="vui-logo__second" data-text={secondWord()}>
        {secondWord()}
      </span>
    </span>
  );
}
