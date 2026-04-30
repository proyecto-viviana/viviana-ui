// src/utils/theme.ts
// Shared theme signal — all useSilapseTheme() calls share the same reactive state.
// Priority: localStorage (explicit user choice) → system preference → dark fallback.

import { createSignal, onMount } from "solid-js";

export type Theme = "dark" | "light";

const STORAGE_KEY = "pv-theme";

/** Resolve theme without side-effects: localStorage → system → dark */
function resolveTheme(): Theme {
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

// Global shared signal — module-level singleton
const [globalTheme, setGlobalTheme] = createSignal<Theme>("dark");
let initialized = false;

function initGlobalTheme(): void {
  if (initialized) return;
  if (typeof document === "undefined") return;

  initialized = true;

  const theme = resolveTheme();
  setGlobalTheme(theme);
  document.documentElement.setAttribute("data-theme", theme);
}

/**
 * Reactive theme hook. Uses a global shared signal so every component
 * that calls useSilapseTheme() stays in sync without prop-drilling.
 */
export function useSilapseTheme() {
  onMount(() => {
    initGlobalTheme();
  });

  const toggleTheme = () => {
    const next: Theme = globalTheme() === "dark" ? "light" : "dark";
    setGlobalTheme(next);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", next);
    }
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, next);
    }
  };

  const isDark = () => globalTheme() === "dark";

  return { theme: globalTheme, isDark, toggleTheme };
}

/**
 * Silapse color palette derived from the reactive theme signal.
 * Returns a reactive accessor — call colors() to get the current palette.
 */
export function useSilapseColors() {
  const { isDark } = useSilapseTheme();

  return () => ({
    blue: isDark() ? "#75ABC7" : "#75ABC7",
    pink: isDark() ? "#DF5C9A" : "#DF5C9A",
    blueDim: isDark() ? "#1a3040" : "#b6d9eb",
    pinkDim: isDark() ? "#301520" : "#fcc7e0",
    surface: isDark() ? "#0a0a0a" : "#ffffff",
    surfaceElevated: isDark() ? "#111111" : "#e6f0f5",
    headerBg: isDark() ? "#0a0a0a" : "#d0e4ed",
    text: isDark() ? "#ffffff" : "#1a3040",
    textSecondary: isDark() ? "#a0a0a0" : "#405d70",
    blueGlow: isDark() ? "rgba(128, 204, 255, 0.6)" : "rgba(117, 171, 199, 0.4)",
    pinkGlow: isDark() ? "rgba(255, 160, 213, 0.6)" : "rgba(223, 92, 154, 0.4)",
    muted: isDark() ? "#252525" : "#dbe8ef",
    border: isDark() ? "#1a1a1a" : "#c8dce6",
  });
}
