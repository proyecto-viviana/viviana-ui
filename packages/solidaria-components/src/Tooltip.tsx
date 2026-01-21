/**
 * Tooltip component for solidaria-components
 *
 * A tooltip displays a description of an element on hover or focus.
 * Port of react-aria-components/src/Tooltip.tsx
 */

import {
  type JSX,
  type ParentComponent,
  createContext,
  useContext,
  createMemo,
  createSignal,
  createEffect,
  onCleanup,
  Show,
} from 'solid-js';
import { isServer } from 'solid-js/web';
import {
  createTooltipTriggerState,
  type TooltipTriggerState,
  type TooltipTriggerProps as StateProps,
} from '@proyecto-viviana/solid-stately';
import {
  createTooltip,
  createTooltipTrigger,
  type TooltipTriggerProps as AriaProps,
  OverlayContainer,
} from '@proyecto-viviana/solidaria';
import {
  type RenderChildren,
  type ClassNameOrFunction,
  type StyleOrFunction,
  type SlotProps,
  useRenderProps,
  filterDOMProps,
} from './utils';

// ============================================
// TYPES
// ============================================

export interface TooltipRenderProps {
  /** Whether the tooltip is currently entering (for animations). */
  isEntering: boolean;
  /** Whether the tooltip is currently exiting (for animations). */
  isExiting: boolean;
  /** The placement of the tooltip relative to the trigger. */
  placement: 'top' | 'bottom' | 'left' | 'right' | null;
}

export interface TooltipTriggerComponentProps extends StateProps, AriaProps {
  /** The children of the tooltip trigger (trigger element and tooltip). */
  children: JSX.Element;
}

export interface TooltipProps extends SlotProps {
  /** The children of the tooltip. A function may be provided to receive render props. */
  children?: RenderChildren<TooltipRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<TooltipRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<TooltipRenderProps>;
  /** Whether the tooltip is open (controlled). */
  isOpen?: boolean;
  /** Whether the tooltip is open by default (uncontrolled). */
  defaultOpen?: boolean;
  /** The placement of the tooltip relative to the trigger. */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Whether to render the tooltip in a portal. */
  shouldFlip?: boolean;
}

// ============================================
// CONTEXT
// ============================================

interface TooltipTriggerContextValue {
  state: TooltipTriggerState;
  tooltipProps: { id: string };
  triggerRef: () => HTMLElement | null | undefined;
}

const TooltipTriggerContext = createContext<TooltipTriggerContextValue | null>(null);

// ============================================
// COMPONENTS
// ============================================

/**
 * TooltipTrigger wraps around a trigger element and a Tooltip.
 * It handles opening and closing the Tooltip when the user hovers
 * over or focuses the trigger.
 *
 * @example
 * ```tsx
 * <TooltipTrigger>
 *   <Button>Hover me</Button>
 *   <Tooltip>This is a tooltip</Tooltip>
 * </TooltipTrigger>
 * ```
 */
export const TooltipTrigger: ParentComponent<TooltipTriggerComponentProps> = (props) => {
  let triggerRef: HTMLElement | null = null;

  const state = createTooltipTriggerState({
    get delay() { return props.delay; },
    get closeDelay() { return props.closeDelay; },
    get isOpen() { return props.isOpen; },
    get defaultOpen() { return props.defaultOpen; },
    get onOpenChange() { return props.onOpenChange; },
  });

  const { triggerProps, tooltipProps } = createTooltipTrigger(
    {
      get isDisabled() { return props.isDisabled; },
      get trigger() { return props.trigger; },
      get shouldCloseOnPress() { return props.shouldCloseOnPress; },
    },
    state,
    () => triggerRef
  );

  const context: TooltipTriggerContextValue = {
    state,
    tooltipProps,
    triggerRef: () => triggerRef,
  };

  // Clone children and inject trigger props into the first child
  const processChildren = () => {
    const children = props.children;
    if (Array.isArray(children)) {
      // First child is the trigger, rest are tooltip(s)
      const [trigger, ...rest] = children;
      return (
        <>
          <TriggerWrapper
            triggerProps={triggerProps}
            ref={(el) => { triggerRef = el; }}
          >
            {trigger}
          </TriggerWrapper>
          {rest}
        </>
      );
    }
    return children;
  };

  return (
    <TooltipTriggerContext.Provider value={context}>
      {processChildren()}
    </TooltipTriggerContext.Provider>
  );
};

