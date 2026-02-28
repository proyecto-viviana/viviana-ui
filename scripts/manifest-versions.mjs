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
const mirroredFields = ["name", "version", "license"];

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

  for (const manifestName of ["deno.json", "jsr.json"]) {
    const manifestPath = path.join(rootDir, pkgDir, manifestName);
    if (!(await exists(manifestPath))) {
      continue;
    }

    const manifest = await readJson(manifestPath);
    let changed = false;

    for (const field of mirroredFields) {
      const expected = packageJson[field];
      const actual = manifest[field];

      if (expected === actual) {
        continue;
      }

      mismatches.push({
        pkgDir,
        manifestName,
        field,
        expected,
        actual,
      });

      if (mode === "fix") {
        if (expected === undefined) {
          delete manifest[field];
        } else {
          manifest[field] = expected;
        }
        changed = true;
      }
    }

    if (mode === "fix" && changed) {
      await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
      changedFiles += 1;
    }
  }
}

if (mismatches.length === 0) {
  console.log("Manifest release metadata are synchronized.");
  process.exit(0);
}

for (const mismatch of mismatches) {
  console.log(
    `${mismatch.pkgDir}/${mismatch.manifestName}: ${mismatch.field} expected ${mismatch.expected}, found ${mismatch.actual}`,
  );
}

if (mode === "fix") {
  console.log(`Updated ${changedFiles} manifest file(s).`);
  process.exit(0);
}

console.error("\nManifest release metadata are out of sync. Run `npm run sync:manifest-versions`.");
process.exit(1);
