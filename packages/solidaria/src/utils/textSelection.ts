/**
 * Text selection management utilities.
 * Based on @react-aria/interactions textSelection utilities.
 *
 * On iOS, long press triggers text selection. The only way to prevent this
 * is to set user-select: none on the entire page. On other platforms,
 * we can just set it on the target element.
 */

import { isIOS } from "./platform";
import { getOwnerDocument } from "./dom";

type State = "default" | "disabled" | "restoring";

// Global state to manage text selection across multiple press interactions
let state: State = "default";
let savedUserSelect = "";
let modifiedElementMap = new WeakMap<HTMLElement, string>();

/**
 * Disables text selection on the page or element during press.
 * On iOS, applies to the entire document. On other platforms, just the target.
 */
export function disableTextSelection(target?: HTMLElement): void {
  if (isIOS()) {
    // iOS requires disabling selection on the entire page
    if (state === "default") {
      const documentElement = getOwnerDocument(target).documentElement;
      savedUserSelect = documentElement.style.webkitUserSelect;
      documentElement.style.webkitUserSelect = "none";
    }
    state = "disabled";
  } else if (target) {
    // On other platforms, just disable on the target
    const element = target as HTMLElement;
    if (!modifiedElementMap.has(element)) {
      modifiedElementMap.set(element, element.style.userSelect);
      element.style.userSelect = "none";
    }
  }
}

/**
 * Restores text selection after press ends.
 * On iOS, waits 300ms to avoid selection appearing during tap.
 */
export function restoreTextSelection(target?: HTMLElement): void {
  if (isIOS()) {
    // Don't restore if another press is active
    if (state !== "disabled") {
      return;
    }

    state = "restoring";

    // Wait for iOS to finish any pending selection actions
    // 300ms is the iOS long-press delay
    setTimeout(() => {
      // Use runAfterTransition to avoid CSS recomputation during animation
      runAfterTransition(() => {
        // Only restore if still in 'restoring' state (no new press started)
        if (state === "restoring") {
          const documentElement = getOwnerDocument(target).documentElement;
          if (savedUserSelect) {
            documentElement.style.webkitUserSelect = savedUserSelect;
          } else {
            documentElement.style.removeProperty("-webkit-user-select");
          }
          savedUserSelect = "";
          state = "default";
        }
      });
    }, 300);
  } else if (target) {
    // On other platforms, restore immediately
    const element = target as HTMLElement;
    const savedValue = modifiedElementMap.get(element);
    if (savedValue !== undefined) {
      if (savedValue) {
        element.style.userSelect = savedValue;
      } else {
        element.style.removeProperty("user-select");
      }
      modifiedElementMap.delete(element);
    }
  }
}

// Tracks pending transitions for runAfterTransition
const pendingTransitions = new Set<() => void>();
let transitionTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Runs a callback after CSS transitions complete.
 * Batches multiple callbacks to avoid unnecessary layout thrashing.
 */
function runAfterTransition(callback: () => void): void {
  // If we haven't started tracking transitions, run immediately
  pendingTransitions.add(callback);

  // Debounce - wait for any transitions to settle
  if (transitionTimeout != null) {
    clearTimeout(transitionTimeout);
  }

  transitionTimeout = setTimeout(() => {
    // Run all pending callbacks
    for (const cb of pendingTransitions) {
      cb();
    }
    pendingTransitions.clear();
    transitionTimeout = null;
  }, 0);
}
