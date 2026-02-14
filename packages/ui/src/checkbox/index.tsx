/**
 * Checkbox component for proyecto-viviana-ui
 *
 * A styled checkbox component built on top of solidaria-components.
 * This component only handles styling - all behavior and accessibility
 * is provided by the headless Checkbox from solidaria-components.
 */

import { type JSX, splitProps, mergeProps as solidMergeProps, Show } from 'solid-js'
import {
  Checkbox as HeadlessCheckbox,
  CheckboxGroup as HeadlessCheckboxGroup,
  type CheckboxProps as HeadlessCheckboxProps,
  type CheckboxGroupProps as HeadlessCheckboxGroupProps,
  type CheckboxRenderProps,
  type CheckboxGroupRenderProps,
} from '@proyecto-viviana/solidaria-components'

// ============================================
// TYPES
// ============================================

export type CheckboxSize = 'sm' | 'md' | 'lg'

export interface CheckboxProps extends Omit<HeadlessCheckboxProps, 'class' | 'children' | 'style'> {
  /** The size of the checkbox. */
  size?: CheckboxSize
  /** Additional CSS class name. */
  class?: string
  /** Label text for the checkbox. */
  children?: JSX.Element
}

export interface CheckboxGroupProps extends Omit<HeadlessCheckboxGroupProps, 'class' | 'children' | 'style'> {
  /** Additional CSS class name. */
  class?: string
  /** Children checkboxes. */
  children?: JSX.Element
  /** Label for the group. */
  label?: string
  /** Description for the group. */
  description?: string
  /** Error message when invalid. */
  errorMessage?: string
}

// ============================================
// STYLES
// ============================================

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

// ============================================
// ICONS
// ============================================

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

// ============================================
// CHECKBOX COMPONENT
// ============================================

/**
 * A checkbox allows users to select one or more items from a set.
 *
 * Built on solidaria-components Checkbox for full accessibility support.
 */
export function Checkbox(props: CheckboxProps): JSX.Element {
  const defaultProps: Partial<CheckboxProps> = {
    size: 'md',
  }

  const merged = solidMergeProps(defaultProps, props)

  const [local, headlessProps] = splitProps(merged, [
    'size',
    'class',
    'children',
  ])

  const size = () => sizeStyles[local.size!]

  // Generate class based on render props
  const getClassName = (renderProps: CheckboxRenderProps): string => {
    const base = 'inline-flex items-center gap-2 cursor-pointer'
    const disabledClass = renderProps.isDisabled ? 'cursor-not-allowed opacity-50' : ''
    const custom = local.class || ''
    return [base, disabledClass, custom].filter(Boolean).join(' ')
  }

  return (
    <HeadlessCheckbox
      {...headlessProps}
      class={getClassName}
    >
      {(renderProps: CheckboxRenderProps) => {
        const boxClasses = () => {
          const base = 'relative flex items-center justify-center rounded border-2 transition-all duration-200'
          const sizeClass = size().box

          let colorClass: string
          if (renderProps.isDisabled) {
            colorClass = 'border-bg-300 bg-bg-200'
          } else if (renderProps.isSelected || renderProps.isIndeterminate) {
            colorClass = 'border-accent bg-accent'
          } else {
            colorClass = 'border-primary-600 bg-transparent hover:border-accent-300'
          }

          const focusClass = renderProps.isFocusVisible
            ? 'ring-2 ring-accent-300 ring-offset-2 ring-offset-bg-400'
            : ''
          const cursorClass = renderProps.isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'

          return [base, sizeClass, colorClass, focusClass, cursorClass].filter(Boolean).join(' ')
        }

        const iconClasses = () => {
          const base = 'text-white transition-opacity duration-200'
          const sizeClass = size().icon
          const visibilityClass = (renderProps.isSelected || renderProps.isIndeterminate)
            ? 'opacity-100'
            : 'opacity-0'

          return [base, sizeClass, visibilityClass].filter(Boolean).join(' ')
        }

        const labelClasses = () => {
          const base = 'text-primary-200'
          const sizeClass = size().label
          const disabledClass = renderProps.isDisabled ? 'opacity-50' : ''

          return [base, sizeClass, disabledClass].filter(Boolean).join(' ')
        }

        return (
          <>
            <span class={boxClasses()}>
              <Show
                when={!renderProps.isIndeterminate}
                fallback={<IndeterminateIcon class={iconClasses()} />}
              >
                <CheckIcon class={iconClasses()} />
              </Show>
            </span>
            <Show when={props.children}>
              <span class={labelClasses()}>{props.children}</span>
            </Show>
          </>
        )
      }}
    </HeadlessCheckbox>
  )
}

// ============================================
// CHECKBOX GROUP COMPONENT
// ============================================

/**
 * A checkbox group allows users to select multiple items from a list.
 *
 * Built on solidaria-components CheckboxGroup for full accessibility support.
 */
export function CheckboxGroup(props: CheckboxGroupProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, [
    'class',
    'label',
    'description',
    'errorMessage',
  ])

  // Generate class based on render props
  const getClassName = (renderProps: CheckboxGroupRenderProps): string => {
    const base = 'flex flex-col gap-2'
    const disabledClass = renderProps.isDisabled ? 'opacity-50' : ''
    const custom = local.class || ''
    return [base, disabledClass, custom].filter(Boolean).join(' ')
  }

  // Render children function for the headless component
  const renderChildren = (renderProps: CheckboxGroupRenderProps) => (
    <>
      <Show when={local.label}>
        <span class="text-sm font-medium text-primary-200">{local.label}</span>
      </Show>
      <div class="flex flex-col gap-2">
        {props.children}
      </div>
      <Show when={local.description && !renderProps.isInvalid}>
        <span class="text-sm text-primary-400">{local.description}</span>
      </Show>
      <Show when={local.errorMessage && renderProps.isInvalid}>
        <span class="text-sm text-danger-400">{local.errorMessage}</span>
      </Show>
    </>
  )
  return (
    <HeadlessCheckboxGroup
      {...headlessProps}
      class={getClassName}
      children={renderChildren}
    />
  )
}
