export { hexToOklch, oklchToHex, oklchToCss, hexToRgba } from "./oklch";
export type { OKLCH } from "./oklch";

export { generateTheme, applyThemeVars, themeToCssString } from "./generator";
export type { ThemeInput, CSSVarMap, GeneratedTheme } from "./generator";

export { viviana, VIVIANA_PRIMARY, VIVIANA_ACCENT } from "./viviana";

export { createSolidSpectrumTheme } from "./createTheme";
export type { ColorScheme, SolidSpectrumThemeResult } from "./createTheme";

// Legacy type (kept for backwards compat with Provider)
export type { Theme } from "./types";
