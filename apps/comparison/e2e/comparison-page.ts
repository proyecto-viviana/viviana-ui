import { expect, type Locator, type Page } from '@playwright/test';

export type FrameworkName = 'React Spectrum stack' | 'Solidaria stack';

export async function styledSection(page: Page) {
  const section = page.locator('.layer-block').filter({
    has: page.getByRole('heading', { name: 'Styled Layer' }),
  });
  await expect(section).toHaveCount(1);
  await section.scrollIntoViewIfNeeded();
  return section;
}

export async function frameworkCanvas(
  section: Locator,
  framework: FrameworkName,
) {
  const card = section.locator('.framework-card').filter({ hasText: framework });
  await expect(card).toHaveCount(1);
  const canvas = card.locator('.comparison-reference-canvas');
  await expect(canvas).toBeVisible();
  return canvas;
}
