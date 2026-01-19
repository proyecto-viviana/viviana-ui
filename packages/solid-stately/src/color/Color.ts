/**
 * Color class implementation.
 * Based on @react-stately/color.
 *
 * Provides color manipulation, conversion, and formatting.
 */

import type {
  Color,
  ColorFormat,
  ColorSpace,
  ColorChannel,
  ColorChannelRange,
  ColorAxes,
  RGBColor,
  HSLColor,
  HSBColor,
} from './types';

// Channel ranges
const RGB_CHANNEL_RANGE: ColorChannelRange = {
  minValue: 0,
  maxValue: 255,
  step: 1,
  pageSize: 17,
};

const ALPHA_CHANNEL_RANGE: ColorChannelRange = {
  minValue: 0,
  maxValue: 1,
  step: 0.01,
  pageSize: 0.1,
};

const HUE_CHANNEL_RANGE: ColorChannelRange = {
  minValue: 0,
  maxValue: 360,
  step: 1,
  pageSize: 15,
};

const PERCENT_CHANNEL_RANGE: ColorChannelRange = {
  minValue: 0,
  maxValue: 100,
  step: 1,
  pageSize: 10,
};

// Channel names (English only for now)
const CHANNEL_NAMES: Record<ColorChannel, string> = {
  hue: 'Hue',
  saturation: 'Saturation',
  brightness: 'Brightness',
  lightness: 'Lightness',
  red: 'Red',
  green: 'Green',
  blue: 'Blue',
  alpha: 'Alpha',
};

// Hue names for color naming
const HUE_NAMES: Array<{ max: number; name: string }> = [
  { max: 15, name: 'pink' },
  { max: 48, name: 'red' },
  { max: 94, name: 'orange' },
  { max: 135, name: 'yellow' },
  { max: 175, name: 'green' },
  { max: 264, name: 'cyan' },
  { max: 284, name: 'blue' },
  { max: 320, name: 'purple' },
  { max: 349, name: 'magenta' },
  { max: 360, name: 'pink' },
];

/**
 * Clamp a value to a range.
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Round to fixed decimal places.
 */
function toFixed(value: number, decimals: number): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Convert RGB to HSL.
 */
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Convert HSL to RGB.
 */
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * Convert RGB to HSB.
 */
function rgbToHsb(r: number, g: number, b: number): { h: number; s: number; b: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;

  if (max !== min) {
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    b: Math.round(v * 100),
  };
}

/**
 * Convert HSB to RGB.
 */
function hsbToRgb(h: number, s: number, b: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  b /= 100;

  let r: number, g: number, bl: number;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = b * (1 - s);
  const q = b * (1 - f * s);
  const t = b * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      r = b;
      g = t;
      bl = p;
      break;
    case 1:
      r = q;
      g = b;
      bl = p;
      break;
    case 2:
      r = p;
      g = b;
      bl = t;
      break;
    case 3:
      r = p;
      g = q;
      bl = b;
      break;
    case 4:
      r = t;
      g = p;
      bl = b;
      break;
    default:
      r = b;
      g = p;
      bl = q;
      break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(bl * 255),
  };
}

/**
 * Get hue name from hue angle.
 */
function getHueNameFromAngle(hue: number): string {
  for (const { max, name } of HUE_NAMES) {
    if (hue <= max) {
      return name;
    }
  }
  return 'pink';
}

/**
 * Get a human-readable color name based on RGB values.
 */
