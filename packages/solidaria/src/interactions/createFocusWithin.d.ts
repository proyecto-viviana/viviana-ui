/**
 * createFocusWithin - Handles focus events for the target and its descendants.
 *
 * This is a 1-1 port of React-Aria's useFocusWithin hook adapted for SolidJS.
 */
import { JSX } from 'solid-js';
export interface FocusWithinProps {
    /** Whether the focus within events should be disabled. */
    isDisabled?: boolean;
    /** Handler that is called when the target element or a descendant receives focus. */
    onFocusWithin?: (e: FocusEvent) => void;
    /** Handler that is called when the target element and all descendants lose focus. */
    onBlurWithin?: (e: FocusEvent) => void;
    /** Handler that is called when the focus within state changes. */
    onFocusWithinChange?: (isFocusWithin: boolean) => void;
}
export interface FocusWithinResult {
    /** Props to spread onto the target element. */
    focusWithinProps: JSX.HTMLAttributes<HTMLElement>;
}
/**
 * Handles focus events for the target and its descendants.
 *
 * Based on react-aria's useFocusWithin but adapted for SolidJS.
 */
export declare function createFocusWithin(props?: FocusWithinProps): FocusWithinResult;
//# sourceMappingURL=createFocusWithin.d.ts.map