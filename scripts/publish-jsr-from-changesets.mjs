#!/usr/bin/env node

import { spawnSync } from "node:child_process";

const packageOrder = [
  "@proyecto-viviana/solid-stately",
  "@proyecto-viviana/solidaria",
  "@proyecto-viviana/solidaria-components",
  "@proyecto-viviana/silapse",
];

const publishedPackagesJson = process.env.PUBLISHED_PACKAGES_JSON;
const dryRun = process.argv.includes("--dry-run");

if (!publishedPackagesJson) {
  console.error("PUBLISHED_PACKAGES_JSON is required.");
  process.exit(1);
}

let parsed;
try {
  parsed = JSON.parse(publishedPackagesJson);
} catch (error) {
  console.error("Failed to parse PUBLISHED_PACKAGES_JSON.");
  console.error(error);
  process.exit(1);
}

if (!Array.isArray(parsed)) {
  console.error("PUBLISHED_PACKAGES_JSON must be a JSON array.");
  process.exit(1);
}

const publishedNames = new Set(
  parsed
    .map((pkg) => pkg?.name)
    .filter((name) => typeof name === "string"),
);

const targetPackages = packageOrder.filter((pkgName) => publishedNames.has(pkgName));

if (targetPackages.length === 0) {
  console.log("No releasable JSR packages were published to npm. Skipping JSR publish.");
  process.exit(0);
}

console.log(`Publishing JSR packages for: ${targetPackages.join(", ")}`);

const result = spawnSync(
  "deno",
  ["run", "-A", "scripts/publish.ts", ...(dryRun ? ["--dry-run"] : []), ...targetPackages],
  {
    stdio: "inherit",
  },
);

if (typeof result.status === "number") {
  process.exit(result.status);
}

process.exit(1);
