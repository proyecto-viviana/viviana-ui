/**
 * FocusableProvider - Provides DOM props to the nearest focusable child.
 *
 * This is a 1-1 port of React-Aria's FocusableProvider adapted for SolidJS.
 */
import { JSX, ParentComponent } from 'solid-js';
import { FocusableProviderProps } from './createFocusable';
/**
 * Provides DOM props to the nearest focusable child.
 * Used to pass focus-related props through component boundaries.
 *
 * @example
 * ```tsx
 * import { FocusableProvider } from 'solidaria';
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
export declare const FocusableProvider: ParentComponent<FocusableProviderProps & JSX.HTMLAttributes<HTMLElement>>;
//# sourceMappingURL=FocusableProvider.d.ts.map