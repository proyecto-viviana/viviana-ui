/**
 * State management for tab components.
 * Based on @react-stately/tabs.
 */
import { type Accessor } from "solid-js";
import { type MaybeAccessor } from "../utils";
import type { Collection, CollectionNode, Key, FocusStrategy } from "../collections/types";
export type KeyboardActivation = "automatic" | "manual";
export type TabOrientation = "horizontal" | "vertical";
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
export declare function createTabListState<T = unknown>(
  props: MaybeAccessor<TabListStateProps<T>>,
): TabListState<T>;
//# sourceMappingURL=createTabListState.d.ts.map
