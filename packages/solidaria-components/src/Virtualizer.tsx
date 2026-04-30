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
} from "solid-js";
import type {
  DragTypes,
  DropOperation,
  DropTarget,
  ItemDropTarget,
} from "@proyecto-viviana/solid-stately";
import { CollectionRendererContext, type CollectionRendererContextValue } from "./Collection";
import { filterDOMProps } from "./utils";
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
} from "./VirtualizerLayouts";

export interface LayoutOptionsDelegate<O> {
  useLayoutOptions?(): O;
}

export interface VirtualizerLayout<O = unknown> extends LayoutOptionsDelegate<O> {
  getVisibleRange?(context: VirtualizerRangeContext, options?: O): VirtualizerVisibleRange;
  getLayoutInfo?(index: number, context: VirtualizerLayoutInfoContext, options?: O): LayoutInfo;
  getDropTargetFromPoint?(
    point: Point,
    itemCount: number,
    options?: O,
  ): VirtualizerDropTarget | null;
}

export interface VirtualizerLayoutClass<O> {
  new (): VirtualizerLayout<O>;
}

export type VirtualizerKeyboardNavigationOverride = (
  target: DropTarget | null,
  direction: "next" | "previous",
  isValidDropTarget: (target: DropTarget) => boolean,
) => DropTarget | null;

export interface VirtualizerContextValue<O = unknown> {
  layout: VirtualizerLayout<O>;
  layoutOptions?: O;
  isVirtualized: boolean;
  getVisibleRange: (itemCount: number) => VirtualizerVisibleRange;
  getLayoutInfo: (index: number) => LayoutInfo;
  getDropTargetFromPoint: (point: Point, itemCount: number) => VirtualizerDropTarget | null;
  setDropTargetResolver: (resolver: VirtualizerDropTargetResolver | undefined) => void;
  setDropTargetItemCountResolver: (resolver: (() => number) | undefined) => void;
  setDropTargetIndexResolver: (
    resolver: ((key: string | number) => number | null) | undefined,
  ) => void;
  setDropOperationResolver: (resolver: VirtualizerDropOperationResolver | undefined) => void;
  setKeyboardNavigationOverride: (
    override: VirtualizerKeyboardNavigationOverride | undefined,
  ) => void;
  getBaseKeyboardNavigationTarget: VirtualizerKeyboardNavigationOverride;
}

export type VirtualizerDropTargetResolver = (
  target: VirtualizerDropTarget,
) => VirtualizerDropTarget;
export type VirtualizerDropOperationResolver = (
  target: DropTarget,
  types: DragTypes,
  allowedOperations: DropOperation[],
) => DropOperation;

export const VirtualizerContext = createContext<VirtualizerContextValue<unknown> | null>(null);

export function useVirtualizerContext<O>(): VirtualizerContextValue<O> | null {
  return useContext(VirtualizerContext) as VirtualizerContextValue<O> | null;
}

export interface VirtualizerProps<O> extends Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  "children" | "class" | "style"
> {
  /** The child collection to virtualize (e.g. ListBox, GridList, or Table). */
  children: JSX.Element;
  /** Layout object or constructor for layout behavior and options delegation. */
  layout: VirtualizerLayoutClass<O> | VirtualizerLayout<O>;
  /** Layout options consumed by the layout implementation. */
  layoutOptions?: O;
  /** Optional renderer for collection drop indicators in virtualized flows. */
  renderDropIndicator?: (
    index: number,
    position: "before" | "after" | "on",
  ) => JSX.Element | undefined;
  /** Optional operation resolver for collection drop target operations. */
  getDropOperation?: VirtualizerDropOperationResolver;
  class?: string;
  style?: string | JSX.CSSProperties;
}

