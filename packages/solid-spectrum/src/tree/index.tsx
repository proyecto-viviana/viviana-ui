/**
 * Tree component for proyecto-viviana-solid-spectrum
 *
 * Styled tree component built on top of solidaria-components.
 * Inspired by Spectrum 2's Tree component patterns.
 *
 * Tree displays hierarchical data with expandable/collapsible nodes,
 * supporting keyboard navigation and selection.
 */

import { type JSX, splitProps, createContext, createMemo, useContext, Show } from 'solid-js'
import {
  Tree as HeadlessTree,
  TreeItem as HeadlessTreeItem,
  TreeItemContent as HeadlessTreeItemContent,
  TreeExpandButton as HeadlessTreeExpandButton,
  TreeSelectionCheckbox as HeadlessTreeSelectionCheckbox,
  type TreeProps as HeadlessTreeProps,
  type TreeItemProps as HeadlessTreeItemProps,
  type TreeItemContentProps as HeadlessTreeItemContentProps,
  type TreeItemContentRenderProps as HeadlessTreeItemContentRenderProps,
  type TreeExpandButtonProps as HeadlessTreeExpandButtonProps,
  type TreeRenderProps,
  type TreeItemRenderProps,
  type TreeRenderItemState,
} from '@proyecto-viviana/solidaria-components'
import type { Key, TreeItemData } from '@proyecto-viviana/solid-stately'
import { useProviderProps } from '../provider'

// ============================================
// SIZE CONTEXT
// ============================================

export type TreeSize = 'sm' | 'md' | 'lg'
export type TreeVariant = 'default' | 'bordered' | 'quiet'

interface TreeContextValue {
  size: TreeSize
  variant: TreeVariant
}

const TreeSizeContext = createContext<TreeContextValue>({ size: 'md', variant: 'default' })

// ============================================
// TYPES
// ============================================

export interface TreeProps<T extends object>
  extends Omit<HeadlessTreeProps<T>, 'class' | 'style'> {
  /** The size of the tree. */
  size?: TreeSize
  /** The visual variant of the tree. */
  variant?: TreeVariant
  /** Additional CSS class name. */
  class?: string
  /** Label for the tree. */
  label?: string
  /** Description for the tree. */
  description?: string
}

export interface TreeItemProps<T extends object>
  extends Omit<HeadlessTreeItemProps<T>, 'class' | 'style'> {
  /** Additional CSS class name. */
  class?: string
  /** Optional description text. */
  description?: string
  /**
   * Optional icon to display before the content.
   * Use a function returning JSX for SSR compatibility: `icon={() => <FolderIcon />}`
   */
  icon?: () => JSX.Element
}

export interface TreeExpandButtonProps extends Omit<HeadlessTreeExpandButtonProps, 'class' | 'style'> {
  /** Additional CSS class name. */
  class?: string
}

export interface TreeItemContentProps
  extends Omit<HeadlessTreeItemContentProps, 'class' | 'style'> {
  /** Additional CSS class name. */
  class?: string
}

// ============================================
// STYLES
// ============================================

const sizeStyles = {
  sm: {
    tree: 'text-sm',
    item: 'py-1 px-2 gap-1',
    indent: 16,
    icon: 'h-4 w-4',
    expandButton: 'h-4 w-4',
    label: 'text-sm',
    description: 'text-xs',
    checkbox: 'w-4 h-4',
  },
  md: {
    tree: 'text-base',
    item: 'py-1.5 px-3 gap-2',
    indent: 20,
    icon: 'h-5 w-5',
    expandButton: 'h-5 w-5',
    label: 'text-base',
    description: 'text-sm',
    checkbox: 'w-5 h-5',
  },
  lg: {
    tree: 'text-lg',
    item: 'py-2 px-4 gap-2',
    indent: 24,
    icon: 'h-6 w-6',
    expandButton: 'h-6 w-6',
    label: 'text-lg',
    description: 'text-base',
    checkbox: 'w-6 h-6',
  },
}

const variantStyles = {
  default: {
    tree: 'bg-bg-400 rounded-lg border border-bg-300 p-2',
    item: 'rounded-md',
    itemHover: 'hover:bg-bg-200/50',
    itemSelected: 'bg-accent/10 text-accent',
  },
  bordered: {
    tree: 'bg-bg-400 rounded-lg border-2 border-bg-400 p-2',
    item: 'border-b border-bg-300/30 last:border-b-0',
    itemHover: 'hover:bg-bg-200/50',
    itemSelected: 'bg-accent/10 text-accent',
  },
  quiet: {
    tree: 'bg-transparent',
    item: 'rounded-md',
    itemHover: 'hover:bg-bg-300/50',
    itemSelected: 'bg-accent/10 text-accent',
  },
}

