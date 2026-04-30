/**
 * Theme generator — derives a complete Solid Spectrum palette from 2 colors.
 *
 * Input: primary hex (blue/cyan anchor) + accent hex (pink anchor)
 * Output: full set of CSS custom properties for dark and light modes
 *
 * Both input colors are treated as the "500" value in their respective
 * scales. All other shades are derived via OKLCH lightness/chroma curves,
 * preserving perceptual consistency across any hue pair.
 *
 * Scale direction: 100 = lightest, 900 = darkest (both modes).
 * The 500 anchor is the input color itself.
 */

import { hexToOklch, oklchToHex, hexToRgba } from "./oklch";
import type { OKLCH } from "./oklch";

export interface ThemeInput {
  /** Primary color hex — the main brand color (e.g. '#75ABC7') */
  primary: string;
  /** Accent color hex — the complementary highlight (e.g. '#DF5C9A') */
  accent: string;
}

export type CSSVarMap = Record<string, string>;

export interface GeneratedTheme {
  dark: CSSVarMap;
  light: CSSVarMap;
}

// ── Scale generation ──

/**
 * Generate a 50–900 color scale from a base OKLCH color.
 * The 500 value is the anchor (input color). Shades spread
 * outward in lightness while modulating chroma.
 *
 * 100 = lightest, 900 = darkest. 50 is an extra-light tint.
 */
function generateScale(base: OKLCH, baseHex: string): Record<string, string> {
  const { c, h } = base;

  // Lightness stops: 50, 100–900
  // Designed so 500 ≈ base.l (the anchor)
  const stops: [string, number, number][] = [
    // [shade, lightness, chroma-multiplier]
    ["50", 0.97, 0.15],
    ["100", 0.92, 0.25],
    ["200", 0.85, 0.4],
    ["300", 0.76, 0.6],
    ["400", 0.67, 0.8],
    ["500", base.l, 1.0], // anchor — exact input color
    ["600", 0.5, 0.9],
    ["700", 0.4, 0.75],
    ["800", 0.3, 0.55],
    ["900", 0.18, 0.35],
  ];

  const result: Record<string, string> = {};
  for (const [shade, l, cm] of stops) {
    if (shade === "500") {
      result[shade] = baseHex;
    } else {
      result[shade] = oklchToHex({ l, c: c * cm, h });
    }
  }
  return result;
}

// ── Neutral (grey) scale ──

function generateGreyScale(): Record<string, string> {
  // Pure neutral — zero chroma, evenly spaced lightness
  const stops: [string, number][] = [
    ["50", 0.98],
    ["100", 0.9],
    ["200", 0.8],
    ["300", 0.68],
    ["400", 0.55],
    ["500", 0.42],
    ["600", 0.3],
    ["700", 0.2],
    ["800", 0.13],
    ["900", 0.07],
  ];
  const result: Record<string, string> = {};
  for (const [shade, l] of stops) {
    result[shade] = oklchToHex({ l, c: 0, h: 0 });
  }
  return result;
}

// ── Semantic colors (fixed hues) ──

interface SemanticScale {
  base: string;
  dim: string;
  bg: string;
  shades: Record<string, string>;
}

function generateSemanticScale(hue: number, chroma: number, mode: "dark" | "light"): SemanticScale {
  const isDark = mode === "dark";

  const base = oklchToHex({ l: isDark ? 0.7 : 0.55, c: chroma, h: hue });
  const dim = oklchToHex({ l: isDark ? 0.45 : 0.5, c: chroma * 0.7, h: hue });

  // For bg tint, use low-opacity rgba of the base
  const bg = hexToRgba(base, isDark ? 0.1 : 0.1);

  // Full 100–900 scale
  const lightness = isDark
    ? [0.95, 0.88, 0.78, 0.7, 0.6, 0.48, 0.38, 0.28, 0.18]
    : [0.95, 0.88, 0.78, 0.55, 0.6, 0.4, 0.45, 0.35, 0.2];
  const chromaMul = [0.2, 0.35, 0.55, 0.85, 1.0, 0.9, 0.75, 0.55, 0.3];

  const shades: Record<string, string> = {};
  const shadeNames = ["100", "200", "300", "400", "500", "600", "700", "800", "900"];
  for (let i = 0; i < shadeNames.length; i++) {
    shades[shadeNames[i]] = oklchToHex({ l: lightness[i], c: chroma * chromaMul[i], h: hue });
  }

  return { base, dim, bg, shades };
}

// ── Surface / background generation ──

