/**
 * TagGroup component for proyecto-viviana-ui
 *
 * Styled tag group component built on top of solidaria-components.
 * A tag group displays a collection of tags that can be selected and/or removed.
 */

import { type JSX, splitProps, Show } from 'solid-js';
import {
  TagList as HeadlessTagList,
  Tag as HeadlessTag,
} from '@proyecto-viviana/solidaria-components';
import type { Key, SelectionMode } from '@proyecto-viviana/solid-stately';

// ============================================
// TYPES
// ============================================

export type TagGroupSize = 'sm' | 'md' | 'lg';
export type TagGroupVariant = 'default' | 'outline' | 'solid';

export interface TagGroupProps<T> {
  /** The label for the tag group. */
  label?: string;
  /** The items to display as tags. */
  items: T[];
  /** Function to render the content of each tag. */
  children: (item: T) => JSX.Element;
  /** Function to get a unique key from an item. */
  getKey?: (item: T) => Key;
  /** Handler called when tags are removed. */
  onRemove?: (keys: Set<Key>) => void;
  /** The size of the tags. @default 'md' */
  size?: TagGroupSize;
  /** The visual variant of the tags. @default 'default' */
  variant?: TagGroupVariant;
  /** The selection mode. @default 'none' */
  selectionMode?: SelectionMode;
  /** The currently selected keys (controlled). */
  selectedKeys?: Iterable<Key>;
  /** Handler called when selection changes. */
  onSelectionChange?: (keys: 'all' | Set<Key>) => void;
  /** Keys that are disabled. */
  disabledKeys?: Iterable<Key>;
  /** Additional CSS class name. */
  class?: string;
  /** Content to render when empty. */
  renderEmptyState?: () => JSX.Element;
}

export interface TagProps {
  /** A unique key for this tag. */
  id: Key;
  /** The content of the tag. */
  children: JSX.Element;
  /** Whether the tag is disabled. */
  isDisabled?: boolean;
  /** Additional CSS class name. */
  class?: string;
}

// ============================================
// STYLES
// ============================================

const sizeStyles = {
  sm: {
    tag: 'text-xs px-2 py-0.5 gap-1',
    removeButton: 'w-3 h-3',
    label: 'text-xs',
  },
  md: {
    tag: 'text-sm px-2.5 py-1 gap-1.5',
    removeButton: 'w-4 h-4',
    label: 'text-sm',
  },
  lg: {
    tag: 'text-base px-3 py-1.5 gap-2',
    removeButton: 'w-5 h-5',
    label: 'text-base',
  },
};

const variantStyles = {
  default: {
    tag: 'bg-bg-400 text-primary-200 hover:bg-bg-300',
    selected: 'bg-accent text-white',
    disabled: 'opacity-50 cursor-not-allowed',
  },
  outline: {
    tag: 'border border-primary-600 text-primary-200 hover:border-primary-500 hover:bg-bg-400/50',
    selected: 'border-accent bg-accent/10 text-accent',
    disabled: 'opacity-50 cursor-not-allowed',
  },
  solid: {
    tag: 'bg-primary-600 text-primary-100 hover:bg-primary-500',
    selected: 'bg-accent text-white',
    disabled: 'opacity-50 cursor-not-allowed',
  },
};

// ============================================
// TAG GROUP COMPONENT
// ============================================

/**
 * A tag group displays a collection of tags that can be selected and/or removed.
 *
 * @example
 * ```tsx
 * // Simple tag group
 * <TagGroup
 *   label="Categories"
 *   items={categories}
 *   onRemove={(keys) => removeCategories(keys)}
 * >
 *   {(item) => item.name}
 * </TagGroup>
 *
 * // With selection
 * <TagGroup
 *   label="Filters"
 *   items={filters}
 *   selectionMode="multiple"
 *   selectedKeys={selectedFilters}
 *   onSelectionChange={setSelectedFilters}
 * >
 *   {(item) => item.label}
 * </TagGroup>
 * ```
 */
export function TagGroup<T extends { id?: Key; key?: Key }>(props: TagGroupProps<T>): JSX.Element {
  const [local] = splitProps(props, [
    'label',
    'items',
    'children',
    'getKey',
    'onRemove',
    'size',
    'variant',
    'selectionMode',
    'selectedKeys',
    'onSelectionChange',
    'disabledKeys',
    'class',
    'renderEmptyState',
  ]);

  const size = () => local.size ?? 'md';
  const variant = () => local.variant ?? 'default';
  const sizeConfig = () => sizeStyles[size()];
  const variantConfig = () => variantStyles[variant()];

  // Default getKey function
  const getKey = (item: T): Key => {
    if (local.getKey) return local.getKey(item);
    if (item.id !== undefined) return item.id;
    if (item.key !== undefined) return item.key;
    return String(item);
  };

  return (
    <div class={`flex flex-col gap-2 ${local.class ?? ''}`}>
      <Show when={local.label}>
        <span class={`font-medium text-primary-200 ${sizeConfig().label}`}>
          {local.label}
        </span>
      </Show>
      <HeadlessTagList
        items={local.items}
        getKey={getKey}
        onRemove={local.onRemove}
        selectionMode={local.selectionMode}
        selectedKeys={local.selectedKeys}
        onSelectionChange={local.onSelectionChange}
        disabledKeys={local.disabledKeys}
        class="flex flex-wrap gap-2"
        renderEmptyState={local.renderEmptyState ?? (() => (
          <span class="text-primary-400 text-sm italic">No items</span>
        ))}
      >
        {(item) => (
          <HeadlessTag
            id={getKey(item)}
            class={({ isSelected, isDisabled }) => {
              const base = `
                inline-flex items-center rounded-full
                transition-colors duration-150 cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-accent/50
                ${sizeConfig().tag}
              `;
              const variantClass = isSelected
                ? variantConfig().selected
                : variantConfig().tag;
              const disabledClass = isDisabled ? variantConfig().disabled : '';
              return `${base} ${variantClass} ${disabledClass}`.trim();
            }}
          >
            {(renderProps) => (
              <>
                <span>{local.children(item)}</span>
                <Show when={renderProps.allowsRemoving}>
                  <button
                    type="button"
                    class={`
                      ${sizeConfig().removeButton}
                      rounded-full flex items-center justify-center
                      hover:bg-black/20 transition-colors
                      focus:outline-none
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      local.onRemove?.(new Set([getKey(item)]));
                    }}
                    aria-label="Remove"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="w-full h-full"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </Show>
              </>
            )}
          </HeadlessTag>
        )}
      </HeadlessTagList>
    </div>
  );
}

// Re-export types
export type { Key, SelectionMode };
