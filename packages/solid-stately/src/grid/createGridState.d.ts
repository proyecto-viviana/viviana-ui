/**
 * Grid state management for Table and GridList components.
 * Based on @react-stately/grid/useGridState.
 */
import { type Accessor } from "solid-js";
import type { GridState, GridStateOptions, GridCollection } from "./types";
/**
 * Creates state management for a grid component.
 * Handles row selection, focus management, and keyboard navigation state.
 */
export declare function createGridState<
  T extends object,
  C extends GridCollection<T> = GridCollection<T>,
>(options: Accessor<GridStateOptions<T, C>>): GridState<T, C>;
//# sourceMappingURL=createGridState.d.ts.map
