/**
 * ColorWheel state management.
 * Based on @react-stately/color useColorWheelState.
 */

import { createSignal, createMemo, type Accessor } from 'solid-js';
import type { Color, ColorChannel } from './types';
import { normalizeColor } from './Color';

export interface ColorWheelStateOptions {
  /** The current color value (controlled). */
  value?: Color | string;
  /** The default color value (uncontrolled). */
  defaultValue?: Color | string;
  /** Handler called when the color changes. */
  onChange?: (color: Color) => void;
  /** Handler called when dragging ends. */
  onChangeEnd?: (color: Color) => void;
  /** Whether the wheel is disabled. */
  isDisabled?: boolean;
}

export interface ColorWheelState {
  /** The current color value. */
  readonly value: Color;
  /** Whether the wheel is being dragged. */
  readonly isDragging: boolean;
  /** Whether the wheel is disabled. */
  readonly isDisabled: boolean;
  /** Step value for hue changes. */
  readonly step: number;
  /** Page step value for hue changes. */
  readonly pageStep: number;

  /** Get the current hue value (0-360). */
  getHue(): number;
  /** Set the hue value. */
  setHue(value: number): void;
  /** Set hue from an angle in radians. */
  setHueFromAngle(angle: number): void;
  /** Get the thumb angle in radians (0 = right, increases counterclockwise). */
  getThumbAngle(): number;
  /** Increment hue value. */
  increment(stepSize?: number): void;
  /** Decrement hue value. */
  decrement(stepSize?: number): void;
  /** Set the dragging state. */
  setDragging(isDragging: boolean): void;
  /** Get the display color (with full saturation/brightness for wheel). */
  getDisplayColor(): Color;
}

/**
 * Creates state for a color wheel (circular hue picker).
 */
export function createColorWheelState(
  options: Accessor<ColorWheelStateOptions>
): ColorWheelState {
  const getOptions = () => options();

  // Internal value state
  const [internalValue, setInternalValue] = createSignal<Color | null>(null);
  const [isDragging, setIsDragging] = createSignal(false);

  // Initialize internal value
  const initValue = () => {
    const opts = getOptions();
    if (opts.defaultValue) {
      return normalizeColor(opts.defaultValue);
    }
    return null;
  };

  // Set initial value
  if (internalValue() === null) {
    const init = initValue();
    if (init) {
      setInternalValue(init);
    }
  }

  // Controlled vs uncontrolled value
  const value = createMemo(() => {
    const opts = getOptions();
    if (opts.value !== undefined) {
      return normalizeColor(opts.value);
    }
    return internalValue() ?? normalizeColor('#ff0000');
  });

  const isDisabled = createMemo(() => getOptions().isDisabled ?? false);

  // Hue step and page step
  const hueRange = createMemo(() => value().getChannelRange('hue'));
  const step = createMemo(() => hueRange().step);
  const pageStep = createMemo(() => hueRange().pageSize);

  // Update value
  const updateValue = (newColor: Color) => {
    const opts = getOptions();

    // Controlled mode
    if (opts.value !== undefined) {
      opts.onChange?.(newColor);
      return;
    }

    // Uncontrolled mode
    setInternalValue(newColor);
    opts.onChange?.(newColor);
  };

  // Get hue value (0-360)
  const getHue = () => value().getChannelValue('hue');

  // Set hue value
  const setHue = (newValue: number) => {
    // Wrap hue to 0-360 range
    let hue = newValue % 360;
    if (hue < 0) hue += 360;

    // Round to step
    const range = hueRange();
    const rounded = Math.round(hue / range.step) * range.step;

    const newColor = value().withChannelValue('hue', rounded);
    updateValue(newColor);
  };

  // Set hue from angle (radians, 0 = right, counterclockwise)
  const setHueFromAngle = (angle: number) => {
    // Convert angle to degrees (0-360)
    // angle 0 = right (3 o'clock) = hue 0
    // angle increases counterclockwise
    let degrees = (angle * 180) / Math.PI;
    degrees = 360 - degrees; // Convert to clockwise
    if (degrees < 0) degrees += 360;
    if (degrees >= 360) degrees -= 360;

    setHue(degrees);
  };

  // Get thumb angle in radians
  const getThumbAngle = () => {
    const hue = getHue();
    // Convert hue to angle (radians)
    // hue 0 = angle 0 (right)
    // hue increases clockwise, angle increases counterclockwise
    const degrees = 360 - hue;
    return (degrees * Math.PI) / 180;
  };

  // Increment hue
  const increment = (stepSize?: number) => {
    const s = stepSize ?? step();
    setHue(getHue() + s);
  };

  // Decrement hue
  const decrement = (stepSize?: number) => {
    const s = stepSize ?? step();
    setHue(getHue() - s);
  };

  // Set dragging state
  const setDraggingState = (dragging: boolean) => {
    const wasDragging = isDragging();
    setIsDragging(dragging);

    // Call onChangeEnd when dragging ends
    if (wasDragging && !dragging) {
      getOptions().onChangeEnd?.(value());
    }
  };

  // Get display color (full saturation and brightness for wheel preview)
  const getDisplayColor = () => {
    // For display, we want the color at full saturation and brightness
    // to show the pure hue on the wheel
    return value()
      .withChannelValue('saturation', 100)
      .withChannelValue('brightness', 100)
      .withChannelValue('alpha', 1);
  };

  return {
    get value() {
      return value();
    },
    get isDragging() {
      return isDragging();
    },
    get isDisabled() {
      return isDisabled();
    },
    get step() {
      return step();
    },
    get pageStep() {
      return pageStep();
    },
    getHue,
    setHue,
    setHueFromAngle,
    getThumbAngle,
    increment,
    decrement,
    setDragging: setDraggingState,
    getDisplayColor,
  };
}
