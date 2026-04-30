/**
 * Drag state management for solid-stately.
 *
 * Provides reactive state for drag operations.
 */
import { type Accessor } from "solid-js";
import type {
  DragItem,
  DragStartEvent,
  DragMoveEvent,
  DragEndEvent,
  DropOperation,
  DragPreviewRenderer,
} from "./types";
export interface DragStateOptions {
  /** A function that returns the items being dragged. */
  getItems: () => DragItem[];
  /** Function that returns the allowed drop operations. */
  getAllowedDropOperations?: () => DropOperation[];
  /** Handler that is called when a drag operation is started. */
  onDragStart?: (e: DragStartEvent) => void;
  /** Handler that is called when the drag is moved. */
  onDragMove?: (e: DragMoveEvent) => void;
  /** Handler that is called when the drag operation ends. */
  onDragEnd?: (e: DragEndEvent) => void;
  /** Whether the drag operation is disabled. */
  isDisabled?: boolean;
  /** Whether there is a separate drag button affordance. */
  hasDragButton?: boolean;
  /** Preview renderer function ref. */
  preview?: {
    current: DragPreviewRenderer | null;
  };
}
export interface DragState {
  /** Whether an element is currently being dragged. */
  readonly isDragging: boolean;
  /** Whether drag is disabled. */
  readonly isDisabled: boolean;
  /** Start a drag operation. */
  startDrag(x: number, y: number): void;
  /** Update drag position. */
  moveDrag(x: number, y: number): void;
  /** End a drag operation. */
  endDrag(x: number, y: number, dropOperation: DropOperation): void;
  /** Cancel a drag operation. */
  cancelDrag(): void;
  /** Get the items being dragged. */
  getItems(): DragItem[];
  /** Get allowed drop operations. */
  getAllowedDropOperations(): DropOperation[];
  /** Whether there is a drag button. */
  readonly hasDragButton: boolean;
  /** Preview renderer. */
  readonly preview:
    | {
        current: DragPreviewRenderer | null;
      }
    | undefined;
}
/**
 * Creates drag state for managing drag operations.
 *
 * @param props - Accessor returning drag state options
 * @returns Drag state object
 */
export declare function createDragState(props: Accessor<DragStateOptions>): DragState;
//# sourceMappingURL=createDragState.d.ts.map
