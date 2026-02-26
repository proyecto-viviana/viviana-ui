import type { JSX } from 'solid-js'
import { Show } from 'solid-js'

export type BadgeVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger'
export type BadgeSize = 'sm' | 'md' | 'lg'

export interface BadgeProps {
  children?: JSX.Element
  count?: number
  variant?: BadgeVariant
  size?: BadgeSize
  class?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-primary-500 text-white',
  secondary: 'bg-bg-300 text-primary-300',
  accent: 'bg-accent-300 text-black',
  success: 'bg-success-400 text-white',
  warning: 'bg-warning-400 text-black',
  danger: 'bg-danger-400 text-white',
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'w-5 h-5 text-xs',
  md: 'w-7 h-7 text-xs',
  lg: 'w-9 h-9 text-sm',
}

export function Badge(props: BadgeProps) {
  const variant = () => props.variant ?? 'accent'
  const size = () => props.size ?? 'md'

  return (
    <div
      class={`flex items-center justify-center rounded-full border-b border-white font-semibold ${variantStyles[variant()]} ${sizeStyles[size()]} ${props.class ?? ''}`}
    >
      <Show when={props.count !== undefined} fallback={props.children}>
        <span>{props.count}</span>
      </Show>
    </div>
  )
}
