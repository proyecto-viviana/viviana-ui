import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const runAxe = process.env.RUN_AXE === '1';

// Accessibility automation that scans every section in the playground.
// This spec is queued until parity is confirmed; set `RUN_AXE=1` to enable it.
test.describe('Playground accessibility (axe scan)', () => {
  test('no axe violations when all sections are rendered', async ({ page }) => {
    test.skip(!runAxe, 'Queued until RUN_AXE=1 is set once parity is locked');
    await page.goto('/playground');
    const showAll = page.getByTestId('show-all-sections');
    await showAll.waitFor({ state: 'visible' });
    await showAll.click();
    await page.waitForSelector('[data-testid^="section-"]');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
