/**
 * Calendar Debug E2E Tests
 *
 * Deep dive into Calendar component rendering issues.
 * Captures console logs to trace the source of stack overflow.
 */

import { test, expect, type Page } from '@playwright/test';

// Store console logs
interface LogEntry {
  type: string;
  text: string;
  timestamp: number;
}

async function setupConsoleCapture(page: Page): Promise<LogEntry[]> {
  const logs: LogEntry[] = [];

  page.on('console', (msg) => {
    logs.push({
      type: msg.type(),
      text: msg.text(),
      timestamp: Date.now(),
    });
  });

  page.on('pageerror', (error) => {
    logs.push({
      type: 'pageerror',
      text: error.message,
      timestamp: Date.now(),
    });
  });

  return logs;
}

function filterCalendarLogs(logs: LogEntry[]): LogEntry[] {
  return logs.filter(log =>
    log.text.includes('Calendar') ||
    log.text.includes('calendar') ||
    log.text.includes('INFINITE') ||
    log.text.includes('LOOP') ||
    log.text.includes('EXCESSIVE') ||
    log.type === 'pageerror'
  );
}

function printLogs(logs: LogEntry[], label: string) {
  console.log(`\n=== ${label} (${logs.length} entries) ===`);
  logs.forEach((log, i) => {
    console.log(`[${i}] [${log.type}] ${log.text}`);
  });
  console.log(`=== END ${label} ===\n`);
}

async function waitForPageReady(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);
}

async function enableSection(page: Page, sectionId: string) {
  const toggleLabel = page.locator(`[data-testid="section-toggle-${sectionId}"]`);
  await expect(toggleLabel).toBeVisible({ timeout: 5000 });

  const checkbox = toggleLabel.locator('input[type="checkbox"]');
  const isChecked = await checkbox.isChecked();
  if (!isChecked) {
    await checkbox.click({ force: true });
  }

  // Wait for section to appear
  await page.waitForTimeout(2000);
}

