/**
 * Droppable collection state management for solid-stately.
 *
 * Provides reactive state for accepting drops onto a collection.
 */
import { type Accessor } from "solid-js";
import type {
  DropItem,
  DropTarget,
  DropOperation,
  DragTypes,
  DroppableCollectionEnterEvent,
  DroppableCollectionActivateEvent,
  DroppableCollectionExitEvent,
  DroppableCollectionDropEvent,
  DroppableCollectionInsertDropEvent,
  DroppableCollectionRootDropEvent,
  DroppableCollectionOnItemDropEvent,
  DroppableCollectionReorderEvent,
  ItemDropTarget,
} from "./types";
export interface DroppableCollectionStateOptions {
  /**
   * The drag types that the droppable collection accepts.
   * @default 'all'
   */
  acceptedDragTypes?: "all" | Array<string | symbol>;
  /**
   * A function returning the drop operation to be performed.
   */
  getDropOperation?: (
    target: DropTarget,
    types: DragTypes,
    allowedOperations: DropOperation[],
  ) => DropOperation;
  /** Handler that is called when a valid drag enters a drop target. */
  onDropEnter?: (e: DroppableCollectionEnterEvent) => void;
  /** Handler that is called after a valid drag is held over a drop target. */
  onDropActivate?: (e: DroppableCollectionActivateEvent) => void;
  /** Handler that is called when a valid drag exits a drop target. */
  onDropExit?: (e: DroppableCollectionExitEvent) => void;
  /** Handler that is called when a valid drag is dropped. */
  onDrop?: (e: DroppableCollectionDropEvent) => void;
  /** Handler that is called when external items are dropped "between" items. */
  onInsert?: (e: DroppableCollectionInsertDropEvent) => void;
  /** Handler that is called when external items are dropped on the collection's root. */
  onRootDrop?: (e: DroppableCollectionRootDropEvent) => void;
  /** Handler that is called when items are dropped "on" an item. */
  onItemDrop?: (e: DroppableCollectionOnItemDropEvent) => void;
  /** Handler that is called when items are reordered within the collection. */
  onReorder?: (e: DroppableCollectionReorderEvent) => void;
  /** Handler that is called when items are moved within the source collection. */
  onMove?: (e: DroppableCollectionReorderEvent) => void;
  /** A function returning whether a given target is a valid "on" drop target. */
  shouldAcceptItemDrop?: (target: ItemDropTarget, types: DragTypes) => boolean;
  /** Whether the droppable collection is disabled. */
  isDisabled?: boolean;
}
export interface DroppableCollectionState {
  /** Whether a drag is currently over the collection. */
  readonly isDropTarget: boolean;
  /** The current drop target within the collection. */
  readonly target: DropTarget | null;
  /** Whether the collection is disabled for drops. */
  readonly isDisabled: boolean;
  /** Set the current drop target. */
  setTarget(target: DropTarget | null): void;
  /** Check if a drag type is accepted. */
  isAccepted(types: DragTypes): boolean;
  /** Enter the collection with a drop target. */
  enterTarget(target: DropTarget, x: number, y: number): void;
  /** Move to a new target within the collection. */
  moveToTarget(target: DropTarget, x: number, y: number): void;
  /** Exit the collection. */
  exitTarget(x: number, y: number): void;
  /** Activate the current target. */
  activateTarget(x: number, y: number): void;
  /** Perform a drop on the collection. */
  drop(
    items: DropItem[],
    dropOperation: DropOperation,
    isInternal: boolean,
    draggingKeys?: Set<string | number>,
  ): void;
  /** Get the drop operation for a target. */
  getDropOperation(
    target: DropTarget,
    types: DragTypes,
    allowedOperations: DropOperation[],
  ): DropOperation;
  /** Check if an item drop should be accepted. */
  shouldAcceptItemDrop(target: ItemDropTarget, types: DragTypes): boolean;
}
/**
 * Symbol for directory drag type.
 */
export declare const DIRECTORY_DRAG_TYPE: symbol;
/**
 * Creates state for accepting drops onto a collection.
 *
 * @param props - Accessor returning droppable collection options
 * @returns Droppable collection state object
 */
export declare function createDroppableCollectionState(
  props: Accessor<DroppableCollectionStateOptions>,
): DroppableCollectionState;
//# sourceMappingURL=createDroppableCollectionState.d.ts.map
