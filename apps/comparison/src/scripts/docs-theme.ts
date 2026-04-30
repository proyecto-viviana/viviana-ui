import {
  comparisonThemeChangeEvent,
  resolveComparisonThemeChoice,
  type ComparisonThemeChoice,
} from "@comparison/data/theme";

const root = document.body;
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeIcon = document.querySelector("[data-theme-toggle-icon]");
const themeControls = document.querySelectorAll<HTMLInputElement>('[name="comparisonTheme"]');
const savedTheme =
  (window.localStorage.getItem("solid-spectrum-theme") as ComparisonThemeChoice | null) ?? "system";
const themeOrder: ComparisonThemeChoice[] = ["system", "light", "dark"];
const mediaQuery = window.matchMedia?.("(prefers-color-scheme: dark)");

function applyTheme(theme: ComparisonThemeChoice) {
  const resolvedTheme = resolveComparisonThemeChoice(theme);
  root.dataset.theme = theme;
  root.dataset.resolvedTheme = resolvedTheme;

  if (themeIcon) {
    themeIcon.textContent = theme;
  }

  for (const control of themeControls) {
    control.checked = control.value === theme;
  }

  window.localStorage.setItem("solid-spectrum-theme", theme);
  window.dispatchEvent(
    new CustomEvent(comparisonThemeChangeEvent, {
      detail: { theme, resolvedTheme },
    }),
  );
}

themeToggle?.addEventListener("click", () => {
  const current = (root.dataset.theme as ComparisonThemeChoice | undefined) ?? "system";
  const nextTheme = themeOrder[(themeOrder.indexOf(current) + 1) % themeOrder.length] ?? "system";
  applyTheme(nextTheme);
});

for (const control of themeControls) {
  control.addEventListener("change", () => {
    if (control.checked) {
      applyTheme(control.value as ComparisonThemeChoice);
    }
  });
}

mediaQuery?.addEventListener("change", () => {
  if (root.dataset.theme === "system") {
    applyTheme("system");
  }
});

applyTheme(savedTheme);
