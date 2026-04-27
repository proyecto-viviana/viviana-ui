import { test, expect } from '@playwright/test';

test.describe('DatePicker debug', () => {
  test('inspect Solid popover position over time', async ({ page }) => {
    await page.goto('/components/datepicker/');
    await page.waitForLoadState('networkidle');

    const styledSection = page.locator('.layer-block').filter({
      has: page.getByRole('heading', { name: 'Styled Layer' }),
    });
    const solidCard = styledSection.locator('.framework-card').filter({ hasText: 'Solidaria stack' });
    const reactCard = styledSection.locator('.framework-card').filter({ hasText: 'React Spectrum stack' });

    // First open the React popover and dump position so we have a baseline.
    await reactCard.getByRole('button', { name: 'Calendar' }).click();
    let popover = page.locator('.comparison-popover').first();
    await expect(popover).toBeVisible();
    const reactInfo = await popover.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const styles = window.getComputedStyle(el);
      const inline = el.getAttribute('style') || '';
      return {
        x: rect.x,
        y: rect.y,
        w: rect.width,
        h: rect.height,
        position: styles.position,
        inline,
      };
    });
    console.log('REACT popover:', JSON.stringify(reactInfo, null, 2));
    await page.keyboard.press('Escape');
    await expect(popover).toHaveCount(0);

    // Now open the Solid popover and sample its position over time.
    await solidCard.getByRole('button', { name: 'Calendar' }).click();
    popover = page.locator('.comparison-popover').first();
    await expect(popover).toBeVisible();

    for (const delay of [0, 100, 300, 800]) {
      await page.waitForTimeout(delay);
      const info = await popover.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        const styles = window.getComputedStyle(el);
        const inline = el.getAttribute('style') || '';
        return {
          x: rect.x,
          y: rect.y,
          w: rect.width,
          h: rect.height,
          position: styles.position,
          inline,
        };
      });
      console.log(`SOLID popover @ +${delay}ms:`, JSON.stringify(info, null, 2));
    }

    expect(true).toBe(true);
  });
});
