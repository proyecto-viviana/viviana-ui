// OKLCH utilities
export { hexToOklch, oklchToHex, oklchToCss, hexToRgba } from './oklch'
export type { OKLCH } from './oklch'

// Theme generator
export { generateTheme, applyThemeVars, themeToCssString } from './generator'
export type { ThemeInput, CSSVarMap, GeneratedTheme } from './generator'

// Viviana preset
export { viviana, VIVIANA_PRIMARY, VIVIANA_ACCENT } from './viviana'

// Reactive theme hook
export { createSilapseTheme } from './createTheme'
export type { ColorScheme, SilapseThemeResult } from './createTheme'

// Legacy type (kept for backwards compat with Provider)
export type { Theme } from './types'
