import { expect, test, type Locator, type Page } from '@playwright/test';

type DefaultVisualCase = {
  slug: string;
  title: string;
};

const defaultVisualCases: DefaultVisualCase[] = [
  { slug: 'provider', title: 'Provider' },
  { slug: 'button', title: 'Button' },
  { slug: 'tabs', title: 'Tabs' },
  { slug: 'textfield', title: 'TextField' },
  { slug: 'checkbox', title: 'Checkbox' },
  { slug: 'searchfield', title: 'SearchField' },
  { slug: 'tooltip', title: 'Tooltip trigger' },
];

async function styledSection(page: Page) {
  const section = page.locator('.layer-block').filter({
    has: page.getByRole('heading', { name: 'Styled Layer' }),
  });
  await expect(section).toHaveCount(1);
  await section.scrollIntoViewIfNeeded();
  return section;
}

async function frameworkCanvas(
  section: Locator,
  framework: 'React Spectrum stack' | 'Solidaria stack',
) {
  const card = section.locator('.framework-card').filter({ hasText: framework });
  await expect(card).toHaveCount(1);
  const canvas = card.locator('.comparison-reference-canvas');
  await expect(canvas).toBeVisible();
  return canvas;
}

test.describe('comparison default visual states', () => {
  for (const item of defaultVisualCases) {
    test(`${item.title} has committed React and Solid default screenshots`, async ({ page }) => {
      await page.goto(`/components/${item.slug}/`);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('astro-island')).toHaveCount(0);

      const section = await styledSection(page);
      const reactCanvas = await frameworkCanvas(section, 'React Spectrum stack');
      const solidCanvas = await frameworkCanvas(section, 'Solidaria stack');

      await page.mouse.move(4, 4);
      await expect(reactCanvas).toHaveScreenshot(`${item.slug}-default-react.png`, {
        animations: 'disabled',
      });
      await expect(solidCanvas).toHaveScreenshot(`${item.slug}-default-solid.png`, {
        animations: 'disabled',
      });
    });
  }
});