function getObjectValue<T extends object, K extends keyof T>(
  value: T | undefined,
  key: K,
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
    "children",
    "layout",
    "layoutOptions",
    "renderDropIndicator",
    "getDropOperation",
    "class",
    "style",
  ]);
  const [scrollOffset, setScrollOffset] = createSignal(0);
  const [measuredViewportSize, setMeasuredViewportSize] = createSignal(0);
  const [measuredViewportWidth, setMeasuredViewportWidth] = createSignal(0);
  const [dropTargetResolver, setDropTargetResolver] = createSignal<
    VirtualizerDropTargetResolver | undefined
  >(undefined);
  const [dropTargetItemCountResolver, setDropTargetItemCountResolver] = createSignal<
    (() => number) | undefined
  >(undefined);
  const [dropTargetIndexResolver, setDropTargetIndexResolver] = createSignal<
    ((key: string | number) => number | null) | undefined
  >(undefined);
  const [dropOperationResolver, setDropOperationResolver] = createSignal<
    VirtualizerDropOperationResolver | undefined
  >(undefined);
  const [keyboardNavigationOverride, setKeyboardNavigationOverride] = createSignal<
    VirtualizerKeyboardNavigationOverride | undefined
  >(undefined);
  let containerRef: HTMLDivElement | undefined;
  const fallbackLayout = new ListLayout();
  const visibleRangeCache = new Map<number, VirtualizerVisibleRange>();
  const layoutInfoCache = new Map<number, LayoutInfo>();

  const layout = createMemo<VirtualizerLayout<O>>(() => {
    if (typeof local.layout === "function") {
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

  const virtualOptions = createMemo(
    () => resolvedLayoutOptions() as DefaultVirtualizerLayoutOptions | undefined,
  );
  const layoutOptionsWithViewport = createMemo(() => {
    const options = resolvedLayoutOptions();
    if (options && typeof options === "object") {
      return {
        ...(options as Record<string, unknown>),
        viewportWidth: measuredViewportWidth(),
      } as O;
    }
    return { viewportWidth: measuredViewportWidth() } as O;
  });
  const itemSize = createMemo(() => getObjectValue(virtualOptions(), "itemSize") ?? 40);
  const overscan = createMemo(() => getObjectValue(virtualOptions(), "overscan") ?? 2);
  const viewportSize = createMemo(
    () => getObjectValue(virtualOptions(), "viewportSize") ?? measuredViewportSize() ?? 0,
  );

  const getVisibleRange = (itemCount: number): VirtualizerVisibleRange => {
    const ctx: VirtualizerRangeContext = {
      itemCount,
      scrollOffset: scrollOffset(),
      viewportSize: viewportSize(),
      overscan: overscan(),
      viewportWidth: measuredViewportWidth(),
    };
    const layoutResult = resolvedLayout().getVisibleRange?.(ctx, layoutOptionsWithViewport());
    const nextRange =
      layoutResult ??
      calculateLinearVisibleRange(
        itemCount,
        ctx.scrollOffset,
        ctx.viewportSize,
        itemSize(),
        ctx.overscan,
      );
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
    const layoutResult = resolvedLayout().getLayoutInfo?.(index, ctx, layoutOptionsWithViewport());
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
  const getDropTargetFromPoint = (
    point: Point,
    itemCount: number,
  ): VirtualizerDropTarget | null => {
    const target =
      resolvedLayout().getDropTargetFromPoint?.(point, itemCount, layoutOptionsWithViewport()) ??
      fallbackLayout.getDropTargetFromPoint(point, itemCount, virtualOptions());
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
  const assignDropTargetIndexResolver = (
    resolver: ((key: string | number) => number | null) | undefined,
  ): void => {
    setDropTargetIndexResolver(() => resolver);
  };
  const assignDropOperationResolver = (
    resolver: VirtualizerDropOperationResolver | undefined,
  ): void => {
    setDropOperationResolver(() => resolver);
  };
  const assignKeyboardNavigationOverride = (
    override: VirtualizerKeyboardNavigationOverride | undefined,
  ): void => {
    setKeyboardNavigationOverride(() => override);
  };
  const toCollectionDropTarget = (target: VirtualizerDropTarget): DropTarget => {
    if (target.type === "root") return { type: "root" };
    const key = target.key ?? target.index;
    return {
      type: "item",
      key,
      dropPosition: target.position,
    } as ItemDropTarget;
  };
  const getCollectionDropTargetFromPoint = (
    x: number,
    y: number,
    isValidDropTarget: (target: DropTarget) => boolean,
  ): DropTarget | null => {
    const itemCount = dropTargetItemCountResolver()?.() ?? 0;
    const virtualTarget = getDropTargetFromPoint({ x, y }, itemCount);
    if (!virtualTarget) return null;
    const mappedTarget = toCollectionDropTarget(virtualTarget);
    if (isValidDropTarget(mappedTarget)) return mappedTarget;
    if (mappedTarget.type === "item") {
      const alternatePositions: Array<"before" | "after" | "on"> =
        mappedTarget.dropPosition === "on"
          ? ["before", "after"]
          : mappedTarget.dropPosition === "before"
            ? ["on", "after"]
            : ["on", "before"];
      for (const position of alternatePositions) {
        const alternateTarget: DropTarget = {
          ...mappedTarget,
          dropPosition: position,
        };
        if (isValidDropTarget(alternateTarget)) return alternateTarget;
      }
      const rootTarget: DropTarget = { type: "root" };
      if (isValidDropTarget(rootTarget)) return rootTarget;
    }
    return null;
  };
  const getCollectionDropOperation = (
    target: DropTarget,
    types: DragTypes,
    allowedOperations: DropOperation[],
  ): DropOperation => {
    const resolver = dropOperationResolver() ?? local.getDropOperation;
    if (resolver) return resolver(target, types, allowedOperations);
    if (allowedOperations.length === 0) return "cancel";
    if (target.type === "root") {
      if (allowedOperations.includes("copy")) return "copy";
      if (allowedOperations.includes("move")) return "move";
    } else if (target.dropPosition === "on") {
      if (allowedOperations.includes("copy")) return "copy";
      if (allowedOperations.includes("move")) return "move";
    } else {
      if (allowedOperations.includes("move")) return "move";
      if (allowedOperations.includes("copy")) return "copy";
    }
    if (allowedOperations.includes("link")) return "link";
    return allowedOperations.find((operation) => operation !== "cancel") ?? "cancel";
  };
  const getBaseKeyboardNavigationTarget = (
    target: DropTarget | null,
    direction: "next" | "previous",
    isValidDropTarget: (target: DropTarget) => boolean,
  ): DropTarget | null => {
    const itemCount = dropTargetItemCountResolver()?.() ?? 0;
    if (itemCount <= 0) {
      const rootTarget: DropTarget = { type: "root" };
      return isValidDropTarget(rootTarget) ? rootTarget : null;
    }

    const resolveCurrentIndex = (currentTarget: DropTarget | null): number | null => {
      if (!currentTarget || currentTarget.type === "root") return null;
      const resolver = dropTargetIndexResolver();
      if (resolver) {
        const fromResolver = resolver(currentTarget.key);
        if (fromResolver != null && fromResolver >= 0 && fromResolver < itemCount)
          return fromResolver;
        return null;
      }
      if (
        typeof currentTarget.key === "number" &&
        currentTarget.key >= 0 &&
        currentTarget.key < itemCount
      ) {
        return currentTarget.key;
      }
      return null;
    };
    const getCurrentIndex = (currentTarget: DropTarget | null): number => {
      if (!currentTarget || currentTarget.type === "root") {
        return direction === "next" ? -1 : itemCount;
      }
      const resolvedIndex = resolveCurrentIndex(currentTarget);
      if (resolvedIndex != null) return resolvedIndex;
      return direction === "next" ? -1 : itemCount;
    };
    const tryCurrentItemTransition = (currentTarget: DropTarget | null): DropTarget | null => {
      if (!currentTarget || currentTarget.type !== "item") return null;
      const tryPosition = (position: "before" | "on" | "after"): DropTarget | null => {
        if (currentTarget.dropPosition === position) return null;
        const nextTarget: DropTarget = {
          type: "item",
          key: currentTarget.key,
          dropPosition: position,
        };
        return isValidDropTarget(nextTarget) ? nextTarget : null;
      };

      if (direction === "next") {
        if (currentTarget.dropPosition === "before") {
          return tryPosition("on") ?? tryPosition("after");
        }
        if (currentTarget.dropPosition === "on") {
          return tryPosition("after");
        }
      } else {
        if (currentTarget.dropPosition === "after") {
          return tryPosition("on") ?? tryPosition("before");
        }
        if (currentTarget.dropPosition === "on") {
          return tryPosition("before");
        }
      }

      return null;
    };
    const scanFromIndex = (
      startIndex: number,
      step: number,
      directionForInsertion: "next" | "previous",
    ): DropTarget | null => {
      for (let index = startIndex; index >= 0 && index < itemCount; index += step) {
        const onTarget = tryTarget(index, "on");
        if (onTarget) return onTarget;

        const insertionOrder: Array<"before" | "after"> =
          directionForInsertion === "next" ? ["before", "after"] : ["after", "before"];
        for (const position of insertionOrder) {
          const insertionTarget = tryTarget(index, position);
          if (insertionTarget) return insertionTarget;
        }
      }
      return null;
    };
    const findNavigationTarget = (currentIndex: number, step = 1): DropTarget | null => {
      const delta = direction === "next" ? 1 : -1;
      const stepSize = Math.max(1, step);
      const nextStart = currentIndex + delta * stepSize;
      const clampedStart = Math.max(0, Math.min(itemCount - 1, nextStart));
      if (nextStart < 0 || nextStart >= itemCount) {
        const rootTarget: DropTarget = { type: "root" };
        return isValidDropTarget(rootTarget) ? rootTarget : null;
      }
      const primaryTarget = scanFromIndex(clampedStart, delta, direction);
      if (primaryTarget) return primaryTarget;
      const oppositeDirection: "next" | "previous" = direction === "next" ? "previous" : "next";
      const oppositeTarget = scanFromIndex(clampedStart - delta, -delta, oppositeDirection);
      if (oppositeTarget) return oppositeTarget;

      const rootTarget: DropTarget = { type: "root" };
      return isValidDropTarget(rootTarget) ? rootTarget : null;
    };
    const tryTarget = (index: number, position: "on" | "before" | "after"): DropTarget | null => {
      const layoutInfo = getLayoutInfo(index);
      const virtualTarget = getDropTargetFromPoint(
        {
          x: layoutInfo.rect.x + 1,
          y: layoutInfo.rect.y + layoutInfo.rect.height / 2,
        },
        itemCount,
      );
      if (!virtualTarget || virtualTarget.type === "root") return null;
      const nextTarget = toCollectionDropTarget({ ...virtualTarget, position });
      return isValidDropTarget(nextTarget) ? nextTarget : null;
    };
    const tryBoundaryTarget = (boundaryDirection: "next" | "previous"): DropTarget | null => {
      const boundaryIndex = boundaryDirection === "next" ? 0 : itemCount - 1;
      const boundaryOrder: Array<"before" | "on" | "after"> =
        boundaryDirection === "next" ? ["before", "on", "after"] : ["after", "on", "before"];
      for (const position of boundaryOrder) {
        const candidate = tryTarget(boundaryIndex, position);
        if (candidate) return candidate;
      }
      return null;
    };
    const directTransition =
      resolveCurrentIndex(target) != null ? tryCurrentItemTransition(target) : null;
    if (directTransition) return directTransition;
    if (!target || target.type === "root") {
      const boundaryTarget = tryBoundaryTarget(direction);
      if (boundaryTarget) return boundaryTarget;
      const rootTarget: DropTarget = { type: "root" };
      return isValidDropTarget(rootTarget) ? rootTarget : null;
    }
    const currentIndex = getCurrentIndex(target);
    const nextStart = currentIndex + (direction === "next" ? 1 : -1);
    if (nextStart < 0 || nextStart >= itemCount) {
      const rootTarget: DropTarget = { type: "root" };
      if (isValidDropTarget(rootTarget)) return rootTarget;
      const wrappedBoundary = tryBoundaryTarget(direction);
      if (wrappedBoundary) return wrappedBoundary;
      return null;
    }
    return findNavigationTarget(currentIndex, 1);
  };
  const getKeyboardNavigationTarget = (
    target: DropTarget | null,
    direction: "next" | "previous",
    isValidDropTarget: (target: DropTarget) => boolean,
  ): DropTarget | null => {
    // If a collection component (e.g. Tree) has installed a keyboard navigation override,
    // delegate to it. This enables collection-aware navigation (tree branch traversal, etc.).
    const override = keyboardNavigationOverride();
    if (override) {
      return override(target, direction, isValidDropTarget);
    }
    return getBaseKeyboardNavigationTarget(target, direction, isValidDropTarget);
  };
  const getKeyboardPageNavigationTarget = (
    target: DropTarget | null,
    direction: "next" | "previous",
    isValidDropTarget: (target: DropTarget) => boolean,
  ): DropTarget | null => {
    const itemCount = dropTargetItemCountResolver()?.() ?? 0;
    if (itemCount <= 0) {
      const rootTarget: DropTarget = { type: "root" };
      return isValidDropTarget(rootTarget) ? rootTarget : null;
    }
    if (!target || target.type === "root") {
      const startIndex = direction === "next" ? 0 : itemCount - 1;
      const delta = direction === "next" ? 1 : -1;
      const boundaryOrder: Array<"before" | "on" | "after"> =
        direction === "next" ? ["before", "on", "after"] : ["after", "on", "before"];
      for (let index = startIndex; index >= 0 && index < itemCount; index += delta) {
        const layoutInfo = getLayoutInfo(index);
        const virtualTarget = getDropTargetFromPoint(
          {
            x: layoutInfo.rect.x + 1,
            y: layoutInfo.rect.y + layoutInfo.rect.height / 2,
          },
          itemCount,
        );
        if (!virtualTarget || virtualTarget.type === "root") continue;
        for (const position of boundaryOrder) {
          const candidate = toCollectionDropTarget({ ...virtualTarget, position });
          if (isValidDropTarget(candidate)) return candidate;
        }
      }
      const rootTarget: DropTarget = { type: "root" };
      return isValidDropTarget(rootTarget) ? rootTarget : null;
    }
    const resolver = dropTargetIndexResolver();
    const resolvedIndex = resolver?.(target.key);
    const currentIndex =
      resolvedIndex != null
        ? resolvedIndex
        : resolver
          ? direction === "next"
            ? -1
            : itemCount
          : typeof target.key === "number"
            ? target.key
            : direction === "next"
              ? -1
              : itemCount;
    const pageSize = Math.max(1, Math.floor(viewportSize() / Math.max(1, itemSize())));
    const delta = direction === "next" ? 1 : -1;
    const nextStart = currentIndex + delta * pageSize;
    const clampedStart = Math.max(0, Math.min(itemCount - 1, nextStart));
    const tryTarget = (index: number, position: "on" | "before" | "after"): DropTarget | null => {
      const layoutInfo = getLayoutInfo(index);
      const virtualTarget = getDropTargetFromPoint(
        {
          x: layoutInfo.rect.x + 1,
          y: layoutInfo.rect.y + layoutInfo.rect.height / 2,
        },
        itemCount,
      );
      if (!virtualTarget || virtualTarget.type === "root") return null;
      const nextTarget = toCollectionDropTarget({ ...virtualTarget, position });
      return isValidDropTarget(nextTarget) ? nextTarget : null;
    };
    const scanFromIndex = (startIndex: number, step: number): DropTarget | null => {
      const insertionOrder: Array<"before" | "after"> =
        step > 0 ? ["before", "after"] : ["after", "before"];
      for (let index = startIndex; index >= 0 && index < itemCount; index += step) {
        const onTarget = tryTarget(index, "on");
        if (onTarget) return onTarget;
        for (const position of insertionOrder) {
          const insertionTarget = tryTarget(index, position);
          if (insertionTarget) return insertionTarget;
        }
      }
      return null;
    };
    if (nextStart < 0 || nextStart >= itemCount) {
      if (direction === "next") {
        const endBoundaryTarget =
          tryTarget(itemCount - 1, "after") ??
          tryTarget(itemCount - 1, "on") ??
          tryTarget(itemCount - 1, "before");
        if (endBoundaryTarget) return endBoundaryTarget;
        const backwardFallback = scanFromIndex(itemCount - 1, -1);
        if (backwardFallback) return backwardFallback;
      } else {
        if (currentIndex <= 0) {
          const rootTarget: DropTarget = { type: "root" };
          if (isValidDropTarget(rootTarget)) return rootTarget;
        }
        const startBoundaryTarget =
          tryTarget(0, "before") ?? tryTarget(0, "on") ?? tryTarget(0, "after");
        if (startBoundaryTarget) return startBoundaryTarget;
        const forwardFallback = scanFromIndex(0, 1);
        if (forwardFallback) return forwardFallback;
      }

      const rootTarget: DropTarget = { type: "root" };
      return isValidDropTarget(rootTarget) ? rootTarget : null;
    }
    const primaryTarget = scanFromIndex(clampedStart, delta);
    if (primaryTarget) return primaryTarget;
    const oppositeTarget = scanFromIndex(clampedStart - delta, -delta);
    if (oppositeTarget) return oppositeTarget;

    const rootTarget: DropTarget = { type: "root" };
    return isValidDropTarget(rootTarget) ? rootTarget : null;
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
    setDropTargetIndexResolver: assignDropTargetIndexResolver,
    setDropOperationResolver: assignDropOperationResolver,
    setKeyboardNavigationOverride: assignKeyboardNavigationOverride,
    getBaseKeyboardNavigationTarget,
  }));
  const collectionRenderer = createMemo<CollectionRendererContextValue<unknown>>(() => ({
    renderItem: (item) => item as JSX.Element,
    isVirtualized: true,
    layoutDelegate: resolvedLayout(),
    dropTargetDelegate: {
      getDropTargetFromPoint: getCollectionDropTargetFromPoint,
      getDropOperation: getCollectionDropOperation,
      getKeyboardNavigationTarget,
      getKeyboardPageNavigationTarget,
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
    window.addEventListener("resize", handleResize);
    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => updateViewportSize()) : null;
    if (containerRef && resizeObserver) {
      resizeObserver.observe(containerRef);
    }
    onCleanup(() => {
      window.removeEventListener("resize", handleResize);
      resizeObserver?.disconnect();
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

export { ListLayout, GridLayout, WaterfallLayout, TableLayout };

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
