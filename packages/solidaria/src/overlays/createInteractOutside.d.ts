/**
 * Detects interactions outside a given element.
 * Based on @react-aria/interactions useInteractOutside.
 */
export interface InteractOutsideProps {
    /** Reference to the element to detect interactions outside of. */
    ref: () => Element | null;
    /** Handler called when an interaction outside the element completes. */
    onInteractOutside?: (e: PointerEvent) => void;
    /** Handler called when an interaction outside the element starts. */
    onInteractOutsideStart?: (e: PointerEvent) => void;
    /** Whether the interact outside events should be disabled. */
    isDisabled?: boolean;
}
/**
 * Detects interactions outside a given element, used in components like
 * Dialogs and Popovers so they can close when a user clicks outside them.
 */
export declare function createInteractOutside(props: InteractOutsideProps): void;
//# sourceMappingURL=createInteractOutside.d.ts.map