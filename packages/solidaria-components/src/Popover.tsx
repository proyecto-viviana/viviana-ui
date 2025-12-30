/**
 * Popover component for solidaria-components
 *
 * A headless popover component that positions relative to a trigger element.
 * Port of react-aria-components Popover.
 */

import {
  type JSX,
  createContext,
  createMemo,
  createSignal,
  createUniqueId,
  splitProps,
  useContext,
  Show,
  createEffect,
  onCleanup,
} from 'solid-js'
import { Portal, isServer } from 'solid-js/web'
import {
  createOverlayTrigger,
  FocusScope,
  type Placement,
  type PlacementAxis,
} from '@proyecto-viviana/solidaria'
import { createOverlayTriggerState } from '@proyecto-viviana/solid-stately'
import {
  type RenderChildren,
  type ClassNameOrFunction,
  type StyleOrFunction,
  type SlotProps,
  useRenderProps,
  filterDOMProps,
  dataAttr,
} from './utils'
import { PopoverTriggerContext } from './contexts'

// ============================================
// TYPES
// ============================================

export interface PopoverRenderProps {
  /**
   * The name of the component that triggered the popover.
   */
  trigger: string | null
  /**
   * The placement of the popover relative to the trigger.
   */
  placement: PlacementAxis | null
  /**
   * Whether the popover is currently entering (for animations).
   */
  isEntering: boolean
  /**
   * Whether the popover is currently exiting (for animations).
   */
  isExiting: boolean
}

export interface PopoverProps extends SlotProps {
  /** The children of the component - can be JSX or render function. */
  children?: RenderChildren<PopoverRenderProps>
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<PopoverRenderProps>
  /** The inline style for the element. */
  style?: StyleOrFunction<PopoverRenderProps>
  /**
   * The name of the component that triggered the popover.
   */
  trigger?: string
  /**
   * The ref for the element which the popover positions itself with respect to.
   * Required when used standalone (not within a trigger component).
   */
  triggerRef?: () => Element | null
  /**
   * The placement of the element with respect to its anchor element.
   * @default 'bottom'
   */
  placement?: Placement
  /**
   * The placement padding that should be applied between the element and its
   * surrounding container.
   * @default 12
   */
  containerPadding?: number
  /**
   * The additional offset applied along the main axis between the element and its
   * anchor element.
   * @default 8
   */
  offset?: number
  /**
   * The additional offset applied along the cross axis between the element and its
   * anchor element.
   * @default 0
   */
  crossOffset?: number
  /**
   * Whether the element should flip its orientation when there is insufficient room.
   * @default true
   */
  shouldFlip?: boolean
  /**
   * Whether the popover is non-modal (allows interaction outside).
   */
  isNonModal?: boolean
  /**
   * Whether pressing Escape to close should be disabled.
   */
  isKeyboardDismissDisabled?: boolean
  /**
   * Filter for which outside interactions should close the popover.
   */
  shouldCloseOnInteractOutside?: (element: Element) => boolean
  /** Whether the popover is open (controlled). */
  isOpen?: boolean
  /** Whether the popover opens by default (uncontrolled). */
  defaultOpen?: boolean
  /** Handler called when the popover's open state changes. */
  onOpenChange?: (isOpen: boolean) => void
  /** Whether the popover is entering (for animations). */
  isEntering?: boolean
  /** Whether the popover is exiting (for animations). */
  isExiting?: boolean
}

export interface PopoverTriggerProps {
  /** The children - should include a trigger and popover content. */
  children: JSX.Element
  /** Whether the popover is open (controlled). */
  isOpen?: boolean
  /** Whether the popover is open by default (uncontrolled). */
  defaultOpen?: boolean
  /** Callback when open state changes. */
  onOpenChange?: (isOpen: boolean) => void
}

// ============================================
// CONTEXTS
// ============================================

// Re-export from shared contexts
export { PopoverTriggerContext, usePopoverTrigger, type PopoverTriggerContextValue } from './contexts'

// Internal context for placement
export const PopoverContext = createContext<{ placement: () => PlacementAxis | null } | null>(null)

// ============================================
// POPOVER TRIGGER COMPONENT
// ============================================

/**
 * A PopoverTrigger opens a popover when a trigger element is pressed.
 * Children should include a trigger element (e.g. Button) and the Popover.
 */
