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
} from "solid-js";
import { isServer } from "solid-js/web";
import {
  createTooltipTriggerState,
  type TooltipTriggerState,
  type TooltipTriggerProps as StateProps,
} from "@proyecto-viviana/solid-stately";
import {
  createTooltip,
  createTooltipTrigger,
  type TooltipTriggerProps as AriaProps,
  OverlayContainer,
} from "@proyecto-viviana/solidaria";
import {
  type RenderChildren,
  type ClassNameOrFunction,
  type StyleOrFunction,
  type SlotProps,
  useRenderProps,
  filterDOMProps,
} from "./utils";

export interface TooltipRenderProps {
  /** Whether the tooltip is currently entering (for animations). */
  isEntering: boolean;
  /** Whether the tooltip is currently exiting (for animations). */
  isExiting: boolean;
  /** The placement of the tooltip relative to the trigger. */
  placement: "top" | "bottom" | "left" | "right" | null;
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
  placement?: "top" | "bottom" | "left" | "right";
  /** Whether to render the tooltip in a portal. */
  shouldFlip?: boolean;
}

interface TooltipTriggerContextValue {
  state: TooltipTriggerState;
  tooltipProps: { id: string };
  triggerRef: () => HTMLElement | null | undefined;
}

const TooltipTriggerContext = createContext<TooltipTriggerContextValue | null>(null);
export const TooltipContext = TooltipTriggerContext;
export const TooltipTriggerStateContext = createContext<TooltipTriggerState | null>(null);

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
    get delay() {
      return props.delay;
    },
    get closeDelay() {
      return props.closeDelay;
    },
    get isOpen() {
      return props.isOpen;
    },
    get defaultOpen() {
      return props.defaultOpen;
    },
    get onOpenChange() {
      return props.onOpenChange;
    },
  });

  const { triggerProps, tooltipProps } = createTooltipTrigger(
    {
      get isDisabled() {
        return props.isDisabled;
      },
      get trigger() {
        return props.trigger;
      },
      get shouldCloseOnPress() {
        return props.shouldCloseOnPress;
      },
    },
    state,
    () => triggerRef,
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
            ref={(el) => {
              triggerRef = el;
            }}
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
    <TooltipTriggerStateContext.Provider value={state}>
      <TooltipTriggerContext.Provider value={context}>
        {processChildren()}
      </TooltipTriggerContext.Provider>
    </TooltipTriggerStateContext.Provider>
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
    <span {...props.triggerProps} ref={handleRef} style={{ display: "contents" }}>
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
    get isOpen() {
      return props.isOpen;
    },
    get defaultOpen() {
      return props.defaultOpen;
    },
  });

  const state = () => context?.state ?? localState;
  const placement = () => props.placement ?? "top";

  const isOpen = () => state().isOpen();

  // Exit animation state machine: 'closed' | 'open' | 'exiting'
  // Keeps the tooltip mounted during exit animation so CSS transitions can play.
  const [exitState, setExitState] = createSignal<"closed" | "open" | "exiting">(
    isOpen() ? "open" : "closed",
  );

  createEffect(() => {
    const open = isOpen();
    const current = exitState();
    if (current === "open" && !open) {
      setExitState("exiting");
    } else if ((current === "closed" || current === "exiting") && open) {
      setExitState("open");
    }
  });

  // Signal for the tooltip ref so we can observe exit animations
  const [tooltipEl, setTooltipEl] = createSignal<HTMLDivElement | null>(null);

  // When exiting, wait for CSS animations to finish, then set state to closed
  createEffect(() => {
    if (exitState() !== "exiting") return;
    const el = tooltipEl();
    if (!el || !("getAnimations" in el)) {
      setExitState("closed");
      return;
    }
    const animations = el.getAnimations();
    if (animations.length === 0) {
      setExitState("closed");
      return;
    }
    let canceled = false;
    Promise.all(animations.map((a) => a.finished))
      .then(() => {
        if (!canceled) setExitState((s) => (s === "exiting" ? "closed" : s));
      })
      .catch(() => {
        if (!canceled) setExitState((s) => (s === "exiting" ? "closed" : s));
      });
    onCleanup(() => {
      canceled = true;
    });
  });

  const shouldRender = () => isOpen() || exitState() === "exiting";
  const isExiting = () => exitState() === "exiting";

  return (
    <Show when={shouldRender()}>
      <TooltipContent
        {...props}
        state={state()}
        contextTooltipProps={context?.tooltipProps ?? {}}
        placement={placement()}
        triggerRef={context?.triggerRef ?? (() => null)}
        isExiting={isExiting()}
        onTooltipRef={setTooltipEl}
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
    placement: "top" | "bottom" | "left" | "right";
    triggerRef: () => HTMLElement | null | undefined;
    isExiting: boolean;
    onTooltipRef: (el: HTMLDivElement | null) => void;
  },
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
    top: "0px",
    left: "0px",
    visibility: "visible" as "hidden" | "visible",
  });

  // Enter animation state: starts true on mount, clears after first animation frame.
  // Uses getAnimations() to detect CSS animations/transitions - if none exist (JSDOM,
  // no CSS defined, reduced-motion), clears immediately.
  const [isEntering, setIsEntering] = createSignal(true);

  createEffect(() => {
    if (!isEntering()) return;
    if (!tooltipRef || !("getAnimations" in tooltipRef)) {
      setIsEntering(false);
      return;
    }
    // Cancel any premature CSS transitions triggered before layout
    for (const anim of tooltipRef.getAnimations()) {
      if (anim instanceof CSSTransition) {
        anim.cancel();
      }
    }
    const animations = tooltipRef.getAnimations();
    if (animations.length === 0) {
      setIsEntering(false);
      return;
    }
    let canceled = false;
    Promise.all(animations.map((a) => a.finished))
      .then(() => {
        if (!canceled) setIsEntering(false);
      })
      .catch(() => {
        if (!canceled) setIsEntering(false);
      });
    onCleanup(() => {
      canceled = true;
    });
  });

  const values = createMemo<TooltipRenderProps>(() => ({
    isEntering: isEntering(),
    isExiting: props.isExiting,
    placement: props.placement,
  }));

  const renderProps = useRenderProps(
    {
      class: props.class,
      style: props.style,
      children: props.children,
      defaultClassName: "solidaria-Tooltip",
    },
    values,
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
      case "top":
        top = triggerRect.top - tooltipHeight - offset;
        left = triggerRect.left + (triggerRect.width - tooltipWidth) / 2;
        break;
      case "bottom":
        top = triggerRect.bottom + offset;
        left = triggerRect.left + (triggerRect.width - tooltipWidth) / 2;
        break;
      case "left":
        top = triggerRect.top + (triggerRect.height - tooltipHeight) / 2;
        left = triggerRect.left - tooltipWidth - offset;
        break;
      case "right":
        top = triggerRect.top + (triggerRect.height - tooltipHeight) / 2;
        left = triggerRect.right + offset;
        break;
    }

    setPositionStyles({
      top: `${top}px`,
      left: `${left}px`,
      visibility: "visible",
    });

    return true;
  };

  // Set up positioning effect - runs when trigger ref is available.
  // Tracks pending rAF/setTimeout IDs so they can be canceled on cleanup.
  createEffect(() => {
    const trigger = props.triggerRef();
    if (!trigger) return;

    let retryCount = 0;
    const maxRetries = 5;
    let pendingRaf = 0;
    let pendingTimeout = 0;

    const tryUpdatePosition = () => {
      pendingRaf = 0;
      pendingTimeout = 0;
      const success = updatePosition();
      if (!success && retryCount < maxRetries) {
        retryCount++;
        pendingTimeout = window.setTimeout(tryUpdatePosition, 16);
      }
    };

    pendingRaf = requestAnimationFrame(tryUpdatePosition);

    // Update on scroll/resize
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    onCleanup(() => {
      if (pendingRaf) cancelAnimationFrame(pendingRaf);
      if (pendingTimeout) clearTimeout(pendingTimeout);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    });
  });

  // Filter to only valid DOM props (aria-*, data-*, events)
  const domProps = filterDOMProps(props);

  // Extract ref from ariaTooltipProps to avoid type conflicts (SolidJS ref types are element-specific)
  const { ref: _ariaRef, ...cleanAriaProps } = ariaTooltipProps as Record<string, unknown>;

  const setRef = (el: HTMLDivElement) => {
    tooltipRef = el;
    props.onTooltipRef(el);
  };

  // Clean up ref on unmount
  onCleanup(() => {
    props.onTooltipRef(null);
  });

  return (
    <OverlayContainer>
      <div
        {...domProps}
        {...props.contextTooltipProps}
        {...cleanAriaProps}
        role="tooltip"
        ref={setRef}
        class={renderProps.class()}
        style={{
          position: "fixed",
          "z-index": 100000,
          ...positionStyles(),
          ...renderProps.style(),
        }}
        data-placement={props.placement}
        data-entering={isEntering() || undefined}
        data-exiting={props.isExiting || undefined}
      >
        {renderProps.renderChildren()}
      </div>
    </OverlayContainer>
  );
}

export type { TooltipTriggerState };
