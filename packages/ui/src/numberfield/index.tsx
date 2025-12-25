/**
 * NumberField component for proyecto-viviana-ui
 *
 * A styled number field component with increment/decrement buttons.
 * Built directly on solidaria hooks for full accessibility support.
 */

import { type JSX, splitProps, mergeProps as solidMergeProps, Show } from 'solid-js'
import {
  createNumberField,
  createFocusRing,
  createPress,
  createHover,
  type AriaNumberFieldProps,
} from '@proyecto-viviana/solidaria'
import {
  createNumberFieldState,
} from '@proyecto-viviana/solid-stately'

// ============================================
// TYPES
// ============================================

export type NumberFieldSize = 'sm' | 'md' | 'lg'
export type NumberFieldVariant = 'outline' | 'filled'

export interface NumberFieldProps extends Omit<AriaNumberFieldProps, 'label'> {
  /** The size of the number field. */
  size?: NumberFieldSize
  /** The visual variant of the number field. */
  variant?: NumberFieldVariant
  /** Additional CSS class name. */
  class?: string
  /** Label text for the input. */
  label?: string
  /** Description text shown below the input. */
  description?: string
  /** Error message shown when invalid. */
  errorMessage?: string
  /** The current value (controlled). */
  value?: number
  /** The default value (uncontrolled). */
  defaultValue?: number
  /** Handler called when the value changes. */
  onChange?: (value: number) => void
  /** The minimum value. */
  minValue?: number
  /** The maximum value. */
  maxValue?: number
  /** The step value for increment/decrement. */
  step?: number
  /** The locale for number formatting. */
  locale?: string
  /** Number format options. */
  formatOptions?: Intl.NumberFormatOptions
  /** Whether to hide the stepper buttons. */
  hideStepper?: boolean
}

// ============================================
// STYLES
// ============================================

const sizeStyles = {
  sm: {
    input: 'h-8 px-2 text-sm',
    label: 'text-sm',
    description: 'text-xs',
    button: 'w-6 h-6 text-sm',
    buttonGap: 'gap-0.5',
  },
  md: {
    input: 'h-10 px-3 text-base',
    label: 'text-sm',
    description: 'text-sm',
    button: 'w-8 h-8 text-base',
    buttonGap: 'gap-1',
  },
  lg: {
    input: 'h-12 px-4 text-lg',
    label: 'text-base',
    description: 'text-sm',
    button: 'w-10 h-10 text-lg',
    buttonGap: 'gap-1',
  },
}

// ============================================
// ICONS
// ============================================

function PlusIcon(props: { class?: string }) {
  return (
    <svg
      class={props.class}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path d="M8 3v10M3 8h10" />
    </svg>
  )
}

function MinusIcon(props: { class?: string }) {
  return (
    <svg
      class={props.class}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path d="M3 8h10" />
    </svg>
  )
}

// ============================================
// COMPONENT
// ============================================

/**
 * A number field allows users to enter a numeric value with increment/decrement controls.
 *
 * Built directly on solidaria hooks for full accessibility support.
 */
