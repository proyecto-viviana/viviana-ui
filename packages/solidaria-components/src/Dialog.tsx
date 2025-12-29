/**
 * Dialog component for solidaria-components
 *
 * A headless dialog component that combines ARIA hooks.
 * Port of react-aria-components Dialog.
 */

import {
  type JSX,
  createContext,
  createMemo,
  createUniqueId,
  splitProps,
  useContext,
  Switch,
  Match,
} from 'solid-js'
import {
  createDialog,
  createOverlayTrigger,
  type AriaDialogProps,
} from '@proyecto-viviana/solidaria'
import { createOverlayTriggerState } from '@proyecto-viviana/solid-stately'
import { DialogTriggerContext, useOverlayTriggerState } from './contexts'
import {
  type RenderChildren,
  type ClassNameOrFunction,
  type StyleOrFunction,
  type SlotProps,
  useRenderProps,
  filterDOMProps,
} from './utils'

// ============================================
// TYPES
// ============================================

export interface DialogRenderProps {
  /** Function to close the dialog */
  close: () => void
}

export interface DialogProps extends Omit<AriaDialogProps, 'class' | 'style'>, SlotProps {
  /** The children of the component - can be JSX or render function. */
  children?: RenderChildren<DialogRenderProps>
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<DialogRenderProps>
  /** The inline style for the element. */
  style?: StyleOrFunction<DialogRenderProps>
  /** Callback when dialog should close */
  onClose?: () => void
}

export interface DialogTriggerProps {
  /** The children - should include a trigger and modal/popover content. */
  children: JSX.Element
  /** Whether the dialog is open (controlled). */
  isOpen?: boolean
  /** Whether the dialog is open by default (uncontrolled). */
  defaultOpen?: boolean
  /** Callback when open state changes. */
  onOpenChange?: (isOpen: boolean) => void
}

// ============================================
// CONTEXTS
// ============================================

interface DialogContextValue {
  close: () => void
  titleId?: string
}

export const DialogContext = createContext<DialogContextValue | null>(null)

// Re-export DialogTriggerContext from shared contexts (also imported above for local use)
export { DialogTriggerContext, useDialogTrigger } from './contexts'

// ============================================
// DIALOG TRIGGER COMPONENT
// ============================================

/**
 * A DialogTrigger opens a dialog when a trigger element is pressed.
 * Children should include a trigger element (e.g. Button) and the dialog content.
 */
export function DialogTrigger(props: DialogTriggerProps): JSX.Element {
  const [local] = splitProps(props, ['children', 'isOpen', 'defaultOpen', 'onOpenChange'])

  // Create overlay trigger state
  const state = createOverlayTriggerState({
    get isOpen() {
      return local.isOpen
    },
    get defaultOpen() {
      return local.defaultOpen
    },
    onOpenChange: local.onOpenChange,
  })

  // Ref for the trigger element
  let triggerRef: HTMLElement | null = null
  const triggerId = createUniqueId()

  // Create overlay trigger props (used via context, not directly applied)
  createOverlayTrigger(
    { type: 'dialog' },
    state,
    () => triggerRef
  )

  // Context value - memoized to avoid unnecessary re-renders
  const contextValue = createMemo(() => ({
    state,
    triggerRef: () => triggerRef,
    triggerId,
  }))

  // In SolidJS, we simply render children directly within the provider
  // The children will have access to the context
  return (
    <DialogTriggerContext.Provider value={contextValue()}>
      {props.children}
    </DialogTriggerContext.Provider>
  )
}

// ============================================
// DIALOG COMPONENT
// ============================================

/**
 * A dialog is an overlay shown above other content in an application.
 */
export function Dialog(props: DialogProps): JSX.Element {
  const [local, ariaProps, rest] = splitProps(
    props,
    ['children', 'class', 'style', 'slot', 'onClose'],
    ['role', 'aria-label', 'aria-labelledby', 'aria-describedby']
  )

  let dialogRef!: HTMLDivElement

  // Get trigger context for aria-labelledby fallback
  const triggerContext = useContext(DialogTriggerContext)

  // createDialog returns dialogProps AND titleProps (with the id for the Heading)
  const { dialogProps, titleProps } = createDialog(
    {
      get role() {
        return ariaProps.role
      },
      get 'aria-label'() {
        return ariaProps['aria-label']
      },
      get 'aria-labelledby'() {
        // Use provided labelledby, or fall back to trigger id if no title
        return ariaProps['aria-labelledby'] ?? triggerContext?.triggerId
      },
      get 'aria-describedby'() {
        return ariaProps['aria-describedby']
      },
    },
    () => dialogRef
  )

  // Get titleId from titleProps - this links Dialog's aria-labelledby to Heading's id
  const titleId = () => titleProps()?.id

  // Get close function from OverlayTriggerState context or onClose prop
  const overlayState = useOverlayTriggerState()

  const close = () => {
    local.onClose?.()
    overlayState?.close()
    triggerContext?.state.close()
  }

  // Render props values
  const renderValues = createMemo<DialogRenderProps>(() => ({
    close,
  }))

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: local.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Dialog',
    },
    renderValues
  )

  // Filter DOM props
  const domProps = createMemo(() => filterDOMProps(rest as Record<string, unknown>, { global: true }))

  return (
    <DialogContext.Provider value={{ close, titleId: titleId() }}>
      <div
        {...dialogProps()}
        {...domProps()}
        ref={dialogRef}
        class={renderProps.class()}
        style={renderProps.style()}
      >
        {renderProps.renderChildren()}
      </div>
    </DialogContext.Provider>
  )
}

// ============================================
// HEADING COMPONENT
// ============================================

export interface HeadingProps {
  /** The children of the heading. */
  children: JSX.Element
  /** The CSS className. */
  class?: string
  /** The heading level (1-6). Defaults to 2. */
  level?: 1 | 2 | 3 | 4 | 5 | 6
  /** The slot to render into. */
  slot?: string
}

/**
 * Heading element for dialog title.
 * When rendered inside a Dialog, automatically gets the titleProps.
 */
export function Heading(props: HeadingProps): JSX.Element {
  const dialogContext = useContext(DialogContext)
  const level = () => props.level ?? 2
  const id = () => dialogContext?.titleId

  return (
    <Switch>
      <Match when={level() === 1}>
        <h1 id={id()} class={props.class}>{props.children}</h1>
      </Match>
      <Match when={level() === 2}>
        <h2 id={id()} class={props.class}>{props.children}</h2>
      </Match>
      <Match when={level() === 3}>
        <h3 id={id()} class={props.class}>{props.children}</h3>
      </Match>
      <Match when={level() === 4}>
        <h4 id={id()} class={props.class}>{props.children}</h4>
      </Match>
      <Match when={level() === 5}>
        <h5 id={id()} class={props.class}>{props.children}</h5>
      </Match>
      <Match when={level() === 6}>
        <h6 id={id()} class={props.class}>{props.children}</h6>
      </Match>
    </Switch>
  )
}

// Keep backward compatibility
export { Heading as DialogHeading }
