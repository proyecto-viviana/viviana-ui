/**
 * OKLCH color space utilities.
 *
 * OKLCH is a perceptually uniform color space ideal for palette generation:
 * - Lightness (L): 0–1, perceptually linear
 * - Chroma (C): 0–~0.4, colorfulness
 * - Hue (H): 0–360, color wheel angle
 *
 * All palette math operates in OKLCH so that derived shades maintain
 * perceptual consistency regardless of the input hue.
 */

export interface OKLCH {
  l: number; // 0–1
  c: number; // 0–~0.4
  h: number; // 0–360
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

// ── OKLCH → Hex ──

function oklchToOklab(oklch: OKLCH): { L: number; a: number; b: number } {
  const hRad = (oklch.h * Math.PI) / 180;
  return {
    L: oklch.l,
    a: oklch.c * Math.cos(hRad),
    b: oklch.c * Math.sin(hRad),
  };
}

function oklabToLinearRgb(lab: { L: number; a: number; b: number }): RGB {
  const l_ = lab.L + 0.3963377774 * lab.a + 0.2158037573 * lab.b;
  const m_ = lab.L - 0.1055613458 * lab.a - 0.0638541728 * lab.b;
  const s_ = lab.L - 0.0894841775 * lab.a - 1.291485548 * lab.b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  return {
    r: +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  };
}

function linearToSrgb(value: number): number {
  if (value <= 0.0031308) return value * 12.92;
  return 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function oklchToHex(oklch: OKLCH): string {
  const oklab = oklchToOklab(oklch);
  const linear = oklabToLinearRgb(oklab);

  const r = Math.round(clamp01(linearToSrgb(linear.r)) * 255);
  const g = Math.round(clamp01(linearToSrgb(linear.g)) * 255);
  const b = Math.round(clamp01(linearToSrgb(linear.b)) * 255);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// ── Hex → OKLCH ──

function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function srgbToLinear(value: number): number {
  const v = value / 255;
  if (v <= 0.04045) return v / 12.92;
  return Math.pow((v + 0.055) / 1.055, 2.4);
}

function linearRgbToOklab(rgb: RGB): { L: number; a: number; b: number } {
  const r = srgbToLinear(rgb.r);
  const g = srgbToLinear(rgb.g);
  const b = srgbToLinear(rgb.b);

  const l_ = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m_ = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s_ = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  return {
    L: 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  };
}

export function hexToOklch(hex: string): OKLCH {
  const rgb = hexToRgb(hex);
  const oklab = linearRgbToOklab(rgb);

  const c = Math.sqrt(oklab.a * oklab.a + oklab.b * oklab.b);
  let h = (Math.atan2(oklab.b, oklab.a) * 180) / Math.PI;
  if (h < 0) h += 360;

  return { l: oklab.L, c, h };
}

export function oklchToCss(oklch: OKLCH): string {
  return `oklch(${+oklch.l.toFixed(4)} ${+oklch.c.toFixed(4)} ${+oklch.h.toFixed(2)})`;
}

/**
 * Convert hex color to CSS rgba() string with given alpha.
 */
export function hexToRgba(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}
