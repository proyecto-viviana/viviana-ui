/**
 * Droppable collection state management for solid-stately.
 *
 * Provides reactive state for accepting drops onto a collection.
 */

import { createSignal, createMemo, type Accessor } from 'solid-js';
import type {
  DropItem,
  DropTarget,
  DropOperation,
  DragTypes,
  DroppableCollectionEnterEvent,
  DroppableCollectionMoveEvent,
  DroppableCollectionActivateEvent,
  DroppableCollectionExitEvent,
  DroppableCollectionDropEvent,
  DroppableCollectionInsertDropEvent,
  DroppableCollectionRootDropEvent,
  DroppableCollectionOnItemDropEvent,
  DroppableCollectionReorderEvent,
  ItemDropTarget,
} from './types';

export interface DroppableCollectionStateOptions {
  /**
   * The drag types that the droppable collection accepts.
   * @default 'all'
   */
  acceptedDragTypes?: 'all' | Array<string | symbol>;
  /**
   * A function returning the drop operation to be performed.
   */
  getDropOperation?: (
    target: DropTarget,
    types: DragTypes,
    allowedOperations: DropOperation[]
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
    draggingKeys?: Set<string | number>
  ): void;
  /** Get the drop operation for a target. */
  getDropOperation(
    target: DropTarget,
    types: DragTypes,
    allowedOperations: DropOperation[]
  ): DropOperation;
  /** Check if an item drop should be accepted. */
  shouldAcceptItemDrop(target: ItemDropTarget, types: DragTypes): boolean;
}

/**
 * Symbol for directory drag type.
 */
export const DIRECTORY_DRAG_TYPE: symbol = Symbol('directory');

/**
 * Creates state for accepting drops onto a collection.
 *
 * @param props - Accessor returning droppable collection options
 * @returns Droppable collection state object
 */
export function createDroppableCollectionState(
  props: Accessor<DroppableCollectionStateOptions>
): DroppableCollectionState {
  const getProps = createMemo(() => props());

  const [isDropTarget, setIsDropTarget] = createSignal(false);
  const [target, setTarget] = createSignal<DropTarget | null>(null);

  const isAccepted = (types: DragTypes): boolean => {
    const p = getProps();
    const acceptedTypes = p.acceptedDragTypes ?? 'all';

    if (acceptedTypes === 'all') {
      return true;
    }

    for (const type of acceptedTypes) {
      if (types.has(type)) {
        return true;
      }
    }

    return false;
  };

  const enterTarget = (dropTarget: DropTarget, x: number, y: number) => {
    const p = getProps();
    if (p.isDisabled) return;

    setIsDropTarget(true);
    setTarget(dropTarget);

    if (typeof p.onDropEnter === 'function') {
      p.onDropEnter({
        type: 'dropenter',
        x,
        y,
        target: dropTarget,
      });
    }
  };

  const moveToTarget = (dropTarget: DropTarget, x: number, y: number) => {
    const p = getProps();
    if (p.isDisabled) return;

    const prevTarget = target();
    setTarget(dropTarget);

    // Fire exit/enter events if target changed
    if (prevTarget && !targetsEqual(prevTarget, dropTarget)) {
      if (typeof p.onDropExit === 'function') {
        p.onDropExit({
          type: 'dropexit',
          x,
          y,
          target: prevTarget,
        });
      }

      if (typeof p.onDropEnter === 'function') {
        p.onDropEnter({
          type: 'dropenter',
          x,
          y,
          target: dropTarget,
        });
      }
    }
  };

  const exitTarget = (x: number, y: number) => {
    const p = getProps();
    const currentTarget = target();

    setIsDropTarget(false);
    setTarget(null);

    if (currentTarget && typeof p.onDropExit === 'function') {
      p.onDropExit({
        type: 'dropexit',
        x,
        y,
        target: currentTarget,
      });
    }
  };

  const activateTarget = (x: number, y: number) => {
    const p = getProps();
    const currentTarget = target();
    if (p.isDisabled || !currentTarget) return;

    if (typeof p.onDropActivate === 'function') {
      p.onDropActivate({
        type: 'dropactivate',
        x,
        y,
        target: currentTarget,
      });
    }
  };

  const drop = (
    items: DropItem[],
    dropOperation: DropOperation,
    isInternal: boolean,
    draggingKeys?: Set<string | number>
  ) => {
    const p = getProps();
    const currentTarget = target();
    if (p.isDisabled || !currentTarget) return;

    setIsDropTarget(false);
    setTarget(null);

    // Call the generic onDrop handler
    if (typeof p.onDrop === 'function') {
      p.onDrop({
        type: 'drop',
        x: 0,
        y: 0,
        items,
        dropOperation,
        target: currentTarget,
      });
    }

    // Call specific handlers based on the drop type
    if (currentTarget.type === 'root') {
      if (typeof p.onRootDrop === 'function') {
        p.onRootDrop({
          items,
          dropOperation,
        });
      }
    } else if (currentTarget.type === 'item') {
      if (isInternal && draggingKeys) {
        // Reorder or move within the same collection
        if (currentTarget.dropPosition === 'on') {
          if (typeof p.onMove === 'function') {
            p.onMove({
              keys: draggingKeys,
              dropOperation,
              target: currentTarget,
            });
          }
        } else {
          if (typeof p.onReorder === 'function') {
            p.onReorder({
              keys: draggingKeys,
              dropOperation,
              target: currentTarget,
            });
          }
        }
      } else {
        // External drop
        if (currentTarget.dropPosition === 'on') {
          if (typeof p.onItemDrop === 'function') {
            p.onItemDrop({
              items,
              dropOperation,
              isInternal,
              target: currentTarget,
            });
          }
        } else {
          if (typeof p.onInsert === 'function') {
            p.onInsert({
              items,
              dropOperation,
              target: currentTarget,
            });
          }
        }
      }
    }
  };

  const getDropOperation = (
    dropTarget: DropTarget,
    types: DragTypes,
    allowedOperations: DropOperation[]
  ): DropOperation => {
    const p = getProps();

    if (!isAccepted(types)) {
      return 'cancel';
    }

    if (typeof p.getDropOperation === 'function') {
      return p.getDropOperation(dropTarget, types, allowedOperations);
    }

    return allowedOperations[0] ?? 'cancel';
  };

  const shouldAcceptItemDrop = (
    dropTarget: ItemDropTarget,
    types: DragTypes
  ): boolean => {
    const p = getProps();

    if (!isAccepted(types)) {
      return false;
    }

    if (typeof p.shouldAcceptItemDrop === 'function') {
      return p.shouldAcceptItemDrop(dropTarget, types);
    }

    return true;
  };

  return {
    get isDropTarget() {
      return isDropTarget();
    },
    get target() {
      return target();
    },
    get isDisabled() {
      return getProps().isDisabled ?? false;
    },
    setTarget,
    isAccepted,
    enterTarget,
    moveToTarget,
    exitTarget,
    activateTarget,
    drop,
    getDropOperation,
    shouldAcceptItemDrop,
  };
}

/**
 * Check if two drop targets are equal.
 */
function targetsEqual(a: DropTarget, b: DropTarget): boolean {
  if (a.type !== b.type) return false;
  if (a.type === 'root' && b.type === 'root') return true;
  if (a.type === 'item' && b.type === 'item') {
    return a.key === b.key && a.dropPosition === b.dropPosition;
  }
  return false;
}
