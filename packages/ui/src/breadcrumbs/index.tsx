/**
 * Breadcrumbs component for proyecto-viviana-ui
 *
 * Styled breadcrumbs component built on top of solidaria-components.
 * Inspired by Spectrum 2's Breadcrumbs component patterns.
 */

import { type JSX, splitProps, createContext, useContext } from 'solid-js'
import {
  Breadcrumbs as HeadlessBreadcrumbs,
  BreadcrumbItem as HeadlessBreadcrumbItem,
  type BreadcrumbsProps as HeadlessBreadcrumbsProps,
  type BreadcrumbItemProps as HeadlessBreadcrumbItemProps,
  type BreadcrumbsRenderProps,
  type BreadcrumbItemRenderProps,
} from '@proyecto-viviana/solidaria-components'

// ============================================
// SIZE CONTEXT
// ============================================

export type BreadcrumbsSize = 'sm' | 'md' | 'lg'
export type BreadcrumbsVariant = 'default' | 'subtle'

interface BreadcrumbsContextValue {
  size: BreadcrumbsSize
  variant: BreadcrumbsVariant
  showSeparator: boolean
}

const BreadcrumbsSizeContext = createContext<BreadcrumbsContextValue>({
  size: 'md',
  variant: 'default',
  showSeparator: true,
})

// ============================================
// TYPES
// ============================================

export interface BreadcrumbsProps<T> extends Omit<HeadlessBreadcrumbsProps<T>, 'class' | 'style'> {
  /** The size of the breadcrumbs. */
  size?: BreadcrumbsSize
  /** The visual variant. */
  variant?: BreadcrumbsVariant
  /** Whether to show separators between items. */
  showSeparator?: boolean
  /** Additional CSS class name. */
  class?: string
}

export interface BreadcrumbItemProps extends Omit<HeadlessBreadcrumbItemProps, 'class' | 'style'> {
  /** Additional CSS class name. */
  class?: string
}

// ============================================
// STYLES
// ============================================

const sizeStyles = {
  sm: {
    text: 'text-sm',
    icon: 'h-3 w-3',
    gap: 'gap-1',
  },
  md: {
    text: 'text-base',
    icon: 'h-4 w-4',
    gap: 'gap-1.5',
  },
  lg: {
    text: 'text-lg',
    icon: 'h-5 w-5',
    gap: 'gap-2',
  },
}

const variantStyles = {
  default: {
    item: 'text-primary-400 hover:text-primary-200',
    current: 'text-primary-100 font-medium',
    separator: 'text-primary-500',
  },
  subtle: {
    item: 'text-primary-500 hover:text-primary-300',
    current: 'text-primary-200',
    separator: 'text-primary-600',
  },
}

// ============================================
// BREADCRUMBS COMPONENT
// ============================================

/**
 * Breadcrumbs show hierarchy and navigational context for a user's location within an application.
 *
 * Built on solidaria-components Breadcrumbs for full accessibility support.
 */
export function Breadcrumbs<T>(props: BreadcrumbsProps<T>): JSX.Element {
  const [local, headlessProps] = splitProps(props, [
    'size',
    'variant',
    'showSeparator',
    'class',
    'children',
  ])

  const size = local.size ?? 'md'
  const variant = local.variant ?? 'default'
  const showSeparator = local.showSeparator ?? true
  const customClass = local.class ?? ''

  const getClassName = (renderProps: BreadcrumbsRenderProps): string => {
    const base = 'flex items-center'
    const sizeClass = sizeStyles[size].gap
    const disabledClass = renderProps.isDisabled ? 'opacity-50' : ''
    return [base, sizeClass, disabledClass, customClass].filter(Boolean).join(' ')
  }

  return (
    <BreadcrumbsSizeContext.Provider value={{ size, variant, showSeparator }}>
      <HeadlessBreadcrumbs
        {...headlessProps}
        class={getClassName}
        children={local.children}
      />
    </BreadcrumbsSizeContext.Provider>
  )
}

// ============================================
// BREADCRUMB ITEM COMPONENT
// ============================================

/**
 * A BreadcrumbItem represents an individual breadcrumb in the navigation trail.
 */
export function BreadcrumbItem(props: BreadcrumbItemProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class', 'children'])
  const ctx = useContext(BreadcrumbsSizeContext)
  const customClass = local.class ?? ''

  const getClassName = (renderProps: BreadcrumbItemRenderProps): string => {
    const sizeClass = sizeStyles[ctx.size].text
    const vStyles = variantStyles[ctx.variant]

    let stateClass: string
    if (renderProps.isCurrent) {
      stateClass = vStyles.current
    } else if (renderProps.isDisabled) {
      stateClass = 'text-primary-600 cursor-not-allowed'
    } else {
      stateClass = vStyles.item
    }

    const cursorClass = renderProps.isCurrent || renderProps.isDisabled ? '' : 'cursor-pointer'
    const transitionClass = 'transition-colors duration-150'
    const focusClass = renderProps.isFocusVisible
      ? 'ring-2 ring-accent-300 ring-offset-1 ring-offset-bg-400 outline-none rounded'
      : ''

    return [sizeClass, stateClass, cursorClass, transitionClass, focusClass, customClass].filter(Boolean).join(' ')
  }

  const vStyles = variantStyles[ctx.variant]
  // Hide separator on first item, and on current (last) item
  const separatorClass = `${sizeStyles[ctx.size].icon} ${vStyles.separator} mx-1 shrink-0 hidden data-current:hidden [&:not([data-current])]:block [li:first-child_&]:!hidden`

  // Wrap children with separator icon
  const renderChildren = () => (
    <>
      {/* Separator shows before items except first and current */}
      {ctx.showSeparator && <ChevronIcon class={separatorClass} />}
      {local.children as JSX.Element}
    </>
  )

  return (
    <HeadlessBreadcrumbItem
      {...headlessProps}
      class={getClassName}
      children={renderChildren()}
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
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}

// Attach sub-components for convenience
Breadcrumbs.Item = BreadcrumbItem
