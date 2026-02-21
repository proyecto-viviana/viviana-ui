import { test, expect, type Page } from '@playwright/test';

/**
 * Playground component tests focused on stable contracts:
 * - No hydration/runtime errors.
 * - Section visibility controls behave deterministically.
 * - Core interaction patterns still work in representative sections.
 */

const SECTION_SELECTOR = 'section[data-testid^="section-"]';

async function setupErrorCapture(page: Page) {
  const errors: string[] = [];

  page.on('pageerror', (err) => {
    errors.push(err.message);
  });

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  return errors;
}

async function checkNoHydrationErrors(errors: string[]) {
  const hydrationErrors = errors.filter((e) =>
    /template2|hydration|Hydration/.test(e),
  );
  expect(hydrationErrors).toHaveLength(0);
}

async function waitForPageReady(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
  await expect(page.getByTestId('show-all-sections')).toBeVisible();
}

async function ensureSectionVisible(page: Page, sectionId: string) {
  const section = page.locator(`section[data-testid="section-${sectionId}"]`);
  if (await section.count()) {
    await expect(section.first()).toBeVisible();
    return section.first();
  }

  const toggle = page.getByTestId(`section-toggle-${sectionId}`);
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect(section.first()).toBeVisible();
  return section.first();
}

test.describe('Playground Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/playground');
    await waitForPageReady(page);
  });

  test('loads without hydration errors', async ({ page }) => {
    const errors = await setupErrorCapture(page);

    await expect(page.getByRole('heading', { name: /component playground/i })).toBeVisible();
    await expect(page.getByTestId('show-all-sections')).toBeVisible();
    await expect(page.getByTestId('hide-all-sections')).toBeVisible();

    await checkNoHydrationErrors(errors);
  });

  test('show all / hide all section controls are deterministic', async ({ page }) => {
    const errors = await setupErrorCapture(page);

    await page.getByTestId('show-all-sections').click();
    await page.waitForFunction((selector) => document.querySelectorAll(selector).length > 50, SECTION_SELECTOR);
    await expect(page.locator(SECTION_SELECTOR).first()).toBeVisible();

    await page.getByTestId('hide-all-sections').click();
    await page.waitForFunction((selector) => document.querySelectorAll(selector).length === 0, SECTION_SELECTOR);
    await expect(page.locator(SECTION_SELECTOR)).toHaveCount(0);

    await checkNoHydrationErrors(errors);
  });

  test('switch section toggle updates aria-checked', async ({ page }) => {
    const errors = await setupErrorCapture(page);
    const section = await ensureSectionVisible(page, 'switch');

    const toggle = section.getByRole('switch', { name: 'Toggle demo switch' }).first();
    await expect(toggle).toBeVisible();

    const initial = await toggle.isChecked();
    await toggle.evaluate((input) => {
      (input as HTMLInputElement).click();
    });
    const next = await toggle.isChecked();
    expect(next).not.toBe(initial);

    await checkNoHydrationErrors(errors);
  });

  test('styled tabs keep tab-to-panel ARIA linkage valid', async ({ page }) => {
    const errors = await setupErrorCapture(page);
    const section = await ensureSectionVisible(page, 'styled-tabs');

    const tablist = section.locator('[role="tablist"]').first();
    await expect(tablist).toBeVisible();

    const tabs = tablist.locator('[role="tab"]');
    await expect(tabs.first()).toBeVisible();
    expect(await tabs.count()).toBeGreaterThan(1);

    const selectedTabBefore = tablist.getByRole('tab', { selected: true }).first();
    await expect(selectedTabBefore).toBeVisible();

    const controlsBefore = await selectedTabBefore.getAttribute('aria-controls');
    expect(controlsBefore).toBeTruthy();
    if (!controlsBefore) {
      throw new Error('Selected tab is missing aria-controls before interaction');
    }
    await expect(section.locator(`#${controlsBefore}`)).toHaveCount(1);

    await tabs.nth(1).click();
    const selectedTabAfter = tablist.getByRole('tab', { selected: true }).first();
    const controlsAfter = await selectedTabAfter.getAttribute('aria-controls');
    expect(controlsAfter).toBeTruthy();
    if (!controlsAfter) {
      throw new Error('Selected tab is missing aria-controls after interaction');
    }
    await expect(section.locator(`#${controlsAfter}`)).toHaveCount(1);

    await checkNoHydrationErrors(errors);
  });

  test('menu section opens and exposes menuitems', async ({ page }) => {
    const errors = await setupErrorCapture(page);
    const section = await ensureSectionVisible(page, 'menu');

    const trigger = section.getByRole('button', { name: /actions/i }).first();
    await expect(trigger).toBeVisible();
    await trigger.click();

    const menu = page.locator('ul[role="menu"]').first();
    await expect(menu).toBeVisible();
    await expect(menu.locator('[role="menuitem"]').first()).toBeVisible();

    await checkNoHydrationErrors(errors);
  });
});
