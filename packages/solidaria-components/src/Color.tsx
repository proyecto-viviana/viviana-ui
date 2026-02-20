/**
 * Color components for solidaria-components
 *
 * Pre-wired headless color picker components that combine state + aria hooks.
 * Port of react-aria-components color components.
 */

import {
  type JSX,
  createContext,
  createMemo,
  splitProps,
  useContext,
  Show,
} from 'solid-js';
import {
  createColorSlider,
  createColorArea,
  createColorWheel,
  createColorField,
  createColorSwatch,
  createFocusRing,
  createHover,
  type AriaColorSliderOptions,
  type AriaColorAreaOptions,
  type AriaColorWheelOptions,
  type AriaColorFieldOptions,
} from '@proyecto-viviana/solidaria';
import {
  createColorSliderState,
  createColorAreaState,
  createColorWheelState,
  createColorFieldState,
  normalizeColor,
  type Color,
  type ColorChannel,
  type ColorFormat,
  type ColorSliderState,
  type ColorAreaState,
  type ColorWheelState,
  type ColorFieldState,
} from '@proyecto-viviana/solid-stately';
import {
  type RenderChildren,
  type ClassNameOrFunction,
  type StyleOrFunction,
  type SlotProps,
  useRenderProps,
  filterDOMProps,
} from './utils';

// ============================================
// COLOR SLIDER
// ============================================

export interface ColorSliderRenderProps {
  /** Whether the slider is disabled. */
  isDisabled: boolean;
  /** Whether the slider is being dragged. */
  isDragging: boolean;
  /** The color channel being controlled. */
  channel: ColorChannel;
  /** The current value. */
  value: number;
  /** The current color. */
  color: Color;
}

export interface ColorSliderProps extends Omit<AriaColorSliderOptions, 'channel'>, SlotProps {
  /** The current color value (controlled). */
  value?: Color | string;
  /** The default color value (uncontrolled). */
  defaultValue?: Color | string;
  /** Handler called when the color changes. */
  onChange?: (color: Color) => void;
  /** Handler called when dragging ends. */
  onChangeEnd?: (color: Color) => void;
  /** The color channel to control. */
  channel: ColorChannel;
  /** A visible label for the slider. */
  label?: JSX.Element;
  /** The children of the component. */
  children?: RenderChildren<ColorSliderRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<ColorSliderRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<ColorSliderRenderProps>;
}

export interface ColorSliderTrackRenderProps {
  /** Whether the slider is disabled. */
  isDisabled: boolean;
  /** Whether the slider is being dragged. */
  isDragging: boolean;
}

export interface ColorSliderTrackProps extends SlotProps {
  /** The children of the track. */
  children?: RenderChildren<ColorSliderTrackRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<ColorSliderTrackRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<ColorSliderTrackRenderProps>;
}

export interface ColorSliderThumbRenderProps {
  /** Whether the slider is disabled. */
  isDisabled: boolean;
  /** Whether the thumb is being dragged. */
  isDragging: boolean;
  /** Whether the thumb is focused. */
  isFocused: boolean;
  /** Whether the thumb has keyboard focus. */
  isFocusVisible: boolean;
  /** Whether the thumb is hovered. */
  isHovered: boolean;
}

export interface ColorSliderThumbProps extends SlotProps {
  /** The children of the thumb. */
  children?: RenderChildren<ColorSliderThumbRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<ColorSliderThumbRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<ColorSliderThumbRenderProps>;
}

// Context
interface ColorSliderContextValue {
  state: ColorSliderState;
  trackProps: JSX.HTMLAttributes<HTMLDivElement>;
  thumbProps: JSX.HTMLAttributes<HTMLDivElement>;
  inputProps: JSX.InputHTMLAttributes<HTMLInputElement>;
  trackRef: HTMLDivElement | undefined;
  setTrackRef: (el: HTMLDivElement) => void;
}

export const ColorSliderContext = createContext<ColorSliderContextValue | null>(null);

/**
 * A color slider allows users to adjust a single color channel.
 */