function getColorNameFromRgb(r: number, g: number, b: number, alpha: number): string {
  // Convert to HSL for analysis
  const { h, s, l } = rgbToHsl(r, g, b);

  // Handle edge cases
  if (l >= 100) {
    return alpha < 1 ? `white ${Math.round(alpha * 100)}% transparent` : 'white';
  }
  if (l <= 0) {
    return alpha < 1 ? `black ${Math.round(alpha * 100)}% transparent` : 'black';
  }

  // Build color name
  const parts: string[] = [];

  // Lightness descriptor
  if (l < 30) {
    parts.push('very dark');
  } else if (l < 55) {
    parts.push('dark');
  } else if (l > 85) {
    parts.push('very light');
  } else if (l > 70) {
    parts.push('light');
  }

  // Saturation/chroma descriptor
  if (s < 10) {
    parts.push('gray');
  } else if (s < 30) {
    parts.push('grayish');
  } else if (s > 80) {
    parts.push('vibrant');
  }

  // Hue name (skip if gray)
  if (s >= 10) {
    let hueName = getHueNameFromAngle(h);

    // Special cases
    if (hueName === 'orange' && l < 68) {
      hueName = 'brown';
    }
    if (hueName === 'yellow' && l < 85 && s > 50) {
      hueName = 'yellow green';
    }

    parts.push(hueName);
  }

  let name = parts.join(' ');

  // Add transparency
  if (alpha < 1) {
    name += ` ${Math.round(alpha * 100)}% transparent`;
  }

  return name || 'color';
}

/**
 * RGB Color implementation.
 */
class RGBColorImpl implements Color {
  private red: number;
  private green: number;
  private blue: number;
  private alpha: number;

  constructor(red: number, green: number, blue: number, alpha: number = 1) {
    this.red = clamp(Math.round(red), 0, 255);
    this.green = clamp(Math.round(green), 0, 255);
    this.blue = clamp(Math.round(blue), 0, 255);
    this.alpha = clamp(toFixed(alpha, 2), 0, 1);
  }

