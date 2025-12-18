import { Show } from 'solid-js'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface AvatarProps {
  src?: string
  alt?: string
  size?: AvatarSize
  fallback?: string
  online?: boolean
  class?: string
}

const sizeStyles: Record<AvatarSize, { container: string; text: string; indicator: string }> = {
  xs: { container: 'w-6 h-6', text: 'text-xs', indicator: 'w-1.5 h-1.5' },
  sm: { container: 'w-8 h-8', text: 'text-sm', indicator: 'w-2 h-2' },
  md: { container: 'w-10 h-10', text: 'text-base', indicator: 'w-2.5 h-2.5' },
  lg: { container: 'w-14 h-14', text: 'text-lg', indicator: 'w-3 h-3' },
  xl: { container: 'w-20 h-20', text: 'text-xl', indicator: 'w-4 h-4' },
}

export function Avatar(props: AvatarProps) {
  const size = () => props.size ?? 'md'
  const styles = () => sizeStyles[size()]

  const initials = () => {
    if (props.fallback) return props.fallback.slice(0, 2).toUpperCase()
    if (props.alt) return props.alt.slice(0, 2).toUpperCase()
    return '?'
  }

  return (
    <div class={`relative inline-block ${props.class ?? ''}`}>
      <div
        class={`${styles().container} rounded-full overflow-hidden bg-bg-200 flex items-center justify-center ring-2 ring-accent/50`}
      >
        <Show
          when={props.src}
          fallback={
            <span class={`${styles().text} font-medium text-primary-300`}>
              {initials()}
            </span>
          }
        >
          <img
            src={props.src}
            alt={props.alt ?? 'Avatar'}
            class="w-full h-full object-cover"
          />
        </Show>
      </div>
      <Show when={props.online !== undefined}>
        <span
          class={`absolute bottom-0 right-0 ${styles().indicator} rounded-full ring-2 ring-bg-400 ${
            props.online ? 'bg-success-400' : 'bg-bg-light'
          }`}
        />
      </Show>
    </div>
  )
}

export interface AvatarGroupProps {
  children: any
  max?: number
  size?: AvatarSize
}

export function AvatarGroup(props: AvatarGroupProps) {
  return (
    <div class="flex -space-x-2">
      {props.children}
    </div>
  )
}
