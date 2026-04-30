import { expect, test, type Locator, type Page } from "@playwright/test";
import { frameworkCanvas, styledSection } from "./comparison-page";
import { compareScreenshots } from "./visual-diff";

const strictPairDiff = {
  maxMismatchRatio: 0.001,
  maxDimensionDelta: 4,
  pixelThreshold: 64,
};

type ButtonMatrixCase = {
  id: string;
  label: string;
  params: Record<string, string | boolean>;
};

const buttonMatrixCases: ButtonMatrixCase[] = [
  {
    id: "variant-primary-fill",
    label: "Button variant primary fill",
    params: { variant: "primary", fillStyle: "fill" },
  },
  {
    id: "variant-secondary-fill",
    label: "Button variant secondary fill",
    params: { variant: "secondary", fillStyle: "fill" },
  },
  {
    id: "variant-accent-fill",
    label: "Button variant accent fill",
    params: { variant: "accent", fillStyle: "fill" },
  },
  {
    id: "variant-negative-fill",
    label: "Button variant negative fill",
    params: { variant: "negative", fillStyle: "fill" },
  },
  {
    id: "variant-premium-fill",
    label: "Button variant premium fill",
    params: { variant: "premium", fillStyle: "fill" },
  },
  {
    id: "variant-genai-fill",
    label: "Button variant genai fill",
    params: { variant: "genai", fillStyle: "fill" },
  },
  {
    id: "variant-primary-outline",
    label: "Button variant primary outline",
    params: { variant: "primary", fillStyle: "outline" },
  },
  {
    id: "variant-secondary-outline",
    label: "Button variant secondary outline",
    params: { variant: "secondary", fillStyle: "outline" },
  },
  {
    id: "variant-accent-outline",
    label: "Button variant accent outline",
    params: { variant: "accent", fillStyle: "outline" },
  },
  {
    id: "variant-negative-outline",
    label: "Button variant negative outline",
    params: { variant: "negative", fillStyle: "outline" },
  },
  {
    id: "variant-premium-outline",
    label: "Button variant premium outline",
    params: { variant: "premium", fillStyle: "outline" },
  },
  {
    id: "variant-genai-outline",
    label: "Button variant genai outline",
    params: { variant: "genai", fillStyle: "outline" },
  },
  { id: "size-s", label: "Button size S", params: { size: "S" } },
  { id: "size-m", label: "Button size M", params: { size: "M" } },
  { id: "size-l", label: "Button size L", params: { size: "L" } },
  { id: "size-xl", label: "Button size XL", params: { size: "XL" } },
  {
    id: "static-white-fill",
    label: "Button staticColor white fill",
    params: { staticColor: "white", fillStyle: "fill" },
  },
  {
    id: "static-black-fill",
    label: "Button staticColor black fill",
    params: { staticColor: "black", fillStyle: "fill" },
  },
  {
    id: "static-auto-fill",
    label: "Button staticColor auto fill",
    params: { staticColor: "auto", fillStyle: "fill" },
  },
  {
    id: "static-white-outline",
    label: "Button staticColor white outline",
    params: { staticColor: "white", fillStyle: "outline" },
  },
  {
    id: "static-black-outline",
    label: "Button staticColor black outline",
    params: { staticColor: "black", fillStyle: "outline" },
  },
  {
    id: "static-auto-outline",
    label: "Button staticColor auto outline",
    params: { staticColor: "auto", fillStyle: "outline" },
  },
  { id: "disabled", label: "Button disabled", params: { isDisabled: true } },
  { id: "pending", label: "Button pending", params: { isPending: true } },
];

async function frameworkCard(
  section: Locator,
  framework: "React Spectrum stack" | "Solidaria stack",
) {
  const card = section.locator(".framework-card").filter({ hasText: framework });
  await expect(card).toHaveCount(1);
  return card;
}

function buttonQuery(params: Record<string, string | boolean> = {}) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

async function buttonFixtures(page: Page, params: Record<string, string | boolean> = {}) {
  await page.goto(`/components/button/${buttonQuery(params)}`);
  await page.waitForLoadState("networkidle");
  await expect(page.locator("astro-island")).toHaveCount(0);

  const section = await styledSection(page);
  const reactCard = await frameworkCard(section, "React Spectrum stack");
  const solidCard = await frameworkCard(section, "Solidaria stack");
  const reactCanvas = await frameworkCanvas(section, "React Spectrum stack");
  const solidCanvas = await frameworkCanvas(section, "Solidaria stack");

  return {
    reactCanvas,
    solidCanvas,
    reactRow: reactCard.locator(".comparison-button-row"),
    solidRow: solidCard.locator(".comparison-button-row"),
    reactButton: reactCard.getByRole("button", { name: "Save" }),
    solidButton: solidCard.getByRole("button", { name: "Save" }),
  };
}

async function clearPointer(page: Page) {
  await page.mouse.move(4, 4);
  await page.waitForTimeout(50);
}

