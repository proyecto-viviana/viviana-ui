import { test, expect, type Page } from '@playwright/test';

const CALENDAR_SECTION = 'section[data-testid="section-calendar"]';
const RANGE_CALENDAR_SECTION = 'section[data-testid="section-rangecalendar"]';

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

async function waitForPageReady(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
  await expect(page.getByTestId('show-all-sections')).toBeVisible();
}

function getVisibleCountText(page: Page) {
  return page
    .locator('p')
    .filter({ hasText: /\d+\s+of\s+\d+\s+visible/ })
    .first();
}

async function getVisibleAndTotalCount(page: Page) {
  const text = (await getVisibleCountText(page).textContent()) ?? '';
  const match = text.match(/(\d+)\s+of\s+(\d+)\s+visible/);
  if (!match) return null;
  return {
    visible: Number(match[1]),
    total: Number(match[2]),
  };
}

async function expectVisibleCount(page: Page, expected: number) {
  await expect
    .poll(async () => {
      const counts = await getVisibleAndTotalCount(page);
      return counts ? counts.visible : -1;
    }, { timeout: 15_000 })
    .toBe(expected);
}

async function toggleSection(page: Page, id: string) {
  const toggle = page.getByTestId(`section-toggle-${id}`);
  await expect(toggle).toBeVisible();
  await toggle.click();
}

async function checkNoRuntimeErrors(errors: string[]) {
  const filtered = errors.filter((e) =>
    !/favicon|Failed to load resource/.test(e),
  );
  expect(filtered).toEqual([]);
}

test.describe('Playground Calendar Regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/playground');
    await waitForPageReady(page);
  });

  test('calendar toggle renders calendar section and grid cells', async ({ page }) => {
    const errors = await setupErrorCapture(page);

    await expectVisibleCount(page, 0);
    await toggleSection(page, 'calendar');

    await expectVisibleCount(page, 1);
    const calendarSection = page.locator(CALENDAR_SECTION);
    await expect(calendarSection).toBeVisible();
    await expect(calendarSection.getByRole('heading', { name: 'Calendar' })).toBeVisible();

    await expect
      .poll(() => calendarSection.getByRole('gridcell').count(), { timeout: 15_000 })
      .toBeGreaterThan(20);

    await checkNoRuntimeErrors(errors);
  });

  test('calendar section chip is idempotent and hide-all clears rendered sections', async ({ page }) => {
    const errors = await setupErrorCapture(page);

    await expectVisibleCount(page, 0);
    await toggleSection(page, 'calendar');
    await expectVisibleCount(page, 1);
    await expect(page.locator(CALENDAR_SECTION)).toBeVisible();

    // Section control chips are "show/jump" actions, not true on/off toggles.
    await toggleSection(page, 'calendar');
    await expectVisibleCount(page, 1);
    await expect(page.locator(CALENDAR_SECTION)).toBeVisible();

    await page.getByTestId('hide-all-sections').click();
    await expectVisibleCount(page, 0);
    await expect(page.locator(CALENDAR_SECTION)).toHaveCount(0);

    await checkNoRuntimeErrors(errors);
  });

  test('show all surfaces both calendar and range calendar sections', async ({ page }) => {
    const errors = await setupErrorCapture(page);

    await expectVisibleCount(page, 0);
    await page.getByTestId('show-all-sections').click();

    await expect
      .poll(async () => {
        const counts = await getVisibleAndTotalCount(page);
        return counts ? counts.visible - counts.total : -1;
      }, { timeout: 20_000 })
      .toBe(0);
    await expect
      .poll(async () => {
        const counts = await getVisibleAndTotalCount(page);
        return counts ? counts.total : -1;
      }, { timeout: 20_000 })
      .toBeGreaterThan(50);

    const calendarSection = page.locator(CALENDAR_SECTION);
    const rangeCalendarSection = page.locator(RANGE_CALENDAR_SECTION);

    await expect(calendarSection).toBeVisible({ timeout: 30_000 });
    await expect(rangeCalendarSection).toBeVisible({ timeout: 30_000 });

    await expect
      .poll(() => calendarSection.getByRole('gridcell').count(), { timeout: 30_000 })
      .toBeGreaterThan(20);
    await expect
      .poll(() => rangeCalendarSection.getByRole('gridcell').count(), { timeout: 30_000 })
      .toBeGreaterThan(20);

    await checkNoRuntimeErrors(errors);
  });
});