/**
 * Wrapper component that spreads trigger props onto its child
 */
const TriggerWrapper: ParentComponent<{
  triggerProps: JSX.HTMLAttributes<HTMLElement>;
  ref: (el: HTMLElement) => void;
}> = (props) => {
  // Get the child element and clone it with trigger props
  const child = () => props.children as JSX.Element;

  // We wrap in a span with display:contents to not affect layout.
  // However, display:contents makes getBoundingClientRect return zeros,
  // so we pass a ref callback that finds the first actual element child.
  const handleRef = (span: HTMLSpanElement) => {
    // Find the first element child that has dimensions (not display:contents)
    const findVisibleChild = (el: Element): HTMLElement | null => {
      if (el instanceof HTMLElement) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          return el;
        }
        // Check children
        for (const child of el.children) {
          const found = findVisibleChild(child);
          if (found) return found;
        }
      }
      return null;
    };

    // Use requestAnimationFrame to ensure children are rendered and have dimensions
    // This is necessary because SolidJS may not have computed child layout yet
    const resolveRef = () => {
      const visibleChild = findVisibleChild(span);
      if (visibleChild) {
        props.ref(visibleChild);
      } else {
        // Fallback to span itself
        props.ref(span);
      }
    };

    // Try immediately first (in case layout is already computed)
    const immediateChild = findVisibleChild(span);
    if (immediateChild) {
      props.ref(immediateChild);
    } else {
      // Defer to next frame when layout should be computed
      requestAnimationFrame(resolveRef);
    }
  };

  return (
    <span
      {...props.triggerProps}
      ref={handleRef}
      style={{ display: 'contents' }}
    >
      {child()}
    </span>
  );
};

/**
 * A tooltip displays a description of an element on hover or focus.
 *
 * @example
 * ```tsx
 * <TooltipTrigger>
 *   <Button>Hover me</Button>
 *   <Tooltip>This is helpful information</Tooltip>
 * </TooltipTrigger>
 * ```
 */
export function Tooltip(props: TooltipProps): JSX.Element {
  const context = useContext(TooltipTriggerContext);

  // Support standalone usage
  const localState = createTooltipTriggerState({
    get isOpen() { return props.isOpen; },
    get defaultOpen() { return props.defaultOpen; },
  });

  const state = () => context?.state ?? localState;
  const placement = () => props.placement ?? 'top';

  // Only render when open
  const isOpen = () => state().isOpen();

  return (
    <Show when={isOpen()}>
      <TooltipContent
        {...props}
        state={state()}
        contextTooltipProps={context?.tooltipProps ?? {}}
        placement={placement()}
        triggerRef={context?.triggerRef ?? (() => null)}
      />
    </Show>
  );
}

/**
 * Internal component that renders the tooltip content
 */
