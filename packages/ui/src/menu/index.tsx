/**
 * Menu component for proyecto-viviana-ui
 *
 * Styled menu component built on top of solidaria-components.
 * Inspired by Spectrum 2's Menu component patterns.
 */

import { type JSX, splitProps, createContext, useContext } from 'solid-js'
import {
  Menu as HeadlessMenu,
  MenuItem as HeadlessMenuItem,
  MenuTrigger as HeadlessMenuTrigger,
  MenuButton as HeadlessMenuButton,
  type MenuProps as HeadlessMenuProps,
  type MenuItemProps as HeadlessMenuItemProps,
  type MenuTriggerProps as HeadlessMenuTriggerProps,
  type MenuButtonProps as HeadlessMenuButtonProps,
  type MenuRenderProps,
  type MenuItemRenderProps,
  type MenuTriggerRenderProps,
} from '@proyecto-viviana/solidaria-components'
import type { Key } from '@proyecto-viviana/solid-stately'

// ============================================
// SIZE CONTEXT
// ============================================

export type MenuSize = 'sm' | 'md' | 'lg'

const MenuSizeContext = createContext<MenuSize>('md')

// ============================================
// TYPES
// ============================================

export interface MenuTriggerProps extends Omit<HeadlessMenuTriggerProps, 'class' | 'style'> {
  /** The size of the menu. */
  size?: MenuSize
  /** Additional CSS class name. */
  class?: string
}

export interface MenuButtonProps extends Omit<HeadlessMenuButtonProps, 'class' | 'style'> {
  /** Additional CSS class name. */
  class?: string
  /** Visual variant of the button. */
  variant?: 'primary' | 'secondary' | 'quiet'
}

export interface MenuProps<T> extends Omit<HeadlessMenuProps<T>, 'class' | 'style'> {
  /** Additional CSS class name. */
  class?: string
}

export interface MenuItemProps<T> extends Omit<HeadlessMenuItemProps<T>, 'class' | 'style'> {
  /** Additional CSS class name. */
  class?: string
  /**
   * Optional icon to display before the label.
   * Use a function returning JSX for SSR compatibility: `icon={() => <MyIcon />}`
   */
  icon?: () => JSX.Element
  /** Optional keyboard shortcut to display. */
  shortcut?: string
  /** Whether this is a destructive action. */
  isDestructive?: boolean
}

// ============================================
// STYLES
// ============================================

const sizeStyles = {
  sm: {
    button: 'h-8 text-sm px-3 gap-2',
    menu: 'py-1',
    item: 'text-sm py-1.5 px-3 gap-2',
    icon: 'h-4 w-4',
  },
  md: {
    button: 'h-10 text-base px-4 gap-2',
    menu: 'py-1.5',
    item: 'text-base py-2 px-4 gap-3',
    icon: 'h-5 w-5',
  },
  lg: {
    button: 'h-12 text-lg px-5 gap-3',
    menu: 'py-2',
    item: 'text-lg py-2.5 px-5 gap-3',
    icon: 'h-6 w-6',
  },
}

const buttonVariants = {
  primary: 'bg-accent text-bg-400 border-accent hover:bg-accent-300 hover:border-accent-300',
  secondary: 'bg-bg-400 text-primary-200 border-primary-600 hover:bg-bg-300 hover:border-accent-300',
  quiet: 'bg-transparent text-primary-200 border-transparent hover:bg-bg-300',
}

// ============================================
// MENU TRIGGER COMPONENT
// ============================================

/**
 * A menu trigger wraps a button and menu, handling the open/close state.
 */
export function MenuTrigger(props: MenuTriggerProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['size', 'class'])
  const size = local.size ?? 'md'

  return (
    <MenuSizeContext.Provider value={size}>
      <div class={`relative inline-block ${local.class ?? ''}`}>
        <HeadlessMenuTrigger {...headlessProps}>
          {props.children}
        </HeadlessMenuTrigger>
      </div>
    </MenuSizeContext.Provider>
  )
}

// ============================================
// MENU BUTTON COMPONENT
// ============================================

/**
 * A button that opens a menu.
 * SSR-compatible - renders children and chevron icon directly without render props.
 */
