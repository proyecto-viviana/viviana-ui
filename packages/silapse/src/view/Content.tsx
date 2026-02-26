/**
 * Content/Header/Footer view slot components for proyecto-viviana-silapse
 *
 * Simple styled slot components for composing dialog, card, and panel layouts.
 */

import { type JSX, splitProps } from 'solid-js';

// ============================================
// CONTENT
// ============================================

export interface ContentProps {
  /** Additional CSS class name. */
  class?: string;
  /** The content. */
  children?: JSX.Element;
}

/**
 * A content slot component for dialog or panel body.
 */
export function Content(props: ContentProps): JSX.Element {
  const [local, rest] = splitProps(props, ['class', 'children']);
  return (
    <div {...rest} class={`text-primary-200 text-sm ${local.class ?? ''}`}>
      {local.children}
    </div>
  );
}

// ============================================
// HEADER
// ============================================

export interface ViewHeaderProps {
  /** Additional CSS class name. */
  class?: string;
  /** The content. */
  children?: JSX.Element;
}

/**
 * A header slot component.
 */
export function ViewHeader(props: ViewHeaderProps): JSX.Element {
  const [local, rest] = splitProps(props, ['class', 'children']);
  return (
    <header {...rest} class={`text-primary-100 font-semibold text-lg pb-3 border-b border-primary-700 ${local.class ?? ''}`}>
      {local.children}
    </header>
  );
}

// ============================================
// FOOTER
// ============================================

export interface ViewFooterProps {
  /** Additional CSS class name. */
  class?: string;
  /** The content. */
  children?: JSX.Element;
}

/**
 * A footer slot component.
 */
export function ViewFooter(props: ViewFooterProps): JSX.Element {
  const [local, rest] = splitProps(props, ['class', 'children']);
  return (
    <footer {...rest} class={`pt-3 border-t border-primary-700 flex justify-end gap-3 ${local.class ?? ''}`}>
      {local.children}
    </footer>
  );
}
