/**
 * ListBox component for proyecto-viviana-silapse
 *
 * Styled listbox component built on top of solidaria-components.
 * Inspired by Spectrum 2's ListBox component patterns.
 */

import { type JSX, splitProps, createContext, useContext, Show, createUniqueId } from 'solid-js'
import {
  ListBox as HeadlessListBox,
  ListBoxOption as HeadlessListBoxOption,
  ListBoxSection as HeadlessListBoxSection,
  type ListBoxProps as HeadlessListBoxProps,
  type ListBoxOptionProps as HeadlessListBoxOptionProps,
  type ListBoxSectionProps as HeadlessListBoxSectionProps,
  type ListBoxRenderProps,
  type ListBoxOptionRenderProps,
} from '@proyecto-viviana/solidaria-components'
import type { Key } from '@proyecto-viviana/solid-stately'
import { useProviderProps } from '../provider'

// ============================================
// SIZE CONTEXT
// ============================================

export type ListBoxSize = 'sm' | 'md' | 'lg'

const ListBoxSizeContext = createContext<ListBoxSize>('md')

// ============================================
// TYPES
// ============================================

export interface ListBoxProps<T> extends Omit<HeadlessListBoxProps<T>, 'class' | 'style'> {
  /** The size of the listbox. */
  size?: ListBoxSize
  /** Additional CSS class name. */
  class?: string
  /** Label for the listbox. */
  label?: string
  /** Description for the listbox. */
  description?: string
}

export interface ListBoxOptionProps<T> extends Omit<HeadlessListBoxOptionProps<T>, 'class' | 'style'> {
  /** Additional CSS class name. */
  class?: string
  /** Optional description text. */
  description?: string
  /**
   * Optional icon to display before the label.
   * Use a function returning JSX for SSR compatibility: `icon={() => <MyIcon />}`
   */
  icon?: () => JSX.Element
}

export interface ListBoxSectionProps extends Omit<HeadlessListBoxSectionProps, 'class' | 'style'> {
  /** Additional CSS class name. */
  class?: string
}

// ============================================
// STYLES
// ============================================

const sizeStyles = {
  sm: {
    list: 'py-1',
    option: 'text-sm py-1.5 px-3 gap-2',
    icon: 'h-4 w-4',
    label: 'text-sm',
    description: 'text-xs',
  },
  md: {
    list: 'py-1.5',
    option: 'text-base py-2 px-4 gap-3',
    icon: 'h-5 w-5',
    label: 'text-base',
    description: 'text-sm',
  },
  lg: {
    list: 'py-2',
    option: 'text-lg py-2.5 px-5 gap-3',
    icon: 'h-6 w-6',
    label: 'text-lg',
    description: 'text-base',
  },
}

// ============================================
// LISTBOX COMPONENT
// ============================================

/**
 * A listbox displays a list of options and allows a user to select one or more of them.
 *
 * Built on solidaria-components ListBox for full accessibility support.
 */
