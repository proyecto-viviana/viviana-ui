/**
 * TextField component for proyecto-viviana-ui
 *
 * A styled text field component built on solidaria hooks directly.
 * This bypasses solidaria-components for now due to context timing issues.
 */

import { type JSX, splitProps, mergeProps as solidMergeProps, Show } from 'solid-js'
import {
  createTextField,
  createFocusRing,
  type AriaTextFieldProps,
} from '@proyecto-viviana/solidaria'
import {
  createTextFieldState,
} from '@proyecto-viviana/solid-stately'

// ============================================
// TYPES
// ============================================

export type TextFieldSize = 'sm' | 'md' | 'lg'
export type TextFieldVariant = 'outline' | 'filled'

export interface TextFieldProps extends Omit<AriaTextFieldProps, 'children'> {
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

// ============================================
// STYLES
// ============================================

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

// ============================================
// COMPONENT
// ============================================

/**
 * A text field allows users to enter a plain text value with a keyboard.
 *
 * Built directly on solidaria hooks for full accessibility support.
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

  const size = () => sizeStyles[local.size!]

  // Create text field state
  const state = createTextFieldState(() => ({
    value: ariaProps.value,
    defaultValue: ariaProps.defaultValue,
    onChange: ariaProps.onChange,
  }))

  // Create text field aria props
  const textFieldAria = createTextField(() => ({
    ...ariaProps,
    value: state.value(),
    onChange: state.setValue,
  }))

  // Create focus ring
  const { isFocused, isFocusVisible, focusProps } = createFocusRing()

  // Compute classes
  const containerClasses = () => {
    const base = 'flex flex-col'
    const disabledClass = ariaProps.isDisabled ? 'opacity-60' : ''
    const custom = local.class || ''
    return [base, disabledClass, custom].filter(Boolean).join(' ')
  }

  const inputClasses = () => {
    const base = 'w-full rounded-md transition-all duration-200 outline-none'
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
    } else if (textFieldAria.isInvalid) {
      stateClass = 'border-danger-500 focus:border-danger-400 focus:ring-2 focus:ring-danger-400/20'
    } else {
      stateClass = 'text-primary-100 placeholder:text-primary-500 focus:border-accent focus:ring-2 focus:ring-accent/20'
    }

    const hoverClass = ariaProps.isDisabled ? '' : 'hover:border-accent-300'

    return [base, sizeClass, variantClass, stateClass, hoverClass].filter(Boolean).join(' ')
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
    const base = 'mt-1 text-danger-400'
    const sizeClass = size().description
    return [base, sizeClass].filter(Boolean).join(' ')
  }

  // Clean props - remove ref to avoid type conflicts
  const cleanLabelProps = () => {
    const { ref: _ref, ...rest } = textFieldAria.labelProps as Record<string, unknown>
    return rest
  }
  const cleanInputProps = () => {
    const { ref: _ref1, ...rest } = textFieldAria.inputProps as Record<string, unknown>
    const { ref: _ref2, ...focusRest } = focusProps as Record<string, unknown>
    return { ...rest, ...focusRest }
  }
  const cleanDescriptionProps = () => {
    const { ref: _ref, ...rest } = textFieldAria.descriptionProps as Record<string, unknown>
    return rest
  }
  const cleanErrorMessageProps = () => {
    const { ref: _ref, ...rest } = textFieldAria.errorMessageProps as Record<string, unknown>
    return rest
  }

  return (
    <div
      class={containerClasses()}
      data-disabled={ariaProps.isDisabled || undefined}
      data-invalid={textFieldAria.isInvalid || undefined}
      data-readonly={ariaProps.isReadOnly || undefined}
      data-required={ariaProps.isRequired || undefined}
      data-focused={isFocused() || undefined}
      data-focus-visible={isFocusVisible() || undefined}
    >
      <Show when={local.label}>
        <label {...cleanLabelProps()} class={labelClasses()}>
          {local.label}
          <Show when={ariaProps.isRequired}>
            <span class="text-danger-400 ml-0.5">*</span>
          </Show>
        </label>
      </Show>

      <input {...cleanInputProps()} class={inputClasses()} />

      <Show when={local.description && !textFieldAria.isInvalid}>
        <p {...cleanDescriptionProps()} class={descriptionClasses()}>
          {local.description}
        </p>
      </Show>

      <Show when={local.errorMessage && textFieldAria.isInvalid}>
        <p {...cleanErrorMessageProps()} class={errorClasses()}>
          {local.errorMessage}
        </p>
      </Show>
    </div>
  )
}
