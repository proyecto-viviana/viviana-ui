/**
 * Virtualizer primitive for solidaria-components.
 *
 * Phase 1 parity: provides RAC-like API and context contract with
 * a safe non-virtualized fallback render path.
 */

import {
  type JSX,
  createContext,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  splitProps,
  useContext,
} from 'solid-js';
import type { DragTypes, DropOperation, DropTarget, ItemDropTarget } from '@proyecto-viviana/solid-stately';
import { CollectionRendererContext, type CollectionRendererContextValue } from './Collection';
import { filterDOMProps } from './utils';
import {
  GridLayout,
  ListLayout,
  TableLayout,
  WaterfallLayout,
  calculateLinearVisibleRange,
  type DefaultVirtualizerLayoutOptions,
  type GridLayoutOptions,
  type LayoutInfo,
  type Point,
  type Rect,
  type Size,
  type VirtualizerRangeContext,
  type VirtualizerLayoutInfoContext,
  type VirtualizerDropTarget,
  type VirtualizerVisibleRange,
  type WaterfallLayoutOptions,
} from './VirtualizerLayouts';

export interface LayoutOptionsDelegate<O> {
  useLayoutOptions?(): O;
}

export interface VirtualizerLayout<O = unknown> extends LayoutOptionsDelegate<O> {
  getVisibleRange?(
    context: VirtualizerRangeContext,
    options?: O
  ): VirtualizerVisibleRange;
  getLayoutInfo?(
    index: number,
    context: VirtualizerLayoutInfoContext,
    options?: O
  ): LayoutInfo;
  getDropTargetFromPoint?(
    point: Point,
    itemCount: number,
    options?: O
  ): VirtualizerDropTarget | null;
}

export interface VirtualizerLayoutClass<O> {
  new (): VirtualizerLayout<O>;
}

export interface VirtualizerContextValue<O = unknown> {
  layout: VirtualizerLayout<O>;
  layoutOptions?: O;
  isVirtualized: boolean;
  getVisibleRange: (itemCount: number) => VirtualizerVisibleRange;
  getLayoutInfo: (index: number) => LayoutInfo;
  getDropTargetFromPoint: (point: Point, itemCount: number) => VirtualizerDropTarget | null;
  setDropTargetResolver: ((resolver: VirtualizerDropTargetResolver | undefined) => void);
  setDropTargetItemCountResolver: ((resolver: (() => number) | undefined) => void);
  setDropOperationResolver: ((resolver: VirtualizerDropOperationResolver | undefined) => void);
}

export type VirtualizerDropTargetResolver = (target: VirtualizerDropTarget) => VirtualizerDropTarget;
export type VirtualizerDropOperationResolver = (
  target: DropTarget,
  types: DragTypes,
  allowedOperations: DropOperation[]
) => DropOperation;

export const VirtualizerContext = createContext<VirtualizerContextValue<unknown> | null>(null);

export function useVirtualizerContext<O>(): VirtualizerContextValue<O> | null {
  return useContext(VirtualizerContext) as VirtualizerContextValue<O> | null;
}

export interface VirtualizerProps<O>
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children' | 'class' | 'style'> {
  /** The child collection to virtualize (e.g. ListBox, GridList, or Table). */
  children: JSX.Element;
  /** Layout object or constructor for layout behavior and options delegation. */
  layout: VirtualizerLayoutClass<O> | VirtualizerLayout<O>;
  /** Layout options consumed by the layout implementation. */
  layoutOptions?: O;
  /** Optional renderer for collection drop indicators in virtualized flows. */
  renderDropIndicator?: (index: number, position: 'before' | 'after' | 'on') => JSX.Element | undefined;
  /** Optional operation resolver for collection drop target operations. */
  getDropOperation?: VirtualizerDropOperationResolver;
  class?: string;
  style?: string | JSX.CSSProperties;
}

function getObjectValue<T extends object, K extends keyof T>(
  value: T | undefined,
  key: K
): T[K] | undefined {
  return value?.[key];
}

function isSameRange(a: VirtualizerVisibleRange, b: VirtualizerVisibleRange): boolean {
  return (
    a.start === b.start &&
    a.end === b.end &&
    a.offsetTop === b.offsetTop &&
    a.offsetBottom === b.offsetBottom
  );
}

function isSameLayoutInfo(a: LayoutInfo, b: LayoutInfo): boolean {
  return (
    a.key === b.key &&
    a.index === b.index &&
    a.rect.x === b.rect.x &&
    a.rect.y === b.rect.y &&
    a.rect.width === b.rect.width &&
    a.rect.height === b.rect.height
  );
}

/**
 * A Virtualizer renders collection content under a virtualized layout contract.
 * Current implementation supports fixed-size visible range virtualization.
 */
