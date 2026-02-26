/**
 * createAutocompleteState - State management for autocomplete components
 *
 * Based on @react-stately/autocomplete useAutocompleteState.
 */

import { createSignal, type Accessor } from 'solid-js'
import { access, type MaybeAccessor } from '../utils'

// ============================================
// TYPES
// ============================================

export interface AutocompleteState {
  /** The current value of the autocomplete input. */
  inputValue: Accessor<string>
  /** Sets the value of the autocomplete input. */
  setInputValue(value: string): void
  /** The id of the current aria-activedescendant of the autocomplete input. */
  focusedNodeId: Accessor<string | null>
  /** Sets the id of the current aria-activedescendant of the autocomplete input. */
  setFocusedNodeId(value: string | null): void
}

export interface AutocompleteStateOptions {
  /** The value of the autocomplete input (controlled). */
  inputValue?: string
  /** The default value of the autocomplete input (uncontrolled). */
  defaultInputValue?: string
  /** Handler that is called when the autocomplete input value changes. */
  onInputChange?: (value: string) => void
}

// ============================================
// CREATE AUTOCOMPLETE STATE
// ============================================

/**
 * Provides state management for an autocomplete component.
 *
 * @example
 * ```tsx
 * const state = createAutocompleteState({
 *   defaultInputValue: '',
 *   onInputChange: (value) => console.log('Input changed:', value),
 * });
 *
 * // Access current input value
 * console.log(state.inputValue());
 *
 * // Update input value
 * state.setInputValue('new value');
 *
 * // Track focused node for aria-activedescendant
 * state.setFocusedNodeId('item-1');
 * ```
 */
export function createAutocompleteState(
  props: MaybeAccessor<AutocompleteStateOptions> = {}
): AutocompleteState {
  const getProps = () => access(props)

  // Track focused node ID for aria-activedescendant
  const [focusedNodeId, setFocusedNodeId] = createSignal<string | null>(null)

  // Handle controlled vs uncontrolled input value
  const isControlled = () => getProps().inputValue !== undefined
  const [uncontrolledValue, setUncontrolledValue] = createSignal(getProps().defaultInputValue ?? '')

  const inputValue: Accessor<string> = () => {
    const p = getProps()
    return isControlled() ? (p.inputValue ?? '') : uncontrolledValue()
  }

  const setInputValue = (value: string) => {
    const p = getProps()
    if (!isControlled()) {
      setUncontrolledValue(value)
    }
    p.onInputChange?.(value)
  }

  return {
    inputValue,
    setInputValue,
    focusedNodeId,
    setFocusedNodeId,
  }
}
