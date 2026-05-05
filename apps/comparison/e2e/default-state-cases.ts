export type DefaultVisualCase = {
  slug: string;
  title: string;
  threshold: {
    maxMismatchRatio: number;
    maxDimensionDelta: number;
    pixelThreshold: number;
  };
};

export const defaultVisualCases: DefaultVisualCase[] = [
  {
    slug: "provider",
    title: "Provider",
    threshold: { maxMismatchRatio: 0.34, maxDimensionDelta: 2, pixelThreshold: 0 },
  },
  {
    slug: "button",
    title: "Button",
    threshold: { maxMismatchRatio: 0.18, maxDimensionDelta: 2, pixelThreshold: 0 },
  },
  {
    slug: "actionbutton",
    title: "ActionButton",
    threshold: { maxMismatchRatio: 0.18, maxDimensionDelta: 2, pixelThreshold: 0 },
  },
  {
    slug: "actionbuttongroup",
    title: "ActionButtonGroup",
    threshold: { maxMismatchRatio: 0.22, maxDimensionDelta: 24, pixelThreshold: 0 },
  },
  {
    slug: "buttongroup",
    title: "ButtonGroup",
    threshold: { maxMismatchRatio: 0.4, maxDimensionDelta: 4, pixelThreshold: 0 },
  },
  {
    slug: "togglebutton",
    title: "ToggleButton",
    threshold: { maxMismatchRatio: 0.18, maxDimensionDelta: 8, pixelThreshold: 0 },
  },
];
