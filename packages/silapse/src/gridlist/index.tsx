/**
 * GridList component for proyecto-viviana-silapse
 *
 * Styled grid list component built on top of solidaria-components.
 * Inspired by Spectrum 2's GridList component patterns.
 *
 * GridList is similar to ListBox but supports interactive elements within items
 * and uses grid keyboard navigation.
 */

import { type JSX, splitProps, createContext, createMemo, useContext, Show } from 'solid-js'
import {
  GridList as HeadlessGridList,
  GridListItem as HeadlessGridListItem,
  GridListSelectionCheckbox as HeadlessGridListSelectionCheckbox,
  type GridListProps as HeadlessGridListProps,
  type GridListItemProps as HeadlessGridListItemProps,
  type GridListRenderProps,
  type GridListItemRenderProps,
} from '@proyecto-viviana/solidaria-components'
import type { Key } from '@proyecto-viviana/solid-stately'

// ============================================
// SIZE CONTEXT
// ============================================

export type GridListSize = 'sm' | 'md' | 'lg'
export type GridListVariant = 'default' | 'cards' | 'bordered'
export type GridListLayout = 'list' | 'grid'

interface GridListContextValue {
  size: GridListSize
  variant: GridListVariant
  layout: GridListLayout
}

const GridListSizeContext = createContext<GridListContextValue>({
  size: 'md',
  variant: 'default',
  layout: 'list',
})

// ============================================
// TYPES
// ============================================

export interface GridListProps<T extends object>
  extends Omit<HeadlessGridListProps<T>, 'class' | 'style'> {
  /** The size of the grid list. */
  size?: GridListSize
  /** The visual variant of the grid list. */
  variant?: GridListVariant
  /** The layout of the grid list. */
  layout?: GridListLayout
  /** Number of columns for grid layout (default: auto-fit). */
  columns?: number | 'auto'
  /** Additional CSS class name. */
  class?: string
  /** Label for the grid list. */
  label?: string
  /** Description for the grid list. */
  description?: string
}

export interface GridListItemProps<T extends object>
  extends Omit<HeadlessGridListItemProps<T>, 'class' | 'style'> {
  /** Additional CSS class name. */
  class?: string
  /** Optional description text. */
  description?: string
  /**
   * Optional icon to display before the content.
   * Use a function returning JSX for SSR compatibility: `icon={() => <MyIcon />}`
   */
  icon?: () => JSX.Element
  /**
   * Optional image to display in the item.
   */
  image?: string
  /** Alt text for the image. */
  imageAlt?: string
}

// ============================================
// STYLES
// ============================================

const sizeStyles = {
  sm: {
    list: 'gap-1 p-1',
    item: 'text-sm py-2 px-3 gap-2',
    icon: 'h-4 w-4',
    image: 'h-10 w-10',
    label: 'text-sm',
    description: 'text-xs',
    checkbox: 'w-4 h-4',
  },
  md: {
    list: 'gap-2 p-2',
    item: 'text-base py-3 px-4 gap-3',
    icon: 'h-5 w-5',
    image: 'h-12 w-12',
    label: 'text-base',
    description: 'text-sm',
    checkbox: 'w-5 h-5',
  },
  lg: {
    list: 'gap-3 p-3',
    item: 'text-lg py-4 px-5 gap-4',
    icon: 'h-6 w-6',
    image: 'h-16 w-16',
    label: 'text-lg',
    description: 'text-base',
    checkbox: 'w-6 h-6',
  },
}

const variantStyles = {
  default: {
    list: 'bg-bg-400 rounded-lg border border-bg-300',
    item: 'rounded-md',
    itemHover: 'hover:bg-bg-200/50',
    itemSelected: 'bg-accent/10 text-accent',
  },
  cards: {
    list: 'bg-transparent',
    item: 'bg-bg-400 rounded-lg border border-bg-300 shadow-sm',
    itemHover: 'hover:shadow-md hover:border-bg-200',
    itemSelected: 'border-accent bg-accent/5 shadow-accent/20',
  },
  bordered: {
    list: 'bg-bg-400 rounded-lg border-2 border-bg-400',
    item: 'border-b border-bg-300 last:border-b-0 rounded-none',
    itemHover: 'hover:bg-bg-200/50',
    itemSelected: 'bg-accent/10',
  },
}

// ============================================
// GRID LIST COMPONENT
// ============================================

/**
 * A grid list displays a list of interactive items, with support for
 * keyboard navigation, single or multiple selection, and row actions.
 *
 * Built on solidaria-components GridList for full accessibility support.
 *
 * @example
 * ```tsx
 * const items = [
 *   { id: '1', name: 'Item 1', description: 'Description 1' },
 *   { id: '2', name: 'Item 2', description: 'Description 2' },
 * ]
 *
 * <GridList
 *   items={items}
 *   getKey={(item) => item.id}
 *   selectionMode="multiple"
 * >
 *   {(item) => (
 *     <GridListItem id={item.id} description={item.description}>
 *       {item.name}
 *     </GridListItem>
 *   )}
 * </GridList>
 * ```
 */
