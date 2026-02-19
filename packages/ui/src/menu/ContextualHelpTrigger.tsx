/**
 * ContextualHelpTrigger UI wrapper for proyecto-viviana-ui
 *
 * A styled menu item that opens contextual help in a popover.
 */

import { type JSX, splitProps } from 'solid-js'
import {
  ContextualHelpTrigger as HeadlessContextualHelpTrigger,
  type ContextualHelpTriggerProps as HeadlessContextualHelpTriggerProps,
} from '@proyecto-viviana/solidaria-components'

// ============================================
// TYPES
// ============================================

export interface ContextualHelpTriggerProps extends Omit<HeadlessContextualHelpTriggerProps, 'class'> {
  /** Additional CSS class name. */
  class?: string
}

// ============================================
// COMPONENT
// ============================================

/**
 * A menu item that opens contextual help in a popover.
 */
export function ContextualHelpTrigger(props: ContextualHelpTriggerProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class'])

  return (
    <HeadlessContextualHelpTrigger
      {...headlessProps}
      class={[
        // Trigger styling
        '[&_.solidaria-ContextualHelpTrigger-trigger]:flex [&_.solidaria-ContextualHelpTrigger-trigger]:items-center',
        '[&_.solidaria-ContextualHelpTrigger-trigger]:py-2 [&_.solidaria-ContextualHelpTrigger-trigger]:px-4',
        '[&_.solidaria-ContextualHelpTrigger-trigger]:cursor-pointer',
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
    />
  )
}
