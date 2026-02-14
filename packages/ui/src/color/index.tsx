/**
 * Color components for proyecto-viviana-ui
 *
 * Styled color picker components built on top of solidaria-components.
 * Inspired by Spectrum 2's color picker patterns.
 */

import { type JSX, splitProps, createContext, useContext, Show } from 'solid-js'
import {
  ColorSlider as HeadlessColorSlider,
  ColorSliderTrack as HeadlessColorSliderTrack,
  ColorSliderThumb as HeadlessColorSliderThumb,
  ColorArea as HeadlessColorArea,
  ColorAreaGradient as HeadlessColorAreaGradient,
  ColorAreaThumb as HeadlessColorAreaThumb,
  ColorWheel as HeadlessColorWheel,
  ColorWheelTrack as HeadlessColorWheelTrack,
  ColorWheelThumb as HeadlessColorWheelThumb,
  ColorField as HeadlessColorField,
  ColorFieldInput as HeadlessColorFieldInput,
  ColorSwatch as HeadlessColorSwatch,
  type ColorSliderProps as HeadlessColorSliderProps,
  type ColorAreaProps as HeadlessColorAreaProps,
  type ColorWheelProps as HeadlessColorWheelProps,
  type ColorFieldProps as HeadlessColorFieldProps,
  type ColorSwatchProps as HeadlessColorSwatchProps,
  type ColorSliderRenderProps,
  type ColorSliderTrackRenderProps,
  type ColorSliderThumbRenderProps,
  type ColorAreaRenderProps,
  type ColorAreaThumbRenderProps,
  type ColorWheelRenderProps,
  type ColorWheelThumbRenderProps,
  type ColorFieldRenderProps,
  type ColorSwatchRenderProps,
} from '@proyecto-viviana/solidaria-components'
import type { Color, ColorChannel, ColorFormat } from '@proyecto-viviana/solid-stately'

// ============================================
// SIZE CONTEXT
// ============================================

export type ColorSize = 'sm' | 'md' | 'lg'

interface ColorContextValue {
  size: ColorSize
}

const ColorSizeContext = createContext<ColorContextValue>({ size: 'md' })

// ============================================
// STYLES
// ============================================

const sizeStyles = {
  sm: {
    slider: {
      track: 'h-4 rounded',
      thumb: 'w-4 h-4',
      label: 'text-sm',
    },
    area: {
      container: 'w-48 h-48',
      thumb: 'w-4 h-4',
    },
    wheel: {
      container: 'w-48 h-48',
      track: 'stroke-[16px]',
      thumb: 'w-4 h-4',
    },
    field: {
      input: 'h-8 text-sm px-2',
      label: 'text-sm',
    },
    swatch: 'w-8 h-8',
  },
  md: {
    slider: {
      track: 'h-6 rounded-md',
      thumb: 'w-5 h-5',
      label: 'text-base',
    },
    area: {
      container: 'w-64 h-64',
      thumb: 'w-5 h-5',
    },
    wheel: {
      container: 'w-64 h-64',
      track: 'stroke-[20px]',
      thumb: 'w-5 h-5',
    },
    field: {
      input: 'h-10 text-base px-3',
      label: 'text-base',
    },
    swatch: 'w-10 h-10',
  },
  lg: {
    slider: {
      track: 'h-8 rounded-lg',
      thumb: 'w-6 h-6',
      label: 'text-lg',
    },
    area: {
      container: 'w-80 h-80',
      thumb: 'w-6 h-6',
    },
    wheel: {
      container: 'w-80 h-80',
      track: 'stroke-[24px]',
      thumb: 'w-6 h-6',
    },
    field: {
      input: 'h-12 text-lg px-4',
      label: 'text-lg',
    },
    swatch: 'w-12 h-12',
  },
}

// ============================================
// COLOR SLIDER
// ============================================

export interface ColorSliderProps extends Omit<HeadlessColorSliderProps, 'class' | 'style' | 'children'> {
  /** The size of the color slider. */
  size?: ColorSize
  /** Additional CSS class name. */
  class?: string
  /** Show the current value. */
  showValue?: boolean
}

/**
 * A color slider allows users to adjust a single color channel.
 *
 * @example
 * ```tsx
 * const [color, setColor] = createSignal(parseColor('hsl(0, 100%, 50%)'))
 *
 * <ColorSlider
 *   channel="hue"
 *   value={color()}
 *   onChange={setColor}
 *   label="Hue"
 * />
 * ```
 */
