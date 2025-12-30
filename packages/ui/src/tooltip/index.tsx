/**
 * Tooltip component for proyecto-viviana-ui
 *
 * A tooltip displays a description of an element on hover or focus.
 * Built on top of solidaria-components for accessibility.
 */

import { type JSX, Show, splitProps } from 'solid-js'
import {
  Tooltip as HeadlessTooltip,
  TooltipTrigger as HeadlessTooltipTrigger,
  type TooltipProps as HeadlessTooltipProps,
  type TooltipTriggerComponentProps as HeadlessTooltipTriggerProps,
  type TooltipRenderProps,
} from '@proyecto-viviana/solidaria-components'

// ============================================
// TYPES
// ============================================

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'
export type TooltipVariant = 'default' | 'neutral' | 'info'

export interface TooltipTriggerProps extends HeadlessTooltipTriggerProps {
  /** The children of the tooltip trigger (trigger element and tooltip). */
  children: JSX.Element
}

export interface TooltipProps extends Omit<HeadlessTooltipProps, 'class' | 'style' | 'children'> {
  /** The content of the tooltip. */
  children: JSX.Element
  /** The position of the tooltip relative to the trigger. */
  placement?: TooltipPlacement
  /** Visual variant of the tooltip. */
  variant?: TooltipVariant
  /** Additional CSS class name. */
  class?: string
  /** Whether to show an arrow pointing to the trigger. */
  showArrow?: boolean
}

// ============================================
// STYLES
// ============================================

// Note: Position is now calculated by the headless layer (solidaria-components)
// so we don't need CSS positioning classes here
const baseStyles = [
  'px-3 py-2 rounded-lg',
  'text-sm font-medium',
  'shadow-lg',
  'pointer-events-auto',
  'animate-in fade-in-0 zoom-in-95',
  'data-[exiting]:animate-out data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95',
].join(' ')

const variantStyles: Record<TooltipVariant, string> = {
  default: 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900',
  neutral: 'bg-neutral-800 text-neutral-100 dark:bg-neutral-200 dark:text-neutral-900',
  info: 'bg-blue-600 text-white dark:bg-blue-500',
}

const arrowStyles: Record<TooltipPlacement, string> = {
  top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-l-transparent border-r-transparent border-b-transparent',
  bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-full border-l-transparent border-r-transparent border-t-transparent',
  left: 'right-0 top-1/2 -translate-y-1/2 translate-x-full border-t-transparent border-b-transparent border-r-transparent',
  right: 'left-0 top-1/2 -translate-y-1/2 -translate-x-full border-t-transparent border-b-transparent border-l-transparent',
}

const getArrowBorderColor = (variant: TooltipVariant): string => {
  const colors: Record<TooltipVariant, string> = {
    default: 'border-neutral-900 dark:border-neutral-100',
    neutral: 'border-neutral-800 dark:border-neutral-200',
    info: 'border-blue-600 dark:border-blue-500',
  }
  return colors[variant]
}

// ============================================
// COMPONENTS
// ============================================

/**
 * TooltipTrigger wraps around a trigger element and a Tooltip.
 * It handles opening and closing the Tooltip when the user hovers
 * over or focuses the trigger.
 *
 * @example
 * ```tsx
 * <TooltipTrigger>
 *   <Button>Hover me</Button>
 *   <Tooltip>This is helpful information</Tooltip>
 * </TooltipTrigger>
 * ```
 */
export function TooltipTrigger(props: TooltipTriggerProps): JSX.Element {
  return <HeadlessTooltipTrigger {...props} />
}

/**
 * Styled tooltip component that displays a description on hover or focus.
 *
 * @example
 * ```tsx
 * <TooltipTrigger>
 *   <Button>Save</Button>
 *   <Tooltip placement="top">Save your changes</Tooltip>
 * </TooltipTrigger>
 * ```
 */
export function Tooltip(props: TooltipProps): JSX.Element {
  const [local, rest] = splitProps(props, [
    'children',
    'placement',
    'variant',
    'class',
    'showArrow',
  ])

  const placement = () => local.placement ?? 'top'
  const variant = () => local.variant ?? 'default'

  return (
    <HeadlessTooltip
      {...rest}
      placement={placement()}
      class={(_renderProps: TooltipRenderProps) => {
        const classes = [
          baseStyles,
          variantStyles[variant()],
          local.class ?? '',
        ].filter(Boolean).join(' ')
        return classes
      }}
    >
      {(renderProps: TooltipRenderProps) => (
        <>
          {local.children}
          <Show when={local.showArrow}>
            <div
              class={[
                'absolute w-0 h-0 border-4',
                arrowStyles[renderProps.placement ?? placement()],
                getArrowBorderColor(variant()),
              ].join(' ')}
            />
          </Show>
        </>
      )}
    </HeadlessTooltip>
  )
}

// ============================================
// SIMPLE CSS-ONLY TOOLTIP (Legacy)
// ============================================

export interface SimpleTooltipProps {
  /** The content to show in the tooltip */
  label: string
  /** The trigger element */
  children: JSX.Element
  /** Position of the tooltip */
  position?: 'top' | 'bottom'
  /** Additional CSS class */
  class?: string
}

/**
 * Simple CSS-only tooltip component.
 * Uses CSS hover effect for performance. No JS state management.
 *
 * @deprecated Use the accessible Tooltip + TooltipTrigger components instead.
 *
 * @example
 * ```tsx
 * <SimpleTooltip label="Save your changes">
 *   <button>Save</button>
 * </SimpleTooltip>
 * ```
 */
export function SimpleTooltip(props: SimpleTooltipProps): JSX.Element {
  const position = () => props.position ?? 'bottom'

  return (
    <div class={`vui-tooltip ${props.class ?? ''}`}>
      <div class="vui-tooltip__trigger">
        {props.children}
      </div>
      <div class={`vui-tooltip__content vui-tooltip__content--${position()}`}>
        <span>{props.label}</span>
      </div>
    </div>
  )
}

// Re-export types
export type { TooltipRenderProps }
