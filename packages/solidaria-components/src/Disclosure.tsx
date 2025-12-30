/**
 * Disclosure and Accordion components for solidaria-components
 *
 * Disclosure is a widget that can be toggled to show or hide content.
 * Accordion (DisclosureGroup) manages multiple disclosures with optional single-expand.
 *
 * Port of react-aria-components Disclosure.
 */

import {
  type JSX,
  createContext,
  createMemo,
  createSignal,
  splitProps,
  useContext,
} from 'solid-js';
import {
  createDisclosureState,
  createDisclosureGroupState,
  type DisclosureState,
  type DisclosureGroupState,
  type DisclosureStateProps,
  type DisclosureGroupStateProps,
} from '@proyecto-viviana/solid-stately';
import {
  createDisclosure,
  createDisclosureGroup,
} from '@proyecto-viviana/solidaria';
import {
  type RenderChildren,
  type ClassNameOrFunction,
  type StyleOrFunction,
  useRenderProps,
  filterDOMProps,
  dataAttr,
} from './utils';

// ============================================
// TYPES
// ============================================

export interface DisclosureRenderProps {
  /** Whether the disclosure is expanded. */
  isExpanded: boolean;
  /** Whether the disclosure is disabled. */
  isDisabled: boolean;
}

export interface DisclosureGroupRenderProps {
  /** Whether all items are disabled. */
  isDisabled: boolean;
}

export interface DisclosureProps extends DisclosureStateProps {
  /** The children of the component. */
  children?: RenderChildren<DisclosureRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<DisclosureRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<DisclosureRenderProps>;
  /** Whether the disclosure is disabled. */
  isDisabled?: boolean;
  /** A unique identifier for the disclosure (used in groups). */
  id?: string;
}

export interface DisclosureGroupProps extends DisclosureGroupStateProps {
  /** The children of the component. */
  children?: RenderChildren<DisclosureGroupRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<DisclosureGroupRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<DisclosureGroupRenderProps>;
}

export interface DisclosureTriggerProps {
  /** The children of the trigger. */
  children?: JSX.Element;
  /** The CSS className for the element. */
  class?: string;
  /** The inline style for the element. */
  style?: JSX.CSSProperties;
}

export interface DisclosurePanelProps {
  /** The children of the panel. */
  children?: RenderChildren<DisclosureRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<DisclosureRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<DisclosureRenderProps>;
}

// ============================================
// CONTEXT
// ============================================

interface DisclosureContextValue {
  state: DisclosureState;
  isDisabled: boolean;
  buttonProps: JSX.ButtonHTMLAttributes<HTMLButtonElement>;
  panelProps: JSX.HTMLAttributes<HTMLElement>;
}

export const DisclosureContext = createContext<DisclosureContextValue | null>(null);

export function useDisclosureContext(): DisclosureContextValue | null {
  return useContext(DisclosureContext);
}

interface DisclosureGroupContextValue {
  state: DisclosureGroupState;
}

export const DisclosureGroupContext = createContext<DisclosureGroupContextValue | null>(null);

export function useDisclosureGroupContext(): DisclosureGroupContextValue | null {
  return useContext(DisclosureGroupContext);
}

// ============================================
// DISCLOSURE GROUP (Accordion)
// ============================================

/**
 * DisclosureGroup manages a group of Disclosure components.
 * Use this to create an accordion where only one item can be expanded at a time.
 *
 * @example
 * ```tsx
 * <DisclosureGroup>
 *   <Disclosure id="item1">
 *     <DisclosureTrigger>Item 1</DisclosureTrigger>
 *     <DisclosurePanel>Content 1</DisclosurePanel>
 *   </Disclosure>
 *   <Disclosure id="item2">
 *     <DisclosureTrigger>Item 2</DisclosureTrigger>
 *     <DisclosurePanel>Content 2</DisclosurePanel>
 *   </Disclosure>
 * </DisclosureGroup>
 * ```
 */