export function MenuButton(props: MenuButtonProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class', 'variant'])
  const size = useContext(MenuSizeContext)
  const sizeStyle = sizeStyles[size]
  const variant = local.variant ?? 'secondary'
  const customClass = local.class ?? ''

  const getClassName = (renderProps: MenuTriggerRenderProps): string => {
    const base = 'inline-flex items-center justify-center rounded-lg border-2 font-medium transition-all duration-200'
    const sizeClass = sizeStyle.button
    const variantClass = buttonVariants[variant]

    let stateClass: string
    if (renderProps.isDisabled) {
      stateClass = 'opacity-50 cursor-not-allowed'
    } else if (renderProps.isPressed) {
      stateClass = 'scale-95'
    } else {
      stateClass = 'cursor-pointer'
    }

    const focusClass = renderProps.isFocusVisible
      ? 'ring-2 ring-accent-300 ring-offset-2 ring-offset-bg-400'
      : ''

    return [base, sizeClass, variantClass, stateClass, focusClass, customClass].filter(Boolean).join(' ')
  }

  return (
    <HeadlessMenuButton
      {...headlessProps}
      class={getClassName}
    >
      {props.children as JSX.Element}
      {/* Chevron rotates via CSS based on data-open attribute */}
      <ChevronIcon class={`${sizeStyle.icon} transition-transform duration-200 data-open:rotate-180`} />
    </HeadlessMenuButton>
  )
}

// ============================================
// MENU COMPONENT
// ============================================

/**
 * A menu displays a list of actions or options for the user to choose from.
 */
export function Menu<T>(props: MenuProps<T>): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class'])
  const size = useContext(MenuSizeContext)
  const styles = () => sizeStyles[size]
  const customClass = local.class ?? ''

  const getClassName = (_renderProps: MenuRenderProps): string => {
    const base = 'absolute z-50 mt-1 min-w-[12rem] rounded-lg border-2 border-primary-600 bg-bg-400 shadow-lg overflow-hidden'
    const sizeClass = styles().menu
    return [base, sizeClass, customClass].filter(Boolean).join(' ')
  }

  return (
    <HeadlessMenu
      {...headlessProps}
      class={getClassName}
      children={props.children}
    />
  )
}

// ============================================
// MENU ITEM COMPONENT
// ============================================

/**
 * An item in a menu.
 * SSR-compatible - renders icon, content, and shortcut directly without render props.
 */
export function MenuItem<T>(props: MenuItemProps<T>): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class', 'icon', 'shortcut', 'isDestructive'])
  const size = useContext(MenuSizeContext)
  const sizeStyle = sizeStyles[size]
  const customClass = local.class ?? ''

  const getClassName = (renderProps: MenuItemRenderProps): string => {
    const base = 'flex items-center cursor-pointer transition-colors duration-150 outline-none'
    const sizeClass = sizeStyle.item

    let colorClass: string
    if (renderProps.isDisabled) {
      colorClass = 'text-primary-500 cursor-not-allowed'
    } else if (local.isDestructive) {
      if (renderProps.isFocused || renderProps.isHovered) {
        colorClass = 'bg-danger-400/20 text-danger-400'
      } else {
        colorClass = 'text-danger-400'
      }
    } else if (renderProps.isFocused || renderProps.isHovered) {
      colorClass = 'bg-bg-300 text-primary-100'
    } else {
      colorClass = 'text-primary-200'
    }

    const pressedClass = renderProps.isPressed ? 'bg-bg-200' : ''

    const focusClass = renderProps.isFocusVisible
      ? 'ring-2 ring-inset ring-accent-300'
      : ''

    return [base, sizeClass, colorClass, pressedClass, focusClass, customClass].filter(Boolean).join(' ')
  }

  return (
    <HeadlessMenuItem
      {...headlessProps}
      class={getClassName}
    >
      {local.icon && <span class={`shrink-0 ${sizeStyle.icon}`}>{local.icon()}</span>}
      <span class="flex-1">{props.children as JSX.Element}</span>
      {local.shortcut && <span class="text-primary-500 text-sm ml-auto">{local.shortcut}</span>}
    </HeadlessMenuItem>
  )
}

// ============================================
// MENU SEPARATOR COMPONENT
// ============================================

export interface MenuSeparatorProps {
  /** Additional CSS class name. */
  class?: string
}

/**
 * A visual separator between menu items.
 */
export function MenuSeparator(props: MenuSeparatorProps): JSX.Element {
  return (
    <li
      role="separator"
      class={`my-1 border-t border-primary-600 ${props.class ?? ''}`}
    />
  )
}

// ============================================
// ICONS
// ============================================

function ChevronIcon(props: { class?: string }): JSX.Element {
  return (
    <svg
      class={props.class}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

// Attach sub-components for convenience
Menu.Item = MenuItem
Menu.Separator = MenuSeparator
MenuTrigger.Button = MenuButton

// Re-export Key type for convenience
export type { Key }

// Sub-component re-exports
export { ActionMenu } from './ActionMenu';
export type { ActionMenuProps } from './ActionMenu';
export { SubmenuTrigger } from './SubmenuTrigger';
export type { SubmenuTriggerProps } from './SubmenuTrigger';
export { ContextualHelpTrigger } from './ContextualHelpTrigger';
export type { ContextualHelpTriggerProps } from './ContextualHelpTrigger';