function generateSurfaces(
  primaryHue: number,
  primaryChroma: number,
  mode: "dark" | "light",
): CSSVarMap {
  const isDark = mode === "dark";

  // Dark mode: surfaces are pure neutral (zero chroma) — the "void" aesthetic.
  // Light mode: surfaces carry a subtle tint of the primary hue.
  if (isDark) {
    return {
      "--color-background": oklchToHex({ l: 0.0, c: 0, h: 0 }),
      "--color-surface": oklchToHex({ l: 0.145, c: 0, h: 0 }),
      "--color-surface-elevated": oklchToHex({ l: 0.178, c: 0, h: 0 }),
      "--color-canvas-bg": oklchToHex({ l: 0.0, c: 0, h: 0 }),

      "--color-bg-100": oklchToHex({ l: 0.371, c: 0, h: 0 }),
      "--color-bg-200": oklchToHex({ l: 0.264, c: 0, h: 0 }),
      "--color-bg-300": oklchToHex({ l: 0.218, c: 0, h: 0 }),
      "--color-bg-400": oklchToHex({ l: 0.178, c: 0, h: 0 }),
      "--color-bg-light": oklchToHex({ l: 0.435, c: 0, h: 0 }),

      "--color-bg-blue-deep": oklchToHex({ l: 0.1, c: primaryChroma * 0.2, h: primaryHue }),
      "--color-bg-blue-dark": oklchToHex({ l: 0.15, c: primaryChroma * 0.25, h: primaryHue }),
      "--color-bg-blue-mid": oklchToHex({ l: 0.2, c: primaryChroma * 0.3, h: primaryHue }),
      "--color-bg-blue-light": oklchToHex({ l: 0.27, c: primaryChroma * 0.35, h: primaryHue }),
    };
  }

  // Light mode: primary-hue tinted surfaces
  const tint = primaryChroma * 0.4; // stronger tint in light mode
  return {
    "--color-background": oklchToHex({ l: 0.97, c: tint * 0.25, h: primaryHue }),
    "--color-surface": oklchToHex({ l: 1.0, c: 0, h: 0 }),
    "--color-surface-elevated": oklchToHex({ l: 0.95, c: tint * 0.5, h: primaryHue }),
    "--color-canvas-bg": oklchToHex({ l: 0.371, c: 0, h: 0 }),

    "--color-bg-100": oklchToHex({ l: 0.6, c: tint * 0.8, h: primaryHue }),
    "--color-bg-200": oklchToHex({ l: 0.81, c: tint * 1.5, h: primaryHue }),
    "--color-bg-300": oklchToHex({ l: 0.88, c: tint * 1.0, h: primaryHue }),
    "--color-bg-400": oklchToHex({ l: 0.92, c: tint * 0.65, h: primaryHue }),
    "--color-bg-light": oklchToHex({ l: 1.0, c: 0, h: 0 }),

    "--color-bg-blue-deep": oklchToHex({ l: 0.9, c: primaryChroma * 0.25, h: primaryHue }),
    "--color-bg-blue-dark": oklchToHex({ l: 0.85, c: primaryChroma * 0.35, h: primaryHue }),
    "--color-bg-blue-mid": oklchToHex({ l: 0.78, c: primaryChroma * 0.4, h: primaryHue }),
    "--color-bg-blue-light": oklchToHex({ l: 0.72, c: primaryChroma * 0.5, h: primaryHue }),
  };
}

// ── Text / border tokens ──

function generateTextAndBorders(
  primaryHue: number,
  primaryChroma: number,
  mode: "dark" | "light",
): CSSVarMap {
  const isDark = mode === "dark";

  // Dark mode: neutral text/borders (zero chroma)
  if (isDark) {
    return {
      "--color-text": "#ffffff",
      "--color-text-secondary": oklchToHex({ l: 0.706, c: 0, h: 0 }),
      "--color-text-muted": oklchToHex({ l: 0.489, c: 0, h: 0 }),
      "--color-text-dim": oklchToHex({ l: 0.5, c: primaryChroma * 0.12, h: primaryHue }),
      "--color-text-disabled": oklchToHex({ l: 0.371, c: 0, h: 0 }),

      "--color-border": oklchToHex({ l: 0.218, c: 0, h: 0 }),
      "--color-border-muted": oklchToHex({ l: 0.191, c: 0, h: 0 }),
      "--color-divider": oklchToHex({ l: 0.191, c: 0, h: 0 }),
    };
  }

  // Light mode: primary-hue tinted text for warmth
  const tint = primaryChroma * 0.65;
  return {
    "--color-text": oklchToHex({ l: 0.3, c: tint * 0.6, h: primaryHue }),
    "--color-text-secondary": oklchToHex({ l: 0.46, c: tint * 0.7, h: primaryHue }),
    "--color-text-muted": oklchToHex({ l: 0.6, c: tint * 0.5, h: primaryHue }),
    "--color-text-dim": oklchToHex({ l: 0.5, c: tint * 0.6, h: primaryHue }),
    "--color-text-disabled": oklchToHex({ l: 0.75, c: tint * 0.3, h: primaryHue }),

    "--color-border": oklchToHex({ l: 0.88, c: tint * 0.25, h: primaryHue }),
    "--color-border-muted": oklchToHex({ l: 0.92, c: tint * 0.15, h: primaryHue }),
    "--color-divider": oklchToHex({ l: 0.92, c: tint * 0.15, h: primaryHue }),
  };
}

