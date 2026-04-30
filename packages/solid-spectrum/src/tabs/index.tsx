/**
 * Tabs component for proyecto-viviana-solid-spectrum
 *
 * Styled tabs component built on top of solidaria-components.
 * Inspired by Spectrum 2's Tabs component patterns.
 */

import { type JSX, splitProps, createContext, useContext } from 'solid-js'
import {
  Tabs as HeadlessTabs,
  TabList as HeadlessTabList,
  Tab as HeadlessTab,
  TabPanels as HeadlessTabPanels,
  TabPanel as HeadlessTabPanel,
  type TabsProps as HeadlessTabsProps,
  type TabListProps as HeadlessTabListProps,
  type TabProps as HeadlessTabProps,
  type TabPanelsProps as HeadlessTabPanelsProps,
  type TabPanelProps as HeadlessTabPanelProps,
  type TabsRenderProps,
  type TabListRenderProps,
  type TabRenderProps,
  type TabPanelRenderProps,
} from '@proyecto-viviana/solidaria-components'
import type { Key, TabOrientation } from '@proyecto-viviana/solid-stately'
import { useProviderProps } from '../provider'

// ============================================
// SIZE CONTEXT
// ============================================

export type TabsSize = 'sm' | 'md' | 'lg'
export type TabsVariant = 'underline' | 'pill' | 'boxed'

interface TabsContextValue {
  size: TabsSize
  variant: TabsVariant
}

const TabsSizeContext = createContext<TabsContextValue>({ size: 'md', variant: 'underline' })

// ============================================
// TYPES
// ============================================

export interface TabsProps<T> extends Omit<HeadlessTabsProps<T>, 'class' | 'style'> {
  /** The size of the tabs. */
  size?: TabsSize
  /** The visual variant of the tabs. */
  variant?: TabsVariant
  /** Additional CSS class name. */
  class?: string
}

export interface TabListProps<T> extends Omit<HeadlessTabListProps<T>, 'class' | 'style'> {
  /** Additional CSS class name. */
  class?: string
}

export interface TabProps extends Omit<HeadlessTabProps, 'class' | 'style'> {
  /** Additional CSS class name. */
  class?: string
}

export interface TabPanelProps extends Omit<HeadlessTabPanelProps, 'class' | 'style'> {
  /** Additional CSS class name. */
  class?: string
}

export interface TabPanelsProps extends Omit<HeadlessTabPanelsProps, 'class' | 'style'> {
  /** Additional CSS class name. */
  class?: string
}

// ============================================
// STYLES
// ============================================

const sizeStyles = {
  sm: {
    tab: 'text-sm px-3 py-1.5',
    tabList: 'gap-1',
    panel: 'text-sm p-3',
  },
  md: {
    tab: 'text-base px-4 py-2',
    tabList: 'gap-2',
    panel: 'text-base p-4',
  },
  lg: {
    tab: 'text-lg px-5 py-2.5',
    tabList: 'gap-3',
    panel: 'text-lg p-5',
  },
}

const variantStyles = {
  underline: {
    tabList: 'border-b-2 border-primary-600',
    tab: {
      base: 'relative border-b-2 -mb-0.5 transition-colors duration-200',
      default: 'border-transparent text-primary-400 hover:text-primary-200 hover:border-primary-400',
      selected: 'border-accent text-accent',
      disabled: 'border-transparent text-primary-600 cursor-not-allowed',
    },
  },
  pill: {
    tabList: 'bg-bg-300 rounded-lg p-1',
    tab: {
      base: 'rounded-md transition-all duration-200',
      default: 'text-primary-400 hover:text-primary-200 hover:bg-bg-400',
      selected: 'bg-accent text-bg-400 shadow-sm',
      disabled: 'text-primary-600 cursor-not-allowed',
    },
  },
  boxed: {
    tabList: 'border-2 border-primary-600 rounded-lg overflow-hidden',
    tab: {
      base: 'border-r-2 border-primary-600 last:border-r-0 transition-colors duration-200',
      default: 'text-primary-400 bg-bg-400 hover:text-primary-200 hover:bg-bg-300',
      selected: 'bg-accent/20 text-accent',
      disabled: 'text-primary-600 bg-bg-300 cursor-not-allowed',
    },
  },
}

// ============================================
// TABS COMPONENT
// ============================================

/**
 * Tabs organize content into multiple sections and allow users to navigate between them.
 *
 * Built on solidaria-components Tabs for full accessibility support.
 */
