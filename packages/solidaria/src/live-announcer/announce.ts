/**
 * Live announcer for solidaria
 *
 * Provides functions to make announcements to screen readers using
 * ARIA live regions. Useful for announcing dynamic content changes.
 *
 * Port of react-aria's @react-aria/live-announcer.
 */

// ============================================
// TYPES
// ============================================

export type Assertiveness = 'assertive' | 'polite';

export type Message = string | { 'aria-labelledby': string };

// ============================================
// CONSTANTS
// ============================================

const LIVEREGION_TIMEOUT_DELAY = 7000;

// ============================================
// LIVE ANNOUNCER CLASS
// ============================================

/**
 * Singleton class that manages live region announcements.
 * Implemented using vanilla DOM for simplicity and framework independence.
 */
class LiveAnnouncer {
  node: HTMLElement | null = null;
  assertiveLog: HTMLElement | null = null;
  politeLog: HTMLElement | null = null;

  constructor() {
    if (typeof document !== 'undefined') {
      this.node = document.createElement('div');
      this.node.dataset.liveAnnouncer = 'true';
      // Visually hidden styles
      Object.assign(this.node.style, {
        border: '0',
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: '1px',
        margin: '-1px',
        overflow: 'hidden',
        padding: '0',
        position: 'absolute',
        width: '1px',
        whiteSpace: 'nowrap',
      });

      this.assertiveLog = this.createLog('assertive');
      this.node.appendChild(this.assertiveLog);

      this.politeLog = this.createLog('polite');
      this.node.appendChild(this.politeLog);

      document.body.prepend(this.node);
    }
  }

  isAttached(): boolean {
    return this.node?.isConnected ?? false;
  }

  createLog(ariaLive: string): HTMLElement {
    const node = document.createElement('div');
    node.setAttribute('role', 'log');
    node.setAttribute('aria-live', ariaLive);
    node.setAttribute('aria-relevant', 'additions');
    return node;
  }

  destroy(): void {
    if (!this.node) {
      return;
    }

    document.body.removeChild(this.node);
    this.node = null;
  }

  announce(
    message: Message,
    assertiveness: Assertiveness = 'assertive',
    timeout: number = LIVEREGION_TIMEOUT_DELAY
  ): void {
    if (!this.node) {
      return;
    }

    const node = document.createElement('div');
    if (typeof message === 'object') {
      // To read an aria-labelledby, the element must have an appropriate role, such as img.
      node.setAttribute('role', 'img');
      node.setAttribute('aria-labelledby', message['aria-labelledby']);
    } else {
      node.textContent = message;
    }

    if (assertiveness === 'assertive') {
      this.assertiveLog?.appendChild(node);
    } else {
      this.politeLog?.appendChild(node);
    }

    if (message !== '') {
      setTimeout(() => {
        node.remove();
      }, timeout);
    }
  }

  clear(assertiveness?: Assertiveness): void {
    if (!this.node) {
      return;
    }

    if ((!assertiveness || assertiveness === 'assertive') && this.assertiveLog) {
      this.assertiveLog.innerHTML = '';
    }

    if ((!assertiveness || assertiveness === 'polite') && this.politeLog) {
      this.politeLog.innerHTML = '';
    }
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

let liveAnnouncer: LiveAnnouncer | null = null;

// ============================================
// PUBLIC API
// ============================================

/**
 * Announces a message to screen readers using ARIA live regions.
 *
 * @param message - The message to announce, or an object with aria-labelledby
 * @param assertiveness - 'assertive' interrupts, 'polite' waits for a pause
 * @param timeout - How long to keep the message in the DOM (default 7000ms)
 *
 * @example
 * ```tsx
 * // Simple announcement
 * announce('Item added to cart');
 *
 * // Polite announcement (won't interrupt)
 * announce('3 results found', 'polite');
 *
 * // Using aria-labelledby for complex content
 * announce({ 'aria-labelledby': 'my-element-id' });
 * ```
 */
export function announce(
  message: Message,
  assertiveness: Assertiveness = 'assertive',
  timeout: number = LIVEREGION_TIMEOUT_DELAY
): void {
  if (!liveAnnouncer) {
    liveAnnouncer = new LiveAnnouncer();
    // Wait for the live announcer regions to be added to the DOM, then announce.
    // Otherwise Safari won't announce the message if it's added too quickly.
    // Found most times less than 100ms were not consistent when announcing with Safari.

    // Check for test environment
    const isTestEnv = typeof (globalThis as Record<string, unknown>).IS_SOLIDARIA_TEST === 'boolean'
      ? (globalThis as Record<string, unknown>).IS_SOLIDARIA_TEST
      : typeof (globalThis as Record<string, unknown>).vitest !== 'undefined';

    if (!isTestEnv) {
      setTimeout(() => {
        if (liveAnnouncer?.isAttached()) {
          liveAnnouncer?.announce(message, assertiveness, timeout);
        }
      }, 100);
    } else {
      liveAnnouncer.announce(message, assertiveness, timeout);
    }
  } else {
    liveAnnouncer.announce(message, assertiveness, timeout);
  }
}

/**
 * Clears all queued announcements for the given assertiveness level.
 *
 * @param assertiveness - Which log to clear ('assertive' or 'polite')
 *
 * @example
 * ```tsx
 * // Clear assertive announcements
 * clearAnnouncer('assertive');
 *
 * // Clear polite announcements
 * clearAnnouncer('polite');
 * ```
 */
export function clearAnnouncer(assertiveness?: Assertiveness): void {
  if (liveAnnouncer) {
    liveAnnouncer.clear(assertiveness);
  }
}

/**
 * Removes the live announcer from the DOM entirely.
 * Call this when unmounting your app or when announcements are no longer needed.
 *
 * @example
 * ```tsx
 * // Clean up on app unmount
 * onCleanup(() => {
 *   destroyAnnouncer();
 * });
 * ```
 */
export function destroyAnnouncer(): void {
  if (liveAnnouncer) {
    liveAnnouncer.destroy();
    liveAnnouncer = null;
  }
}
