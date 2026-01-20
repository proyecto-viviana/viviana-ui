/**
 * Focus testing utilities
 *
 * Helpers for testing focus behavior in components.
 */

/**
 * Selector for focusable elements
 */
export type FocusableSelector =
  | 'all' // All focusable elements
  | 'tabbable' // Elements in tab order (tabindex >= 0)
  | 'programmatic'; // All elements that can receive programmatic focus

/**
 * Get the currently focused element.
 */
export function getFocusedElement(): Element | null {
  return document.activeElement;
}

/**
 * Check if a specific element is focused.
 */
export function isFocused(element: Element): boolean {
  return document.activeElement === element;
}

/**
 * Check if focus is within an element (the element or any descendant is focused).
 */
export function isFocusWithin(element: Element): boolean {
  const focused = document.activeElement;
  if (!focused) return false;
  return element === focused || element.contains(focused);
}

/**
 * Default selectors for focusable elements
 */
const FOCUSABLE_SELECTORS = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]',
].join(',');

/**
 * Check if an element is focusable.
 */
export function isFocusable(element: Element): boolean {
  if (!(element instanceof HTMLElement)) return false;

  // Check if matches focusable selector
  if (!element.matches(FOCUSABLE_SELECTORS)) return false;

  // Check visibility
  if (isHidden(element)) return false;

  // Check tabindex (negative tabindex is programmatically focusable but not tabbable)
  const tabIndex = element.getAttribute('tabindex');
  if (tabIndex !== null && parseInt(tabIndex, 10) < 0) {
    // Still focusable, just not tabbable
    return true;
  }

  return true;
}

/**
 * Check if an element is tabbable (in the tab order).
 */
export function isTabbable(element: Element): boolean {
  if (!isFocusable(element)) return false;

  const tabIndex = element.getAttribute('tabindex');
  if (tabIndex !== null && parseInt(tabIndex, 10) < 0) {
    return false;
  }

  return true;
}

/**
 * Check if an element is hidden.
 * Note: This function is designed to work in both browser and jsdom environments.
 * In jsdom, offsetParent/offsetWidth/offsetHeight are always 0, so we rely on
 * computed styles and attributes instead.
 */
function isHidden(element: HTMLElement): boolean {
  // Check aria-hidden first (works in both environments)
  if (element.getAttribute('aria-hidden') === 'true') return true;

  // Check computed styles
  const style = getComputedStyle(element);
  if (style.display === 'none') return true;
  if (style.visibility === 'hidden') return true;

  // Check if any ancestor is hidden
  let parent = element.parentElement;
  while (parent) {
    if (parent.getAttribute('aria-hidden') === 'true') return true;
    const parentStyle = getComputedStyle(parent);
    if (parentStyle.display === 'none') return true;
    if (parentStyle.visibility === 'hidden') return true;
    parent = parent.parentElement;
  }

  return false;
}

/**
 * Get all focusable elements within a container.
 *
 * @example
 * ```ts
 * const focusable = getFocusableElements(container);
 * const tabbable = getFocusableElements(container, 'tabbable');
 * ```
 */
export function getFocusableElements(
  container: Element,
  selector: FocusableSelector = 'all'
): HTMLElement[] {
  const elements = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));

  return elements.filter((element) => {
    if (isHidden(element)) return false;

    if (selector === 'tabbable') {
      return isTabbable(element);
    }

    return isFocusable(element);
  });
}

/**
 * Get all tabbable elements within a container, in tab order.
 */
export function getTabbableElements(container: Element): HTMLElement[] {
  const elements = getFocusableElements(container, 'tabbable');

  // Sort by tabindex
  return elements.sort((a, b) => {
    const aIndex = parseInt(a.getAttribute('tabindex') || '0', 10);
    const bIndex = parseInt(b.getAttribute('tabindex') || '0', 10);

    // Elements with tabindex > 0 come first, in order
    if (aIndex > 0 && bIndex > 0) return aIndex - bIndex;
    if (aIndex > 0) return -1;
    if (bIndex > 0) return 1;

    // Then elements with tabindex = 0 or no tabindex, in DOM order
    return 0;
  });
}

