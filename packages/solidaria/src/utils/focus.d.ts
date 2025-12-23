/**
 * Focus management utilities.
 * Based on @react-aria/utils focus utilities.
 */
/**
 * Focuses an element without scrolling the page.
 * Uses preventScroll option with fallback for older browsers.
 */
export declare function focusWithoutScrolling(element: HTMLElement | null): void;
/**
 * Prevents focus from moving to a new element temporarily.
 * Used when clicking on a button that shouldn't steal focus.
 */
export declare function preventFocus(target: Element): void;
/**
 * Safely focuses an element, alias for focusWithoutScrolling.
 * This matches the react-aria focusSafely function name.
 */
export declare const focusSafely: typeof focusWithoutScrolling;
//# sourceMappingURL=focus.d.ts.map