function TooltipContent(
  props: TooltipProps & {
    state: TooltipTriggerState;
    contextTooltipProps: { id?: string };
    placement: 'top' | 'bottom' | 'left' | 'right';
    triggerRef: () => HTMLElement | null | undefined;
  }
): JSX.Element {
  if (isServer) {
    return null as unknown as JSX.Element;
  }

  let tooltipRef!: HTMLDivElement;
  const { tooltipProps: ariaTooltipProps } = createTooltip({}, props.state);

  // Signal to track position styles
  // Start visible at 0,0 and update position asynchronously
  // This ensures the tooltip is immediately accessible (for screen readers and tests)
  // while the visual position gets calculated
  const [positionStyles, setPositionStyles] = createSignal({
    top: '0px',
    left: '0px',
    visibility: 'visible' as 'hidden' | 'visible',
  });

  const values = createMemo<TooltipRenderProps>(() => ({
    isEntering: false, // TODO: animation support
    isExiting: false,
    placement: props.placement,
  }));

  const renderProps = useRenderProps(
    {
      class: props.class,
      style: props.style,
      children: props.children,
      defaultClassName: 'solidaria-Tooltip',
    },
    values
  );

  // Calculate position based on trigger element
  // Using position: fixed so we use viewport coordinates directly from getBoundingClientRect
  // Returns true if position was successfully updated, false if we need to retry
  const updatePosition = (): boolean => {
    const triggerEl = props.triggerRef();
    if (!triggerEl || !tooltipRef) return false;

    const triggerRect = triggerEl.getBoundingClientRect();

    // Check if the trigger has valid dimensions (not display:contents or not rendered yet)
    if (triggerRect.width === 0 || triggerRect.height === 0) {
      return false; // Need to retry
    }

    // Use offsetWidth/offsetHeight which are more reliable than getBoundingClientRect
    // when the element might be positioned off-screen initially
    const tooltipWidth = tooltipRef.offsetWidth;
    const tooltipHeight = tooltipRef.offsetHeight;
    const offset = 8; // Gap between trigger and tooltip

    let top = 0;
    let left = 0;

    // Using viewport coordinates for position: fixed
    switch (props.placement) {
      case 'top':
        top = triggerRect.top - tooltipHeight - offset;
        left = triggerRect.left + (triggerRect.width - tooltipWidth) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + offset;
        left = triggerRect.left + (triggerRect.width - tooltipWidth) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipHeight) / 2;
        left = triggerRect.left - tooltipWidth - offset;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipHeight) / 2;
        left = triggerRect.right + offset;
        break;
    }

    setPositionStyles({
      top: `${top}px`,
      left: `${left}px`,
      visibility: 'visible',
    });

    return true;
  };

  // Set up positioning effect - runs when trigger ref is available
  createEffect(() => {
    const trigger = props.triggerRef();
    if (!trigger) return;

    // Initial position calculation - use requestAnimationFrame to ensure
    // the element is rendered and has proper dimensions
    // We may need multiple frames if the trigger ref hasn't resolved yet
    let retryCount = 0;
    const maxRetries = 5;

    const tryUpdatePosition = () => {
      const success = updatePosition();
      if (!success && retryCount < maxRetries) {
        retryCount++;
        // In JSDOM, requestAnimationFrame may not trigger layout properly
        // Use setTimeout for more reliable deferral across environments
        setTimeout(tryUpdatePosition, 16); // ~60fps
      }
      // If all retries fail, tooltip stays at 0,0 (test environments)
      // The tooltip is visible by default, so it remains accessible
    };

    // Initial attempt - use rAF for real browsers, then fall back to timeout retries
    requestAnimationFrame(tryUpdatePosition);

    // Update on scroll/resize
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    onCleanup(() => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    });
  });

  // Filter to only valid DOM props (aria-*, data-*, events)
  const domProps = filterDOMProps(props);

  // Extract ref from ariaTooltipProps to avoid type conflicts (SolidJS ref types are element-specific)
  const { ref: _ariaRef, ...cleanAriaProps } = ariaTooltipProps as Record<string, unknown>;

  return (
    <OverlayContainer>
      <div
        {...domProps}
        {...props.contextTooltipProps}
        {...cleanAriaProps}
        role="tooltip"
        ref={tooltipRef}
        class={renderProps.class()}
        style={{
          position: 'fixed',
          'z-index': 100000,
          ...positionStyles(),
          ...renderProps.style(),
        }}
        data-placement={props.placement}
      >
        {renderProps.renderChildren()}
      </div>
    </OverlayContainer>
  );
}

// Re-export types
export type { TooltipTriggerState };
