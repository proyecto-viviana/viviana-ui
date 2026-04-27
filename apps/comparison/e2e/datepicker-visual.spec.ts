import { expect, test, type Locator, type Page } from '@playwright/test';

type ElementGeometry = {
  x: number;
  y: number;
  width: number;
  height: number;
  position: string;
  visibleInViewport: boolean;
};

const maxImageMismatchRatio = 0.08;

async function frameworkCard(
  section: Locator,
  framework: 'React Spectrum stack' | 'Solidaria stack',
) {
  const card = section.locator('.framework-card').filter({ hasText: framework });
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
  expect(value.width).toBeGreaterThan(220);
  expect(value.width).toBeLessThanOrEqual(360);
  expect(value.height).toBeGreaterThan(50);
  expect(value.height).toBeLessThanOrEqual(180);
}

function assertVisiblePopoverGeometry(value: ElementGeometry) {
  expect(value.visibleInViewport).toBe(true);
  expect(value.width).toBeGreaterThan(220);
  expect(value.width).toBeLessThanOrEqual(420);
  expect(value.height).toBeGreaterThan(180);
  expect(value.height).toBeLessThanOrEqual(700);
}

async function clickOutsidePopup(page: Page, popup: Locator) {
  const box = await geometry(popup);
  const x = Math.max(8, Math.min(20, box.x - 24));
  const y = Math.max(8, Math.min(20, box.y - 24));
  await page.mouse.click(x, y);
}

async function compareScreenshots(
  page: Page,
  reactPng: Buffer,
  solidPng: Buffer,
  label: string,
  maxMismatchRatio: number = maxImageMismatchRatio,
  maxDimensionDelta: number = 6,
) {
  const result = await page.evaluate(
    async ({ reactBase64, solidBase64 }) => {
      async function loadImage(base64: string) {
        const response = await fetch(`data:image/png;base64,${base64}`);
        return createImageBitmap(await response.blob());
      }

      const [reactImage, solidImage] = await Promise.all([
        loadImage(reactBase64),
        loadImage(solidBase64),
      ]);

      const width = Math.min(reactImage.width, solidImage.width);
      const height = Math.min(reactImage.height, solidImage.height);
      const canvas = document.createElement('canvas');
      canvas.width = width * 2;
      canvas.height = height;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) {
        throw new Error('Could not create canvas context for screenshot comparison');
      }

      context.drawImage(reactImage, 0, 0, width, height);
      context.drawImage(solidImage, width, 0, width, height);

      const reactPixels = context.getImageData(0, 0, width, height).data;
      const solidPixels = context.getImageData(width, 0, width, height).data;
      let mismatched = 0;

      for (let i = 0; i < reactPixels.length; i += 4) {
        const r = Math.abs(reactPixels[i] - solidPixels[i]);
        const g = Math.abs(reactPixels[i + 1] - solidPixels[i + 1]);
        const b = Math.abs(reactPixels[i + 2] - solidPixels[i + 2]);
        const a = Math.abs(reactPixels[i + 3] - solidPixels[i + 3]);
        const delta = Math.max(r, g, b, a);
        if (delta > 8) {
          mismatched += 1;
        }
      }

      return {
        width: reactImage.width,
        height: reactImage.height,
        comparedWidth: solidImage.width,
        comparedHeight: solidImage.height,
        mismatchRatio: mismatched / (width * height),
      };
    },
    {
      reactBase64: reactPng.toString('base64'),
      solidBase64: solidPng.toString('base64'),
    },
  );

  expect(Math.abs(result.width - result.comparedWidth), `${label} width delta`).toBeLessThanOrEqual(maxDimensionDelta);
  expect(Math.abs(result.height - result.comparedHeight), `${label} height delta`).toBeLessThanOrEqual(maxDimensionDelta);
  expect(
    result.mismatchRatio,
    `${label} screenshot mismatch ratio ${result.mismatchRatio} exceeded ${maxMismatchRatio}`,
  ).toBeLessThanOrEqual(maxMismatchRatio);
}

async function openCalendar(card: Locator) {
  const trigger = card.getByRole('button', { name: 'Calendar' });
  await expect(trigger).toBeVisible();
  await trigger.click();
}

async function pickFirstEnabledDate(popover: Locator) {
  const cell = popover.locator('[role="gridcell"]:not([aria-disabled="true"])').first();
  await expect(cell).toBeVisible();
  await cell.click();
}

