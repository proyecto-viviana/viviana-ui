/**
 * createFocusRing hook for Solidaria
 *
 * Determines whether a focus ring should be visible for a given element.
 * Focus rings are visible when the user navigates with keyboard, but hidden
 * when using mouse/touch.
 *
 * Port of @react-aria/focus useFocusRing.
 */
import { type JSX, type Accessor } from 'solid-js';
export interface FocusRingProps {
    /** Whether the element is a text input. */
    isTextInput?: boolean;
    /** Whether the element will be auto focused. */
    autoFocus?: boolean;
    /** Whether focus should be tracked within the element. */
    within?: boolean;
}
export interface FocusRingResult {
    /** Whether the element is currently focused. */
    isFocused: Accessor<boolean>;
    /** Whether the focus ring should be visible. */
    isFocusVisible: Accessor<boolean>;
    /** Props to spread on the element to track focus. */
    focusProps: JSX.HTMLAttributes<HTMLElement>;
}
/**
 * Determines whether a focus ring should be visible for a given element.
 *
 * Focus rings are visible when:
 * - The element is focused AND
 * - The user is navigating with keyboard (not mouse/touch)
 *
 * For text inputs, focus rings are always visible when focused.
 */
export declare function createFocusRing(props?: FocusRingProps): FocusRingResult;
//# sourceMappingURL=createFocusRing.d.ts.map