export function GridList<T extends object>(props: GridListProps<T>): JSX.Element {
  const [local, headlessProps] = splitProps(props, [
    'size',
    'variant',
    'layout',
    'columns',
    'class',
    'label',
    'description',
  ])

  const size = () => local.size ?? 'md'
  const variant = () => local.variant ?? 'default'
  const layout = () => local.layout ?? 'list'
  const styles = () => sizeStyles[size()]
  const variantStyle = () => variantStyles[variant()]
  const customClass = local.class ?? ''

  const getClassName = (renderProps: GridListRenderProps): string => {
    const base = 'overflow-auto focus:outline-none'
    const sizeClass = styles().list
    const variantClass = variantStyle().list

    // Layout classes
    let layoutClass = ''
    if (layout() === 'grid') {
      if (local.columns === 'auto' || local.columns === undefined) {
        layoutClass = 'grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))]'
      } else {
        layoutClass = `grid grid-cols-${local.columns}`
      }
    } else {
      layoutClass = 'flex flex-col'
    }

    let stateClass = ''
    if (renderProps.isDisabled) {
      stateClass = 'opacity-50'
    }

    const focusClass = renderProps.isFocusVisible
      ? 'ring-2 ring-accent-300 ring-offset-2 ring-offset-bg-400'
      : ''

    return [base, sizeClass, variantClass, layoutClass, stateClass, focusClass, customClass]
      .filter(Boolean)
      .join(' ')
  }

  const defaultEmptyState = () => (
    <div class="py-8 text-center text-primary-400">
      <div class="flex flex-col items-center gap-2">
        <EmptyIcon class="w-12 h-12 text-primary-500" />
        <span>No items</span>
      </div>
    </div>
  )

  const contextValue = createMemo(() => ({ size: size(), variant: variant(), layout: layout() }))

  return (
    <GridListSizeContext.Provider value={contextValue()}>
      <div class="flex flex-col gap-2">
        <Show when={local.label}>
          <label class={`text-primary-200 font-medium ${styles().label}`}>
            {local.label}
          </label>
        </Show>
        <HeadlessGridList
          {...headlessProps}
          class={getClassName}
          renderEmptyState={headlessProps.renderEmptyState ?? defaultEmptyState}
        />
        <Show when={local.description}>
          <span class="text-primary-400 text-sm">{local.description}</span>
        </Show>
      </div>
    </GridListSizeContext.Provider>
  )
}

// ============================================
// GRID LIST ITEM COMPONENT
// ============================================

/**
 * An item in a grid list.
 */
export function GridListItem<T extends object>(props: GridListItemProps<T>): JSX.Element {
  const [local, headlessProps] = splitProps(props, [
    'class',
    'description',
    'icon',
    'image',
    'imageAlt',
  ])

  const context = useContext(GridListSizeContext)
  const sizeStyle = sizeStyles[context.size]
  const variantStyle = variantStyles[context.variant]
  const customClass = local.class ?? ''

  const getClassName = (renderProps: GridListItemRenderProps): string => {
    const base = 'flex items-center cursor-pointer transition-all duration-150 outline-none'
    const sizeClass = sizeStyle.item
    const variantClass = variantStyle.item

    let stateClass = ''
    if (renderProps.isDisabled) {
      stateClass = 'opacity-50 cursor-not-allowed'
    } else if (renderProps.isSelected) {
      stateClass = variantStyle.itemSelected
    } else if (renderProps.isHovered) {
      stateClass = variantStyle.itemHover
    }

    let textClass = ''
    if (!renderProps.isDisabled && !renderProps.isSelected) {
      textClass = 'text-primary-200'
    }

    const focusClass = renderProps.isFocusVisible
      ? 'ring-2 ring-inset ring-accent-300'
      : ''

    const pressedClass = renderProps.isPressed ? 'scale-[0.98]' : ''

    return [base, sizeClass, variantClass, stateClass, textClass, focusClass, pressedClass, customClass]
      .filter(Boolean)
      .join(' ')
  }

  return (
    <HeadlessGridListItem {...headlessProps} class={getClassName}>
      {(renderProps: GridListItemRenderProps) => (
        <>
          {/* Image */}
          <Show when={local.image}>
            <img
              src={local.image}
              alt={local.imageAlt ?? ''}
              class={`${sizeStyle.image} rounded object-cover shrink-0`}
            />
          </Show>

          {/* Icon */}
          <Show when={local.icon}>
            <span class={`shrink-0 ${sizeStyle.icon}`}>{local.icon!()}</span>
          </Show>

          {/* Selection indicator */}
          <Show when={renderProps.isSelected}>
            <CheckIcon class={`shrink-0 ${sizeStyle.icon} text-accent`} />
          </Show>

          {/* Content */}
          <div class="flex flex-col flex-1 min-w-0">
            <span class="truncate">
              {typeof props.children === 'function'
                ? props.children(renderProps)
                : props.children}
            </span>
            <Show when={local.description}>
              <span class={`text-primary-400 truncate ${sizeStyle.description}`}>
                {local.description}
              </span>
            </Show>
          </div>
        </>
      )}
    </HeadlessGridListItem>
  )
}

// ============================================
// GRID LIST SELECTION CHECKBOX COMPONENT
// ============================================

/**
 * A styled checkbox for item selection in a grid list.
 */
export function GridListSelectionCheckbox(props: { itemKey: Key; class?: string }): JSX.Element {
  const context = useContext(GridListSizeContext)
  const sizeStyle = sizeStyles[context.size]
  const className = `${sizeStyle.checkbox} rounded border-2 border-primary-500 bg-bg-400 text-accent cursor-pointer checked:bg-accent checked:border-accent focus:ring-2 focus:ring-accent-300 focus:ring-offset-1 focus:ring-offset-bg-400 ${props.class ?? ''}`

  return (
    <span class={className}>
      <HeadlessGridListSelectionCheckbox itemKey={props.itemKey} />
    </span>
  )
}

// ============================================
// ICONS
// ============================================

function CheckIcon(props: { class?: string }): JSX.Element {
  return (
    <svg
      class={props.class}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function EmptyIcon(props: { class?: string }): JSX.Element {
  return (
    <svg
      class={props.class}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="1.5"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  )
}

// Attach sub-components for convenience
GridList.Item = GridListItem
GridList.SelectionCheckbox = GridListSelectionCheckbox

// Re-export Key type for convenience
export type { Key }
