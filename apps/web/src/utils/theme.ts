// src/utils/theme.ts
// Shared theme signal — all useSilapseTheme() calls share the same reactive state.

import { createSignal, onMount } from "solid-js";

export type Theme = "dark" | "light";

const STORAGE_KEY = "pv-theme";

// Global shared signal — module-level singleton
const [globalTheme, setGlobalTheme] = createSignal<Theme>("dark");
let initialized = false;

function initGlobalTheme(): void {
  if (initialized) return;
  if (typeof localStorage === "undefined" || typeof document === "undefined") return;

  initialized = true;

  const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (saved === "dark" || saved === "light") {
    setGlobalTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
    return;
  }

  // Default to dark
  setGlobalTheme("dark");
  document.documentElement.setAttribute("data-theme", "dark");
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
    blue: isDark() ? "#80ccff" : "#1e6090",
    pink: isDark() ? "#ffa0d5" : "#a02558",
    blueDim: isDark() ? "#1a3040" : "#9dcce4",
    pinkDim: isDark() ? "#301520" : "#d4508a40",
    surface: isDark() ? "#0a0a0a" : "#f4f8fa",
    surfaceElevated: isDark() ? "#111111" : "#e6f0f5",
    headerBg: isDark() ? "#0a0a0a" : "#ecf2f5",
    text: isDark() ? "#ffffff" : "#06131d",
    textSecondary: isDark() ? "#a0a0a0" : "#195073",
    blueGlow: isDark() ? "rgba(128, 204, 255, 0.6)" : "rgba(30, 96, 144, 0.4)",
    pinkGlow: isDark() ? "rgba(255, 160, 213, 0.6)" : "rgba(160, 37, 88, 0.4)",
    muted: isDark() ? "#252525" : "#9dcce4",
    border: isDark() ? "#1a1a1a" : "#cddce4",
  });
}