export function ColorSlider(props: ColorSliderProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['size', 'class', 'showValue'])

  const size = () => local.size ?? 'md'
  const styles = () => sizeStyles[size()]
  const customClass = local.class ?? ''

  const getClassName = (renderProps: ColorSliderRenderProps): string => {
    const base = 'flex flex-col gap-1.5'
    let stateClass = ''
    if (renderProps.isDisabled) {
      stateClass = 'opacity-50'
    }
    return [base, stateClass, customClass].filter(Boolean).join(' ')
  }

  const contextValue = () => ({ size: size() })

  return (
    <ColorSizeContext.Provider value={contextValue()}>
      <HeadlessColorSlider {...headlessProps} class={getClassName}>
        {(renderProps: ColorSliderRenderProps) => (
          <>
            <div class="flex items-center justify-between">
              <Show when={headlessProps.label}>
                <span class={`text-primary-200 font-medium ${styles().slider.label}`}>
                  {headlessProps.label}
                </span>
              </Show>
              <Show when={local.showValue}>
                <span class={`text-primary-400 ${styles().slider.label}`}>
                  {Math.round(renderProps.value)}
                </span>
              </Show>
            </div>
            <ColorSliderTrack>
              {() => <ColorSliderThumb />}
            </ColorSliderTrack>
          </>
        )}
      </HeadlessColorSlider>
    </ColorSizeContext.Provider>
  )
}

/**
 * The track component for a color slider.
 */
export function ColorSliderTrack(props: { children?: JSX.Element | (() => JSX.Element); class?: string }): JSX.Element {
  const context = useContext(ColorSizeContext)
  const styles = sizeStyles[context.size]
  const customClass = props.class ?? ''

  const getClassName = (renderProps: ColorSliderTrackRenderProps): string => {
    const base = `relative ${styles.slider.track} shadow-inner border border-bg-300`
    const dragClass = renderProps.isDragging ? 'cursor-grabbing' : 'cursor-pointer'
    return [base, dragClass, customClass].filter(Boolean).join(' ')
  }

  return (
    <HeadlessColorSliderTrack class={getClassName}>
      {props.children}
    </HeadlessColorSliderTrack>
  )
}

/**
 * The thumb component for a color slider.
 */
export function ColorSliderThumb(props: { class?: string }): JSX.Element {
  const context = useContext(ColorSizeContext)
  const styles = sizeStyles[context.size]
  const customClass = props.class ?? ''

  const getClassName = (renderProps: ColorSliderThumbRenderProps): string => {
    const base = `${styles.slider.thumb} rounded-full border-2 border-white shadow-md cursor-grab`
    const dragClass = renderProps.isDragging ? 'cursor-grabbing scale-110' : ''
    const focusClass = renderProps.isFocusVisible ? 'ring-2 ring-accent-300 ring-offset-2' : ''
    const disabledClass = renderProps.isDisabled ? 'cursor-not-allowed' : ''
    return [base, dragClass, focusClass, disabledClass, customClass].filter(Boolean).join(' ')
  }

  return <HeadlessColorSliderThumb class={getClassName} />
}

// ============================================
// COLOR AREA
// ============================================

export interface ColorAreaProps extends Omit<HeadlessColorAreaProps, 'class' | 'style' | 'children'> {
  /** The size of the color area. */
  size?: ColorSize
  /** Additional CSS class name. */
  class?: string
}

/**
 * A color area allows users to select a color by dragging in a 2D gradient.
 *
 * @example
 * ```tsx
 * const [color, setColor] = createSignal(parseColor('hsl(0, 100%, 50%)'))
 *
 * <ColorArea
 *   value={color()}
 *   onChange={setColor}
 *   xChannel="saturation"
 *   yChannel="lightness"
 * />
 * ```
 */
