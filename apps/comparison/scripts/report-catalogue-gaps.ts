import {
  comparisonEntries,
  missingOfficialComparisonEntries,
  officialComparisonEntries,
} from "../src/data/comparison-manifest";
import {
  reactSpectrumCatalogue,
  reactSpectrumCatalogueSource,
} from "../src/data/react-spectrum-catalogue";

const officialLive = officialComparisonEntries.filter(
  (entry) => entry.layers.styled.react === "live" && entry.layers.styled.solid === "live",
);
const legacyEntries = comparisonEntries.filter(
  (entry) => entry.catalogueSource === "legacy-solidaria",
);

console.log(`React Spectrum catalogue source: ${reactSpectrumCatalogueSource.url}`);
console.log(`Official v3 catalogue entries: ${reactSpectrumCatalogue.length}`);
console.log(`Official entries in comparison app: ${officialComparisonEntries.length}`);
console.log(`Official styled entries live on both sides: ${officialLive.length}`);
console.log(`Official entries still missing/gap: ${missingOfficialComparisonEntries.length}`);
console.log(`Legacy comparison routes retained: ${legacyEntries.length}`);

if (missingOfficialComparisonEntries.length > 0) {
  console.log("\nMissing/gap official entries:");
  for (const entry of missingOfficialComparisonEntries) {
    console.log(
      `- ${entry.title} (${entry.category}) react=${entry.layers.styled.react} solid=${entry.layers.styled.solid} ${entry.docsUrl ?? ""}`,
    );
  }
}

if (legacyEntries.length > 0) {
  console.log("\nLegacy routes to migrate into official entries:");
  for (const entry of legacyEntries) {
    console.log(`- ${entry.title} /components/${entry.slug}/`);
  }
}