async function buttonComputedContract(button: Locator) {
  return button.evaluate((element) => {
    const styles = window.getComputedStyle(element);
    const label = element.querySelector('[data-rsp-slot="text"], [data-slot="label"]');
    const labelRect = label?.getBoundingClientRect();
    const buttonRect = element.getBoundingClientRect();
    const centerDelta = labelRect
      ? Number(
          (labelRect.top + labelRect.height / 2 - (buttonRect.top + buttonRect.height / 2)).toFixed(
            4,
          ),
        )
      : null;

    return {
      cursor: styles.cursor,
      backgroundColor: styles.backgroundColor,
      color: styles.color,
      borderColor: styles.borderColor,
      borderWidth: styles.borderWidth,
      height: styles.height,
      padding: styles.padding,
      lineHeight: styles.lineHeight,
      textCenterDelta: centerDelta,
    };
  });
}

async function buttonGradientBackground(button: Locator) {
  return button.evaluate((element) => {
    const childGradient = Array.from(element.children)
      .map((child) => window.getComputedStyle(child).backgroundImage)
      .find((background) => background !== "none");
    const pseudoGradient = window.getComputedStyle(element, "::before").backgroundImage;

    return childGradient ?? pseudoGradient;
  });
}

async function expectComputedButtonParity(reactButton: Locator, solidButton: Locator) {
  expect(await buttonComputedContract(solidButton)).toEqual(
    await buttonComputedContract(reactButton),
  );
}

async function normalizedScreenshot(target: Locator) {
  const previousStyle = await target.evaluate((element) => {
    const htmlElement = element as HTMLElement;
    const style = htmlElement.getAttribute("style");

    htmlElement.style.position = "fixed";
    htmlElement.style.insetBlockStart = "64px";
    htmlElement.style.insetInlineStart = "64px";
    htmlElement.style.margin = "0";
    htmlElement.style.zIndex = "2147483647";

    return style;
  });

  try {
    await target.evaluate(() => new Promise(requestAnimationFrame));
    return await target.screenshot({ animations: "disabled" });
  } finally {
    await target.evaluate((element, style) => {
      const htmlElement = element as HTMLElement;
      if (style === null) {
        htmlElement.removeAttribute("style");
        return;
      }

      htmlElement.setAttribute("style", style);
    }, previousStyle);
  }
}

async function expectScreenshotPair(
  page: Page,
  reactTarget: Locator,
  solidTarget: Locator,
  label: string,
  snapshotName: string,
) {
  const [reactPng, solidPng] = await Promise.all([
    normalizedScreenshot(reactTarget),
    normalizedScreenshot(solidTarget),
  ]);

  expect(reactPng).toMatchSnapshot(`${snapshotName}-react.png`);
  expect(solidPng).toMatchSnapshot(`${snapshotName}-solid.png`);
  await compareScreenshots(page, reactPng, solidPng, label, strictPairDiff);
}

async function expectPreparedScreenshotPair(
  page: Page,
  reactTarget: Locator,
  solidTarget: Locator,
  label: string,
  snapshotName: string,
  prepareReact: () => Promise<void>,
  prepareSolid: () => Promise<void>,
) {
  await clearPointer(page);
  await prepareReact();
  await page.waitForTimeout(220);
  const reactPng = await normalizedScreenshot(reactTarget);
  expect(reactPng).toMatchSnapshot(`${snapshotName}-react.png`);

  await page.mouse.up();
  await clearPointer(page);
  await prepareSolid();
  await page.waitForTimeout(220);
  const solidPng = await normalizedScreenshot(solidTarget);
  expect(solidPng).toMatchSnapshot(`${snapshotName}-solid.png`);

  await page.mouse.up();
  await compareScreenshots(page, reactPng, solidPng, label, strictPairDiff);
}

