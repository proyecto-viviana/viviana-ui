import { type JSX, splitProps, mergeProps as solidMergeProps, createMemo, Show } from 'solid-js'
import { createCheckbox, createToggleState, type AriaCheckboxProps } from 'solidaria'

// ============================================
// CHECKBOX COMPONENT
// ============================================

export type CheckboxSize = 'sm' | 'md' | 'lg'

export interface CheckboxProps extends Omit<AriaCheckboxProps, 'isSelected' | 'defaultSelected' | 'onChange'> {
  /** Whether the checkbox is checked (controlled). */
  checked?: boolean
  /** Whether the checkbox is checked by default (uncontrolled). */
  defaultChecked?: boolean
  /** Handler called when the checkbox state changes. */
  onChange?: (checked: boolean) => void
  /** The size of the checkbox. */
  size?: CheckboxSize
  /** Additional CSS class name. */
  class?: string
  /** Label text for the checkbox. */
  children?: JSX.Element
  /** Whether to show the indeterminate state. */
  isIndeterminate?: boolean
}

const sizeStyles = {
  sm: {
    box: 'h-4 w-4',
    icon: 'h-3 w-3',
    label: 'text-sm',
  },
  md: {
    box: 'h-5 w-5',
    icon: 'h-3.5 w-3.5',
    label: 'text-base',
  },
  lg: {
    box: 'h-6 w-6',
    icon: 'h-4 w-4',
    label: 'text-lg',
  },
}

// Checkmark SVG icon
function CheckIcon(props: { class?: string }) {
  return (
    <svg
      class={props.class}
      viewBox="0 0 12 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 5L4.5 8.5L11 1"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}

// Indeterminate dash icon
function IndeterminateIcon(props: { class?: string }) {
  return (
    <svg
      class={props.class}
      viewBox="0 0 12 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 1H11"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  )
}

/**
 * A checkbox allows users to select one or more items from a set.
 * Uses createCheckbox from solidaria for full accessibility support.
 */
export function Checkbox(props: CheckboxProps): JSX.Element {
  let inputRef: HTMLInputElement | null = null

  const defaultProps: Partial<CheckboxProps> = {
    size: 'md',
  }

  const merged = solidMergeProps(defaultProps, props)

  const [local, ariaProps] = splitProps(merged, [
    'checked',
    'defaultChecked',
    'onChange',
    'size',
    'class',
    'children',
    'isIndeterminate',
  ])

  // Create toggle state
  const state = createToggleState(() => ({
    isSelected: local.checked,
    defaultSelected: local.defaultChecked,
    onChange: local.onChange,
  }))

  // Create checkbox aria props
  const checkboxAria = createCheckbox(
    () => ({
      ...ariaProps,
      isIndeterminate: local.isIndeterminate,
      children: local.children,
    }),
    state,
    () => inputRef
  )

  const size = () => sizeStyles[local.size!]

  const boxClasses = createMemo(() => {
    const base = 'relative flex items-center justify-center rounded border-2 transition-all duration-200'
    const sizeClass = size().box

    // Color based on state
    let colorClass: string
    if (ariaProps.isDisabled) {
      colorClass = 'border-bg-300 bg-bg-200'
    } else if (state.isSelected() || local.isIndeterminate) {
      colorClass = 'border-accent bg-accent'
    } else {
      colorClass = 'border-primary-600 bg-transparent hover:border-accent-300'
    }

    const focusClass = 'focus-within:ring-2 focus-within:ring-accent-300 focus-within:ring-offset-2 focus-within:ring-offset-bg-400'
    const cursorClass = ariaProps.isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'

    return [base, sizeClass, colorClass, focusClass, cursorClass].filter(Boolean).join(' ')
  })

  const iconClasses = createMemo(() => {
    const base = 'text-white transition-opacity duration-200'
    const sizeClass = size().icon
    const visibilityClass = (state.isSelected() || local.isIndeterminate) ? 'opacity-100' : 'opacity-0'

    return [base, sizeClass, visibilityClass].filter(Boolean).join(' ')
  })

  const labelClasses = createMemo(() => {
    const base = 'text-primary-200'
    const sizeClass = size().label
    const disabledClass = ariaProps.isDisabled ? 'opacity-50' : ''

    return [base, sizeClass, disabledClass].filter(Boolean).join(' ')
  })

  return (
    <label
      {...checkboxAria.labelProps}
      class={`inline-flex items-center gap-2 cursor-pointer ${ariaProps.isDisabled ? 'cursor-not-allowed' : ''} ${local.class || ''}`}
    >
      <span class={boxClasses()}>
        <input
          ref={(el) => (inputRef = el)}
          {...checkboxAria.inputProps}
          class="sr-only"
        />
        <Show
          when={!local.isIndeterminate}
          fallback={<IndeterminateIcon class={iconClasses()} />}
        >
          <CheckIcon class={iconClasses()} />
        </Show>
      </span>
      <Show when={local.children}>
        <span class={labelClasses()}>{local.children}</span>
      </Show>
    </label>
  )
}
