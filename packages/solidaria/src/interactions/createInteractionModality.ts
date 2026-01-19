/**
 * createInteractionModality for solidaria
 *
 * Tracks the current interaction modality (keyboard, pointer, or virtual).
 * Used to determine when to show focus rings and manage focus behavior.
 *
 * Port of @react-aria/interactions useInteractionModality.
 *
 * SSR Safety: All functions are safe to call during SSR. Event listeners
 * are only added when running in the browser.
 */

import { type Accessor, createSignal, createEffect, onCleanup } from 'solid-js';
import { isServer } from 'solid-js/web';

// ============================================
// TYPES
// ============================================

/** The current interaction modality. */
export type Modality = 'keyboard' | 'pointer' | 'virtual';

export interface InteractionModalityResult {
  /** The current interaction modality. */
  modality: Accessor<Modality | null>;
}

// ============================================
// GLOBAL STATE
// ============================================

let currentModality: Modality | null = null;
let hasSetupGlobalListeners = false;
const changeHandlers = new Set<(modality: Modality) => void>();

/**
 * Gets the current interaction modality.
 */
export function getInteractionModality(): Modality | null {
  return currentModality;
}

/**
 * Sets the current interaction modality.
 * Useful for programmatically triggering focus ring visibility.
 */
export function setInteractionModality(modality: Modality): void {
  currentModality = modality;
  triggerChangeHandlers(modality);
}

function triggerChangeHandlers(modality: Modality) {
  for (const handler of changeHandlers) {
    handler(modality);
  }
}

function handleKeyboardEvent(e: KeyboardEvent) {
  // Ignore modifier keys
  if (
    e.metaKey ||
    e.altKey ||
    e.ctrlKey ||
    e.key === 'Control' ||
    e.key === 'Shift' ||
    e.key === 'Meta'
  ) {
    return;
  }
  currentModality = 'keyboard';
  triggerChangeHandlers('keyboard');
}

function handlePointerEvent(e: PointerEvent | MouseEvent) {
  currentModality = 'pointer';
  if (e.type === 'mousedown' || e.type === 'pointerdown') {
    triggerChangeHandlers('pointer');
  }
}

/**
 * Sets up global event listeners to track interaction modality.
 * Called automatically when using the modality hooks.
 */
export function setupGlobalFocusListeners(): void {
  if (typeof document === 'undefined' || hasSetupGlobalListeners) {
    return;
  }

  hasSetupGlobalListeners = true;

  // Track keyboard vs pointer modality
  document.addEventListener('keydown', handleKeyboardEvent, true);
  document.addEventListener('keyup', handleKeyboardEvent, true);
  document.addEventListener('mousedown', handlePointerEvent, true);
  document.addEventListener('pointerdown', handlePointerEvent, true);
}

/**
 * Adds a listener for modality changes.
 * Returns a cleanup function to remove the listener.
 */
export function addModalityListener(
  handler: (modality: Modality) => void
): () => void {
  changeHandlers.add(handler);
  return () => {
    changeHandlers.delete(handler);
  };
}

// ============================================
// HOOK
// ============================================

/**
 * Tracks the current interaction modality.
 *
 * SSR Safety: Returns a signal that always returns null during SSR.
 * Event listeners are only set up on the client.
 *
 * @example
 * ```tsx
 * function FocusIndicator() {
 *   const { modality } = createInteractionModality();
 *
 *   return (
 *     <div class={modality() === 'keyboard' ? 'show-focus-ring' : ''}>
 *       Content
 *     </div>
 *   );
 * }
 * ```
 */
export function createInteractionModality(): InteractionModalityResult {
  // During SSR, return a signal that always returns null
  if (isServer) {
    return {
      modality: () => null,
    };
  }

  const [modality, setModality] = createSignal<Modality | null>(currentModality);

  createEffect(() => {
    setupGlobalFocusListeners();

    const handler = (newModality: Modality) => {
      setModality(newModality);
    };

    changeHandlers.add(handler);
    onCleanup(() => {
      changeHandlers.delete(handler);
    });
  });

  return {
    modality,
  };
}

/**
 * Hook to track whether the user is currently interacting with the keyboard.
 *
 * SSR Safety: Returns false during SSR.
 *
 * @example
 * ```tsx
 * function FocusRing(props) {
 *   const isKeyboardFocused = useIsKeyboardFocused();
 *
 *   return (
 *     <div
 *       class={isKeyboardFocused() && props.isFocused ? 'focus-ring' : ''}
 *     >
 *       {props.children}
 *     </div>
 *   );
 * }
 * ```
 */
export function useIsKeyboardFocused(): Accessor<boolean> {
  if (isServer) {
    return () => false;
  }

  const { modality } = createInteractionModality();
  return () => modality() === 'keyboard';
}
