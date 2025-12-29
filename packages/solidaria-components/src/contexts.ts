/**
 * Shared contexts for overlay components.
 *
 * These are separated to avoid circular dependencies between
 * Dialog, Modal, and Button components.
 */

import { createContext, useContext } from 'solid-js'
import type { OverlayTriggerState as StatelyOverlayTriggerState } from '@proyecto-viviana/solid-stately'

// ============================================
// OVERLAY TRIGGER STATE CONTEXT
// ============================================

export interface OverlayTriggerState {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export const OverlayTriggerStateContext = createContext<OverlayTriggerState | null>(null)

/**
 * Hook to access the overlay trigger state from context.
 */
export function useOverlayTriggerState(): OverlayTriggerState | null {
  return useContext(OverlayTriggerStateContext)
}

// ============================================
// DIALOG TRIGGER CONTEXT
// ============================================

export interface DialogTriggerContextValue {
  state: StatelyOverlayTriggerState
  triggerRef: () => HTMLElement | null
  triggerId: string
}

export const DialogTriggerContext = createContext<DialogTriggerContextValue | null>(null)

/**
 * Hook to access the dialog trigger state from context.
 */
export function useDialogTrigger(): DialogTriggerContextValue | null {
  return useContext(DialogTriggerContext)
}
