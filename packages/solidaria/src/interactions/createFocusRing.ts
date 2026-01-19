/**
 * createFocusRing hook for Solidaria
 *
 * Determines whether a focus ring should be visible for a given element.
 * Focus rings are visible when the user navigates with keyboard, but hidden
 * when using mouse/touch.
 *
 * Port of @react-aria/focus useFocusRing.
 */

import { type JSX, type Accessor, createSignal, createEffect, onCleanup } from 'solid-js';
import { createFocus } from './createFocus';
import {
  type Modality,
  getInteractionModality,
  setupGlobalFocusListeners,
  addModalityListener,
} from './createInteractionModality';

// ============================================
// TYPES
// ============================================

export interface FocusRingProps {
  /** Whether the element is a text input. */
  isTextInput?: boolean;
  /** Whether the element will be auto focused. */
  autoFocus?: boolean;
  /** Whether focus should be tracked within the element. */
  within?: boolean;
}

export interface FocusRingResult {
  /** Whether the element is currently focused. */
  isFocused: Accessor<boolean>;
  /** Whether the focus ring should be visible. */
  isFocusVisible: Accessor<boolean>;
  /** Props to spread on the element to track focus. */
  focusProps: JSX.HTMLAttributes<HTMLElement>;
}

// ============================================
// IMPLEMENTATION
// ============================================

/**
 * Determines whether a focus ring should be visible for a given element.
 *
 * Focus rings are visible when:
 * - The element is focused AND
 * - The user is navigating with keyboard (not mouse/touch)
 *
 * For text inputs, focus rings are always visible when focused.
 */
export function createFocusRing(props: FocusRingProps = {}): FocusRingResult {
  const { isTextInput = false, autoFocus = false } = props;

  const [isFocused, setIsFocused] = createSignal(false);
  const [isFocusVisible, setIsFocusVisible] = createSignal(autoFocus);
  const [modality, setModality] = createSignal<Modality | null>(getInteractionModality());

  // Setup global listeners
  createEffect(() => {
    setupGlobalFocusListeners();

    const cleanup = addModalityListener((newModality: Modality) => {
      setModality(newModality);
    });

    onCleanup(cleanup);
  });

  // Update focus visible based on modality and focus state
  createEffect(() => {
    const focused = isFocused();
    const mod = modality();

    if (focused) {
      // Text inputs always show focus ring when focused
      // Otherwise, only show if last interaction was keyboard
      setIsFocusVisible(isTextInput || mod === 'keyboard');
    } else {
      setIsFocusVisible(false);
    }
  });

  // Use createFocus to track focus state
  const focusResult = createFocus({
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  });

  return {
    isFocused,
    isFocusVisible,
    focusProps: focusResult.focusProps as JSX.HTMLAttributes<HTMLElement>,
  };
}
