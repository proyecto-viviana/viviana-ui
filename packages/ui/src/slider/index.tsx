/**
 * Slider component for proyecto-viviana-ui
 *
 * A styled slider component with track, thumb, and value display.
 * Built on top of solidaria-components.
 */

import { type JSX, splitProps, Show } from 'solid-js'
import {
  Slider as HeadlessSlider,
  SliderTrack as HeadlessSliderTrack,
  SliderThumb as HeadlessSliderThumb,
  SliderOutput as HeadlessSliderOutput,
  type SliderProps as HeadlessSliderProps,
  type SliderRenderProps,
  type SliderTrackRenderProps,
  type SliderThumbRenderProps,
} from '@proyecto-viviana/solidaria-components'
import { type SliderOrientation } from '@proyecto-viviana/solid-stately'

// ============================================
// TYPES
// ============================================

export type SliderSize = 'sm' | 'md' | 'lg'
export type SliderVariant = 'default' | 'accent'

export interface SliderProps extends Omit<HeadlessSliderProps, 'class' | 'style' | 'children' | 'label'> {
  /** The size of the slider. */
  size?: SliderSize
  /** The visual variant of the slider. */
  variant?: SliderVariant
  /** Additional CSS class name. */
  class?: string
  /** Label text for the slider. */
  label?: string
  /** Whether to show the value output. */
  showOutput?: boolean
  /** Whether to show min/max labels. */
  showMinMax?: boolean
}

// ============================================
// STYLES
// ============================================

const sizeStyles = {
  sm: {
    trackHorizontal: 'h-1',
    trackVertical: 'w-1',
    thumb: 'w-3 h-3',
    label: 'text-sm',
    output: 'text-xs',
  },
  md: {
    trackHorizontal: 'h-2',
    trackVertical: 'w-2',
    thumb: 'w-4 h-4',
    label: 'text-sm',
    output: 'text-sm',
  },
  lg: {
    trackHorizontal: 'h-3',
    trackVertical: 'w-3',
    thumb: 'w-5 h-5',
    label: 'text-base',
    output: 'text-base',
  },
}

// ============================================
// COMPONENT
// ============================================

/**
 * A slider allows users to select a value from a range.
 */
export function Slider(props: SliderProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, [
    'size',
    'variant',
    'class',
    'label',
    'showOutput',
    'showMinMax',
  ])

  const size = () => sizeStyles[local.size ?? 'md']
  const orientation = (): SliderOrientation => headlessProps.orientation ?? 'horizontal'

  const containerClasses = () => {
    const base = orientation() === 'vertical' ? 'flex flex-col w-fit' : 'flex flex-col w-full'
    const disabledClass = headlessProps.isDisabled ? 'opacity-60' : ''
    const custom = local.class || ''
    return [base, disabledClass, custom].filter(Boolean).join(' ')
  }

  const labelRowClasses = () => {
    const rowLayout = orientation() === 'vertical' ? 'flex-col items-start gap-1' : 'flex-row justify-between items-center'
    return ['flex mb-2', rowLayout].join(' ')
  }

  const trackContainerClasses = () => {
    const base = orientation() === 'vertical' ? 'relative h-40 mx-auto' : 'relative w-full'
    const disabledClass = headlessProps.isDisabled ? 'cursor-not-allowed' : ''
    return [base, disabledClass].filter(Boolean).join(' ')
  }

  const trackClasses = (_renderProps: SliderTrackRenderProps) => {
    const base = 'relative rounded-full bg-bg-300'
    const axisClass = orientation() === 'vertical'
      ? [size().trackVertical, 'h-full'].join(' ')
      : [size().trackHorizontal, 'w-full'].join(' ')
    const interactiveClass = headlessProps.isDisabled ? '' : 'cursor-pointer'
    return [base, axisClass, interactiveClass].filter(Boolean).join(' ')
  }

  const fillClasses = () => {
    const base = 'absolute rounded-full transition-all'
    const variantClass = local.variant === 'accent' ? 'bg-accent' : 'bg-primary-400'
    return [base, variantClass].filter(Boolean).join(' ')
  }

  const fillStyle = (renderProps: SliderTrackRenderProps): JSX.CSSProperties => {
    if (renderProps.orientation === 'vertical') {
      return {
        left: '0',
        bottom: '0',
        width: '100%',
        height: `${renderProps.valuePercent * 100}%`,
      }
    }

    return {
      left: '0',
      top: '0',
      height: '100%',
      width: `${renderProps.valuePercent * 100}%`,
    }
  }

  const thumbClasses = (renderProps: SliderThumbRenderProps) => {
    const base = 'absolute rounded-full shadow-md transition-all'
    const sizeClass = size().thumb

    let stateClass = ''
    if (renderProps.isDisabled) {
      stateClass = 'bg-primary-400 cursor-not-allowed'
    } else if (renderProps.isDragging) {
      stateClass = local.variant === 'accent' ? 'bg-accent-400 scale-110 cursor-grabbing' : 'bg-primary-200 scale-110 cursor-grabbing'
    } else if (renderProps.isHovered) {
      stateClass = local.variant === 'accent' ? 'bg-accent-400 scale-105 cursor-grab' : 'bg-primary-200 scale-105 cursor-grab'
    } else {
      stateClass = local.variant === 'accent' ? 'bg-accent cursor-grab' : 'bg-primary-100 cursor-grab'
    }

    const focusClass = renderProps.isFocusVisible ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg-100' : ''

    return [base, sizeClass, stateClass, focusClass].filter(Boolean).join(' ')
  }

  const labelClasses = () => {
    const base = 'font-medium text-primary-200'
    const sizeClass = size().label
    return [base, sizeClass].filter(Boolean).join(' ')
  }

  const outputClasses = () => {
    const base = 'font-medium text-primary-100'
    const sizeClass = size().output
    return [base, sizeClass].filter(Boolean).join(' ')
  }

  const minMaxClasses = () => 'text-xs text-primary-400'

  const showOutput = () => local.showOutput ?? true
  const minValue = () => headlessProps.minValue ?? 0
  const maxValue = () => headlessProps.maxValue ?? 100

  return (
    <HeadlessSlider
      {...headlessProps}
      aria-label={headlessProps['aria-label'] ?? local.label}
      class={containerClasses()}
      children={(_renderProps: SliderRenderProps) => (
        <>
          <Show when={local.label || showOutput()}>
            <div class={labelRowClasses()}>
              <Show when={local.label}>
                <span class={labelClasses()}>{local.label}</span>
              </Show>
              <Show when={showOutput()}>
                <HeadlessSliderOutput class={outputClasses()} />
              </Show>
            </div>
          </Show>

          <div class={trackContainerClasses()}>
            <HeadlessSliderTrack class={trackClasses}>
              {(trackRenderProps) => (
                <>
                  <div
                    class={fillClasses()}
                    style={fillStyle(trackRenderProps)}
                  />
                  <HeadlessSliderThumb class={thumbClasses} />
                </>
              )}
            </HeadlessSliderTrack>
          </div>

          <Show when={local.showMinMax}>
            <div class="flex justify-between mt-1">
              <span class={minMaxClasses()}>{minValue()}</span>
              <span class={minMaxClasses()}>{maxValue()}</span>
            </div>
          </Show>
        </>
      )}
    />
  )
}

// Re-export types
export type { SliderState, SliderOrientation } from '@proyecto-viviana/solid-stately'

// Sub-component
export { RangeSlider } from './RangeSlider';
export type { RangeSliderProps, RangeSliderSize } from './RangeSlider';