test.describe('comparison DatePicker visual parity', () => {
  test('React and Solid DatePickers are visually comparable when closed and open', async ({ page }) => {
    await page.goto('/components/datepicker/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('astro-island')).toHaveCount(0);

    const styledSection = page.locator('.layer-block').filter({
      has: page.getByRole('heading', { name: 'Styled Layer' }),
    });
    await expect(styledSection).toHaveCount(1);

    const reactCard = await frameworkCard(styledSection, 'React Spectrum stack');
    const solidCard = await frameworkCard(styledSection, 'Solidaria stack');
    const reactRoot = reactCard.locator('[data-comparison-open][data-comparison-value]');
    const solidRoot = solidCard.locator('[data-comparison-open][data-comparison-value]');

    await expect(reactRoot).toHaveAttribute('data-comparison-open', 'false');
    await expect(solidRoot).toHaveAttribute('data-comparison-open', 'false');
    await expect(reactCard.getByText('Due date')).toBeVisible();
    await expect(solidCard.getByText('Due date')).toBeVisible();

    const reactField = reactCard.locator('.comparison-datepicker-root');
    const solidField = solidCard.locator('.comparison-datepicker-root');
    await expect(reactField).toBeVisible();
    await expect(solidField).toBeVisible();

    const reactFieldGeometry = await geometry(reactField);
    const solidFieldGeometry = await geometry(solidField);
    assertVisibleFieldGeometry(reactFieldGeometry);
    assertVisibleFieldGeometry(solidFieldGeometry);
    expect(Math.abs(solidFieldGeometry.width - reactFieldGeometry.width)).toBeLessThanOrEqual(32);

    await expect(reactField).toHaveScreenshot('datepicker-field-react.png', { animations: 'disabled' });
    await expect(solidField).toHaveScreenshot('datepicker-field-solid.png', { animations: 'disabled' });
    const [reactFieldPng, solidFieldPng] = await Promise.all([
      reactField.screenshot({ animations: 'disabled' }),
      solidField.screenshot({ animations: 'disabled' }),
    ]);
    await compareScreenshots(page, reactFieldPng, solidFieldPng, 'DatePicker field', 0.2, 96);

    await openCalendar(reactCard);
    await expect(reactRoot).toHaveAttribute('data-comparison-open', 'true');
    const reactPopover = page.locator('.comparison-popover').first();
    await expect(reactPopover).toBeVisible();
    await expect(reactPopover.getByRole('grid')).toBeVisible();
    const reactDialog = reactPopover.locator('.comparison-popover-dialog').first();
    await expect(reactDialog).toBeVisible();
    const reactPopoverGeometry = await geometry(reactPopover);
    assertVisiblePopoverGeometry(reactPopoverGeometry);
    await page.mouse.move(4, 4);
    await expect(reactDialog).toHaveScreenshot('datepicker-popover-react.png', { animations: 'disabled' });
    const reactPopoverPng = await reactDialog.screenshot({ animations: 'disabled' });

    await page.keyboard.press('Escape');
    await expect(reactPopover).toHaveCount(0);
    await expect(reactRoot).toHaveAttribute('data-comparison-open', 'false');

    await openCalendar(solidCard);
    await expect(solidRoot).toHaveAttribute('data-comparison-open', 'true');
    const solidPopover = page.locator('.comparison-popover').first();
    await expect(solidPopover).toBeVisible();
    await expect(solidPopover.getByRole('grid')).toBeVisible();
    const solidDialog = solidPopover.locator('.comparison-popover-dialog').first();
    await expect(solidDialog).toBeVisible();
    const solidPopoverGeometry = await geometry(solidPopover);
    assertVisiblePopoverGeometry(solidPopoverGeometry);
    expect(solidPopoverGeometry.position).not.toBe('static');
    await page.mouse.move(4, 4);
    await expect(solidDialog).toHaveScreenshot('datepicker-popover-solid.png', { animations: 'disabled' });
    const solidPopoverPng = await solidDialog.screenshot({ animations: 'disabled' });
    await compareScreenshots(page, reactPopoverPng, solidPopoverPng, 'DatePicker popover', 0.2, 24);

    expect(Math.abs(solidPopoverGeometry.width - reactPopoverGeometry.width)).toBeLessThanOrEqual(120);

    await pickFirstEnabledDate(solidPopover);
    await expect(solidRoot).toHaveAttribute('data-comparison-open', 'false');
    await expect(solidRoot).not.toHaveAttribute('data-comparison-value', '');

    await openCalendar(reactCard);
    const reactPopoverForSelect = page.locator('.comparison-popover').first();
    await expect(reactPopoverForSelect).toBeVisible();
    await pickFirstEnabledDate(reactPopoverForSelect);
    await expect(reactRoot).toHaveAttribute('data-comparison-open', 'false');
    await expect(reactRoot).not.toHaveAttribute('data-comparison-value', '');

    await openCalendar(reactCard);
    const reactPopoverForOutside = page.locator('.comparison-popover').first();
    await expect(reactPopoverForOutside).toBeVisible();
    await clickOutsidePopup(page, reactPopoverForOutside);
    await expect(reactPopoverForOutside).toHaveCount(0);
    await expect(reactRoot).toHaveAttribute('data-comparison-open', 'false');

    await openCalendar(solidCard);
    const solidPopoverForOutside = page.locator('.comparison-popover').first();
    await expect(solidPopoverForOutside).toBeVisible();
    await clickOutsidePopup(page, solidPopoverForOutside);
    await expect(solidPopoverForOutside).toHaveCount(0);
    await expect(solidRoot).toHaveAttribute('data-comparison-open', 'false');
  });
});
