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
  const options = () => props.options.slice(0, 2)
  const getInitialIndex = () => {
    if (!props.value) return 0
    const matchIndex = options().findIndex((option) => option.value === props.value)
    return matchIndex >= 0 ? matchIndex : 0
  }
  const [selectedIndex, setSelectedIndex] = createSignal(
    getInitialIndex()
  )
  const optionRefs: Array<HTMLButtonElement | undefined> = []

  createEffect(() => {
    if (props.value === undefined) return
    const nextIndex = options().findIndex((option) => option.value === props.value)
    if (nextIndex >= 0) {
      setSelectedIndex(nextIndex)
    }
  })

  const selectByIndex = (index: number) => {
    const boundedIndex = Math.min(Math.max(index, 0), options().length - 1)
    const value = options()[boundedIndex]?.value
    if (!value) return
    setSelectedIndex(boundedIndex)
    props.onChange?.(value)
  }

  const focusIndex = (index: number) => {
    optionRefs[index]?.focus()
  }

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp': {
        event.preventDefault()
        const next = index <= 0 ? options().length - 1 : index - 1
        selectByIndex(next)
        focusIndex(next)
        break
      }
      case 'ArrowRight':
      case 'ArrowDown': {
        event.preventDefault()
        const next = index >= options().length - 1 ? 0 : index + 1
        selectByIndex(next)
        focusIndex(next)
        break
      }
      case 'Home': {
        event.preventDefault()
        selectByIndex(0)
        focusIndex(0)
        break
      }
      case 'End': {
        event.preventDefault()
        const last = options().length - 1
        selectByIndex(last)
        focusIndex(last)
        break
      }
      default:
        break
    }
  }

  const textSelected = 'font-extrabold text-primary-300'
  const textUnselected = 'font-medium text-primary-600 tracking-wider'
  const optionCount = () => Math.max(options().length, 1)
  const indicatorStyle = () => ({
    width: `calc(100% / ${optionCount()})`,
    transform: `translateX(${selectedIndex() * 100}%)`,
  })
  const layoutStyle = () => ({
    'grid-template-columns': `repeat(${optionCount()}, minmax(0, 1fr))`,
  })

  return (
    <div class={`relative bg-bg-400 rounded-full w-[250px] ${props.class ?? ''}`}>
      <div
        class="left-0 transition-all duration-300 ease-in-out z-0 absolute bg-primary-600 rounded-full h-8 border-l-2 border-r-2 border-accent-300"
        style={indicatorStyle()}
      />
      <div class="relative z-10 grid h-8" style={layoutStyle()} role="radiogroup" aria-label="View mode">
        {options().map((option, index) => (
          <button
            ref={(el) => {
              optionRefs[index] = el
            }}
            type="button"
            role="radio"
            aria-checked={selectedIndex() === index}
            tabIndex={selectedIndex() === index ? 0 : -1}
            onClick={() => selectByIndex(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
            class={`transition-all ease-in-out duration-300 z-10 text-lg flex justify-center items-center rounded-full ${
              selectedIndex() === index ? textSelected : textUnselected
            }`}
          >
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
