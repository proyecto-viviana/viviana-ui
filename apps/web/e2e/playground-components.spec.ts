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

  test('styled tabs arrow keys move focus to the next tab', async ({ page }) => {
    const errors = await setupErrorCapture(page);
    const section = await ensureSectionVisible(page, 'styled-tabs');

    const tablist = section.locator('[role="tablist"]').first();
    await expect(tablist).toBeVisible();

    const tabs = tablist.locator('[role="tab"]');
    const firstTab = tabs.first();
    const secondTab = tabs.nth(1);

    await firstTab.focus();
    await page.keyboard.press('ArrowRight');

    await expect(secondTab).toBeFocused();
    await expect(secondTab).toHaveAttribute('aria-selected', 'true');

    await checkNoHydrationErrors(errors);
  });

  test('styled breadcrumbs expose current item semantics', async ({ page }) => {
    const errors = await setupErrorCapture(page);
    const section = await ensureSectionVisible(page, 'styled-breadcrumbs');

    const nav = section.getByRole('navigation', { name: /default breadcrumbs demo/i }).first();
    await expect(nav).toBeVisible();

    const currentItem = nav.locator('[aria-current="page"]').first();
    await expect(currentItem).toBeVisible();

    const beforeUrl = page.url();
    const products = nav.getByRole('link', { name: 'Products' }).first();
    await products.click();

    await expect(nav.locator('[aria-current="page"]').first()).toBeVisible();
    expect(page.url()).toBe(beforeUrl);

    await checkNoHydrationErrors(errors);
  });

  test('taggroup section exposes labeled listbox keyboard navigation', async ({ page }) => {
    const errors = await setupErrorCapture(page);
    const section = await ensureSectionVisible(page, 'taggroup');

    const listbox = section.getByRole('listbox', { name: 'Languages' }).first();
    await expect(listbox).toBeVisible();

    const options = listbox.locator('[role="option"]');
    await expect(options.first()).toBeVisible();
    expect(await options.count()).toBeGreaterThan(1);

    const first = options.first();
    const second = options.nth(1);

    await first.focus();
    await page.keyboard.press('ArrowRight');
    await expect(second).toBeFocused();

    await page.keyboard.press('Home');
    await expect(first).toBeFocused();

    await checkNoHydrationErrors(errors);
  });

  test('actiongroup section exposes role + keyboard behavior', async ({ page }) => {
    const errors = await setupErrorCapture(page);
    const section = await ensureSectionVisible(page, 'actiongroup');

    const group = section.getByRole('radiogroup', { name: 'Editor actions' }).first();
    await expect(group).toBeVisible();

    const cut = group.getByRole('radio', { name: 'Cut' }).first();
    const copy = group.getByRole('radio', { name: 'Copy' }).first();

    await cut.focus();
    await page.keyboard.press('ArrowRight');
    await expect(copy).toBeFocused();

    await checkNoHydrationErrors(errors);
  });

  test('toolbar section keeps arrow/Home/End navigation working', async ({ page }) => {
    const errors = await setupErrorCapture(page);
    const section = await ensureSectionVisible(page, 'toolbar');

    const toolbar = section.getByRole('toolbar', { name: 'Text formatting toolbar' }).first();
    await expect(toolbar).toBeVisible();

    const bold = toolbar.getByRole('button', { name: 'Bold' }).first();
    const italic = toolbar.getByRole('button', { name: 'Italic' }).first();
    const underline = toolbar.getByRole('button', { name: 'Underline' }).first();

    await bold.focus();
    await page.keyboard.press('ArrowRight');
    await expect(italic).toBeFocused();

    await page.keyboard.press('End');
    await expect(underline).toBeFocused();

    await page.keyboard.press('Home');
    await expect(bold).toBeFocused();

    await checkNoHydrationErrors(errors);
  });

  test('actionbar section supports keyboard navigation and escape clear', async ({ page }) => {
    const errors = await setupErrorCapture(page);
    const section = await ensureSectionVisible(page, 'actionbar');

    const toolbar = section.getByRole('toolbar', { name: 'Bulk actions toolbar' }).first();
    await expect(toolbar).toBeVisible();

    const clear = toolbar.getByRole('button', { name: 'Clear selection' }).first();
    const archive = toolbar.getByRole('button', { name: 'Archive' }).first();
    const del = toolbar.getByRole('button', { name: 'Delete' }).first();

    await archive.focus();
    await page.keyboard.press('ArrowRight');
    await expect(del).toBeFocused();

    await page.keyboard.press('Home');
    await expect(clear).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(section.getByRole('toolbar', { name: 'Bulk actions toolbar' })).toHaveCount(0);

    await section.getByRole('button', { name: '+1 selected' }).click();
    await expect(section.getByRole('toolbar', { name: 'Bulk actions toolbar' }).first()).toBeVisible();

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

  test('disclosure section supports keyboard toggle on headless disclosure', async ({ page }) => {
    const errors = await setupErrorCapture(page);
    const section = await ensureSectionVisible(page, 'disclosure');

    const trigger = section.getByRole('button', { name: 'Headless Toggle' }).first();
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await checkNoHydrationErrors(errors);
  });

  test('disclosure accordion section keeps single-expand behavior', async ({ page }) => {
    const errors = await setupErrorCapture(page);
    const section = await ensureSectionVisible(page, 'disclosure');

    const section1 = section.getByRole('button', { name: 'Section 1: Introduction' }).first();
    const section2 = section.getByRole('button', { name: 'Section 2: Features' }).first();

    await section1.click();
    await expect(section1).toHaveAttribute('aria-expanded', 'true');

    await section2.click();
    await expect(section2).toHaveAttribute('aria-expanded', 'true');
    await expect(section1).toHaveAttribute('aria-expanded', 'false');

    await checkNoHydrationErrors(errors);
  });

  test('tooltip section opens with role=tooltip and stays open on non-press keys', async ({ page }) => {
    const errors = await setupErrorCapture(page);
    const section = await ensureSectionVisible(page, 'tooltip');

    const trigger = section.getByRole('button', { name: 'Delayed tooltip' }).first();
    await expect(trigger).toBeVisible();
    await trigger.hover();

    const tooltip = page.locator('[role="tooltip"]', { hasText: 'This tooltip has a 500ms delay' }).first();
    await expect(tooltip).toBeVisible();

    await trigger.focus();
    await page.keyboard.press('ArrowRight');
    await expect(tooltip).toBeVisible();

    await checkNoHydrationErrors(errors);
  });

  test('tooltip section closes on Escape', async ({ page }) => {
    const errors = await setupErrorCapture(page);
    const section = await ensureSectionVisible(page, 'tooltip');

    const trigger = section.getByRole('button', { name: 'Delayed tooltip' }).first();
    await expect(trigger).toBeVisible();
    await trigger.hover();

    const tooltip = page.locator('[role="tooltip"]', { hasText: 'This tooltip has a 500ms delay' }).first();
    await expect(tooltip).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('[role="tooltip"]', { hasText: 'This tooltip has a 500ms delay' })).toHaveCount(0);

    await checkNoHydrationErrors(errors);
  });

  test('popover section opens with dialog semantics and closes on Escape', async ({ page }) => {
    const errors = await setupErrorCapture(page);
    const section = await ensureSectionVisible(page, 'popover');

    const trigger = section.getByTestId('popover-bottom-trigger').first();
    await expect(trigger).toBeVisible();
    await trigger.click();

    const popover = page.getByTestId('popover-bottom').first();
    await expect(popover).toBeVisible();
    await expect(popover).toHaveAttribute('role', 'dialog');
    await expect(popover.getByRole('heading', { name: 'Bottom Popover' })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByTestId('popover-bottom')).toHaveCount(0);

    await checkNoHydrationErrors(errors);
  });

  test('popover section closes on outside interaction', async ({ page }) => {
    const errors = await setupErrorCapture(page);
    const section = await ensureSectionVisible(page, 'popover');

    const trigger = section.getByTestId('popover-actions-trigger').first();
    await expect(trigger).toBeVisible();
    await trigger.click();

    const popover = page.getByTestId('popover-actions').first();
    await expect(popover).toBeVisible();

    await page.locator('body').click({ position: { x: 1, y: 1 } });
    await expect(page.getByTestId('popover-actions')).toHaveCount(0);

    await checkNoHydrationErrors(errors);
  });

  test('dialog section opens with modal semantics and closes on Escape', async ({ page }) => {
    const errors = await setupErrorCapture(page);
    const section = await ensureSectionVisible(page, 'dialog');

    await section.getByRole('button', { name: 'Open Dialog' }).first().click();
    const dialog = page.getByRole('dialog').first();
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'Welcome!' }).first()).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);

    await checkNoHydrationErrors(errors);
  });

  test('alertdialog section exposes alertdialog role and action buttons', async ({ page }) => {
    const errors = await setupErrorCapture(page);
    const section = await ensureSectionVisible(page, 'alertdialog');

    await section.getByRole('button', { name: 'Delete Item' }).first().click();
    const alertDialog = page.getByRole('alertdialog').first();
    await expect(alertDialog).toBeVisible();
    await expect(alertDialog.getByRole('heading', { name: 'Delete Item' })).toBeVisible();
    await expect(alertDialog.getByRole('button', { name: 'Delete' })).toBeVisible();
    await expect(alertDialog.getByRole('button', { name: 'Cancel' })).toBeVisible();

    await alertDialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('alertdialog')).toHaveCount(0);

    await checkNoHydrationErrors(errors);
  });
});
