/**
 * Collection composition primitives for solidaria-components.
 *
 * Foundational parity layer for React Spectrum-style composition:
 * Section / Header / Group.
 */

import { type JSX, createMemo, splitProps } from 'solid-js';
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
