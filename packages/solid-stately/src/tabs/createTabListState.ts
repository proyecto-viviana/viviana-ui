/**
 * State management for tab components.
 * Based on @react-stately/tabs.
 */

import { createSignal, type Accessor } from 'solid-js';
import { access, type MaybeAccessor } from '../utils';
import { ListCollection } from '../collections/ListCollection';
import type {
  Collection,
  CollectionNode,
  Key,
  FocusStrategy,
} from '../collections/types';

export type KeyboardActivation = 'automatic' | 'manual';
export type TabOrientation = 'horizontal' | 'vertical';

export interface TabListStateProps<T = unknown> {
  /** The items in the tab list. */
  items?: T[];
  /** Function to get a key from an item. */
  getKey?: (item: T) => Key;
  /** Function to get text value from an item. */
  getTextValue?: (item: T) => string;
  /** Function to check if an item is disabled. */
  getDisabled?: (item: T) => boolean;
  /** Keys of disabled tabs. */
  disabledKeys?: Iterable<Key>;
  /** The currently selected tab key (controlled). */
  selectedKey?: Key | null;
  /** The default selected tab key (uncontrolled). */
  defaultSelectedKey?: Key;
  /** Handler for tab selection changes. */
  onSelectionChange?: (key: Key) => void;
  /** Whether the entire tab list is disabled. */
  isDisabled?: boolean;
  /** Whether tabs are activated automatically on focus or manually. */
  keyboardActivation?: KeyboardActivation;
  /** The orientation of the tab list. */
  orientation?: TabOrientation;
}

export interface TabListState<T = unknown> {
  /** The collection of tabs. */
  readonly collection: Accessor<Collection<T>>;
  /** The currently selected tab key. */
  readonly selectedKey: Accessor<Key | null>;
  /** Set the selected tab key. */
  setSelectedKey(key: Key): void;
  /** The currently selected tab item. */
  readonly selectedItem: Accessor<CollectionNode<T> | null>;
  /** Whether the tab list is disabled. */
  readonly isDisabled: Accessor<boolean>;
  /** The keyboard activation mode. */
  readonly keyboardActivation: Accessor<KeyboardActivation>;
  /** The orientation of the tab list. */
  readonly orientation: Accessor<TabOrientation>;
  /** Whether a tab key is disabled. */
  isKeyDisabled(key: Key): boolean;
  /** The set of disabled keys. */
  readonly disabledKeys: Accessor<Set<Key>>;
  /** Whether the collection is focused. */
  readonly isFocused: Accessor<boolean>;
  /** Set the focused state. */
  setFocused(isFocused: boolean): void;
  /** The currently focused tab key. */
  readonly focusedKey: Accessor<Key | null>;
  /** Set the focused tab key. */
  setFocusedKey(key: Key | null, childStrategy?: FocusStrategy): void;
  /** The child focus strategy. */
  readonly childFocusStrategy: Accessor<FocusStrategy | null>;
}

/**
 * Creates state for a tab list component.
 */
export function createTabListState<T = unknown>(
  props: MaybeAccessor<TabListStateProps<T>>
): TabListState<T> {
  const getProps = () => access(props);

  // Build collection from items
  const collection: Accessor<Collection<T>> = () => {
    const p = getProps();
    const items = p.items ?? [];

    const nodes: CollectionNode<T>[] = items.map((item, index) => {
      const key = p.getKey?.(item) ?? (item as any).key ?? (item as any).id ?? index;
      const textValue =
        p.getTextValue?.(item) ?? (item as any).textValue ?? (item as any).label ?? String(item);
      const isDisabled = p.getDisabled?.(item) ?? (item as any).isDisabled ?? false;

      return {
        type: 'item' as const,
        key,
        value: item,
        textValue,
        rendered: null as any,
        level: 0,
        index,
        parentKey: null,
        hasChildNodes: false,
        childNodes: [],
        isDisabled,
      };
    });

    return new ListCollection(nodes);
  };

  // Compute disabled keys
  const disabledKeys: Accessor<Set<Key>> = () => {
    const p = getProps();
    const result = new Set<Key>(p.disabledKeys ?? []);

    const coll = collection();
    for (const node of coll) {
      if (node.isDisabled) {
        result.add(node.key);
      }
    }

    return result;
  };

  // Check if a key is disabled
  const isKeyDisabled = (key: Key): boolean => {
    const p = getProps();
    if (p.isDisabled) return true;
    return disabledKeys().has(key);
  };

  // Find the first non-disabled key
  const findFirstNonDisabledKey = (): Key | null => {
    const coll = collection();
    for (const node of coll) {
      if (!isKeyDisabled(node.key)) {
        return node.key;
      }
    }
    return null;
  };

  // Get initial selected key
  const getInitialSelectedKey = (): Key | null => {
    const p = getProps();

    // If controlled, use that value
    if (p.selectedKey !== undefined) {
      return p.selectedKey;
    }

    // If default provided and not disabled, use it
    if (p.defaultSelectedKey !== undefined && !isKeyDisabled(p.defaultSelectedKey)) {
      return p.defaultSelectedKey;
    }

    // Otherwise, select first non-disabled
    return findFirstNonDisabledKey();
  };

  // Selection state
  const [selectedKeyInternal, setSelectedKeyInternal] = createSignal<Key | null>(
    getInitialSelectedKey()
  );

  // Compute actual selected key (controlled vs uncontrolled)
  const selectedKey: Accessor<Key | null> = () => {
    const p = getProps();
    if (p.selectedKey !== undefined) {
      return p.selectedKey;
    }
    return selectedKeyInternal();
  };

  const setSelectedKey = (key: Key) => {
    // Don't select disabled keys
    if (isKeyDisabled(key)) return;

    const p = getProps();
    // For uncontrolled mode, update internal state
    if (p.selectedKey === undefined) {
      setSelectedKeyInternal(key);
    }

    // Always call onChange
    p.onSelectionChange?.(key);
  };

  // Get selected item
  const selectedItem: Accessor<CollectionNode<T> | null> = () => {
    const key = selectedKey();
    if (key === null) return null;
    return collection().getItem(key);
  };

  // Is disabled accessor
  const isDisabled: Accessor<boolean> = () => getProps().isDisabled ?? false;

  // Keyboard activation accessor
  const keyboardActivation: Accessor<KeyboardActivation> = () =>
    getProps().keyboardActivation ?? 'automatic';

  // Orientation accessor
  const orientation: Accessor<TabOrientation> = () =>
    getProps().orientation ?? 'horizontal';

  // Focus state
  const [isFocused, setIsFocused] = createSignal(false);
  const [focusedKey, setFocusedKeyInternal] = createSignal<Key | null>(null);
  const [childFocusStrategy, setChildFocusStrategy] = createSignal<FocusStrategy | null>(null);

  const setFocusedKey = (key: Key | null, childStrategy?: FocusStrategy) => {
    setFocusedKeyInternal(key);
    setChildFocusStrategy(childStrategy ?? null);

    // In automatic mode, selecting follows focus
    if (keyboardActivation() === 'automatic' && key !== null && !isKeyDisabled(key)) {
      setSelectedKey(key);
    }
  };

  return {
    collection,
    selectedKey,
    setSelectedKey,
    selectedItem,
    isDisabled,
    keyboardActivation,
    orientation,
    isKeyDisabled,
    disabledKeys,
    isFocused,
    setFocused: setIsFocused,
    focusedKey,
    setFocusedKey,
    childFocusStrategy,
  };
}
