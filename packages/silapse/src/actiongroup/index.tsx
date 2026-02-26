/**
 * ActionGroup components for proyecto-viviana-silapse.
 *
 * Styling wrappers around the headless ActionGroup component.
 * Uses createActionGroup under the hood for proper dynamic roles
 * (toolbar/radiogroup), keyboard navigation, and ARIA semantics.
 */

import { type JSX, splitProps } from 'solid-js';
import {
  ActionGroup as HeadlessActionGroup,
  type ActionGroupProps as HeadlessActionGroupProps,
  type ActionGroupRenderProps,
  type ActionGroupItemRenderProps,
  type ActionGroupItem,
} from '@proyecto-viviana/solidaria-components';
import type { Key, SelectionMode } from '@proyecto-viviana/solid-stately';

// ============================================
// TYPES
// ============================================

export interface ActionGroupProps<T extends ActionGroupItem = ActionGroupItem> {
  /** The items in the action group. */
  items: T[];
  /** The selection mode. @default 'none' */
  selectionMode?: SelectionMode;
  /** Orientation of the group. @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** Whether the entire group is disabled. */
  isDisabled?: boolean;
  /** Accessible label. */
  'aria-label'?: string;
  /** Labelled-by id. */
  'aria-labelledby'?: string;
  /** Currently selected keys (controlled). */
  selectedKeys?: Iterable<Key>;
  /** Default selected keys (uncontrolled). */
  defaultSelectedKeys?: Iterable<Key>;
  /** Handler called when selection changes. */
  onSelectionChange?: (keys: 'all' | Set<Key>) => void;
  /** Handler called when an item action is triggered. */
  onAction?: (key: Key) => void;
  /** Keys of disabled items. */
  disabledKeys?: Iterable<Key>;
  /** Optional render function for action items. */
  children?: (item: T, renderProps: ActionGroupItemRenderProps) => JSX.Element;
  /** Custom render function for items. If not provided, uses item.label. */
  renderItem?: (item: T, renderProps: ActionGroupItemRenderProps) => JSX.Element;
  /** Additional CSS class name. */
  class?: string;
}

// ============================================
// STYLES
// ============================================

function getContainerClassName(renderProps: ActionGroupRenderProps, extraClass?: string): string {
  const orientationClass = renderProps.orientation === 'vertical'
    ? 'flex-col'
    : 'flex-row';
  return [
    'vui-action-group inline-flex items-center gap-1 rounded-lg border border-primary-600 bg-bg-300 p-1',
    orientationClass,
    extraClass ?? '',
  ].filter(Boolean).join(' ');
}

function getItemClassName(renderProps: ActionGroupItemRenderProps): string {
  const stateClass = renderProps.isSelected
    ? 'bg-accent text-bg-400'
    : 'bg-transparent text-primary-200 hover:bg-bg-400';
  const disabledClass = renderProps.isDisabled
    ? 'cursor-not-allowed opacity-50'
    : 'cursor-pointer';
  return [
    'inline-flex items-center rounded-md px-3 py-1.5 text-sm transition-colors duration-150',
    stateClass,
    disabledClass,
  ].join(' ');
}

// ============================================
// ACTIONGROUP COMPONENT
// ============================================

export function ActionGroup<T extends ActionGroupItem = ActionGroupItem>(
  props: ActionGroupProps<T>
): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class', 'renderItem', 'children']);

  return (
    <HeadlessActionGroup<T>
      {...headlessProps as HeadlessActionGroupProps<T>}
      class={(rp: ActionGroupRenderProps) => getContainerClassName(rp, local.class)}
    >
      {(item: T, renderProps: ActionGroupItemRenderProps) => (
        <span class={getItemClassName(renderProps)}>
          {local.renderItem
            ? local.renderItem(item, renderProps)
            : local.children
              ? local.children(item, renderProps)
              : item.label}
        </span>
      )}
    </HeadlessActionGroup>
  );
}
