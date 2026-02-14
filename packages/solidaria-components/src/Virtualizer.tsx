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

/**
 * A Virtualizer renders collection content under a virtualized layout contract.
 * Current implementation is a non-virtualized fallback while preserving API shape.
 */
export function Virtualizer<O>(props: VirtualizerProps<O>): JSX.Element {
  const [local, domProps] = splitProps(props, ['children', 'layout', 'layoutOptions', 'class', 'style']);

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

  const contextValue = createMemo<VirtualizerContextValue<O>>(() => ({
    layout: layout(),
    layoutOptions: resolvedLayoutOptions(),
    isVirtualized: true,
  }));
  const collectionRenderer = createMemo<CollectionRendererContextValue<unknown>>(() => ({
    renderItem: (item) => item as JSX.Element,
    isVirtualized: true,
    layoutDelegate: layout(),
  }));

  const filteredDomProps = createMemo(() => filterDOMProps(domProps, { global: true }));

  return (
    <CollectionRendererContext.Provider value={collectionRenderer()}>
      <VirtualizerContext.Provider value={contextValue()}>
        <div
          {...filteredDomProps()}
          class={local.class}
          style={local.style}
          data-virtualizer
        >
          {local.children}
        </div>
      </VirtualizerContext.Provider>
    </CollectionRendererContext.Provider>
  );
}
