/**
 * Switch components for proyecto-viviana-ui
 *
 * This file exports:
 * - ToggleSwitch: The primary switch component built on solidaria-components
 *                 (named to avoid conflict with SolidJS's built-in Switch)
 * - TabSwitch: A custom two-option tab selector
 */

import { type JSX, createSignal, createEffect } from 'solid-js'

// Re-export ToggleSwitch (the solidaria-components based switch)
export { ToggleSwitch, type ToggleSwitchProps, type SwitchSize } from './ToggleSwitch'

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

/**
 * A tab-style switch that allows users to select between two options.
 * This is a custom component, not based on solidaria/react-aria.
 */
export function TabSwitch(props: TabSwitchProps): JSX.Element {
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
