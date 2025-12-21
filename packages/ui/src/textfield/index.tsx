import { type JSX, splitProps, mergeProps as solidMergeProps, createMemo, Show } from 'solid-js'
import { createTextField, type AriaTextFieldProps } from '@proyecto-viviana/solidaria'
import { createTextFieldState } from '@proyecto-viviana/solid-stately'

// ============================================
// TEXTFIELD COMPONENT
// ============================================

export type TextFieldSize = 'sm' | 'md' | 'lg'
export type TextFieldVariant = 'outline' | 'filled'

export interface TextFieldProps extends Omit<AriaTextFieldProps, 'label' | 'description' | 'errorMessage'> {
  /** The size of the text field. */
  size?: TextFieldSize
  /** The visual variant of the text field. */
  variant?: TextFieldVariant
  /** Additional CSS class name. */
  class?: string
  /** Label text for the input. */
  label?: string
  /** Description text shown below the input. */
  description?: string
  /** Error message shown when invalid. */
  errorMessage?: string
}

const sizeStyles = {
  sm: {
    input: 'h-8 px-2 text-sm',
    label: 'text-sm',
    description: 'text-xs',
  },
  md: {
    input: 'h-10 px-3 text-base',
    label: 'text-sm',
    description: 'text-sm',
  },
  lg: {
    input: 'h-12 px-4 text-lg',
    label: 'text-base',
    description: 'text-sm',
  },
}

/**
 * A text field allows users to enter a plain text value with a keyboard.
 * Uses createTextField from solidaria for full accessibility support.
 */
export function TextField(props: TextFieldProps): JSX.Element {
  const defaultProps: Partial<TextFieldProps> = {
    size: 'md',
    variant: 'outline',
  }

  const merged = solidMergeProps(defaultProps, props)

  const [local, ariaProps] = splitProps(merged, [
    'size',
    'variant',
    'class',
    'label',
    'description',
    'errorMessage',
  ])

  // Create text field state
  const state = createTextFieldState(() => ({
    value: ariaProps.value,
    defaultValue: ariaProps.defaultValue,
    onChange: ariaProps.onChange,
  }))

  // Create text field aria props
  const textFieldAria = createTextField(() => ({
    ...ariaProps,
    label: local.label,
    description: local.description,
    errorMessage: local.errorMessage,
    value: state.value(),
    onChange: state.setValue,
  }))

  const size = () => sizeStyles[local.size!]

  const inputClasses = createMemo(() => {
    const base = 'w-full rounded-md transition-all duration-200 outline-none'
    const sizeClass = size().input

    // Variant styles
    let variantClass: string
    if (local.variant === 'filled') {
      variantClass = 'bg-bg-200 border border-transparent'
    } else {
      variantClass = 'bg-transparent border border-bg-400'
    }

    // State styles
    let stateClass: string
    if (ariaProps.isDisabled) {
      stateClass = 'bg-bg-200 text-primary-500 cursor-not-allowed opacity-60'
    } else if (textFieldAria.isInvalid) {
      stateClass = 'border-danger-500 focus:border-danger-400 focus:ring-2 focus:ring-danger-400/20'
    } else {
      stateClass = 'text-primary-100 placeholder:text-primary-500 focus:border-accent focus:ring-2 focus:ring-accent/20'
    }

    // Hover styles (only when not disabled)
    const hoverClass = ariaProps.isDisabled ? '' : 'hover:border-accent-300'

    return [base, sizeClass, variantClass, stateClass, hoverClass].filter(Boolean).join(' ')
  })

  const labelClasses = createMemo(() => {
    const base = 'block font-medium text-primary-200 mb-1'
    const sizeClass = size().label
    const disabledClass = ariaProps.isDisabled ? 'opacity-60' : ''

    return [base, sizeClass, disabledClass].filter(Boolean).join(' ')
  })

  const descriptionClasses = createMemo(() => {
    const base = 'mt-1 text-primary-400'
    const sizeClass = size().description

    return [base, sizeClass].filter(Boolean).join(' ')
  })

  const errorClasses = createMemo(() => {
    const base = 'mt-1 text-danger-400'
    const sizeClass = size().description

    return [base, sizeClass].filter(Boolean).join(' ')
  })

  return (
    <div class={`${local.class || ''}`}>
      <Show when={local.label}>
        <label {...textFieldAria.labelProps} class={labelClasses()}>
          {local.label}
          <Show when={ariaProps.isRequired}>
            <span class="text-danger-400 ml-0.5">*</span>
          </Show>
        </label>
      </Show>

      <input
        {...textFieldAria.inputProps}
        class={inputClasses()}
      />

      <Show when={local.description && !textFieldAria.isInvalid}>
        <p {...textFieldAria.descriptionProps} class={descriptionClasses()}>
          {local.description}
        </p>
      </Show>

      <Show when={local.errorMessage && textFieldAria.isInvalid}>
        <p {...textFieldAria.errorMessageProps} class={errorClasses()}>
          {local.errorMessage}
        </p>
      </Show>
    </div>
  )
}
