/**
 * State management for list-like components.
 * Combines collection and selection state.
 * Based on @react-stately/list.
 */
import { type Accessor } from 'solid-js';
import { type MaybeAccessor } from '../utils';
import { type SelectionState } from './createSelectionState';
import type { Collection, CollectionNode, DisabledBehavior, FocusStrategy, Key, SelectionBehavior, SelectionMode } from './types';
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
export declare function createListState<T = unknown>(props: MaybeAccessor<ListStateProps<T>>): ListState<T>;
/**
 * Props for single selection list state.
 */
export interface SingleSelectListStateProps<T = unknown> extends Omit<ListStateProps<T>, 'selectionMode' | 'selectedKeys' | 'defaultSelectedKeys' | 'onSelectionChange'> {
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
export declare function createSingleSelectListState<T = unknown>(props: MaybeAccessor<SingleSelectListStateProps<T>>): SingleSelectListState<T>;
//# sourceMappingURL=createListState.d.ts.map