test.describe('Calendar Debug', () => {
  test('trace calendar rendering with console logs', async ({ page }) => {
    test.setTimeout(120000); // 2 minutes for debugging

    const logs = await setupConsoleCapture(page);

    console.log('\n=== Starting Calendar Debug Test ===\n');

    // Navigate to playground
    await page.goto('/playground');
    await waitForPageReady(page);

    console.log('Page loaded, enabling calendar section...');

    // Check initial logs
    const initialLogs = filterCalendarLogs(logs);
    printLogs(initialLogs, 'INITIAL LOGS (before calendar section)');

    // Enable calendar section
    try {
      await enableSection(page, 'calendar');
      console.log('Calendar section enabled');
    } catch (error) {
      console.log('Error enabling calendar section:', error);
      const errorLogs = filterCalendarLogs(logs);
      printLogs(errorLogs, 'ERROR LOGS');
      throw error;
    }

    // Wait for any async rendering
    await page.waitForTimeout(3000);

    // Get all calendar-related logs
    const calendarLogs = filterCalendarLogs(logs);
    printLogs(calendarLogs, 'CALENDAR LOGS');

    // Check for infinite loop indicators
    const infiniteLoopLogs = logs.filter(log =>
      log.text.includes('INFINITE') ||
      log.text.includes('LOOP') ||
      log.text.includes('EXCESSIVE')
    );

    if (infiniteLoopLogs.length > 0) {
      printLogs(infiniteLoopLogs, 'INFINITE LOOP DETECTED');
    }

    // Check for page errors
    const pageErrors = logs.filter(log => log.type === 'pageerror');
    if (pageErrors.length > 0) {
      printLogs(pageErrors, 'PAGE ERRORS');
    }

    // Take screenshot for visual inspection
    await page.screenshot({
      path: 'e2e-screenshots/calendar-debug.png',
      fullPage: true
    });

    // Try to find the calendar component
    const calendarSection = page.locator('[data-testid="section-calendar"]');
    const isVisible = await calendarSection.isVisible().catch(() => false);
    console.log(`Calendar section visible: ${isVisible}`);

    if (isVisible) {
      // Try to find calendar grid
      const grid = calendarSection.locator('table[role="grid"]').first();
      const gridVisible = await grid.isVisible({ timeout: 5000 }).catch(() => false);
      console.log(`Calendar grid visible: ${gridVisible}`);

      if (gridVisible) {
        const cells = await grid.locator('td[role="gridcell"]').count();
        console.log(`Calendar cells count: ${cells}`);
      }
    }

    // Assert no infinite loop errors
    expect(infiniteLoopLogs.length).toBe(0);
    expect(pageErrors.length).toBe(0);
  });

  test('calendar state creation trace', async ({ page }) => {
    test.setTimeout(60000);

    const logs = await setupConsoleCapture(page);

    await page.goto('/playground');
    await waitForPageReady(page);

    // Enable calendar section
    await enableSection(page, 'calendar');
    await page.waitForTimeout(5000);

    // Filter for CalendarState logs specifically
    const stateLogs = logs.filter(log => log.text.includes('CalendarState'));
    printLogs(stateLogs, 'CALENDAR STATE LOGS');

    // Count state instances
    const instanceCreations = stateLogs.filter(log =>
      log.text.includes('Creating new CalendarState instance')
    );
    console.log(`CalendarState instances created: ${instanceCreations.length}`);

    // Check for excessive memo calls
    const memoLogs = stateLogs.filter(log =>
      log.text.includes('memo called')
    );

    if (memoLogs.length > 50) {
      console.log(`WARNING: Excessive memo calls (${memoLogs.length})`);
      printLogs(memoLogs.slice(-20), 'LAST 20 MEMO CALLS');
    }

    expect(instanceCreations.length).toBeLessThan(10);
  });

  test('calendar component hierarchy trace', async ({ page }) => {
    test.setTimeout(60000);

    const logs = await setupConsoleCapture(page);

    await page.goto('/playground');
    await waitForPageReady(page);

    await enableSection(page, 'calendar');
    await page.waitForTimeout(5000);

    // Group logs by component
    const componentLogs: Record<string, LogEntry[]> = {
      'Calendar': [],
      'CalendarInner': [],
      'CalendarGrid': [],
      'CalendarCell': [],
      'createCalendar': [],
      'CalendarState': [],
    };

    logs.forEach(log => {
      for (const component of Object.keys(componentLogs)) {
        if (log.text.includes(component)) {
          componentLogs[component].push(log);
        }
      }
    });

    console.log('\n=== COMPONENT LOG COUNTS ===');
    for (const [component, entries] of Object.entries(componentLogs)) {
      console.log(`${component}: ${entries.length} logs`);
    }

    // Print first few logs from each component
    for (const [component, entries] of Object.entries(componentLogs)) {
      if (entries.length > 0) {
        printLogs(entries.slice(0, 5), `${component} (first 5)`);
      }
    }

    // Check cell render count
    const cellLogs = componentLogs['CalendarCell'];
    const cellRenders = cellLogs.filter(log => log.text.includes('Rendering cell'));
    console.log(`\nCalendarCell renders: ${cellRenders.length}`);

    // Should have around 35-42 cells for a month
    expect(cellRenders.length).toBeLessThan(100);
  });

  test('minimal calendar without ui wrapper', async ({ page }) => {
    test.setTimeout(60000);

    const logs = await setupConsoleCapture(page);

    // Create a minimal test page with just the headless Calendar
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Minimal Calendar Test</title>
          <script type="module">
            import { Calendar, CalendarGrid, CalendarCell, CalendarHeading, CalendarButton } from '@proyecto-viviana/solidaria-components';
            import { render } from 'solid-js/web';

            function MinimalCalendar() {
              console.log('[MinimalCalendar] Rendering');
              return Calendar({
                'aria-label': 'Test calendar',
                children: [
                  CalendarHeading({}),
                  CalendarGrid({
                    children: (date) => CalendarCell({ date })
                  })
                ]
              });
            }

            render(MinimalCalendar, document.getElementById('root'));
          </script>
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>
    `);

    await page.waitForTimeout(5000);

    const calendarLogs = filterCalendarLogs(logs);
    printLogs(calendarLogs, 'MINIMAL CALENDAR LOGS');

    const pageErrors = logs.filter(log => log.type === 'pageerror');
    printLogs(pageErrors, 'PAGE ERRORS');
  });
});
