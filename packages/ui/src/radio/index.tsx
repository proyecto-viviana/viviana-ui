import { type JSX, splitProps, mergeProps as solidMergeProps, createMemo, Show, createContext, useContext, type ParentProps } from 'solid-js'
import {
  createRadio,
  createRadioGroup,
  createRadioGroupState,
  type AriaRadioProps,
  type AriaRadioGroupProps,
  type RadioGroupState,
} from 'solidaria'

// ============================================
// CONTEXT
// ============================================

const RadioGroupContext = createContext<RadioGroupState | null>(null)

function useRadioGroupContext(): RadioGroupState {
  const context = useContext(RadioGroupContext)
  if (!context) {
    throw new Error('Radio must be used within a RadioGroup')
  }
  return context
}

// ============================================
// RADIO GROUP COMPONENT
// ============================================

export type RadioGroupOrientation = 'horizontal' | 'vertical'
export type RadioGroupSize = 'sm' | 'md' | 'lg'

export interface RadioGroupProps extends Omit<AriaRadioGroupProps, 'value' | 'defaultValue' | 'onChange'> {
  /** The current selected value (controlled). */
  value?: string | null
  /** The default selected value (uncontrolled). */
  defaultValue?: string
  /** Handler called when the selected value changes. */
  onChange?: (value: string) => void
  /** The size of the radio buttons. */
  size?: RadioGroupSize
  /** Additional CSS class name. */
  class?: string
  /** Radio buttons. */
  children?: JSX.Element
}

/**
 * A radio group allows users to select a single option from a list of mutually exclusive options.
 * Uses createRadioGroup from solidaria for full accessibility support.
 */
export function RadioGroup(props: RadioGroupProps): JSX.Element {
  const defaultProps: Partial<RadioGroupProps> = {
    size: 'md',
    orientation: 'vertical',
  }

  const merged = solidMergeProps(defaultProps, props)

  const [local, ariaProps] = splitProps(merged, [
    'value',
    'defaultValue',
    'onChange',
    'size',
    'class',
    'children',
  ])

  // Create radio group state
  const state = createRadioGroupState(() => ({
    value: local.value,
    defaultValue: local.defaultValue,
    onChange: local.onChange,
    isDisabled: ariaProps.isDisabled,
    isReadOnly: ariaProps.isReadOnly,
    isRequired: ariaProps.isRequired,
    isInvalid: ariaProps.isInvalid,
  }))

  // Create radio group aria props
  const radioGroupAria = createRadioGroup(() => ariaProps, state)

  const orientation = () => ariaProps.orientation ?? 'vertical'

  const groupClasses = createMemo(() => {
    const base = 'flex gap-2'
    const orientationClass = orientation() === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col'
    const custom = local.class || ''

    return [base, orientationClass, custom].filter(Boolean).join(' ')
  })

  return (
    <RadioGroupContext.Provider value={state}>
      <div {...radioGroupAria.radioGroupProps} class={groupClasses()} data-size={local.size}>
        <Show when={ariaProps.label}>
          <span {...radioGroupAria.labelProps} class="text-primary-200 font-medium mb-1">
            {ariaProps.label}
          </span>
        </Show>
        {local.children}
        <Show when={ariaProps.description && !radioGroupAria.isInvalid}>
          <span {...radioGroupAria.descriptionProps} class="text-primary-400 text-sm">
            {ariaProps.description}
          </span>
        </Show>
        <Show when={radioGroupAria.isInvalid && ariaProps.errorMessage}>
          <span {...radioGroupAria.errorMessageProps} class="text-danger-400 text-sm">
            {typeof ariaProps.errorMessage === 'function'
              ? ariaProps.errorMessage({ isInvalid: true, validationErrors: [] })
              : ariaProps.errorMessage}
          </span>
        </Show>
      </div>
    </RadioGroupContext.Provider>
  )
}

// ============================================
// RADIO COMPONENT
// ============================================

export interface RadioProps extends Omit<AriaRadioProps, 'children'> {
  /** Additional CSS class name. */
  class?: string
  /** Label text for the radio button. */
  children?: JSX.Element
}

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

/**
 * A radio button allows users to select a single option from a list.
 * Must be used within a RadioGroup.
 * Uses createRadio from solidaria for full accessibility support.
 */
export function Radio(props: ParentProps<RadioProps>): JSX.Element {
  let inputRef: HTMLInputElement | null = null

  const state = useRadioGroupContext()

  const [local, ariaProps] = splitProps(props, ['class', 'children'])

  // Create radio aria props
  const radioAria = createRadio(
    () => ({
      ...ariaProps,
      children: local.children,
    }),
    state,
    () => inputRef
  )

  // Get size from parent RadioGroup's data-size attribute
  const getSize = (): RadioGroupSize => {
    const groupElement = inputRef?.closest('[data-size]')
    return (groupElement?.getAttribute('data-size') as RadioGroupSize) || 'md'
  }

  const size = () => sizeStyles[getSize()]

  const circleClasses = createMemo(() => {
    const base = 'relative flex items-center justify-center rounded-full border-2 transition-all duration-200'
    const sizeClass = size().circle

    // Color based on state
    let colorClass: string
    if (radioAria.isDisabled) {
      colorClass = 'border-bg-300 bg-bg-200'
    } else if (radioAria.isSelected()) {
      colorClass = 'border-accent bg-transparent'
    } else {
      colorClass = 'border-primary-600 bg-transparent hover:border-accent-300'
    }

    const focusClass = 'focus-within:ring-2 focus-within:ring-accent-300 focus-within:ring-offset-2 focus-within:ring-offset-bg-400'
    const cursorClass = radioAria.isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'

    return [base, sizeClass, colorClass, focusClass, cursorClass].filter(Boolean).join(' ')
  })

  const dotClasses = createMemo(() => {
    const base = 'rounded-full bg-accent transition-all duration-200'
    const sizeClass = size().dot
    const visibilityClass = radioAria.isSelected() ? 'scale-100 opacity-100' : 'scale-0 opacity-0'

    return [base, sizeClass, visibilityClass].filter(Boolean).join(' ')
  })

  const labelClasses = createMemo(() => {
    const base = 'text-primary-200'
    const sizeClass = size().label
    const disabledClass = radioAria.isDisabled ? 'opacity-50' : ''

    return [base, sizeClass, disabledClass].filter(Boolean).join(' ')
  })

  return (
    <label
      {...radioAria.labelProps}
      class={`inline-flex items-center gap-2 cursor-pointer ${radioAria.isDisabled ? 'cursor-not-allowed' : ''} ${local.class || ''}`}
    >
      <span class={circleClasses()}>
        <input
          ref={(el) => (inputRef = el)}
          {...radioAria.inputProps}
          class="sr-only"
        />
        <span class={dotClasses()} />
      </span>
      <Show when={local.children}>
        <span class={labelClasses()}>{local.children}</span>
      </Show>
    </label>
  )
}
