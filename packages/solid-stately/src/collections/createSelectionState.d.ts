/**
 * Selection state management for collections.
 * Based on @react-stately/selection.
 */
import { type Accessor } from "solid-js";
import { type MaybeAccessor } from "../utils";
import type {
  Collection,
  DisabledBehavior,
  Key,
  Selection,
  SelectionBehavior,
  SelectionMode,
} from "./types";
export interface SelectionStateProps {
  /** The selection mode. */
  selectionMode?: SelectionMode;
  /** How selection behaves on interaction. */
  selectionBehavior?: SelectionBehavior;
  /** Whether empty selection is disallowed. */
  disallowEmptySelection?: boolean;
  /** Currently selected keys (controlled). */
  selectedKeys?: "all" | Iterable<Key>;
  /** Default selected keys (uncontrolled). */
  defaultSelectedKeys?: "all" | Iterable<Key>;
  /** Handler for selection changes. */
  onSelectionChange?: (keys: Selection) => void;
  /** Keys of disabled items. */
  disabledKeys?: Iterable<Key>;
  /** How disabled keys behave. */
  disabledBehavior?: DisabledBehavior;
  /** Whether to allow duplicate selection events. */
  allowDuplicateSelectionEvents?: boolean;
}
export interface SelectionState {
  /** The selection mode. */
  readonly selectionMode: Accessor<SelectionMode>;
  /** The selection behavior. */
  readonly selectionBehavior: Accessor<SelectionBehavior>;
  /** Whether empty selection is disallowed. */
  readonly disallowEmptySelection: Accessor<boolean>;
  /** The currently selected keys. */
  readonly selectedKeys: Accessor<Selection>;
  /** Set of disabled keys. */
  readonly disabledKeys: Accessor<Set<Key>>;
  /** How disabled keys behave. */
  readonly disabledBehavior: Accessor<DisabledBehavior>;
  /** Whether the selection is empty. */
  readonly isEmpty: Accessor<boolean>;
  /** Whether all items are selected. */
  readonly isSelectAll: Accessor<boolean>;
  /** Check if a key is selected. */
  isSelected(key: Key): boolean;
  /** Check if a key is disabled. */
  isDisabled(key: Key): boolean;
  /** Set the selection behavior. */
  setSelectionBehavior(behavior: SelectionBehavior): void;
  /** Toggle selection for a key. */
  toggleSelection(key: Key): void;
  /** Replace selection with a single key. */
  replaceSelection(key: Key): void;
  /** Set multiple selected keys. */
  setSelectedKeys(keys: Iterable<Key>): void;
  /** Select all items. */
  selectAll(): void;
  /** Clear all selection. */
  clearSelection(): void;
  /** Toggle between select all and clear. */
  toggleSelectAll(): void;
  /** Extend selection to a key (for shift-click). */
  extendSelection(toKey: Key, collection: Collection): void;
  /** Select a key based on interaction. */
  select(
    key: Key,
    e?: {
      shiftKey?: boolean;
      ctrlKey?: boolean;
      metaKey?: boolean;
    },
    collection?: Collection,
  ): void;
}
/**
 * Creates selection state for a collection.
 */
export declare function createSelectionState(
  props?: MaybeAccessor<SelectionStateProps>,
): SelectionState;
//# sourceMappingURL=createSelectionState.d.ts.map
