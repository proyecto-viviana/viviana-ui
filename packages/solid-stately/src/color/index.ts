/**
 * Color state management exports.
 */

// Types
export type {
  Color,
  ColorFormat,
  ColorSpace,
  ColorChannel,
  ColorChannelRange,
  ColorAxes,
} from "./types";

// Color class and utilities
export {
  parseColor,
  normalizeColor,
  createRGBColor,
  createHSLColor,
  createHSBColor,
} from "./Color";

// State hooks
export {
  createColorSliderState,
  type ColorSliderStateOptions,
  type ColorSliderState,
} from "./createColorSliderState";

export {
  createColorAreaState,
  type ColorAreaStateOptions,
  type ColorAreaState,
} from "./createColorAreaState";

export {
  createColorWheelState,
  type ColorWheelStateOptions,
  type ColorWheelState,
} from "./createColorWheelState";

export {
  createColorFieldState,
  type ColorFieldStateOptions,
  type ColorFieldState,
} from "./createColorFieldState";
