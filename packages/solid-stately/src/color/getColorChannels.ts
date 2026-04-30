/**
 * getColorChannels - Standalone function to get color channels for a color space.
 *
 * Returns the three channels for a given color space.
 */

import type { ColorChannel, ColorSpace } from "./types";

const COLOR_SPACE_CHANNELS: Record<ColorSpace, [ColorChannel, ColorChannel, ColorChannel]> = {
  rgb: ["red", "green", "blue"],
  hsl: ["hue", "saturation", "lightness"],
  hsb: ["hue", "saturation", "brightness"],
};

/**
 * Returns the color channels for a given color space.
 *
 * @param colorSpace - The color space to get channels for.
 * @returns A tuple of three color channels.
 *
 * @example
 * ```ts
 * getColorChannels('rgb') // ['red', 'green', 'blue']
 * getColorChannels('hsl') // ['hue', 'saturation', 'lightness']
 * getColorChannels('hsb') // ['hue', 'saturation', 'brightness']
 * ```
 */
export function getColorChannels(
  colorSpace: ColorSpace,
): [ColorChannel, ColorChannel, ColorChannel] {
  const channels = COLOR_SPACE_CHANNELS[colorSpace];
  if (!channels) {
    throw new Error(`Unknown color space: ${colorSpace}`);
  }
  return channels;
}
