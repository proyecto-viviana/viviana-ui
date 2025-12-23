/**
 * createFocus - Handles focus events for the immediate target.
 *
 * This is a 1-1 port of React-Aria's useFocus hook adapted for SolidJS.
 * Focus events on child elements will be ignored.
 */
import { JSX } from 'solid-js';
export interface FocusEvents {
    /** Handler that is called when the element receives focus. */
    onFocus?: (e: FocusEvent) => void;
    /** Handler that is called when the element loses focus. */
    onBlur?: (e: FocusEvent) => void;
    /** Handler that is called when the element's focus status changes. */
    onFocusChange?: (isFocused: boolean) => void;
}
export interface CreateFocusProps extends FocusEvents {
    /** Whether the focus events should be disabled. */
    isDisabled?: boolean;
}
export interface FocusResult {
    /** Props to spread onto the target element. */
    focusProps: JSX.HTMLAttributes<HTMLElement>;
}
/**
 * Handles focus events for the immediate target.
 * Focus events on child elements will be ignored.
 *
 * Based on react-aria's useFocus but adapted for SolidJS.
 */
export declare function createFocus(props?: CreateFocusProps): FocusResult;
//# sourceMappingURL=createFocus.d.ts.map