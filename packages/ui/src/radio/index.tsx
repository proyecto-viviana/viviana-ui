/**
 * RadioGroup and Radio components for proyecto-viviana-ui
 *
 * Styled radio components built on top of solidaria-components.
 *
 * IMPORTANT: Due to SolidJS's JSX evaluation order, we cannot wrap the headless
 * components in a traditional way. Instead, we re-export them and provide
 * styling through the class prop functions.
 */

import { type JSX, Show, createContext, useContext, splitProps } from 'solid-js'
import {
  RadioGroup as HeadlessRadioGroup,
  Radio as HeadlessRadio,
  type RadioGroupProps as HeadlessRadioGroupProps,
  type RadioProps as HeadlessRadioProps,
  type RadioGroupRenderProps,
  type RadioRenderProps,
} from '@proyecto-viviana/solidaria-components'

// ============================================
// SIZE CONTEXT
// ============================================

export type RadioGroupOrientation = 'horizontal' | 'vertical'
export type RadioGroupSize = 'sm' | 'md' | 'lg'

const RadioSizeContext = createContext<RadioGroupSize>('md')

// ============================================
// TYPES
// ============================================

export interface RadioGroupProps extends Omit<HeadlessRadioGroupProps, 'class' | 'style'> {
  /** The size of the radio buttons. */
  size?: RadioGroupSize
  /** Additional CSS class name. */
  class?: string
  /** Label for the group. */
  label?: string
  /** Description for the group. */
  description?: string
  /** Error message when invalid. */
  errorMessage?: string
}

export interface RadioProps extends Omit<HeadlessRadioProps, 'class' | 'style'> {
  /** Additional CSS class name. */
  class?: string
}

// ============================================
// STYLES
// ============================================

const sizeStyles = {
  sm: {
    circle: 'h-4 w-4',
    dot: 'h-2 w-2',
    label: 'text-sm',
  },
  md: {
    circle: 'h-5 w-5',
    dot: 'h-2.5 w-2.5',
    label: 'text-base',
  },
  lg: {
    circle: 'h-6 w-6',
    dot: 'h-3 w-3',
    label: 'text-lg',
  },
}

// ============================================
// RADIO GROUP COMPONENT
// ============================================

/**
 * A radio group allows users to select a single option from a list of mutually exclusive options.
 *
 * Built on solidaria-components RadioGroup for full accessibility support.
 */
export function RadioGroup(props: RadioGroupProps): JSX.Element {
  // Split out our custom styling props from the rest
  const [local, headlessProps] = splitProps(props, [
    'size',
    'class',
    'label',
    'description',
    'errorMessage',
    'children',
  ])

  const size = local.size ?? 'md'
  const customClass = local.class ?? ''

  // Generate class based on render props
  const getClassName = (renderProps: RadioGroupRenderProps): string => {
    const base = 'flex gap-2'
    const orientationClass = renderProps.orientation === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col'
    const disabledClass = renderProps.isDisabled ? 'opacity-50' : ''
    return [base, orientationClass, disabledClass, customClass].filter(Boolean).join(' ')
  }

  // Create render children function
  const renderChildren = (renderProps: RadioGroupRenderProps) => (
    <>
      <Show when={local.label}>
        <span class="text-primary-200 font-medium mb-1">{local.label}</span>
      </Show>
      {typeof local.children === 'function' ? local.children(renderProps) : local.children}
      <Show when={local.description && !renderProps.isInvalid}>
        <span class="text-primary-400 text-sm">{local.description}</span>
      </Show>
      <Show when={local.errorMessage && renderProps.isInvalid}>
        <span class="text-danger-400 text-sm">{local.errorMessage}</span>
      </Show>
    </>
  )

  // Pass remaining props through to headless component
  // headlessProps maintains reactivity for controlled values like value/onChange
  return (
    <RadioSizeContext.Provider value={size}>
      <HeadlessRadioGroup
        {...headlessProps}
        class={getClassName}
        data-size={size}
        children={renderChildren as any}
      />
    </RadioSizeContext.Provider>
  )
}

// ============================================
// RADIO COMPONENT
// ============================================

/**
 * A radio button allows users to select a single option from a list.
 * Must be used within a RadioGroup.
 *
 * Built on solidaria-components Radio for full accessibility support.
 */
export function Radio(props: RadioProps): JSX.Element {
  const sizeFromContext = useContext(RadioSizeContext)
  const size = () => sizeStyles[sizeFromContext]
  const customClass = props.class ?? ''

  // Generate class based on render props
  const getClassName = (renderProps: RadioRenderProps): string => {
    const base = 'inline-flex items-center gap-2 cursor-pointer'
    const disabledClass = renderProps.isDisabled ? 'cursor-not-allowed opacity-50' : ''
    return [base, disabledClass, customClass].filter(Boolean).join(' ')
  }

  // Extract props to pass to headless
  const { class: _, children, ...headlessProps } = props

  return (
    <HeadlessRadio
      {...headlessProps}
      class={getClassName}
    >
      {(renderProps) => {
        const circleClasses = () => {
          const base = 'relative flex items-center justify-center rounded-full border-2 transition-all duration-200'
          const sizeClass = size().circle

          let colorClass: string
          if (renderProps.isDisabled) {
            colorClass = 'border-bg-300 bg-bg-200'
          } else if (renderProps.isSelected) {
            colorClass = 'border-accent bg-transparent'
          } else {
            colorClass = 'border-primary-600 bg-transparent hover:border-accent-300'
          }

          const focusClass = renderProps.isFocusVisible
            ? 'ring-2 ring-accent-300 ring-offset-2 ring-offset-bg-400'
            : ''
          const cursorClass = renderProps.isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'

          return [base, sizeClass, colorClass, focusClass, cursorClass].filter(Boolean).join(' ')
        }

        const dotClasses = () => {
          const base = 'rounded-full bg-accent transition-all duration-200'
          const sizeClass = size().dot
          const visibilityClass = renderProps.isSelected ? 'scale-100 opacity-100' : 'scale-0 opacity-0'

          return [base, sizeClass, visibilityClass].filter(Boolean).join(' ')
        }

        const labelClasses = () => {
          const base = 'text-primary-200'
          const sizeClass = size().label
          const disabledClass = renderProps.isDisabled ? 'opacity-50' : ''

          return [base, sizeClass, disabledClass].filter(Boolean).join(' ')
        }

        // Resolve children - could be a function or JSX element
        const resolvedChildren = typeof children === 'function' ? children(renderProps) : children

        return (
          <>
            <span class={circleClasses()}>
              <span class={dotClasses()} />
            </span>
            <Show when={resolvedChildren}>
              <span class={labelClasses()}>{resolvedChildren}</span>
            </Show>
          </>
        )
      }}
    </HeadlessRadio>
  )
}
