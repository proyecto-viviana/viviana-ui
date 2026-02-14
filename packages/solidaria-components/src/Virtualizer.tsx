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

export interface LayoutOptionsDelegate<O> {
  useLayoutOptions?(): O;
}

export interface VirtualizerLayout<O = unknown> extends LayoutOptionsDelegate<O> {}

export interface VirtualizerLayoutClass<O> {
  new (): VirtualizerLayout<O>;
}

export interface VirtualizerContextValue<O = unknown> {
  layout: VirtualizerLayout<O>;
  layoutOptions?: O;
  isVirtualized: boolean;
  getVisibleRange: (itemCount: number) => VirtualizerVisibleRange;
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
  class?: string;
  style?: string | JSX.CSSProperties;
}

export interface DefaultVirtualizerLayoutOptions {
  itemSize?: number;
  overscan?: number;
  viewportSize?: number;
}

export interface VirtualizerVisibleRange {
  start: number;
  end: number;
  offsetTop: number;
  offsetBottom: number;
}

function getObjectValue<T extends object, K extends keyof T>(
  value: T | undefined,
  key: K
): T[K] | undefined {
  return value?.[key];
}

function calculateVisibleRange(
  itemCount: number,
  scrollOffset: number,
  viewportSize: number,
  itemSize: number,
  overscan: number
): VirtualizerVisibleRange {
  if (itemCount <= 0) return { start: 0, end: 0, offsetTop: 0, offsetBottom: 0 };
  const safeItemSize = Math.max(1, itemSize);
  const safeViewport = Math.max(1, viewportSize);
  const safeOverscan = Math.max(0, overscan);

  const start = Math.max(0, Math.floor(scrollOffset / safeItemSize) - safeOverscan);
  const visibleCount = Math.ceil(safeViewport / safeItemSize) + safeOverscan * 2;
  const end = Math.min(itemCount, start + visibleCount);

  return {
    start,
    end,
    offsetTop: start * safeItemSize,
    offsetBottom: Math.max(0, (itemCount - end) * safeItemSize),
  };
}

/**
 * A Virtualizer renders collection content under a virtualized layout contract.
 * Current implementation supports fixed-size visible range virtualization.
 */
export function Virtualizer<O>(props: VirtualizerProps<O>): JSX.Element {
  const [local, domProps] = splitProps(props, ['children', 'layout', 'layoutOptions', 'class', 'style']);
  const [scrollOffset, setScrollOffset] = createSignal(0);
  const [measuredViewportSize, setMeasuredViewportSize] = createSignal(0);
  let containerRef: HTMLDivElement | undefined;

  const layout = createMemo<VirtualizerLayout<O>>(() => {
    if (typeof local.layout === 'function') {
      return new local.layout();
    }
    return local.layout;
  });

  const resolvedLayoutOptions = createMemo<O | undefined>(() => {
    const fromLayout = layout().useLayoutOptions?.();
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
    return calculateVisibleRange(itemCount, scrollOffset(), viewportSize(), itemSize(), overscan());
  };

  const contextValue = createMemo<VirtualizerContextValue<O>>(() => ({
    layout: layout(),
    layoutOptions: resolvedLayoutOptions(),
    isVirtualized: true,
    getVisibleRange,
  }));
  const collectionRenderer = createMemo<CollectionRendererContextValue<unknown>>(() => ({
    renderItem: (item) => item as JSX.Element,
    isVirtualized: true,
    layoutDelegate: layout(),
  }));

  const filteredDomProps = createMemo(() => filterDOMProps(domProps, { global: true }));

  const updateViewportSize = () => {
    if (!containerRef) return;
    setMeasuredViewportSize(containerRef.clientHeight);
  };

  onMount(() => {
    updateViewportSize();
    const handleResize = () => updateViewportSize();
    window.addEventListener('resize', handleResize);
    onCleanup(() => {
      window.removeEventListener('resize', handleResize);
    });
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
            setScrollOffset(target.scrollTop);
            updateViewportSize();
          }}
        >
          {local.children}
        </div>
      </VirtualizerContext.Provider>
    </CollectionRendererContext.Provider>
  );
}
