import { test, expect, Page } from '@playwright/test';

/**
 * E2E tests for the documentation sidebar menu
 * Tests navigation, active states, and hydration
 */

// Helper to capture and check for hydration errors
async function setupErrorCapture(page: Page) {
  const errors: string[] = [];

  page.on('pageerror', err => {
    errors.push(err.message);
    console.log(`PAGE ERROR: ${err.message}`);
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  return errors;
}

async function checkNoHydrationErrors(errors: string[]) {
  const hydrationErrors = errors.filter(e =>
    e.includes('template2') ||
    e.includes('hydration') ||
    e.includes('Hydration')
  );

  if (hydrationErrors.length > 0) {
    console.log('Hydration errors found:', hydrationErrors);
  }

  expect(hydrationErrors).toHaveLength(0);
}

async function waitForPageReady(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  // Wait for SolidJS hydration
  await page.waitForTimeout(500);
  await page.waitForLoadState('networkidle');
}

test.describe('Docs Menu', () => {
  test.beforeEach(async ({ page }) => {
    // Go to docs page
    await page.goto('/docs');
    await waitForPageReady(page);
  });

  test('should render sidebar with navigation items', async ({ page }) => {
    const errors = await setupErrorCapture(page);

    // Check sidebar exists
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();

    // Check "Documentation" title
    await expect(sidebar.locator('text=Documentation')).toBeVisible();

    // Check main navigation items
    await expect(sidebar.locator('text=Getting Started')).toBeVisible();
    await expect(sidebar.locator('text=Installation')).toBeVisible();

    // Check section headers
    await expect(sidebar.locator('text=Components')).toBeVisible();
    await expect(sidebar.locator('text=Hooks')).toBeVisible();

    // Check some component links (use href to be specific)
    await expect(sidebar.locator('a[href="/docs/components/button"]')).toBeVisible();
    await expect(sidebar.locator('a[href="/docs/components/checkbox"]')).toBeVisible();
    await expect(sidebar.locator('a[href="/docs/components/select"]')).toBeVisible();

    // Check some hook links
    await expect(sidebar.locator('a[href="/docs/hooks/create-button"]')).toBeVisible();
    await expect(sidebar.locator('a[href="/docs/hooks/create-press"]')).toBeVisible();

    await checkNoHydrationErrors(errors);
  });

  test('should have correct active state on initial load', async ({ page }) => {
    const errors = await setupErrorCapture(page);

    // On /docs, "Getting Started" should be active
    const gettingStartedLink = page.locator('aside a[href="/docs"]');
    await expect(gettingStartedLink).toBeVisible();

    // Check that it has the active class
    await expect(gettingStartedLink).toHaveClass(/active/);

    // Check active styles are applied (background color should be primary-700)
    const bgColor = await gettingStartedLink.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    // primary-700 = #4F6D85 = rgb(79, 109, 133)
    expect(bgColor).not.toBe('transparent');
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');

    await checkNoHydrationErrors(errors);
  });

  test('should update active state when navigating', async ({ page }) => {
    const errors = await setupErrorCapture(page);

    // Initial state - "Getting Started" is active
    const gettingStartedLink = page.locator('aside a[href="/docs"]');
    await expect(gettingStartedLink).toHaveClass(/active/);

    // Click on Button component (scope to sidebar)
    const buttonLink = page.locator('aside a[href="/docs/components/button"]');
    await buttonLink.click();
    await waitForPageReady(page);

    // Now Button should be active, Getting Started should not
    await expect(buttonLink).toHaveClass(/active/);
    await expect(gettingStartedLink).not.toHaveClass(/active/);

    // Main content should show Button page
    await expect(page.locator('h1:has-text("Button")')).toBeVisible();

    await checkNoHydrationErrors(errors);
  });

  test('should maintain active state after page refresh', async ({ page }) => {
    const errors = await setupErrorCapture(page);

    // Navigate to Button page
    await page.goto('/docs/components/button');
    await waitForPageReady(page);

    const buttonLink = page.locator('a[href="/docs/components/button"]');
    await expect(buttonLink).toHaveClass(/active/);

    // Refresh the page
    await page.reload();
    await waitForPageReady(page);

    // Button should still be active
    await expect(buttonLink).toHaveClass(/active/);

    // Verify the active styling is applied immediately (not after interaction)
    const bgColor = await buttonLink.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    expect(bgColor).not.toBe('transparent');
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');

    await checkNoHydrationErrors(errors);
  });

  test('should have consistent styling between links before any interaction', async ({ page }) => {
    const errors = await setupErrorCapture(page);

    // Get all sidebar links
    const links = page.locator('.sidebar-link');
    const count = await links.count();

    expect(count).toBeGreaterThan(5);

    // Check that non-active links have consistent background
    const inactiveLinks = page.locator('.sidebar-link:not(.active)');
    const inactiveCount = await inactiveLinks.count();

    if (inactiveCount > 1) {
      const firstBg = await inactiveLinks.first().evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      // Check a few more links have the same background
      for (let i = 1; i < Math.min(5, inactiveCount); i++) {
        const bg = await inactiveLinks.nth(i).evaluate((el) => {
          return window.getComputedStyle(el).backgroundColor;
        });
        expect(bg).toBe(firstBg);
      }
    }

    await checkNoHydrationErrors(errors);
  });

  test('should not have flash of unstyled content on initial load', async ({ page }) => {
    // This test checks for FOUC/hydration mismatch by taking screenshots
    const errors = await setupErrorCapture(page);

    // Navigate directly to a component page
    await page.goto('/docs/components/checkbox');

    // Take screenshot immediately after DOM content loaded
    await page.waitForLoadState('domcontentloaded');

    const checkboxLink = page.locator('a[href="/docs/components/checkbox"]');

    // Wait for the link to be visible
    await expect(checkboxLink).toBeVisible({ timeout: 5000 });

    // Check that it already has the active class (not added after hydration)
    const hasActiveClass = await checkboxLink.evaluate((el) => {
      return el.classList.contains('active');
    });

    // Note: This might fail if there's a hydration mismatch
    // The server render should already have the active class
    expect(hasActiveClass).toBe(true);

    await checkNoHydrationErrors(errors);
  });

  test('should navigate between component pages correctly', async ({ page }) => {
    const errors = await setupErrorCapture(page);

    // Start at Button page
    await page.goto('/docs/components/button');
    await waitForPageReady(page);

    await expect(page.locator('h1:has-text("Button")')).toBeVisible();

    // Navigate to Select
    await page.locator('a[href="/docs/components/select"]').click();
    await waitForPageReady(page);

    await expect(page.locator('h1:has-text("Select")')).toBeVisible();
    await expect(page.locator('a[href="/docs/components/select"]')).toHaveClass(/active/);

    // Navigate to Menu
    await page.locator('a[href="/docs/components/menu"]').click();
    await waitForPageReady(page);

    await expect(page.locator('h1:has-text("Menu")')).toBeVisible();
    await expect(page.locator('a[href="/docs/components/menu"]')).toHaveClass(/active/);

    await checkNoHydrationErrors(errors);
  });

  test('should navigate to hook pages', async ({ page }) => {
    const errors = await setupErrorCapture(page);

    // Navigate to createButton hook page (scope to sidebar)
    await page.locator('aside a[href="/docs/hooks/create-button"]').click();
    await waitForPageReady(page);

    await expect(page.locator('h1:has-text("createButton")')).toBeVisible();
    await expect(page.locator('aside a[href="/docs/hooks/create-button"]')).toHaveClass(/active/);

    // Navigate to createPress hook page (scope to sidebar)
    await page.locator('aside a[href="/docs/hooks/create-press"]').click();
    await waitForPageReady(page);

    await expect(page.locator('h1:has-text("createPress")')).toBeVisible();
    await expect(page.locator('aside a[href="/docs/hooks/create-press"]')).toHaveClass(/active/);

    await checkNoHydrationErrors(errors);
  });
});

test.describe('Docs Menu Styling', () => {
  test('should have proper hover states', async ({ page }) => {
    await page.goto('/docs');
    await waitForPageReady(page);

    // Find a non-active link (Installation) - scope to sidebar
    const installationLink = page.locator('aside a[href="/docs/installation"]');
    await expect(installationLink).toBeVisible();

    // Get initial background color
    const initialBg = await installationLink.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Hover over the link
    await installationLink.hover();

    // Wait for transition
    await page.waitForTimeout(200);

    // Get hovered background color
    const hoveredBg = await installationLink.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Background should change on hover (from transparent/bg-200 to bg-300)
    expect(hoveredBg).not.toBe(initialBg);
  });

  test('active link should have distinct styling from inactive links', async ({ page }) => {
    await page.goto('/docs/components/button');
    await waitForPageReady(page);

    const activeLink = page.locator('a[href="/docs/components/button"]');
    const inactiveLink = page.locator('a[href="/docs/components/checkbox"]');

    const activeBg = await activeLink.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    const inactiveBg = await inactiveLink.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Active and inactive should have different backgrounds
    expect(activeBg).not.toBe(inactiveBg);
  });
});
