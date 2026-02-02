/**
 * SearchAutocomplete component for proyecto-viviana-ui
 *
 * A styled autocomplete component combining a search input with a
 * filterable dropdown list of options.
 */

import { type JSX, splitProps, createMemo, Show, For, createSignal } from 'solid-js'
import {
  Autocomplete,
  useAutocompleteInput,
  useAutocompleteCollection,
  useAutocompleteState,
} from '@proyecto-viviana/solidaria-components'

// ============================================
// TYPES
// ============================================

export type SearchAutocompleteSize = 'sm' | 'md' | 'lg'

export interface SearchAutocompleteItem {
  id: string
  name: string
  [key: string]: unknown
}

export interface SearchAutocompleteProps<T extends SearchAutocompleteItem = SearchAutocompleteItem> {
  /** The items to display in the dropdown. */
  items: T[]
  /** The size of the autocomplete. @default 'md' */
  size?: SearchAutocompleteSize
  /** Placeholder text for the input. */
  placeholder?: string
  /** Accessible label for the input. */
  'aria-label'?: string
  /** Label text shown above the input. */
  label?: string
  /** Description text shown below the input. */
  description?: string
  /** The current input value (controlled). */
  inputValue?: string
  /** The default input value (uncontrolled). */
  defaultInputValue?: string
  /** Handler called when the input value changes. */
  onInputChange?: (value: string) => void
  /** Handler called when an item is selected. */
  onSelect?: (item: T) => void
  /** Additional CSS class name. */
  class?: string
  /** Whether the input is disabled. */
  isDisabled?: boolean
  /**
   * Custom filter function. By default, filters by case-insensitive name match.
   */
  filter?: (textValue: string, inputValue: string) => boolean
  /**
   * Custom render function for items.
   */
  renderItem?: (item: T) => JSX.Element
  /**
   * Key to use for the display text. @default 'name'
   */
  textKey?: keyof T
}

// ============================================
// STYLES
// ============================================

const sizeStyles = {
  sm: {
    container: 'text-sm',
    input: 'h-8 px-3 text-sm',
    label: 'text-xs mb-1',
    list: 'max-h-48',
    item: 'px-3 py-1.5 text-sm',
  },
  md: {
    container: 'text-base',
    input: 'h-10 px-4 text-base',
    label: 'text-sm mb-1.5',
    list: 'max-h-64',
    item: 'px-4 py-2 text-base',
  },
  lg: {
    container: 'text-lg',
    input: 'h-12 px-5 text-lg',
    label: 'text-base mb-2',
    list: 'max-h-80',
    item: 'px-5 py-2.5 text-lg',
  },
}

// ============================================
// INNER COMPONENTS
// ============================================

function AutocompleteInput(props: {
  placeholder?: string
  'aria-label'?: string
  isDisabled?: boolean
  size: SearchAutocompleteSize
}) {
  const ctx = useAutocompleteInput()
  if (!ctx) return null

  const styles = () => sizeStyles[props.size]

  return (
    <input
      ref={ctx.inputRef}
      type="text"
      placeholder={props.placeholder}
      aria-label={props['aria-label']}
      disabled={props.isDisabled}
      value={ctx.inputProps.value()}
      onInput={(e) => ctx.inputProps.onChange(e.currentTarget.value)}
      onKeyDown={ctx.inputProps.onKeyDown}
      onFocus={ctx.inputProps.onFocus}
      onBlur={ctx.inputProps.onBlur}
      aria-activedescendant={ctx.inputProps['aria-activedescendant']()}
      aria-controls={ctx.inputProps['aria-controls']}
      aria-autocomplete={ctx.inputProps['aria-autocomplete']}
      autocomplete={ctx.inputProps.autoComplete}
      autocorrect={ctx.inputProps.autoCorrect}
      spellcheck={ctx.inputProps.spellCheck !== 'false'}
      class={[
        'w-full rounded-md border border-bg-200 bg-bg-50',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
        'placeholder:text-text-400',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        styles().input,
      ].join(' ')}
    />
  )
}