export function Virtualizer<O>(props: VirtualizerProps<O>): JSX.Element {
  const [local, domProps] = splitProps(props, [
    'children',
    'layout',
    'layoutOptions',
    'renderDropIndicator',
    'getDropOperation',
    'class',
    'style',
  ]);
  const [scrollOffset, setScrollOffset] = createSignal(0);
  const [measuredViewportSize, setMeasuredViewportSize] = createSignal(0);
  const [measuredViewportWidth, setMeasuredViewportWidth] = createSignal(0);
  const [dropTargetResolver, setDropTargetResolver] = createSignal<VirtualizerDropTargetResolver | undefined>(
    undefined
  );
  const [dropTargetItemCountResolver, setDropTargetItemCountResolver] = createSignal<(() => number) | undefined>(
    undefined
  );
  const [dropOperationResolver, setDropOperationResolver] = createSignal<VirtualizerDropOperationResolver | undefined>(
    undefined
  );
  let containerRef: HTMLDivElement | undefined;
  const fallbackLayout = new ListLayout();
  const visibleRangeCache = new Map<number, VirtualizerVisibleRange>();
  const layoutInfoCache = new Map<number, LayoutInfo>();

  const layout = createMemo<VirtualizerLayout<O>>(() => {
    if (typeof local.layout === 'function') {
      return new local.layout();
    }
    return local.layout;
  });
  const resolvedLayout = createMemo<VirtualizerLayout<O>>(() => {
    return layout() ?? (new ListLayout() as VirtualizerLayout<O>);
  });

  const resolvedLayoutOptions = createMemo<O | undefined>(() => {
    const fromLayout = resolvedLayout().useLayoutOptions?.();
    if (local.layoutOptions && fromLayout) {
      return { ...local.layoutOptions, ...fromLayout };
    }
    return local.layoutOptions ?? fromLayout;
  });

  const virtualOptions = createMemo(() => resolvedLayoutOptions() as DefaultVirtualizerLayoutOptions | undefined);
  const itemSize = createMemo(() => getObjectValue(virtualOptions(), 'itemSize') ?? 40);
  const overscan = createMemo(() => getObjectValue(virtualOptions(), 'overscan') ?? 2);
  const viewportSize = createMemo(
    () => getObjectValue(virtualOptions(), 'viewportSize') ?? measuredViewportSize() ?? 0
  );

  const getVisibleRange = (itemCount: number): VirtualizerVisibleRange => {
    const ctx: VirtualizerRangeContext = {
      itemCount,
      scrollOffset: scrollOffset(),
      viewportSize: viewportSize(),
      overscan: overscan(),
      viewportWidth: measuredViewportWidth(),
    };
    const layoutResult = resolvedLayout().getVisibleRange?.(ctx, resolvedLayoutOptions());
    const nextRange =
      layoutResult ??
      calculateLinearVisibleRange(itemCount, ctx.scrollOffset, ctx.viewportSize, itemSize(), ctx.overscan);
    const cachedRange = visibleRangeCache.get(itemCount);
    if (cachedRange && isSameRange(cachedRange, nextRange)) {
      return cachedRange;
    }
    visibleRangeCache.set(itemCount, nextRange);
    return nextRange;
  };
  const getLayoutInfo = (index: number): LayoutInfo => {
    const ctx: VirtualizerLayoutInfoContext = {
      viewportWidth: measuredViewportWidth(),
    };
    const layoutResult = resolvedLayout().getLayoutInfo?.(index, ctx, resolvedLayoutOptions());
    const nextInfo = layoutResult ?? {
      key: String(index),
      index,
      rect: {
        x: 0,
        y: index * itemSize(),
        width: Math.max(0, measuredViewportWidth()),
        height: itemSize(),
      },
    };
    const cachedInfo = layoutInfoCache.get(index);
    if (cachedInfo && isSameLayoutInfo(cachedInfo, nextInfo)) {
      return cachedInfo;
    }
    layoutInfoCache.set(index, nextInfo);
    return nextInfo;
  };
  const getDropTargetFromPoint = (point: Point, itemCount: number): VirtualizerDropTarget | null => {
    const target = resolvedLayout().getDropTargetFromPoint?.(point, itemCount, resolvedLayoutOptions()) ??
      fallbackLayout.getDropTargetFromPoint(point, itemCount);
    if (!target) return null;
    const resolver = dropTargetResolver();
    return resolver ? resolver(target) : target;
  };
  const assignDropTargetResolver = (resolver: VirtualizerDropTargetResolver | undefined): void => {
    setDropTargetResolver(() => resolver);
  };
  const assignDropTargetItemCountResolver = (resolver: (() => number) | undefined): void => {
    setDropTargetItemCountResolver(() => resolver);
  };
  const assignDropOperationResolver = (resolver: VirtualizerDropOperationResolver | undefined): void => {
    setDropOperationResolver(() => resolver);
  };
  const toCollectionDropTarget = (target: VirtualizerDropTarget): DropTarget => {
    if (target.type === 'root') return { type: 'root' };
    const key = target.key ?? target.index;
    return {
      type: 'item',
      key,
      dropPosition: target.position,
    } as ItemDropTarget;
  };
  const getCollectionDropTargetFromPoint = (
    x: number,
    y: number,
    isValidDropTarget: (target: DropTarget) => boolean
  ): DropTarget | null => {
    const itemCount = dropTargetItemCountResolver()?.() ?? 0;
    const virtualTarget = getDropTargetFromPoint({ x, y }, itemCount);
    if (!virtualTarget) return null;
    const mappedTarget = toCollectionDropTarget(virtualTarget);
    if (isValidDropTarget(mappedTarget)) return mappedTarget;
    if (mappedTarget.type === 'item') {
      const rootTarget: DropTarget = { type: 'root' };
      if (isValidDropTarget(rootTarget)) return rootTarget;
    }
    return null;
  };
  const getCollectionDropOperation = (
    target: DropTarget,
    types: DragTypes,
    allowedOperations: DropOperation[]
  ): DropOperation => {
    const resolver = dropOperationResolver() ?? local.getDropOperation;
    if (resolver) return resolver(target, types, allowedOperations);
    if (allowedOperations.length === 0) return 'cancel';
    if (target.type === 'root') {
      if (allowedOperations.includes('copy')) return 'copy';
      if (allowedOperations.includes('move')) return 'move';
    } else if (target.dropPosition === 'on') {
      if (allowedOperations.includes('copy')) return 'copy';
      if (allowedOperations.includes('move')) return 'move';
    } else {
      if (allowedOperations.includes('move')) return 'move';
      if (allowedOperations.includes('copy')) return 'copy';
    }
    if (allowedOperations.includes('link')) return 'link';
    return allowedOperations.find((operation) => operation !== 'cancel') ?? 'cancel';
  };

  const contextValue = createMemo<VirtualizerContextValue<O>>(() => ({
    layout: resolvedLayout(),
    layoutOptions: resolvedLayoutOptions(),
    isVirtualized: true,
    getVisibleRange,
    getLayoutInfo,
    getDropTargetFromPoint,
    setDropTargetResolver: assignDropTargetResolver,
    setDropTargetItemCountResolver: assignDropTargetItemCountResolver,
    setDropOperationResolver: assignDropOperationResolver,
  }));
  const collectionRenderer = createMemo<CollectionRendererContextValue<unknown>>(() => ({
    renderItem: (item) => item as JSX.Element,
    isVirtualized: true,
    layoutDelegate: resolvedLayout(),
    dropTargetDelegate: {
      getDropTargetFromPoint: getCollectionDropTargetFromPoint,
      getDropOperation: getCollectionDropOperation,
    },
    renderDropIndicator: local.renderDropIndicator,
  }));

  const filteredDomProps = createMemo(() => filterDOMProps(domProps, { global: true }));

  const updateViewportSize = () => {
    if (!containerRef) return;
    const nextHeight = containerRef.clientHeight;
    const nextWidth = containerRef.clientWidth;
    if (nextHeight !== measuredViewportSize()) setMeasuredViewportSize(nextHeight);
    if (nextWidth !== measuredViewportWidth()) setMeasuredViewportWidth(nextWidth);
  };

  onMount(() => {
    updateViewportSize();
    const handleResize = () => updateViewportSize();
    window.addEventListener('resize', handleResize);
    onCleanup(() => {
      window.removeEventListener('resize', handleResize);
    });
  });

  let scrollFrame: number | undefined;
  onCleanup(() => {
    if (scrollFrame != null) cancelAnimationFrame(scrollFrame);
  });

  return (
    <CollectionRendererContext.Provider value={collectionRenderer()}>
      <VirtualizerContext.Provider value={contextValue()}>
        <div
          {...filteredDomProps()}
          ref={(el) => {
            containerRef = el;
          }}
          class={local.class}
          style={local.style}
          data-virtualizer
          onScroll={(e) => {
            const target = e.currentTarget as HTMLDivElement;
            if (scrollFrame != null) cancelAnimationFrame(scrollFrame);
            scrollFrame = requestAnimationFrame(() => {
              scrollFrame = undefined;
              if (target.scrollTop !== scrollOffset()) setScrollOffset(target.scrollTop);
              updateViewportSize();
            });
          }}
        >
          {local.children}
        </div>
      </VirtualizerContext.Provider>
    </CollectionRendererContext.Provider>
  );
}

export {
  ListLayout,
  GridLayout,
  WaterfallLayout,
  TableLayout,
};

export type {
  VirtualizerVisibleRange,
  VirtualizerRangeContext,
  DefaultVirtualizerLayoutOptions,
  GridLayoutOptions,
  WaterfallLayoutOptions,
  VirtualizerDropTarget,
  LayoutInfo,
  Rect,
  Size,
  Point,
};
