import { expect, test, type Locator, type Page } from "@playwright/test";
import { frameworkPanel, styledSection } from "./comparison-page";
import { pinComparisonTheme } from "./visual-diff";

type ActionButtonCase = {
  id: string;
  params: Record<string, string | boolean>;
};

const actionButtonCases: ActionButtonCase[] = [
  { id: "default", params: {} },
  { id: "size-xs", params: { size: "XS" } },
  { id: "size-s", params: { size: "S" } },
  { id: "size-m", params: { size: "M" } },
  { id: "size-l", params: { size: "L" } },
  { id: "size-xl", params: { size: "XL" } },
  { id: "quiet", params: { isQuiet: true } },
  { id: "static-white", params: { staticColor: "white" } },
  { id: "static-black", params: { staticColor: "black" } },
  { id: "static-auto", params: { staticColor: "auto" } },
  { id: "disabled", params: { isDisabled: true } },
  { id: "pending", params: { isPending: true } },
];

function actionButtonQuery(params: Record<string, string | boolean> = {}) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

async function actionButtonFixtures(page: Page, params: Record<string, string | boolean> = {}) {
  await pinComparisonTheme(page, "dark");
  await page.goto(`/components/actionbutton/${actionButtonQuery(params)}`);
  await page.waitForLoadState("networkidle");
  await expect(page.locator("astro-island")).toHaveCount(0);

  const section = await styledSection(page);
  const reactPanel = await frameworkPanel(section, "React Spectrum stack");
  const solidPanel = await frameworkPanel(section, "Solidaria stack");

  return {
    reactRoot: reactPanel.locator("[data-comparison-actionbutton-props]").first(),
    solidRoot: solidPanel.locator("[data-comparison-actionbutton-props]").first(),
    reactButton: reactPanel.getByRole("button").first(),
    solidButton: solidPanel.getByRole("button").first(),
  };
}

async function setComparisonTheme(page: Page, theme: "light" | "dark") {
  await page.locator(`input[name="comparisonTheme"][value="${theme}"]`).check();
}

async function actionButtonComputedContract(button: Locator) {
  return button.evaluate((element) => {
    const styles = window.getComputedStyle(element);
    return {
      backgroundColor: styles.backgroundColor,
      borderColor: styles.borderColor,
      borderRadius: styles.borderRadius,
      borderWidth: styles.borderWidth,
      color: styles.color,
      cursor: styles.cursor,
      fontSize: styles.fontSize,
      height: styles.height,
      lineHeight: styles.lineHeight,
      padding: styles.padding,
    };
  });
}

test.describe("comparison ActionButton visual parity", () => {
  for (const colorScheme of ["light", "dark"] as const) {
    for (const matrixCase of actionButtonCases) {
      test(`ActionButton ${matrixCase.id} computed styles match React Spectrum in ${colorScheme}`, async ({
        page,
      }) => {
        const fixtures = await actionButtonFixtures(page, matrixCase.params);

        await setComparisonTheme(page, colorScheme);
        await expect
          .poll(async () => {
            const react = await actionButtonComputedContract(fixtures.reactButton);
            const solid = await actionButtonComputedContract(fixtures.solidButton);
            return JSON.stringify({
              react,
              solid,
              matches: JSON.stringify(react) === JSON.stringify(solid),
            });
          })
          .toContain('"matches":true');
      });
    }
  }

  test("ActionButton pending state is exposed on both implementations", async ({ page }) => {
    const fixtures = await actionButtonFixtures(page, { isPending: true });

    await expect(fixtures.reactRoot).toHaveAttribute(
      "data-comparison-actionbutton-pending",
      "true",
    );
    await expect(fixtures.solidRoot).toHaveAttribute(
      "data-comparison-actionbutton-pending",
      "true",
    );
    await expect(fixtures.reactButton).toHaveAttribute("data-pending", "true");
  });
});
