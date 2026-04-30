import { expect, test } from '@playwright/test';
import { frameworkCanvas, styledSection } from './comparison-page';
import { defaultVisualCases } from './default-state-cases';

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
