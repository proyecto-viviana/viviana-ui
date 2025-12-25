/**
 * Slider component for proyecto-viviana-ui
 *
 * A styled slider component with track, thumb, and value display.
 * Built directly on solidaria hooks for full accessibility support.
 */

import { type JSX, splitProps, mergeProps as solidMergeProps, Show } from 'solid-js'
import {
  createSlider,
  createFocusRing,
  createHover,
  type AriaSliderProps,
} from '@proyecto-viviana/solidaria'
import {
  createSliderState,
  type SliderOrientation,
} from '@proyecto-viviana/solid-stately'

// ============================================
// TYPES
// ============================================

export type SliderSize = 'sm' | 'md' | 'lg'
export type SliderVariant = 'default' | 'accent'

export interface SliderProps extends Omit<AriaSliderProps, 'label'> {
  /** The size of the slider. */
  size?: SliderSize
  /** The visual variant of the slider. */
  variant?: SliderVariant
  /** Additional CSS class name. */
  class?: string
  /** Label text for the slider. */
  label?: string
  /** The current value (controlled). */
  value?: number
  /** The default value (uncontrolled). */
  defaultValue?: number
  /** Handler called when the value changes. */
  onChange?: (value: number) => void
  /** Handler called when dragging ends. */
  onChangeEnd?: (value: number) => void
  /** The minimum value. */
  minValue?: number
  /** The maximum value. */
  maxValue?: number
  /** The step value. */
  step?: number
  /** The orientation of the slider. */
  orientation?: SliderOrientation
  /** The locale for number formatting. */
  locale?: string
  /** Number format options. */
  formatOptions?: Intl.NumberFormatOptions
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
    track: 'h-1',
    thumb: 'w-3 h-3 -mt-1',
    label: 'text-sm',
    output: 'text-xs',
  },
  md: {
    track: 'h-2',
    thumb: 'w-4 h-4 -mt-1',
    label: 'text-sm',
    output: 'text-sm',
  },
  lg: {
    track: 'h-3',
    thumb: 'w-5 h-5 -mt-1',
    label: 'text-base',
    output: 'text-base',
  },
}

// ============================================
// COMPONENT
// ============================================

/**
 * A slider allows users to select a value from a range.
 *
 * Built directly on solidaria hooks for full accessibility support.
 */
