/**
 * Dialog component for proyecto-viviana-ui
 *
 * Styled dialog component with overlay and backdrop.
 * Follows Spectrum 2 design patterns.
 */

import { type JSX, splitProps, Show, createContext, useContext } from 'solid-js'
import {
  Dialog as HeadlessDialog,
  DialogTrigger as HeadlessDialogTrigger,
  Heading as HeadlessDialogHeading,
  Modal as HeadlessModal,
  ModalOverlay as HeadlessModalOverlay,
  useDialogTrigger,
  type DialogProps as HeadlessDialogProps,
} from '@proyecto-viviana/solidaria-components'

// ============================================
// TYPES
// ============================================

export type DialogSize = 'sm' | 'md' | 'lg' | 'fullscreen'

export interface DialogProps extends Omit<HeadlessDialogProps, 'class' | 'style' | 'children'> {
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
  /** Whether pressing Escape closes the dialog. Defaults to false. */
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
  ])

  const size = () => local.size ?? 'md'

  const className = () => {
    const base = 'bg-bg-300 rounded-lg shadow-xl border border-primary-700 p-6'
    const sizeClass = sizeStyles[size()]
    const custom = local.class ?? ''
    return [base, sizeClass, custom].filter(Boolean).join(' ')
  }

  return (
    <HeadlessDialog
      {...rest}
      onClose={local.onClose}
      class={className()}
      children={({ close }) => (
        <DialogContext.Provider value={{ close }}>
          <Show when={local.title}>
            <div class="flex items-center justify-between mb-4">
              <HeadlessDialogHeading level={2} class="text-xl font-semibold text-primary-100">
                {local.title}
              </HeadlessDialogHeading>
              <Show when={local.isDismissable}>
                <button
                  type="button"
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
          <div class="text-primary-200">{local.children}</div>
        </DialogContext.Provider>
      )}
    />
  )
}

// ============================================
// DIALOG TRIGGER COMPONENT
// ============================================

function DialogTriggerContent(props: { content: (close: () => void) => JSX.Element }): JSX.Element {
  const triggerContext = useDialogTrigger()
  const close = () => triggerContext?.state.close()
  return props.content(close)
}

/**
 * DialogTrigger wraps a trigger button and dialog content.
 * Handles opening/closing the dialog with overlay and backdrop.
 */
export function DialogTrigger(props: DialogTriggerProps): JSX.Element {
  return (
    <HeadlessDialogTrigger
      isOpen={props.isOpen}
      onOpenChange={props.onOpenChange}
    >
      {props.trigger}
      <HeadlessModalOverlay
        isDismissable={props.isDismissable ?? true}
        isKeyboardDismissDisabled={props.isKeyboardDismissDisabled ?? false}
        class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
      >
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <HeadlessModal class="pointer-events-auto">
            <DialogTriggerContent content={props.content} />
          </HeadlessModal>
        </div>
      </HeadlessModalOverlay>
    </HeadlessDialogTrigger>
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
