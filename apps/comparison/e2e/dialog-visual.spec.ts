import { expect, test, type Locator, type Page } from '@playwright/test';

type DialogGeometry = {
  x: number;
  y: number;
  width: number;
  height: number;
  position: string;
  visibleInViewport: boolean;
};

const dialogText = 'Dialog focus and dismissal are compared from this island.';
const maxImageMismatchRatio = 0.02;

async function frameworkCard(section: Locator, framework: 'React Spectrum stack' | 'Solidaria stack') {
  const card = section.locator('.framework-card').filter({ hasText: framework });
  await expect(card).toHaveCount(1);
  return card;
}

async function openDialog(card: Locator) {
  const trigger = card.getByRole('button', { name: 'Open Dialog' });
  await expect(trigger).toHaveClass(/comparison-spectrum-Button/);
  await trigger.click();
}

async function compareElementScreenshots(
  page: Page,
  reactElement: Locator,
  solidElement: Locator,
  label: string,
) {
  const [reactPng, solidPng] = await Promise.all([
    reactElement.screenshot({ animations: 'disabled' }),
    solidElement.screenshot({ animations: 'disabled' }),
  ]);

  await compareScreenshots(page, reactPng, solidPng, label);
}

async function compareScreenshots(
  page: Page,
  reactPng: Buffer,
  solidPng: Buffer,
  label: string,
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

      if (reactImage.width !== solidImage.width || reactImage.height !== solidImage.height) {
        return {
          width: reactImage.width,
          height: reactImage.height,
          comparedWidth: solidImage.width,
          comparedHeight: solidImage.height,
          mismatchRatio: 1,
          maxChannelDelta: 255,
        };
      }

      const canvas = document.createElement('canvas');
      canvas.width = reactImage.width * 2;
      canvas.height = reactImage.height;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) {
        throw new Error('Could not create canvas context for screenshot comparison');
      }

      context.drawImage(reactImage, 0, 0);
      context.drawImage(solidImage, reactImage.width, 0);

      const reactPixels = context.getImageData(0, 0, reactImage.width, reactImage.height).data;
      const solidPixels = context.getImageData(reactImage.width, 0, reactImage.width, reactImage.height).data;
      let mismatched = 0;
      let maxChannelDelta = 0;

      for (let i = 0; i < reactPixels.length; i += 4) {
        const r = Math.abs(reactPixels[i] - solidPixels[i]);
        const g = Math.abs(reactPixels[i + 1] - solidPixels[i + 1]);
        const b = Math.abs(reactPixels[i + 2] - solidPixels[i + 2]);
        const a = Math.abs(reactPixels[i + 3] - solidPixels[i + 3]);
        const delta = Math.max(r, g, b, a);
        maxChannelDelta = Math.max(maxChannelDelta, delta);

        if (delta > 8) {
          mismatched += 1;
        }
      }

      return {
        width: reactImage.width,
        height: reactImage.height,
        comparedWidth: solidImage.width,
        comparedHeight: solidImage.height,
        mismatchRatio: mismatched / (reactImage.width * reactImage.height),
        maxChannelDelta,
      };
    },
    {
      reactBase64: reactPng.toString('base64'),
      solidBase64: solidPng.toString('base64'),
    },
  );

  expect(result, `${label} screenshots should have the same dimensions`).toMatchObject({
    width: result.comparedWidth,
    height: result.comparedHeight,
  });
  expect(
    result.mismatchRatio,
    `${label} screenshot mismatch ratio ${result.mismatchRatio} exceeded ${maxImageMismatchRatio}`,
  ).toBeLessThanOrEqual(maxImageMismatchRatio);
}

