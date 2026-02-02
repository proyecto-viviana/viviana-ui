/**
 * Draggable collection state management for solid-stately.
 *
 * Provides reactive state for dragging items from a collection.
 */
import { type Accessor } from 'solid-js';
import type { DragItem, DraggableCollectionStartEvent, DraggableCollectionMoveEvent, DraggableCollectionEndEvent, DropOperation, DragPreviewRenderer } from './types';
export interface DraggableCollectionStateOptions<T = object> {
    /** A function that returns the items being dragged. */
    getItems: (keys: Set<string | number>) => DragItem[];
    /** Function that returns the allowed drop operations. */
    getAllowedDropOperations?: () => DropOperation[];
    /** Handler that is called when a drag operation is started. */
    onDragStart?: (e: DraggableCollectionStartEvent) => void;
    /** Handler that is called when the drag is moved. */
    onDragMove?: (e: DraggableCollectionMoveEvent) => void;
    /** Handler that is called when the drag operation ends. */
    onDragEnd?: (e: DraggableCollectionEndEvent) => void;
    /** Whether the drag operation is disabled. */
    isDisabled?: boolean;
    /** Preview renderer function ref. */
    preview?: {
        current: DragPreviewRenderer | null;
    };
}
export interface DraggableCollectionState {
    /** Whether items are currently being dragged. */
    readonly isDragging: boolean;
    /** The keys of the items being dragged. */
    readonly draggingKeys: Set<string | number>;
    /** Whether dragging is disabled. */
    readonly isDisabled: boolean;
    /** Start a drag operation with the given keys. */
    startDrag(keys: Set<string | number>, x: number, y: number): void;
    /** Update drag position. */
    moveDrag(x: number, y: number): void;
    /** End a drag operation. */
    endDrag(x: number, y: number, dropOperation: DropOperation, isInternal: boolean): void;
    /** Cancel a drag operation. */
    cancelDrag(): void;
    /** Get the items being dragged for the given keys. */
    getItems(keys: Set<string | number>): DragItem[];
    /** Get allowed drop operations. */
    getAllowedDropOperations(): DropOperation[];
    /** Preview renderer. */
    readonly preview: {
        current: DragPreviewRenderer | null;
    } | undefined;
}
/**
 * Creates state for dragging items from a collection.
 *
 * @param props - Accessor returning draggable collection options
 * @returns Draggable collection state object
 */
export declare function createDraggableCollectionState<T = object>(props: Accessor<DraggableCollectionStateOptions<T>>): DraggableCollectionState;
//# sourceMappingURL=createDraggableCollectionState.d.ts.map