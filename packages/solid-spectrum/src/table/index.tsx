/**
 * Table component for proyecto-viviana-solid-spectrum
 *
 * Styled table component built on top of solidaria-components.
 * Inspired by Spectrum 2's Table component patterns.
 */

import { type JSX, splitProps, createContext, createMemo, useContext, Show } from 'solid-js'
import {
  Table as HeadlessTable,
  TableHeader as HeadlessTableHeader,
  TableColumn as HeadlessTableColumn,
  TableBody as HeadlessTableBody,
  TableFooter as HeadlessTableFooter,
  TableRow as HeadlessTableRow,
  TableCell as HeadlessTableCell,
  TableSelectionCheckbox as HeadlessTableSelectionCheckbox,
  TableSelectAllCheckbox as HeadlessTableSelectAllCheckbox,
  ColumnResizer as HeadlessColumnResizer,
  ResizableTableContainer as HeadlessResizableTableContainer,
  type TableProps as HeadlessTableProps,
  type TableHeaderProps as HeadlessTableHeaderProps,
  type TableColumnProps as HeadlessTableColumnProps,
  type TableBodyProps as HeadlessTableBodyProps,
  type TableFooterProps as HeadlessTableFooterProps,
  type TableRowProps as HeadlessTableRowProps,
  type TableCellProps as HeadlessTableCellProps,
  type ColumnResizerProps as HeadlessColumnResizerProps,
  type ResizableTableContainerProps as HeadlessResizableTableContainerProps,
  type ColumnResizerRenderProps,
  type TableRenderProps,
  type TableColumnRenderProps,
  type TableFooterRenderProps,
  type TableRowRenderProps,
  type TableCellRenderProps,
} from '@proyecto-viviana/solidaria-components'
import type { Key, SortDescriptor, ColumnDefinition } from '@proyecto-viviana/solid-stately'
import { useProviderProps } from '../provider'

// ============================================
// SIZE CONTEXT
// ============================================

export type TableSize = 'sm' | 'md' | 'lg'
export type TableVariant = 'default' | 'striped' | 'bordered'

interface TableContextValue {
  size: TableSize
  variant: TableVariant
}

const TableSizeContext = createContext<TableContextValue>({ size: 'md', variant: 'default' })

// ============================================
// TYPES
// ============================================

export interface TableProps<T extends object>
  extends Omit<HeadlessTableProps<T>, 'class' | 'style' | 'children'> {
  /** The size of the table. */
  size?: TableSize
  /** The visual variant of the table. */
  variant?: TableVariant
  /** Additional CSS class name. */
  class?: string
  /** Title for the table. */
  title?: string
  /** Description for the table. */
  description?: string
  /** Children components (TableHeader, TableBody). */
  children?: JSX.Element | (() => JSX.Element)
}

export interface TableHeaderProps extends Omit<HeadlessTableHeaderProps, 'class' | 'style'> {
  /** Additional CSS class name. */
  class?: string
}

export interface TableColumnProps extends Omit<HeadlessTableColumnProps, 'class' | 'style'> {
  /** Additional CSS class name. */
  class?: string
  /** Text alignment for the column. */
  align?: 'left' | 'center' | 'right'
  /** Width of the column (CSS value). */
  width?: string
}

export interface TableBodyProps<T> extends Omit<HeadlessTableBodyProps<T>, 'class' | 'style'> {
  /** Additional CSS class name. */
  class?: string
}

export interface TableFooterProps<T> extends Omit<HeadlessTableFooterProps<T>, 'class' | 'style'> {
  /** Additional CSS class name. */
  class?: string
}

export interface TableRowProps<T> extends Omit<HeadlessTableRowProps<T>, 'class' | 'style'> {
  /** Additional CSS class name. */
  class?: string
}

export interface TableCellProps extends Omit<HeadlessTableCellProps, 'class' | 'style'> {
  /** Additional CSS class name. */
  class?: string
  /** Text alignment for the cell. */
  align?: 'left' | 'center' | 'right'
}

// ============================================
// STYLES
// ============================================

const sizeStyles = {
  sm: {
    table: 'text-sm',
    headerCell: 'px-3 py-2',
    cell: 'px-3 py-2',
    checkbox: 'w-4 h-4',
  },
  md: {
    table: 'text-base',
    headerCell: 'px-4 py-3',
    cell: 'px-4 py-3',
    checkbox: 'w-5 h-5',
  },
  lg: {
    table: 'text-lg',
    headerCell: 'px-5 py-4',
    cell: 'px-5 py-4',
    checkbox: 'w-6 h-6',
  },
}

