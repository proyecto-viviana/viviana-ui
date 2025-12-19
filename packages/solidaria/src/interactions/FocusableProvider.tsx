/**
 * FocusableProvider - Provides DOM props to the nearest focusable child.
 *
 * This is a 1-1 port of React-Aria's FocusableProvider adapted for SolidJS.
 */

import { JSX, ParentComponent } from 'solid-js';
import { FocusableContext, FocusableContextValue, FocusableProviderProps } from './createFocusable';

/**
 * Provides DOM props to the nearest focusable child.
 * Used to pass focus-related props through component boundaries.
 *
 * @example
 * ```tsx
 * import { FocusableProvider } from '@proyecto-viviana/solidaria';
 *
 * function MyComponent() {
 *   return (
 *     <FocusableProvider onFocus={() => console.log('focused!')}>
 *       <NestedFocusableComponent />
 *     </FocusableProvider>
 *   );
 * }
 * ```
 */
export const FocusableProvider: ParentComponent<
  FocusableProviderProps & JSX.HTMLAttributes<HTMLElement>
> = (props) => {
  const { children, ...otherProps } = props;

  const context: FocusableContextValue = {
    ...otherProps,
    ref: (_el: HTMLElement) => {
      // Store ref if needed by parent
    },
  };

  return (
    <FocusableContext.Provider value={context}>
      {children}
    </FocusableContext.Provider>
  );
};
