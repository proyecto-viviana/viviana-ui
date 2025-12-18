import { createSignal, createEffect } from 'solid-js'

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

export interface ToggleSwitchProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  class?: string
}

export function ToggleSwitch(props: ToggleSwitchProps) {
  const [checked, setChecked] = createSignal(props.checked ?? false)

  const handleToggle = () => {
    if (props.disabled) return
    const newValue = !checked()
    setChecked(newValue)
    props.onChange?.(newValue)
  }

  return (
    <button
      class={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
        checked() ? 'bg-accent' : 'bg-bg-300'
      } ${props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${props.class ?? ''}`}
      onClick={handleToggle}
      disabled={props.disabled}
      role="switch"
      aria-checked={checked()}
    >
      <span
        class={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
          checked() ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}