export function ColorArea(props: ColorAreaProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['size', 'class'])

  const size = () => local.size ?? 'md'
  const styles = () => sizeStyles[size()]
  const customClass = local.class ?? ''

  const getClassName = (renderProps: ColorAreaRenderProps): string => {
    const base = `relative ${styles().area.container} rounded-lg overflow-hidden border border-bg-300 shadow-inner`
    let stateClass = ''
    if (renderProps.isDisabled) {
      stateClass = 'opacity-50 cursor-not-allowed'
    }
    return [base, stateClass, customClass].filter(Boolean).join(' ')
  }

  const contextValue = () => ({ size: size() })

  return (
    <ColorSizeContext.Provider value={contextValue()}>
      <HeadlessColorArea {...headlessProps} class={getClassName}>
        {() => (
          <>
            <ColorAreaGradient />
            <ColorAreaThumb />
          </>
        )}
      </HeadlessColorArea>
    </ColorSizeContext.Provider>
  )
}

/**
 * The gradient background for a color area.
 */
export function ColorAreaGradient(props: { class?: string }): JSX.Element {
  const customClass = props.class ?? ''
  const className = `absolute inset-0 ${customClass}`

  return <HeadlessColorAreaGradient class={className} />
}

/**
 * The thumb component for a color area.
 */
export function ColorAreaThumb(props: { class?: string }): JSX.Element {
  const context = useContext(ColorSizeContext)
  const styles = sizeStyles[context.size]
  const customClass = props.class ?? ''

  const getClassName = (renderProps: ColorAreaThumbRenderProps): string => {
    const base = `${styles.area.thumb} rounded-full border-2 border-white shadow-md cursor-grab`
    const dragClass = renderProps.isDragging ? 'cursor-grabbing scale-110' : ''
    const focusClass = renderProps.isFocusVisible ? 'ring-2 ring-accent-300 ring-offset-2' : ''
    const disabledClass = renderProps.isDisabled ? 'cursor-not-allowed' : ''
    return [base, dragClass, focusClass, disabledClass, customClass].filter(Boolean).join(' ')
  }

  return <HeadlessColorAreaThumb class={getClassName} />
}

// ============================================
// COLOR WHEEL
// ============================================

export interface ColorWheelProps extends Omit<HeadlessColorWheelProps, 'class' | 'style' | 'children'> {
  /** The size of the color wheel. */
  size?: ColorSize
  /** Additional CSS class name. */
  class?: string
}

/**
 * A color wheel allows users to select a hue by dragging around a circular track.
 *
 * @example
 * ```tsx
 * const [color, setColor] = createSignal(parseColor('hsl(0, 100%, 50%)'))
 *
 * <ColorWheel
 *   value={color()}
 *   onChange={setColor}
 * />
 * ```
 */
export function ColorWheel(props: ColorWheelProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['size', 'class'])

  const size = () => local.size ?? 'md'
  const styles = () => sizeStyles[size()]
  const customClass = local.class ?? ''

  const getClassName = (renderProps: ColorWheelRenderProps): string => {
    const base = `relative ${styles().wheel.container}`
    let stateClass = ''
    if (renderProps.isDisabled) {
      stateClass = 'opacity-50 cursor-not-allowed'
    }
    return [base, stateClass, customClass].filter(Boolean).join(' ')
  }

  const contextValue = () => ({ size: size() })

  return (
    <ColorSizeContext.Provider value={contextValue()}>
      <HeadlessColorWheel {...headlessProps} class={getClassName}>
        {() => (
          <>
            <ColorWheelTrack />
            <ColorWheelThumb />
          </>
        )}
      </HeadlessColorWheel>
    </ColorSizeContext.Provider>
  )
}

/**
 * The circular track for a color wheel.
 */
export function ColorWheelTrack(props: { class?: string }): JSX.Element {
  const context = useContext(ColorSizeContext)
  const styles = sizeStyles[context.size]
  const customClass = props.class ?? ''

  const className = `${styles.wheel.track} ${customClass}`

  return <HeadlessColorWheelTrack class={className} />
}

/**
 * The thumb component for a color wheel.
 */
export function ColorWheelThumb(props: { class?: string }): JSX.Element {
  const context = useContext(ColorSizeContext)
  const styles = sizeStyles[context.size]
  const customClass = props.class ?? ''

  const getClassName = (renderProps: ColorWheelThumbRenderProps): string => {
    const base = `${styles.wheel.thumb} rounded-full border-2 border-white shadow-md cursor-grab`
    const dragClass = renderProps.isDragging ? 'cursor-grabbing scale-110' : ''
    const focusClass = renderProps.isFocusVisible ? 'ring-2 ring-accent-300 ring-offset-2' : ''
    const disabledClass = renderProps.isDisabled ? 'cursor-not-allowed' : ''
    return [base, dragClass, focusClass, disabledClass, customClass].filter(Boolean).join(' ')
  }

  return <HeadlessColorWheelThumb class={getClassName} />
}