export function ListBox<T>(props: ListBoxProps<T>): JSX.Element {
  const mergedProps = useProviderProps(props)
  const labelId = createUniqueId()
  const descriptionId = createUniqueId()
  const [local, headlessProps] = splitProps(mergedProps, [
    'size',
    'class',
    'label',
    'description',
    'renderEmptyState',
  ])

  const size = local.size ?? 'md'
  const styles = sizeStyles[size]
  const customClass = local.class ?? ''

  const getClassName = (renderProps: ListBoxRenderProps): string => {
    const base = 'rounded-lg border-2 border-primary-600 bg-bg-400 overflow-auto focus:outline-none'
    const sizeClass = styles.list

    let stateClass: string
    if (renderProps.isDisabled) {
      stateClass = 'opacity-50'
    } else {
      stateClass = ''
    }

    const focusClass = renderProps.isFocusVisible
      ? 'ring-2 ring-accent-300 ring-offset-2 ring-offset-bg-400'
      : ''

    return [base, sizeClass, stateClass, focusClass, customClass].filter(Boolean).join(' ')
  }

  const defaultEmptyState = () => (
    <li class="py-4 px-4 text-center text-primary-500">
      No items
    </li>
  )

  const mergedAriaLabel =
    (headlessProps as { 'aria-label'?: string })['aria-label']

  const labelledByIds = [
    (headlessProps as { 'aria-labelledby'?: string })['aria-labelledby'],
    !mergedAriaLabel && local.label ? labelId : undefined,
  ].filter(Boolean).join(' ') || undefined

  const describedByIds = [
    (headlessProps as { 'aria-describedby'?: string })['aria-describedby'],
    local.description ? descriptionId : undefined,
  ].filter(Boolean).join(' ') || undefined

  return (
    <ListBoxSizeContext.Provider value={size}>
      <div class="flex flex-col gap-1.5">
        <Show when={local.label}>
          <span id={labelId} class={`text-primary-200 font-medium ${styles.label}`}>
            {local.label}
          </span>
        </Show>
        <HeadlessListBox
          {...headlessProps}
          aria-label={mergedAriaLabel}
          aria-labelledby={labelledByIds}
          aria-describedby={describedByIds}
          class={getClassName}
          renderEmptyState={local.renderEmptyState ?? defaultEmptyState}
          children={props.children}
        />
        <Show when={local.description}>
          <span id={descriptionId} class="text-primary-400 text-sm">{local.description}</span>
        </Show>
      </div>
    </ListBoxSizeContext.Provider>
  )
}

// ============================================
// LISTBOX OPTION COMPONENT
// ============================================

/**
 * An option in a listbox.
 * SSR-compatible - renders icon, check, content, and description directly without render props.
 */
export function ListBoxOption<T>(props: ListBoxOptionProps<T>): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class', 'description', 'icon'])
  const size = useContext(ListBoxSizeContext)
  const sizeStyle = sizeStyles[size]
  const customClass = local.class ?? ''

  const getClassName = (renderProps: ListBoxOptionRenderProps): string => {
    const base = 'flex items-center cursor-pointer transition-colors duration-150 outline-none'
    const sizeClass = sizeStyle.option

    let colorClass: string
    if (renderProps.isDisabled) {
      colorClass = 'text-primary-500 cursor-not-allowed'
    } else if (renderProps.isSelected) {
      if (renderProps.isFocused || renderProps.isHovered) {
        colorClass = 'bg-accent/30 text-accent'
      } else {
        colorClass = 'bg-accent/20 text-accent'
      }
    } else if (renderProps.isFocused || renderProps.isHovered) {
      colorClass = 'bg-bg-300 text-primary-100'
    } else {
      colorClass = 'text-primary-200'
    }

    const focusClass = renderProps.isFocusVisible
      ? 'ring-2 ring-inset ring-accent-300'
      : ''

    return [base, sizeClass, colorClass, focusClass, customClass].filter(Boolean).join(' ')
  }

  return (
    <HeadlessListBoxOption
      {...headlessProps}
      class={getClassName}
    >
      {local.icon && <span class={`shrink-0 ${sizeStyle.icon}`}>{local.icon()}</span>}
      <CheckIcon class={`shrink-0 ${sizeStyle.icon} text-accent hidden data-selected:block`} />
      <div class="flex flex-col flex-1 min-w-0">
        <span class="truncate">{props.children as JSX.Element}</span>
        {local.description && (
          <span class={`text-primary-400 truncate ${sizeStyle.description}`}>
            {local.description}
          </span>
        )}
      </div>
    </HeadlessListBoxOption>
  )
}

export function ListBoxSection(props: ListBoxSectionProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class'])

  return (
    <HeadlessListBoxSection
      {...headlessProps}
      class={['px-1 py-1', local.class ?? ''].filter(Boolean).join(' ')}
    >
      {props.children}
    </HeadlessListBoxSection>
  )
}

// ============================================
// ICONS
// ============================================

function CheckIcon(props: { class?: string }): JSX.Element {
  return (
    <svg
      class={props.class}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

// Attach sub-components for convenience
ListBox.Option = ListBoxOption
ListBox.Section = ListBoxSection

export const Item = ListBoxOption
export const Section = ListBoxSection
export const ListBoxBase = ListBox

// Re-export Key type for convenience
export type { Key }