// ── Main generator ──

/**
 * Generate a complete Solid Spectrum theme from two colors.
 *
 * @param input.primary - Primary color hex (the "500" anchor)
 * @param input.accent  - Accent color hex (the "500" anchor)
 * @returns CSS variable maps for dark and light modes
 */
export function generateTheme(input: ThemeInput): GeneratedTheme {
  const p = hexToOklch(input.primary);
  const a = hexToOklch(input.accent);

  const result: GeneratedTheme = { dark: {}, light: {} };

  for (const mode of ["dark", "light"] as const) {
    const vars: CSSVarMap = {};

    // Primary scale
    const primaryScale = generateScale(p, input.primary);
    vars["--color-primary"] = input.primary;
    for (const [shade, hex] of Object.entries(primaryScale)) {
      vars[`--color-primary-${shade}`] = hex;
    }

    // Accent scale
    const accentScale = generateScale(a, input.accent);
    vars["--color-accent"] = input.accent;
    for (const [shade, hex] of Object.entries(accentScale)) {
      vars[`--color-accent-${shade}`] = hex;
    }
    vars["--color-accent-highlight"] = oklchToHex({ l: 0.78, c: a.c * 0.5, h: a.h });

    // Grey scale (mode-independent)
    const greys = generateGreyScale();
    for (const [shade, hex] of Object.entries(greys)) {
      vars[`--color-grey-${shade}`] = hex;
    }

    // Surfaces & backgrounds
    Object.assign(vars, generateSurfaces(p.h, p.c, mode));

    // Text & borders
    Object.assign(vars, generateTextAndBorders(p.h, p.c, mode));

    // Dim versions (subtle tinted backgrounds for wire/inactive states)
    const isDark = mode === "dark";
    vars["--color-primary-dim"] = oklchToHex({
      l: isDark ? 0.25 : 0.85,
      c: p.c * 0.4,
      h: p.h,
    });
    vars["--color-accent-dim"] = oklchToHex({
      l: isDark ? 0.25 : 0.85,
      c: a.c * 0.4,
      h: a.h,
    });

    // Header background
    vars["--color-header-bg"] = isDark
      ? oklchToHex({ l: 0.209, c: 0, h: 0 })
      : oklchToHex({ l: 0.91, c: p.c * 0.4, h: p.h });

    // Glow effects
    vars["--color-primary-glow"] = hexToRgba(
      oklchToHex({ l: isDark ? 0.8 : 0.6, c: p.c, h: p.h }),
      isDark ? 0.6 : 0.4,
    );
    vars["--color-accent-glow"] = hexToRgba(
      oklchToHex({ l: isDark ? 0.8 : 0.6, c: a.c, h: a.h }),
      isDark ? 0.6 : 0.4,
    );
    vars["--color-fusion-glow"] = hexToRgba(
      oklchToHex({ l: 0.7, c: (p.c + a.c) / 2, h: (p.h + a.h) / 2 }),
      isDark ? 0.7 : 0.5,
    );

    // Semantic scales (fixed hues, independent of primary/accent)
    const success = generateSemanticScale(145, 0.17, mode); // green
    const warning = generateSemanticScale(85, 0.17, mode); // yellow/amber
    const danger = generateSemanticScale(25, 0.2, mode); // red

    for (const [name, semantic] of [
      ["success", success],
      ["warning", warning],
      ["danger", danger],
    ] as const) {
      vars[`--color-${name}`] = semantic.base;
      vars[`--color-${name}-dim`] = semantic.dim;
      vars[`--color-${name}-bg`] = semantic.bg;
      for (const [shade, hex] of Object.entries(semantic.shades)) {
        vars[`--color-${name}-${shade}`] = hex;
      }
    }

    // Cards
    vars["--color-cards-bg"] = isDark
      ? oklchToHex({ l: 0.3, c: 0, h: 0 })
      : oklchToHex({ l: 0.94, c: p.c * 0.03, h: p.h });
    vars["--color-cards-bg-load"] = isDark
      ? oklchToHex({ l: 0.35, c: 0, h: 0 })
      : oklchToHex({ l: 0.91, c: p.c * 0.03, h: p.h });
    vars["--color-correct"] = oklchToHex({ l: isDark ? 0.8 : 0.5, c: 0.17, h: 145 });
    vars["--color-incorrect"] = oklchToHex({ l: isDark ? 0.65 : 0.5, c: 0.2, h: 25 });

    result[mode] = vars;
  }

  return result;
}

/**
 * Apply a CSS variable map to an element as inline styles.
 */
export function applyThemeVars(element: HTMLElement, vars: CSSVarMap): void {
  for (const [prop, value] of Object.entries(vars)) {
    element.style.setProperty(prop, value);
  }
}

/**
 * Serialize a CSS variable map to a CSS rule string.
 */
export function themeToCssString(vars: CSSVarMap, selector: string): string {
  const props = Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");
  return `${selector} {\n${props}\n}`;
}
