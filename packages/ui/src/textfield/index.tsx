/**
 * TextField component for proyecto-viviana-ui
 *
 * A styled text field component built on top of solidaria-components.
 * This component only handles styling - all behavior and accessibility
 * is provided by the headless TextField from solidaria-components.
 */

import { type JSX, splitProps, mergeProps as solidMergeProps, Show } from 'solid-js'
import {
  TextField as HeadlessTextField,
  type TextFieldProps as HeadlessTextFieldProps,
  type TextFieldRenderProps,
} from '@proyecto-viviana/solidaria-components'

// ============================================
// TYPES
// ============================================

export type TextFieldSize = 'sm' | 'md' | 'lg'
export type TextFieldVariant = 'outline' | 'filled'

export interface TextFieldProps extends Omit<HeadlessTextFieldProps, 'class' | 'children' | 'style'> {
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
 * Built on solidaria-components TextField for full accessibility support.
 */
export function TextField(props: TextFieldProps): JSX.Element {
  const defaultProps: Partial<TextFieldProps> = {
    size: 'md',
    variant: 'outline',
  }

  const merged = solidMergeProps(defaultProps, props)

  const [local, headlessProps] = splitProps(merged, [
    'size',
    'variant',
    'class',
    'label',
    'description',
    'errorMessage',
  ])

  const size = () => sizeStyles[local.size!]

  // Generate class based on render props
  const getClassName = (renderProps: TextFieldRenderProps): string => {
    const base = ''
    const disabledClass = renderProps.isDisabled ? 'opacity-60' : ''
    const custom = local.class || ''
    return [base, disabledClass, custom].filter(Boolean).join(' ')
  }

  return (
    <HeadlessTextField
      {...headlessProps}
      class={getClassName}
    >
      {(renderProps) => {
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
          if (renderProps.isDisabled) {
            stateClass = 'bg-bg-200 text-primary-500 cursor-not-allowed opacity-60'
          } else if (renderProps.isInvalid) {
            stateClass = 'border-danger-500 focus:border-danger-400 focus:ring-2 focus:ring-danger-400/20'
          } else {
            stateClass = 'text-primary-100 placeholder:text-primary-500 focus:border-accent focus:ring-2 focus:ring-accent/20'
          }

          const hoverClass = renderProps.isDisabled ? '' : 'hover:border-accent-300'

          return [base, sizeClass, variantClass, stateClass, hoverClass].filter(Boolean).join(' ')
        }

        const labelClasses = () => {
          const base = 'block font-medium text-primary-200 mb-1'
          const sizeClass = size().label
          const disabledClass = renderProps.isDisabled ? 'opacity-60' : ''

          return [base, sizeClass, disabledClass].filter(Boolean).join(' ')
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

        return (
          <>
            <Show when={local.label}>
              <label class={labelClasses()}>
                {local.label}
                <Show when={renderProps.isRequired}>
                  <span class="text-danger-400 ml-0.5">*</span>
                </Show>
              </label>
            </Show>

            <input class={inputClasses()} />

            <Show when={local.description && !renderProps.isInvalid}>
              <p class={descriptionClasses()}>
                {local.description}
              </p>
            </Show>

            <Show when={local.errorMessage && renderProps.isInvalid}>
              <p class={errorClasses()}>
                {local.errorMessage}
              </p>
            </Show>
          </>
        )
      }}
    </HeadlessTextField>
  )
}
