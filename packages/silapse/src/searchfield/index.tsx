/**
 * SearchField component for proyecto-viviana-silapse
 *
 * Styled search field component with clear button and search icon.
 * Built on top of solidaria-components.
 */

import { type JSX, splitProps, Show, useContext } from 'solid-js'
import {
  SearchField as HeadlessSearchField,
  SearchFieldLabel as HeadlessSearchFieldLabel,
  SearchFieldInput as HeadlessSearchFieldInput,
  SearchFieldClearButton as HeadlessSearchFieldClearButton,
  SearchFieldContext,
  type SearchFieldProps as HeadlessSearchFieldProps,
  type SearchFieldRenderProps,
  type SearchFieldInputRenderProps,
  type SearchFieldClearButtonRenderProps,
} from '@proyecto-viviana/solidaria-components'
import { useProviderProps } from '../provider'

// ============================================
// TYPES
// ============================================

export type SearchFieldSize = 'sm' | 'md' | 'lg'
export type SearchFieldVariant = 'outline' | 'filled'

export interface SearchFieldProps extends Omit<HeadlessSearchFieldProps, 'class' | 'style' | 'children' | 'label'> {
  /** The size of the search field. */
  size?: SearchFieldSize
  /** The visual variant of the search field. */
  variant?: SearchFieldVariant
  /** Additional CSS class name. */
  class?: string
  /** Label text for the input. */
  label?: string
  /** Description text shown below the input. */
  description?: string
  /** Error message shown when invalid. */
  errorMessage?: string
  /** Whether to hide the search icon. */
  hideSearchIcon?: boolean
}

// ============================================
// STYLES
// ============================================

const sizeStyles = {
  sm: {
    container: 'h-8',
    input: 'text-sm pl-8 pr-8',
    label: 'text-sm',
    description: 'text-xs',
    icon: 'w-4 h-4 left-2',
    clearButton: 'w-5 h-5 right-1.5',
  },
  md: {
    container: 'h-10',
    input: 'text-base pl-10 pr-10',
    label: 'text-sm',
    description: 'text-sm',
    icon: 'w-5 h-5 left-2.5',
    clearButton: 'w-6 h-6 right-2',
  },
  lg: {
    container: 'h-12',
    input: 'text-lg pl-12 pr-12',
    label: 'text-base',
    description: 'text-sm',
    icon: 'w-6 h-6 left-3',
    clearButton: 'w-7 h-7 right-2.5',
  },
}

// ============================================
// ICONS
// ============================================

function SearchIcon(props: { class?: string }) {
  return (
    <svg
      class={props.class}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <circle cx="8" cy="8" r="5" />
      <path d="M12 12L17 17" stroke-linecap="round" />
    </svg>
  )
}

function ClearIcon(props: { class?: string }) {
  return (
    <svg
      class={props.class}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path d="M4 4L12 12M12 4L4 12" stroke-linecap="round" />
    </svg>
  )
}

function SearchFieldDescription(props: { class?: string; children?: JSX.Element }): JSX.Element | null {
  const context = useContext(SearchFieldContext)
  if (!context) return null
  return (
    <span {...context.descriptionProps} class={props.class}>
      {props.children}
    </span>
  )
}

function SearchFieldError(props: { class?: string; children?: JSX.Element }): JSX.Element | null {
  const context = useContext(SearchFieldContext)
  if (!context) return null
  return (
    <span {...context.errorMessageProps} class={props.class}>
      {props.children}
    </span>
  )
}

// ============================================
// COMPONENT
// ============================================

