/**
 * Global listener management utility.
 * Based on @react-aria/utils useGlobalListeners hook, adapted for SolidJS.
 *
 * In SolidJS, we use onCleanup for automatic cleanup instead of useEffect return.
 */
export interface GlobalListenerOptions extends AddEventListenerOptions {
    /** Whether to add the listener to the window instead of document */
    isWindow?: boolean;
}
/**
 * Creates a manager for global event listeners that automatically cleans up.
 * Use this in a component to register document/window level listeners
 * that will be removed when the component unmounts.
 */
export declare function createGlobalListeners(): {
    addGlobalListener: {
        <K extends keyof DocumentEventMap>(type: K, handler: (ev: DocumentEventMap[K]) => void, options?: GlobalListenerOptions): void;
        <K extends keyof WindowEventMap>(type: K, handler: (ev: WindowEventMap[K]) => void, options?: GlobalListenerOptions & {
            isWindow: true;
        }): void;
    };
    removeGlobalListener: {
        <K extends keyof DocumentEventMap>(type: K, handler: (ev: DocumentEventMap[K]) => void, options?: AddEventListenerOptions): void;
        <K extends keyof WindowEventMap>(type: K, handler: (ev: WindowEventMap[K]) => void, options?: AddEventListenerOptions & {
            isWindow: true;
        }): void;
    };
    removeAllGlobalListeners: () => void;
};
/**
 * Simple utility to add a single global listener with automatic cleanup.
 * For one-off listeners where the full manager isn't needed.
 */
export declare function addGlobalListenerOnce<K extends keyof DocumentEventMap>(type: K, handler: (ev: DocumentEventMap[K]) => void, options?: GlobalListenerOptions): () => void;
//# sourceMappingURL=globalListeners.d.ts.map