// ============================================
// COLOR FIELD
// ============================================

export interface ColorFieldProps extends Omit<HeadlessColorFieldProps, 'class' | 'style' | 'children'> {
  /** The size of the color field. */
  size?: ColorSize
  /** Additional CSS class name. */
  class?: string
  /** Description text below the input. */
  description?: string
  /** Error message to display. */
  errorMessage?: string
}

/**
 * A color field allows users to enter a color value as text.
 *
 * @example
 * ```tsx
 * const [color, setColor] = createSignal(parseColor('#ff0000'))
 *
 * <ColorField
 *   value={color()}
 *   onChange={setColor}
 *   label="Color"
 * />
 * ```
 */
export function ColorField(props: ColorFieldProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, [
    'size',
    'class',
    'description',
    'errorMessage',
  ])

  const size = () => local.size ?? 'md'
  const styles = () => sizeStyles[size()]
  const customClass = local.class ?? ''

  const getClassName = (renderProps: ColorFieldRenderProps): string => {
    const base = 'flex flex-col gap-1.5'
    let stateClass = ''
    if (renderProps.isDisabled) {
      stateClass = 'opacity-50'
    }
    return [base, stateClass, customClass].filter(Boolean).join(' ')
  }

  const contextValue = () => ({ size: size() })

  return (
    <ColorSizeContext.Provider value={contextValue()}>
      <HeadlessColorField {...headlessProps} class={getClassName}>
        {() => (
          <>
            <Show when={headlessProps.label}>
              <span class={`text-primary-200 font-medium ${styles().field.label}`}>
                {headlessProps.label}
              </span>
            </Show>
            <ColorFieldInput isInvalid={!!local.errorMessage} />
            <Show when={local.description && !local.errorMessage}>
              <span class="text-primary-400 text-sm">{local.description}</span>
            </Show>
            <Show when={local.errorMessage}>
              <span class="text-danger-400 text-sm">{local.errorMessage}</span>
            </Show>
          </>
        )}
      </HeadlessColorField>
    </ColorSizeContext.Provider>
  )
}

/**
 * The input component for a color field.
 */
export function ColorFieldInput(props: { class?: string; isInvalid?: boolean }): JSX.Element {
  const context = useContext(ColorSizeContext)
  const styles = sizeStyles[context.size]
  const customClass = props.class ?? ''

  const base = `${styles.field.input} w-full rounded-md border bg-bg-400 text-primary-200 placeholder:text-primary-500 focus:outline-none focus:ring-2 focus:ring-accent-300`
  const borderClass = props.isInvalid
    ? 'border-danger-400'
    : 'border-bg-300 focus:border-accent-300'
  const className = [base, borderClass, customClass].filter(Boolean).join(' ')

  return <HeadlessColorFieldInput class={className} />
}

// ============================================
// COLOR SWATCH
// ============================================

export interface ColorSwatchProps extends Omit<HeadlessColorSwatchProps, 'class' | 'style'> {
  /** The size of the color swatch. */
  size?: ColorSize
  /** Additional CSS class name. */
  class?: string
  /** Whether the swatch is selectable. */
  isSelectable?: boolean
  /** Whether the swatch is selected. */
  isSelected?: boolean
  /** Handler called when the swatch is clicked. */
  onClick?: () => void
}

/**
 * A color swatch displays a color sample.
 *
 * @example
 * ```tsx
 * <ColorSwatch color={parseColor('#ff0000')} />
 *
 * // Selectable swatch
 * <ColorSwatch
 *   color={parseColor('#00ff00')}
 *   isSelectable
 *   isSelected={selectedColor === '#00ff00'}
 *   onClick={() => setSelectedColor('#00ff00')}
 * />
 * ```
 */