function AutocompleteList<T extends SearchAutocompleteItem>(props: {
  items: T[]
  size: SearchAutocompleteSize
  onSelect?: (item: T) => void
  renderItem?: (item: T) => JSX.Element
  textKey: keyof T
}) {
  const ctx = useAutocompleteCollection()
  const state = useAutocompleteState()
  if (!ctx) return null

  const styles = () => sizeStyles[props.size]

  // Filter items based on input
  const filteredItems = createMemo(() => {
    if (!ctx.filter) return props.items
    return props.items.filter((item) => {
      const textValue = String(item[props.textKey] ?? item.name ?? '')
      return ctx.filter!(textValue)
    })
  })

  const handleSelect = (item: T) => {
    props.onSelect?.(item)
    state?.setInputValue(String(item[props.textKey] ?? item.name ?? ''))
  }

  return (
    <Show when={filteredItems().length > 0}>
      <ul
        ref={ctx.collectionRef}
        id={ctx.collectionProps.id}
        role="listbox"
        aria-label={ctx.collectionProps['aria-label']}
        class={[
          'mt-1 w-full rounded-md border border-bg-200 bg-bg-50 shadow-lg',
          'overflow-auto',
          styles().list,
        ].join(' ')}
      >
        <For each={filteredItems()}>
          {(item) => {
            const itemId = `autocomplete-item-${item.id}`
            const isFocused = () => state?.focusedNodeId() === itemId

            return (
              <li
                id={itemId}
                role="option"
                aria-selected={isFocused()}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => state?.setFocusedNodeId(itemId)}
                onMouseLeave={() => {
                  if (state?.focusedNodeId() === itemId) {
                    state?.setFocusedNodeId(null)
                  }
                }}
                class={[
                  'cursor-pointer transition-colors',
                  isFocused()
                    ? 'bg-primary-100 text-primary-900'
                    : 'hover:bg-bg-100',
                  styles().item,
                ].join(' ')}
              >
                {props.renderItem ? props.renderItem(item) : String(item[props.textKey] ?? item.name)}
              </li>
            )
          }}
        </For>
      </ul>
    </Show>
  )
}

// ============================================
// SEARCH AUTOCOMPLETE COMPONENT
// ============================================

/**
 * A styled autocomplete component for searching and selecting from a list.
 *
 * @example
 * ```tsx
 * const items = [
 *   { id: '1', name: 'Apple' },
 *   { id: '2', name: 'Banana' },
 *   { id: '3', name: 'Cherry' },
 * ];
 *
 * <SearchAutocomplete
 *   items={items}
 *   placeholder="Search fruits..."
 *   aria-label="Fruit search"
 *   onSelect={(item) => console.log('Selected:', item)}
 * />
 *
 * // With custom filter
 * <SearchAutocomplete
 *   items={items}
 *   filter={(textValue, inputValue) =>
 *     textValue.toLowerCase().startsWith(inputValue.toLowerCase())
 *   }
 *   onSelect={(item) => console.log('Selected:', item)}
 * />
 *
 * // With label and description
 * <SearchAutocomplete
 *   items={items}
 *   label="Search"
 *   description="Type to filter the list"
 *   placeholder="Start typing..."
 * />
 * ```
 */
export function SearchAutocomplete<T extends SearchAutocompleteItem = SearchAutocompleteItem>(
  props: SearchAutocompleteProps<T>
): JSX.Element {
  const [local, autocompleteProps] = splitProps(props, [
    'items',
    'size',
    'placeholder',
    'aria-label',
    'label',
    'description',
    'onSelect',
    'class',
    'isDisabled',
    'renderItem',
    'textKey',
  ])

  const size = () => local.size ?? 'md'
  const textKey = () => local.textKey ?? 'name'
  const styles = () => sizeStyles[size()]

  // Default filter: case-insensitive contains
  const defaultFilter = (textValue: string, inputValue: string) => {
    if (!inputValue) return true
    return textValue.toLowerCase().includes(inputValue.toLowerCase())
  }

  return (
    <div class={['vui-search-autocomplete relative', styles().container, local.class].filter(Boolean).join(' ')}>
      <Show when={local.label}>
        <label class={['block font-medium text-text-700', styles().label].join(' ')}>
          {local.label}
        </label>
      </Show>

      <Autocomplete
        {...autocompleteProps}
        filter={autocompleteProps.filter ?? defaultFilter}
      >
        <AutocompleteInput
          placeholder={local.placeholder}
          aria-label={local['aria-label']}
          isDisabled={local.isDisabled}
          size={size()}
        />
        <AutocompleteList
          items={local.items}
          size={size()}
          onSelect={local.onSelect}
          renderItem={local.renderItem}
          textKey={textKey() as keyof T}
        />
      </Autocomplete>

      <Show when={local.description}>
        <p class="mt-1 text-sm text-text-500">{local.description}</p>
      </Show>
    </div>
  )
}
