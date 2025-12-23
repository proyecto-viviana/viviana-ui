/**
 * Text selection management utilities.
 * Based on @react-aria/interactions textSelection utilities.
 *
 * On iOS, long press triggers text selection. The only way to prevent this
 * is to set user-select: none on the entire page. On other platforms,
 * we can just set it on the target element.
 */
/**
 * Disables text selection on the page or element during press.
 * On iOS, applies to the entire document. On other platforms, just the target.
 */
export declare function disableTextSelection(target?: HTMLElement): void;
/**
 * Restores text selection after press ends.
 * On iOS, waits 300ms to avoid selection appearing during tap.
 */
export declare function restoreTextSelection(target?: HTMLElement): void;
//# sourceMappingURL=textSelection.d.ts.map