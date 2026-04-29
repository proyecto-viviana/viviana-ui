import { expect, test, type Locator, type Page } from '@playwright/test';
import {
  comparisonContractVersion,
  getComparisonReferenceKind,
} from '../src/data/comparison-contract';
import {
  comparisonEntries,
  type ComparisonEntry,
  type ComparisonLayerId,
} from '../src/data/comparison-manifest';

async function frameworkCard(
  section: Locator,
  framework: 'React Spectrum stack' | 'Solidaria stack',
) {
  const card = section.locator('.framework-card').filter({ hasText: framework });
  await expect(card).toHaveCount(1);
  return card;
}

async function styledSection(page: Page) {
  const section = page.locator('.layer-block').filter({
    has: page.getByRole('heading', { name: 'Styled Layer' }),
  });
  await expect(section).toHaveCount(1);
  return section;
}

function liveOnBothSides(entry: ComparisonEntry, layer: ComparisonLayerId) {
  return entry.layers[layer].react === 'live' && entry.layers[layer].solid === 'live';
}

const liveStyledEntries = comparisonEntries.filter((entry) =>
  liveOnBothSides(entry, 'styled'),
);

test.describe('comparison styled reference contract', () => {
  for (const entry of liveStyledEntries) {
    test(`${entry.title} declares stable reference frames`, async ({ page }) => {
      await page.goto(`/components/${entry.slug}/`);
      await page.waitForLoadState('networkidle');

      const section = await styledSection(page);
      const reactCard = await frameworkCard(section, 'React Spectrum stack');
      const solidCard = await frameworkCard(section, 'Solidaria stack');

      const reactFrame = reactCard.locator('.comparison-reference-frame');
      const solidFrame = solidCard.locator('.comparison-reference-frame');
      await expect(reactFrame).toHaveCount(1);
      await expect(solidFrame).toHaveCount(1);

      await expect(reactFrame).toHaveAttribute('data-comparison-contract', comparisonContractVersion);
      await expect(solidFrame).toHaveAttribute('data-comparison-contract', comparisonContractVersion);
      await expect(reactFrame).toHaveAttribute('data-comparison-component', entry.slug);
      await expect(solidFrame).toHaveAttribute('data-comparison-component', entry.slug);
      await expect(reactFrame).toHaveAttribute('data-comparison-layer', 'styled');
      await expect(solidFrame).toHaveAttribute('data-comparison-layer', 'styled');
      await expect(reactFrame).toHaveAttribute('data-comparison-framework', 'react');
      await expect(solidFrame).toHaveAttribute('data-comparison-framework', 'solid');
      await expect(reactFrame).toHaveAttribute(
        'data-comparison-reference',
        getComparisonReferenceKind('react', 'styled', entry.slug),
      );
      await expect(solidFrame).toHaveAttribute(
        'data-comparison-reference',
        getComparisonReferenceKind('solid', 'styled', entry.slug),
      );

      await expect(reactFrame.locator('.comparison-reference-canvas')).toBeVisible();
      await expect(solidFrame.locator('.comparison-reference-canvas')).toBeVisible();
    });
  }
});
