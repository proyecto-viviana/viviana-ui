/**
 * Dialog component for proyecto-viviana-ui
 *
 * Styled dialog component with overlay and backdrop.
 * Follows Spectrum 2 design patterns.
 */

import { type JSX, splitProps, Show, createSignal, createContext, useContext, createUniqueId, onMount, onCleanup, createEffect } from 'solid-js'
import { Portal } from 'solid-js/web'
import { createInteractOutside } from '@proyecto-viviana/solidaria'

// ============================================
// TYPES
// ============================================

export type DialogSize = 'sm' | 'md' | 'lg' | 'fullscreen'

export interface DialogProps {
  /** The size of the dialog. */
  size?: DialogSize
  /** Whether the dialog can be dismissed by clicking the X button. */
  isDismissable?: boolean
  /** Additional CSS class name. */
  class?: string
  /** The title of the dialog. */
  title?: string
  /** The children content. */
  children: JSX.Element
  /** Callback when dialog should close */
  onClose?: () => void
  /** ARIA role - defaults to 'dialog' */
  role?: 'dialog' | 'alertdialog'
  /** ARIA label */
  'aria-label'?: string
  /** ARIA labelledby */
  'aria-labelledby'?: string
}

export interface DialogTriggerProps {
  /** Button to trigger the dialog. */
  trigger: JSX.Element
  /** The dialog content - receives close function. */
  content: (close: () => void) => JSX.Element
  /** Whether the dialog is controlled. */
  isOpen?: boolean
  /** Callback when open state changes. */
  onOpenChange?: (isOpen: boolean) => void
  /** Whether clicking outside the dialog closes it. Defaults to true. */
  isDismissable?: boolean
  /** Whether pressing Escape closes the dialog. Defaults to true. */
  isKeyboardDismissDisabled?: boolean
}

// ============================================
// CONTEXT
// ============================================

interface DialogContextValue {
  close: () => void
}

const DialogContext = createContext<DialogContextValue | null>(null)

export function useDialogContext(): DialogContextValue | null {
  return useContext(DialogContext)
}

// ============================================
// STYLES
// ============================================

const sizeStyles: Record<DialogSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  fullscreen: 'max-w-full w-full h-full',
}

// ============================================
// DIALOG COMPONENT
// ============================================

/**
 * A dialog is an overlay shown above other content in an application.
 */
export function Dialog(props: DialogProps): JSX.Element {
  const [local, rest] = splitProps(props, [
    'size',
    'isDismissable',
    'class',
    'title',
    'children',
    'onClose',
    'role',
    'aria-label',
    'aria-labelledby',
  ])

  const size = local.size ?? 'md'
  const customClass = local.class ?? ''
  const role = local.role ?? 'dialog'

  // Generate a unique ID for the title if one is present
  const titleId = createUniqueId()
  const ariaLabelledBy = local['aria-labelledby'] ?? (local.title ? titleId : undefined)

  const close = () => local.onClose?.()

  const baseClass = 'bg-bg-300 rounded-lg shadow-xl border border-primary-700'
  const sizeClass = sizeStyles[size]
  const padding = 'p-6'
  const className = [baseClass, sizeClass, padding, customClass].filter(Boolean).join(' ')

  return (
    <DialogContext.Provider value={{ close }}>
      <div
        role={role}
        tabIndex={-1}
        aria-label={local['aria-label']}
        aria-labelledby={ariaLabelledBy}
        class={className}
        {...rest}
      >
        <Show when={local.title}>
          <div class="flex items-center justify-between mb-4">
            <h2 id={titleId} class="text-xl font-semibold text-primary-100">
              {local.title}
            </h2>
            <Show when={local.isDismissable}>
              <button
                onClick={close}
                class="text-primary-400 hover:text-primary-200 transition-colors"
                aria-label="Close dialog"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </Show>
          </div>
        </Show>
        <div class="text-primary-200">
          {local.children}
        </div>
      </div>
    </DialogContext.Provider>
  )
}

// ============================================
// DIALOG TRIGGER COMPONENT
// ============================================

/**
 * DialogTrigger wraps a trigger button and dialog content.
 * Handles opening/closing the dialog with overlay and backdrop.
 */
export function DialogTrigger(props: DialogTriggerProps): JSX.Element {
  const [isOpen, setIsOpen] = createSignal(props.isOpen ?? false)
  let dialogRef: HTMLDivElement | undefined

  const open = () => {
    setIsOpen(true)
    props.onOpenChange?.(true)
  }

  const close = () => {
    setIsOpen(false)
    props.onOpenChange?.(false)
  }

  // Handle controlled state
  const isOpenControlled = () => props.isOpen !== undefined ? props.isOpen : isOpen()

  // Whether dismissable (defaults to true)
  const isDismissable = () => props.isDismissable !== false

  // Click outside to close
  createInteractOutside({
    ref: () => dialogRef ?? null,
    onInteractOutside: () => {
      if (isOpenControlled() && isDismissable()) {
        close()
      }
    },
    isDisabled: !isOpenControlled() || !isDismissable(),
  })

  // Escape key to close
  onMount(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpenControlled() && !props.isKeyboardDismissDisabled) {
        e.preventDefault()
        e.stopPropagation()
        close()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    onCleanup(() => document.removeEventListener('keydown', handleKeyDown))
  })

  // Prevent background scroll when dialog is open
  createEffect(() => {
    if (!isOpenControlled()) return

    const prevOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'

    onCleanup(() => {
      document.documentElement.style.overflow = prevOverflow
    })
  })

  return (
    <>
      <div onClick={open}>
        {props.trigger}
      </div>

      <Show when={isOpenControlled()}>
        <Portal>
          {/* Backdrop */}
          <div
            class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            aria-hidden="true"
          />

          {/* Dialog container - pointer-events-none so clicks pass through to backdrop detection */}
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            {/* Dialog wrapper - pointer-events-auto to capture clicks on the dialog itself */}
            <div ref={dialogRef} class="pointer-events-auto">
              {props.content(close)}
            </div>
          </div>
        </Portal>
      </Show>
    </>
  )
}

// ============================================
// DIALOG FOOTER COMPONENT
// ============================================

export interface DialogFooterProps {
  /** Footer content, typically buttons. */
  children: JSX.Element
  /** Additional CSS class. */
  class?: string
}

/**
 * Footer section for dialog actions.
 */
export function DialogFooter(props: DialogFooterProps): JSX.Element {
  return (
    <div class={`flex gap-3 justify-end mt-6 pt-4 border-t border-primary-700 ${props.class ?? ''}`}>
      {props.children}
    </div>
  )
}
