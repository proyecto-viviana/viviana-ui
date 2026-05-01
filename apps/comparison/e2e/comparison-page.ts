import { expect, type Locator, type Page } from "@playwright/test";

export type FrameworkName = "React Spectrum stack" | "Solidaria stack";

export async function styledSection(page: Page) {
  const section = page.locator("#example").filter({
    has: page.getByRole("heading", { name: "Example" }),
  });
  await expect(section).toHaveCount(1);
  await section.scrollIntoViewIfNeeded();
  return section;
}

export async function frameworkPanel(section: Locator, framework: FrameworkName) {
  const card = section.locator(
    framework === "React Spectrum stack"
      ? '.s2-framework-panel[data-framework="react"]'
      : '.s2-framework-panel[data-framework="solid"]',
  );
  await expect(card).toHaveCount(1);
  return card;
}

export async function frameworkCanvas(section: Locator, framework: FrameworkName) {
  const card = await frameworkPanel(section, framework);
  const canvas = card.locator(".comparison-reference-canvas");
  await expect(canvas).toBeVisible();
  return canvas;
}
