/**
 * ContextualHelpTrigger UI wrapper for proyecto-viviana-silapse
 *
 * A styled button that opens contextual help in a popover.
 * Accepts either `title`/`content` convenience props or raw children tuple.
 */

import { type JSX, splitProps } from 'solid-js'
import {
  ContextualHelpTrigger as HeadlessContextualHelpTrigger,
  type ContextualHelpTriggerProps as HeadlessContextualHelpTriggerProps,
} from '@proyecto-viviana/solidaria-components'

// ============================================
// TYPES
// ============================================

export interface ContextualHelpTriggerProps extends Omit<HeadlessContextualHelpTriggerProps, 'class' | 'children'> {
  /** Additional CSS class name. */
  class?: string
  /** Convenience: title rendered as the trigger button label. */
  title?: string
  /** Convenience: text content shown inside the popover. */
  content?: string
  /** Visual variant for the trigger icon. */
  variant?: 'help' | 'info'
  /** Raw children tuple [trigger, content] — overrides title/content props. */
  children?: [JSX.Element, JSX.Element]
}

// ============================================
// HELPERS
// ============================================

const helpIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" />
    <text x="8" y="12" text-anchor="middle" fill="currentColor" font-size="10" font-weight="bold">?</text>
  </svg>
)

const infoIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" />
    <text x="8" y="12" text-anchor="middle" fill="currentColor" font-size="10" font-weight="bold">i</text>
  </svg>
)

// ============================================
// COMPONENT
// ============================================

/**
 * A button that opens contextual help in a popover.
 *
 * @example
 * ```tsx
 * // Convenience API
 * <ContextualHelpTrigger title="What is this?" content="Help text here" />
 *
 * // Children API
 * <ContextualHelpTrigger>
 *   {[<span>Trigger</span>, <div>Content</div>]}
 * </ContextualHelpTrigger>
 * ```
 */
export function ContextualHelpTrigger(props: ContextualHelpTriggerProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class', 'title', 'content', 'variant', 'children', 'aria-label'])

  const children = (): [JSX.Element, JSX.Element] => {
    if (local.children) return local.children
    const icon = local.variant === 'info' ? infoIcon : helpIcon
    const trigger = (
      <span style={{ display: 'inline-flex', 'align-items': 'center', gap: '4px' }}>
        {icon}
        {local.title && <span>{local.title}</span>}
      </span>
    )
    const content = (
      <div>
        {local.title && <div style={{ 'font-weight': '600', 'margin-bottom': '4px' }}>{local.title}</div>}
        {local.content && <p style={{ margin: '0' }}>{local.content}</p>}
      </div>
    )
    return [trigger, content]
  }

  return (
    <HeadlessContextualHelpTrigger
      {...headlessProps}
      aria-label={local['aria-label'] ?? local.title ?? 'Contextual help'}
      class={[
        // Trigger styling
        '[&_.solidaria-ContextualHelpTrigger-trigger]:flex [&_.solidaria-ContextualHelpTrigger-trigger]:items-center',
        '[&_.solidaria-ContextualHelpTrigger-trigger]:py-2 [&_.solidaria-ContextualHelpTrigger-trigger]:px-4',
        '[&_.solidaria-ContextualHelpTrigger-trigger]:cursor-pointer',
        '[&_.solidaria-ContextualHelpTrigger-trigger]:bg-transparent [&_.solidaria-ContextualHelpTrigger-trigger]:border-0',
        '[&_.solidaria-ContextualHelpTrigger-trigger]:text-primary-200',
        '[&_.solidaria-ContextualHelpTrigger-trigger]:outline-none',
        '[&_.solidaria-ContextualHelpTrigger-trigger]:hover:bg-bg-300',
        '[&_.solidaria-ContextualHelpTrigger-trigger]:focus-visible:ring-2',
        '[&_.solidaria-ContextualHelpTrigger-trigger]:focus-visible:ring-inset',
        '[&_.solidaria-ContextualHelpTrigger-trigger]:focus-visible:ring-accent-300',
        // Unavailable state
        '[&_.solidaria-ContextualHelpTrigger-trigger[data-unavailable]]:text-primary-500',
        // Disabled state
        '[&_.solidaria-ContextualHelpTrigger-trigger[data-disabled]]:opacity-50',
        '[&_.solidaria-ContextualHelpTrigger-trigger[data-disabled]]:cursor-not-allowed',
        // Content popover styling
        '[&_.solidaria-ContextualHelpTrigger-content]:bg-bg-400',
        '[&_.solidaria-ContextualHelpTrigger-content]:border [&_.solidaria-ContextualHelpTrigger-content]:border-primary-600',
        '[&_.solidaria-ContextualHelpTrigger-content]:rounded-lg [&_.solidaria-ContextualHelpTrigger-content]:shadow-lg',
        '[&_.solidaria-ContextualHelpTrigger-content]:p-4 [&_.solidaria-ContextualHelpTrigger-content]:min-w-[200px]',
        '[&_.solidaria-ContextualHelpTrigger-content]:outline-none',
        '[&_.solidaria-ContextualHelpTrigger-content]:mt-1',
        local.class ?? '',
      ].join(' ')}
    >
      {children()}
    </HeadlessContextualHelpTrigger>
  )
}