// ============================================
// TREE COMPONENT
// ============================================

/**
 * A tree displays hierarchical data with expandable/collapsible nodes,
 * supporting keyboard navigation and selection.
 *
 * Built on solidaria-components Tree for full accessibility support.
 *
 * @example
 * ```tsx
 * const items = [
 *   {
 *     key: 'documents',
 *     value: { name: 'Documents' },
 *     children: [
 *       { key: 'doc1', value: { name: 'Report.pdf' } },
 *       { key: 'doc2', value: { name: 'Notes.txt' } },
 *     ],
 *   },
 *   {
 *     key: 'images',
 *     value: { name: 'Images' },
 *     children: [
 *       { key: 'img1', value: { name: 'Photo.jpg' } },
 *     ],
 *   },
 * ]
 *
 * <Tree items={items} defaultExpandedKeys={['documents']}>
 *   {(item, state) => (
 *     <TreeItem id={item.key} icon={() => <FolderIcon />}>
 *       {item.value.name}
 *     </TreeItem>
 *   )}
 * </Tree>
 * ```
 */
export function Tree<T extends object>(props: TreeProps<T>): JSX.Element {
  const mergedProps = useProviderProps(props)
  const [local, headlessProps] = splitProps(mergedProps, [
    'size',
    'variant',
    'class',
    'label',
    'description',
  ])

  const size = () => local.size ?? 'md'
  const variant = () => local.variant ?? 'default'
  const styles = () => sizeStyles[size()]
  const variantStyle = () => variantStyles[variant()]
  const customClass = local.class ?? ''

  const getClassName = (renderProps: TreeRenderProps): string => {
    const base = 'overflow-auto focus:outline-none'
    const sizeClass = styles().tree
    const variantClass = variantStyle().tree

    let stateClass = ''
    if (renderProps.isDisabled) {
      stateClass = 'opacity-50'
    }

    const focusClass = renderProps.isFocusVisible
      ? 'ring-2 ring-accent-300 ring-offset-2 ring-offset-bg-400'
      : ''

    return [base, sizeClass, variantClass, stateClass, focusClass, customClass]
      .filter(Boolean)
      .join(' ')
  }

  const defaultEmptyState = () => (
    <div class="py-8 text-center text-primary-400">
      <div class="flex flex-col items-center gap-2">
        <EmptyTreeIcon class="w-12 h-12 text-primary-500" />
        <span>No items</span>
      </div>
    </div>
  )

  const contextValue = createMemo(() => ({ size: size(), variant: variant() }))

  return (
    <TreeSizeContext.Provider value={contextValue()}>
      <div class="flex flex-col gap-2 h-full min-h-0">
        <Show when={local.label}>
          <label class={`text-primary-200 font-medium ${styles().label}`}>
            {local.label}
          </label>
        </Show>
        <HeadlessTree
          {...headlessProps}
          class={getClassName}
          renderEmptyState={headlessProps.renderEmptyState ?? defaultEmptyState}
        />
        <Show when={local.description}>
          <span class="text-primary-400 text-sm">{local.description}</span>
        </Show>
      </div>
    </TreeSizeContext.Provider>
  )
}

// ============================================
// TREE ITEM COMPONENT
// ============================================

/**
 * An item in a tree.
 */
