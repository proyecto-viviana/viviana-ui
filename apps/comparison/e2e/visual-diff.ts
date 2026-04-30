import { expect, type Locator, type Page } from '@playwright/test';

export type ScreenshotDiffResult = {
  reactWidth: number;
  reactHeight: number;
  solidWidth: number;
  solidHeight: number;
  comparedWidth: number;
  comparedHeight: number;
  widthDelta: number;
  heightDelta: number;
  mismatchedPixels: number;
  totalPixels: number;
  mismatchRatio: number;
  maxChannelDelta: number;
  pixelThreshold: number;
};

export type ScreenshotDiffThreshold = {
  maxMismatchRatio: number;
  maxDimensionDelta: number;
  pixelThreshold?: number;
};

export async function diffScreenshots(
  page: Page,
  reactPng: Buffer,
  solidPng: Buffer,
  pixelThreshold: number = 0,
): Promise<ScreenshotDiffResult> {
  return page.evaluate(
    async ({ reactBase64, solidBase64, pixelThreshold }) => {
      async function loadImage(base64: string) {
        const response = await fetch(`data:image/png;base64,${base64}`);
        return createImageBitmap(await response.blob());
      }

      const [reactImage, solidImage] = await Promise.all([
        loadImage(reactBase64),
        loadImage(solidBase64),
      ]);

      const comparedWidth = Math.min(reactImage.width, solidImage.width);
      const comparedHeight = Math.min(reactImage.height, solidImage.height);
      const canvas = document.createElement('canvas');
      canvas.width = comparedWidth * 2;
      canvas.height = comparedHeight;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) {
        throw new Error('Could not create canvas context for screenshot comparison');
      }

      context.drawImage(reactImage, 0, 0, comparedWidth, comparedHeight);
      context.drawImage(solidImage, comparedWidth, 0, comparedWidth, comparedHeight);

      const reactPixels = context.getImageData(0, 0, comparedWidth, comparedHeight).data;
      const solidPixels = context.getImageData(comparedWidth, 0, comparedWidth, comparedHeight).data;
      let mismatchedPixels = 0;
      let maxChannelDelta = 0;

      for (let i = 0; i < reactPixels.length; i += 4) {
        const r = Math.abs(reactPixels[i] - solidPixels[i]);
        const g = Math.abs(reactPixels[i + 1] - solidPixels[i + 1]);
        const b = Math.abs(reactPixels[i + 2] - solidPixels[i + 2]);
        const a = Math.abs(reactPixels[i + 3] - solidPixels[i + 3]);
        const delta = Math.max(r, g, b, a);
        maxChannelDelta = Math.max(maxChannelDelta, delta);

        if (delta > pixelThreshold) {
          mismatchedPixels += 1;
        }
      }

      const totalPixels = comparedWidth * comparedHeight;

      return {
        reactWidth: reactImage.width,
        reactHeight: reactImage.height,
        solidWidth: solidImage.width,
        solidHeight: solidImage.height,
        comparedWidth,
        comparedHeight,
        widthDelta: Math.abs(reactImage.width - solidImage.width),
        heightDelta: Math.abs(reactImage.height - solidImage.height),
        mismatchedPixels,
        totalPixels,
        mismatchRatio: totalPixels === 0 ? 1 : mismatchedPixels / totalPixels,
        maxChannelDelta,
        pixelThreshold,
      };
    },
    {
      reactBase64: reactPng.toString('base64'),
      solidBase64: solidPng.toString('base64'),
      pixelThreshold,
    },
  );
}

export async function compareScreenshots(
  page: Page,
  reactPng: Buffer,
  solidPng: Buffer,
  label: string,
  threshold: ScreenshotDiffThreshold,
) {
  const result = await diffScreenshots(
    page,
    reactPng,
    solidPng,
    threshold.pixelThreshold,
  );

  expect(result.widthDelta, `${label} width delta`).toBeLessThanOrEqual(
    threshold.maxDimensionDelta,
  );
  expect(result.heightDelta, `${label} height delta`).toBeLessThanOrEqual(
    threshold.maxDimensionDelta,
  );
  expect(
    result.mismatchRatio,
    `${label} screenshot mismatch ratio ${result.mismatchRatio} exceeded ${threshold.maxMismatchRatio}`,
  ).toBeLessThanOrEqual(threshold.maxMismatchRatio);

  return result;
}

export async function compareLocatorScreenshots(
  page: Page,
  reactElement: Locator,
  solidElement: Locator,
  label: string,
  threshold: ScreenshotDiffThreshold,
) {
  const result = await diffLocatorScreenshots(
    page,
    reactElement,
    solidElement,
    threshold.pixelThreshold,
  );

  expect(result.widthDelta, `${label} width delta`).toBeLessThanOrEqual(
    threshold.maxDimensionDelta,
  );
  expect(result.heightDelta, `${label} height delta`).toBeLessThanOrEqual(
    threshold.maxDimensionDelta,
  );
  expect(
    result.mismatchRatio,
    `${label} screenshot mismatch ratio ${result.mismatchRatio} exceeded ${threshold.maxMismatchRatio}`,
  ).toBeLessThanOrEqual(threshold.maxMismatchRatio);

  return result;
}

export async function diffLocatorScreenshots(
  page: Page,
  reactElement: Locator,
  solidElement: Locator,
  pixelThreshold: number = 0,
) {
  const [reactPng, solidPng] = await Promise.all([
    reactElement.screenshot({ animations: 'disabled' }),
    solidElement.screenshot({ animations: 'disabled' }),
  ]);

  return diffScreenshots(page, reactPng, solidPng, pixelThreshold);
}
