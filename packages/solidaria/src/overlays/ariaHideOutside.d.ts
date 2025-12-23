/**
 * Hides all elements in the DOM outside the given targets from screen readers.
 * Based on @react-aria/overlays ariaHideOutside.
 */
export interface AriaHideOutsideOptions {
    /** The root element to start hiding from. */
    root?: Element;
    /** Whether to use the `inert` attribute instead of `aria-hidden`. */
    shouldUseInert?: boolean;
}
/**
 * Hides all elements in the DOM outside the given targets from screen readers using aria-hidden,
 * and returns a function to revert these changes. In addition, changes to the DOM are watched
 * and new elements outside the targets are automatically hidden.
 * @param targets - The elements that should remain visible.
 * @param options - Options for hiding behavior.
 * @returns - A function to restore all hidden elements.
 */
export declare function ariaHideOutside(targets: Element[], options?: AriaHideOutsideOptions | Element): () => void;
/**
 * Keeps an element visible when aria-hiding is active.
 * Used for elements like live regions that should remain accessible.
 */
export declare function keepVisible(element: Element): (() => void) | undefined;
//# sourceMappingURL=ariaHideOutside.d.ts.map