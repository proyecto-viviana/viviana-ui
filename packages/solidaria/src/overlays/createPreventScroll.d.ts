/**
 * Prevents scrolling on the document body while mounted.
 * Based on @react-aria/overlays usePreventScroll.
 */
export interface PreventScrollOptions {
    /** Whether the scroll lock is disabled. */
    isDisabled?: boolean;
}
/**
 * Prevents scrolling on the document body on mount, and
 * restores it on unmount. Also ensures that content does not
 * shift due to the scrollbars disappearing.
 */
export declare function createPreventScroll(options?: PreventScrollOptions): void;
//# sourceMappingURL=createPreventScroll.d.ts.map