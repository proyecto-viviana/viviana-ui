#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const packageDirs = [
  "packages/solid-stately",
  "packages/solidaria",
  "packages/solidaria-components",
  "packages/silapse",
];

const mode = process.argv.includes("--fix") ? "fix" : "check";
const mismatches = [];
let changedFiles = 0;

async function readJson(filePath) {
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content);
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

for (const pkgDir of packageDirs) {
  const packageJsonPath = path.join(rootDir, pkgDir, "package.json");
  const packageJson = await readJson(packageJsonPath);
  const packageVersion = packageJson.version;

  for (const manifestName of ["deno.json", "jsr.json"]) {
    const manifestPath = path.join(rootDir, pkgDir, manifestName);
    if (!(await exists(manifestPath))) {
      continue;
    }

    const manifest = await readJson(manifestPath);
    const manifestVersion = manifest.version;
    if (manifestVersion === packageVersion) {
      continue;
    }

    mismatches.push({
      pkgDir,
      manifestName,
      expected: packageVersion,
      actual: manifestVersion,
    });

    if (mode === "fix") {
      manifest.version = packageVersion;
      await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
      changedFiles += 1;
    }
  }
}

if (mismatches.length === 0) {
  console.log("Manifest versions are synchronized.");
  process.exit(0);
}

for (const mismatch of mismatches) {
  console.log(
    `${mismatch.pkgDir}/${mismatch.manifestName}: expected ${mismatch.expected}, found ${mismatch.actual}`,
  );
}

if (mode === "fix") {
  console.log(`Updated ${changedFiles} manifest file(s).`);
  process.exit(0);
}

console.error("\nManifest versions are out of sync. Run `npm run sync:manifest-versions`.");
process.exit(1);