export function Tabs<T>(props: TabsProps<T>): JSX.Element {
  const mergedProps = useProviderProps(props)
  const [local, headlessProps] = splitProps(mergedProps, [
    'size',
    'variant',
    'class',
  ])

  const size = local.size ?? 'md'
  const variant = local.variant ?? 'underline'
  const customClass = local.class ?? ''

  const getClassName = (renderProps: TabsRenderProps): string => {
    const base = 'flex flex-col'
    const orientationClass = renderProps.orientation === 'vertical' ? 'flex-row' : 'flex-col'
    const disabledClass = renderProps.isDisabled ? 'opacity-50' : ''
    return [base, orientationClass, disabledClass, customClass].filter(Boolean).join(' ')
  }

  return (
    <TabsSizeContext.Provider value={{ size, variant }}>
      <HeadlessTabs
        {...headlessProps}
        class={getClassName}
        children={props.children}
      />
    </TabsSizeContext.Provider>
  )
}

// ============================================
// TAB LIST COMPONENT
// ============================================

/**
 * A TabList contains Tab elements that represent the available tabs.
 */
export function TabList<T>(props: TabListProps<T>): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class'])
  const ctx = useContext(TabsSizeContext)
  const customClass = local.class ?? ''

  const getClassName = (renderProps: TabListRenderProps): string => {
    const base = 'flex'
    const orientationClass = renderProps.orientation === 'vertical' ? 'flex-col' : 'flex-row'
    const sizeClass = sizeStyles[ctx.size].tabList
    const variantClass = variantStyles[ctx.variant].tabList

    const focusClass = renderProps.isFocusVisible
      ? 'ring-2 ring-accent-300 ring-offset-2 ring-offset-bg-400'
      : ''

    return [base, orientationClass, sizeClass, variantClass, focusClass, customClass].filter(Boolean).join(' ')
  }

  return (
    <HeadlessTabList
      {...headlessProps}
      class={getClassName}
      children={props.children}
    />
  )
}

// ============================================
// TAB COMPONENT
// ============================================

/**
 * A Tab represents an individual tab in a TabList.
 */
export function Tab(props: TabProps): JSX.Element {
  const mergedProps = useProviderProps(props)
  const [local, headlessProps] = splitProps(mergedProps, ['class'])
  const ctx = useContext(TabsSizeContext)
  const customClass = local.class ?? ''

  const getClassName = (renderProps: TabRenderProps): string => {
    const sizeClass = sizeStyles[ctx.size].tab
    const variantBase = variantStyles[ctx.variant].tab.base

    let stateClass: string
    if (renderProps.isDisabled) {
      stateClass = variantStyles[ctx.variant].tab.disabled
    } else if (renderProps.isSelected) {
      stateClass = variantStyles[ctx.variant].tab.selected
    } else {
      stateClass = variantStyles[ctx.variant].tab.default
    }

    const focusClass = renderProps.isFocusVisible
      ? 'ring-2 ring-accent-300 ring-offset-1 ring-offset-bg-400 outline-none'
      : ''

    const pressedClass = renderProps.isPressed ? 'scale-95' : ''
    const cursorClass = renderProps.isDisabled ? '' : 'cursor-pointer'

    return [variantBase, sizeClass, stateClass, focusClass, pressedClass, cursorClass, customClass].filter(Boolean).join(' ')
  }

  return (
    <HeadlessTab
      {...headlessProps}
      class={getClassName}
      children={props.children}
    />
  )
}

// ============================================
// TAB PANELS COMPONENT
// ============================================

/**
 * A TabPanels groups TabPanel elements for composition parity.
 */
export function TabPanels(props: TabPanelsProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class'])
  const customClass = local.class ?? ''

  return (
    <HeadlessTabPanels
      {...headlessProps}
      class={['flex-1', customClass].filter(Boolean).join(' ')}
    >
      {props.children}
    </HeadlessTabPanels>
  )
}

// ============================================
// TAB PANEL COMPONENT
// ============================================

/**
 * A TabPanel displays the content for a selected Tab.
 */
export function TabPanel(props: TabPanelProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class'])
  const ctx = useContext(TabsSizeContext)
  const customClass = local.class ?? ''

  const getClassName = (renderProps: TabPanelRenderProps): string => {
    const base = 'outline-none'
    const sizeClass = sizeStyles[ctx.size].panel

    const focusClass = renderProps.isFocusVisible
      ? 'ring-2 ring-accent-300 ring-offset-2 ring-offset-bg-400'
      : ''

    return [base, sizeClass, focusClass, customClass].filter(Boolean).join(' ')
  }

  return (
    <HeadlessTabPanel
      {...headlessProps}
      class={getClassName}
      children={props.children}
    />
  )
}

// Attach sub-components for convenience
Tabs.List = TabList
Tabs.Tab = Tab
Tabs.Panels = TabPanels
Tabs.Panel = TabPanel

// Re-export types for convenience
export type { Key, TabOrientation }
