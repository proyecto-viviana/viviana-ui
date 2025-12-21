import type { JSX } from 'solid-js'

export type ChipVariant = 'primary' | 'secondary' | 'accent' | 'outline'

export interface ChipProps {
  text: string
  variant?: ChipVariant
  onClick?: () => void
  icon?: JSX.Element
  class?: string
}

const variantStyles: Record<ChipVariant, string> = {
  primary: 'bg-primary-700 text-primary-200 shadow-primary-chip',
  secondary: 'bg-primary-600 text-primary-100 hover:bg-primary-500',
  accent: 'bg-accent text-white',
  outline: 'bg-transparent border border-primary-500 text-primary-300',
}

export function Chip(props: ChipProps) {
  const variant = () => props.variant ?? 'primary'

  return (
    <button
      class={`flex justify-center items-center h-6 w-auto rounded-full px-4 py-1 font-medium text-sm tracking-wide transition-colors ${variantStyles[variant()]} ${props.class ?? ''}`}
      onClick={props.onClick}
    >
      {props.icon && <span class="mr-1.5">{props.icon}</span>}
      <span>{props.text}</span>
    </button>
  )
}