export function SearchField(props: SearchFieldProps): JSX.Element {
  const mergedProps = useProviderProps(props)
  const [local, headlessProps] = splitProps(mergedProps, [
    'size',
    'variant',
    'class',
    'label',
    'description',
    'errorMessage',
    'hideSearchIcon',
  ])

  const size = () => sizeStyles[local.size ?? 'md']

  const containerClasses = () => {
    const base = 'flex flex-col'
    const disabledClass = headlessProps.isDisabled ? 'opacity-60' : ''
    const custom = local.class ?? ''
    return [base, disabledClass, custom].filter(Boolean).join(' ')
  }

  const inputWrapperClasses = () => {
    const base = 'relative flex items-center'
    const sizeClass = size().container
    return [base, sizeClass].filter(Boolean).join(' ')
  }

  const inputClasses = (renderProps: SearchFieldInputRenderProps) => {
    const base = 'w-full h-full rounded-md transition-all duration-200 outline-none'
    const sizeClass = size().input
    const paddingClass = local.hideSearchIcon ? 'pl-3' : ''

    const variantClass = local.variant === 'filled'
      ? 'bg-bg-200 border border-transparent'
      : 'bg-transparent border border-bg-400'

    let stateClass = ''
    if (renderProps.isDisabled) {
      stateClass = 'bg-bg-200 text-primary-500 cursor-not-allowed'
    } else if (renderProps.isInvalid) {
      stateClass = 'border-danger-500 focus:border-danger-400 focus:ring-2 focus:ring-danger-400/20'
    } else {
      stateClass = 'text-primary-100 placeholder:text-primary-500 focus:border-accent focus:ring-2 focus:ring-accent/20'
    }

    const hoverClass = renderProps.isDisabled ? '' : 'hover:border-accent-300'

    return [base, sizeClass, paddingClass, variantClass, stateClass, hoverClass].filter(Boolean).join(' ')
  }

  const searchIconClasses = () => {
    const base = 'absolute pointer-events-none text-primary-400'
    const sizeClass = size().icon
    return [base, sizeClass].filter(Boolean).join(' ')
  }

  const clearButtonClasses = (renderProps: SearchFieldClearButtonRenderProps) => {
    const base = 'absolute flex items-center justify-center rounded-md transition-all duration-150 select-none'
    const sizeClass = size().clearButton

    let stateClass = ''
    if (renderProps.isDisabled) {
      stateClass = 'text-primary-600 cursor-not-allowed'
    } else if (renderProps.isPressed) {
      stateClass = 'bg-bg-400 text-primary-100 scale-90'
    } else if (renderProps.isHovered) {
      stateClass = 'bg-bg-300 text-primary-100'
    } else {
      stateClass = 'text-primary-400 hover:bg-bg-300 hover:text-primary-100'
    }

    return [base, sizeClass, stateClass].filter(Boolean).join(' ')
  }

  const labelClasses = () => {
    const base = 'block font-medium text-primary-200 mb-1'
    const sizeClass = size().label
    return [base, sizeClass].filter(Boolean).join(' ')
  }

  const descriptionClasses = () => {
    const base = 'mt-1 text-primary-400'
    const sizeClass = size().description
    return [base, sizeClass].filter(Boolean).join(' ')
  }

  const errorClasses = () => {
    const base = 'mt-1 text-danger-500'
    const sizeClass = size().description
    return [base, sizeClass].filter(Boolean).join(' ')
  }

  return (
    <HeadlessSearchField
      {...headlessProps}
      label={local.label}
      description={local.description}
      errorMessage={local.errorMessage}
      class={containerClasses()}
      children={(renderProps: SearchFieldRenderProps) => (
        <>
          <Show when={local.label}>
            <HeadlessSearchFieldLabel class={labelClasses()}>
              {local.label}
              <Show when={renderProps.isRequired}>
                <span class="text-danger-500 ml-1">*</span>
              </Show>
            </HeadlessSearchFieldLabel>
          </Show>

          <div class={inputWrapperClasses()}>
            <Show when={!local.hideSearchIcon}>
              <SearchIcon class={searchIconClasses()} />
            </Show>

            <HeadlessSearchFieldInput class={inputClasses} />

            <HeadlessSearchFieldClearButton class={clearButtonClasses}>
              <ClearIcon class="w-3 h-3" />
            </HeadlessSearchFieldClearButton>
          </div>

          <Show when={local.description && !renderProps.isInvalid}>
            <SearchFieldDescription class={descriptionClasses()}>
              {local.description}
            </SearchFieldDescription>
          </Show>

          <Show when={local.errorMessage && renderProps.isInvalid}>
            <SearchFieldError class={errorClasses()}>
              {local.errorMessage}
            </SearchFieldError>
          </Show>
        </>
      )}
    />
  )
}

// Re-export types
export type { SearchFieldState } from '@proyecto-viviana/solid-stately'
