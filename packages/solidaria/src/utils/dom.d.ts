/**
 * DOM utilities for cross-browser compatibility.
 * Based on @react-aria/utils DOM utilities.
 */
/**
 * Gets the owner document of an element, or the global document.
 */
export declare function getOwnerDocument(el: Element | null | undefined): Document;
/**
 * Gets the owner window of an element, or the global window.
 */
export declare function getOwnerWindow(el: Element | null | undefined): Window & typeof globalThis;
/**
 * Cross-browser implementation of Node.contains that works with ShadowDOM.
 * In Safari, Node.contains doesn't properly detect elements inside shadow roots.
 */
export declare function nodeContains(parent: Node | null, child: Node | null): boolean;
/**
 * Gets the event target, handling composed path for shadow DOM.
 */
export declare function getEventTarget<T extends EventTarget>(event: Event): T | null;
/**
 * Checks if an element is a valid focusable element.
 */
export declare function isFocusable(element: Element): boolean;
/**
 * Checks if a keyboard event should trigger the default action (like clicking).
 */
export declare function isValidKeyboardEvent(event: KeyboardEvent, currentTarget: Element): boolean;
/**
 * Checks if a key is valid for a specific input type.
 */
export declare function isValidInputKey(target: HTMLInputElement, key: string): boolean;
/**
 * Checks if an element is an HTML anchor link (has href attribute).
 */
export declare function isHTMLAnchorLink(target: Element): boolean;
/**
 * Whether to prevent default on keyboard events for this element.
 */
export declare function shouldPreventDefaultKeyboard(target: Element, key: string): boolean;
/**
 * Whether to prevent default on pointer up for this element.
 */
export declare function shouldPreventDefaultUp(target: Element): boolean;
/**
 * Opens a link, supporting both same-window and new-window navigation.
 * Used for keyboard activation of links with Space key (which doesn't natively open links).
 */
export declare function openLink(target: HTMLAnchorElement, event: Event, allowOpener?: boolean): void;
/**
 * Checks if an element is scrollable based on its overflow style.
 * @param node - The element to check
 * @param checkForOverflow - If true, also check if the element actually overflows
 */
export declare function isScrollable(node: Element | null, checkForOverflow?: boolean): boolean;
/**
 * Gets the nearest scrollable parent element.
 * @param node - The starting element
 * @param checkForOverflow - If true, only return parents that actually overflow
 */
export declare function getScrollParent(node: Element, checkForOverflow?: boolean): Element;
/**
 * Checks if an element will open a virtual keyboard when focused.
 * Used for iOS Safari scroll handling.
 */
export declare function willOpenKeyboard(target: Element | null): boolean;
//# sourceMappingURL=dom.d.ts.map