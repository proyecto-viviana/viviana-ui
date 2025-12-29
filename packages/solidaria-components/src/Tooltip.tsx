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
  Show,
} from 'solid-js';
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

  // We need to return the child with the trigger props spread onto it
  // This is tricky in SolidJS - we'll wrap in a span for now
  return (
    <span
      {...props.triggerProps}
      ref={props.ref}
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
  }
): JSX.Element {
  const { tooltipProps: ariaTooltipProps } = createTooltip({}, props.state);

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
        class={renderProps.class()}
        style={renderProps.style()}
        data-placement={props.placement}
      >
        {renderProps.renderChildren()}
      </div>
    </OverlayContainer>
  );
}

// Re-export types
export type { TooltipTriggerState };
