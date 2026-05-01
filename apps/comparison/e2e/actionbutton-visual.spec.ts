import { expect, test, type Locator, type Page } from "@playwright/test";
import { frameworkCanvas, frameworkPanel, styledSection } from "./comparison-page";
import { pinComparisonTheme } from "./visual-diff";
import { clearPointer, expectPreparedScreenshotPair, expectScreenshotPair } from "./visual-diff";

const actionButtonPairDiff = {
  maxMismatchRatio: 0.12,
  maxDimensionDelta: 4,
  pixelThreshold: 64,
};

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
  const reactCanvas = await frameworkCanvas(section, "React Spectrum stack");
  const solidCanvas = await frameworkCanvas(section, "Solidaria stack");

  return {
    reactCanvas,
    solidCanvas,
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

  for (const item of actionButtonCases) {
    test(`ActionButton ${item.id} has committed pair screenshots`, async ({ page }) => {
      const fixtures = await actionButtonFixtures(page, item.params);

      await clearPointer(page);
      await expectScreenshotPair(
        page,
        fixtures.reactCanvas,
        fixtures.solidCanvas,
        `ActionButton ${item.id}`,
        `actionbutton-${item.id}`,
        actionButtonPairDiff,
      );
    });
  }

  test("ActionButton hover state has committed pair screenshots", async ({ page }) => {
    const fixtures = await actionButtonFixtures(page);

    await expectPreparedScreenshotPair(
      page,
      fixtures.reactCanvas,
      fixtures.solidCanvas,
      "ActionButton hover",
      "actionbutton-hover",
      async () => {
        await fixtures.reactButton.hover();
        await expect(fixtures.reactButton).toHaveAttribute("data-hovered", "true");
      },
      async () => {
        await fixtures.solidButton.hover();
        await expect(fixtures.solidButton).toHaveAttribute("data-hovered", "true");
      },
      actionButtonPairDiff,
    );
  });

  test("ActionButton focus-visible state has committed pair screenshots", async ({ page }) => {
    const fixtures = await actionButtonFixtures(page);

    await expectPreparedScreenshotPair(
      page,
      fixtures.reactCanvas,
      fixtures.solidCanvas,
      "ActionButton focus-visible",
      "actionbutton-focus-visible",
      async () => {
        await fixtures.reactButton.focus();
        await expect(fixtures.reactButton).toHaveAttribute("data-focus-visible", "true");
      },
      async () => {
        await fixtures.solidButton.focus();
        await expect(fixtures.solidButton).toHaveAttribute("data-focus-visible", "true");
      },
      actionButtonPairDiff,
    );
  });

  test("ActionButton pressed state has committed pair screenshots", async ({ page }) => {
    const fixtures = await actionButtonFixtures(page);

    await expectPreparedScreenshotPair(
      page,
      fixtures.reactCanvas,
      fixtures.solidCanvas,
      "ActionButton pressed",
      "actionbutton-pressed",
      async () => {
        await fixtures.reactButton.hover();
        await page.mouse.down();
        await expect(fixtures.reactButton).toHaveAttribute("data-pressed", "true");
      },
      async () => {
        await fixtures.solidButton.hover();
        await page.mouse.down();
        await expect(fixtures.solidButton).toHaveAttribute("data-pressed", "true");
      },
      actionButtonPairDiff,
    );
  });
});