export function DisclosureGroup(props: DisclosureGroupProps): JSX.Element {
  // IMPORTANT: Don't destructure or access props.children early!
  // In SolidJS, children are lazily evaluated. Accessing them before
  // the context provider renders causes them to evaluate outside the context.
  // See: https://github.com/solidjs/solid/issues/182
  const [local, rest] = splitProps(props, [
    'class',
    'style',
    'allowsMultipleExpanded',
    'isDisabled',
    'expandedKeys',
    'defaultExpandedKeys',
    'onExpandedChange',
  ]);

  // Create group state
  const state = createDisclosureGroupState({
    allowsMultipleExpanded: local.allowsMultipleExpanded,
    isDisabled: local.isDisabled,
    expandedKeys: local.expandedKeys,
    defaultExpandedKeys: local.defaultExpandedKeys,
    onExpandedChange: local.onExpandedChange,
  });

  // Create group accessibility props
  const { groupProps } = createDisclosureGroup(
    { isDisabled: local.isDisabled },
    state
  );

  // Render props values
  const renderValues = createMemo<DisclosureGroupRenderProps>(() => ({
    isDisabled: state.isDisabled,
  }));

  // Resolve render props - don't pass children, we'll render props.children directly
  const renderProps = useRenderProps(
    {
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-DisclosureGroup',
    },
    renderValues
  );

  // Filter DOM props
  const domProps = createMemo(() => filterDOMProps(rest as Record<string, unknown>, { global: true }));

  // Context value
  const contextValue: DisclosureGroupContextValue = { state };

  // Extract ref from groupProps to avoid type conflicts
  const { ref: _ref, ...cleanGroupProps } = groupProps as Record<string, unknown>;

  // Resolve children - handle both static JSX and render functions
  // IMPORTANT: We access props.children directly (not local.children) to preserve
  // lazy evaluation inside context providers
  const resolveChildren = () => {
    const children = props.children;
    if (typeof children === 'function') {
      return (children as (props: DisclosureGroupRenderProps) => JSX.Element)(renderValues());
    }
    return children;
  };

  return (
    <DisclosureGroupContext.Provider value={contextValue}>
      <div
        {...domProps()}
        {...cleanGroupProps}
        class={renderProps.class()}
        style={renderProps.style()}
        data-disabled={dataAttr(state.isDisabled)}
      >
        {resolveChildren()}
      </div>
    </DisclosureGroupContext.Provider>
  );
}

// ============================================
// DISCLOSURE
// ============================================

/**
 * Disclosure is a widget that can be toggled to show or hide content.
 *
 * @example
 * ```tsx
 * <Disclosure>
 *   <DisclosureTrigger>Show more</DisclosureTrigger>
 *   <DisclosurePanel>Hidden content here...</DisclosurePanel>
 * </Disclosure>
 * ```
 */
export function Disclosure(props: DisclosureProps): JSX.Element {
  // IMPORTANT: Don't destructure or access props.children early!
  // In SolidJS, children are lazily evaluated. Accessing them before
  // the context provider renders causes them to evaluate outside the context.
  // See: https://github.com/solidjs/solid/issues/182
  const [local, rest] = splitProps(props, [
    'class',
    'style',
    'isDisabled',
    'isExpanded',
    'defaultExpanded',
    'onExpandedChange',
    'id',
  ]);

  // Check if we're inside a DisclosureGroup
  const groupContext = useDisclosureGroupContext();

  // Create disclosure state
  // If in a group, sync with group state
  const state = createDisclosureState(() => {
    const id = local.id;
    if (groupContext && id) {
      return {
        isExpanded: groupContext.state.isExpanded(id),
        onExpandedChange: (expanded: boolean) => {
          if (expanded !== groupContext.state.isExpanded(id)) {
            groupContext.state.toggleKey(id);
          }
          local.onExpandedChange?.(expanded);
        },
      };
    }
    return {
      isExpanded: local.isExpanded,
      defaultExpanded: local.defaultExpanded,
      onExpandedChange: local.onExpandedChange,
    };
  });

  // Panel ref as a signal so the createEffect in createDisclosure can track it
  const [panelRef, setPanelRefSignal] = createSignal<HTMLElement | null>(null);

  // Create disclosure accessibility props
  const disclosureAria = createDisclosure(
    { isDisabled: local.isDisabled || groupContext?.state.isDisabled },
    state,
    panelRef  // Pass the accessor directly
  );

  // Determine if disabled
  const isDisabled = () => local.isDisabled || groupContext?.state.isDisabled || false;

  // Render props values
  const renderValues = createMemo<DisclosureRenderProps>(() => ({
    isExpanded: state.isExpanded(),
    isDisabled: isDisabled(),
  }));

  // Resolve render props - don't pass children, we'll render props.children directly
  const renderProps = useRenderProps(
    {
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Disclosure',
    },
    renderValues
  );

  // Filter DOM props
  const domProps = createMemo(() => filterDOMProps(rest as Record<string, unknown>, { global: true }));

  // Context value - pass as object directly (not memoized call) so it stays reactive
  const contextValue: DisclosureContextValue = {
    state,
    get isDisabled() { return isDisabled(); },
    get buttonProps() { return disclosureAria.buttonProps; },
    get panelProps() { return disclosureAria.panelProps; },
  };

  // Setter for panel ref
  const setPanelRef = (el: HTMLElement | null) => {
    setPanelRefSignal(el);
  };

  // Resolve children - handle both static JSX and render functions
  // IMPORTANT: We access props.children directly (not local.children) to preserve
  // lazy evaluation inside context providers
  const resolveChildren = () => {
    const children = props.children;
    if (typeof children === 'function') {
      return (children as (props: DisclosureRenderProps) => JSX.Element)(renderValues());
    }
    return children;
  };

  return (
    <DisclosureContext.Provider value={contextValue}>
      <DisclosurePanelRefContext.Provider value={setPanelRef}>
        <div
          {...domProps()}
          class={renderProps.class()}
          style={renderProps.style()}
          data-expanded={dataAttr(state.isExpanded())}
          data-disabled={dataAttr(isDisabled())}
        >
          {resolveChildren()}
        </div>
      </DisclosurePanelRefContext.Provider>
    </DisclosureContext.Provider>
  );
}

