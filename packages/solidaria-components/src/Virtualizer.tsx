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
}

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
  class?: string;
  style?: string | JSX.CSSProperties;
}

function getObjectValue<T extends object, K extends keyof T>(
  value: T | undefined,
  key: K
): T[K] | undefined {
  return value?.[key];
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
    'class',
    'style',
  ]);
  const [scrollOffset, setScrollOffset] = createSignal(0);
  const [measuredViewportSize, setMeasuredViewportSize] = createSignal(0);
  const [measuredViewportWidth, setMeasuredViewportWidth] = createSignal(0);
  let containerRef: HTMLDivElement | undefined;

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
    if (layoutResult) return layoutResult;
    return calculateLinearVisibleRange(itemCount, ctx.scrollOffset, ctx.viewportSize, itemSize(), ctx.overscan);
  };
  const getLayoutInfo = (index: number): LayoutInfo => {
    const ctx: VirtualizerLayoutInfoContext = {
      viewportWidth: measuredViewportWidth(),
    };
    const layoutResult = resolvedLayout().getLayoutInfo?.(index, ctx, resolvedLayoutOptions());
    if (layoutResult) return layoutResult;
    return {
      key: String(index),
      index,
      rect: {
        x: 0,
        y: index * itemSize(),
        width: Math.max(0, measuredViewportWidth()),
        height: itemSize(),
      },
    };
  };

  const contextValue = createMemo<VirtualizerContextValue<O>>(() => ({
    layout: resolvedLayout(),
    layoutOptions: resolvedLayoutOptions(),
    isVirtualized: true,
    getVisibleRange,
    getLayoutInfo,
  }));
  const collectionRenderer = createMemo<CollectionRendererContextValue<unknown>>(() => ({
    renderItem: (item) => item as JSX.Element,
    isVirtualized: true,
    layoutDelegate: resolvedLayout(),
    renderDropIndicator: local.renderDropIndicator,
  }));

  const filteredDomProps = createMemo(() => filterDOMProps(domProps, { global: true }));

  const updateViewportSize = () => {
    if (!containerRef) return;
    setMeasuredViewportSize(containerRef.clientHeight);
    setMeasuredViewportWidth(containerRef.clientWidth);
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
              setScrollOffset(target.scrollTop);
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
  LayoutInfo,
  Rect,
  Size,
  Point,
};
