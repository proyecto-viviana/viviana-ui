import type { JSX } from 'solid-js'

export interface TooltipProps {
  /** The content to show in the tooltip */
  label: string
  /** The trigger element */
  children: JSX.Element
  /** Position of the tooltip */
  position?: 'top' | 'bottom'
  /** Additional CSS class */
  class?: string
}

/**
 * Tooltip component that shows a label on hover.
 * Uses CSS-only hover effect for performance.
 */
export function Tooltip(props: TooltipProps): JSX.Element {
  const position = () => props.position ?? 'bottom'

  return (
    <div class={`vui-tooltip ${props.class ?? ''}`}>
      <div class="vui-tooltip__trigger">
        {props.children}
      </div>
      <div class={`vui-tooltip__content vui-tooltip__content--${position()}`}>
        <span>{props.label}</span>
      </div>
    </div>
  )
}
