/**
 * createAutocompleteState - State management for autocomplete components
 *
 * Based on @react-stately/autocomplete useAutocompleteState.
 */
import { type Accessor } from 'solid-js';
export interface AutocompleteState {
    /** The current value of the autocomplete input. */
    inputValue: Accessor<string>;
    /** Sets the value of the autocomplete input. */
    setInputValue(value: string): void;
    /** The id of the current aria-activedescendant of the autocomplete input. */
    focusedNodeId: Accessor<string | null>;
    /** Sets the id of the current aria-activedescendant of the autocomplete input. */
    setFocusedNodeId(value: string | null): void;
}
export interface AutocompleteStateOptions {
    /** The value of the autocomplete input (controlled). */
    inputValue?: string;
    /** The default value of the autocomplete input (uncontrolled). */
    defaultInputValue?: string;
    /** Handler that is called when the autocomplete input value changes. */
    onInputChange?: (value: string) => void;
}
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
export declare function createAutocompleteState(props?: AutocompleteStateOptions): AutocompleteState;
//# sourceMappingURL=createAutocompleteState.d.ts.map