/**
 * State management for list-like components.
 * Combines collection and selection state.
 * Based on @react-stately/list.
 */

import { createSignal, createMemo, type Accessor } from 'solid-js';
import { access, type MaybeAccessor } from '../utils';
import { ListCollection } from './ListCollection';
import { createSelectionState, type SelectionState } from './createSelectionState';
import type {
  Collection,
  CollectionItemLike,
  CollectionNode,
  DisabledBehavior,
  FocusStrategy,
  Key,
  SelectionBehavior,
  SelectionMode,
} from './types';

export interface ListStateProps<T = unknown> {
  /** The items in the list (for dynamic rendering). */
  items?: T[];
  /** Function to get a key from an item. */
  getKey?: (item: T) => Key;
  /** Function to get text value from an item. */
  getTextValue?: (item: T) => string;
  /** Function to check if an item is disabled. */
  getDisabled?: (item: T) => boolean;
  /** Keys of disabled items. */
  disabledKeys?: Iterable<Key>;
  /** How disabled keys behave. */
  disabledBehavior?: DisabledBehavior;
  /** The selection mode. */
  selectionMode?: SelectionMode;
  /** How selection behaves on interaction. */
  selectionBehavior?: SelectionBehavior;
  /** Whether empty selection is disallowed. */
  disallowEmptySelection?: boolean;
  /** Currently selected keys (controlled). */
  selectedKeys?: 'all' | Iterable<Key>;
  /** Default selected keys (uncontrolled). */
  defaultSelectedKeys?: 'all' | Iterable<Key>;
  /** Handler for selection changes. */
  onSelectionChange?: (keys: 'all' | Set<Key>) => void;
  /** Whether to allow duplicate selection events. */
  allowDuplicateSelectionEvents?: boolean;
}

export interface ListState<T = unknown> extends SelectionState {
  /** The collection of items. */
  readonly collection: Accessor<Collection<T>>;
  /** Whether the collection is focused. */
  readonly isFocused: Accessor<boolean>;
  /** Set the focused state. */
  setFocused(isFocused: boolean): void;
  /** The currently focused key. */
  readonly focusedKey: Accessor<Key | null>;
  /** Set the focused key. */
  setFocusedKey(key: Key | null, childStrategy?: FocusStrategy): void;
  /** The child focus strategy. */
  readonly childFocusStrategy: Accessor<FocusStrategy | null>;
}

/**
 * Creates state for a list component with selection.
 */
