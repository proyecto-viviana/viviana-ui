import { expect, test } from "@playwright/test";

test.describe("comparison catalogue controls", () => {
  test("filters by search text and reports visible count", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("searchbox", { name: "Search" }).fill("Accordion");

    const visibleCards = page.locator("[data-entry-card]:not([hidden])");
    await expect(visibleCards).toHaveCount(1);
    await expect(visibleCards.first()).toHaveAttribute("data-title", "Accordion");
    await expect(page.locator("[data-result-count]")).toHaveText("1 component");
  });

  test("sorts visible entries by component name", async ({ page }) => {
    await page.goto("/");

    await page.getByLabel("Sort").selectOption("name");

    const titles = await page.locator("[data-entry-card]:not([hidden]) h3").allTextContents();
    const firstTen = titles.slice(0, 10);
    const sortedFirstTen = [...firstTen].sort((a, b) => a.localeCompare(b));

    expect(firstTen).toEqual(sortedFirstTen);
  });
});