export function NumberField(props: NumberFieldProps): JSX.Element {
  const defaultProps: Partial<NumberFieldProps> = {
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
    'hideStepper',
  ], [
    'value',
    'defaultValue',
    'onChange',
    'minValue',
    'maxValue',
    'step',
    'locale',
    'formatOptions',
  ])

  const size = () => sizeStyles[local.size!]

  // Ref for input element
  let inputRef: HTMLInputElement | undefined

  // Create number field state
  const state = createNumberFieldState({
    get value() {
      return stateProps.value
    },
    get defaultValue() {
      return stateProps.defaultValue
    },
    get onChange() {
      return stateProps.onChange
    },
    get minValue() {
      return stateProps.minValue
    },
    get maxValue() {
      return stateProps.maxValue
    },
    get step() {
      return stateProps.step
    },
    get locale() {
      return stateProps.locale
    },
    get formatOptions() {
      return stateProps.formatOptions
    },
    get isDisabled() {
      return ariaProps.isDisabled
    },
    get isReadOnly() {
      return ariaProps.isReadOnly
    },
  })

  // Create number field aria props
  const numberFieldAria = createNumberField(
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
      get id() {
        return ariaProps.id
      },
      get autoFocus() {
        return ariaProps.autoFocus
      },
      get name() {
        return ariaProps.name
      },
    },
    state,
    () => inputRef ?? null
  )

  // Create focus ring for input
  const { isFocused, isFocusVisible, focusProps } = createFocusRing()

  // Increment button interactions
  const { isPressed: incrementPressed, pressProps: incrementPressProps } = createPress({
    get isDisabled() {
      return ariaProps.isDisabled || !state.canIncrement()
    },
    onPress: () => {
      state.increment()
      inputRef?.focus()
    },
  })

  const { isHovered: incrementHovered, hoverProps: incrementHoverProps } = createHover({
    get isDisabled() {
      return ariaProps.isDisabled || !state.canIncrement()
    },
  })

  // Decrement button interactions
  const { isPressed: decrementPressed, pressProps: decrementPressProps } = createPress({
    get isDisabled() {
      return ariaProps.isDisabled || !state.canDecrement()
    },
    onPress: () => {
      state.decrement()
      inputRef?.focus()
    },
  })

  const { isHovered: decrementHovered, hoverProps: decrementHoverProps } = createHover({
    get isDisabled() {
      return ariaProps.isDisabled || !state.canDecrement()
    },
  })

  // Compute classes
  const containerClasses = () => {
    const base = 'flex flex-col'
    const disabledClass = ariaProps.isDisabled ? 'opacity-60' : ''
    const custom = local.class || ''
    return [base, disabledClass, custom].filter(Boolean).join(' ')
  }

  const groupClasses = () => {
    const base = 'flex items-center'
    const gapClass = size().buttonGap
    return [base, gapClass].filter(Boolean).join(' ')
  }

  const inputClasses = () => {
    const base = 'flex-1 rounded-md transition-all duration-200 outline-none text-center'
    const sizeClass = size().input

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

    return [base, sizeClass, variantClass, stateClass, hoverClass].filter(Boolean).join(' ')
  }

  const buttonClasses = (isIncrement: boolean) => {
    const base = 'flex items-center justify-center rounded-md transition-all duration-150 select-none'
    const sizeClass = size().button

    const isDisabled = ariaProps.isDisabled || (isIncrement ? !state.canIncrement() : !state.canDecrement())
    const isPressed = isIncrement ? incrementPressed() : decrementPressed()
    const isHovered = isIncrement ? incrementHovered() : decrementHovered()

    let stateClass: string
    if (isDisabled) {
      stateClass = 'bg-bg-300 text-primary-600 cursor-not-allowed'
    } else if (isPressed) {
      stateClass = 'bg-accent-600 text-white scale-95'
    } else if (isHovered) {
      stateClass = 'bg-accent-500 text-white'
    } else {
      stateClass = 'bg-bg-300 text-primary-200 hover:bg-accent-500 hover:text-white'
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
    const { ref: _ref, ...rest } = numberFieldAria.inputProps as Record<string, unknown>
    return rest
  }

  const cleanFocusProps = () => {
    const { ref: _ref, ...rest } = focusProps as Record<string, unknown>
    return rest
  }

  const cleanGroupProps = () => {
    const { ref: _ref, ...rest } = numberFieldAria.groupProps as Record<string, unknown>
    return rest
  }

  const cleanDecrementProps = () => {
    const { ref: _ref, ...rest } = numberFieldAria.decrementButtonProps as Record<string, unknown>
    return rest
  }

  const cleanIncrementProps = () => {
    const { ref: _ref, ...rest } = numberFieldAria.incrementButtonProps as Record<string, unknown>
    return rest
  }

  const cleanDecrementPressProps = () => {
    const { ref: _ref, ...rest } = decrementPressProps as Record<string, unknown>
    return rest
  }

  const cleanDecrementHoverProps = () => {
    const { ref: _ref, ...rest } = decrementHoverProps as Record<string, unknown>
    return rest
  }

  const cleanIncrementPressProps = () => {
    const { ref: _ref, ...rest } = incrementPressProps as Record<string, unknown>
    return rest
  }

  const cleanIncrementHoverProps = () => {
    const { ref: _ref, ...rest } = incrementHoverProps as Record<string, unknown>
    return rest
  }

  return (
    <div
      {...cleanGroupProps()}
      class={containerClasses()}
      data-disabled={ariaProps.isDisabled || undefined}
      data-invalid={ariaProps.isInvalid || undefined}
    >
      {/* Label */}
      <Show when={local.label}>
        <span {...numberFieldAria.labelProps} class={labelClasses()}>
          {local.label}
          <Show when={ariaProps.isRequired}>
            <span class="text-danger-500 ml-1">*</span>
          </Show>
        </span>
      </Show>

      {/* Input Group */}
      <div class={groupClasses()}>
        {/* Decrement Button */}
        <Show when={!local.hideStepper}>
          <button
            {...cleanDecrementProps()}
            {...cleanDecrementPressProps()}
            {...cleanDecrementHoverProps()}
            class={buttonClasses(false)}
            data-pressed={decrementPressed() || undefined}
            data-hovered={decrementHovered() || undefined}
            data-disabled={ariaProps.isDisabled || !state.canDecrement() || undefined}
          >
            <MinusIcon class="w-4 h-4" />
          </button>
        </Show>

        {/* Input */}
        <input
          ref={inputRef}
          {...cleanInputProps()}
          {...cleanFocusProps()}
          class={inputClasses()}
          data-focused={isFocused() || undefined}
          data-focus-visible={isFocusVisible() || undefined}
        />

        {/* Increment Button */}
        <Show when={!local.hideStepper}>
          <button
            {...cleanIncrementProps()}
            {...cleanIncrementPressProps()}
            {...cleanIncrementHoverProps()}
            class={buttonClasses(true)}
            data-pressed={incrementPressed() || undefined}
            data-hovered={incrementHovered() || undefined}
            data-disabled={ariaProps.isDisabled || !state.canIncrement() || undefined}
          >
            <PlusIcon class="w-4 h-4" />
          </button>
        </Show>
      </div>

      {/* Description */}
      <Show when={local.description && !ariaProps.isInvalid}>
        <span {...numberFieldAria.descriptionProps} class={descriptionClasses()}>
          {local.description}
        </span>
      </Show>

      {/* Error Message */}
      <Show when={ariaProps.isInvalid && local.errorMessage}>
        <span {...numberFieldAria.errorMessageProps} class={errorClasses()}>
          {local.errorMessage}
        </span>
      </Show>
    </div>
  )
}

// Re-export types
export type { NumberFieldState } from '@proyecto-viviana/solid-stately'