const variantStyles = {
  default: {
    wrapper: 'rounded-lg border border-bg-300 overflow-hidden',
    header: 'bg-bg-300 border-b border-bg-400',
    row: '',
    rowHover: 'hover:bg-bg-200/50',
    rowSelected: 'bg-accent/10',
  },
  striped: {
    wrapper: 'rounded-lg border border-bg-300 overflow-hidden',
    header: 'bg-bg-300 border-b border-bg-400',
    row: 'even:bg-bg-200/30',
    rowHover: 'hover:bg-bg-200/50',
    rowSelected: 'bg-accent/10',
  },
  bordered: {
    wrapper: 'rounded-lg border-2 border-bg-400 overflow-hidden',
    header: 'bg-bg-300 border-b-2 border-bg-400',
    row: 'border-b border-bg-300 last:border-b-0',
    rowHover: 'hover:bg-bg-200/50',
    rowSelected: 'bg-accent/10',
  },
}

const alignStyles = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

// ============================================
// TABLE COMPONENT
// ============================================

/**
 * A table displays data in rows and columns and enables a user to navigate its contents
 * via directional navigation keys, and optionally supports row selection and sorting.
 *
 * Built on solidaria-components Table for full accessibility support.
 *
 * @example
 * ```tsx
 * const columns = [
 *   { key: 'name', name: 'Name' },
 *   { key: 'role', name: 'Role' },
 *   { key: 'status', name: 'Status' },
 * ]
 *
 * const rows = [
 *   { id: '1', name: 'John', role: 'Developer', status: 'Active' },
 *   { id: '2', name: 'Jane', role: 'Designer', status: 'Active' },
 * ]
 *
 * <Table items={rows} columns={columns} selectionMode="multiple">
 *   {() => (
 *     <>
 *       <TableHeader>
 *         {() => (
 *           <For each={columns}>
 *             {(col) => <TableColumn id={col.key}>{col.name}</TableColumn>}
 *           </For>
 *         )}
 *       </TableHeader>
 *       <TableBody>
 *         {(row) => (
 *           <TableRow id={row.id}>
 *             {() => (
 *               <>
 *                 <TableCell>{row.name}</TableCell>
 *                 <TableCell>{row.role}</TableCell>
 *                 <TableCell>{row.status}</TableCell>
 *               </>
 *             )}
 *           </TableRow>
 *         )}
 *       </TableBody>
 *     </>
 *   )}
 * </Table>
 * ```
 */
export function Table<T extends object>(props: TableProps<T>): JSX.Element {
  const mergedProps = useProviderProps(props)
  const [local, headlessProps] = splitProps(mergedProps, [
    'size',
    'variant',
    'class',
    'title',
    'description',
    'children',
  ])

  const size = () => local.size ?? 'md'
  const variant = () => local.variant ?? 'default'
  const styles = () => sizeStyles[size()]
  const variantStyle = () => variantStyles[variant()]
  const customClass = local.class ?? ''

  const getClassName = (renderProps: TableRenderProps): string => {
    const base = 'w-full bg-bg-400'
    const sizeClass = styles().table

    let stateClass = ''
    if (renderProps.isEmpty) {
      stateClass = ''
    }

    const focusClass = renderProps.isFocusVisible
      ? 'ring-2 ring-accent-300 ring-offset-2 ring-offset-bg-400'
      : ''

    return [base, sizeClass, stateClass, focusClass, customClass].filter(Boolean).join(' ')
  }

  const contextValue = createMemo(() => ({ size: size(), variant: variant() }))

  return (
    <TableSizeContext.Provider value={contextValue()}>
      <div class="flex flex-col gap-2">
        <Show when={local.title}>
          <h3 class="text-lg font-semibold text-primary-100">{local.title}</h3>
        </Show>
        <Show when={local.description}>
          <p class="text-sm text-primary-400">{local.description}</p>
        </Show>
        <div class={variantStyle().wrapper}>
          <HeadlessTable {...headlessProps} class={getClassName}>
            {props.children}
          </HeadlessTable>
        </div>
      </div>
    </TableSizeContext.Provider>
  )
}

// ============================================
// TABLE HEADER COMPONENT
// ============================================

/**
 * A header row in a table containing column headers.
 */
export function TableHeader(props: TableHeaderProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class'])
  const context = useContext(TableSizeContext)
  const variantStyle = variantStyles[context.variant]
  const customClass = local.class ?? ''

  const className = [variantStyle.header, customClass].filter(Boolean).join(' ')

  return (
    <HeadlessTableHeader {...headlessProps} class={className}>
      {props.children}
    </HeadlessTableHeader>
  )
}

// ============================================
// TABLE COLUMN COMPONENT
// ============================================

/**
 * A column header in a table.
 */
