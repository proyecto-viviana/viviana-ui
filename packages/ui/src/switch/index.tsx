/**
 * Switch components for proyecto-viviana-ui
 *
 * This file exports:
 * - ToggleSwitch: The primary switch component built on solidaria-components
 *                 (named to avoid conflict with SolidJS's built-in Switch)
 * - TabSwitch: A styled two-option selector composed with headless toggle primitives
 */

import { type JSX, createMemo } from 'solid-js'
import type { Key } from '@proyecto-viviana/solid-stately'
import {
  ToggleButtonGroup as HeadlessToggleButtonGroup,
  ToggleButton as HeadlessToggleButton,
} from '@proyecto-viviana/solidaria-components'

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
 * Behavior is delegated to headless ToggleButtonGroup/ToggleButton primitives.
 */
export function TabSwitch(props: TabSwitchProps): JSX.Element {
  const options = createMemo(() => props.options.slice(0, 2))
  const selectedValue = createMemo(() => {
    const match = options().find((option) => option.value === props.value)
    return match?.value ?? options()[0]?.value
  })
  const selectedIndex = createMemo(() => {
    const index = options().findIndex((option) => option.value === selectedValue())
    return index >= 0 ? index : 0
  })
  const selectedKeys = createMemo<Set<Key>>(() => {
    const value = selectedValue()
    return value ? new Set<Key>([value]) : new Set<Key>()
  })

  const textSelected = 'font-extrabold text-primary-300'
  const textUnselected = 'font-medium text-primary-600 tracking-wider'
  const optionCount = createMemo(() => Math.max(options().length, 1))
  const indicatorStyle = createMemo(() => ({
    width: `calc(100% / ${optionCount()})`,
    transform: `translateX(${selectedIndex() * 100}%)`,
  }))
  const layoutStyle = createMemo(() => ({
    'grid-template-columns': `repeat(${optionCount()}, minmax(0, 1fr))`,
  }))

  const handleSelectionChange = (keys: Set<Key>) => {
    const [nextKey] = Array.from(keys)
    if (typeof nextKey === 'string') {
      props.onChange?.(nextKey)
    }
  }

  return (
    <div class={`relative bg-bg-400 rounded-full w-[250px] ${props.class ?? ''}`}>
      <div
        class="left-0 transition-all duration-300 ease-in-out z-0 absolute bg-primary-600 rounded-full h-8 border-l-2 border-r-2 border-accent-300"
        style={indicatorStyle()}
      />
      <HeadlessToggleButtonGroup
        selectionMode="single"
        selectedKeys={selectedKeys()}
        onSelectionChange={handleSelectionChange}
        class="relative z-10 grid h-8"
        style={layoutStyle()}
        aria-label="View mode"
      >
        {options().map((option) => (
          <HeadlessToggleButton
            toggleKey={option.value}
            class={({ isSelected }) =>
              `transition-all ease-in-out duration-300 z-10 text-lg flex justify-center items-center rounded-full ${
                isSelected ? textSelected : textUnselected
              }`
            }
          >
            <span>{option.label}</span>
          </HeadlessToggleButton>
        ))}
      </HeadlessToggleButtonGroup>
    </div>
  )
}
