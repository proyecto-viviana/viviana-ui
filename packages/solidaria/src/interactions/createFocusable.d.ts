/**
 * createFocusable - Makes an element focusable and capable of auto focus.
 *
 * This is a 1-1 port of React-Aria's useFocusable hook adapted for SolidJS.
 */
import { JSX, Accessor } from 'solid-js';
import { type FocusEvents } from './createFocus';
import { type KeyboardEvents } from './createKeyboard';
export interface FocusableDOMProps {
    /** Whether to exclude the element from the sequential tab order. */
    excludeFromTabOrder?: boolean;
}
export interface FocusableProps extends FocusEvents, KeyboardEvents {
    /** Whether the element should receive focus on mount. */
    autoFocus?: boolean;
}
export interface CreateFocusableProps extends FocusableProps, FocusableDOMProps {
    /** Whether focus should be disabled. */
    isDisabled?: Accessor<boolean> | boolean;
}
export interface FocusableResult {
    /** Props to spread on the focusable element. */
    focusableProps: JSX.HTMLAttributes<HTMLElement>;
}
export interface FocusableContextValue {
    ref?: (el: HTMLElement) => void;
    [key: string]: unknown;
}
/**
 * Context for passing focusable props to nested focusable children.
 * Used by FocusableProvider to pass DOM props to the nearest focusable child.
 */
export declare const FocusableContext: import("solid-js").Context<FocusableContextValue | null>;
export interface FocusableProviderProps {
    /** The child element to provide DOM props to. */
    children?: JSX.Element;
}
/**
 * Makes an element focusable, handling disabled state and tab order.
 * Provides focus state tracking and autoFocus support.
 *
 * Based on react-aria's useFocusable but adapted for SolidJS.
 *
 * @example
 * ```tsx
 * import { createFocusable } from 'solidaria';
 *
 * function FocusableInput(props) {
 *   let ref;
 *   const { focusableProps } = createFocusable({
 *     autoFocus: props.autoFocus,
 *     onFocusChange: (focused) => console.log('Focus:', focused),
 *   });
 *
 *   return (
 *     <input
 *       {...focusableProps}
 *       ref={(el) => { ref = el; focusableProps.ref?.(el); }}
 *     />
 *   );
 * }
 * ```
 */
export declare function createFocusable(props?: CreateFocusableProps, ref?: (el: HTMLElement) => void): FocusableResult;
//# sourceMappingURL=createFocusable.d.ts.map