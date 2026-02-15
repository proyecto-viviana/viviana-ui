/**
 * Collection composition primitives for solidaria-components.
 *
 * Foundational parity layer for React Spectrum-style composition:
 * Section / Header / Group.
 */

import {
  type JSX,
  createContext,
  createMemo,
  splitProps,
  useContext,
} from 'solid-js';
import type { Key } from '@proyecto-viviana/solid-stately';
import type { DragTypes, DropOperation, DropTarget } from '@proyecto-viviana/solid-stately';
import {
  type ClassNameOrFunction,
  type StyleOrFunction,
  type SlotProps,
  useRenderProps,
  filterDOMProps,
} from './utils';

// ============================================
// TYPES
// ============================================

export interface CollectionPrimitiveRenderProps {
  /** Whether the primitive has visible children content. */
  hasChildren: boolean;
}

export interface CollectionDropTargetDelegate {
  getDropTargetFromPoint(
    x: number,
    y: number,
    isValidDropTarget: (target: DropTarget) => boolean
  ): DropTarget | null;
  getDropOperation(
    target: DropTarget,
    types: DragTypes,
    allowedOperations: DropOperation[]
  ): DropOperation;
  getKeyboardNavigationTarget?(
    target: DropTarget | null,
    direction: 'next' | 'previous',
    isValidDropTarget: (target: DropTarget) => boolean
  ): DropTarget | null;
}

export interface CollectionRendererContextValue<T> {
  /** Render function used by collection parents to render each item node. */
  renderItem: (item: T) => JSX.Element;
  /** Whether collection rendering is currently virtualized. */
  isVirtualized?: boolean;
  /** Optional layout delegate used by virtualized renderers. */
  layoutDelegate?: unknown;
  /** Optional drop target delegate used by DnD-aware collection paths. */
  dropTargetDelegate?: CollectionDropTargetDelegate;
  /** Optional drop indicator renderer for DnD-aware collection paths. */
  renderDropIndicator?: (index: number, position: 'before' | 'after' | 'on') => JSX.Element | undefined;
}

export type CollectionEntry<T> = T | CollectionSection<T>;

export interface CollectionSection<T> {
  /** Optional unique key for the section wrapper. */
  key?: Key;
  /** Optional section header title. */
  title?: JSX.Element;
  /** Optional aria-label for section grouping. */
  'aria-label'?: string;
  /** Items contained in the section. */
  items: T[];
}

export interface SectionProps extends SlotProps {
  /** Section contents, usually Header + Group/items. */
  children?: JSX.Element;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<CollectionPrimitiveRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<CollectionPrimitiveRenderProps>;
}

export interface HeaderProps extends SlotProps {
  /** Header contents, usually section title text. */
  children?: JSX.Element;
  /** Optional heading level when rendered as a heading role. */
  'aria-level'?: number;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<CollectionPrimitiveRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<CollectionPrimitiveRenderProps>;
}

export interface GroupProps extends SlotProps {
  /** Group contents, usually section items. */
  children?: JSX.Element;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<CollectionPrimitiveRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<CollectionPrimitiveRenderProps>;
}

// ============================================
// CONTEXT
// ============================================

export const CollectionRendererContext = createContext<CollectionRendererContextValue<unknown> | null>(null);

export function useCollectionRenderer<T>(): CollectionRendererContextValue<T> | null {
  return useContext(CollectionRendererContext) as CollectionRendererContextValue<T> | null;
}

// ============================================
// HELPERS
// ============================================

export function isCollectionSection<T>(entry: CollectionEntry<T>): entry is CollectionSection<T> {
  return typeof entry === 'object' && entry !== null && Array.isArray((entry as CollectionSection<T>).items);
}

export function flattenCollectionEntries<T>(entries: CollectionEntry<T>[]): T[] {
  const flattened: T[] = [];
  for (const entry of entries) {
    if (isCollectionSection(entry)) flattened.push(...entry.items);
    else flattened.push(entry);
  }
  return flattened;
}

// ============================================
// COMPONENTS
// ============================================

/**
 * A semantic section wrapper for grouped collection content.
 */
export function Section(props: SectionProps): JSX.Element {
  const [local, domProps] = splitProps(props, ['children', 'class', 'style', 'slot']);

  const renderValues = createMemo<CollectionPrimitiveRenderProps>(() => ({
    hasChildren: local.children != null,
  }));

  const renderProps = useRenderProps(
    {
      children: local.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Section',
    },
    renderValues
  );

  const filteredDomProps = createMemo(() => filterDOMProps(domProps, { global: true }));

  return (
    <div
      {...filteredDomProps()}
      class={renderProps.class()}
      style={renderProps.style()}
      slot={local.slot}
      data-section
    >
      {renderProps.renderChildren()}
    </div>
  );
}

/**
 * A header/title primitive for collection sections.
 */
export function Header(props: HeaderProps): JSX.Element {
  const [local, domProps] = splitProps(props, ['children', 'class', 'style', 'slot']);

  const renderValues = createMemo<CollectionPrimitiveRenderProps>(() => ({
    hasChildren: local.children != null,
  }));

  const renderProps = useRenderProps(
    {
      children: local.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Header',
    },
    renderValues
  );

  const filteredDomProps = createMemo(() => filterDOMProps(domProps, { global: true }));

  return (
    <div
      {...filteredDomProps()}
      role="heading"
      class={renderProps.class()}
      style={renderProps.style()}
      slot={local.slot}
      data-header
    >
      {renderProps.renderChildren()}
    </div>
  );
}

/**
 * A grouping primitive for section item containers.
 */
export function Group(props: GroupProps): JSX.Element {
  const [local, domProps] = splitProps(props, ['children', 'class', 'style', 'slot']);

  const renderValues = createMemo<CollectionPrimitiveRenderProps>(() => ({
    hasChildren: local.children != null,
  }));

  const renderProps = useRenderProps(
    {
      children: local.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Group',
    },
    renderValues
  );

  const filteredDomProps = createMemo(() => filterDOMProps(domProps, { global: true }));

  return (
    <div
      {...filteredDomProps()}
      role="group"
      class={renderProps.class()}
      style={renderProps.style()}
      slot={local.slot}
      data-group
    >
      {renderProps.renderChildren()}
    </div>
  );
}
