import type { ComparisonLayerId, ComparisonSlug } from "./comparison-manifest";

export const comparisonContractVersion = "spectrum-reference-v1";

export type ComparisonFramework = "react" | "solid";
export type ComparisonReferenceKind =
  | "react-spectrum"
  | "spectrum-skin"
  | "silapse"
  | "react-aria-components"
  | "solidaria-components"
  | "react-aria"
  | "solidaria"
  | "state"
  | "unwired";

export interface ComparisonReferenceInput {
  componentSlug: ComparisonSlug;
  framework: ComparisonFramework;
  layer: ComparisonLayerId;
  reference: ComparisonReferenceKind;
}

export const comparisonTabItems = [
  {
    id: "overview",
    label: "Overview",
    content: "Overlay dismissal now respects the local portal scope.",
  },
  {
    id: "parity",
    label: "Parity",
    content:
      "Collection composition is the main remaining styled-layer nuance.",
  },
  {
    id: "testing",
    label: "Testing",
    content: "This page is intended to become a Playwright and axe target.",
  },
] as const;

export const comparisonSelectItems = [
  { id: "alpha", label: "Alpha" },
  { id: "bravo", label: "Bravo" },
  { id: "charlie", label: "Charlie" },
] as const;

export const comparisonSpectrumSkin = {
  rootClass: "comparison-spectrum-skin",
  buttonClass: "solidaria-Button comparison-spectrum-Button",
  labelClass: "comparison-spectrum-Button-label",
  dialogClass: "solidaria-Dialog comparison-spectrum-Dialog",
  dialogTitleClass: "solidaria-Heading comparison-spectrum-Dialog-title",
  dialogBodyClass: "comparison-spectrum-Dialog-body",
  fieldRootClass: "solidaria-TextField comparison-spectrum-Field",
  fieldLabelClass: "solidaria-Label comparison-spectrum-Field-label",
  fieldInputClass: "solidaria-Input comparison-spectrum-Field-input",
  selectRootClass: "solidaria-Select comparison-spectrum-Select",
  selectTriggerClass:
    "solidaria-Select-trigger comparison-spectrum-Field-input comparison-spectrum-Select-trigger",
  selectValueClass: "solidaria-Select-value comparison-spectrum-Select-value",
  selectListBoxClass: "solidaria-Select-listbox comparison-spectrum-Select-listbox",
  selectOptionClass: "solidaria-Select-option comparison-spectrum-Select-option",
} as const;

const nativeSilapseStyledSlugs = new Set<ComparisonSlug>([
  "provider",
  "tabs",
  "toast",
]);

export function getComparisonReferenceKind(
  framework: ComparisonFramework,
  layer: ComparisonLayerId,
  componentSlug: ComparisonSlug,
): ComparisonReferenceKind {
  if (layer === "styled") {
    if (framework === "react") {
      return "react-spectrum";
    }

    return nativeSilapseStyledSlugs.has(componentSlug)
      ? "silapse"
      : "spectrum-skin";
  }

  if (layer === "components") {
    return framework === "react"
      ? "react-aria-components"
      : "solidaria-components";
  }

  if (layer === "headless") {
    return framework === "react" ? "react-aria" : "solidaria";
  }

  return "state";
}

export function comparisonReferenceDataset(input: ComparisonReferenceInput) {
  return {
    "data-comparison-contract": comparisonContractVersion,
    "data-comparison-component": input.componentSlug,
    "data-comparison-framework": input.framework,
    "data-comparison-layer": input.layer,
    "data-comparison-reference": input.reference,
  };
}
