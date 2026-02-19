/**
 * TextField component for proyecto-viviana-ui
 *
 * Styled text field built on top of solidaria-components.
 */

import { type JSX, splitProps, Show, useContext } from 'solid-js'
import {
  TextField as HeadlessTextField,
  Label as HeadlessLabel,
  Input as HeadlessInput,
  TextFieldContext,
  type TextFieldProps as HeadlessTextFieldProps,
  type TextFieldRenderProps,
} from '@proyecto-viviana/solidaria-components'

// ============================================
// TYPES
// ============================================

export type TextFieldSize = 'sm' | 'md' | 'lg'
export type TextFieldVariant = 'outline' | 'filled'

export interface TextFieldProps extends Omit<HeadlessTextFieldProps, 'class' | 'style' | 'children'> {
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

function TextFieldDescription(props: { class?: string; children?: JSX.Element }): JSX.Element | null {
  const context = useContext(TextFieldContext)
  if (!context) return null
  const descriptionProps = () => {
    const { ref: _ref, ...rest } = context.descriptionProps as Record<string, unknown>
    return rest
  }
  return (
    <p {...descriptionProps()} class={props.class}>
      {props.children}
    </p>
  )
}

function TextFieldError(props: { class?: string; children?: JSX.Element }): JSX.Element | null {
  const context = useContext(TextFieldContext)
  if (!context) return null
  const errorMessageProps = () => {
    const { ref: _ref, ...rest } = context.errorMessageProps as Record<string, unknown>
    return rest
  }
  return (
    <p {...errorMessageProps()} class={props.class}>
      {props.children}
    </p>
  )
}

// ============================================
// COMPONENT
// ============================================

export { TextArea } from './TextArea';
export type { TextAreaProps, TextAreaSize, TextAreaVariant } from './TextArea';

export function TextField(props: TextFieldProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, [
    'size',
    'variant',
    'class',
    'label',
    'description',
    'errorMessage',
  ])

  const size = () => sizeStyles[local.size ?? 'md']

  const containerClasses = () => {
    const base = 'flex flex-col'
    const custom = local.class ?? ''
    return [base, custom].filter(Boolean).join(' ')
  }

  const inputClasses = (renderProps: TextFieldRenderProps) => {
    const base = 'w-full rounded-md transition-all duration-200 outline-none'
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

  return (
    <HeadlessTextField
      {...headlessProps}
      label={local.label}
      description={local.description}
      errorMessage={local.errorMessage}
      class={containerClasses()}
      children={(renderProps) => (
        <>
          <Show when={local.label}>
            <HeadlessLabel class={labelClasses()}>
              {local.label}
              <Show when={renderProps.isRequired}>
                <span class="text-danger-400 ml-0.5">*</span>
              </Show>
            </HeadlessLabel>
          </Show>

          <HeadlessInput class={inputClasses(renderProps)} />

          <Show when={local.description && !renderProps.isInvalid}>
            <TextFieldDescription class={descriptionClasses()}>
              {local.description}
            </TextFieldDescription>
          </Show>

          <Show when={local.errorMessage && renderProps.isInvalid}>
            <TextFieldError class={errorClasses()}>
              {local.errorMessage}
            </TextFieldError>
          </Show>
        </>
      )}
    />
  )
}
