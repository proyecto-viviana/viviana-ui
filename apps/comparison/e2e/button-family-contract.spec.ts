import { expect, test, type Locator, type Page } from '@playwright/test';

type Framework = 'React Spectrum stack' | 'Solidaria stack';

async function styledSection(page: Page) {
  const section = page.locator('.layer-block').filter({
    has: page.getByRole('heading', { name: 'Styled Layer' }),
  });
  await expect(section).toHaveCount(1);
  await section.scrollIntoViewIfNeeded();
  return section;
}

async function frameworkCard(section: Locator, framework: Framework) {
  const card = section.locator('.framework-card').filter({ hasText: framework });
  await expect(card).toHaveCount(1);
  return card;
}

async function buttonFamilyCards(page: Page, slug: string) {
  await page.goto(`/components/${slug}/`);
  await page.waitForLoadState('networkidle');
  await expect(page.locator('astro-island')).toHaveCount(0);

  const section = await styledSection(page);
  return {
    react: await frameworkCard(section, 'React Spectrum stack'),
    solid: await frameworkCard(section, 'Solidaria stack'),
  };
}

test.describe('comparison button-family behavior contracts', () => {
  test('Button presses update both reference roots', async ({ page }) => {
    const cards = await buttonFamilyCards(page, 'button');

    for (const card of [cards.react, cards.solid]) {
      const root = card.locator('[data-comparison-action-count]').first();
      await expect(root).toHaveAttribute('data-comparison-action-count', '0');
      await card.getByRole('button', { name: 'Primary' }).click();
      await expect(root).toHaveAttribute('data-comparison-action-count', '1');
    }
  });

  test('ActionButton presses update both reference roots', async ({ page }) => {
    const cards = await buttonFamilyCards(page, 'actionbutton');

    for (const card of [cards.react, cards.solid]) {
      const root = card.locator('[data-comparison-action-count]').first();
      await expect(root).toHaveAttribute('data-comparison-action-count', '0');
      await card.getByRole('button', { name: 'Inspect' }).click();
      await expect(root).toHaveAttribute('data-comparison-action-count', '1');
    }
  });

  test('ActionButtonGroup action callbacks update both stacks', async ({ page }) => {
    const cards = await buttonFamilyCards(page, 'actionbuttongroup');

    for (const card of [cards.react, cards.solid]) {
      const root = card.locator('[data-comparison-selected-keys]').first();
      await expect(root).toHaveAttribute('data-comparison-selected-keys', 'bold');
      await card.getByRole('button', { name: 'Italic' }).click();
      await expect(root).toHaveAttribute('data-comparison-selected-keys', 'italic');
      await expect(root).toHaveAttribute('data-comparison-action-key', 'italic');
    }
  });

  test('ButtonGroup buttons fire grouped actions on both stacks', async ({ page }) => {
    const cards = await buttonFamilyCards(page, 'buttongroup');

    for (const card of [cards.react, cards.solid]) {
      const root = card.locator('[data-comparison-action-key]').first();
      await expect(root).toHaveAttribute('data-comparison-action-key', '');
      await card.getByRole('button', { name: 'Save' }).click();
      await expect(root).toHaveAttribute('data-comparison-action-key', 'save');
      await card.getByRole('button', { name: 'Cancel' }).click();
      await expect(root).toHaveAttribute('data-comparison-action-key', 'cancel');
    }
  });

  test('ToggleButton toggles selected state on both stacks', async ({ page }) => {
    const cards = await buttonFamilyCards(page, 'togglebutton');

    for (const card of [cards.react, cards.solid]) {
      const root = card.locator('[data-comparison-selected]').first();
      await expect(root).toHaveAttribute('data-comparison-selected', 'false');
      await card.getByRole('button', { name: 'Pin' }).click();
      await expect(root).toHaveAttribute('data-comparison-selected', 'true');
      await card.getByRole('button', { name: 'Pin' }).click();
      await expect(root).toHaveAttribute('data-comparison-selected', 'false');
    }
  });
});
