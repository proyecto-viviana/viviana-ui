/**
 * ContextualHelpTrigger headless component
 *
 * A menu item that opens contextual help in a popover or dialog.
 * Uses existing overlay infrastructure.
 */

import { type JSX, createSignal, splitProps, Show, onCleanup, onMount, createEffect } from 'solid-js'

// ============================================
// TYPES
// ============================================

export interface ContextualHelpTriggerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'class' | 'children'> {
  /** Whether the menu item is currently unavailable (shows different styling). */
  isUnavailable?: boolean
  /**
   * Two children: [trigger element, help content].
   * The trigger renders as a menu item, the content opens in a popover.
   */
  children?: [JSX.Element, JSX.Element]
  /** CSS class name. */
  class?: string
  /** Whether the trigger is disabled. */
  isDisabled?: boolean
}

export interface ContextualHelpTriggerRenderProps {
  isOpen: boolean
  isUnavailable: boolean
  isDisabled: boolean
}

// ============================================
// COMPONENT
// ============================================

/**
 * A trigger within a menu that opens contextual help content.
 *
 * @example
 * ```tsx
 * <ContextualHelpTrigger>
 *   {[
 *     <span>What is this?</span>,
 *     <div>Help content goes here...</div>
 *   ]}
 * </ContextualHelpTrigger>
 * ```
 */
export function ContextualHelpTrigger(props: ContextualHelpTriggerProps): JSX.Element {
  const [local, domProps] = splitProps(props, ['isUnavailable', 'children', 'class', 'isDisabled'])
  const [isOpen, setIsOpen] = createSignal(false)
  let triggerRef: HTMLDivElement | undefined
  let contentRef: HTMLDivElement | undefined

  const isUnavailable = () => local.isUnavailable ?? false
  const isDisabled = () => local.isDisabled ?? false

  const toggle = () => {
    if (!isDisabled()) {
      setIsOpen(!isOpen())
    }
  }

  const close = () => setIsOpen(false)

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle()
    } else if (e.key === 'Escape' && isOpen()) {
      e.preventDefault()
      e.stopPropagation()
      close()
      triggerRef?.focus()
    }
  }

  // Close on outside click
  const handleDocumentClick = (e: MouseEvent) => {
    if (
      isOpen() &&
      triggerRef &&
      contentRef &&
      !triggerRef.contains(e.target as Node) &&
      !contentRef.contains(e.target as Node)
    ) {
      close()
    }
  }

  onMount(() => {
    document.addEventListener('mousedown', handleDocumentClick)
  })

  onCleanup(() => {
    document.removeEventListener('mousedown', handleDocumentClick)
  })

  // Focus trap: return focus to trigger on close
  createEffect(() => {
    if (!isOpen()) return
    // Focus the content on open
    contentRef?.focus()
  })

  const children = () => local.children ?? [null, null] as [JSX.Element, JSX.Element]
  const trigger = () => children()[0]
  const content = () => children()[1]

  return (
    <div
      {...domProps}
      class={`solidaria-ContextualHelpTrigger ${local.class ?? ''}`}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <div
        ref={triggerRef}
        role="menuitem"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={isOpen()}
        aria-disabled={isDisabled() || undefined}
        data-unavailable={isUnavailable() || undefined}
        data-disabled={isDisabled() || undefined}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        class="solidaria-ContextualHelpTrigger-trigger"
      >
        {trigger()}
      </div>

      <Show when={isOpen()}>
        <div
          ref={contentRef}
          role="dialog"
          tabIndex={-1}
          class="solidaria-ContextualHelpTrigger-content"
          style={{ position: 'absolute', 'z-index': '50' }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault()
              e.stopPropagation()
              close()
              triggerRef?.focus()
            }
          }}
        >
          {content()}
        </div>
      </Show>
    </div>
  )
}
