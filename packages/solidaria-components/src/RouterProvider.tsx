/**
 * RouterProvider for solidaria-components
 *
 * A context provider for client-side router integration.
 * SolidJS apps typically use TanStack Router or SolidRouter directly;
 * this provides API compatibility with React Aria's RouterProvider.
 */

import { type JSX, createContext, useContext } from 'solid-js';

// ============================================
// TYPES
// ============================================

export interface RouterContextValue {
  /** Whether the router is a native browser router (no client-side navigation). */
  isNative: boolean;
  /** Navigate to a given href. */
  navigate: (href: string, routerOptions?: RouterOptions) => void;
  /** Transform an href for the router. */
  useHref: (href: string) => string;
}

export interface RouterOptions {
  /** Whether to replace the current history entry. */
  replace?: boolean;
  /** Additional router-specific options. */
  [key: string]: unknown;
}

export interface RouterProviderProps {
  /** A function that performs client-side navigation. */
  navigate: (href: string, routerOptions?: RouterOptions) => void;
  /** An optional function that transforms hrefs. */
  useHref?: (href: string) => string;
  /** Children to render. */
  children: JSX.Element;
}

// ============================================
// CONTEXT
// ============================================

const defaultRouter: RouterContextValue = {
  isNative: true,
  navigate: () => {},
  useHref: (href: string) => href,
};

export const RouterContext = createContext<RouterContextValue>(defaultRouter);

// ============================================
// COMPONENT
// ============================================

/**
 * A RouterProvider accepts a `navigate` function from a client-side router,
 * and provides it to all nested solidaria links to enable client-side navigation.
 *
 * @example
 * ```tsx
 * import { useNavigate } from '@solidjs/router';
 *
 * function App() {
 *   const navigate = useNavigate();
 *   return (
 *     <RouterProvider navigate={navigate}>
 *       <Link href="/about">About</Link>
 *     </RouterProvider>
 *   );
 * }
 * ```
 */
export function RouterProvider(props: RouterProviderProps): JSX.Element {
  const ctx: RouterContextValue = {
    isNative: false,
    navigate: props.navigate,
    useHref: props.useHref ?? ((href: string) => href),
  };

  return (
    <RouterContext.Provider value={ctx}>
      {props.children}
    </RouterContext.Provider>
  );
}

/**
 * Returns the current router context value.
 */
export function useRouter(): RouterContextValue {
  return useContext(RouterContext);
}
