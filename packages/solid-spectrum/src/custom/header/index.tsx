import type { JSX } from "solid-js";
import { Logo, type LogoProps } from "../logo";

export interface HeaderProps {
  /** Image element to show to the left of the text logo */
  logoImage?: JSX.Element;
  /** Props to pass to the Logo component (firstWord, secondWord, size, inverted). Pass null to hide the text logo. */
  logoProps?: LogoProps | null;
  /** Custom logo element - replaces the default Logo component entirely */
  logo?: JSX.Element;
  /** Navigation items to display on the right side */
  children?: JSX.Element;
  /** Additional CSS classes */
  class?: string;
}

export function Header(props: HeaderProps) {
  const showTextLogo = () => props.logo !== undefined || props.logoProps !== null;

  return (
    <header class={`vui-header ${props.class ?? ""}`}>
      <div class="vui-header__container">
        <div class="flex items-center gap-3">
          {props.logoImage}
          {showTextLogo() && (props.logo ?? <Logo size="lg" {...(props.logoProps ?? {})} />)}
        </div>
        <nav class="vui-header__nav">{props.children}</nav>
      </div>
    </header>
  );
}
