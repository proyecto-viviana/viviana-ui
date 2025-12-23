import type { JSX } from 'solid-js'
import { Logo } from '../logo'

export interface HeaderProps {
  /** Custom logo element - if not provided, uses the default Logo component */
  logo?: JSX.Element
  /** Navigation items to display on the right side */
  children?: JSX.Element
  /** Additional CSS classes */
  class?: string
}

export function Header(props: HeaderProps) {
  return (
    <header class={`vui-header ${props.class ?? ''}`}>
      <div class="vui-header__container">
        <div class="flex items-center">
          {props.logo ?? <Logo size="lg" />}
        </div>
        <nav class="vui-header__nav">
          {props.children}
        </nav>
      </div>
    </header>
  )
}
