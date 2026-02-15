import type { Accessor } from 'solid-js';
import type { DropTarget } from '@proyecto-viviana/solid-stately';

type Direction = 'ltr' | 'rtl';
type Orientation = 'horizontal' | 'vertical';
type Layout = 'stack' | 'grid';

interface CollectionNodeLike {
  key: string | number;
  type?: string;
}

export interface ListDropTargetDelegateOptions {
  layout?: Layout;
  orientation?: Orientation;
  direction?: Direction;
}

const cssEscape = (value: string): string => {
  const css = (globalThis as { CSS?: { escape?: (input: string) => string } }).CSS;
  return css?.escape ? css.escape(value) : value.replace(/[^a-zA-Z0-9_-]/g, '\\$&');
};

export class ListDropTargetDelegate {
  private collection: Iterable<CollectionNodeLike> | (() => Iterable<CollectionNodeLike>);
  private ref: Accessor<HTMLElement | null>;
  private layout: Layout;
  private orientation: Orientation;
  private direction: Direction;

  constructor(
    collection: Iterable<CollectionNodeLike> | (() => Iterable<CollectionNodeLike>),
    ref: Accessor<HTMLElement | null>,
    options?: ListDropTargetDelegateOptions
  ) {
    this.collection = collection;
    this.ref = ref;
    this.layout = options?.layout ?? 'stack';
    this.orientation = options?.orientation ?? 'vertical';
    this.direction = options?.direction ?? 'ltr';
  }

  private getCollection(): Iterable<CollectionNodeLike> {
    return typeof this.collection === 'function'
      ? (this.collection as () => Iterable<CollectionNodeLike>)()
      : this.collection;
  }

  private getPrimaryStart(rect: DOMRect): number {
    return this.orientation === 'horizontal' ? rect.left : rect.top;
  }

  private getPrimaryEnd(rect: DOMRect): number {
    return this.orientation === 'horizontal' ? rect.right : rect.bottom;
  }

  private getSecondaryStart(rect: DOMRect): number {
    return this.orientation === 'horizontal' ? rect.top : rect.left;
  }

  private getSecondaryEnd(rect: DOMRect): number {
    return this.orientation === 'horizontal' ? rect.bottom : rect.right;
  }

  private getFlowStart(rect: DOMRect): number {
    return this.layout === 'stack' ? this.getPrimaryStart(rect) : this.getSecondaryStart(rect);
  }

  private getFlowEnd(rect: DOMRect): number {
    return this.layout === 'stack' ? this.getPrimaryEnd(rect) : this.getSecondaryEnd(rect);
  }

  private getFlowSize(rect: DOMRect): number {
    return this.getFlowEnd(rect) - this.getFlowStart(rect);
  }

  getDropTargetFromPoint(
    x: number,
    y: number,
    isValidDropTarget: (target: DropTarget) => boolean
  ): DropTarget {
    const root = this.ref();
    if (!root) {
      return { type: 'root' };
    }

    const allItems = [...this.getCollection()].filter((item) => item.type === 'item');
    if (allItems.length === 0) {
      return { type: 'root' };
    }

    const collectionId = root.dataset.collection;
    const selector = collectionId
      ? `[data-collection="${cssEscape(collectionId)}"]`
      : '[data-key]';
    const elements = root.querySelectorAll(selector);
    const elementMap = new Map<string, HTMLElement>();
    for (const node of elements) {
      if (node instanceof HTMLElement && node.dataset.key != null) {
        elementMap.set(node.dataset.key, node);
      }
    }

    let low = 0;
    let high = allItems.length;
    const rootRect = root.getBoundingClientRect();
    let primary = this.orientation === 'horizontal' ? x : y;
    let secondary = this.orientation === 'horizontal' ? y : x;
    primary += this.getPrimaryStart(rootRect);
    secondary += this.getSecondaryStart(rootRect);

    const flow = this.layout === 'stack' ? primary : secondary;
    const isPrimaryRtl = this.orientation === 'horizontal' && this.direction === 'rtl';
    const isSecondaryRtl = this.layout === 'grid' && this.orientation === 'vertical' && this.direction === 'rtl';
    const isFlowRtl = this.layout === 'stack' ? isPrimaryRtl : isSecondaryRtl;

    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      const item = allItems[mid];
      const element = elementMap.get(String(item.key));
      if (!element) break;
      const rect = element.getBoundingClientRect();
      const update = (isGreater: boolean) => {
        if (isGreater) {
          low = mid + 1;
        } else {
          high = mid;
        }
      };

      if (primary < this.getPrimaryStart(rect)) {
        update(isPrimaryRtl);
      } else if (primary > this.getPrimaryEnd(rect)) {
        update(!isPrimaryRtl);
      } else if (secondary < this.getSecondaryStart(rect)) {
        update(isSecondaryRtl);
      } else if (secondary > this.getSecondaryEnd(rect)) {
        update(!isSecondaryRtl);
      } else {
        const target: DropTarget = {
          type: 'item',
          key: item.key,
          dropPosition: 'on',
        };

        if (isValidDropTarget(target)) {
          if (flow <= this.getFlowStart(rect) + 5 && isValidDropTarget({ ...target, dropPosition: 'before' })) {
            target.dropPosition = isFlowRtl ? 'after' : 'before';
          } else if (flow >= this.getFlowEnd(rect) - 5 && isValidDropTarget({ ...target, dropPosition: 'after' })) {
            target.dropPosition = isFlowRtl ? 'before' : 'after';
          }
        } else {
          const midpoint = this.getFlowStart(rect) + this.getFlowSize(rect) / 2;
          if (flow <= midpoint && isValidDropTarget({ ...target, dropPosition: 'before' })) {
            target.dropPosition = isFlowRtl ? 'after' : 'before';
          } else if (flow >= midpoint && isValidDropTarget({ ...target, dropPosition: 'after' })) {
            target.dropPosition = isFlowRtl ? 'before' : 'after';
          }
        }

        return target;
      }
    }

    const item = allItems[Math.min(low, allItems.length - 1)];
    const element = elementMap.get(String(item.key));
    const rect = element?.getBoundingClientRect();
    if (
      rect &&
      (primary < this.getPrimaryStart(rect) ||
        Math.abs(flow - this.getFlowStart(rect)) < Math.abs(flow - this.getFlowEnd(rect)))
    ) {
      return {
        type: 'item',
        key: item.key,
        dropPosition: isFlowRtl ? 'after' : 'before',
      };
    }

    return {
      type: 'item',
      key: item.key,
      dropPosition: isFlowRtl ? 'before' : 'after',
    };
  }
}