export function TableColumn(props: TableColumnProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class', 'align', 'width'])
  const context = useContext(TableSizeContext)
  const sizeStyle = sizeStyles[context.size]
  const customClass = local.class ?? ''

  const getClassName = (renderProps: TableColumnRenderProps): string => {
    const base = 'font-semibold text-primary-200 select-none'
    const sizeClass = sizeStyle.headerCell
    const alignClass = alignStyles[local.align ?? 'left']

    let sortClass = ''
    if (renderProps.isSortable) {
      sortClass = 'cursor-pointer'
      if (renderProps.isHovered) {
        sortClass += ' text-primary-100'
      }
    }

    const focusClass = renderProps.isFocusVisible
      ? 'ring-2 ring-inset ring-accent-300'
      : ''

    return [base, sizeClass, alignClass, sortClass, focusClass, customClass].filter(Boolean).join(' ')
  }

  const getStyle = (): JSX.CSSProperties | undefined => {
    if (local.width) {
      return { width: local.width }
    }
    return undefined
  }

  return (
    <HeadlessTableColumn {...headlessProps} class={getClassName} style={getStyle()}>
      {(renderProps: TableColumnRenderProps) => (
        <div class="flex items-center gap-2">
          <span class="flex-1">
            {typeof props.children === 'function'
              ? props.children(renderProps)
              : props.children}
          </span>
          <Show when={renderProps.isSortable && renderProps.sortDirection}>
            <SortIcon direction={renderProps.sortDirection!} class="w-4 h-4" />
          </Show>
        </div>
      )}
    </HeadlessTableColumn>
  )
}

// ============================================
// TABLE BODY COMPONENT
// ============================================

/**
 * The body of a table containing data rows.
 */
export function TableBody<T extends object>(props: TableBodyProps<T>): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class', 'renderEmptyState'])
  const customClass = local.class ?? ''

  const defaultEmptyState = () => (
    <tr>
      <td colSpan={100} class="py-8 text-center text-primary-400">
        <div class="flex flex-col items-center gap-2">
          <EmptyIcon class="w-12 h-12 text-primary-500" />
          <span>No data available</span>
        </div>
      </td>
    </tr>
  )

  return (
    <HeadlessTableBody
      {...headlessProps}
      class={customClass}
      renderEmptyState={local.renderEmptyState ?? defaultEmptyState}
    >
      {props.children}
    </HeadlessTableBody>
  )
}

// ============================================
// TABLE FOOTER COMPONENT
// ============================================

/**
 * The footer of a table containing summary rows.
 */
export function TableFooter<T extends object>(props: TableFooterProps<T>): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class'])
  const context = useContext(TableSizeContext)
  const variantStyle = variantStyles[context.variant]
  const customClass = local.class ?? ''

  const getClassName = (_renderProps: TableFooterRenderProps): string => {
    return [variantStyle.header, customClass].filter(Boolean).join(' ')
  }

  return (
    <HeadlessTableFooter {...headlessProps} class={getClassName}>
      {props.children}
    </HeadlessTableFooter>
  )
}

// ============================================
// TABLE ROW COMPONENT
// ============================================

/**
 * A row in a table.
 */
export function TableRow<T extends object>(props: TableRowProps<T>): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class'])
  const context = useContext(TableSizeContext)
  const variantStyle = variantStyles[context.variant]
  const customClass = local.class ?? ''

  const getClassName = (renderProps: TableRowRenderProps): string => {
    const base = 'transition-colors duration-150 outline-none'
    const variantClass = variantStyle.row

    let stateClass = ''
    if (renderProps.isDisabled) {
      stateClass = 'opacity-50 cursor-not-allowed'
    } else if (renderProps.isSelected) {
      stateClass = variantStyle.rowSelected
    } else if (renderProps.isHovered) {
      stateClass = variantStyle.rowHover
    }

    const focusClass = renderProps.isFocusVisible
      ? 'ring-2 ring-inset ring-accent-300'
      : ''

    const pressedClass = renderProps.isPressed ? 'bg-bg-200/70' : ''

    return [base, variantClass, stateClass, focusClass, pressedClass, customClass]
      .filter(Boolean)
      .join(' ')
  }

  return (
    <HeadlessTableRow {...headlessProps} class={getClassName}>
      {props.children}
    </HeadlessTableRow>
  )
}

// ============================================
// TABLE CELL COMPONENT
// ============================================

/**
 * A cell in a table row.
 */