/**
 * Get the first focusable element within a container.
 */
export function getFirstFocusable(container: Element): HTMLElement | null {
  const elements = getFocusableElements(container, 'tabbable');
  return elements[0] || null;
}

/**
 * Get the last focusable element within a container.
 */
export function getLastFocusable(container: Element): HTMLElement | null {
  const elements = getFocusableElements(container, 'tabbable');
  return elements[elements.length - 1] || null;
}

/**
 * Simulate focus-visible state on an element.
 * This triggers the browser's focus-visible behavior as if the user
 * navigated with the keyboard.
 */
export function simulateFocusVisible(element: HTMLElement): void {
  // Simulate keyboard interaction to trigger focus-visible
  element.dispatchEvent(
    new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'Tab',
      code: 'Tab',
    })
  );

  element.focus();
}

/**
 * Wait for an element to receive focus.
 *
 * @example
 * ```ts
 * await user.click(openButton);
 * await waitForFocus(dialog);
 * ```
 */
export function waitForFocus(
  element: Element,
  options: { timeout?: number } = {}
): Promise<void> {
  const { timeout = 1000 } = options;

  return new Promise((resolve, reject) => {
    if (document.activeElement === element) {
      resolve();
      return;
    }

    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error(`Element did not receive focus within ${timeout}ms`));
    }, timeout);

    const handleFocus = (event: FocusEvent) => {
      if (event.target === element) {
        cleanup();
        resolve();
      }
    };

    const cleanup = () => {
      clearTimeout(timeoutId);
      element.removeEventListener('focus', handleFocus);
    };

    element.addEventListener('focus', handleFocus);
  });
}

/**
 * Wait for focus to move within a container.
 */
export function waitForFocusWithin(
  container: Element,
  options: { timeout?: number } = {}
): Promise<Element> {
  const { timeout = 1000 } = options;

  return new Promise((resolve, reject) => {
    if (isFocusWithin(container)) {
      resolve(document.activeElement!);
      return;
    }

    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error(`Focus did not move within container within ${timeout}ms`));
    }, timeout);

    const handleFocusIn = (event: FocusEvent) => {
      cleanup();
      resolve(event.target as Element);
    };

    const cleanup = () => {
      clearTimeout(timeoutId);
      container.removeEventListener('focusin', handleFocusIn);
    };

    container.addEventListener('focusin', handleFocusIn);
  });
}

/**
 * Assert that focus is on a specific element.
 */
export function assertFocused(element: Element, message?: string): void {
  if (!isFocused(element)) {
    const actual = document.activeElement;
    throw new Error(
      message ||
        `Expected element to be focused, but focus is on ${actual?.tagName || 'nothing'}`
    );
  }
}

/**
 * Assert that focus is within a container.
 */
export function assertFocusWithin(container: Element, message?: string): void {
  if (!isFocusWithin(container)) {
    const actual = document.activeElement;
    throw new Error(
      message ||
        `Expected focus to be within container, but focus is on ${actual?.tagName || 'nothing'}`
    );
  }
}

/**
 * Assert that focus is trapped within a container
 * (i.e., tabbing cycles through the container's focusable elements).
 */
export async function assertFocusTrap(
  container: Element,
  user: { tab: (options?: { shift?: boolean }) => Promise<void> }
): Promise<void> {
  const tabbable = getTabbableElements(container);
  if (tabbable.length === 0) {
    throw new Error('No tabbable elements found in container');
  }

  // Focus first element
  tabbable[0].focus();

  // Tab through all elements
  for (let i = 1; i < tabbable.length; i++) {
    await user.tab();
    if (document.activeElement !== tabbable[i]) {
      throw new Error(
        `Expected focus on element ${i}, but focus is on ${document.activeElement?.tagName}`
      );
    }
  }

  // Tab should wrap to first element
  await user.tab();
  if (document.activeElement !== tabbable[0]) {
    throw new Error('Focus did not wrap to first element');
  }

  // Shift+Tab should wrap to last element
  await user.tab({ shift: true });
  if (document.activeElement !== tabbable[tabbable.length - 1]) {
    throw new Error('Focus did not wrap to last element on Shift+Tab');
  }
}
