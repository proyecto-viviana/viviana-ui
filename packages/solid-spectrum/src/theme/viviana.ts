/**
 * Viviana — the default Solid Spectrum theme preset.
 *
 * Primary: #75ABC7 (ocean cyan)
 * Accent:  #DF5C9A (vivid pink)
 *
 * These are the 500 anchors. The full palette (50–900 for each scale,
 * plus surfaces, text, borders, glows, semantics) is derived via OKLCH.
 */

import { generateTheme, type GeneratedTheme } from "./generator";

export const VIVIANA_PRIMARY = "#75ABC7";
export const VIVIANA_ACCENT = "#DF5C9A";

export const viviana: GeneratedTheme = generateTheme({
  primary: VIVIANA_PRIMARY,
  accent: VIVIANA_ACCENT,
});
