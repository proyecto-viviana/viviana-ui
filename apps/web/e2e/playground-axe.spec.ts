import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const runAxe = process.env.RUN_AXE === '1';

// Accessibility automation that scans every section in the playground.
// Runs in both dark and light modes to catch contrast issues in each theme.
// Tests multiple strictness levels to provide a full audit.

test.describe('Playground accessibility (axe scan)', () => {
  for (const theme of ['dark', 'light'] as const) {
    // Level 1: WCAG 2.1 A + AA (the standard bar — must pass)
    test(`[${theme}] WCAG 2.1 AA — zero violations`, async ({ page }) => {
      test.skip(!runAxe, 'Queued until RUN_AXE=1');
      await page.goto('/playground');
      await page.evaluate(
        (t) => document.documentElement.setAttribute('data-theme', t),
        theme,
      );
      const showAll = page.getByTestId('show-all-sections');
      await showAll.waitFor({ state: 'visible' });
      await showAll.click();
      await page.waitForSelector('[data-testid^="section-"]');

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(results.violations).toEqual([]);
    });

    // Level 2: WCAG 2.2 AA (latest standard)
    test(`[${theme}] WCAG 2.2 AA — zero violations`, async ({ page }) => {
      test.skip(!runAxe, 'Queued until RUN_AXE=1');
      await page.goto('/playground');
      await page.evaluate(
        (t) => document.documentElement.setAttribute('data-theme', t),
        theme,
      );
      const showAll = page.getByTestId('show-all-sections');
      await showAll.waitFor({ state: 'visible' });
      await showAll.click();
      await page.waitForSelector('[data-testid^="section-"]');

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(results.violations).toEqual([]);
    });

    // Level 3: Best practices (axe recommendations beyond WCAG)
    test(`[${theme}] best-practices — assessment`, async ({ page }) => {
      test.skip(!runAxe, 'Queued until RUN_AXE=1');
      await page.goto('/playground');
      await page.evaluate(
        (t) => document.documentElement.setAttribute('data-theme', t),
        theme,
      );
      const showAll = page.getByTestId('show-all-sections');
      await showAll.waitFor({ state: 'visible' });
      await showAll.click();
      await page.waitForSelector('[data-testid^="section-"]');

      const results = await new AxeBuilder({ page })
        .withTags(['best-practice'])
        .analyze();

      // Report but do not fail — this is an assessment
      if (results.violations.length > 0) {
        console.log(`\n[${theme}] best-practice violations (${results.violations.length}):`);
        for (const v of results.violations) {
          console.log(`  - ${v.id}: ${v.help} (${v.nodes.length} nodes)`);
        }
      }
      expect(results.violations).toEqual([]);
    });

    // Level 4: WCAG AAA (aspirational — color-contrast-enhanced, etc.)
    test(`[${theme}] WCAG 2.1 AAA — assessment`, async ({ page }) => {
      test.skip(!runAxe, 'Queued until RUN_AXE=1');
      await page.goto('/playground');
      await page.evaluate(
        (t) => document.documentElement.setAttribute('data-theme', t),
        theme,
      );
      const showAll = page.getByTestId('show-all-sections');
      await showAll.waitFor({ state: 'visible' });
      await showAll.click();
      await page.waitForSelector('[data-testid^="section-"]');

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2aaa', 'wcag21aaa'])
        .analyze();

      if (results.violations.length > 0) {
        console.log(`\n[${theme}] WCAG AAA violations (${results.violations.length}):`);
        for (const v of results.violations) {
          console.log(`  - ${v.id}: ${v.help} (${v.nodes.length} nodes)`);
        }
      }
      // Report — AAA is aspirational, log but still assert to surface issues
      expect(results.violations).toEqual([]);
    });

    // Level 5: Experimental rules (cutting-edge checks)
    test(`[${theme}] experimental rules — assessment`, async ({ page }) => {
      test.skip(!runAxe, 'Queued until RUN_AXE=1');
      await page.goto('/playground');
      await page.evaluate(
        (t) => document.documentElement.setAttribute('data-theme', t),
        theme,
      );
      const showAll = page.getByTestId('show-all-sections');
      await showAll.waitFor({ state: 'visible' });
      await showAll.click();
      await page.waitForSelector('[data-testid^="section-"]');

      const results = await new AxeBuilder({ page })
        .withTags(['experimental'])
        .analyze();

      if (results.violations.length > 0) {
        console.log(`\n[${theme}] experimental violations (${results.violations.length}):`);
        for (const v of results.violations) {
          console.log(`  - ${v.id}: ${v.help} (${v.nodes.length} nodes)`);
        }
      }
      expect(results.violations).toEqual([]);
    });
  }
});
