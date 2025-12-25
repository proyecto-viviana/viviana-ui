/**
 * SearchField component for proyecto-viviana-ui
 *
 * A styled search field component with clear button and search icon.
 * Built directly on solidaria hooks for full accessibility support.
 */

import { type JSX, splitProps, mergeProps as solidMergeProps, Show } from 'solid-js'
import {
  createSearchField,
  createFocusRing,
  createPress,
  createHover,
  type AriaSearchFieldProps,
} from '@proyecto-viviana/solidaria'
import {
  createSearchFieldState,
} from '@proyecto-viviana/solid-stately'

// ============================================
// TYPES
// ============================================

export type SearchFieldSize = 'sm' | 'md' | 'lg'
export type SearchFieldVariant = 'outline' | 'filled'

export interface SearchFieldProps extends Omit<AriaSearchFieldProps, 'label'> {
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
  /** The current value (controlled). */
  value?: string
  /** The default value (uncontrolled). */
  defaultValue?: string
  /** Handler called when the value changes. */
  onChange?: (value: string) => void
  /** Handler called when the user submits the search. */
  onSubmit?: (value: string) => void
  /** Handler called when the field is cleared. */
  onClear?: () => void
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

// ============================================
// COMPONENT
// ============================================

/**
 * A search field allows users to enter and clear a search query.
 *
 * Built directly on solidaria hooks for full accessibility support.
 */
export function SearchField(props: SearchFieldProps): JSX.Element {
  const defaultProps: Partial<SearchFieldProps> = {
    size: 'md',
    variant: 'outline',
  }

  const merged = solidMergeProps(defaultProps, props)

  const [local, stateProps, ariaProps] = splitProps(merged, [
    'size',
    'variant',
    'class',
    'label',
    'description',
    'errorMessage',
    'hideSearchIcon',
  ], [
    'value',
    'defaultValue',
    'onChange',
    'onSubmit',
    'onClear',
  ])

  const size = () => sizeStyles[local.size!]

  // Ref for input element
  let inputRef: HTMLInputElement | undefined

  // Create search field state
  const state = createSearchFieldState({
    get value() {
      return stateProps.value
    },
    get defaultValue() {
      return stateProps.defaultValue
    },
    get onChange() {
      return stateProps.onChange
    },
  })

  // Create search field aria props
  const searchFieldAria = createSearchField(
    {
      get label() {
        return local.label
      },
      get 'aria-label'() {
        return ariaProps['aria-label']
      },
      get 'aria-labelledby'() {
        return ariaProps['aria-labelledby']
      },
      get 'aria-describedby'() {
        return ariaProps['aria-describedby']
      },
      get isDisabled() {
        return ariaProps.isDisabled
      },
      get isReadOnly() {
        return ariaProps.isReadOnly
      },
      get isRequired() {
        return ariaProps.isRequired
      },
      get isInvalid() {
        return ariaProps.isInvalid
      },
      get description() {
        return local.description
      },
      get errorMessage() {
        return local.errorMessage
      },
      get placeholder() {
        return ariaProps.placeholder
      },
      get name() {
        return ariaProps.name
      },
      get autoFocus() {
        return ariaProps.autoFocus
      },
      get autoComplete() {
        return ariaProps.autoComplete
      },
      get maxLength() {
        return ariaProps.maxLength
      },
      get minLength() {
        return ariaProps.minLength
      },
      get pattern() {
        return ariaProps.pattern
      },
      get onSubmit() {
        return stateProps.onSubmit
      },
      get onClear() {
        return stateProps.onClear
      },
    },
    state,
    () => inputRef ?? null
  )

  // Create focus ring for input
  const { isFocused, isFocusVisible, focusProps } = createFocusRing()

  // Create hover for input
  const { isHovered, hoverProps } = createHover({
    get isDisabled() {
      return ariaProps.isDisabled
    },
  })

  // Clear button interactions
  const { isPressed: clearPressed, pressProps: clearPressProps } = createPress({
    get isDisabled() {
      return ariaProps.isDisabled || ariaProps.isReadOnly
    },
    onPress: () => {
      searchFieldAria.clearButtonProps.onClick()
    },
  })

  const { isHovered: clearHovered, hoverProps: clearHoverProps } = createHover({
    get isDisabled() {
      return ariaProps.isDisabled || ariaProps.isReadOnly
    },
  })

  // Compute classes
  const containerClasses = () => {
    const base = 'flex flex-col'
    const disabledClass = ariaProps.isDisabled ? 'opacity-60' : ''
    const custom = local.class || ''
    return [base, disabledClass, custom].filter(Boolean).join(' ')
  }

  const inputWrapperClasses = () => {
    const base = 'relative flex items-center'
    const sizeClass = size().container
    return [base, sizeClass].filter(Boolean).join(' ')
  }

  const inputClasses = () => {
    const base = 'w-full h-full rounded-md transition-all duration-200 outline-none'
    const sizeClass = size().input

    // Adjust padding based on search icon visibility
    const paddingClass = local.hideSearchIcon ? 'pl-3' : ''

    let variantClass: string
    if (local.variant === 'filled') {
      variantClass = 'bg-bg-200 border border-transparent'
    } else {
      variantClass = 'bg-transparent border border-bg-400'
    }

    let stateClass: string
    if (ariaProps.isDisabled) {
      stateClass = 'bg-bg-200 text-primary-500 cursor-not-allowed'
    } else if (ariaProps.isInvalid) {
      stateClass = 'border-danger-500 focus:border-danger-400 focus:ring-2 focus:ring-danger-400/20'
    } else {
      stateClass = 'text-primary-100 placeholder:text-primary-500 focus:border-accent focus:ring-2 focus:ring-accent/20'
    }

    const hoverClass = ariaProps.isDisabled ? '' : 'hover:border-accent-300'

    return [base, sizeClass, paddingClass, variantClass, stateClass, hoverClass].filter(Boolean).join(' ')
  }

  const searchIconClasses = () => {
    const base = 'absolute pointer-events-none text-primary-400'
    const sizeClass = size().icon
    const focusedClass = isFocused() ? 'text-accent' : ''
    return [base, sizeClass, focusedClass].filter(Boolean).join(' ')
  }

  const clearButtonClasses = () => {
    const base = 'absolute flex items-center justify-center rounded-md transition-all duration-150 select-none'
    const sizeClass = size().clearButton

    const isDisabled = ariaProps.isDisabled || ariaProps.isReadOnly

    let stateClass: string
    if (isDisabled) {
      stateClass = 'text-primary-600 cursor-not-allowed'
    } else if (clearPressed()) {
      stateClass = 'bg-bg-400 text-primary-100 scale-90'
    } else if (clearHovered()) {
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

  // Clean props helpers
  const cleanInputProps = () => {
    const { ref: _ref, ...rest } = searchFieldAria.inputProps as Record<string, unknown>
    return rest
  }

  const cleanFocusProps = () => {
    const { ref: _ref, ...rest } = focusProps as Record<string, unknown>
    return rest
  }

  const cleanHoverProps = () => {
    const { ref: _ref, ...rest } = hoverProps as Record<string, unknown>
    return rest
  }

  const cleanLabelProps = () => {
    const { ref: _ref, ...rest } = searchFieldAria.labelProps as Record<string, unknown>
    return rest
  }

  const cleanClearPressProps = () => {
    const { ref: _ref, ...rest } = clearPressProps as Record<string, unknown>
    return rest
  }

  const cleanClearHoverProps = () => {
    const { ref: _ref, ...rest } = clearHoverProps as Record<string, unknown>
    return rest
  }

  const isEmpty = () => state.value() === ''

  return (
    <div
      class={containerClasses()}
      data-empty={isEmpty() || undefined}
      data-disabled={ariaProps.isDisabled || undefined}
      data-invalid={ariaProps.isInvalid || undefined}
    >
      {/* Label */}
      <Show when={local.label}>
        <span {...cleanLabelProps()} class={labelClasses()}>
          {local.label}
          <Show when={ariaProps.isRequired}>
            <span class="text-danger-500 ml-1">*</span>
          </Show>
        </span>
      </Show>

      {/* Input Wrapper */}
      <div class={inputWrapperClasses()}>
        {/* Search Icon */}
        <Show when={!local.hideSearchIcon}>
          <SearchIcon class={searchIconClasses()} />
        </Show>

        {/* Input */}
        <input
          ref={inputRef}
          {...cleanInputProps()}
          {...cleanFocusProps()}
          {...cleanHoverProps()}
          class={inputClasses()}
          data-focused={isFocused() || undefined}
          data-focus-visible={isFocusVisible() || undefined}
          data-hovered={isHovered() || undefined}
        />

        {/* Clear Button */}
        <Show when={!isEmpty()}>
          <button
            type="button"
            aria-label={searchFieldAria.clearButtonProps['aria-label']}
            tabIndex={searchFieldAria.clearButtonProps.tabIndex}
            disabled={searchFieldAria.clearButtonProps.disabled}
            onMouseDown={searchFieldAria.clearButtonProps.onMouseDown}
            {...cleanClearPressProps()}
            {...cleanClearHoverProps()}
            class={clearButtonClasses()}
            data-pressed={clearPressed() || undefined}
            data-hovered={clearHovered() || undefined}
          >
            <ClearIcon class="w-3 h-3" />
          </button>
        </Show>
      </div>

      {/* Description */}
      <Show when={local.description && !ariaProps.isInvalid}>
        <span {...searchFieldAria.descriptionProps} class={descriptionClasses()}>
          {local.description}
        </span>
      </Show>

      {/* Error Message */}
      <Show when={ariaProps.isInvalid && local.errorMessage}>
        <span {...searchFieldAria.errorMessageProps} class={errorClasses()}>
          {local.errorMessage}
        </span>
      </Show>
    </div>
  )
}

// Re-export types
export type { SearchFieldState } from '@proyecto-viviana/solid-stately'