async function dialogGeometry(dialog: Locator): Promise<DialogGeometry> {
  return dialog.evaluate((node) => {
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

async function clickOutsideDialog(page: Page, dialog: Locator) {
  const geometry = await dialogGeometry(dialog);
  const x = Math.max(8, Math.min(24, geometry.x - 24));
  const y = Math.max(8, Math.min(24, geometry.y - 24));
  await page.mouse.click(x, y);
}

async function expectTabFocusContained(page: Page, dialog: Locator, expectedButtonName: string) {
  await page.keyboard.press('Tab');
  const activeAfterFirstTab = dialog.page().locator(':focus');
  await expect(activeAfterFirstTab).toHaveAccessibleName(expectedButtonName);
  await expect(dialog).toContainText(dialogText);
  expect(await dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true);

  await page.keyboard.press('Tab');
  expect(await dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true);
}

function assertVisibleDialogGeometry(geometry: DialogGeometry) {
  expect(geometry.visibleInViewport).toBe(true);
  expect(geometry.width).toBeGreaterThan(240);
  expect(geometry.width).toBeLessThanOrEqual(420);
  expect(geometry.height).toBeGreaterThan(90);
  expect(geometry.height).toBeLessThanOrEqual(320);
  expect(geometry.x).toBeGreaterThan(0);
  expect(geometry.y).toBeGreaterThan(40);
}

test.describe('comparison Dialog visual parity', () => {
  test('React and Solid dialogs open visibly, stay in viewport, and dismiss', async ({ page }) => {
    await page.goto('/components/dialog/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('astro-island')).toHaveCount(0);

    const styledSection = page.locator('.layer-block').filter({
      has: page.getByRole('heading', { name: 'Styled Layer' }),
    });
    await expect(styledSection).toHaveCount(1);

    const reactCard = await frameworkCard(styledSection, 'React Spectrum stack');
    const solidCard = await frameworkCard(styledSection, 'Solidaria stack');
    const solidRoot = page.locator('.comparison-stack[data-comparison-open]').first();
    const reactTrigger = reactCard.getByRole('button', { name: 'Open Dialog' });
    const solidTrigger = solidCard.getByRole('button', { name: 'Open Dialog' });

    await expect(solidRoot).toHaveAttribute('data-comparison-open', 'false');
    await compareElementScreenshots(page, reactTrigger, solidTrigger, 'Dialog trigger');
    await expect(reactTrigger).toHaveScreenshot('dialog-trigger-react.png', { animations: 'disabled' });
    await expect(solidTrigger).toHaveScreenshot('dialog-trigger-solid.png', { animations: 'disabled' });

    await openDialog(reactCard);
    const reactDialog = page.getByRole('dialog', { name: 'Review Changes' });
    await expect(reactDialog).toBeVisible();
    await expect(reactDialog).toHaveClass(/comparison-spectrum-Dialog/);
    await expect(reactDialog.getByRole('heading', { name: 'Review Changes' })).toBeVisible();
    await expect(reactDialog.getByText(dialogText)).toBeVisible();
    const reactCloseButton = reactDialog.getByRole('button', { name: 'Close dialog' });
    await expect(reactCloseButton).toBeVisible();
    await expect(reactCloseButton).toHaveClass(/comparison-spectrum-Dialog-closeButton/);

    const reactGeometry = await dialogGeometry(reactDialog);
    assertVisibleDialogGeometry(reactGeometry);
    await expect(reactDialog).toHaveScreenshot('dialog-surface-react.png', { animations: 'disabled' });
    const reactDialogPng = await reactDialog.screenshot({ animations: 'disabled' });
    await expectTabFocusContained(page, reactDialog, 'Close dialog');

    await clickOutsideDialog(page, reactDialog);
    await expect(reactDialog).toHaveCount(0);

    await openDialog(reactCard);
    await expect(reactDialog).toBeVisible();
    await reactCloseButton.click();
    await expect(reactDialog).toHaveCount(0);

    await openDialog(solidCard);
    await expect(solidRoot).toHaveAttribute('data-comparison-open', 'true');

    const solidDialog = page.getByRole('dialog', { name: 'Review Changes' });
    await expect(solidDialog).toBeVisible();
    await expect(solidDialog).toHaveClass(/comparison-spectrum-Dialog/);
    await expect(solidDialog.getByRole('heading', { name: 'Review Changes' })).toBeVisible();
    await expect(solidDialog.getByText(dialogText)).toBeVisible();
    await expect(solidDialog.getByRole('button', { name: 'Close dialog' })).toBeVisible();

    const solidGeometry = await dialogGeometry(solidDialog);
    assertVisibleDialogGeometry(solidGeometry);
    expect(solidGeometry.position).not.toBe('static');
    await expect(solidDialog).toHaveScreenshot('dialog-surface-solid.png', { animations: 'disabled' });
    const solidDialogPng = await solidDialog.screenshot({ animations: 'disabled' });
    await compareScreenshots(page, reactDialogPng, solidDialogPng, 'Dialog surface');
    await expectTabFocusContained(page, solidDialog, 'Close dialog');

    expect(Math.abs(solidGeometry.x - reactGeometry.x)).toBeLessThanOrEqual(40);
    expect(Math.abs(solidGeometry.y - reactGeometry.y)).toBeLessThanOrEqual(80);
    expect(Math.abs(solidGeometry.width - reactGeometry.width)).toBeLessThanOrEqual(60);

    await clickOutsideDialog(page, solidDialog);
    await expect(solidDialog).toHaveCount(0);
    await expect(solidRoot).toHaveAttribute('data-comparison-open', 'false');

    await openDialog(solidCard);
    await expect(solidRoot).toHaveAttribute('data-comparison-open', 'true');
    const solidDialogAfterOutsideDismiss = page.getByRole('dialog', { name: 'Review Changes' });
    await expect(solidDialogAfterOutsideDismiss).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(solidDialogAfterOutsideDismiss).toHaveCount(0);
    await expect(solidRoot).toHaveAttribute('data-comparison-open', 'false');
    await expect(solidRoot).toHaveAttribute('data-comparison-focus-returned', 'true');
  });
});
