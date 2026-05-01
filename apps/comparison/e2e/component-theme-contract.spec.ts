import { expect, test, type Page } from "@playwright/test";
import { reactSpectrumCatalogue } from "../src/data/react-spectrum-catalogue";

async function setThemeFromControl(page: Page, theme: "light" | "dark") {
  await page.locator(`input[name="comparisonTheme"][value="${theme}"]`).evaluate((node) => {
    const input = node as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

test.describe("comparison component theme contract", () => {
  for (const item of reactSpectrumCatalogue) {
    test(`${item.title} exposes light and dark theme controls`, async ({ page }) => {
      await page.goto(`/components/${item.slug}/`);
      await page.waitForLoadState("networkidle");
      await expect(page.locator("astro-island")).toHaveCount(0);

      const body = page.locator("body");
      const solidThemeRoots = page.locator("[data-comparison-color-scheme]");

      await expect(page.getByRole("group", { name: "Color scheme" })).toBeVisible();

      await setThemeFromControl(page, "light");
      await expect(body).toHaveAttribute("data-theme", "light");
      await expect(body).toHaveAttribute("data-resolved-theme", "light");
      if ((await solidThemeRoots.count()) > 0) {
        await expect(solidThemeRoots.first()).toHaveAttribute(
          "data-comparison-color-scheme",
          "light",
        );
      }

      await setThemeFromControl(page, "dark");
      await expect(body).toHaveAttribute("data-theme", "dark");
      await expect(body).toHaveAttribute("data-resolved-theme", "dark");
      if ((await solidThemeRoots.count()) > 0) {
        await expect(solidThemeRoots.first()).toHaveAttribute(
          "data-comparison-color-scheme",
          "dark",
        );
      }
    });
  }
});