export function TableCell(props: TableCellProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class', 'align'])
  const context = useContext(TableSizeContext)
  const sizeStyle = sizeStyles[context.size]
  const customClass = local.class ?? ''

  const getClassName = (renderProps: TableCellRenderProps): string => {
    const base = 'text-primary-200'
    const sizeClass = sizeStyle.cell
    const alignClass = alignStyles[local.align ?? 'left']

    const focusClass = renderProps.isFocusVisible
      ? 'ring-2 ring-inset ring-accent-300'
      : ''

    return [base, sizeClass, alignClass, focusClass, customClass].filter(Boolean).join(' ')
  }

  return (
    <HeadlessTableCell {...headlessProps} class={getClassName}>
      {props.children}
    </HeadlessTableCell>
  )
}

// ============================================
// TABLE SELECTION CHECKBOX COMPONENT
// ============================================

/**
 * A styled checkbox cell for row selection.
 */
export function TableSelectionCheckbox(props: { rowKey: Key }): JSX.Element {
  const context = useContext(TableSizeContext)
  const sizeStyle = sizeStyles[context.size]
  const checkboxClass = `${sizeStyle.checkbox} rounded border-2 border-primary-500 bg-bg-400 text-accent cursor-pointer checked:bg-accent checked:border-accent focus:ring-2 focus:ring-accent-300 focus:ring-offset-1 focus:ring-offset-bg-400`

  return (
    <td class={`${sizeStyle.cell} w-px`}>
      <span class={checkboxClass}>
        <HeadlessTableSelectionCheckbox rowKey={props.rowKey} />
      </span>
    </td>
  )
}

/**
 * A styled checkbox for select-all functionality.
 */
export function TableSelectAllCheckbox(): JSX.Element {
  const context = useContext(TableSizeContext)
  const sizeStyle = sizeStyles[context.size]
  const checkboxClass = `${sizeStyle.checkbox} rounded border-2 border-primary-500 bg-bg-400 text-accent cursor-pointer checked:bg-accent checked:border-accent focus:ring-2 focus:ring-accent-300 focus:ring-offset-1 focus:ring-offset-bg-400`

  return (
    <th class={`${sizeStyle.headerCell} w-px`}>
      <span class={checkboxClass}>
        <HeadlessTableSelectAllCheckbox />
      </span>
    </th>
  )
}

// ============================================
// COLUMN RESIZER COMPONENT
// ============================================

export interface ColumnResizerProps extends Omit<HeadlessColumnResizerProps, 'class' | 'style'> {
  /** Additional CSS class name. */
  class?: string
}

/**
 * A styled column resize handle. Place inside a TableColumn that has allowsResizing.
 */
export function ColumnResizer(props: ColumnResizerProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class'])
  const customClass = local.class ?? ''

  const getClassName = (renderProps: ColumnResizerRenderProps): string => {
    const base = 'absolute right-0 top-0 bottom-0 w-[3px] cursor-col-resize select-none'
    const idle = 'bg-transparent'
    const hovered = 'bg-accent/50'
    const resizing = 'bg-accent'

    let stateClass = idle
    if (renderProps.isResizing) {
      stateClass = resizing
    } else if (renderProps.isHovered) {
      stateClass = hovered
    }

    return [base, stateClass, customClass].filter(Boolean).join(' ')
  }

  return (
    <HeadlessColumnResizer
      {...headlessProps}
      class={getClassName}
    />
  )
}

// ============================================
// RESIZABLE TABLE CONTAINER COMPONENT
// ============================================

export interface ResizableTableContainerProps extends Omit<HeadlessResizableTableContainerProps, 'class' | 'style'> {
  /** Additional CSS class name. */
  class?: string
}

/**
 * A styled wrapper that enables column resizing for its child Table.
 */
export function ResizableTableContainer(props: ResizableTableContainerProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class'])
  const customClass = local.class ?? ''

  const className = ['relative overflow-auto', customClass].filter(Boolean).join(' ')

  return (
    <HeadlessResizableTableContainer
      {...headlessProps}
      class={className}
    />
  )
}

// ============================================
// ICONS
// ============================================

function SortIcon(props: { direction: 'ascending' | 'descending'; class?: string }): JSX.Element {
  return (
    <svg
      class={props.class}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      {props.direction === 'ascending' ? (
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
      ) : (
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      )}
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
Table.Header = TableHeader
Table.Column = TableColumn
Table.Body = TableBody
Table.Footer = TableFooter
Table.Row = TableRow
Table.Cell = TableCell
Table.SelectionCheckbox = TableSelectionCheckbox
Table.SelectAllCheckbox = TableSelectAllCheckbox
Table.ColumnResizer = ColumnResizer

export const TableView = Table
export const Column = TableColumn
export const Footer = TableFooter
export const Row = TableRow
export const Cell = TableCell

// Re-export types for convenience
export type { Key, SortDescriptor, ColumnDefinition }
