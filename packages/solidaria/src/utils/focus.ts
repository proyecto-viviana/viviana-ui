/**
 * Focus management utilities.
 * Based on @react-aria/utils focus utilities.
 */

import { getOwnerDocument } from "./dom";

/**
 * Focuses an element without scrolling the page.
 * Uses preventScroll option with fallback for older browsers.
 */
export function focusWithoutScrolling(element: HTMLElement | null): void {
  if (!element) return;

  // Try using the modern preventScroll option
  try {
    element.focus({ preventScroll: true });
  } catch {
    // Fallback for browsers that don't support preventScroll
    // Save scroll positions and restore after focus
    const scrollableElements = getScrollableAncestors(element);
    const scrollPositions = scrollableElements.map((el) => ({
      element: el,
      scrollTop: el.scrollTop,
      scrollLeft: el.scrollLeft,
    }));

    element.focus();

    // Restore scroll positions
    for (const { element: el, scrollTop, scrollLeft } of scrollPositions) {
      el.scrollTop = scrollTop;
      el.scrollLeft = scrollLeft;
    }
  }
}

/**
 * Gets all scrollable ancestors of an element.
 */
function getScrollableAncestors(element: Element): Element[] {
  const ancestors: Element[] = [];
  let parent = element.parentElement;

  while (parent) {
    const style = getComputedStyle(parent);
    const overflowY = style.overflowY;
    const overflowX = style.overflowX;

    if (
      overflowY === "auto" ||
      overflowY === "scroll" ||
      overflowX === "auto" ||
      overflowX === "scroll"
    ) {
      ancestors.push(parent);
    }

    parent = parent.parentElement;
  }

  // Also include the document scrolling element
  const doc = getOwnerDocument(element);
  ancestors.push(doc.documentElement);

  return ancestors;
}

// State for preventFocus
let ignoreFocus = false;
let preventFocusTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Prevents focus from moving to a new element temporarily.
 * Used when clicking on a button that shouldn't steal focus.
 */
export function preventFocus(target: Element): void {
  // Find the closest focusable ancestor
  const focusableAncestor = findFocusableAncestor(target);
  if (!focusableAncestor) return;

  const document = getOwnerDocument(target);
  const activeElement = document.activeElement;

  // Set flag to ignore next focus event
  ignoreFocus = true;

  // Capture focus events and prevent them from changing focus
  const onFocus = (e: Event) => {
    if (ignoreFocus) {
      e.stopImmediatePropagation();
      // Refocus the original element if focus moved
      if (activeElement && activeElement !== document.body) {
        (activeElement as HTMLElement).focus();
      }
    }
  };

  const onBlur = (e: Event) => {
    if (ignoreFocus) {
      e.stopImmediatePropagation();
    }
  };

  // Use capturing to intercept focus before it reaches elements
  // Cast to HTMLElement to access focus event listeners
  const el = focusableAncestor as HTMLElement;
  el.addEventListener("focus", onFocus, true);
  el.addEventListener("blur", onBlur, true);
  el.addEventListener("focusin", onFocus, true);
  el.addEventListener("focusout", onBlur, true);

  // Clean up after the current event cycle
  if (preventFocusTimeout != null) {
    clearTimeout(preventFocusTimeout);
  }

  preventFocusTimeout = setTimeout(() => {
    ignoreFocus = false;
    el.removeEventListener("focus", onFocus, true);
    el.removeEventListener("blur", onBlur, true);
    el.removeEventListener("focusin", onFocus, true);
    el.removeEventListener("focusout", onBlur, true);
    preventFocusTimeout = null;
  }, 0);
}

/**
 * Finds the closest focusable ancestor or the element itself.
 */
function findFocusableAncestor(element: Element): Element | null {
  let current: Element | null = element;

  while (current) {
    if (
      current.hasAttribute("tabindex") ||
      ["INPUT", "BUTTON", "SELECT", "TEXTAREA", "A"].includes(current.tagName)
    ) {
      return current;
    }
    current = current.parentElement;
  }

  return element;
}

/**
 * Safely focuses an element, alias for focusWithoutScrolling.
 * This matches the react-aria focusSafely function name.
 */
export const focusSafely = focusWithoutScrolling;
