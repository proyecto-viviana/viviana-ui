/**
 * State management for select components.
 * Based on @react-stately/select useSelectState.
 */

import { createSignal, type Accessor } from 'solid-js';
import { access, type MaybeAccessor } from '../utils';
import { createListState } from '../collections/createListState';
import { createOverlayTriggerState } from '../overlays';
import type { Key, CollectionNode, Collection } from '../collections/types';

export interface SelectStateProps<T = unknown> {
  /** The items to display in the select. */
  items: T[];
  /** Function to get the key for an item. */
  getKey?: (item: T) => Key;
  /** Function to get the text value for an item. */
  getTextValue?: (item: T) => string;
  /** Function to check if an item is disabled. */
  getDisabled?: (item: T) => boolean;
  /** Keys of disabled items. */
  disabledKeys?: Iterable<Key>;
  /** The currently selected key (controlled). */
  selectedKey?: Key | null;
  /** The default selected key (uncontrolled). */
  defaultSelectedKey?: Key | null;
  /** Handler called when the selection changes. */
  onSelectionChange?: (key: Key | null) => void;
  /** Whether the select is open (controlled). */
  isOpen?: boolean;
  /** Whether the select is open by default (uncontrolled). */
  defaultOpen?: boolean;
  /** Handler called when the open state changes. */
  onOpenChange?: (isOpen: boolean) => void;
  /** Whether the select is disabled. */
  isDisabled?: boolean;
  /** Whether the select is required. */
  isRequired?: boolean;
}

export interface SelectState<T = unknown> {
  /** The collection of items. */
  readonly collection: Accessor<Collection<T>>;
  /** Whether the select dropdown is open. */
  readonly isOpen: Accessor<boolean>;
  /** Open the select dropdown. */
  open(): void;
  /** Close the select dropdown. */
  close(): void;
  /** Toggle the select dropdown. */
  toggle(): void;
  /** The currently selected key. */
  readonly selectedKey: Accessor<Key | null>;
  /** The currently selected item. */
  readonly selectedItem: Accessor<CollectionNode<T> | null>;
  /** Set the selected key. */
  setSelectedKey(key: Key | null): void;
  /** The currently focused key. */
  readonly focusedKey: Accessor<Key | null>;
  /** Set the focused key. */
  setFocusedKey(key: Key | null): void;
  /** Whether the select has focus. */
  readonly isFocused: Accessor<boolean>;
  /** Set whether the select has focus. */
  setFocused(isFocused: boolean): void;
  /** Whether a specific key is disabled. */
  isKeyDisabled(key: Key): boolean;
  /** Whether the select is disabled. */
  readonly isDisabled: boolean;
  /** Whether the select is required. */
  readonly isRequired: boolean;
}

/**
 * Creates state for a select component.
 * Combines list state with overlay trigger state for dropdown behavior.
 */
export function createSelectState<T = unknown>(
  props: MaybeAccessor<SelectStateProps<T>>
): SelectState<T> {
  const getProps = () => access(props);

  // Overlay trigger state for open/close
  const overlayState = createOverlayTriggerState({
    get isOpen() {
      return getProps().isOpen;
    },
    get defaultOpen() {
      return getProps().defaultOpen;
    },
    get onOpenChange() {
      return getProps().onOpenChange;
    },
  });

  // Track selected key
  const isControlled = () => getProps().selectedKey !== undefined;
  const [internalSelectedKey, setInternalSelectedKey] = createSignal<Key | null>(
    getProps().defaultSelectedKey ?? null
  );

  const selectedKey: Accessor<Key | null> = () => {
    return isControlled() ? (getProps().selectedKey ?? null) : internalSelectedKey();
  };

  const setSelectedKey = (key: Key | null) => {
    if (!isControlled()) {
      setInternalSelectedKey(key);
    }
    getProps().onSelectionChange?.(key);
  };

  // Create list state with single selection
  const listState = createListState<T>({
    get items() {
      return getProps().items;
    },
    get getKey() {
      return getProps().getKey;
    },
    get getTextValue() {
      return getProps().getTextValue;
    },
    get getDisabled() {
      return getProps().getDisabled;
    },
    get disabledKeys() {
      return getProps().disabledKeys;
    },
    selectionMode: 'single',
    disallowEmptySelection: true,
    get selectedKeys() {
      const key = selectedKey();
      return key != null ? [key] : [];
    },
    onSelectionChange(keys) {
      // Get the first (and only) selected key
      if (keys === 'all') return; // Not applicable for single select
      const key = keys.size > 0 ? Array.from(keys)[0] : null;
      setSelectedKey(key);
      // Close the dropdown after selection
      overlayState.close();
    },
  });

  // Get the selected item from the collection
  const selectedItem: Accessor<CollectionNode<T> | null> = () => {
    const key = selectedKey();
    if (key == null) return null;
    return listState.collection().getItem(key);
  };

  return {
    // Collection
    collection: listState.collection,

    // Focus management
    focusedKey: listState.focusedKey,
    setFocusedKey: listState.setFocusedKey,
    isFocused: listState.isFocused,
    setFocused: listState.setFocused,

    // Overlay state
    isOpen: overlayState.isOpen,
    open: overlayState.open,
    close: overlayState.close,
    toggle: overlayState.toggle,

    // Select-specific
    selectedKey,
    selectedItem,
    setSelectedKey,
    isKeyDisabled: (key: Key) => listState.isDisabled(key),
    get isDisabled() {
      return getProps().isDisabled ?? false;
    },
    get isRequired() {
      return getProps().isRequired ?? false;
    },
  };
}
