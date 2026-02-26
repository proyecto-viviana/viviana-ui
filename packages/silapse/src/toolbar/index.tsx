/**
 * Toolbar component for proyecto-viviana-silapse
 *
 * Styled toolbar component built on top of solidaria-components Toolbar.
 */

import { type JSX, splitProps } from 'solid-js'
import {
  Toolbar as HeadlessToolbar,
  type ToolbarProps as HeadlessToolbarProps,
  type ToolbarRenderProps,
} from '@proyecto-viviana/solidaria-components'

// ============================================
// TYPES
// ============================================

export type ToolbarSize = 'sm' | 'md' | 'lg'
export type ToolbarVariant = 'default' | 'bordered' | 'ghost'

export interface ToolbarProps extends Omit<HeadlessToolbarProps, 'class' | 'style'> {
  /** The visual variant of the toolbar. @default 'default' */
  variant?: ToolbarVariant
  /** The size of the toolbar. @default 'md' */
  size?: ToolbarSize
  /** Additional CSS class name. */
  class?: string
  /** Inline styles. */
  style?: JSX.CSSProperties
}

// ============================================
// STYLES
// ============================================

const baseStyles = 'vui-toolbar inline-flex items-center'

const variantStyles: Record<ToolbarVariant, string> = {
  default: 'bg-bg-50 rounded-md',
  bordered: 'border border-bg-200 rounded-md',
  ghost: '',
}

const sizeStyles: Record<ToolbarSize, string> = {
  sm: 'gap-1 p-1',
  md: 'gap-2 p-2',
  lg: 'gap-3 p-3',
}

const orientationStyles = {
  horizontal: 'flex-row',
  vertical: 'flex-col',
}

// ============================================
// TOOLBAR COMPONENT
// ============================================

/**
 * A styled toolbar for grouping interactive controls with keyboard navigation.
 *
 * @example
 * ```tsx
 * <Toolbar aria-label="Text formatting">
 *   <Button>Bold</Button>
 *   <Button>Italic</Button>
 *   <Separator orientation="vertical" />
 *   <Button>Align Left</Button>
 *   <Button>Align Center</Button>
 * </Toolbar>
 *
 * // Vertical toolbar
 * <Toolbar orientation="vertical" variant="bordered">
 *   <Button>Cut</Button>
 *   <Button>Copy</Button>
 *   <Button>Paste</Button>
 * </Toolbar>
 * ```
 */
export function Toolbar(props: ToolbarProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, [
    'variant',
    'size',
    'class',
    'style',
  ])

  const variant = () => local.variant ?? 'default'
  const size = () => local.size ?? 'md'

  const getClassName = (renderProps: ToolbarRenderProps): string => {
    return [
      baseStyles,
      variantStyles[variant()],
      sizeStyles[size()],
      orientationStyles[renderProps.orientation],
      local.class ?? '',
    ].filter(Boolean).join(' ')
  }

  return (
    <HeadlessToolbar
      {...headlessProps}
      class={getClassName}
      style={local.style}
    />
  )
}
