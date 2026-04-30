/**
 * Color class implementation.
 * Based on @react-stately/color.
 *
 * Provides color manipulation, conversion, and formatting.
 */
import type { Color } from "./types";
/**
 * Parse a color string into a Color object.
 */
export declare function parseColor(value: string): Color;
/**
 * Create an RGB color.
 */
export declare function createRGBColor(
  red: number,
  green: number,
  blue: number,
  alpha?: number,
): Color;
/**
 * Create an HSL color.
 */
export declare function createHSLColor(
  hue: number,
  saturation: number,
  lightness: number,
  alpha?: number,
): Color;
/**
 * Create an HSB color.
 */
export declare function createHSBColor(
  hue: number,
  saturation: number,
  brightness: number,
  alpha?: number,
): Color;
/**
 * Normalize a color value (string or Color) to a Color object.
 */
export declare function normalizeColor(value: string | Color): Color;
//# sourceMappingURL=Color.d.ts.map