export function ColorSlider(props: ColorSliderProps): JSX.Element {
  const [local, stateProps, ariaProps, rest] = splitProps(
    props,
    ['children', 'class', 'style', 'slot', 'label'],
    ['value', 'defaultValue', 'onChange', 'onChangeEnd', 'channel'],
    ['aria-label', 'aria-labelledby', 'aria-describedby', 'isDisabled', 'channelName']
  );

  // Create color slider state
  const state = createColorSliderState(() => ({
    value: stateProps.value,
    defaultValue: stateProps.defaultValue,
    onChange: stateProps.onChange,
    onChangeEnd: stateProps.onChangeEnd,
    channel: stateProps.channel,
    isDisabled: ariaProps.isDisabled,
  }));

  // Track ref
  let trackRef: HTMLDivElement | undefined;
  const setTrackRef = (el: HTMLDivElement) => {
    trackRef = el;
  };

  // Create color slider aria props
  const {
    trackProps,
    thumbProps,
    inputProps,
    labelProps,
  } = createColorSlider(
    () => ({
      channel: stateProps.channel,
      'aria-label': ariaProps['aria-label'],
      'aria-labelledby': ariaProps['aria-labelledby'],
      'aria-describedby': ariaProps['aria-describedby'],
      isDisabled: ariaProps.isDisabled,
      channelName: ariaProps.channelName,
    }),
    () => state,
    () => trackRef ?? null
  );

  // Render props values
  const renderValues = createMemo<ColorSliderRenderProps>(() => ({
    isDisabled: state.isDisabled,
    isDragging: state.isDragging,
    channel: state.channel,
    value: state.getThumbValue(),
    color: state.value,
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: props.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-ColorSlider',
    },
    renderValues
  );

  // Filter DOM props
  const domProps = createMemo(() => filterDOMProps(rest as Record<string, unknown>, { global: true }));

  return (
    <ColorSliderContext.Provider
      value={{
        state,
        trackProps,
        thumbProps,
        inputProps,
        trackRef,
        setTrackRef,
      }}
    >
      <div
        {...domProps()}
        class={renderProps.class()}
        style={renderProps.style()}
        data-disabled={state.isDisabled || undefined}
        data-dragging={state.isDragging || undefined}
        data-channel={state.channel}
      >
        {/* Label */}
        <Show when={local.label}>
          <label {...labelProps}>{local.label}</label>
        </Show>

        {renderProps.renderChildren()}

        {/* Hidden input for accessibility */}
        <input {...inputProps} />
      </div>
    </ColorSliderContext.Provider>
  );
}

/**
 * The track element of a color slider.
 */
export function ColorSliderTrack(props: ColorSliderTrackProps): JSX.Element {
  const [local, domProps] = splitProps(props, ['class', 'style', 'slot', 'children']);

  const context = useContext(ColorSliderContext);
  if (!context) {
    throw new Error('ColorSliderTrack must be used within a ColorSlider');
  }

  const { state, trackProps, setTrackRef } = context;

  // Render props values
  const renderValues = createMemo<ColorSliderTrackRenderProps>(() => ({
    isDisabled: state.isDisabled,
    isDragging: state.isDragging,
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: props.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-ColorSlider-track',
    },
    renderValues
  );

  // Clean props
  const cleanTrackProps = () => {
    const { ref: _ref, style: _trackStyle, ...rest } = trackProps as Record<string, unknown>;
    return rest;
  };

  // Merge styles
  const mergedStyle = () => {
    const trackStyle = (trackProps as { style?: Record<string, string> }).style || {};
    const renderStyle = renderProps.style() || {};
    return { ...trackStyle, ...renderStyle };
  };

  return (
    <div
      {...domProps}
      ref={setTrackRef}
      {...cleanTrackProps()}
      class={renderProps.class()}
      style={mergedStyle()}
      data-disabled={state.isDisabled || undefined}
      data-dragging={state.isDragging || undefined}
    >
      {renderProps.renderChildren()}
    </div>
  );
}

/**
 * The thumb element of a color slider.
 */
export function ColorSliderThumb(props: ColorSliderThumbProps): JSX.Element {
  const [local, domProps] = splitProps(props, ['class', 'style', 'slot', 'children']);

  const context = useContext(ColorSliderContext);
  if (!context) {
    throw new Error('ColorSliderThumb must be used within a ColorSlider');
  }

  const { state, thumbProps } = context;

  // Create focus ring
  const { isFocused, isFocusVisible, focusProps } = createFocusRing();

  // Create hover
  const { isHovered, hoverProps } = createHover({
    get isDisabled() {
      return state.isDisabled;
    },
  });

  // Render props values
  const renderValues = createMemo<ColorSliderThumbRenderProps>(() => ({
    isDisabled: state.isDisabled,
    isDragging: state.isDragging,
    isFocused: isFocused(),
    isFocusVisible: isFocusVisible(),
    isHovered: isHovered(),
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: props.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-ColorSlider-thumb',
    },
    renderValues
  );

  // Clean props
  const cleanThumbProps = () => {
    const { ref: _ref, style: _thumbStyle, ...rest } = thumbProps as Record<string, unknown>;
    return rest;
  };
  const cleanFocusProps = () => {
    const { ref: _ref, ...rest } = focusProps as Record<string, unknown>;
    return rest;
  };
  const cleanHoverProps = () => {
    const { ref: _ref, ...rest } = hoverProps as Record<string, unknown>;
    return rest;
  };

  // Merge styles
  const mergedStyle = () => {
    const thumbStyle = (thumbProps as { style?: Record<string, string> }).style || {};
    const renderStyle = renderProps.style() || {};
    return { ...thumbStyle, ...renderStyle };
  };

  return (
    <div
      {...domProps}
      {...cleanThumbProps()}
      {...cleanFocusProps()}
      {...cleanHoverProps()}
      class={renderProps.class()}
      style={mergedStyle()}
      data-disabled={state.isDisabled || undefined}
      data-dragging={state.isDragging || undefined}
      data-focused={isFocused() || undefined}
      data-focus-visible={isFocusVisible() || undefined}
      data-hovered={isHovered() || undefined}
    >
      {renderProps.renderChildren()}
    </div>
  );
}

// Attach sub-components
ColorSlider.Track = ColorSliderTrack;
ColorSlider.Thumb = ColorSliderThumb;

// ============================================
// COLOR AREA
// ============================================

export interface ColorAreaRenderProps {
  /** Whether the area is disabled. */
  isDisabled: boolean;
  /** Whether the area is being dragged. */
  isDragging: boolean;
  /** The X channel. */
  xChannel: ColorChannel;
  /** The Y channel. */
  yChannel: ColorChannel;
  /** The current color. */
  color: Color;
}

export interface ColorAreaProps extends AriaColorAreaOptions, SlotProps {
  /** The current color value (controlled). */
  value?: Color | string;
  /** The default color value (uncontrolled). */
  defaultValue?: Color | string;
  /** Handler called when the color changes. */
  onChange?: (color: Color) => void;
  /** Handler called when dragging ends. */
  onChangeEnd?: (color: Color) => void;
  /** The X channel to control. */
  xChannel?: ColorChannel;
  /** The Y channel to control. */
  yChannel?: ColorChannel;
  /** The children of the component. */
  children?: RenderChildren<ColorAreaRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<ColorAreaRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<ColorAreaRenderProps>;
}

export interface ColorAreaGradientRenderProps {
  /** Whether the area is disabled. */
  isDisabled: boolean;
}

export interface ColorAreaGradientProps extends SlotProps {
  /** The children of the gradient. */
  children?: RenderChildren<ColorAreaGradientRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<ColorAreaGradientRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<ColorAreaGradientRenderProps>;
}

export interface ColorAreaThumbRenderProps {
  /** Whether the area is disabled. */
  isDisabled: boolean;
  /** Whether the thumb is being dragged. */
  isDragging: boolean;
  /** Whether the thumb is focused. */
  isFocused: boolean;
  /** Whether the thumb has keyboard focus. */
  isFocusVisible: boolean;
  /** Whether the thumb is hovered. */
  isHovered: boolean;
}

export interface ColorAreaThumbProps extends SlotProps {
  /** The children of the thumb. */
  children?: RenderChildren<ColorAreaThumbRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<ColorAreaThumbRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<ColorAreaThumbRenderProps>;
}

// Context
interface ColorAreaContextValue {
  state: ColorAreaState;
  colorAreaProps: JSX.HTMLAttributes<HTMLDivElement>;
  gradientProps: JSX.HTMLAttributes<HTMLDivElement>;
  thumbProps: JSX.HTMLAttributes<HTMLDivElement>;
  xInputProps: JSX.InputHTMLAttributes<HTMLInputElement>;
  yInputProps: JSX.InputHTMLAttributes<HTMLInputElement>;
  areaRef: HTMLDivElement | undefined;
  setAreaRef: (el: HTMLDivElement) => void;
}

export const ColorAreaContext = createContext<ColorAreaContextValue | null>(null);

/**
 * A color area allows users to select a color using a 2D gradient.
 */
export function ColorArea(props: ColorAreaProps): JSX.Element {
  const [local, stateProps, ariaProps, rest] = splitProps(
    props,
    ['children', 'class', 'style', 'slot'],
    ['value', 'defaultValue', 'onChange', 'onChangeEnd', 'xChannel', 'yChannel'],
    ['aria-label', 'aria-labelledby', 'aria-describedby', 'isDisabled']
  );

  // Create color area state
  const state = createColorAreaState(() => ({
    value: stateProps.value,
    defaultValue: stateProps.defaultValue,
    onChange: stateProps.onChange,
    onChangeEnd: stateProps.onChangeEnd,
    xChannel: stateProps.xChannel,
    yChannel: stateProps.yChannel,
    isDisabled: ariaProps.isDisabled,
  }));

  // Area ref
  let areaRef: HTMLDivElement | undefined;
  const setAreaRef = (el: HTMLDivElement) => {
    areaRef = el;
  };

  // Create color area aria props
  const {
    colorAreaProps,
    gradientProps,
    thumbProps,
    xInputProps,
    yInputProps,
  } = createColorArea(
    () => ({
      'aria-label': ariaProps['aria-label'],
      'aria-labelledby': ariaProps['aria-labelledby'],
      'aria-describedby': ariaProps['aria-describedby'],
      isDisabled: ariaProps.isDisabled,
    }),
    () => state,
    () => areaRef ?? null
  );

  // Render props values
  const renderValues = createMemo<ColorAreaRenderProps>(() => ({
    isDisabled: state.isDisabled,
    isDragging: state.isDragging,
    xChannel: state.xChannel,
    yChannel: state.yChannel,
    color: state.value,
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: props.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-ColorArea',
    },
    renderValues
  );

  // Filter DOM props
  const domProps = createMemo(() => filterDOMProps(rest as Record<string, unknown>, { global: true }));

  // Clean props
  const cleanColorAreaProps = () => {
    const { ref: _ref, style: _areaStyle, ...rest } = colorAreaProps as Record<string, unknown>;
    return rest;
  };

  // Merge styles
  const mergedStyle = () => {
    const areaStyle = (colorAreaProps as { style?: Record<string, string> }).style || {};
    const renderStyle = renderProps.style() || {};
    return { ...areaStyle, ...renderStyle };
  };

  return (
    <ColorAreaContext.Provider
      value={{
        state,
        colorAreaProps,
        gradientProps,
        thumbProps,
        xInputProps,
        yInputProps,
        areaRef,
        setAreaRef,
      }}
    >
      <div
        ref={setAreaRef}
        {...domProps()}
        {...cleanColorAreaProps()}
        class={renderProps.class()}
        style={mergedStyle()}
        data-disabled={state.isDisabled || undefined}
        data-dragging={state.isDragging || undefined}
      >
        {renderProps.renderChildren()}

        {/* Hidden inputs for accessibility */}
        <input {...xInputProps} />
        <input {...yInputProps} />
      </div>
    </ColorAreaContext.Provider>
  );
}

/**
 * The gradient background of a color area.
 */
export function ColorAreaGradient(props: ColorAreaGradientProps): JSX.Element {
  const [local, domProps] = splitProps(props, ['class', 'style', 'slot', 'children']);

  const context = useContext(ColorAreaContext);
  if (!context) {
    throw new Error('ColorAreaGradient must be used within a ColorArea');
  }

  const { state, gradientProps } = context;

  // Render props values
  const renderValues = createMemo<ColorAreaGradientRenderProps>(() => ({
    isDisabled: state.isDisabled,
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: props.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-ColorArea-gradient',
    },
    renderValues
  );

  // Clean props
  const cleanGradientProps = () => {
    const { ref: _ref, style: _gradStyle, ...rest } = gradientProps as Record<string, unknown>;
    return rest;
  };

  // Merge styles
  const mergedStyle = () => {
    const gradStyle = (gradientProps as { style?: Record<string, string> }).style || {};
    const renderStyle = renderProps.style() || {};
    return { ...gradStyle, ...renderStyle };
  };

  return (
    <div
      {...domProps}
      {...cleanGradientProps()}
      class={renderProps.class()}
      style={mergedStyle()}
      data-disabled={state.isDisabled || undefined}
    >
      {renderProps.renderChildren()}
    </div>
  );
}

/**
 * The thumb element of a color area.
 */
export function ColorAreaThumb(props: ColorAreaThumbProps): JSX.Element {
  const [local, domProps] = splitProps(props, ['class', 'style', 'slot', 'children']);

  const context = useContext(ColorAreaContext);
  if (!context) {
    throw new Error('ColorAreaThumb must be used within a ColorArea');
  }

  const { state, thumbProps } = context;

  // Create focus ring
  const { isFocused, isFocusVisible, focusProps } = createFocusRing();

  // Create hover
  const { isHovered, hoverProps } = createHover({
    get isDisabled() {
      return state.isDisabled;
    },
  });

  // Render props values
  const renderValues = createMemo<ColorAreaThumbRenderProps>(() => ({
    isDisabled: state.isDisabled,
    isDragging: state.isDragging,
    isFocused: isFocused(),
    isFocusVisible: isFocusVisible(),
    isHovered: isHovered(),
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: props.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-ColorArea-thumb',
    },
    renderValues
  );

  // Clean props
  const cleanThumbProps = () => {
    const { ref: _ref, style: _thumbStyle, ...rest } = thumbProps as Record<string, unknown>;
    return rest;
  };
  const cleanFocusProps = () => {
    const { ref: _ref, ...rest } = focusProps as Record<string, unknown>;
    return rest;
  };
  const cleanHoverProps = () => {
    const { ref: _ref, ...rest } = hoverProps as Record<string, unknown>;
    return rest;
  };

  // Merge styles
  const mergedStyle = () => {
    const thumbStyle = (thumbProps as { style?: Record<string, string> }).style || {};
    const renderStyle = renderProps.style() || {};
    return { ...thumbStyle, ...renderStyle };
  };

  return (
    <div
      {...domProps}
      {...cleanThumbProps()}
      {...cleanFocusProps()}
      {...cleanHoverProps()}
      class={renderProps.class()}
      style={mergedStyle()}
      data-disabled={state.isDisabled || undefined}
      data-dragging={state.isDragging || undefined}
      data-focused={isFocused() || undefined}
      data-focus-visible={isFocusVisible() || undefined}
      data-hovered={isHovered() || undefined}
    >
      {renderProps.renderChildren()}
    </div>
  );
}

// Attach sub-components
ColorArea.Gradient = ColorAreaGradient;
ColorArea.Thumb = ColorAreaThumb;

// ============================================
// COLOR WHEEL
// ============================================

export interface ColorWheelRenderProps {
  /** Whether the wheel is disabled. */
  isDisabled: boolean;
  /** Whether the wheel is being dragged. */
  isDragging: boolean;
  /** The current hue value (0-360). */
  hue: number;
  /** The current color. */
  color: Color;
}

export interface ColorWheelProps extends AriaColorWheelOptions, SlotProps {
  /** The current color value (controlled). */
  value?: Color | string;
  /** The default color value (uncontrolled). */
  defaultValue?: Color | string;
  /** Handler called when the color changes. */
  onChange?: (color: Color) => void;
  /** Handler called when dragging ends. */
  onChangeEnd?: (color: Color) => void;
  /** The children of the component. */
  children?: RenderChildren<ColorWheelRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<ColorWheelRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<ColorWheelRenderProps>;
}

export interface ColorWheelTrackRenderProps {
  /** Whether the wheel is disabled. */
  isDisabled: boolean;
  /** Whether the wheel is being dragged. */
  isDragging: boolean;
}

export interface ColorWheelTrackProps extends SlotProps {
  /** The children of the track. */
  children?: RenderChildren<ColorWheelTrackRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<ColorWheelTrackRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<ColorWheelTrackRenderProps>;
}

export interface ColorWheelThumbRenderProps {
  /** Whether the wheel is disabled. */
  isDisabled: boolean;
  /** Whether the thumb is being dragged. */
  isDragging: boolean;
  /** Whether the thumb is focused. */
  isFocused: boolean;
  /** Whether the thumb has keyboard focus. */
  isFocusVisible: boolean;
  /** Whether the thumb is hovered. */
  isHovered: boolean;
}

export interface ColorWheelThumbProps extends SlotProps {
  /** The children of the thumb. */
  children?: RenderChildren<ColorWheelThumbRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<ColorWheelThumbRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<ColorWheelThumbRenderProps>;
}

// Context
interface ColorWheelContextValue {
  state: ColorWheelState;
  trackProps: JSX.HTMLAttributes<HTMLDivElement>;
  thumbProps: JSX.HTMLAttributes<HTMLDivElement>;
  inputProps: JSX.InputHTMLAttributes<HTMLInputElement>;
  wheelRef: HTMLDivElement | undefined;
  setWheelRef: (el: HTMLDivElement) => void;
}

export const ColorWheelContext = createContext<ColorWheelContextValue | null>(null);

/**
 * A color wheel allows users to select a hue using a circular control.
 */
export function ColorWheel(props: ColorWheelProps): JSX.Element {
  const [local, stateProps, ariaProps, rest] = splitProps(
    props,
    ['children', 'class', 'style', 'slot'],
    ['value', 'defaultValue', 'onChange', 'onChangeEnd'],
    ['aria-label', 'aria-labelledby', 'aria-describedby', 'isDisabled']
  );

  // Create color wheel state
  const state = createColorWheelState(() => ({
    value: stateProps.value,
    defaultValue: stateProps.defaultValue,
    onChange: stateProps.onChange,
    onChangeEnd: stateProps.onChangeEnd,
    isDisabled: ariaProps.isDisabled,
  }));

  // Wheel ref
  let wheelRef: HTMLDivElement | undefined;
  const setWheelRef = (el: HTMLDivElement) => {
    wheelRef = el;
  };

  // Create color wheel aria props
  const {
    trackProps,
    thumbProps,
    inputProps,
  } = createColorWheel(
    () => ({
      'aria-label': ariaProps['aria-label'],
      'aria-labelledby': ariaProps['aria-labelledby'],
      'aria-describedby': ariaProps['aria-describedby'],
      isDisabled: ariaProps.isDisabled,
    }),
    () => state,
    () => wheelRef ?? null
  );

  // Render props values
  const renderValues = createMemo<ColorWheelRenderProps>(() => ({
    isDisabled: state.isDisabled,
    isDragging: state.isDragging,
    hue: state.getHue(),
    color: state.value,
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: props.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-ColorWheel',
    },
    renderValues
  );

  // Filter DOM props
  const domProps = createMemo(() => filterDOMProps(rest as Record<string, unknown>, { global: true }));

  return (
    <ColorWheelContext.Provider
      value={{
        state,
        trackProps,
        thumbProps,
        inputProps,
        wheelRef,
        setWheelRef,
      }}
    >
      <div
        {...domProps()}
        class={renderProps.class()}
        style={renderProps.style()}
        data-disabled={state.isDisabled || undefined}
        data-dragging={state.isDragging || undefined}
      >
        {renderProps.renderChildren()}

        {/* Hidden input for accessibility */}
        <input {...inputProps} />
      </div>
    </ColorWheelContext.Provider>
  );
}

/**
 * The track element of a color wheel.
 */
export function ColorWheelTrack(props: ColorWheelTrackProps): JSX.Element {
  const [local, domProps] = splitProps(props, ['class', 'style', 'slot', 'children']);

  const context = useContext(ColorWheelContext);
  if (!context) {
    throw new Error('ColorWheelTrack must be used within a ColorWheel');
  }

  const { state, trackProps, setWheelRef } = context;

  // Render props values
  const renderValues = createMemo<ColorWheelTrackRenderProps>(() => ({
    isDisabled: state.isDisabled,
    isDragging: state.isDragging,
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: props.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-ColorWheel-track',
    },
    renderValues
  );

  // Clean props
  const cleanTrackProps = () => {
    const { ref: _ref, style: _trackStyle, ...rest } = trackProps as Record<string, unknown>;
    return rest;
  };

  // Merge styles
  const mergedStyle = () => {
    const trackStyle = (trackProps as { style?: Record<string, string> }).style || {};
    const renderStyle = renderProps.style() || {};
    return { ...trackStyle, ...renderStyle };
  };

  return (
    <div
      {...domProps}
      ref={setWheelRef}
      {...cleanTrackProps()}
      class={renderProps.class()}
      style={mergedStyle()}
      data-disabled={state.isDisabled || undefined}
      data-dragging={state.isDragging || undefined}
    >
      {renderProps.renderChildren()}
    </div>
  );
}

/**
 * The thumb element of a color wheel.
 */
export function ColorWheelThumb(props: ColorWheelThumbProps): JSX.Element {
  const [local, domProps] = splitProps(props, ['class', 'style', 'slot', 'children']);

  const context = useContext(ColorWheelContext);
  if (!context) {
    throw new Error('ColorWheelThumb must be used within a ColorWheel');
  }

  const { state, thumbProps } = context;

  // Create focus ring
  const { isFocused, isFocusVisible, focusProps } = createFocusRing();

  // Create hover
  const { isHovered, hoverProps } = createHover({
    get isDisabled() {
      return state.isDisabled;
    },
  });

  // Render props values
  const renderValues = createMemo<ColorWheelThumbRenderProps>(() => ({
    isDisabled: state.isDisabled,
    isDragging: state.isDragging,
    isFocused: isFocused(),
    isFocusVisible: isFocusVisible(),
    isHovered: isHovered(),
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: props.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-ColorWheel-thumb',
    },
    renderValues
  );

  // Clean props
  const cleanThumbProps = () => {
    const { ref: _ref, style: _thumbStyle, ...rest } = thumbProps as Record<string, unknown>;
    return rest;
  };
  const cleanFocusProps = () => {
    const { ref: _ref, ...rest } = focusProps as Record<string, unknown>;
    return rest;
  };
  const cleanHoverProps = () => {
    const { ref: _ref, ...rest } = hoverProps as Record<string, unknown>;
    return rest;
  };

  // Merge styles
  const mergedStyle = () => {
    const thumbStyle = (thumbProps as { style?: Record<string, string> }).style || {};
    const renderStyle = renderProps.style() || {};
    return { ...thumbStyle, ...renderStyle };
  };

  return (
    <div
      {...domProps}
      {...cleanThumbProps()}
      {...cleanFocusProps()}
      {...cleanHoverProps()}
      class={renderProps.class()}
      style={mergedStyle()}
      data-disabled={state.isDisabled || undefined}
      data-dragging={state.isDragging || undefined}
      data-focused={isFocused() || undefined}
      data-focus-visible={isFocusVisible() || undefined}
      data-hovered={isHovered() || undefined}
    >
      {renderProps.renderChildren()}
    </div>
  );
}

// Attach sub-components
ColorWheel.Track = ColorWheelTrack;
ColorWheel.Thumb = ColorWheelThumb;

// ============================================
// COLOR FIELD
// ============================================

export interface ColorFieldRenderProps {
  /** Whether the field is disabled. */
  isDisabled: boolean;
  /** Whether the field is read-only. */
  isReadOnly: boolean;
  /** Whether the input value is invalid. */
  isInvalid: boolean;
  /** The current color value (null if invalid). */
  color: Color | null;
  /** The color channel being edited (if single channel mode). */
  channel: ColorChannel | undefined;
}

export interface ColorFieldProps extends AriaColorFieldOptions, SlotProps {
  /** The current color value (controlled). */
  value?: Color | string | null;
  /** The default color value (uncontrolled). */
  defaultValue?: Color | string;
  /** Handler called when the color changes. */
  onChange?: (color: Color | null) => void;
  /** The color channel to edit (for single channel mode). */
  channel?: ColorChannel;
  /** The color format for parsing/displaying. */
  colorFormat?: ColorFormat;
  /** A visible label for the field. */
  label?: JSX.Element;
  /** The children of the component. */
  children?: RenderChildren<ColorFieldRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<ColorFieldRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<ColorFieldRenderProps>;
}

export interface ColorFieldInputRenderProps {
  /** Whether the field is disabled. */
  isDisabled: boolean;
  /** Whether the field is read-only. */
  isReadOnly: boolean;
  /** Whether the input value is invalid. */
  isInvalid: boolean;
  /** Whether the input is focused. */
  isFocused: boolean;
  /** Whether the input has keyboard focus. */
  isFocusVisible: boolean;
  /** Whether the input is hovered. */
  isHovered: boolean;
}

export interface ColorFieldInputProps extends SlotProps {
  /** The children of the input (usually not used). */
  children?: RenderChildren<ColorFieldInputRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<ColorFieldInputRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<ColorFieldInputRenderProps>;
}

// Context
interface ColorFieldContextValue {
  state: ColorFieldState;
  inputProps: JSX.InputHTMLAttributes<HTMLInputElement>;
  labelProps: JSX.LabelHTMLAttributes<HTMLLabelElement>;
}

export const ColorFieldContext = createContext<ColorFieldContextValue | null>(null);

/**
 * A color field allows users to enter a color value as text.
 */
export function ColorField(props: ColorFieldProps): JSX.Element {
  const [local, stateProps, ariaProps, rest] = splitProps(
    props,
    ['children', 'class', 'style', 'slot', 'label'],
    ['value', 'defaultValue', 'onChange', 'channel', 'colorFormat'],
    ['aria-label', 'aria-labelledby', 'aria-describedby', 'isDisabled', 'isReadOnly']
  );

  // Create color field state
  const state = createColorFieldState(() => ({
    value: stateProps.value,
    defaultValue: stateProps.defaultValue,
    onChange: stateProps.onChange,
    channel: stateProps.channel,
    colorFormat: stateProps.colorFormat,
    isDisabled: ariaProps.isDisabled,
    isReadOnly: ariaProps.isReadOnly,
  }));

  // Input ref
  let inputRef: HTMLInputElement | undefined;

  // Create color field aria props
  const {
    inputProps,
    labelProps,
  } = createColorField(
    () => ({
      'aria-label': ariaProps['aria-label'],
      'aria-labelledby': ariaProps['aria-labelledby'],
      'aria-describedby': ariaProps['aria-describedby'],
      isDisabled: ariaProps.isDisabled,
      isReadOnly: ariaProps.isReadOnly,
      channel: stateProps.channel,
    }),
    () => state,
    () => inputRef ?? null
  );

  // Render props values
  const renderValues = createMemo<ColorFieldRenderProps>(() => ({
    isDisabled: state.isDisabled,
    isReadOnly: state.isReadOnly,
    isInvalid: state.isInvalid,
    color: state.value,
    channel: state.channel,
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: props.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-ColorField',
    },
    renderValues
  );

  // Filter DOM props
  const domProps = createMemo(() => filterDOMProps(rest as Record<string, unknown>, { global: true }));

  return (
    <ColorFieldContext.Provider
      value={{
        state,
        inputProps,
        labelProps,
      }}
    >
      <div
        {...domProps()}
        class={renderProps.class()}
        style={renderProps.style()}
        data-disabled={state.isDisabled || undefined}
        data-readonly={state.isReadOnly || undefined}
        data-invalid={state.isInvalid || undefined}
      >
        {/* Label */}
        <Show when={local.label}>
          <label {...labelProps}>{local.label}</label>
        </Show>

        {renderProps.renderChildren()}
      </div>
    </ColorFieldContext.Provider>
  );
}

/**
 * The input element of a color field.
 */
export function ColorFieldInput(props: ColorFieldInputProps): JSX.Element {
  const [local, domProps] = splitProps(props, ['class', 'style', 'slot', 'children']);

  const context = useContext(ColorFieldContext);
  if (!context) {
    throw new Error('ColorFieldInput must be used within a ColorField');
  }

  const { state, inputProps } = context;

  // Create focus ring
  const { isFocused, isFocusVisible, focusProps } = createFocusRing();

  // Create hover
  const { isHovered, hoverProps } = createHover({
    get isDisabled() {
      return state.isDisabled;
    },
  });

  // Render props values
  const renderValues = createMemo<ColorFieldInputRenderProps>(() => ({
    isDisabled: state.isDisabled,
    isReadOnly: state.isReadOnly,
    isInvalid: state.isInvalid,
    isFocused: isFocused(),
    isFocusVisible: isFocusVisible(),
    isHovered: isHovered(),
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: props.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-ColorField-input',
    },
    renderValues
  );

  // Clean props
  const cleanInputProps = () => {
    const { ref: _ref, style: _inputStyle, ...rest } = inputProps as Record<string, unknown>;
    return rest;
  };
  const cleanFocusProps = () => {
    const { ref: _ref, ...rest } = focusProps as Record<string, unknown>;
    return rest;
  };
  const cleanHoverProps = () => {
    const { ref: _ref, ...rest } = hoverProps as Record<string, unknown>;
    return rest;
  };

  return (
    <input
      {...domProps}
      {...cleanInputProps()}
      {...cleanFocusProps()}
      {...cleanHoverProps()}
      class={renderProps.class()}
      style={renderProps.style()}
      data-disabled={state.isDisabled || undefined}
      data-readonly={state.isReadOnly || undefined}
      data-invalid={state.isInvalid || undefined}
      data-focused={isFocused() || undefined}
      data-focus-visible={isFocusVisible() || undefined}
      data-hovered={isHovered() || undefined}
    />
  );
}

// Attach sub-components
ColorField.Input = ColorFieldInput;

// ============================================
// COLOR SWATCH
// ============================================

export interface ColorSwatchRenderProps {
  /** The color being displayed. */
  color: Color;
  /** The color as a CSS string. */
  colorValue: string;
}

export interface ColorSwatchProps extends SlotProps {
  /** The color to display. */
  color: Color | string;
  /** Accessible label for the swatch. */
  'aria-label'?: string;
  /** The children of the component. */
  children?: RenderChildren<ColorSwatchRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<ColorSwatchRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<ColorSwatchRenderProps>;
}

/**
 * A color swatch displays a preview of a color.
 */
export function ColorSwatch(props: ColorSwatchProps): JSX.Element {
  const [local, ariaProps, rest] = splitProps(
    props,
    ['children', 'class', 'style', 'slot', 'color'],
    ['aria-label']
  );

  // Create color swatch aria props
  const { swatchProps } = createColorSwatch(() => ({
    color: local.color,
    'aria-label': ariaProps['aria-label'],
  }));

  // Normalize color
  const color = createMemo(() => normalizeColor(local.color));

  // Render props values
  const renderValues = createMemo<ColorSwatchRenderProps>(() => ({
    color: color(),
    colorValue: color().toString('css'),
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: props.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-ColorSwatch',
    },
    renderValues
  );

  // Filter DOM props
  const domProps = createMemo(() => filterDOMProps(rest as Record<string, unknown>, { global: true }));

  // Clean props
  const cleanSwatchProps = () => {
    const { ref: _ref, style: _swatchStyle, ...rest } = swatchProps as Record<string, unknown>;
    return rest;
  };

  // Merge styles
  const mergedStyle = () => {
    const swatchStyle = (swatchProps as { style?: Record<string, string> }).style || {};
    const renderStyle = renderProps.style() || {};
    return { ...swatchStyle, ...renderStyle };
  };

  return (
    <div
      {...domProps()}
      {...cleanSwatchProps()}
      class={renderProps.class()}
      style={mergedStyle()}
    >
      {renderProps.renderChildren()}
    </div>
  );
}

export const ColorSliderStateContext = ColorSliderContext;
export const ColorAreaStateContext = ColorAreaContext;
export const ColorWheelStateContext = ColorWheelContext;
export const ColorWheelTrackContext = ColorWheelContext;
export const ColorFieldStateContext = ColorFieldContext;
export const ColorSwatchContext = createContext<null>(null);
export const ColorPickerContext = ColorFieldContext;
export const ColorPickerStateContext = ColorFieldContext;
export const ColorSwatchPickerContext = createContext<null>(null);
export const ColorThumb = ColorSliderThumb;

export interface ColorPickerProps extends ColorFieldProps {}
export interface ColorPickerRenderProps extends ColorFieldRenderProps {}
export interface ColorSwatchPickerProps extends SlotProps {
  children?: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties;
}
export interface ColorSwatchPickerItemProps extends SlotProps {
  children?: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties;
}

export function ColorPicker(props: ColorPickerProps): JSX.Element {
  return <ColorField {...props} />;
}

export function ColorSwatchPicker(props: ColorSwatchPickerProps): JSX.Element {
  return (
    <div class={props.class ?? 'solidaria-ColorSwatchPicker'} style={props.style}>
      {props.children}
    </div>
  );
}

export function ColorSwatchPickerItem(props: ColorSwatchPickerItemProps): JSX.Element {
  return (
    <div class={props.class ?? 'solidaria-ColorSwatchPickerItem'} style={props.style}>
      {props.children}
    </div>
  );
}