export function PopoverTrigger(props: PopoverTriggerProps): JSX.Element {
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

  // Create overlay trigger (for side effects like scroll close)
  createOverlayTrigger(
    { type: 'dialog' },
    state,
    () => triggerRef
  )

  // Track if triggerRef has been set (to prevent buttons inside Popover from overwriting it)
  let triggerRefSet = false

  // Context value
  const contextValue = createMemo(() => ({
    state: {
      isOpen: () => state.isOpen(),
      open: () => state.open(),
      close: () => state.close(),
      toggle: () => state.toggle(),
    },
    triggerRef: () => {
      return triggerRef
    },
    setTriggerRef: (el: HTMLElement | null) => {
      // Only set the trigger ref once - the first button to register is the actual trigger
      // This prevents buttons inside the Popover content from overwriting the trigger ref
      if (!triggerRefSet && el) {
        triggerRef = el
        triggerRefSet = true
      }
    },
    triggerId,
    trigger: 'PopoverTrigger',
  }))

  // Just render children inside the provider - the Button component will detect
  // the PopoverTriggerContext and handle toggling. The Popover component will
  // detect the context and use it for open state.
  //
  // IMPORTANT: In SolidJS, JSX children are lazily evaluated when they're part
  // of JSX expression. So {local.children} here means the children (Button, Popover)
  // will be evaluated inside the Provider context.
  return (
    <PopoverTriggerContext.Provider value={contextValue()}>
      {local.children}
    </PopoverTriggerContext.Provider>
  )
}

// ============================================
// POPOVER COMPONENT
// ============================================

/**
 * A popover is an overlay element positioned relative to a trigger.
 */
