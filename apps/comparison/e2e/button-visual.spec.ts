import { expect, test, type Locator, type Page } from '@playwright/test';
import { frameworkCanvas, styledSection } from './comparison-page';
import { compareScreenshots } from './visual-diff';

const strictPairDiff = {
  maxMismatchRatio: 0,
  maxDimensionDelta: 0,
  pixelThreshold: 0,
};

type ButtonMatrixCase = {
  id: string;
  label: string;
  params: Record<string, string | boolean>;
};

const buttonMatrixCases: ButtonMatrixCase[] = [
  { id: 'variant-primary-fill', label: 'Button variant primary fill', params: { variant: 'primary', fillStyle: 'fill' } },
  { id: 'variant-secondary-fill', label: 'Button variant secondary fill', params: { variant: 'secondary', fillStyle: 'fill' } },
  { id: 'variant-accent-fill', label: 'Button variant accent fill', params: { variant: 'accent', fillStyle: 'fill' } },
  { id: 'variant-negative-fill', label: 'Button variant negative fill', params: { variant: 'negative', fillStyle: 'fill' } },
  { id: 'variant-premium-fill', label: 'Button variant premium fill', params: { variant: 'premium', fillStyle: 'fill' } },
  { id: 'variant-genai-fill', label: 'Button variant genai fill', params: { variant: 'genai', fillStyle: 'fill' } },
  { id: 'variant-primary-outline', label: 'Button variant primary outline', params: { variant: 'primary', fillStyle: 'outline' } },
  { id: 'variant-secondary-outline', label: 'Button variant secondary outline', params: { variant: 'secondary', fillStyle: 'outline' } },
  { id: 'variant-accent-outline', label: 'Button variant accent outline', params: { variant: 'accent', fillStyle: 'outline' } },
  { id: 'variant-negative-outline', label: 'Button variant negative outline', params: { variant: 'negative', fillStyle: 'outline' } },
  { id: 'variant-premium-outline', label: 'Button variant premium outline', params: { variant: 'premium', fillStyle: 'outline' } },
  { id: 'variant-genai-outline', label: 'Button variant genai outline', params: { variant: 'genai', fillStyle: 'outline' } },
  { id: 'size-s', label: 'Button size S', params: { size: 'S' } },
  { id: 'size-m', label: 'Button size M', params: { size: 'M' } },
  { id: 'size-l', label: 'Button size L', params: { size: 'L' } },
  { id: 'size-xl', label: 'Button size XL', params: { size: 'XL' } },
  { id: 'static-white-fill', label: 'Button staticColor white fill', params: { staticColor: 'white', fillStyle: 'fill' } },
  { id: 'static-black-fill', label: 'Button staticColor black fill', params: { staticColor: 'black', fillStyle: 'fill' } },
  { id: 'static-auto-fill', label: 'Button staticColor auto fill', params: { staticColor: 'auto', fillStyle: 'fill' } },
  { id: 'static-white-outline', label: 'Button staticColor white outline', params: { staticColor: 'white', fillStyle: 'outline' } },
  { id: 'static-black-outline', label: 'Button staticColor black outline', params: { staticColor: 'black', fillStyle: 'outline' } },
  { id: 'static-auto-outline', label: 'Button staticColor auto outline', params: { staticColor: 'auto', fillStyle: 'outline' } },
  { id: 'disabled', label: 'Button disabled', params: { isDisabled: true } },
  { id: 'pending', label: 'Button pending', params: { isPending: true } },
];

async function frameworkCard(
  section: Locator,
  framework: 'React Spectrum stack' | 'Solidaria stack',
) {
  const card = section.locator('.framework-card').filter({ hasText: framework });
  await expect(card).toHaveCount(1);
  return card;
}

function buttonQuery(params: Record<string, string | boolean> = {}) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : '';
}

async function buttonFixtures(page: Page, params: Record<string, string | boolean> = {}) {
  await page.goto(`/components/button/${buttonQuery(params)}`);
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
  const [reactPng, solidPng] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    solidTarget.screenshot({ animations: 'disabled' }),
  ]);

  expect(reactPng).toMatchSnapshot(`${snapshotName}-react.png`);
  expect(solidPng).toMatchSnapshot(`${snapshotName}-solid.png`);
  await compareScreenshots(
    page,
    reactPng,
    solidPng,
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
  const reactPng = await reactTarget.screenshot({ animations: 'disabled' });
  expect(reactPng).toMatchSnapshot(`${snapshotName}-react.png`);

  await page.mouse.up();
  await clearPointer(page);
  await prepareSolid();
  await page.waitForTimeout(220);
  const solidPng = await solidTarget.screenshot({ animations: 'disabled' });
  expect(solidPng).toMatchSnapshot(`${snapshotName}-solid.png`);

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

  test('Button delayed pending spinner is pixel-identical', async ({ page }) => {
    const fixtures = await buttonFixtures(page, { isPending: true });

    await expect(fixtures.reactRow.getByRole('progressbar', { name: 'pending' })).toBeVisible();
    await expect(fixtures.solidRow.getByRole('progressbar', { name: 'pending' })).toBeVisible();
    await expectScreenshotPair(
      page,
      fixtures.reactRow,
      fixtures.solidRow,
      'Button delayed pending spinner',
      'button-pending-spinner',
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
