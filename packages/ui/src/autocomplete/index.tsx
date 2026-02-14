/**
 * SearchAutocomplete component for proyecto-viviana-ui
 *
 * Styled autocomplete built on top of headless-backed ComboBox.
 * UI layer owns styling only; behavior lives in solidaria layers.
 */

import { type JSX, Show, splitProps } from 'solid-js'
import {
  ComboBox,
  ComboBoxInput,
  ComboBoxButton,
  ComboBoxListBox,
  ComboBoxOption,
  type FilterFn,
  type Key,
} from '../combobox'

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
  /** Custom filter function. */
  filter?: FilterFn
  /** Custom render function for items. */
  renderItem?: (item: T) => JSX.Element
  /** Key to use for the display text. @default 'name' */
  textKey?: keyof T
}

// ============================================
// STYLES
// ============================================

const sizeStyles = {
  sm: {
    container: 'text-sm',
    label: 'text-xs mb-1',
  },
  md: {
    container: 'text-base',
    label: 'text-sm mb-1.5',
  },
  lg: {
    container: 'text-lg',
    label: 'text-base mb-2',
  },
}

// ============================================
// SEARCH AUTOCOMPLETE COMPONENT
// ============================================

/**
 * A styled autocomplete component for searching and selecting from a list.
 */
export function SearchAutocomplete<T extends SearchAutocompleteItem = SearchAutocompleteItem>(
  props: SearchAutocompleteProps<T>
): JSX.Element {
  const [local, comboBoxProps] = splitProps(props, [
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
  const textKey = () => (local.textKey ?? 'name') as keyof T
  const styles = () => sizeStyles[size()]

  const getTextValue = (item: T): string => {
    const text = item[textKey()] ?? item.name
    return String(text ?? '')
  }

  const handleSelectionChange = (key: Key | null) => {
    if (key == null) return
    const selected = local.items.find((item) => String(item.id) === String(key))
    if (selected) {
      local.onSelect?.(selected)
    }
  }

  return (
    <div class={['vui-search-autocomplete relative', styles().container, local.class].filter(Boolean).join(' ')}>
      <Show when={local.label}>
        <label class={['block font-medium text-text-700', styles().label].join(' ')}>
          {local.label}
        </label>
      </Show>

      <ComboBox<T>
        {...comboBoxProps}
        items={local.items}
        size={size()}
        aria-label={local['aria-label']}
        placeholder={local.placeholder}
        isDisabled={local.isDisabled}
        defaultFilter={comboBoxProps.filter}
        getKey={(item) => item.id}
        getTextValue={getTextValue}
        onSelectionChange={handleSelectionChange}
      >
        <ComboBox.InputGroup>
          <ComboBoxInput />
          <ComboBoxButton />
        </ComboBox.InputGroup>
        <ComboBoxListBox>
          {(item: T) => (
            <ComboBoxOption id={item.id}>
              {local.renderItem ? local.renderItem(item) : getTextValue(item)}
            </ComboBoxOption>
          )}
        </ComboBoxListBox>
      </ComboBox>

      <Show when={local.description}>
        <p class="mt-1 text-sm text-text-500">{local.description}</p>
      </Show>
    </div>
  )
}
