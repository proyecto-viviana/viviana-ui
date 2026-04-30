import { expect, test, type Locator, type Page } from '@playwright/test';
import { frameworkCanvas, styledSection } from './comparison-page';
import { compareScreenshots, compareLocatorScreenshots } from './visual-diff';

const strictPairDiff = {
  maxMismatchRatio: 0,
  maxDimensionDelta: 0,
  pixelThreshold: 0,
};

async function frameworkCard(
  section: Locator,
  framework: 'React Spectrum stack' | 'Solidaria stack',
) {
  const card = section.locator('.framework-card').filter({ hasText: framework });
  await expect(card).toHaveCount(1);
  return card;
}

async function buttonFixtures(page: Page) {
  await page.goto('/components/button/');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('astro-island')).toHaveCount(0);

  const section = await styledSection(page);
  const reactCard = await frameworkCard(section, 'React Spectrum stack');
  const solidCard = await frameworkCard(section, 'Solidaria stack');
  const reactCanvas = await frameworkCanvas(section, 'React Spectrum stack');
  const solidCanvas = await frameworkCanvas(section, 'Solidaria stack');

  return {
    reactCanvas,
    solidCanvas,
    reactRow: reactCard.locator('.comparison-button-row'),
    solidRow: solidCard.locator('.comparison-button-row'),
    reactButton: reactCard.getByRole('button', { name: 'Save' }),
    solidButton: solidCard.getByRole('button', { name: 'Save' }),
  };
}

async function clearPointer(page: Page) {
  await page.mouse.move(4, 4);
  await page.waitForTimeout(50);
}

async function expectScreenshotPair(
  page: Page,
  reactTarget: Locator,
  solidTarget: Locator,
  label: string,
  snapshotName: string,
) {
  await expect(reactTarget).toHaveScreenshot(`${snapshotName}-react.png`, {
    animations: 'disabled',
  });
  await expect(solidTarget).toHaveScreenshot(`${snapshotName}-solid.png`, {
    animations: 'disabled',
  });
  await compareLocatorScreenshots(
    page,
    reactTarget,
    solidTarget,
    label,
    strictPairDiff,
  );
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
  await expect(reactTarget).toHaveScreenshot(`${snapshotName}-react.png`, {
    animations: 'disabled',
  });
  const reactPng = await reactTarget.screenshot({ animations: 'disabled' });

  await page.mouse.up();
  await clearPointer(page);
  await prepareSolid();
  await page.waitForTimeout(220);
  await expect(solidTarget).toHaveScreenshot(`${snapshotName}-solid.png`, {
    animations: 'disabled',
  });
  const solidPng = await solidTarget.screenshot({ animations: 'disabled' });

  await page.mouse.up();
  await compareScreenshots(page, reactPng, solidPng, label, strictPairDiff);
}

test.describe('comparison Button visual parity', () => {
  test('Button default control is pixel-identical', async ({ page }) => {
    const fixtures = await buttonFixtures(page);

    await clearPointer(page);
    await expectScreenshotPair(
      page,
      fixtures.reactRow,
      fixtures.solidRow,
      'Button default control',
      'button-default-control',
    );
  });

  test('Button hover state is pixel-identical', async ({ page }) => {
    const fixtures = await buttonFixtures(page);

    await expectPreparedScreenshotPair(
      page,
      fixtures.reactButton,
      fixtures.solidButton,
      'Button hover',
      'button-hover',
      async () => {
        await fixtures.reactButton.hover();
        await expect(fixtures.reactButton).toHaveAttribute('data-hovered', 'true');
      },
      async () => {
        await fixtures.solidButton.hover();
        await expect(fixtures.solidButton).toHaveAttribute('data-hovered', 'true');
      },
    );
  });

  test('Button focus-visible state is pixel-identical', async ({ page }) => {
    const fixtures = await buttonFixtures(page);

    await expectPreparedScreenshotPair(
      page,
      fixtures.reactCanvas,
      fixtures.solidCanvas,
      'Button focus-visible',
      'button-focus-visible',
      async () => {
        await fixtures.reactButton.focus();
        await expect(fixtures.reactButton).toHaveAttribute('data-focus-visible', 'true');
      },
      async () => {
        await fixtures.solidButton.focus();
        await expect(fixtures.solidButton).toHaveAttribute('data-focus-visible', 'true');
      },
    );
  });

  test('Button pressed state is pixel-identical', async ({ page }) => {
    const fixtures = await buttonFixtures(page);

    await expectPreparedScreenshotPair(
      page,
      fixtures.reactButton,
      fixtures.solidButton,
      'Button pressed',
      'button-pressed',
      async () => {
        await fixtures.reactButton.hover();
        await page.mouse.down();
        await expect(fixtures.reactButton).toHaveAttribute('data-pressed', 'true');
      },
      async () => {
        await fixtures.solidButton.hover();
        await page.mouse.down();
        await expect(fixtures.solidButton).toHaveAttribute('data-pressed', 'true');
      },
    );
  });

  test('Button prop controls drive both implementations', async ({ page }) => {
    const fixtures = await buttonFixtures(page);

    await page.getByLabel('children').fill('Delete');
    await page.getByLabel('variant').selectOption('negative');
    await page.getByLabel('fillStyle').selectOption('outline');
    await page.getByLabel('size').selectOption('L');
    await page.getByLabel('staticColor').selectOption('white');

    const reactRoot = fixtures.reactCanvas.locator('[data-comparison-button-props]').first();
    const solidRoot = fixtures.solidCanvas.locator('[data-comparison-button-props]').first();
    const expected = JSON.stringify({
      children: 'Delete',
      variant: 'negative',
      fillStyle: 'outline',
      size: 'L',
      staticColor: 'white',
      isDisabled: false,
      isPending: false,
    });

    await expect(reactRoot).toHaveAttribute('data-comparison-button-props', expected);
    await expect(solidRoot).toHaveAttribute('data-comparison-button-props', expected);
    await expect(fixtures.reactCanvas.getByRole('button', { name: 'Delete' })).toBeVisible();
    await expect(fixtures.solidCanvas.getByRole('button', { name: 'Delete' })).toHaveAttribute('data-variant', 'negative');
    await expect(fixtures.solidCanvas.getByRole('button', { name: 'Delete' })).toHaveAttribute('data-style', 'outline');
    await expect(fixtures.solidCanvas.getByRole('button', { name: 'Delete' })).toHaveAttribute('data-size', 'L');
  });
});
