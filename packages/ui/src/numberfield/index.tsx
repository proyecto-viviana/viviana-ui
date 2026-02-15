/**
 * NumberField component for proyecto-viviana-ui
 *
 * A styled number field component with increment/decrement buttons.
 * Built on top of solidaria-components.
 */

import { type JSX, splitProps, Show, useContext } from 'solid-js'
import {
  NumberField as HeadlessNumberField,
  NumberFieldLabel as HeadlessNumberFieldLabel,
  NumberFieldGroup as HeadlessNumberFieldGroup,
  NumberFieldInput as HeadlessNumberFieldInput,
  NumberFieldIncrementButton as HeadlessNumberFieldIncrementButton,
  NumberFieldDecrementButton as HeadlessNumberFieldDecrementButton,
  NumberFieldContext,
  type NumberFieldProps as HeadlessNumberFieldProps,
  type NumberFieldRenderProps,
  type NumberFieldInputRenderProps,
  type NumberFieldButtonRenderProps,
} from '@proyecto-viviana/solidaria-components'

// ============================================
// TYPES
// ============================================

export type NumberFieldSize = 'sm' | 'md' | 'lg'
export type NumberFieldVariant = 'outline' | 'filled'

export interface NumberFieldProps extends Omit<HeadlessNumberFieldProps, 'class' | 'style' | 'children' | 'label'> {
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

function NumberFieldDescription(props: { class?: string; children?: JSX.Element }): JSX.Element | null {
  const context = useContext(NumberFieldContext)
  if (!context) return null
  const descriptionProps = () => {
    const { ref: _ref, ...rest } = context.descriptionProps as Record<string, unknown>
    return rest
  }

  return (
    <span {...descriptionProps()} class={props.class}>
      {props.children}
    </span>
  )
}

function NumberFieldError(props: { class?: string; children?: JSX.Element }): JSX.Element | null {
  const context = useContext(NumberFieldContext)
  if (!context) return null
  const errorMessageProps = () => {
    const { ref: _ref, ...rest } = context.errorMessageProps as Record<string, unknown>
    return rest
  }

  return (
    <span {...errorMessageProps()} class={props.class}>
      {props.children}
    </span>
  )
}

// ============================================
// COMPONENT
// ============================================

/**
 * A number field allows users to enter a numeric value with increment/decrement controls.
 */
export function NumberField(props: NumberFieldProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, [
    'size',
    'variant',
    'class',
    'label',
    'description',
    'errorMessage',
    'hideStepper',
  ])

  const size = () => sizeStyles[local.size ?? 'md']

  const containerClasses = () => {
    const base = 'flex flex-col'
    const disabledClass = headlessProps.isDisabled ? 'opacity-60' : ''
    const custom = local.class || ''
    return [base, disabledClass, custom].filter(Boolean).join(' ')
  }

  const groupClasses = () => {
    const base = 'flex items-center'
    const gapClass = size().buttonGap
    return [base, gapClass].filter(Boolean).join(' ')
  }

  const inputClasses = (renderProps: NumberFieldInputRenderProps) => {
    const base = 'flex-1 rounded-md transition-all duration-200 outline-none text-center'
    const sizeClass = size().input

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

    return [base, sizeClass, variantClass, stateClass, hoverClass].filter(Boolean).join(' ')
  }

  const buttonClasses = (renderProps: NumberFieldButtonRenderProps) => {
    const base = 'flex items-center justify-center rounded-md transition-all duration-150 select-none'
    const sizeClass = size().button

    let stateClass = ''
    if (renderProps.isDisabled) {
      stateClass = 'bg-bg-300 text-primary-600 cursor-not-allowed'
    } else if (renderProps.isPressed) {
      stateClass = 'bg-accent-600 text-white scale-95'
    } else if (renderProps.isHovered) {
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

  return (
    <HeadlessNumberField
      {...headlessProps}
      label={local.label}
      description={local.description}
      errorMessage={local.errorMessage}
      class={containerClasses()}
      children={(renderProps: NumberFieldRenderProps) => (
        <>
          <Show when={local.label}>
            <HeadlessNumberFieldLabel class={labelClasses()}>
              {local.label}
              <Show when={renderProps.isRequired}>
                <span class="text-danger-500 ml-1">*</span>
              </Show>
            </HeadlessNumberFieldLabel>
          </Show>

          <HeadlessNumberFieldGroup class={groupClasses()}>
            <Show when={!local.hideStepper}>
              <HeadlessNumberFieldDecrementButton class={buttonClasses}>
                <MinusIcon class="w-4 h-4" />
              </HeadlessNumberFieldDecrementButton>
            </Show>

            <HeadlessNumberFieldInput class={inputClasses} />

            <Show when={!local.hideStepper}>
              <HeadlessNumberFieldIncrementButton class={buttonClasses}>
                <PlusIcon class="w-4 h-4" />
              </HeadlessNumberFieldIncrementButton>
            </Show>
          </HeadlessNumberFieldGroup>

          <Show when={local.description && !renderProps.isInvalid}>
            <NumberFieldDescription class={descriptionClasses()}>
              {local.description}
            </NumberFieldDescription>
          </Show>

          <Show when={local.errorMessage && renderProps.isInvalid}>
            <NumberFieldError class={errorClasses()}>
              {local.errorMessage}
            </NumberFieldError>
          </Show>
        </>
      )}
    />
  )
}

// Re-export types
export type { NumberFieldState } from '@proyecto-viviana/solid-stately'