export function Slider(props: SliderProps): JSX.Element {
  const defaultProps: Partial<SliderProps> = {
    size: 'md',
    variant: 'default',
    minValue: 0,
    maxValue: 100,
    step: 1,
    orientation: 'horizontal',
    showOutput: true,
  }

  const merged = solidMergeProps(defaultProps, props)

  const [local, stateProps, ariaProps] = splitProps(merged, [
    'size',
    'variant',
    'class',
    'label',
    'showOutput',
    'showMinMax',
  ], [
    'value',
    'defaultValue',
    'onChange',
    'onChangeEnd',
    'minValue',
    'maxValue',
    'step',
    'orientation',
    'locale',
    'formatOptions',
  ])

  const size = () => sizeStyles[local.size!]

  // Track ref for pointer handling
  let trackRef: HTMLDivElement | undefined

  // Create slider state
  const state = createSliderState({
    get value() {
      return stateProps.value
    },
    get defaultValue() {
      return stateProps.defaultValue
    },
    get onChange() {
      return stateProps.onChange
    },
    get onChangeEnd() {
      return stateProps.onChangeEnd
    },
    get minValue() {
      return stateProps.minValue
    },
    get maxValue() {
      return stateProps.maxValue
    },
    get step() {
      return stateProps.step
    },
    get orientation() {
      return stateProps.orientation
    },
    get locale() {
      return stateProps.locale
    },
    get formatOptions() {
      return stateProps.formatOptions
    },
    get isDisabled() {
      return ariaProps.isDisabled
    },
  })

  // Create slider aria props
  const sliderAria = createSlider(
    {
      get label() {
        return local.label
      },
      get 'aria-label'() {
        return ariaProps['aria-label']
      },
      get 'aria-labelledby'() {
        return ariaProps['aria-labelledby']
      },
      get 'aria-describedby'() {
        return ariaProps['aria-describedby']
      },
      get isDisabled() {
        return ariaProps.isDisabled
      },
      get orientation() {
        return stateProps.orientation
      },
    },
    state,
    () => trackRef ?? null
  )

  // Create focus ring
  const { isFocused, isFocusVisible, focusProps } = createFocusRing()

  // Create hover
  const { isHovered, hoverProps } = createHover({
    get isDisabled() {
      return ariaProps.isDisabled
    },
  })

  // Compute classes
  const containerClasses = () => {
    const base = 'flex flex-col w-full'
    const disabledClass = ariaProps.isDisabled ? 'opacity-60' : ''
    const custom = local.class || ''
    return [base, disabledClass, custom].filter(Boolean).join(' ')
  }

  const labelRowClasses = () => {
    return 'flex justify-between items-center mb-2'
  }

  const trackContainerClasses = () => {
    const base = 'relative w-full cursor-pointer'
    const disabledClass = ariaProps.isDisabled ? 'cursor-not-allowed' : ''
    return [base, disabledClass].filter(Boolean).join(' ')
  }

  const trackClasses = () => {
    const base = 'w-full rounded-full bg-bg-300'
    const sizeClass = size().track
    return [base, sizeClass].filter(Boolean).join(' ')
  }

  const fillClasses = () => {
    const base = 'absolute top-0 left-0 h-full rounded-full transition-all'
    const variantClass = local.variant === 'accent' ? 'bg-accent' : 'bg-primary-400'
    return [base, variantClass].filter(Boolean).join(' ')
  }

  const thumbClasses = () => {
    const base = 'absolute top-1/2 rounded-full shadow-md transition-all cursor-grab'
    const sizeClass = size().thumb

    let stateClass: string
    if (ariaProps.isDisabled) {
      stateClass = 'bg-primary-400 cursor-not-allowed'
    } else if (state.isDragging()) {
      stateClass = local.variant === 'accent' ? 'bg-accent-400 scale-110 cursor-grabbing' : 'bg-primary-200 scale-110 cursor-grabbing'
    } else if (isHovered()) {
      stateClass = local.variant === 'accent' ? 'bg-accent-400 scale-105' : 'bg-primary-200 scale-105'
    } else {
      stateClass = local.variant === 'accent' ? 'bg-accent' : 'bg-primary-100'
    }

    const focusClass = isFocusVisible() ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg-100' : ''

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

  const minMaxClasses = () => {
    const base = 'text-xs text-primary-400'
    return base
  }

  // Clean props helpers
  const cleanGroupProps = () => {
    const { ref: _ref, ...rest } = sliderAria.groupProps as Record<string, unknown>
    return rest
  }

  const cleanTrackProps = () => {
    const { ref: _ref, style: _style, ...rest } = sliderAria.trackProps as Record<string, unknown>
    return rest
  }

  const cleanThumbProps = () => {
    const { ref: _ref, style: thumbStyle, ...rest } = sliderAria.thumbProps as Record<string, unknown>
    // Extract positioning from thumbStyle
    const style = thumbStyle as Record<string, string> | undefined
    return { rest, style }
  }

  const cleanFocusProps = () => {
    const { ref: _ref, ...rest } = focusProps as Record<string, unknown>
    return rest
  }

  const cleanHoverProps = () => {
    const { ref: _ref, ...rest } = hoverProps as Record<string, unknown>
    return rest
  }

  const cleanOutputProps = () => {
    const { ref: _ref, ...rest } = sliderAria.outputProps as Record<string, unknown>
    return rest
  }

  const thumbData = () => cleanThumbProps()
  const percent = () => state.getValuePercent() * 100

  return (
    <div
      {...cleanGroupProps()}
      class={containerClasses()}
      data-disabled={ariaProps.isDisabled || undefined}
      data-orientation={state.orientation}
    >
      {/* Label and Output Row */}
      <Show when={local.label || local.showOutput}>
        <div class={labelRowClasses()}>
          <Show when={local.label}>
            <span {...sliderAria.labelProps} class={labelClasses()}>
              {local.label}
            </span>
          </Show>
          <Show when={local.showOutput}>
            <output {...cleanOutputProps()} class={outputClasses()}>
              {state.getFormattedValue()}
            </output>
          </Show>
        </div>
      </Show>

      {/* Track Container */}
      <div class={trackContainerClasses()}>
        {/* Track */}
        <div
          ref={(el) => (trackRef = el)}
          {...cleanTrackProps()}
          class={trackClasses()}
          style={{ 'touch-action': 'none' }}
        >
          {/* Fill */}
          <div
            class={fillClasses()}
            style={{ width: `${percent()}%` }}
          />
        </div>

        {/* Thumb */}
        <div
          {...thumbData().rest}
          {...cleanFocusProps()}
          {...cleanHoverProps()}
          class={thumbClasses()}
          style={{
            left: `${percent()}%`,
            transform: 'translateX(-50%)',
            ...(thumbData().style || {}),
          }}
          data-dragging={state.isDragging() || undefined}
          data-focused={isFocused() || undefined}
          data-focus-visible={isFocusVisible() || undefined}
          data-hovered={isHovered() || undefined}
        />
      </div>

      {/* Min/Max Labels */}
      <Show when={local.showMinMax}>
        <div class="flex justify-between mt-1">
          <span class={minMaxClasses()}>{state.minValue}</span>
          <span class={minMaxClasses()}>{state.maxValue}</span>
        </div>
      </Show>

      {/* Hidden input for form submission */}
      <input {...sliderAria.inputProps} />
    </div>
  )
}

// Re-export types
export type { SliderState, SliderOrientation } from '@proyecto-viviana/solid-stately'
