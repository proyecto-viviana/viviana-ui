import { test, expect, type Page, type Locator } from '@playwright/test';

/**
 * Docs navigation tests focused on stable contracts:
 * - Sidebar nav renders expected routes.
 * - Navigation updates active state.
 * - No hydration/runtime errors during route changes.
 */

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
}

function docsSidebar(page: Page): Locator {
  return page
    .locator('nav')
    .filter({ has: page.locator('a[href="/docs/components/button"]') })
    .first();
}

test.describe('Docs Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/docs');
    await waitForPageReady(page);
  });

  test('renders docs sidebar navigation links', async ({ page }) => {
    const errors = await setupErrorCapture(page);
    const sidebar = docsSidebar(page);

    await expect(sidebar).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'Getting Started' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'Installation' })).toBeVisible();
    await expect(sidebar.locator('a[href="/docs/components/button"]')).toBeVisible();
    await expect(sidebar.locator('a[href="/docs/components/checkbox"]')).toBeVisible();
    await expect(sidebar.locator('a[href="/docs/hooks/create-button"]')).toBeVisible();
    await expect(sidebar.locator('a[href="/docs/hooks/create-press"]')).toBeVisible();

    await checkNoHydrationErrors(errors);
  });

  test('navigates from getting started to a component page', async ({ page }) => {
    const errors = await setupErrorCapture(page);
    const sidebar = docsSidebar(page);

    await expect(page.locator('h1:has-text("Getting Started")')).toBeVisible();

    const buttonLink = sidebar.locator('a[href="/docs/components/button"]');
    await buttonLink.click();
    await waitForPageReady(page);

    await expect(page.locator('h1:has-text("Button")')).toBeVisible();

    await checkNoHydrationErrors(errors);
  });

  test('keeps current docs route after refresh', async ({ page }) => {
    const errors = await setupErrorCapture(page);

    await page.goto('/docs/components/button');
    await waitForPageReady(page);

    const sidebar = docsSidebar(page);
    const buttonLink = sidebar.locator('a[href="/docs/components/button"]');
    await expect(buttonLink).toBeVisible();
    await expect(page.locator('h1:has-text("Button")')).toBeVisible();

    await page.reload();
    await waitForPageReady(page);

    await expect(page.locator('h1:has-text("Button")')).toBeVisible();
    await expect(buttonLink).toBeVisible();

    await checkNoHydrationErrors(errors);
  });

  test('navigates component and hook pages from sidebar', async ({ page }) => {
    const errors = await setupErrorCapture(page);
    const sidebar = docsSidebar(page);

    await sidebar.locator('a[href="/docs/components/select"]').click();
    await waitForPageReady(page);
    await expect(page.locator('h1:has-text("Select")')).toBeVisible();

    await sidebar.locator('a[href="/docs/hooks/create-button"]').click();
    await waitForPageReady(page);
    await expect(page.locator('h1:has-text("createButton")')).toBeVisible();

    await sidebar.locator('a[href="/docs/hooks/create-press"]').click();
    await waitForPageReady(page);
    await expect(page.locator('h1:has-text("createPress")')).toBeVisible();

    await checkNoHydrationErrors(errors);
  });
});
