/**
 * ComboBox component for proyecto-viviana-ui
 *
 * Styled combobox component built on top of solidaria-components.
 * Inspired by Spectrum 2's ComboBox component patterns.
 */

import { type JSX, Show, splitProps, createContext, useContext } from 'solid-js'
import {
  ComboBox as HeadlessComboBox,
  ComboBoxInput as HeadlessComboBoxInput,
  ComboBoxButton as HeadlessComboBoxButton,
  ComboBoxListBox as HeadlessComboBoxListBox,
  ComboBoxOption as HeadlessComboBoxOption,
  defaultContainsFilter,
  type ComboBoxProps as HeadlessComboBoxProps,
  type ComboBoxInputProps as HeadlessComboBoxInputProps,
  type ComboBoxButtonProps as HeadlessComboBoxButtonProps,
  type ComboBoxListBoxProps as HeadlessComboBoxListBoxProps,
  type ComboBoxOptionProps as HeadlessComboBoxOptionProps,
  type ComboBoxRenderProps,
  type ComboBoxInputRenderProps,
  type ComboBoxButtonRenderProps,
  type ComboBoxListBoxRenderProps,
  type ComboBoxOptionRenderProps,
} from '@proyecto-viviana/solidaria-components'
import type { Key, FilterFn, MenuTriggerAction } from '@proyecto-viviana/solid-stately'

// ============================================
// SIZE CONTEXT
// ============================================

export type ComboBoxSize = 'sm' | 'md' | 'lg'

const ComboBoxSizeContext = createContext<ComboBoxSize>('md')

// ============================================
// TYPES
// ============================================

export interface ComboBoxProps<T> extends Omit<HeadlessComboBoxProps<T>, 'class' | 'style'> {
  /** The size of the combobox. */
  size?: ComboBoxSize
  /** Additional CSS class name. */
  class?: string
  /** Label for the combobox. */
  label?: string
  /** Description for the combobox. */
  description?: string
  /** Error message when invalid. */
  errorMessage?: string
  /** Whether the combobox is invalid. */
  isInvalid?: boolean
}

export interface ComboBoxInputProps extends Omit<HeadlessComboBoxInputProps, 'class' | 'style'> {
  /** Additional CSS class name. */
  class?: string
}

export interface ComboBoxButtonProps extends Omit<HeadlessComboBoxButtonProps, 'class' | 'style'> {
  /** Additional CSS class name. */
  class?: string
}

export interface ComboBoxListBoxProps<T> extends Omit<HeadlessComboBoxListBoxProps<T>, 'class' | 'style'> {
  /** Additional CSS class name. */
  class?: string
}

export interface ComboBoxOptionProps<T> extends Omit<HeadlessComboBoxOptionProps<T>, 'class' | 'style'> {
  /** Additional CSS class name. */
  class?: string
}

// ============================================
// STYLES
// ============================================

const sizeStyles = {
  sm: {
    wrapper: 'h-8',
    input: 'h-8 text-sm pl-3 pr-8',
    button: 'h-8 w-8',
    label: 'text-sm',
    option: 'text-sm py-1.5 px-3',
    icon: 'h-4 w-4',
  },
  md: {
    wrapper: 'h-10',
    input: 'h-10 text-base pl-4 pr-10',
    button: 'h-10 w-10',
    label: 'text-base',
    option: 'text-base py-2 px-4',
    icon: 'h-5 w-5',
  },
  lg: {
    wrapper: 'h-12',
    input: 'h-12 text-lg pl-5 pr-12',
    button: 'h-12 w-12',
    label: 'text-lg',
    option: 'text-lg py-2.5 px-5',
    icon: 'h-6 w-6',
  },
}

// ============================================
// COMBOBOX COMPONENT
// ============================================

/**
 * A combobox combines a text input with a listbox, allowing users to filter a list of options.
 *
 * Built on solidaria-components ComboBox for full accessibility support.
 */
export function ComboBox<T>(props: ComboBoxProps<T>): JSX.Element {
  const [local, headlessProps] = splitProps(props, [
    'size',
    'class',
    'label',
    'description',
    'errorMessage',
    'isInvalid',
    'children',
  ])

  const size = local.size ?? 'md'
  const customClass = local.class ?? ''

  const getClassName = (renderProps: ComboBoxRenderProps): string => {
    const base = 'relative inline-flex flex-col gap-1.5'
    const disabledClass = renderProps.isDisabled ? 'opacity-50' : ''
    return [base, disabledClass, customClass].filter(Boolean).join(' ')
  }

  return (
    <ComboBoxSizeContext.Provider value={size}>
      <HeadlessComboBox
        {...headlessProps}
        class={getClassName}
      >
        <Show when={local.label}>
          <label class={`text-primary-200 font-medium ${sizeStyles[size].label}`}>
            {local.label}
          </label>
        </Show>
        {local.children}
        <Show when={local.description && !local.isInvalid}>
          <span class="text-primary-400 text-sm">{local.description}</span>
        </Show>
        <Show when={local.errorMessage && local.isInvalid}>
          <span class="text-danger-400 text-sm">{local.errorMessage}</span>
        </Show>
      </HeadlessComboBox>
    </ComboBoxSizeContext.Provider>
  )
}

// ============================================
// COMBOBOX INPUT GROUP COMPONENT
// ============================================

/**
 * A wrapper for the input and button that provides proper styling.
 */
export function ComboBoxInputGroup(props: { children: JSX.Element; class?: string }): JSX.Element {
  const size = useContext(ComboBoxSizeContext)
  const styles = () => sizeStyles[size]

  return (
    <div class={`relative flex items-center ${styles().wrapper} ${props.class ?? ''}`}>
      {props.children}
    </div>
  )
}