test.describe("comparison Button visual parity", () => {
  test("Button default control is pixel-identical", async ({ page }) => {
    const fixtures = await buttonFixtures(page);

    await clearPointer(page);
    await expectScreenshotPair(
      page,
      fixtures.reactRow,
      fixtures.solidRow,
      "Button default control",
      "button-default-control",
    );
  });

  test("Button hover state is pixel-identical", async ({ page }) => {
    const fixtures = await buttonFixtures(page);

    await expectPreparedScreenshotPair(
      page,
      fixtures.reactButton,
      fixtures.solidButton,
      "Button hover",
      "button-hover",
      async () => {
        await fixtures.reactButton.hover();
        await expect(fixtures.reactButton).toHaveAttribute("data-hovered", "true");
      },
      async () => {
        await fixtures.solidButton.hover();
        await expect(fixtures.solidButton).toHaveAttribute("data-hovered", "true");
      },
    );
  });

  test("Button focus-visible state is pixel-identical", async ({ page }) => {
    const fixtures = await buttonFixtures(page);

    await expectPreparedScreenshotPair(
      page,
      fixtures.reactCanvas,
      fixtures.solidCanvas,
      "Button focus-visible",
      "button-focus-visible",
      async () => {
        await fixtures.reactButton.focus();
        await expect(fixtures.reactButton).toHaveAttribute("data-focus-visible", "true");
      },
      async () => {
        await fixtures.solidButton.focus();
        await expect(fixtures.solidButton).toHaveAttribute("data-focus-visible", "true");
      },
    );
  });

  test("Button pressed state is pixel-identical", async ({ page }) => {
    const fixtures = await buttonFixtures(page);

    await expectPreparedScreenshotPair(
      page,
      fixtures.reactButton,
      fixtures.solidButton,
      "Button pressed",
      "button-pressed",
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
    );
  });

  test("Button delayed pending spinner is pixel-identical", async ({ page }) => {
    const fixtures = await buttonFixtures(page, { isPending: true });

    await expect(fixtures.reactRow.getByRole("progressbar", { name: "pending" })).toBeVisible();
    await expect(fixtures.solidRow.getByRole("progressbar", { name: "pending" })).toBeVisible();
    await expectScreenshotPair(
      page,
      fixtures.reactRow,
      fixtures.solidRow,
      "Button delayed pending spinner",
      "button-pending-spinner",
    );
  });

  test("Button prop controls drive both implementations", async ({ page }) => {
    const fixtures = await buttonFixtures(page);

    await page.getByLabel("children").fill("Delete");
    await page.getByLabel("variant").selectOption("negative");
    await page.getByLabel("fillStyle").selectOption("outline");
    await page.getByLabel("size").selectOption("L");
    await page.getByLabel("staticColor").selectOption("white");

    const reactRoot = fixtures.reactCanvas.locator("[data-comparison-button-props]").first();
    const solidRoot = fixtures.solidCanvas.locator("[data-comparison-button-props]").first();
    const expected = JSON.stringify({
      children: "Delete",
      variant: "negative",
      fillStyle: "outline",
      size: "L",
      staticColor: "white",
      isDisabled: false,
      isPending: false,
    });

    await expect(reactRoot).toHaveAttribute("data-comparison-button-props", expected);
    await expect(solidRoot).toHaveAttribute("data-comparison-button-props", expected);
    await expect(fixtures.reactCanvas.getByRole("button", { name: "Delete" })).toBeVisible();
    await expect(fixtures.solidCanvas.getByRole("button", { name: "Delete" })).toHaveAttribute(
      "data-variant",
      "negative",
    );
    await expect(fixtures.solidCanvas.getByRole("button", { name: "Delete" })).toHaveAttribute(
      "data-style",
      "outline",
    );
    await expect(fixtures.solidCanvas.getByRole("button", { name: "Delete" })).toHaveAttribute(
      "data-size",
      "L",
    );
  });

  test("Button hover cursor and genai gradient match React Spectrum", async ({ page }) => {
    const fixtures = await buttonFixtures(page, { variant: "genai", fillStyle: "fill" });

    await fixtures.reactButton.hover();
    await expect(fixtures.reactButton).toHaveAttribute("data-hovered", "true");
    await page.waitForTimeout(220);
    const reactContract = await buttonComputedContract(fixtures.reactButton);
    const reactGradient = await buttonGradientBackground(fixtures.reactButton);

    await fixtures.solidButton.hover();
    await expect(fixtures.solidButton).toHaveAttribute("data-hovered", "true");
    await page.waitForTimeout(220);
    await expect(buttonComputedContract(fixtures.solidButton)).resolves.toMatchObject({
      cursor: reactContract.cursor,
      backgroundColor: reactContract.backgroundColor,
      color: reactContract.color,
      borderColor: reactContract.borderColor,
    });
    await expect(buttonGradientBackground(fixtures.solidButton)).resolves.toBe(reactGradient);
  });

  test("Button outline L and XL text remains centered like React Spectrum", async ({ page }) => {
    for (const size of ["L", "XL"] as const) {
      const fixtures = await buttonFixtures(page, {
        variant: "primary",
        fillStyle: "outline",
        size,
      });

      await expectComputedButtonParity(fixtures.reactButton, fixtures.solidButton);
      const solidContract = await buttonComputedContract(fixtures.solidButton);
      expect(solidContract.textCenterDelta).toBe(0);
    }
  });

  test("Button staticColor computed styles match React Spectrum across variants", async ({
    page,
  }) => {
    const variants = ["primary", "secondary", "accent", "negative", "premium", "genai"] as const;
    const fillStyles = ["fill", "outline"] as const;
    const staticColors = ["white", "black"] as const;

    for (const staticColor of staticColors) {
      for (const fillStyle of fillStyles) {
        for (const variant of variants) {
          const fixtures = await buttonFixtures(page, { variant, fillStyle, staticColor });

          await expectComputedButtonParity(fixtures.reactButton, fixtures.solidButton);
          if (variant === "premium" || variant === "genai") {
            await expect(buttonGradientBackground(fixtures.solidButton)).resolves.toBe(
              await buttonGradientBackground(fixtures.reactButton),
            );
          }
        }
      }
    }
  });

  for (const item of buttonMatrixCases) {
    test(`${item.label} is pixel-identical`, async ({ page }) => {
      const fixtures = await buttonFixtures(page, item.params);

      await clearPointer(page);
      await expectScreenshotPair(
        page,
        fixtures.reactRow,
        fixtures.solidRow,
        item.label,
        `button-${item.id}`,
      );
    });
  }
});
