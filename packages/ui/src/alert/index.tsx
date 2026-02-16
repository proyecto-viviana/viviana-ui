import type { JSX } from 'solid-js'
import { Show } from 'solid-js'

export type AlertVariant = 'info' | 'success' | 'warning' | 'error'

export interface AlertProps {
  children: JSX.Element
  variant?: AlertVariant
  title?: string
  dismissible?: boolean
  onDismiss?: () => void
  class?: string
}

const variantStyles: Record<AlertVariant, string> = {
  info: 'bg-primary-700 text-primary-200 border border-primary-500',
  success: 'bg-success-600 text-success-100 border border-success-400',
  warning: 'bg-warning-600 text-warning-100 border border-warning-400',
  error: 'bg-danger-600 text-danger-100 border border-danger-400',
}

export function Alert(props: AlertProps) {
  const variant = () => props.variant ?? 'info'

  return (
    <div
      class={`flex items-center min-h-[50px] font-normal rounded-lg px-4 py-2 ${variantStyles[variant()]} ${props.class ?? ''}`}
      role="alert"
    >
      <div class="flex items-center gap-3 flex-1">
        <Show when={props.title}>
          <span class="font-semibold font-jost">{props.title}</span>
          <span class="opacity-50">|</span>
        </Show>
        <div class="flex-1">{props.children}</div>
        <Show when={props.dismissible}>
          <button
            type="button"
            class="hover:opacity-70 transition-opacity ml-2"
            onClick={props.onDismiss}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </Show>
      </div>
    </div>
  )
}
