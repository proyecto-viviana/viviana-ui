/**
 * ColorWheel state management.
 * Based on @react-stately/color useColorWheelState.
 */
import { type Accessor } from "solid-js";
import type { Color } from "./types";
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
export declare function createColorWheelState(
  options: Accessor<ColorWheelStateOptions>,
): ColorWheelState;
//# sourceMappingURL=createColorWheelState.d.ts.map
