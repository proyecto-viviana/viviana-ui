import { type JSX, createSignal, createEffect, splitProps, mergeProps as solidMergeProps, createMemo } from 'solid-js'
import { createSwitch, createToggleState, type AriaSwitchProps } from '@proyecto-viviana/solidaria'
import { type SwitchSize } from './Switch'

// Re-export the new solidaria-components based Switch
export { Switch, type SwitchProps, type SwitchSize } from './Switch'

// ============================================
// TAB SWITCH (Two-option selector)
// ============================================

interface SwitchOption {
  label: string
  value: string
}

export interface TabSwitchProps {
  options: SwitchOption[]
  value?: string
  onChange?: (value: string) => void
  class?: string
}

export function TabSwitch(props: TabSwitchProps) {
  const [leftSelected, setLeftSelected] = createSignal(
    props.value ? props.value === props.options[0]?.value : true
  )

  createEffect(() => {
    if (props.value !== undefined) {
      setLeftSelected(props.value === props.options[0]?.value)
    }
  })

  const toggle = () => {
    const newLeftSelected = !leftSelected()
    setLeftSelected(newLeftSelected)
    const newValue = newLeftSelected ? props.options[0]?.value : props.options[1]?.value
    if (newValue) {
      props.onChange?.(newValue)
    }
  }

  const leftSelectedStyle = 'left-0 w-[142px] border-l-2'
  const rightSelectedStyle = 'left-[142px] w-[108px] border-r-2'
  const textSelected = 'font-extrabold text-primary-300'
  const textUnselected = 'font-medium text-primary-600 tracking-wider'

  return (
    <div
      onClick={toggle}
      class={`relative bg-bg-400 rounded-full w-[250px] cursor-pointer ${props.class ?? ''}`}
    >
      <div
        class={`${
          leftSelected() ? leftSelectedStyle : rightSelectedStyle
        } transition-all duration-500 ease-in-out z-0 absolute bg-primary-600 rounded-full h-8 border-accent-300`}
      />
      <div class="flex z-10 h-8 justify-around">
        <button
          type="button"
          class={`${
            leftSelected() ? textSelected : textUnselected
          } transition-all ease-in-out duration-500 z-10 text-lg flex justify-center items-center pointer-events-none`}
        >
          <span>{props.options[0]?.label ?? 'TENDENCIAS'}</span>
        </button>
        <button
          type="button"
          class={`${
            leftSelected() ? textUnselected : textSelected
          } transition-all ease-in-out duration-500 z-10 text-lg flex justify-center items-center pointer-events-none`}
        >
          <span>{props.options[1]?.label ?? 'ÚLTIMOS'}</span>
        </button>
      </div>
    </div>
  )
}

// ============================================
// TOGGLE SWITCH (On/Off switch with aria support)
// ============================================

export interface ToggleSwitchProps extends Omit<AriaSwitchProps, 'isSelected' | 'defaultSelected' | 'onChange'> {
  /** Whether the switch is checked (controlled). */
  checked?: boolean
  /** Whether the switch is checked by default (uncontrolled). */
  defaultChecked?: boolean
  /** Handler called when the switch state changes. */
  onChange?: (checked: boolean) => void
  /** The size of the switch. */
  size?: SwitchSize
  /** Additional CSS class name. */
  class?: string
  /** Label text for the switch. */
  children?: JSX.Element
}

const sizeStyles = {
  sm: {
    track: 'h-5 w-9',
    thumb: 'h-4 w-4 top-0.5 left-0.5',
    translate: 'translate-x-4',
  },
  md: {
    track: 'h-6 w-11',
    thumb: 'h-5 w-5 top-0.5 left-0.5',
    translate: 'translate-x-5',
  },
  lg: {
    track: 'h-7 w-14',
    thumb: 'h-6 w-6 top-0.5 left-0.5',
    translate: 'translate-x-7',
  },
}

/**
 * A switch allows users to toggle between two mutually exclusive states.
 * Uses createSwitch from solidaria for full accessibility support.
 */
export function ToggleSwitch(props: ToggleSwitchProps): JSX.Element {
  let inputRef: HTMLInputElement | null = null

  const defaultProps: Partial<ToggleSwitchProps> = {
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
  ])

  // Create toggle state
  const state = createToggleState(() => ({
    isSelected: local.checked,
    defaultSelected: local.defaultChecked,
    onChange: local.onChange,
  }))

  // Create switch aria props
  const switchAria = createSwitch(
    () => ({
      ...ariaProps,
      children: local.children,
    }),
    state,
    () => inputRef
  )

  const size = () => sizeStyles[local.size as SwitchSize]

  const trackClasses = createMemo(() => {
    const base = 'relative rounded-full transition-colors duration-200 cursor-pointer focus-within:ring-2 focus-within:ring-accent-300 focus-within:ring-offset-2 focus-within:ring-offset-bg-400'
    const sizeClass = size().track
    const colorClass = state.isSelected() ? 'bg-accent' : 'bg-bg-300'
    const disabledClass = ariaProps.isDisabled ? 'opacity-50 cursor-not-allowed' : ''
    const custom = local.class || ''

    return [base, sizeClass, colorClass, disabledClass, custom].filter(Boolean).join(' ')
  })

  const thumbClasses = createMemo(() => {
    const base = 'absolute rounded-full bg-white shadow transition-transform duration-200'
    const sizeClass = size().thumb
    const translateClass = state.isSelected() ? size().translate : 'translate-x-0'

    return [base, sizeClass, translateClass].filter(Boolean).join(' ')
  })

  return (
    <label {...switchAria.labelProps} class="inline-flex items-center gap-2 cursor-pointer">
      <span class={trackClasses()}>
        <input
          ref={(el) => (inputRef = el)}
          {...switchAria.inputProps}
          class="sr-only"
        />
        <span class={thumbClasses()} />
      </span>
      {local.children && <span class="text-primary-200">{local.children}</span>}
    </label>
  )
}
