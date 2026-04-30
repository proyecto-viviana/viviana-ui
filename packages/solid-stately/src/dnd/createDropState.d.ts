/**
 * Drop state management for solid-stately.
 *
 * Provides reactive state for drop target operations.
 */
import { type Accessor } from "solid-js";
import type {
  DropItem,
  DropEnterEvent,
  DropMoveEvent,
  DropExitEvent,
  DropActivateEvent,
  DropEvent,
  DropOperation,
  DragTypes,
} from "./types";
export interface DropStateOptions {
  /**
   * A function returning the drop operation to be performed.
   */
  getDropOperation?: (types: DragTypes, allowedOperations: DropOperation[]) => DropOperation;
  /**
   * A function returning the drop operation for a specific point.
   */
  getDropOperationForPoint?: (
    types: DragTypes,
    allowedOperations: DropOperation[],
    x: number,
    y: number,
  ) => DropOperation;
  /** Handler that is called when a valid drag enters the drop target. */
  onDropEnter?: (e: DropEnterEvent) => void;
  /** Handler that is called when a valid drag is moved within the drop target. */
  onDropMove?: (e: DropMoveEvent) => void;
  /** Handler that is called after a valid drag is held over the drop target. */
  onDropActivate?: (e: DropActivateEvent) => void;
  /** Handler that is called when a valid drag exits the drop target. */
  onDropExit?: (e: DropExitEvent) => void;
  /** Handler that is called when a valid drag is dropped on the drop target. */
  onDrop?: (e: DropEvent) => void;
  /** Whether there is a separate drop button affordance. */
  hasDropButton?: boolean;
  /** Whether the drop target is disabled. */
  isDisabled?: boolean;
}
export interface DropState {
  /** Whether the drop target is currently being hovered or focused. */
  readonly isDropTarget: boolean;
  /** Whether the drop target is disabled. */
  readonly isDisabled: boolean;
  /** Whether there is a drop button. */
  readonly hasDropButton: boolean;
  /** Enter the drop target. */
  enterTarget(x: number, y: number): void;
  /** Move within the drop target. */
  moveInTarget(x: number, y: number): void;
  /** Exit the drop target. */
  exitTarget(x: number, y: number): void;
  /** Activate the drop target (after holding). */
  activateTarget(x: number, y: number): void;
  /** Perform a drop on the target. */
  drop(x: number, y: number, items: DropItem[], dropOperation: DropOperation): void;
  /** Get the drop operation for given types. */
  getDropOperation(types: DragTypes, allowedOperations: DropOperation[]): DropOperation;
  /** Get the drop operation for a specific point. */
  getDropOperationForPoint(
    types: DragTypes,
    allowedOperations: DropOperation[],
    x: number,
    y: number,
  ): DropOperation;
}
/**
 * Creates drop state for managing drop target operations.
 *
 * @param props - Accessor returning drop state options
 * @returns Drop state object
 */
export declare function createDropState(props: Accessor<DropStateOptions>): DropState;
//# sourceMappingURL=createDropState.d.ts.map
