/**
 * OpenTransition utility for proyecto-viviana-ui
 *
 * CSS transition component for overlay enter/exit animations.
 * SolidJS-idiomatic: uses createEffect + classList for class toggling.
 */

import { type JSX, createSignal, createEffect, on, onCleanup, Show, children as resolveChildren } from 'solid-js'

// ============================================
// TYPES
// ============================================

export interface OpenTransitionProps {
  /** Whether the content is open/visible. */
  open: boolean
  /** The content to apply transitions to. */
  children: JSX.Element
  /** CSS classes for the start of the enter transition. */
  enterFrom?: string
  /** CSS classes for the end of the enter transition. */
  enterTo?: string
  /** CSS classes for the start of the exit transition. */
  exitFrom?: string
  /** CSS classes for the end of the exit transition. */
  exitTo?: string
  /** Transition duration in ms. @default 200 */
  duration?: number
  /** Callback when exit transition completes (useful for overlay unmounting). */
  onExited?: () => void
  /** Additional CSS class always applied. */
  class?: string
}

// ============================================
// COMPONENT
// ============================================

/**
 * A transition utility that applies CSS classes for enter/exit animations.
 *
 * @example
 * ```tsx
 * <OpenTransition
 *   open={isOpen()}
 *   enterFrom="opacity-0 scale-95"
 *   enterTo="opacity-100 scale-100"
 *   exitFrom="opacity-100 scale-100"
 *   exitTo="opacity-0 scale-95"
 *   duration={200}
 * >
 *   <div class="transition-all">Content</div>
 * </OpenTransition>
 * ```
 */
export function OpenTransition(props: OpenTransitionProps): JSX.Element {
  const duration = () => props.duration ?? 200
  const [mounted, setMounted] = createSignal(props.open)
  const [transitionClasses, setTransitionClasses] = createSignal('')

  createEffect(on(
    () => props.open,
    (isOpen) => {
      if (isOpen) {
        // Enter: mount immediately, apply enterFrom, then enterTo
        setMounted(true)

        // Apply enterFrom classes first
        setTransitionClasses(props.enterFrom ?? '')

        // On next frame, apply enterTo classes
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTransitionClasses(props.enterTo ?? '')
          })
        })
      } else {
        // Exit: apply exitFrom, then exitTo, then unmount after duration
        setTransitionClasses(props.exitFrom ?? '')

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTransitionClasses(props.exitTo ?? '')
          })
        })

        const timer = setTimeout(() => {
          setMounted(false)
          props.onExited?.()
        }, duration())

        onCleanup(() => clearTimeout(timer))
      }
    }
  ))

  const resolved = resolveChildren(() => props.children)

  return (
    <Show when={mounted()}>
      <div
        class={`${props.class ?? ''} ${transitionClasses()}`}
        style={{ 'transition-duration': `${duration()}ms` }}
        data-open={props.open || undefined}
      >
        {resolved()}
      </div>
    </Show>
  )
}