export function TreeItem<T extends object>(props: TreeItemProps<T>): JSX.Element {
  const [local, headlessProps] = splitProps(props, [
    'class',
    'description',
    'icon',
  ])

  const context = useContext(TreeSizeContext)
  const sizeStyle = sizeStyles[context.size]
  const variantStyle = variantStyles[context.variant]
  const customClass = local.class ?? ''

  const getClassName = (renderProps: TreeItemRenderProps): string => {
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

    const pressedClass = renderProps.isPressed ? 'scale-[0.99]' : ''

    return [base, sizeClass, variantClass, stateClass, textClass, focusClass, pressedClass, customClass]
      .filter(Boolean)
      .join(' ')
  }

  const getStyle = (renderProps: TreeItemRenderProps): JSX.CSSProperties => ({
    'padding-left': `${renderProps.level * sizeStyle.indent + 8}px`,
  })

  return (
    <HeadlessTreeItem {...headlessProps} class={getClassName} style={getStyle}>
      {(renderProps: TreeItemRenderProps) => (
        <>
          {/* Expand button */}
          <TreeExpandButton class={`${sizeStyle.expandButton} shrink-0`} />

          {/* Icon */}
          <Show when={local.icon}>
            <span class={`shrink-0 ${sizeStyle.icon}`}>
              {local.icon!()}
            </span>
          </Show>

          {/* Default folder/file icon if no custom icon */}
          <Show when={!local.icon}>
            {renderProps.isExpandable ? (
              <FolderIcon class={`shrink-0 ${sizeStyle.icon} text-accent-300`} isOpen={renderProps.isExpanded} />
            ) : (
              <FileIcon class={`shrink-0 ${sizeStyle.icon} text-primary-400`} />
            )}
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

          {/* Selection indicator */}
          <Show when={renderProps.isSelected}>
            <CheckIcon class={`shrink-0 ${sizeStyle.icon} text-accent`} />
          </Show>
        </>
      )}
    </HeadlessTreeItem>
  )
}

// ============================================
// TREE EXPAND BUTTON COMPONENT
// ============================================

/**
 * A button to expand/collapse a tree item.
 */
export function TreeExpandButton(props: TreeExpandButtonProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class'])
  const context = useContext(TreeSizeContext)
  const sizeStyle = sizeStyles[context.size]
  const customClass = local.class ?? ''

  const className = [
    'flex items-center justify-center transition-transform duration-150 text-primary-400 hover:text-primary-200',
    customClass,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <HeadlessTreeExpandButton
      {...headlessProps}
      class={className}
    >
      {props.children ?? (({ isExpanded }: { isExpanded: boolean }) => (
        <ChevronIcon
          class={`${sizeStyle.expandButton} transition-transform duration-150 ${
            isExpanded ? 'rotate-90' : ''
          }`}
        />
      ))}
    </HeadlessTreeExpandButton>
  )
}

/**
 * A content slot for TreeItem rows.
 */
export function TreeItemContent(props: TreeItemContentProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class'])
  const customClass = local.class ?? ''

  return (
    <HeadlessTreeItemContent {...headlessProps}>
      {(renderProps: HeadlessTreeItemContentRenderProps) => (
        <span class={['flex-1 min-w-0', customClass].filter(Boolean).join(' ')}>
          {typeof props.children === 'function' ? props.children(renderProps) : props.children}
        </span>
      )}
    </HeadlessTreeItemContent>
  )
}

// ============================================
// TREE SELECTION CHECKBOX COMPONENT
// ============================================

/**
 * A styled checkbox for item selection in a tree.
 */
export function TreeSelectionCheckbox(props: { itemKey: Key; class?: string }): JSX.Element {
  const context = useContext(TreeSizeContext)
  const sizeStyle = sizeStyles[context.size]
  const className = `${sizeStyle.checkbox} rounded border-2 border-primary-500 bg-bg-400 text-accent cursor-pointer checked:bg-accent checked:border-accent focus:ring-2 focus:ring-accent-300 focus:ring-offset-1 focus:ring-offset-bg-400 ${props.class ?? ''}`

  return (
    <span class={className}>
      <HeadlessTreeSelectionCheckbox itemKey={props.itemKey} />
    </span>
  )
}

// ============================================
// ICONS
// ============================================

function ChevronIcon(props: { class?: string }): JSX.Element {
  return (
    <svg
      class={props.class}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}

function FolderIcon(props: { class?: string; isOpen?: boolean }): JSX.Element {
  return (
    <svg
      class={props.class}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="1.5"
    >
      {props.isOpen ? (
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
        />
      ) : (
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
        />
      )}
    </svg>
  )
}

function FileIcon(props: { class?: string }): JSX.Element {
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
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
      />
    </svg>
  )
}

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

function EmptyTreeIcon(props: { class?: string }): JSX.Element {
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
        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6z"
      />
    </svg>
  )
}

// Attach sub-components for convenience
Tree.Item = TreeItem
Tree.Content = TreeItemContent
Tree.ExpandButton = TreeExpandButton
Tree.SelectionCheckbox = TreeSelectionCheckbox

export const TreeView = Tree
export const TreeViewItem = TreeItem
export const TreeViewItemContent = TreeItemContent
export { Collection } from '@proyecto-viviana/solidaria-components'

// Re-export types for convenience
export type { Key, TreeItemData, TreeRenderItemState }
