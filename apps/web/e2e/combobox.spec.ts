import { test, expect } from '@playwright/test';

test.describe('Hydration Debug', () => {
  test('homepage loads without hydration error', async ({ page }) => {
    page.on('pageerror', err => {
      console.log(`PAGE ERROR: ${err.message}`);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'e2e-screenshots/homepage.png', fullPage: true });

    const errorMessage = page.locator('text="Something went wrong"');
    const hasError = await errorMessage.count() > 0;
    console.log(`Homepage has error: ${hasError}`);

    expect(hasError).toBe(false);
  });

  test('docs page loads without hydration error', async ({ page }) => {
    page.on('pageerror', err => {
      console.log(`PAGE ERROR: ${err.message}`);
    });

    await page.goto('/docs');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'e2e-screenshots/docs.png', fullPage: true });

    const errorMessage = page.locator('text="Something went wrong"');
    const hasError = await errorMessage.count() > 0;
    console.log(`Docs page has error: ${hasError}`);

    expect(hasError).toBe(false);
  });

  test('playground page loads without hydration error', async ({ page }) => {
    page.on('pageerror', err => {
      console.log(`PAGE ERROR: ${err.message}`);
    });

    await page.goto('/playground');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'e2e-screenshots/playground.png', fullPage: true });

    const errorMessage = page.locator('text="Something went wrong"');
    const hasError = await errorMessage.count() > 0;

    if (hasError) {
      console.log('Playground has hydration error!');
      const errorDetail = await page.locator('text="template2 is not a function"').count();
      console.log(`Has template2 error: ${errorDetail > 0}`);
    }

    expect(hasError).toBe(false);
  });

  test('clicking option should select it and show value in input', async ({ page }) => {
    // Enable console logging
    page.on('console', msg => {
      console.log(`BROWSER: ${msg.type()}: ${msg.text()}`);
    });

    await page.goto('/playground');
    await page.waitForLoadState('networkidle');

    // First, scroll to the bottom of the page where ComboBox is
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Take a full page screenshot to debug
    await page.screenshot({ path: 'e2e-screenshots/full-page.png', fullPage: true });

    // Find the label "Select a food" directly
    const comboboxLabel = page.locator('text="Select a food"').first();
    await comboboxLabel.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    console.log(`Label visible: ${await comboboxLabel.isVisible()}`);

    // Take screenshot of the combobox area
    await page.screenshot({ path: 'e2e-screenshots/combobox-section.png' });

    // The combobox wrapper is the parent div of the label
    const comboboxWrapper = comboboxLabel.locator('xpath=..');

    // Find input and button within the wrapper
    const input = comboboxWrapper.locator('input');
    const button = comboboxWrapper.locator('button');

    const inputCount = await input.count();
    const buttonCount = await button.count();
    console.log(`Input count: ${inputCount}`);
    console.log(`Button count: ${buttonCount}`);

    if (inputCount === 0 || buttonCount === 0) {
      // Debug: let's see what's in the page
      const allInputs = await page.locator('input').count();
      const allButtons = await page.locator('button').count();
      console.log(`Total inputs on page: ${allInputs}`);
      console.log(`Total buttons on page: ${allButtons}`);

      // Try a different approach: find input with placeholder "Type to filter..."
      const placeholderInput = page.locator('input[placeholder*="filter"]').first();
      const placeholderCount = await placeholderInput.count();
      console.log(`Inputs with filter placeholder: ${placeholderCount}`);

      if (placeholderCount > 0) {
        // Use this input
        const filterWrapper = placeholderInput.locator('xpath=../..'); // Go up 2 levels
        const filterButton = filterWrapper.locator('button');
        console.log(`Filter button count: ${await filterButton.count()}`);
      }
    }

    // Get initial input value
    const initialValue = await input.inputValue().catch(() => '');
    console.log(`Initial input value: "${initialValue}"`);

    // Click the button to open the dropdown
    console.log('Clicking button to open dropdown...');
    await button.click();
    await page.waitForTimeout(500);

    // Take screenshot after opening
    await page.screenshot({ path: 'e2e-screenshots/after-button-click.png' });

    // Find the listbox (should appear after clicking)
    const listbox = page.locator('ul[role="listbox"]');
    const listboxCount = await listbox.count();
    console.log(`Listbox count: ${listboxCount}`);

    if (listboxCount > 0) {
      const isVisible = await listbox.first().isVisible();
      console.log(`Listbox visible: ${isVisible}`);
    }

    // Find options
    const options = page.locator('ul[role="listbox"] li[role="option"]');
    const optionCount = await options.count();
    console.log(`Option count: ${optionCount}`);

    if (optionCount > 0) {
      // Log all options
      for (let i = 0; i < Math.min(optionCount, 5); i++) {
        const text = await options.nth(i).textContent();
        console.log(`Option ${i}: "${text}"`);
      }

      // Click the first option (Apple)
      console.log('Clicking first option (Apple)...');
      await options.first().click();
      await page.waitForTimeout(500);

      // Take screenshot after clicking option
      await page.screenshot({ path: 'e2e-screenshots/after-option-click.png' });

      // Check input value
      const finalValue = await input.inputValue();
      console.log(`Final input value: "${finalValue}"`);

      // Check if listbox is closed
      const listboxStillVisible = await page.locator('ul[role="listbox"]').isVisible().catch(() => false);
      console.log(`Listbox still visible: ${listboxStillVisible}`);

      // The input should now have "Apple" as its value
      expect(finalValue).toBe('Apple');
      expect(listboxStillVisible).toBe(false);
    } else {
      // If no options found, the test should fail
      expect(optionCount).toBeGreaterThan(0);
    }
  });
});