export function ColorSwatch(props: ColorSwatchProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, [
    'size',
    'class',
    'isSelectable',
    'isSelected',
    'onClick',
    'aria-label',
  ])

  const size = () => local.size ?? 'md'
  const styles = () => sizeStyles[size()]
  const customClass = local.class ?? ''

  const getClassName = (_renderProps: ColorSwatchRenderProps): string => {
    const base = `${styles().swatch} rounded-md border border-bg-300 shadow-sm`
    const selectableClass = local.isSelectable
      ? 'cursor-pointer hover:scale-105 transition-transform'
      : ''
    const selectedClass = local.isSelected
      ? 'ring-2 ring-accent-300 ring-offset-2 ring-offset-bg-400'
      : ''
    return [base, selectableClass, selectedClass, customClass].filter(Boolean).join(' ')
  }

  const handleClick = () => {
    if (local.isSelectable && local.onClick) {
      local.onClick()
    }
  }

  if (local.isSelectable && local.onClick) {
    return (
      <button
        type="button"
        class="inline-flex bg-transparent border-0 p-0 cursor-pointer"
        onClick={handleClick}
        aria-pressed={local.isSelected}
        aria-label={local['aria-label']}
      >
        <HeadlessColorSwatch
          {...headlessProps}
          aria-label={local['aria-label']}
          class={getClassName}
        />
      </button>
    )
  }

  return (
    <HeadlessColorSwatch
      {...headlessProps}
      aria-label={local['aria-label']}
      class={getClassName}
    />
  )
}

// ============================================
// COLOR PICKER (Composite Component)
// ============================================

export interface ColorPickerProps {
  /** The current color value (controlled). */
  value?: Color | string
  /** The default color value (uncontrolled). */
  defaultValue?: Color | string
  /** Handler called when the color changes. */
  onChange?: (color: Color) => void
  /** The size of the picker. */
  size?: ColorSize
  /** Additional CSS class name. */
  class?: string
  /** Whether the picker is disabled. */
  isDisabled?: boolean
  /** A label for the picker. */
  label?: string
  /** Whether to show the hex input field. */
  showInput?: boolean
  /** Whether to show channel sliders. */
  showSliders?: boolean
}

/**
 * A complete color picker component with area, sliders, and input.
 *
 * @example
 * ```tsx
 * const [color, setColor] = createSignal(parseColor('hsl(0, 100%, 50%)'))
 *
 * <ColorPicker
 *   value={color()}
 *   onChange={setColor}
 *   label="Pick a color"
 *   showInput
 *   showSliders
 * />
 * ```
 */
export function ColorPicker(props: ColorPickerProps): JSX.Element {
  const size = () => props.size ?? 'md'
  const styles = () => sizeStyles[size()]

  return (
    <div class={`flex flex-col gap-4 ${props.class ?? ''}`}>
      <Show when={props.label}>
        <span class={`text-primary-200 font-medium ${styles().field.label}`}>
          {props.label}
        </span>
      </Show>

      <ColorArea
        value={props.value}
        defaultValue={props.defaultValue}
        onChange={props.onChange}
        xChannel="saturation"
        yChannel="lightness"
        size={size()}
        isDisabled={props.isDisabled}
      />

      <Show when={props.showSliders !== false}>
        <ColorSlider
          value={props.value}
          defaultValue={props.defaultValue}
          onChange={props.onChange}
          channel="hue"
          label="Hue"
          size={size()}
          showValue
          isDisabled={props.isDisabled}
        />

        <ColorSlider
          value={props.value}
          defaultValue={props.defaultValue}
          onChange={props.onChange}
          channel="alpha"
          label="Alpha"
          size={size()}
          showValue
          isDisabled={props.isDisabled}
        />
      </Show>

      <Show when={props.showInput}>
        <ColorField
          value={props.value}
          defaultValue={props.defaultValue}
          onChange={(color) => {
            if (color && props.onChange) {
              props.onChange(color)
            }
          }}
          label="Hex"
          size={size()}
          isDisabled={props.isDisabled}
        />
      </Show>
    </div>
  )
}

// Attach sub-components for convenience
ColorSlider.Track = ColorSliderTrack
ColorSlider.Thumb = ColorSliderThumb
ColorArea.Gradient = ColorAreaGradient
ColorArea.Thumb = ColorAreaThumb
ColorWheel.Track = ColorWheelTrack
ColorWheel.Thumb = ColorWheelThumb
ColorField.Input = ColorFieldInput

// Re-export types for convenience
export type { Color, ColorChannel, ColorFormat }
