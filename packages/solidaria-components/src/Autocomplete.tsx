/**
 * Autocomplete component for solidaria-components
 *
 * Provides autocomplete functionality by wrapping a text input
 * with a filterable collection (ListBox/Menu).
 *
 * Port of react-aria-components/src/Autocomplete.tsx
 */

import {
  type JSX,
  type ParentProps,
  createContext,
  useContext,
  createMemo,
  splitProps,
  createSignal,
} from 'solid-js'
import {
  createAutocomplete,
  type AriaAutocompleteOptions,
  type AutocompleteInputProps,
  type CollectionOptions,
} from '@proyecto-viviana/solidaria'
import {
  createAutocompleteState,
  type AutocompleteState,
  type AutocompleteStateOptions,
} from '@proyecto-viviana/solid-stately'
import { type SlotProps } from './utils'

// ============================================
// TYPES
// ============================================

export interface AutocompleteProps<T = unknown>
  extends Omit<AutocompleteStateOptions, 'children'>,
    Omit<AriaAutocompleteOptions<T>, 'inputRef' | 'collectionRef'>,
    ParentProps,
    SlotProps {}

// ============================================
// CONTEXTS
// ============================================

export interface AutocompleteContextValue {
  inputProps: AutocompleteInputProps
  inputRef: (el: HTMLInputElement) => void
}

export interface AutocompleteCollectionContextValue {
  collectionProps: CollectionOptions
  collectionRef: (el: HTMLElement) => void
  filter?: (textValue: string) => boolean
}

export const AutocompleteContext = createContext<AutocompleteContextValue | null>(null)
export const AutocompleteStateContext = createContext<AutocompleteState | null>(null)
export const AutocompleteCollectionContext = createContext<AutocompleteCollectionContextValue | null>(null)

/**
 * Hook to consume autocomplete input context.
 * Use this in your input component (TextField/SearchField) to get the autocomplete props.
 */
export function useAutocompleteInput() {
  return useContext(AutocompleteContext)
}

/**
 * Hook to consume autocomplete state context.
 */
export function useAutocompleteState() {
  return useContext(AutocompleteStateContext)
}

/**
 * Hook to consume autocomplete collection context.
 * Use this in your collection component (ListBox/Menu) to get the autocomplete props.
 */
export function useAutocompleteCollection() {
  return useContext(AutocompleteCollectionContext)
}

// ============================================
// AUTOCOMPLETE COMPONENT
// ============================================

/**
 * An autocomplete allows users to search or filter a list of suggestions.
 * It wraps a text input and a collection component (ListBox or Menu),
 * providing keyboard navigation and filtering capabilities.
 *
 * @example
 * ```tsx
 * // Basic usage with SearchField and ListBox
 * <Autocomplete
 *   filter={(textValue, inputValue) =>
 *     textValue.toLowerCase().includes(inputValue.toLowerCase())
 *   }
 * >
 *   <SearchField aria-label="Search">
 *     <Input />
 *   </SearchField>
 *   <ListBox aria-label="Suggestions">
 *     <ListBoxItem>Option 1</ListBoxItem>
 *     <ListBoxItem>Option 2</ListBoxItem>
 *     <ListBoxItem>Option 3</ListBoxItem>
 *   </ListBox>
 * </Autocomplete>
 *
 * // Controlled input value
 * const [value, setValue] = createSignal('');
 * <Autocomplete
 *   inputValue={value()}
 *   onInputChange={setValue}
 *   filter={(textValue, inputValue) =>
 *     textValue.toLowerCase().includes(inputValue.toLowerCase())
 *   }
 * >
 *   {/* ... *\/}
 * </Autocomplete>
 * ```
 */
export function Autocomplete<T = unknown>(props: AutocompleteProps<T>): JSX.Element {
  const [stateProps, ariaProps, local] = splitProps(
    props,
    ['inputValue', 'defaultInputValue', 'onInputChange'],
    ['filter', 'disableAutoFocusFirst', 'disableVirtualFocus']
  )

  // Create state
  const state = createAutocompleteState(stateProps)

  // Create refs
  let inputRef: HTMLInputElement | undefined
  let collectionRef: HTMLElement | undefined

  // Create autocomplete aria
  const autocomplete = createAutocomplete<T>(
    {
      ...ariaProps,
      inputRef: () => inputRef,
      collectionRef: () => collectionRef,
    },
    state
  )

  // Input context value
  const inputContextValue = createMemo<AutocompleteContextValue>(() => ({
    inputProps: autocomplete.inputProps,
    inputRef: (el: HTMLInputElement) => {
      inputRef = el
    },
  }))

  // Collection context value
  const collectionContextValue = createMemo<AutocompleteCollectionContextValue>(() => ({
    collectionProps: autocomplete.collectionProps,
    collectionRef: (el: HTMLElement) => {
      collectionRef = el
    },
    filter: autocomplete.filter,
  }))

  return (
    <AutocompleteStateContext.Provider value={state}>
      <AutocompleteContext.Provider value={inputContextValue()}>
        <AutocompleteCollectionContext.Provider value={collectionContextValue()}>
          {props.children}
        </AutocompleteCollectionContext.Provider>
      </AutocompleteContext.Provider>
    </AutocompleteStateContext.Provider>
  )
}