  toFormat(format: ColorFormat): Color {
    switch (format) {
      case 'hex':
      case 'hexa':
      case 'rgb':
      case 'rgba':
        return this.clone();
      case 'hsl':
      case 'hsla': {
        const { h, s, l } = rgbToHsl(this.red, this.green, this.blue);
        return new HSLColorImpl(h, s, l, this.alpha);
      }
      case 'hsb':
      case 'hsba': {
        const { h, s, b } = rgbToHsb(this.red, this.green, this.blue);
        return new HSBColorImpl(h, s, b, this.alpha);
      }
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  toString(format?: ColorFormat | 'css'): string {
    const f = format ?? 'css';

    switch (f) {
      case 'hex':
        return `#${this.red.toString(16).padStart(2, '0')}${this.green.toString(16).padStart(2, '0')}${this.blue.toString(16).padStart(2, '0')}`;
      case 'hexa':
        return `#${this.red.toString(16).padStart(2, '0')}${this.green.toString(16).padStart(2, '0')}${this.blue.toString(16).padStart(2, '0')}${Math.round(this.alpha * 255).toString(16).padStart(2, '0')}`;
      case 'rgb':
        return `rgb(${this.red}, ${this.green}, ${this.blue})`;
      case 'rgba':
      case 'css':
        return this.alpha === 1
          ? `rgb(${this.red}, ${this.green}, ${this.blue})`
          : `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
      default:
        return this.toFormat(f as ColorFormat).toString(f);
    }
  }

  clone(): Color {
    return new RGBColorImpl(this.red, this.green, this.blue, this.alpha);
  }

  toHexInt(): number {
    return (this.red << 16) | (this.green << 8) | this.blue;
  }

  getChannelValue(channel: ColorChannel): number {
    switch (channel) {
      case 'red':
        return this.red;
      case 'green':
        return this.green;
      case 'blue':
        return this.blue;
      case 'alpha':
        return this.alpha;
      // Cross-color-space channels - convert to HSB
      case 'hue':
      case 'saturation':
      case 'brightness':
        return this.toFormat('hsb').getChannelValue(channel);
      case 'lightness':
        return this.toFormat('hsl').getChannelValue(channel);
      default:
        throw new Error(`Invalid channel: ${channel}`);
    }
  }

  withChannelValue(channel: ColorChannel, value: number): Color {
    switch (channel) {
      case 'red':
        return new RGBColorImpl(value, this.green, this.blue, this.alpha);
      case 'green':
        return new RGBColorImpl(this.red, value, this.blue, this.alpha);
      case 'blue':
        return new RGBColorImpl(this.red, this.green, value, this.alpha);
      case 'alpha':
        return new RGBColorImpl(this.red, this.green, this.blue, value);
      // Cross-color-space channels - convert, update, convert back
      case 'hue':
      case 'saturation':
      case 'brightness':
        return this.toFormat('hsb').withChannelValue(channel, value).toFormat('rgb');
      case 'lightness':
        return this.toFormat('hsl').withChannelValue(channel, value).toFormat('rgb');
      default:
        throw new Error(`Invalid channel: ${channel}`);
    }
  }

  getChannelRange(channel: ColorChannel): ColorChannelRange {
    switch (channel) {
      case 'red':
      case 'green':
      case 'blue':
        return RGB_CHANNEL_RANGE;
      case 'alpha':
        return ALPHA_CHANNEL_RANGE;
      case 'hue':
        return HUE_CHANNEL_RANGE;
      case 'saturation':
      case 'brightness':
      case 'lightness':
        return PERCENT_CHANNEL_RANGE;
      default:
        throw new Error(`Invalid channel: ${channel}`);
    }
  }

  getChannelName(channel: ColorChannel, _locale: string): string {
    return CHANNEL_NAMES[channel] || channel;
  }

  getChannelFormatOptions(channel: ColorChannel): Intl.NumberFormatOptions {
    if (channel === 'alpha') {
      return { style: 'percent' };
    }
    return { maximumFractionDigits: 0 };
  }

  formatChannelValue(channel: ColorChannel, locale: string): string {
    const value = this.getChannelValue(channel);
    const options = this.getChannelFormatOptions(channel);
    return new Intl.NumberFormat(locale, options).format(value);
  }

  getColorSpace(): ColorSpace {
    return 'rgb';
  }

  getColorSpaceAxes(xyChannels?: { xChannel?: ColorChannel; yChannel?: ColorChannel }): ColorAxes {
    const xChannel = xyChannels?.xChannel ?? 'red';
    const yChannel = xyChannels?.yChannel ?? 'green';
    const channels: ColorChannel[] = ['red', 'green', 'blue'];
    const zChannel = channels.find((c) => c !== xChannel && c !== yChannel) ?? 'blue';
    return { xChannel, yChannel, zChannel };
  }

  getColorChannels(): [ColorChannel, ColorChannel, ColorChannel] {
    return ['red', 'green', 'blue'];
  }

  getColorName(locale: string): string {
    return getColorNameFromRgb(this.red, this.green, this.blue, this.alpha);
  }

  getHueName(_locale: string): string {
    const { h } = rgbToHsl(this.red, this.green, this.blue);
    return getHueNameFromAngle(h);
  }
}

/**
 * HSL Color implementation.
 */
class HSLColorImpl implements Color {
  private hue: number;
  private saturation: number;
  private lightness: number;
  private alpha: number;

  constructor(hue: number, saturation: number, lightness: number, alpha: number = 1) {
    this.hue = clamp(Math.round(hue) % 360, 0, 360);
    this.saturation = clamp(Math.round(saturation), 0, 100);
    this.lightness = clamp(Math.round(lightness), 0, 100);
    this.alpha = clamp(toFixed(alpha, 2), 0, 1);
  }

  toFormat(format: ColorFormat): Color {
    switch (format) {
      case 'hsl':
      case 'hsla':
        return this.clone();
      case 'hex':
      case 'hexa':
      case 'rgb':
      case 'rgba': {
        const { r, g, b } = hslToRgb(this.hue, this.saturation, this.lightness);
        return new RGBColorImpl(r, g, b, this.alpha);
      }
      case 'hsb':
      case 'hsba': {
        const { r, g, b } = hslToRgb(this.hue, this.saturation, this.lightness);
        const hsb = rgbToHsb(r, g, b);
        return new HSBColorImpl(hsb.h, hsb.s, hsb.b, this.alpha);
      }
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  toString(format?: ColorFormat | 'css'): string {
    const f = format ?? 'css';

    switch (f) {
      case 'hsl':
        return `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`;
      case 'hsla':
      case 'css':
        return this.alpha === 1
          ? `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`
          : `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha})`;
      default:
        return this.toFormat(f as ColorFormat).toString(f);
    }
  }

  clone(): Color {
    return new HSLColorImpl(this.hue, this.saturation, this.lightness, this.alpha);
  }

  toHexInt(): number {
    return this.toFormat('rgb').toHexInt();
  }

  getChannelValue(channel: ColorChannel): number {
    switch (channel) {
      case 'hue':
        return this.hue;
      case 'saturation':
        return this.saturation;
      case 'lightness':
        return this.lightness;
      case 'alpha':
        return this.alpha;
      // Cross-color-space channels
      case 'red':
      case 'green':
      case 'blue':
        return this.toFormat('rgb').getChannelValue(channel);
      case 'brightness':
        return this.toFormat('hsb').getChannelValue(channel);
      default:
        throw new Error(`Invalid channel: ${channel}`);
    }
  }

  withChannelValue(channel: ColorChannel, value: number): Color {
    switch (channel) {
      case 'hue':
        return new HSLColorImpl(value, this.saturation, this.lightness, this.alpha);
      case 'saturation':
        return new HSLColorImpl(this.hue, value, this.lightness, this.alpha);
      case 'lightness':
        return new HSLColorImpl(this.hue, this.saturation, value, this.alpha);
      case 'alpha':
        return new HSLColorImpl(this.hue, this.saturation, this.lightness, value);
      // Cross-color-space channels
      case 'red':
      case 'green':
      case 'blue':
        return this.toFormat('rgb').withChannelValue(channel, value).toFormat('hsl');
      case 'brightness':
        return this.toFormat('hsb').withChannelValue(channel, value).toFormat('hsl');
      default:
        throw new Error(`Invalid channel: ${channel}`);
    }
  }

  getChannelRange(channel: ColorChannel): ColorChannelRange {
    switch (channel) {
      case 'hue':
        return HUE_CHANNEL_RANGE;
      case 'saturation':
      case 'lightness':
      case 'brightness':
        return PERCENT_CHANNEL_RANGE;
      case 'alpha':
        return ALPHA_CHANNEL_RANGE;
      case 'red':
      case 'green':
      case 'blue':
        return RGB_CHANNEL_RANGE;
      default:
        throw new Error(`Invalid channel: ${channel}`);
    }
  }

  getChannelName(channel: ColorChannel, _locale: string): string {
    return CHANNEL_NAMES[channel] || channel;
  }

  getChannelFormatOptions(channel: ColorChannel): Intl.NumberFormatOptions {
    if (channel === 'alpha') {
      return { style: 'percent' };
    }
    if (channel === 'hue') {
      return { maximumFractionDigits: 0 };
    }
    return { style: 'percent', maximumFractionDigits: 0 };
  }

  formatChannelValue(channel: ColorChannel, locale: string): string {
    const value = this.getChannelValue(channel);
    const options = this.getChannelFormatOptions(channel);
    if (channel === 'saturation' || channel === 'lightness') {
      return new Intl.NumberFormat(locale, options).format(value / 100);
    }
    return new Intl.NumberFormat(locale, options).format(value);
  }

  getColorSpace(): ColorSpace {
    return 'hsl';
  }

  getColorSpaceAxes(xyChannels?: { xChannel?: ColorChannel; yChannel?: ColorChannel }): ColorAxes {
    const xChannel = xyChannels?.xChannel ?? 'saturation';
    const yChannel = xyChannels?.yChannel ?? 'lightness';
    const channels: ColorChannel[] = ['hue', 'saturation', 'lightness'];
    const zChannel = channels.find((c) => c !== xChannel && c !== yChannel) ?? 'hue';
    return { xChannel, yChannel, zChannel };
  }

  getColorChannels(): [ColorChannel, ColorChannel, ColorChannel] {
    return ['hue', 'saturation', 'lightness'];
  }

  getColorName(_locale: string): string {
    const { r, g, b } = hslToRgb(this.hue, this.saturation, this.lightness);
    return getColorNameFromRgb(r, g, b, this.alpha);
  }

  getHueName(_locale: string): string {
    return getHueNameFromAngle(this.hue);
  }
}

/**
 * HSB Color implementation.
 */
class HSBColorImpl implements Color {
  private hue: number;
  private saturation: number;
  private brightness: number;
  private alpha: number;

  constructor(hue: number, saturation: number, brightness: number, alpha: number = 1) {
    this.hue = clamp(Math.round(hue) % 360, 0, 360);
    this.saturation = clamp(Math.round(saturation), 0, 100);
    this.brightness = clamp(Math.round(brightness), 0, 100);
    this.alpha = clamp(toFixed(alpha, 2), 0, 1);
  }

  toFormat(format: ColorFormat): Color {
    switch (format) {
      case 'hsb':
      case 'hsba':
        return this.clone();
      case 'hex':
      case 'hexa':
      case 'rgb':
      case 'rgba': {
        const { r, g, b } = hsbToRgb(this.hue, this.saturation, this.brightness);
        return new RGBColorImpl(r, g, b, this.alpha);
      }
      case 'hsl':
      case 'hsla': {
        const { r, g, b } = hsbToRgb(this.hue, this.saturation, this.brightness);
        const hsl = rgbToHsl(r, g, b);
        return new HSLColorImpl(hsl.h, hsl.s, hsl.l, this.alpha);
      }
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  toString(format?: ColorFormat | 'css'): string {
    const f = format ?? 'css';

    switch (f) {
      case 'hsb':
        return `hsb(${this.hue}, ${this.saturation}%, ${this.brightness}%)`;
      case 'hsba':
      case 'css':
        // HSB is not a standard CSS format, convert to RGB
        return this.toFormat('rgba').toString('css');
      default:
        return this.toFormat(f as ColorFormat).toString(f);
    }
  }

  clone(): Color {
    return new HSBColorImpl(this.hue, this.saturation, this.brightness, this.alpha);
  }

  toHexInt(): number {
    return this.toFormat('rgb').toHexInt();
  }

  getChannelValue(channel: ColorChannel): number {
    switch (channel) {
      case 'hue':
        return this.hue;
      case 'saturation':
        return this.saturation;
      case 'brightness':
        return this.brightness;
      case 'alpha':
        return this.alpha;
      // Cross-color-space channels
      case 'red':
      case 'green':
      case 'blue':
        return this.toFormat('rgb').getChannelValue(channel);
      case 'lightness':
        return this.toFormat('hsl').getChannelValue(channel);
      default:
        throw new Error(`Invalid channel: ${channel}`);
    }
  }

  withChannelValue(channel: ColorChannel, value: number): Color {
    switch (channel) {
      case 'hue':
        return new HSBColorImpl(value, this.saturation, this.brightness, this.alpha);
      case 'saturation':
        return new HSBColorImpl(this.hue, value, this.brightness, this.alpha);
      case 'brightness':
        return new HSBColorImpl(this.hue, this.saturation, value, this.alpha);
      case 'alpha':
        return new HSBColorImpl(this.hue, this.saturation, this.brightness, value);
      // Cross-color-space channels
      case 'red':
      case 'green':
      case 'blue':
        return this.toFormat('rgb').withChannelValue(channel, value).toFormat('hsb');
      case 'lightness':
        return this.toFormat('hsl').withChannelValue(channel, value).toFormat('hsb');
      default:
        throw new Error(`Invalid channel: ${channel}`);
    }
  }

  getChannelRange(channel: ColorChannel): ColorChannelRange {
    switch (channel) {
      case 'hue':
        return HUE_CHANNEL_RANGE;
      case 'saturation':
      case 'brightness':
      case 'lightness':
        return PERCENT_CHANNEL_RANGE;
      case 'alpha':
        return ALPHA_CHANNEL_RANGE;
      case 'red':
      case 'green':
      case 'blue':
        return RGB_CHANNEL_RANGE;
      default:
        throw new Error(`Invalid channel: ${channel}`);
    }
  }

  getChannelName(channel: ColorChannel, _locale: string): string {
    return CHANNEL_NAMES[channel] || channel;
  }

  getChannelFormatOptions(channel: ColorChannel): Intl.NumberFormatOptions {
    if (channel === 'alpha') {
      return { style: 'percent' };
    }
    if (channel === 'hue') {
      return { maximumFractionDigits: 0 };
    }
    return { style: 'percent', maximumFractionDigits: 0 };
  }

  formatChannelValue(channel: ColorChannel, locale: string): string {
    const value = this.getChannelValue(channel);
    const options = this.getChannelFormatOptions(channel);
    if (channel === 'saturation' || channel === 'brightness') {
      return new Intl.NumberFormat(locale, options).format(value / 100);
    }
    return new Intl.NumberFormat(locale, options).format(value);
  }

  getColorSpace(): ColorSpace {
    return 'hsb';
  }

  getColorSpaceAxes(xyChannels?: { xChannel?: ColorChannel; yChannel?: ColorChannel }): ColorAxes {
    const xChannel = xyChannels?.xChannel ?? 'saturation';
    const yChannel = xyChannels?.yChannel ?? 'brightness';
    const channels: ColorChannel[] = ['hue', 'saturation', 'brightness'];
    const zChannel = channels.find((c) => c !== xChannel && c !== yChannel) ?? 'hue';
    return { xChannel, yChannel, zChannel };
  }

  getColorChannels(): [ColorChannel, ColorChannel, ColorChannel] {
    return ['hue', 'saturation', 'brightness'];
  }

  getColorName(_locale: string): string {
    const { r, g, b } = hsbToRgb(this.hue, this.saturation, this.brightness);
    return getColorNameFromRgb(r, g, b, this.alpha);
  }

  getHueName(_locale: string): string {
    return getHueNameFromAngle(this.hue);
  }
}

/**
 * Parse a color string into a Color object.
 */
export function parseColor(value: string): Color {
  const trimmed = value.trim().toLowerCase();

  // Hex format
  if (trimmed.startsWith('#')) {
    const hex = trimmed.slice(1);
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return new RGBColorImpl(r, g, b);
    }
    if (hex.length === 4) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      const a = parseInt(hex[3] + hex[3], 16) / 255;
      return new RGBColorImpl(r, g, b, a);
    }
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return new RGBColorImpl(r, g, b);
    }
    if (hex.length === 8) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const a = parseInt(hex.slice(6, 8), 16) / 255;
      return new RGBColorImpl(r, g, b, a);
    }
    throw new Error(`Invalid hex color: ${value}`);
  }

  // RGB/RGBA format
  const rgbMatch = trimmed.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    const a = rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1;
    return new RGBColorImpl(r, g, b, a);
  }

  // HSL/HSLA format
  const hslMatch = trimmed.match(/^hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([\d.]+))?\s*\)$/);
  if (hslMatch) {
    const h = parseInt(hslMatch[1], 10);
    const s = parseInt(hslMatch[2], 10);
    const l = parseInt(hslMatch[3], 10);
    const a = hslMatch[4] !== undefined ? parseFloat(hslMatch[4]) : 1;
    return new HSLColorImpl(h, s, l, a);
  }

  // HSB/HSBA format
  const hsbMatch = trimmed.match(/^hsba?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([\d.]+))?\s*\)$/);
  if (hsbMatch) {
    const h = parseInt(hsbMatch[1], 10);
    const s = parseInt(hsbMatch[2], 10);
    const b = parseInt(hsbMatch[3], 10);
    const a = hsbMatch[4] !== undefined ? parseFloat(hsbMatch[4]) : 1;
    return new HSBColorImpl(h, s, b, a);
  }

  throw new Error(`Invalid color format: ${value}`);
}

/**
 * Create an RGB color.
 */
export function createRGBColor(red: number, green: number, blue: number, alpha: number = 1): Color {
  return new RGBColorImpl(red, green, blue, alpha);
}

/**
 * Create an HSL color.
 */
export function createHSLColor(hue: number, saturation: number, lightness: number, alpha: number = 1): Color {
  return new HSLColorImpl(hue, saturation, lightness, alpha);
}

/**
 * Create an HSB color.
 */
export function createHSBColor(hue: number, saturation: number, brightness: number, alpha: number = 1): Color {
  return new HSBColorImpl(hue, saturation, brightness, alpha);
}

/**
 * Normalize a color value (string or Color) to a Color object.
 */
export function normalizeColor(value: string | Color): Color {
  if (typeof value === 'string') {
    return parseColor(value);
  }
  return value;
}
