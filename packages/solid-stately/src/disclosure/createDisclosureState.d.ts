/**
 * Disclosure state management for SolidJS
 * Based on @react-stately/disclosure useDisclosureState and useDisclosureGroupState
 */
import { type Accessor } from "solid-js";
import { type MaybeAccessor } from "../utils";
export interface DisclosureStateProps {
  /** Whether the disclosure is expanded (controlled). */
  isExpanded?: boolean;
  /** Whether the disclosure is expanded by default (uncontrolled). */
  defaultExpanded?: boolean;
  /** Handler that is called when the disclosure expanded state changes. */
  onExpandedChange?: (isExpanded: boolean) => void;
}
export interface DisclosureState {
  /** Whether the disclosure is currently expanded. */
  readonly isExpanded: Accessor<boolean>;
  /** Sets whether the disclosure is expanded. */
  setExpanded(isExpanded: boolean): void;
  /** Expand the disclosure. */
  expand(): void;
  /** Collapse the disclosure. */
  collapse(): void;
  /** Toggles the disclosure's visibility. */
  toggle(): void;
}
/**
 * Manages state for a disclosure widget. Tracks whether the disclosure is expanded,
 * and provides methods to toggle this state.
 */
export declare function createDisclosureState(
  props?: MaybeAccessor<DisclosureStateProps>,
): DisclosureState;
export type Key = string | number;
export interface DisclosureGroupStateProps {
  /** Whether multiple items can be expanded at the same time. */
  allowsMultipleExpanded?: boolean;
  /** Whether all items are disabled. */
  isDisabled?: boolean;
  /** The currently expanded keys in the group (controlled). */
  expandedKeys?: Iterable<Key>;
  /** The initial expanded keys in the group (uncontrolled). */
  defaultExpandedKeys?: Iterable<Key>;
  /** Handler that is called when items are expanded or collapsed. */
  onExpandedChange?: (keys: Set<Key>) => void;
}
export interface DisclosureGroupState {
  /** Whether multiple items can be expanded at the same time. */
  readonly allowsMultipleExpanded: boolean;
  /** Whether all items are disabled. */
  readonly isDisabled: boolean;
  /** A set of keys for items that are expanded. */
  readonly expandedKeys: Accessor<Set<Key>>;
  /** Toggles the expanded state for an item by its key. */
  toggleKey(key: Key): void;
  /** Replaces the set of expanded keys. */
  setExpandedKeys(keys: Set<Key>): void;
  /** Check if a specific key is expanded. */
  isExpanded(key: Key): boolean;
}
/**
 * Manages state for a group of disclosures, e.g. an accordion.
 * It supports both single and multiple expanded items.
 */
export declare function createDisclosureGroupState(
  props?: MaybeAccessor<DisclosureGroupStateProps>,
): DisclosureGroupState;
//# sourceMappingURL=createDisclosureState.d.ts.map
