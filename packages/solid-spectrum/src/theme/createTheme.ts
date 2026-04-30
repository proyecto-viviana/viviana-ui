/**
 * Reactive theme hook for SolidJS apps using Solid Spectrum.
 *
 * Manages dark/light mode state, persists preference to localStorage,
 * and applies the correct CSS variable set to the document root.
 *
 * Works with any GeneratedTheme — defaults to Viviana if none provided.
 */

import { createSignal, onMount } from "solid-js";
import { viviana } from "./viviana";
import { applyThemeVars, type CSSVarMap, type GeneratedTheme } from "./generator";

export type ColorScheme = "dark" | "light";

const STORAGE_KEY = "solid-spectrum-theme";

function resolveScheme(): ColorScheme {
  if (typeof localStorage !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "dark" || saved === "light") return saved;
  }
  if (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: light)").matches
  ) {
    return "light";
  }
  return "dark";
}

// Module-level singleton — all consumers share the same signal
const [globalScheme, setGlobalScheme] = createSignal<ColorScheme>("dark");
let initialized = false;

function init(theme: GeneratedTheme): void {
  if (initialized) return;
  if (typeof document === "undefined") return;
  initialized = true;

  const scheme = resolveScheme();
  setGlobalScheme(scheme);
  document.documentElement.setAttribute("data-theme", scheme);
  applyThemeVars(document.documentElement, theme[scheme]);
}

export interface SolidSpectrumThemeResult {
  /** Current color scheme ('dark' | 'light') */
  scheme: () => ColorScheme;
  /** Whether the current scheme is dark */
  isDark: () => boolean;
  /** Toggle between dark and light */
  toggleScheme: () => void;
  /** Set a specific scheme */
  setScheme: (scheme: ColorScheme) => void;
  /** Current CSS variable map */
  vars: () => CSSVarMap;
}

/**
 * Create a reactive Solid Spectrum theme.
 *
 * @param theme - A GeneratedTheme (from generateTheme()). Defaults to Viviana.
 * @returns Reactive accessors for scheme, toggle, and CSS vars.
 *
 * @example
 * ```tsx
 * // Use default Viviana theme
 * const { scheme, isDark, toggleScheme } = createSolidSpectrumTheme()
 *
 * // Use a custom theme
 * const custom = generateTheme({ primary: '#7C3AED', accent: '#F59E0B' })
 * const { scheme, isDark, toggleScheme } = createSolidSpectrumTheme(custom)
 * ```
 */
export function createSolidSpectrumTheme(
  theme: GeneratedTheme = viviana,
): SolidSpectrumThemeResult {
  onMount(() => init(theme));

  const setScheme = (next: ColorScheme) => {
    setGlobalScheme(next);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", next);
      applyThemeVars(document.documentElement, theme[next]);
    }
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, next);
    }
  };

  const toggleScheme = () => {
    setScheme(globalScheme() === "dark" ? "light" : "dark");
  };

  return {
    scheme: globalScheme,
    isDark: () => globalScheme() === "dark",
    toggleScheme,
    setScheme,
    vars: () => theme[globalScheme()],
  };
}
