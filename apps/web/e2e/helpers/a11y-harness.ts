/**
 * Playwright a11y harness (INFRA-2)
 *
 * Reusable helpers for running accessibility checks on playground sections:
 * - Scoped axe-core scans
 * - ARIA ID integrity checks (page-side)
 * - Section visibility management
 */

import { type Page, type Locator, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Ensure a playground section is visible, toggling it on if necessary.
 * Reuses the pattern from playground-components.spec.ts.
 */
export async function ensureSectionVisible(page: Page, sectionId: string): Promise<Locator> {
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

export interface AxeScanResult {
  violations: Array<{
    id: string;
    help: string;
    impact: string | null;
    nodes: Array<{ target: string[]; html: string; failureSummary?: string }>;
  }>;
  passes: number;
}

/**
 * Run a scoped axe-core scan on a section.
 */
export async function scanSectionAxe(
  page: Page,
  section: Locator,
  options: { tags?: string[] } = {},
): Promise<AxeScanResult> {
  const tags = options.tags ?? ["wcag2a", "wcag2aa"];
  const testId = await section.getAttribute("data-testid");
  const selector = testId ? `section[data-testid="${testId}"]` : "section";

  const results = await new AxeBuilder({ page }).include(selector).withTags(tags).analyze();

  return {
    violations: results.violations.map((v) => ({
      id: v.id,
      help: v.help,
      impact: v.impact,
      nodes: v.nodes.map((n) => ({
        target: n.target as string[],
        html: n.html,
        failureSummary: n.failureSummary,
      })),
    })),
    passes: results.passes.length,
  };
}

export interface AriaIdCheckResult {
  danglingRefs: Array<{ attribute: string; missingId: string; elementDesc: string }>;
  totalRefsChecked: number;
  ok: boolean;
}

/**
 * Check ARIA ID integrity within a section via page.evaluate().
 */
export async function checkSectionAriaIds(
  page: Page,
  section: Locator,
): Promise<AriaIdCheckResult> {
  const testId = await section.getAttribute("data-testid");
  const selector = testId ? `section[data-testid="${testId}"]` : "section";

  return page.evaluate((sel) => {
    const container = document.querySelector(sel);
    if (!container) return { danglingRefs: [], totalRefsChecked: 0, ok: true };

    const ATTRS = [
      "aria-labelledby",
      "aria-controls",
      "aria-describedby",
      "aria-owns",
      "aria-activedescendant",
      "aria-errormessage",
      "for",
    ];

    const danglingRefs: Array<{ attribute: string; missingId: string; elementDesc: string }> = [];
    let totalRefsChecked = 0;

    for (const attr of ATTRS) {
      for (const el of container.querySelectorAll(`[${attr}]`)) {
        const value = el.getAttribute(attr);
        if (!value) continue;

        const ids = attr === "aria-activedescendant" ? [value] : value.split(/\s+/).filter(Boolean);
        for (const id of ids) {
          totalRefsChecked++;
          if (!document.getElementById(id)) {
            const tag = el.tagName.toLowerCase();
            const elId = el.id ? `#${el.id}` : "";
            const role = el.getAttribute("role") || "";
            danglingRefs.push({
              attribute: attr,
              missingId: id,
              elementDesc: `${tag}${elId}${role ? `[role="${role}"]` : ""}`,
            });
          }
        }
      }
    }

    return { danglingRefs, totalRefsChecked, ok: danglingRefs.length === 0 };
  }, selector);
}

export interface A11yHarnessResult {
  axe: AxeScanResult;
  ariaIds: AriaIdCheckResult;
  keyboard?: unknown;
}

/**
 * Run the full a11y harness on a playground section:
 * 1. Ensure section is visible
 * 2. Scoped axe scan
 * 3. ARIA ID integrity check
 * 4. Optional keyboard test
 */
export async function runA11yHarness(
  page: Page,
  sectionId: string,
  options: {
    axeTags?: string[];
    keyboardTest?: (section: Locator) => Promise<unknown>;
  } = {},
): Promise<A11yHarnessResult> {
  const section = await ensureSectionVisible(page, sectionId);

  const axe = await scanSectionAxe(page, section, { tags: options.axeTags });
  const ariaIds = await checkSectionAriaIds(page, section);

  let keyboard: unknown;
  if (options.keyboardTest) {
    keyboard = await options.keyboardTest(section);
  }

  return { axe, ariaIds, keyboard };
}
