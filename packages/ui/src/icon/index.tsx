import type { Component } from 'solid-js'

export type IconVariant = 'full' | 'outline' | 'borderless'

export interface IconProps {
  icon: Component<{ size?: string | number; color?: string }>
  variant?: IconVariant
  size?: string
  primaryColor?: string
  secondaryColor?: string
  onClick?: () => void
  class?: string
}

const variantStyles: Record<IconVariant, string> = {
  full: 'bg-bg-400 border-2 border-primary-700',
  outline: 'border-2 border-primary-700',
  borderless: '',
}

export function Icon(props: IconProps) {
  const variant = () => props.variant ?? 'borderless'
  const size = () => props.size ?? '24px'
  const primaryColor = () => props.primaryColor ?? '#75ABC7'
  const secondaryColor = () => props.secondaryColor ?? '#DF5C9A'

  const IconComponent = props.icon

  return (
    <div
      class={`flex h-[50px] w-[50px] items-center justify-center rounded-full ${variantStyles[variant()]} ${props.class ?? ''}`}
      onClick={props.onClick}
    >
      <div class="relative flex items-center justify-center">
        <div class="absolute z-10 mt-[-1px]">
          <IconComponent size={size()} color={primaryColor()} />
        </div>
        <div class="absolute z-0 mt-[3px]">
          <IconComponent size={size()} color={secondaryColor()} />
        </div>
      </div>
    </div>
  )
}
