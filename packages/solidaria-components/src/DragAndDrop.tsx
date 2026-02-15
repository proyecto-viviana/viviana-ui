/**
 * Drag and drop composition helpers for solidaria-components.
 *
 * Compatibility target: react-aria-components DragAndDrop exports.
 */

import {
  type JSX,
  type Accessor,
  createContext,
  createMemo,
  useContext,
} from 'solid-js';
import type {
  DragTypes,
  DropOperation,
  DropTarget,
  ItemDropTarget,
  Key,
} from '@proyecto-viviana/solid-stately';
import type { DragAndDropHooks } from './useDragAndDrop';
import {
  type ClassNameOrFunction,
  type StyleOrFunction,
  type SlotProps,
  useRenderProps,
  dataAttr,
} from './utils';

export interface DragAndDropContextValue {
  dragState?: unknown;
  dropState?: {
    target?: DropTarget | null;
    isDropTarget?: (target: DropTarget) => boolean;
  };
}

export const DragAndDropContext = createContext<DragAndDropContextValue>({});

export interface DropIndicatorRenderProps {
  isDropTarget: boolean;
}

export interface DropIndicatorProps extends SlotProps {
  target: ItemDropTarget;
  children?: JSX.Element | ((props: DropIndicatorRenderProps) => JSX.Element);
  class?: ClassNameOrFunction<DropIndicatorRenderProps>;
  style?: StyleOrFunction<DropIndicatorRenderProps>;
}

interface DropIndicatorContextValue {
  render: (props: DropIndicatorProps) => JSX.Element;
}

export const DropIndicatorContext = createContext<DropIndicatorContextValue | null>(null);

function DefaultDropIndicator(props: DropIndicatorProps): JSX.Element {
  const dnd = useContext(DragAndDropContext);
  const isDropTarget = createMemo(() => {
    const target = props.target;
    return dnd.dropState?.isDropTarget?.(target) ?? false;
  });

  const renderProps = useRenderProps(
    {
      children: props.children,
      class: props.class,
      style: props.style,
      defaultClassName: 'solidaria-DropIndicator',
    },
    () => ({
      isDropTarget: isDropTarget(),
    })
  );

  return (
    <div
      role="option"
      aria-disabled={true}
      class={renderProps.class()}
      style={renderProps.style()}
      data-drop-target={dataAttr(isDropTarget())}
    >
      {renderProps.renderChildren()}
    </div>
  );
}

export function DropIndicator(props: DropIndicatorProps): JSX.Element {
  const context = useContext(DropIndicatorContext);
  if (context) return context.render(props);
  return <DefaultDropIndicator {...props} />;
}

export function useRenderDropIndicator(
  dropState?: {
    target?: DropTarget | null;
    isDropTarget?: (target: DropTarget) => boolean;
  }
): ((target: ItemDropTarget) => JSX.Element | undefined) | undefined {
  if (!dropState) return undefined;
  return (target: ItemDropTarget) => {
    const isTarget = dropState.isDropTarget?.(target) ?? false;
    if (!isTarget) return undefined;
    return <DropIndicator target={target} />;
  };
}

type KeyAccessor = Key | null | undefined | Accessor<Key | null | undefined>;

interface SelectionManagerLike {
  focusedKey?: KeyAccessor;
}

interface CollectionLike {
  getKeyAfter: (key: Key) => Key | null;
  getItem: (key: Key) => { level?: number; type?: string } | null | undefined;
}

interface DroppableCollectionStateLike {
  target?: DropTarget | null;
}

function resolveKey(value: KeyAccessor): Key | null | undefined {
  if (typeof value === 'function') {
    return (value as Accessor<Key | null | undefined>)();
  }
  return value;
}

function getAfterDropNormalizedKey(
  target: ItemDropTarget,
  collection?: CollectionLike
): Key {
  if (target.dropPosition !== 'after' || !collection) return target.key;

  let nextKey = collection.getKeyAfter(target.key);
  let lastDescendantKey: Key | null = null;

  if (nextKey != null) {
    const targetLevel = collection.getItem(target.key)?.level ?? 0;
    while (nextKey != null) {
      const node = collection.getItem(nextKey);
      if (!node) break;
      if (node.type && node.type !== 'item') {
        nextKey = collection.getKeyAfter(nextKey);
        continue;
      }
      if ((node.level ?? 0) <= targetLevel) break;
      lastDescendantKey = nextKey;
      nextKey = collection.getKeyAfter(nextKey);
    }
  }

  return nextKey ?? lastDescendantKey ?? target.key;
}

export function useDndPersistedKeys(
  selectionManager: SelectionManagerLike | null | undefined,
  dragAndDropHooks?: Pick<DragAndDropHooks<unknown>, 'isVirtualDragging'>,
  dropState?: DroppableCollectionStateLike,
  collection?: CollectionLike
): Accessor<Set<Key>> {
  return createMemo(() => {
    const focusedKey = resolveKey(selectionManager?.focusedKey);
    let dropTargetKey: Key | null | undefined;

    if (dragAndDropHooks?.isVirtualDragging?.() && dropState?.target?.type === 'item') {
      dropTargetKey = getAfterDropNormalizedKey(dropState.target, collection);
    }

    const keys = new Set<Key>();
    if (focusedKey != null) keys.add(focusedKey);
    if (dropTargetKey != null) keys.add(dropTargetKey);
    return keys;
  });
}

export type DropTargetDelegate = {
  getDropTargetFromPoint: (
    x: number,
    y: number,
    isValidDropTarget: (target: DropTarget) => boolean
  ) => DropTarget | null;
  getDropOperation: (
    target: DropTarget,
    types: DragTypes,
    allowedOperations: DropOperation[]
  ) => DropOperation;
};
