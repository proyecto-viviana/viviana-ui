/**
 * Utility functions for solidaria-components
 * Port of react-aria-components/src/utils.tsx
 */

import {
  type JSX,
  type Accessor,
  type ParentProps,
  createContext,
  useContext,
  children as resolveChildren,
  createMemo,
  splitProps,
  mergeProps as solidMergeProps,
} from 'solid-js';

// ============================================
// TYPES
// ============================================

/**
 * Render props pattern - children can be a function that receives state
 */
export type RenderChildren<T> = JSX.Element | ((renderProps: T) => JSX.Element);

/**
 * Class name can be a string or a function that computes based on state
 */
export type ClassNameOrFunction<T> = string | ((renderProps: T) => string);

/**
 * Style can be an object or a function that computes based on state
 */
export type StyleOrFunction<T> = JSX.CSSProperties | ((renderProps: T) => JSX.CSSProperties);

/**
 * Common render props interface
 */
export interface RenderPropsBase<T> {
  /** The children of the component. A function may be provided to receive render props. */
  children?: RenderChildren<T>;
  /** The CSS className for the element. A function may be provided to compute the class based on state. */
  class?: ClassNameOrFunction<T>;
  /** The inline style for the element. A function may be provided to compute the style based on state. */
  style?: StyleOrFunction<T>;
}

/**
 * Slot props for named slots
 */
export interface SlotProps {
  /** A slot name for the component. */
  slot?: string;
}

// ============================================
// RENDER PROPS
// ============================================

/**
 * Resolves render props (children, class, style) based on component state
 */
export function useRenderProps<T extends object>(
  props: RenderPropsBase<T> & { defaultClassName?: string },
  values: Accessor<T>
): Accessor<{
  children: JSX.Element;
  class: string;
  style: JSX.CSSProperties | undefined;
}> {
  return createMemo(() => {
    const currentValues = values();
    const { children, class: className, style, defaultClassName = '' } = props;

    // Resolve children
    const resolvedChildren = typeof children === 'function'
      ? children(currentValues)
      : children;

    // Resolve class
    const resolvedClass = typeof className === 'function'
      ? className(currentValues)
      : className ?? defaultClassName;

    // Resolve style
    const resolvedStyle = typeof style === 'function'
      ? style(currentValues)
      : style;

    return {
      children: resolvedChildren,
      class: resolvedClass,
      style: resolvedStyle,
    };
  });
}

// ============================================
// CONTEXT UTILITIES
// ============================================

/**
 * Context value that can be null or the actual value
 */
export type ContextValue<T, E extends HTMLElement = HTMLElement> = T | null;

/**
 * Creates a context with props and ref merging support
 */
export function createSlottedContext<T>() {
  return createContext<T | null>(null);
}

/**
 * Use context with null check
 */
export function useSlottedContext<T>(context: ReturnType<typeof createContext<T | null>>): T | null {
  return useContext(context);
}

// ============================================
// DATA ATTRIBUTES
// ============================================

/**
 * Converts boolean state values to data attributes
 */
export function dataAttr(value: boolean | undefined): '' | undefined {
  return value ? '' : undefined;
}

/**
 * Creates data attributes from render props
 */
export function createDataAttributes<T extends Record<string, boolean | string | undefined>>(
  values: T
): Record<string, string | undefined> {
  const result: Record<string, string | undefined> = {};

  for (const [key, value] of Object.entries(values)) {
    if (typeof value === 'boolean') {
      result[`data-${camelToKebab(key)}`] = value ? '' : undefined;
    } else if (value !== undefined) {
      result[`data-${camelToKebab(key)}`] = value;
    }
  }

  return result;
}

function camelToKebab(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

// ============================================
// PROPS UTILITIES
// ============================================

/**
 * Remove data attributes from props (for internal use)
 */
export function removeDataAttributes<T extends Record<string, unknown>>(props: T): T {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props)) {
    if (!key.startsWith('data-')) {
      result[key] = value;
    }
  }

  return result as T;
}

/**
 * Filter DOM props - keep only valid DOM attributes
 */
export function filterDOMProps<T extends Record<string, unknown>>(
  props: T,
  options: { global?: boolean } = {}
): Record<string, unknown> {
  const { global = false } = options;
  const result: Record<string, unknown> = {};

  const globalAttrs = new Set([
    'id', 'class', 'style', 'tabIndex', 'role', 'title', 'lang', 'dir',
    'hidden', 'draggable', 'accessKey', 'contentEditable', 'spellcheck',
  ]);

  const ariaAttrs = /^aria-/;
  const dataAttrs = /^data-/;
  const eventHandlers = /^on[A-Z]/;

  for (const [key, value] of Object.entries(props)) {
    if (
      (global && globalAttrs.has(key)) ||
      ariaAttrs.test(key) ||
      dataAttrs.test(key) ||
      eventHandlers.test(key)
    ) {
      result[key] = value;
    }
  }

  return result;
}