// Internal context to pass panel ref setter
const DisclosurePanelRefContext = createContext<((el: HTMLElement | null) => void) | null>(null);

// ============================================
// DISCLOSURE TRIGGER
// ============================================

/**
 * DisclosureTrigger is the button that toggles the disclosure.
 */
export function DisclosureTrigger(props: DisclosureTriggerProps): JSX.Element {
  // Get context - now safe because parent uses lazy children evaluation
  const context = useContext(DisclosureContext);

  // Reactive accessors
  const isExpanded = () => context?.state.isExpanded() ?? false;
  const isDisabled = () => context?.isDisabled ?? false;

  // Get buttonProps from context - extract ref to avoid type issues
  const getButtonProps = () => {
    if (!context) return { id: undefined, 'aria-controls': undefined };
    const { ref: _ref, ...rest } = context.buttonProps as Record<string, unknown>;
    return rest;
  };

  const handleClick = () => {
    if (context && !isDisabled()) {
      context.state.toggle();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!context || isDisabled()) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      context.state.toggle();
    }
  };

  return (
    <button
      type="button"
      id={getButtonProps().id as string | undefined}
      aria-expanded={isExpanded()}
      aria-controls={getButtonProps()['aria-controls'] as string | undefined}
      disabled={isDisabled()}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      class={props.class}
      style={props.style}
      data-expanded={dataAttr(isExpanded())}
      data-disabled={dataAttr(isDisabled())}
    >
      {props.children}
    </button>
  );
}

// ============================================
// DISCLOSURE PANEL
// ============================================

/**
 * DisclosurePanel contains the content that is shown/hidden.
 */
export function DisclosurePanel(props: DisclosurePanelProps): JSX.Element {
  // Get context - now safe because parent uses lazy children evaluation
  const context = useContext(DisclosureContext);
  const panelRefSetter = useContext(DisclosurePanelRefContext);

  const [local, rest] = splitProps(props, ['children', 'class', 'style']);

  // Reactive accessors
  const isExpanded = () => context?.state.isExpanded() ?? false;
  const isDisabled = () => context?.isDisabled ?? false;

  // Render props values
  const renderValues = createMemo<DisclosureRenderProps>(() => ({
    isExpanded: isExpanded(),
    isDisabled: isDisabled(),
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: local.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-DisclosurePanel',
    },
    renderValues
  );

  // Filter DOM props
  const domProps = createMemo(() => filterDOMProps(rest as Record<string, unknown>, { global: true }));

  // Get panelProps - extract ref to avoid type issues
  const getPanelProps = () => {
    if (!context) return { id: undefined, role: 'region', 'aria-labelledby': undefined, hidden: true };
    const { ref: _ref, ...rest } = context.panelProps as Record<string, unknown>;
    return rest;
  };

  return (
    <div
      {...domProps()}
      {...getPanelProps()}
      ref={(el) => panelRefSetter?.(el)}
      class={renderProps.class()}
      style={renderProps.style()}
      data-expanded={dataAttr(isExpanded())}
    >
      {renderProps.renderChildren()}
    </div>
  );
}

// Re-export state types for convenience
export type { DisclosureState, DisclosureGroupState };
