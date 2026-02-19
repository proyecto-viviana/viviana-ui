import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Accessibility automation that scans every section in the playground.
// This spec is queued to run once parity is stable (see .claude/docs/roadmap.md).
test.describe('Playground accessibility', () => {
  test('no axe violations when all sections are rendered', async ({ page }) => {
    await page.goto('/playground');
    const showAll = page.getByTestId('show-all-sections');
    await showAll.waitFor({ state: 'visible' });
    await showAll.click();
    await page.waitForSelector('[data-testid^="section-"]');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