export function createListState<T = unknown>(
  props: MaybeAccessor<ListStateProps<T>>
): ListState<T> {
  const getProps = () => access(props);

  // Build collection from items (memoized to avoid rebuilding on every access)
  const collection: Accessor<Collection<T>> = createMemo(() => {
    const p = getProps();
    const items = p.items ?? [];

    const nodes: CollectionNode<T>[] = items.map((item, index) => {
      const o = item as CollectionItemLike;
      const key = p.getKey?.(item) ?? o.key ?? o.id ?? index;
      const textValue =
        p.getTextValue?.(item) ?? o.textValue ?? o.label ?? String(item);
      const isDisabled = p.getDisabled?.(item) ?? o.isDisabled ?? false;

      return {
        type: 'item' as const,
        key,
        value: item,
        textValue,
        rendered: null!,
        level: 0,
        index,
        parentKey: null,
        hasChildNodes: false,
        childNodes: [],
        isDisabled,
      };
    });

    return new ListCollection(nodes);
  });

  // Combine disabled keys from props and items (memoized)
  const combinedDisabledKeys = createMemo((): Iterable<Key> => {
    const p = getProps();
    const propsDisabled = p.disabledKeys ? [...p.disabledKeys] : [];
    const itemDisabled: Key[] = [];

    const coll = collection();
    for (const node of coll) {
      if (node.isDisabled) {
        itemDisabled.push(node.key);
      }
    }

    return [...new Set([...propsDisabled, ...itemDisabled])];
  });

  // Create selection state
  const selectionState = createSelectionState({
    get selectionMode() {
      return getProps().selectionMode;
    },
    get selectionBehavior() {
      return getProps().selectionBehavior;
    },
    get disallowEmptySelection() {
      return getProps().disallowEmptySelection;
    },
    get selectedKeys() {
      return getProps().selectedKeys;
    },
    get defaultSelectedKeys() {
      return getProps().defaultSelectedKeys;
    },
    get onSelectionChange() {
      return getProps().onSelectionChange;
    },
    get disabledKeys() {
      return combinedDisabledKeys();
    },
    get disabledBehavior() {
      return getProps().disabledBehavior;
    },
    get allowDuplicateSelectionEvents() {
      return getProps().allowDuplicateSelectionEvents;
    },
  });

  // Focus state
  const [isFocused, setIsFocused] = createSignal(false);
  const [focusedKey, setFocusedKeyInternal] = createSignal<Key | null>(null);
  const [childFocusStrategy, setChildFocusStrategy] = createSignal<FocusStrategy | null>(null);

  const setFocusedKey = (key: Key | null, childStrategy?: FocusStrategy) => {
    setFocusedKeyInternal(key);
    setChildFocusStrategy(childStrategy ?? null);
  };

  return {
    collection,
    isFocused,
    setFocused: setIsFocused,
    focusedKey,
    setFocusedKey,
    childFocusStrategy,
    ...selectionState,
  };
}

/**
 * Props for single selection list state.
 */
export interface SingleSelectListStateProps<T = unknown>
  extends Omit<ListStateProps<T>, 'selectionMode' | 'selectedKeys' | 'defaultSelectedKeys' | 'onSelectionChange'> {
  /** The currently selected key (controlled). */
  selectedKey?: Key | null;
  /** The default selected key (uncontrolled). */
  defaultSelectedKey?: Key;
  /** Handler for selection changes. */
  onSelectionChange?: (key: Key | null) => void;
}

export interface SingleSelectListState<T = unknown> extends ListState<T> {
  /** The currently selected key. */
  readonly selectedKey: Accessor<Key | null>;
  /** Set the selected key. */
  setSelectedKey(key: Key | null): void;
  /** The currently selected item. */
  readonly selectedItem: Accessor<CollectionNode<T> | null>;
}

/**
 * Creates state for a single-select list component.
 */
export function createSingleSelectListState<T = unknown>(
  props: MaybeAccessor<SingleSelectListStateProps<T>>
): SingleSelectListState<T> {
  const getProps = () => access(props);

  // Convert single selection props to multiple selection props
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
    get disabledBehavior() {
      return getProps().disabledBehavior;
    },
    selectionMode: 'single',
    disallowEmptySelection: true,
    allowDuplicateSelectionEvents: true,
    get selectedKeys() {
      const key = getProps().selectedKey;
      return key != null ? [key] : [];
    },
    get defaultSelectedKeys() {
      const key = getProps().defaultSelectedKey;
      return key != null ? [key] : undefined;
    },
    onSelectionChange(keys) {
      if (keys === 'all') return;
      const key = keys.values().next().value ?? null;
      getProps().onSelectionChange?.(key);
    },
  });

  const selectedKey: Accessor<Key | null> = () => {
    const keys = listState.selectedKeys();
    if (keys === 'all') return null;
    return keys.values().next().value ?? null;
  };

  const setSelectedKey = (key: Key | null) => {
    if (key === null) {
      listState.clearSelection();
    } else {
      listState.replaceSelection(key);
    }
  };

  const selectedItem: Accessor<CollectionNode<T> | null> = () => {
    const key = selectedKey();
    if (key === null) return null;
    return listState.collection().getItem(key);
  };

  return {
    ...listState,
    selectedKey,
    setSelectedKey,
    selectedItem,
  };
}
