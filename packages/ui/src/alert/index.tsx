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

const variantStyles: Record<AlertVariant, { bg: string; border: string; text: string; icon: string }> = {
  info: {
    bg: 'bg-primary-800/40',
    border: 'border-primary-500',
    text: 'text-primary-200',
    icon: 'ℹ️',
  },
  success: {
    bg: 'bg-success-600/30',
    border: 'border-success-400',
    text: 'text-success-100',
    icon: '✓',
  },
  warning: {
    bg: 'bg-warning-600/30',
    border: 'border-warning-400',
    text: 'text-warning-100',
    icon: '⚠',
  },
  error: {
    bg: 'bg-danger-600/30',
    border: 'border-danger-400',
    text: 'text-danger-100',
    icon: '✕',
  },
}

export function Alert(props: AlertProps) {
  const variant = () => props.variant ?? 'info'
  const styles = () => variantStyles[variant()]

  return (
    <div
      class={`rounded-lg border-l-4 p-4 ${styles().bg} ${styles().border} ${props.class ?? ''}`}
      role="alert"
    >
      <div class="flex items-start gap-3">
        <span class={`text-lg ${styles().text}`}>{styles().icon}</span>
        <div class="flex-1">
          <Show when={props.title}>
            <h4 class={`font-semibold mb-1 ${styles().text}`}>{props.title}</h4>
          </Show>
          <div class={styles().text}>{props.children}</div>
        </div>
        <Show when={props.dismissible}>
          <button
            class={`${styles().text} hover:opacity-70 transition-opacity`}
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
