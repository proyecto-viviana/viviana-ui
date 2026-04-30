/**
 * SSR utilities for Solid Stately
 *
 * SolidJS has built-in SSR support with `isServer` and `createUniqueId()`.
 * These utilities provide a consistent API matching React-Stately's patterns.
 */
/**
 * Re-export isServer from solid-js/web for convenience.
 */
export declare const isServer: boolean;
/**
 * Returns whether the component is currently being server side rendered.
 * Can be used to delay browser-specific rendering until after hydration.
 */
export declare function createIsSSR(): boolean;
/**
 * Generate a unique ID that is stable across server and client.
 * Uses SolidJS's built-in createUniqueId which handles SSR correctly.
 *
 * @param defaultId - Optional default ID to use instead of generating one.
 */
export declare function createId(defaultId?: string): string;
/**
 * Check if we can use DOM APIs.
 * This is useful for code that needs to run only in the browser.
 */
export declare const canUseDOM: boolean;
//# sourceMappingURL=index.d.ts.map
