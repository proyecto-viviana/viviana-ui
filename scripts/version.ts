/**
 * Version synchronization script for proyecto-viviana packages
 *
 * Usage: deno run -A scripts/version.ts <version>
 *
 * Updates version in package.json, deno.json, and jsr.json for all packages.
 */

import { join, dirname, fromFileUrl } from "https://deno.land/std@0.224.0/path/mod.ts";

const __dirname = dirname(fromFileUrl(import.meta.url));
const rootDir = join(__dirname, "..");

const packages = [
  "packages/solid-stately",
  "packages/solidaria",
  "packages/solidaria-components",
  "packages/silapse",
];

async function updateJsonFile(filePath: string, version: string) {
  try {
    const content = await Deno.readTextFile(filePath);
    const json = JSON.parse(content);
    json.version = version;
    await Deno.writeTextFile(filePath, JSON.stringify(json, null, 2) + "\n");
    console.log(`  ✓ ${filePath}`);
    return true;
  } catch (err) {
    console.warn(`  ⚠ Could not update ${filePath}: ${err.message}`);
    return false;
  }
}

async function main() {
  const version = Deno.args[0];

  if (!version) {
    console.error("Usage: deno run -A scripts/version.ts <version>");
    console.error("Example: deno run -A scripts/version.ts 0.0.8");
    Deno.exit(1);
  }

  // Validate version format (basic semver check)
  if (!/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(version)) {
    console.error(`Invalid version format: ${version}`);
    console.error("Expected format: X.Y.Z or X.Y.Z-tag");
    Deno.exit(1);
  }

  console.log(`Setting version to ${version}\n`);

  for (const pkg of packages) {
    const pkgPath = join(rootDir, pkg);
    console.log(`Updating ${pkg}:`);

    // Update package.json
    await updateJsonFile(join(pkgPath, "package.json"), version);

    // Update deno.json
    await updateJsonFile(join(pkgPath, "deno.json"), version);

    // Update jsr.json
    await updateJsonFile(join(pkgPath, "jsr.json"), version);

    console.log("");
  }

  console.log(`✓ All packages updated to version ${version}`);
}

main();
