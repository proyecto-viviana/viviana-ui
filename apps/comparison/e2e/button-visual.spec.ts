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
    reactPrimary: reactCard.getByRole('button', { name: 'Primary' }),
    solidPrimary: solidCard.getByRole('button', { name: 'Primary' }),
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
  test('Button default row is pixel-identical', async ({ page }) => {
    const fixtures = await buttonFixtures(page);

    await clearPointer(page);
    await expectScreenshotPair(
      page,
      fixtures.reactRow,
      fixtures.solidRow,
      'Button default row',
      'button-default-row',
    );
  });

  test('Button primary hover state is pixel-identical', async ({ page }) => {
    const fixtures = await buttonFixtures(page);

    await expectPreparedScreenshotPair(
      page,
      fixtures.reactPrimary,
      fixtures.solidPrimary,
      'Button primary hover',
      'button-primary-hover',
      async () => {
        await fixtures.reactPrimary.hover();
        await expect(fixtures.reactPrimary).toHaveAttribute('data-hovered', 'true');
      },
      async () => {
        await fixtures.solidPrimary.hover();
        await expect(fixtures.solidPrimary).toHaveAttribute('data-hovered', 'true');
      },
    );
  });

  test('Button primary focus-visible state is pixel-identical', async ({ page }) => {
    const fixtures = await buttonFixtures(page);

    await expectPreparedScreenshotPair(
      page,
      fixtures.reactCanvas,
      fixtures.solidCanvas,
      'Button primary focus-visible',
      'button-primary-focus-visible',
      async () => {
        await fixtures.reactPrimary.focus();
        await expect(fixtures.reactPrimary).toHaveAttribute('data-focus-visible', 'true');
      },
      async () => {
        await fixtures.solidPrimary.focus();
        await expect(fixtures.solidPrimary).toHaveAttribute('data-focus-visible', 'true');
      },
    );
  });

  test('Button primary pressed state is pixel-identical', async ({ page }) => {
    const fixtures = await buttonFixtures(page);

    await expectPreparedScreenshotPair(
      page,
      fixtures.reactPrimary,
      fixtures.solidPrimary,
      'Button primary pressed',
      'button-primary-pressed',
      async () => {
        await fixtures.reactPrimary.hover();
        await page.mouse.down();
        await expect(fixtures.reactPrimary).toHaveAttribute('data-pressed', 'true');
      },
      async () => {
        await fixtures.solidPrimary.hover();
        await page.mouse.down();
        await expect(fixtures.solidPrimary).toHaveAttribute('data-pressed', 'true');
      },
    );
  });
});
