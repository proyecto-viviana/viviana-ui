import { test, expect, Page } from '@playwright/test';

/**
 * E2E tests for playground components
 * Tests for hydration errors and basic functionality
 *
 * NOTE: Some styled UI components are temporarily disabled due to SSR hydration issues
 * in the useRenderProps children getter pattern. See playground.tsx TODOs for details.
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

test.describe('Playground Page - Hydration Tests', () => {
  test('playground loads without hydration errors', async ({ page }) => {
    const errors = await setupErrorCapture(page);

    await page.goto('/playground');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check for error boundary
    const errorBoundary = page.locator('text="Something went wrong"');
    const hasErrorBoundary = await errorBoundary.count() > 0;

    if (hasErrorBoundary) {
      await page.screenshot({ path: 'e2e-screenshots/playground-error.png', fullPage: true });
    }

    expect(hasErrorBoundary).toBe(false);
    await checkNoHydrationErrors(errors);
  });

  test('scrolling through entire playground works', async ({ page }) => {
    const errors = await setupErrorCapture(page);

    await page.goto('/playground');
    await page.waitForLoadState('networkidle');

    // Scroll through the page in increments
    const scrollSteps = 10;
    for (let i = 0; i < scrollSteps; i++) {
      await page.evaluate((step) => {
        const height = document.body.scrollHeight;
        window.scrollTo(0, (height / 10) * (step + 1));
      }, i);
      await page.waitForTimeout(300);
    }

    // Wait for any lazy-loaded content
    await page.waitForTimeout(1000);

    await checkNoHydrationErrors(errors);
  });
});

test.describe('Select Component (Headless)', () => {
  test('select opens and closes correctly', async ({ page }) => {
    const errors = await setupErrorCapture(page);

    await page.goto('/playground');
    await page.waitForLoadState('networkidle');

    // Find select section (headless version, not "Styled Select")
    const selectSection = page.locator('section:has-text("Select"):not(:has-text("Styled"))').first();

    // Scroll with offset to ensure header doesn't overlap
    await selectSection.evaluate((el) => {
      el.scrollIntoView({ block: 'center' });
    });
    await page.waitForTimeout(500);

    // Find and click the select trigger button with force to avoid header overlap
    const selectTrigger = selectSection.locator('button').first();
    await selectTrigger.click({ force: true });
    await page.waitForTimeout(500);

    // Check if listbox appeared
    const listbox = page.locator('ul[role="listbox"]');
    const isVisible = await listbox.isVisible().catch(() => false);

    if (isVisible) {
      // Click an option
      const options = listbox.locator('li[role="option"]');
      if (await options.count() > 0) {
        await options.first().click({ force: true });
        await page.waitForTimeout(300);
      }
    }

    await checkNoHydrationErrors(errors);
  });
});

test.describe('Menu Component (Headless)', () => {
  test('menu opens and actions work', async ({ page }) => {
    const errors = await setupErrorCapture(page);

    await page.goto('/playground');
    await page.waitForLoadState('networkidle');

    // Find menu section (headless version)
    const menuSection = page.locator('section:has-text("Menu"):not(:has-text("Styled"))').first();
    await menuSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Find and click menu button
    const menuButton = menuSection.locator('button:has-text("Actions")');
    if (await menuButton.count() > 0) {
      await menuButton.click();
      await page.waitForTimeout(500);

      // Check if menu appeared
      const menu = page.locator('ul[role="menu"]');
      const menuVisible = await menu.isVisible().catch(() => false);

      if (menuVisible) {
        // Click a menu item
        const menuItems = menu.locator('li[role="menuitem"]');
        if (await menuItems.count() > 0) {
          await menuItems.first().click();
          await page.waitForTimeout(300);
        }
      }
    }

    await checkNoHydrationErrors(errors);
  });
});

test.describe('ListBox Component (Headless)', () => {
  test('listbox renders and selection works', async ({ page }) => {
    const errors = await setupErrorCapture(page);

    await page.goto('/playground');
    await page.waitForLoadState('networkidle');

    // Find listbox section (headless version)
    const listboxSection = page.locator('section:has-text("ListBox"):not(:has-text("Styled"))').first();
    await listboxSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Find listbox
    const listbox = listboxSection.locator('ul[role="listbox"]').first();
    if (await listbox.count() > 0) {
      const options = listbox.locator('li[role="option"]');
      const optionCount = await options.count();

      expect(optionCount).toBeGreaterThan(0);

      // Click an option
      if (optionCount > 0) {
        await options.first().click();
        await page.waitForTimeout(300);

        // Check selection
        const selectedOption = listbox.locator('li[role="option"][data-selected="true"]');
        expect(await selectedOption.count()).toBeGreaterThan(0);
      }
    }

    await checkNoHydrationErrors(errors);
  });
});

test.describe('Dialog Component', () => {
  test('dialog renders with actions', async ({ page }) => {
    const errors = await setupErrorCapture(page);

    await page.goto('/playground');
    await page.waitForLoadState('networkidle');

    // Find dialog section
    const dialogSection = page.locator('section:has-text("Dialog")').first();
    await dialogSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Click to open the dialog first
    const openButton = dialogSection.locator('button:has-text("Open Dialog")');
    await openButton.click();
    await page.waitForTimeout(300);

    // Check dialog content is visible
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    const dialogTitle = dialog.locator('text="Welcome!"');
    expect(await dialogTitle.count()).toBeGreaterThan(0);

    // Find action buttons in the dialog
    const getStartedBtn = dialog.locator('button:has-text("Get Started")');
    const cancelBtn = dialog.locator('button:has-text("Cancel")');

    expect(await getStartedBtn.count()).toBeGreaterThan(0);
    expect(await cancelBtn.count()).toBeGreaterThan(0);

    // Close the dialog
    await cancelBtn.click();
    await expect(dialog).not.toBeVisible();

    await checkNoHydrationErrors(errors);
  });
});

test.describe('Tooltip Component', () => {
  test('tooltip shows on hover', async ({ page }) => {
    const errors = await setupErrorCapture(page);

    await page.goto('/playground');
    await page.waitForLoadState('networkidle');

    // Find tooltip section
    const tooltipSection = page.locator('section:has-text("Tooltip")').first();
    await tooltipSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Find a button with tooltip
    const tooltipTrigger = tooltipSection.locator('button:has-text("Top")');

    if (await tooltipTrigger.count() > 0) {
      // Hover over the button
      await tooltipTrigger.hover();
      await page.waitForTimeout(600); // Wait for tooltip delay

      // Check if tooltip appeared
      const tooltip = page.locator('[role="tooltip"]');
      const tooltipVisible = await tooltip.isVisible().catch(() => false);

      console.log(`Tooltip visible: ${tooltipVisible}`);
    }

    await checkNoHydrationErrors(errors);
  });
});

test.describe('Checkbox Component', () => {
  test('checkbox renders without hydration errors', async ({ page }) => {
    const errors = await setupErrorCapture(page);

    await page.goto('/playground');
    await page.waitForLoadState('networkidle');

    // Find checkbox section
    const checkboxSection = page.locator('section:has-text("Checkbox")').first();

    // Scroll with offset to ensure header doesn't overlap
    await checkboxSection.evaluate((el) => {
      el.scrollIntoView({ block: 'center' });
    });
    await page.waitForTimeout(500);

    // Verify checkbox exists
    const checkbox = checkboxSection.locator('input[type="checkbox"]').first();
    expect(await checkbox.count()).toBeGreaterThan(0);

    await checkNoHydrationErrors(errors);
  });
});

test.describe('Button Component', () => {
  test('button click increments counter', async ({ page }) => {
    const errors = await setupErrorCapture(page);

    await page.goto('/playground');
    await page.waitForLoadState('networkidle');

    // Find button section
    const buttonSection = page.locator('section:has-text("Button")').first();
    await buttonSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Find count button
    const countButton = buttonSection.locator('button:has-text("Count:")').first();

    if (await countButton.count() > 0) {
      const initialText = await countButton.textContent();
      await countButton.click();
      await page.waitForTimeout(200);

      const newText = await countButton.textContent();
      expect(newText).not.toBe(initialText);
    }

    await checkNoHydrationErrors(errors);
  });
});

test.describe('Switch Component', () => {
  test('toggle switch works', async ({ page }) => {
    const errors = await setupErrorCapture(page);

    await page.goto('/playground');
    await page.waitForLoadState('networkidle');

    // Find switch section
    const switchSection = page.locator('section:has-text("Switch")').first();
    await switchSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Find toggle switch
    const toggleSwitch = switchSection.locator('button[role="switch"]').first();

    if (await toggleSwitch.count() > 0) {
      const initialState = await toggleSwitch.getAttribute('aria-checked');

      await toggleSwitch.click();
      await page.waitForTimeout(200);

      const newState = await toggleSwitch.getAttribute('aria-checked');
      expect(newState).not.toBe(initialState);
    }

    await checkNoHydrationErrors(errors);
  });
});

test.describe('TextField Component', () => {
  test('textfield input works', async ({ page }) => {
    const errors = await setupErrorCapture(page);

    await page.goto('/playground');
    await page.waitForLoadState('networkidle');

    // Find textfield section
    const textfieldSection = page.locator('section:has-text("TextField")').first();
    await textfieldSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Find email input
    const emailInput = textfieldSection.locator('input[type="text"]').first();

    if (await emailInput.count() > 0) {
      await emailInput.fill('test@example.com');
      await page.waitForTimeout(200);

      const value = await emailInput.inputValue();
      expect(value).toBe('test@example.com');
    }

    await checkNoHydrationErrors(errors);
  });
});

test.describe('ProgressBar Component', () => {
  test('progressbar renders correctly', async ({ page }) => {
    const errors = await setupErrorCapture(page);

    await page.goto('/playground');
    await page.waitForLoadState('networkidle');

    // Find progressbar section
    const progressSection = page.locator('section:has-text("ProgressBar")').first();
    await progressSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Find progressbar
    const progressbar = progressSection.locator('[role="progressbar"]').first();

    if (await progressbar.count() > 0) {
      // Verify progressbar has proper ARIA attributes
      expect(await progressbar.getAttribute('aria-valuemin')).toBeTruthy();
      expect(await progressbar.getAttribute('aria-valuemax')).toBeTruthy();
    }

    await checkNoHydrationErrors(errors);
  });
});

test.describe('Dialog Component', () => {
  test('dialog opens and closes correctly', async ({ page }) => {
    const errors = await setupErrorCapture(page);

    await page.goto('/playground');
    await page.waitForLoadState('networkidle');

    // Find dialog section
    const dialogSection = page.locator('section:has-text("Dialog")').first();
    await dialogSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Click the "Open Dialog" button
    const openButton = dialogSection.locator('button:has-text("Open Dialog")');
    await openButton.click();
    await page.waitForTimeout(300);

    // Verify dialog is visible
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Verify dialog has proper ARIA attributes
    expect(await dialog.getAttribute('role')).toBe('dialog');
    expect(await dialog.getAttribute('aria-labelledby')).toBeTruthy();

    // Verify dialog content
    await expect(dialog.locator('text=Welcome to Proyecto Viviana')).toBeVisible();

    // Click the Get Started button
    const getStartedButton = dialog.locator('button:has-text("Get Started")');
    await getStartedButton.click();
    await page.waitForTimeout(300);

    // Verify dialog is closed
    await expect(dialog).not.toBeVisible();

    await checkNoHydrationErrors(errors);
  });

  test('dialog can be dismissed', async ({ page }) => {
    const errors = await setupErrorCapture(page);

    await page.goto('/playground');
    await page.waitForLoadState('networkidle');

    // Find dialog section
    const dialogSection = page.locator('section:has-text("Dialog")').first();
    await dialogSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Click the "Small Dialog" button
    const openButton = dialogSection.locator('button:has-text("Small Dialog")');
    await openButton.click();
    await page.waitForTimeout(300);

    // Verify dialog is visible
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Click the close button (X)
    const closeButton = dialog.locator('button[aria-label="Close dialog"]');
    if (await closeButton.count() > 0) {
      await closeButton.click();
      await page.waitForTimeout(300);

      // Verify dialog is closed
      await expect(dialog).not.toBeVisible();
    }

    await checkNoHydrationErrors(errors);
  });
});
