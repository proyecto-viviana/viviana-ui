import type { Component, JSX } from 'solid-js'

export interface IconProps {
  /** The icon component to render (should accept size and color props) */
  icon: Component<{ size?: string | number; color?: string }>
  /** Size of the icon (e.g., '24px' or 24) */
  size?: string | number
  /** Color of the icon */
  color?: string
  /** Whether to show the accent shadow effect (4px offset to bottom) */
  withShadow?: boolean
  /** Additional CSS class */
  class?: string
  /** Click handler */
  onClick?: () => void
  /** Accessible label for interactive icons. */
  'aria-label'?: string
  /** ID of an element that labels this icon. */
  'aria-labelledby'?: string
}

/**
 * Icon wrapper component with optional accent shadow effect.
 *
 * The shadow effect creates a 4px offset accent-colored duplicate
 * of the icon behind it for a stylized look.
 */
export function Icon(props: IconProps): JSX.Element {
  const size = () => props.size ?? 24
  const color = () => props.color ?? 'var(--color-primary-500)'
  const IconComponent = props.icon
  const className = () =>
    `vui-icon ${props.withShadow ? 'vui-icon--with-shadow' : ''} ${props.class ?? ''}`

  const iconContent = () => (
    <>
      {props.withShadow && (
        <div class="vui-icon__shadow" aria-hidden="true">
          <IconComponent size={size()} color="var(--color-accent)" />
        </div>
      )}
      <div class="vui-icon__main">
        <IconComponent size={size()} color={color()} />
      </div>
    </>
  )

  if (props.onClick) {
    return (
      <button
        type="button"
        class={`${className()} vui-icon--button`}
        onClick={props.onClick}
        aria-label={props['aria-label']}
        aria-labelledby={props['aria-labelledby']}
      >
        {iconContent()}
      </button>
    )
  }

  return <span class={className()}>{iconContent()}</span>
}

// Re-export common icons
export { GitHubIcon } from './icons/GitHubIcon'
export type { GitHubIconProps } from './icons/GitHubIcon'