// ============================================
// COMBOBOX INPUT COMPONENT
// ============================================

/**
 * The text input for a combobox.
 */
export function ComboBoxInput(props: ComboBoxInputProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class', 'children'])
  const size = useContext(ComboBoxSizeContext)
  const styles = () => sizeStyles[size]
  const customClass = local.class ?? ''

  const getClassName = (renderProps: ComboBoxInputRenderProps): string => {
    const base = 'w-full rounded-lg border-2 transition-all duration-200 outline-none'
    const sizeClass = styles().input

    let colorClass: string
    if (renderProps.isDisabled) {
      colorClass = 'border-bg-300 bg-bg-200 text-primary-500 cursor-not-allowed'
    } else if (renderProps.isOpen) {
      colorClass = 'border-accent bg-bg-300 text-primary-100'
    } else if (renderProps.isHovered) {
      colorClass = 'border-accent-300 bg-bg-300 text-primary-100'
    } else {
      colorClass = 'border-primary-600 bg-bg-400 text-primary-200'
    }

    const focusClass = renderProps.isFocusVisible
      ? 'ring-2 ring-accent-300 ring-offset-2 ring-offset-bg-400'
      : ''

    return [base, sizeClass, colorClass, focusClass, customClass].filter(Boolean).join(' ')
  }

  return (
    <HeadlessComboBoxInput
      {...headlessProps}
      class={getClassName}
    />
  )
}

// ============================================
// COMBOBOX BUTTON COMPONENT
// ============================================

/**
 * The trigger button for a combobox.
 */
export function ComboBoxButton(props: ComboBoxButtonProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class', 'children'])
  const size = useContext(ComboBoxSizeContext)
  const styles = () => sizeStyles[size]
  const customClass = local.class ?? ''

  const getClassName = (renderProps: ComboBoxButtonRenderProps): string => {
    const base = 'absolute right-0 top-0 flex items-center justify-center transition-all duration-200 rounded-r-lg'
    const sizeClass = styles().button

    let colorClass: string
    if (renderProps.isDisabled) {
      colorClass = 'text-primary-500 cursor-not-allowed'
    } else if (renderProps.isOpen) {
      colorClass = 'text-accent'
    } else if (renderProps.isHovered) {
      colorClass = 'text-accent-300 cursor-pointer'
    } else {
      colorClass = 'text-primary-400 cursor-pointer hover:text-primary-200'
    }

    return [base, sizeClass, colorClass, customClass].filter(Boolean).join(' ')
  }

  const renderChildren = (renderProps: ComboBoxButtonRenderProps) => (
    <>
      {typeof local.children === 'function' ? local.children(renderProps) : local.children}
      {!local.children && (
        <ChevronIcon class={`${styles().icon} transition-transform duration-200 ${renderProps.isOpen ? 'rotate-180' : ''}`} />
      )}
    </>
  )

  return (
    <HeadlessComboBoxButton
      {...headlessProps}
      class={getClassName}
      children={renderChildren}
    />
  )
}

// ============================================
// COMBOBOX LISTBOX COMPONENT
// ============================================

/**
 * The listbox popup for a combobox.
 */
export function ComboBoxListBox<T>(props: ComboBoxListBoxProps<T>): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class', 'children'])
  const customClass = local.class ?? ''

  const getClassName = (_renderProps: ComboBoxListBoxRenderProps): string => {
    const base = 'absolute z-50 mt-1 w-full rounded-lg border-2 border-primary-600 bg-bg-400 py-1 shadow-lg max-h-60 overflow-auto'
    return [base, customClass].filter(Boolean).join(' ')
  }

  return (
    <HeadlessComboBoxListBox
      {...headlessProps}
      class={getClassName}
      children={local.children}
    />
  )
}

// ============================================
// COMBOBOX OPTION COMPONENT
// ============================================

/**
 * An option in a combobox listbox.
 */
export function ComboBoxOption<T>(props: ComboBoxOptionProps<T>): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class', 'children'])
  const size = useContext(ComboBoxSizeContext)
  const styles = () => sizeStyles[size]
  const customClass = local.class ?? ''

  const getClassName = (renderProps: ComboBoxOptionRenderProps): string => {
    const base = 'flex items-center gap-2 cursor-pointer transition-colors duration-150'
    const sizeClass = styles().option

    let colorClass: string
    if (renderProps.isDisabled) {
      colorClass = 'text-primary-500 cursor-not-allowed'
    } else if (renderProps.isSelected) {
      colorClass = 'bg-accent/20 text-accent'
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

  // Compute padding for non-selected items to align with check icon
  const iconPadding: Record<ComboBoxSize, string> = {
    sm: 'pl-6',  // h-4 icon + gap
    md: 'pl-7',  // h-5 icon + gap
    lg: 'pl-8',  // h-6 icon + gap
  }

  const renderChildren = (renderProps: ComboBoxOptionRenderProps) => (
    <>
      <Show when={renderProps.isSelected}>
        <CheckIcon class={`${styles().icon} text-accent flex-shrink-0`} />
      </Show>
      <span class={`flex-1 ${renderProps.isSelected ? '' : iconPadding[size]}`}>
        {typeof local.children === 'function' ? local.children(renderProps) : local.children}
      </span>
    </>
  )

  return (
    <HeadlessComboBoxOption
      {...headlessProps}
      class={getClassName}
      children={renderChildren}
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
ComboBox.InputGroup = ComboBoxInputGroup
ComboBox.Input = ComboBoxInput
ComboBox.Button = ComboBoxButton
ComboBox.ListBox = ComboBoxListBox
ComboBox.Option = ComboBoxOption

// Re-export types and utilities for convenience
export type { Key, FilterFn, MenuTriggerAction }
export { defaultContainsFilter }
