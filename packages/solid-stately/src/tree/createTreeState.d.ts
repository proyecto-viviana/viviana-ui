/**
 * Tree state management for Tree components.
 * Based on @react-stately/tree/useTreeState.
 *
 * Manages expansion state, selection, and focus for hierarchical tree data.
 */
import { type Accessor } from "solid-js";
import type { TreeState, TreeStateOptions, TreeCollection } from "./types";
/**
 * Creates state management for a tree component.
 * Handles expansion, selection, focus management, and keyboard navigation state.
 */
export declare function createTreeState<
  T extends object,
  C extends TreeCollection<T> = TreeCollection<T>,
>(options: Accessor<TreeStateOptions<T, C>>): TreeState<T, C>;
//# sourceMappingURL=createTreeState.d.ts.map