export function Popover(props: PopoverProps): JSX.Element {
  if (isServer) {
    // On the server, return null - popovers should not render during SSR
    return null as unknown as JSX.Element
  }

  const [local, rest] = splitProps(props, [
    'class',
    'style',
    'trigger',
    'triggerRef',
    'placement',
    'containerPadding',
    'offset',
    'crossOffset',
    'shouldFlip',
    'isNonModal',
    'isKeyboardDismissDisabled',
    'shouldCloseOnInteractOutside',
    'isOpen',
    'defaultOpen',
    'onOpenChange',
    'isEntering',
    'isExiting',
  ])

  let popoverRef!: HTMLDivElement

  // Get trigger context if available
  const triggerContext = useContext(PopoverTriggerContext)

  // Internal state for uncontrolled mode
  const [internalOpen, setInternalOpen] = createSignal(local.defaultOpen ?? false)

  // Determine if open
  const isOpen = (): boolean => {
    if (local.isOpen !== undefined) return local.isOpen
    if (triggerContext) {
      return triggerContext.state.isOpen()
    }
    return internalOpen()
  }

  const close = () => {
    if (local.isOpen !== undefined) {
      local.onOpenChange?.(false)
    } else if (triggerContext) {
      triggerContext.state.close()
      local.onOpenChange?.(false)
    } else {
      setInternalOpen(false)
      local.onOpenChange?.(false)
    }
  }

  // Get trigger ref
  const getTriggerRef = () => {
    if (local.triggerRef) return local.triggerRef()
    if (triggerContext) return triggerContext.triggerRef()
    return null
  }

  // Signal to track placement after positioning
  const [placement, setPlacement] = createSignal<PlacementAxis | null>(null)
  // Signal to track position styles
  // Start with visibility hidden, then show after positioning
  const [positionStyles, setPositionStyles] = createSignal({
    top: '0px',
    left: '0px',
    visibility: 'hidden' as 'hidden' | 'visible',
  })

  // Handle keyboard dismiss (Escape key)
  createEffect(() => {
    if (!isOpen()) return
    if (local.isKeyboardDismissDisabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        close()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    onCleanup(() => document.removeEventListener('keydown', handleKeyDown))
  })

  // Handle click outside to dismiss popover
  createEffect(() => {
    if (!isOpen()) return
    if (local.isNonModal) return // Non-modal popovers don't auto-dismiss on outside click

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element
      const trigger = getTriggerRef()

      // Don't close if clicking inside the popover
      if (popoverRef && popoverRef.contains(target)) {
        return
      }

      // Don't close if clicking the trigger (it will toggle)
      if (trigger && trigger.contains(target)) {
        return
      }

      // Check custom filter
      if (local.shouldCloseOnInteractOutside && !local.shouldCloseOnInteractOutside(target)) {
        return
      }

      close()
    }

    // Use capture phase to catch clicks before they bubble
    // Small delay to avoid closing on the same click that opened it
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside, true)
    }, 0)

    onCleanup(() => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside, true)
    })
  })

  // Calculate position based on trigger element
  // Using position: fixed so we use viewport coordinates directly from getBoundingClientRect
  const updatePosition = () => {
    const trigger = getTriggerRef()
    const popover = popoverRef
    if (!trigger || !popover) return

    const triggerRect = trigger.getBoundingClientRect()
    // Use offsetWidth/offsetHeight which are more reliable than getBoundingClientRect
    // when the element might be positioned off-screen initially
    const popoverWidth = popover.offsetWidth
    const popoverHeight = popover.offsetHeight
    const offset = local.offset ?? 8

    let top = 0
    let left = 0
    const placementValue = local.placement ?? 'bottom'

    // Using viewport coordinates for position: fixed
    switch (placementValue) {
      case 'top':
      case 'top start':
      case 'top end':
        top = triggerRect.top - popoverHeight - offset
        left = triggerRect.left + (triggerRect.width - popoverWidth) / 2
        setPlacement('top')
        break
      case 'bottom':
      case 'bottom start':
      case 'bottom end':
        top = triggerRect.bottom + offset
        left = triggerRect.left + (triggerRect.width - popoverWidth) / 2
        setPlacement('bottom')
        break
      case 'left':
      case 'left top':
      case 'left bottom':
        top = triggerRect.top + (triggerRect.height - popoverHeight) / 2
        left = triggerRect.left - popoverWidth - offset
        setPlacement('left')
        break
      case 'right':
      case 'right top':
      case 'right bottom':
        top = triggerRect.top + (triggerRect.height - popoverHeight) / 2
        left = triggerRect.right + offset
        setPlacement('right')
        break
      default:
        top = triggerRect.bottom + offset
        left = triggerRect.left + (triggerRect.width - popoverWidth) / 2
        setPlacement('bottom')
    }

    setPositionStyles({
      top: `${top}px`,
      left: `${left}px`,
      visibility: 'visible',
    })
  }

  // Set up positioning effect - runs when open and trigger ref is available
  createEffect(() => {
    if (!isOpen()) return

    const triggerElement = getTriggerRef()
    if (!triggerElement) return

    // Initial position calculation - use requestAnimationFrame to ensure
    // the element is rendered and has proper dimensions
    requestAnimationFrame(() => {
      updatePosition()
    })

    // Update on scroll/resize
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)

    onCleanup(() => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    })
  })

  // Render props values
  const renderValues = createMemo<PopoverRenderProps>(() => ({
    trigger: local.trigger ?? triggerContext?.trigger ?? null,
    placement: placement(),
    isEntering: local.isEntering ?? false,
    isExiting: local.isExiting ?? false,
  }))

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: props.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Popover',
    },
    renderValues
  )

  // Filter DOM props
  const domProps = createMemo(() => filterDOMProps(rest as Record<string, unknown>, { global: true }))

  // Check if we should render with dialog role
  const shouldBeDialog = () => !local.isNonModal

  return (
    <Show when={isOpen() || local.isExiting}>
      <Portal>
        <PopoverContext.Provider value={{ placement: () => placement() }}>
          <FocusScope contain={shouldBeDialog()} restoreFocus autoFocus>
            <div
              {...domProps()}
              ref={popoverRef}
              role={shouldBeDialog() ? 'dialog' : undefined}
              tabIndex={shouldBeDialog() ? -1 : undefined}
              class={renderProps.class()}
              style={{
                position: 'fixed',
                'z-index': 100000,
                ...positionStyles(),
                ...renderProps.style(),
              }}
              data-trigger={local.trigger ?? triggerContext?.trigger}
              data-placement={placement()}
              data-entering={dataAttr(local.isEntering)}
              data-exiting={dataAttr(local.isExiting)}
            >
              {renderProps.renderChildren()}
            </div>
          </FocusScope>
        </PopoverContext.Provider>
      </Portal>
    </Show>
  )
}

// ============================================
// OVERLAY ARROW COMPONENT
// ============================================

export interface OverlayArrowProps {
  /** The children - should be an SVG or element for the arrow. */
  children?: JSX.Element | ((placement: PlacementAxis | null) => JSX.Element)
  /** The CSS className. */
  class?: string
  /** The inline style. */
  style?: JSX.CSSProperties
}

/**
 * An arrow element that points towards the trigger.
 */
export function OverlayArrow(props: OverlayArrowProps): JSX.Element {
  const popoverContext = useContext(PopoverContext)
  const placement = () => popoverContext?.placement() ?? null

  const resolveChildren = () => {
    const children = props.children
    if (typeof children === 'function') {
      return children(placement())
    }
    return children
  }

  return (
    <div
      class={props.class}
      style={props.style}
      data-placement={placement()}
      aria-hidden="true"
      role="presentation"
    >
      {resolveChildren()}
    </div>
  )
}

export default Popover
