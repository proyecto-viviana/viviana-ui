/**
 * TextArea component for proyecto-viviana-silapse
 *
 * Styled multiline text field with auto-resize support.
 * Built on top of solidaria-components TextField + TextArea.
 */

import { type JSX, splitProps, Show, useContext, createEffect, onMount } from 'solid-js'
import {
  TextField as HeadlessTextField,
  Label as HeadlessLabel,
  TextArea as HeadlessTextArea,
  TextFieldContext,
  type TextFieldProps as HeadlessTextFieldProps,
  type TextFieldRenderProps,
} from '@proyecto-viviana/solidaria-components'

// ============================================
// TYPES
// ============================================

export type TextAreaSize = 'sm' | 'md' | 'lg'
export type TextAreaVariant = 'outline' | 'filled'

export interface TextAreaProps extends Omit<HeadlessTextFieldProps, 'class' | 'style' | 'children'> {
  /** The size of the text area. */
  size?: TextAreaSize
  /** The visual variant of the text area. */
  variant?: TextAreaVariant
  /** Additional CSS class name. */
  class?: string
  /** Label text for the textarea. */
  label?: string
  /** Description text shown below the textarea. */
  description?: string
  /** Error message shown when invalid. */
  errorMessage?: string
}

// ============================================
// STYLES
// ============================================

const sizeStyles = {
  sm: {
    textarea: 'min-h-[60px] px-2 py-1.5 text-sm',
    label: 'text-sm',
    description: 'text-xs',
  },
  md: {
    textarea: 'min-h-[80px] px-3 py-2 text-base',
    label: 'text-sm',
    description: 'text-sm',
  },
  lg: {
    textarea: 'min-h-[100px] px-4 py-3 text-lg',
    label: 'text-base',
    description: 'text-sm',
  },
}

function TextAreaDescription(props: { class?: string; children?: JSX.Element }): JSX.Element | null {
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

function TextAreaError(props: { class?: string; children?: JSX.Element }): JSX.Element | null {
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

/**
 * TextAreas are multiline text inputs, useful for cases where users have
 * a sizable amount of text to enter.
 */
export function TextArea(props: TextAreaProps): JSX.Element {
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

  const textareaClasses = (renderProps: TextFieldRenderProps) => {
    const base = 'w-full rounded-md transition-all duration-200 outline-none resize-none overflow-hidden'
    const sizeClass = size().textarea

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

          <HeadlessTextArea class={textareaClasses(renderProps)} />

          <Show when={local.description && !renderProps.isInvalid}>
            <TextAreaDescription class={descriptionClasses()}>
              {local.description}
            </TextAreaDescription>
          </Show>

          <Show when={local.errorMessage && renderProps.isInvalid}>
            <TextAreaError class={errorClasses()}>
              {local.errorMessage}
            </TextAreaError>
          </Show>
        </>
      )}
    />
  )
}
