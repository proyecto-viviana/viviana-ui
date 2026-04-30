import { expect, test, type Locator, type Page } from "@playwright/test";

type ElementGeometry = {
  x: number;
  y: number;
  width: number;
  height: number;
  position: string;
  visibleInViewport: boolean;
};

async function frameworkCard(
  section: Locator,
  framework: "React Spectrum stack" | "Solidaria stack",
) {
  const card = section.locator(".framework-card").filter({ hasText: framework });
  await expect(card).toHaveCount(1);
  return card;
}

async function geometry(locator: Locator): Promise<ElementGeometry> {
  return locator.evaluate((node) => {
    const element = node as HTMLElement;
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    return {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      position: style.position,
      visibleInViewport:
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.top < window.innerHeight &&
        rect.left < window.innerWidth,
    };
  });
}

function assertVisibleFieldGeometry(value: ElementGeometry) {
  expect(value.visibleInViewport).toBe(true);
  expect(value.width).toBeGreaterThan(80);
  expect(value.width).toBeLessThanOrEqual(560);
  expect(value.height).toBeGreaterThan(28);
  expect(value.height).toBeLessThanOrEqual(88);
}

function assertVisibleListBoxGeometry(value: ElementGeometry) {
  expect(value.visibleInViewport).toBe(true);
  expect(value.width).toBeGreaterThan(180);
  expect(value.width).toBeLessThanOrEqual(560);
  expect(value.height).toBeGreaterThan(80);
  expect(value.height).toBeLessThanOrEqual(260);
}

async function clickOutsidePopup(page: Page, popup: Locator) {
  const box = await geometry(popup);
  const x = Math.max(8, Math.min(20, box.x - 24));
  const y = Math.max(8, Math.min(20, box.y - 24));
  await page.mouse.click(x, y);
}

