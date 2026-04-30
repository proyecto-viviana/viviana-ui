import {
  comparisonEntries,
  missingOfficialComparisonEntries,
  officialComparisonEntries,
} from "../src/data/comparison-manifest";
import {
  reactSpectrumCatalogue,
  reactSpectrumCatalogueSource,
} from "../src/data/react-spectrum-catalogue";
import {
  officialVisualStateCoverage,
  officialVisualStateSummary,
  visualStateCoverage,
} from "../src/data/visual-state-matrix";

const officialLive = officialComparisonEntries.filter(
  (entry) => entry.layers.styled.react === "live" && entry.layers.styled.solid === "live",
);
const legacyEntries = comparisonEntries.filter(
  (entry) => entry.catalogueSource === "legacy-solidaria",
);
const nonStrictSnapshottedOfficialStates = officialVisualStateCoverage.flatMap((entry) =>
  entry.states
    .filter(
      (state) =>
        state.react === "snapshotted" &&
        state.solid === "snapshotted" &&
        state.pairDiff !== "strict",
    )
    .map((state) => `${entry.title}: ${state.label} (${state.pairDiff})`),
);
const plannedOfficialStates = officialVisualStateCoverage.flatMap((entry) =>
  entry.states
    .filter((state) => state.pairDiff === "planned" || state.pairDiff === "blocked")
    .map((state) => `${entry.title}: ${state.label} (${state.pairDiff})`),
);
const legacySnapshottedStates = visualStateCoverage
  .filter((entry) => entry.source === "legacy-solidaria")
  .flatMap((entry) =>
    entry.states.filter(
      (state) => state.react === "snapshotted" && state.solid === "snapshotted",
    ),
  );

console.log(`React Spectrum catalogue source: ${reactSpectrumCatalogueSource.url}`);
console.log(`Official v3 catalogue entries: ${reactSpectrumCatalogue.length}`);
console.log(`Official entries in comparison app: ${officialComparisonEntries.length}`);
console.log(`Official styled entries live on both sides: ${officialLive.length}`);
console.log(`Official entries still missing/gap: ${missingOfficialComparisonEntries.length}`);
console.log(`Official visual states tracked: ${officialVisualStateSummary.states}`);
console.log(`Official visual states with committed React/Solid screenshots: ${officialVisualStateSummary.snapshottedStates}`);
console.log(`Official visual states with strict pair diff: ${officialVisualStateSummary.strictPairDiffStates}`);
console.log(`Official visual states blocked by missing implementations: ${officialVisualStateSummary.blockedStates}`);
console.log(`Legacy visual states with committed React/Solid screenshots: ${legacySnapshottedStates.length}`);
console.log(`Legacy comparison routes retained: ${legacyEntries.length}`);

if (missingOfficialComparisonEntries.length > 0) {
  console.log("\nMissing/gap official entries:");
  for (const entry of missingOfficialComparisonEntries) {
    console.log(
      `- ${entry.title} (${entry.category}) react=${entry.layers.styled.react} solid=${entry.layers.styled.solid} ${entry.docsUrl ?? ""}`,
    );
  }
}

if (nonStrictSnapshottedOfficialStates.length > 0) {
  console.log("\nOfficial states with committed screenshots but non-strict pair diff:");
  for (const state of nonStrictSnapshottedOfficialStates) {
    console.log(`- ${state}`);
  }
}

if (plannedOfficialStates.length > 0) {
  console.log("\nOfficial states without complete screenshot/pair-diff coverage:");
  for (const state of plannedOfficialStates) {
    console.log(`- ${state}`);
  }
}

if (legacyEntries.length > 0) {
  console.log("\nLegacy routes to migrate into official entries:");
  for (const entry of legacyEntries) {
    console.log(`- ${entry.title} /components/${entry.slug}/`);
  }
}