test.describe("comparison Select visual parity", () => {
  test("React and Solid Select stay visually and behaviorally comparable in viewport", async ({
    page,
  }) => {
    await page.goto("/components/select/");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("astro-island")).toHaveCount(0);

    const styledSection = page.locator(".layer-block").filter({
      has: page.getByRole("heading", { name: "Styled Layer" }),
    });
    await expect(styledSection).toHaveCount(1);
    await styledSection.scrollIntoViewIfNeeded();

    const reactCard = await frameworkCard(styledSection, "React Spectrum stack");
    const solidCard = await frameworkCard(styledSection, "Solidaria stack");

    const reactRoot = reactCard.locator("[data-comparison-selected-key]");
    const solidRoot = solidCard.locator("[data-comparison-selected-key]");
    await expect(reactRoot).toHaveAttribute("data-comparison-selected-key", "bravo");
    await expect(solidRoot).toHaveAttribute("data-comparison-selected-key", "bravo");

    const reactLabel = reactCard.getByText("Channel", { exact: true });
    const solidLabel = solidCard.locator('.comparison-spectrum-Field-label[data-slot="label"]');
    await expect(reactLabel).toBeVisible();
    await expect(solidLabel).toHaveText("Channel");

    const reactField = reactCard.getByRole("button", { name: /Bravo/ });
    const solidField = solidCard.locator(".comparison-spectrum-Select-trigger");
    await expect(reactField).toBeVisible();
    await expect(solidField).toBeVisible();

    const reactFieldGeometry = await geometry(reactField);
    const solidFieldGeometry = await geometry(solidField);
    assertVisibleFieldGeometry(reactFieldGeometry);
    assertVisibleFieldGeometry(solidFieldGeometry);
    expect(Math.abs(solidFieldGeometry.width - reactFieldGeometry.width)).toBeLessThanOrEqual(120);
    expect(Math.abs(solidFieldGeometry.height - reactFieldGeometry.height)).toBeLessThanOrEqual(20);

    await page.mouse.move(4, 4);
    await expect(reactField).toHaveScreenshot("select-field-react.png", { animations: "disabled" });
    await expect(solidField).toHaveScreenshot("select-field-solid.png", { animations: "disabled" });

    const reactTrigger = reactField;
    const solidTrigger = solidField;
    await expect(reactTrigger).toContainText("Bravo");
    await expect(solidTrigger).toContainText("Bravo");

    await reactTrigger.click();
    const reactListBox = page.getByRole("listbox").filter({ hasText: "Alpha" }).first();
    await expect(reactListBox).toBeVisible();
    await expect(reactListBox.getByRole("option", { name: "Alpha" })).toBeVisible();
    await expect(reactListBox.getByRole("option", { name: "Bravo" })).toBeVisible();
    await expect(reactListBox.getByRole("option", { name: "Charlie" })).toBeVisible();
    const reactListGeometry = await geometry(reactListBox);
    const reactTriggerGeometry = await geometry(reactTrigger);
    assertVisibleListBoxGeometry(reactListGeometry);
    await page.mouse.move(4, 4);
    await expect(reactListBox).toHaveScreenshot("select-listbox-react.png", {
      animations: "disabled",
    });

    await page.keyboard.press("Escape");
    await expect(reactListBox).toHaveCount(0);

    await solidTrigger.click();
    const solidListBox = page.locator('.comparison-spectrum-Select-listbox[role="listbox"]');
    await expect(solidListBox).toBeVisible();
    await expect(solidListBox.getByRole("option", { name: "Alpha" })).toBeVisible();
    await expect(solidListBox.getByRole("option", { name: "Bravo" })).toBeVisible();
    await expect(solidListBox.getByRole("option", { name: "Charlie" })).toBeVisible();
    const solidListGeometry = await geometry(solidListBox);
    const solidTriggerGeometry = await geometry(solidTrigger);
    assertVisibleListBoxGeometry(solidListGeometry);
    expect(solidListGeometry.position).not.toBe("static");
    await page.mouse.move(4, 4);
    await expect(solidListBox).toHaveScreenshot("select-listbox-solid.png", {
      animations: "disabled",
    });

    expect(Math.abs(reactListGeometry.x - reactTriggerGeometry.x)).toBeLessThanOrEqual(24);
    expect(Math.abs(solidListGeometry.x - solidTriggerGeometry.x)).toBeLessThanOrEqual(24);
    expect(
      Math.abs(reactListGeometry.y - (reactTriggerGeometry.y + reactTriggerGeometry.height)),
    ).toBeLessThanOrEqual(24);
    expect(
      Math.abs(solidListGeometry.y - (solidTriggerGeometry.y + solidTriggerGeometry.height)),
    ).toBeLessThanOrEqual(24);
    expect(Math.abs(solidListGeometry.width - reactListGeometry.width)).toBeLessThanOrEqual(40);

    await clickOutsidePopup(page, solidListBox);
    await expect(solidListBox).toHaveCount(0);

    await reactTrigger.click();
    const reactListBoxForSelect = page.getByRole("listbox").filter({ hasText: "Alpha" }).first();
    await expect(reactListBoxForSelect).toBeVisible();
    await reactListBoxForSelect.getByRole("option", { name: "Alpha" }).click();
    await expect(reactListBoxForSelect).toHaveCount(0);
    await expect(reactRoot).toHaveAttribute("data-comparison-selected-key", "alpha");
    const reactTriggerAfterAlpha = reactCard.getByRole("button", { name: /Alpha/ });
    await expect(reactTriggerAfterAlpha).toContainText("Alpha");

    await reactTriggerAfterAlpha.click();
    const reactListBoxForOutside = page.getByRole("listbox").filter({ hasText: "Alpha" }).first();
    await expect(reactListBoxForOutside).toBeVisible();
    await clickOutsidePopup(page, reactListBoxForOutside);
    await expect(reactListBoxForOutside).toHaveCount(0);

    await solidTrigger.click();
    const solidListBoxForSelect = page.locator(
      '.comparison-spectrum-Select-listbox[role="listbox"]',
    );
    await expect(solidListBoxForSelect).toBeVisible();
    await solidListBoxForSelect.getByRole("option", { name: "Charlie" }).click();
    await expect(solidListBoxForSelect).toHaveCount(0);
    await expect(solidRoot).toHaveAttribute("data-comparison-selected-key", "charlie");
    await expect(solidTrigger).toContainText("Charlie");

    await solidTrigger.click();
    const solidListBoxForOutside = page.locator(
      '.comparison-spectrum-Select-listbox[role="listbox"]',
    );
    await expect(solidListBoxForOutside).toBeVisible();
    await clickOutsidePopup(page, solidListBoxForOutside);
    await expect(solidListBoxForOutside).toHaveCount(0);
  });
});
