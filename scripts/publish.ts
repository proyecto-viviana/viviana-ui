/**
 * Publish script for proyecto-viviana packages
 *
 * Handles workspace:* → actual versions conversion before npm publish,
 * then reverts back to workspace:* after publishing.
 *
 * Usage: deno run -A scripts/publish.ts [package-name]
 */

import { join, dirname, fromFileUrl } from "https://deno.land/std@0.224.0/path/mod.ts";

const __dirname = dirname(fromFileUrl(import.meta.url));
const rootDir = join(__dirname, "..");

interface PackageInfo {
  name: string;
  dir: string;
  version: string;
  dependencies: Record<string, string>;
}

const packageOrder = [
  "solid-stately",
  "solidaria",
  "solidaria-components",
  "silapse",
];

// Map of package names to their npm package names
const packageNameMap: Record<string, string> = {
  "solid-stately": "@proyecto-viviana/solid-stately",
  "solidaria": "@proyecto-viviana/solidaria",
  "solidaria-components": "@proyecto-viviana/solidaria-components",
  "silapse": "@proyecto-viviana/silapse",
};

async function readPackageJson(pkgDir: string): Promise<PackageInfo> {
  const pkgJsonPath = join(pkgDir, "package.json");
  const content = await Deno.readTextFile(pkgJsonPath);
  const pkg = JSON.parse(content);
  return {
    name: pkg.name,
    dir: pkgDir,
    version: pkg.version,
    dependencies: pkg.dependencies || {},
  };
}

async function getPackageVersions(): Promise<Record<string, string>> {
  const versions: Record<string, string> = {};
  for (const pkgName of packageOrder) {
    const pkgDir = join(rootDir, "packages", pkgName);
    const info = await readPackageJson(pkgDir);
    versions[info.name] = info.version;
  }
  return versions;
}

async function replaceWorkspaceRefs(pkgDir: string, versions: Record<string, string>): Promise<Record<string, string>> {
  const pkgJsonPath = join(pkgDir, "package.json");
  const content = await Deno.readTextFile(pkgJsonPath);
  const pkg = JSON.parse(content);

  const originalDeps: Record<string, string> = {};

  if (pkg.dependencies) {
    for (const [dep, version] of Object.entries(pkg.dependencies)) {
      if (version === "workspace:*") {
        originalDeps[dep] = version as string;
        const actualVersion = versions[dep];
        if (actualVersion) {
          pkg.dependencies[dep] = `^${actualVersion}`;
          console.log(`    ${dep}: workspace:* → ^${actualVersion}`);
        } else {
          console.warn(`    ⚠ No version found for ${dep}`);
        }
      }
    }
  }

  await Deno.writeTextFile(pkgJsonPath, JSON.stringify(pkg, null, 2) + "\n");
  return originalDeps;
}

async function revertWorkspaceRefs(pkgDir: string, originalDeps: Record<string, string>): Promise<void> {
  const pkgJsonPath = join(pkgDir, "package.json");
  const content = await Deno.readTextFile(pkgJsonPath);
  const pkg = JSON.parse(content);

  if (pkg.dependencies) {
    for (const [dep, version] of Object.entries(originalDeps)) {
      pkg.dependencies[dep] = version;
    }
  }

  await Deno.writeTextFile(pkgJsonPath, JSON.stringify(pkg, null, 2) + "\n");
}

async function runCommand(cmd: string[], cwd: string): Promise<boolean> {
  const command = new Deno.Command(cmd[0], {
    args: cmd.slice(1),
    cwd,
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });

  const result = await command.output();
  return result.success;
}

async function publishPackage(pkgName: string, versions: Record<string, string>): Promise<boolean> {
  const pkgDir = join(rootDir, "packages", pkgName);
  const jsrJsonPath = join(pkgDir, "jsr.json");

  console.log(`\n📦 Publishing ${pkgName}...`);

  // Replace workspace:* with actual versions
  console.log("  Replacing workspace references:");
  const originalDeps = await replaceWorkspaceRefs(pkgDir, versions);

  let npmSuccess = false;
  let jsrSuccess = false;

  try {
    // Publish to npm
    console.log("  Publishing to npm...");
    npmSuccess = await runCommand(["npm", "publish", "--access", "public"], pkgDir);
    if (npmSuccess) {
      console.log("  ✓ npm publish succeeded");
    } else {
      console.log("  ✗ npm publish failed (may already exist)");
    }

    // Publish to JSR
    try {
      await Deno.stat(jsrJsonPath);
      console.log("  Publishing to JSR...");
      jsrSuccess = await runCommand(["deno", "publish", "--allow-slow-types"], pkgDir);
      if (jsrSuccess) {
        console.log("  ✓ JSR publish succeeded");
      } else {
        console.log("  ✗ JSR publish failed (may already exist)");
      }
    } catch {
      console.log("  ⊘ No jsr.json, skipping JSR publish");
      jsrSuccess = true;
    }
  } finally {
    // Always revert workspace refs
    console.log("  Reverting workspace references...");
    await revertWorkspaceRefs(pkgDir, originalDeps);
    console.log("  ✓ Reverted to workspace:*");
  }

  return npmSuccess || jsrSuccess;
}

async function main() {
  const targetPackage = Deno.args[0];

  // Get all package versions first
  console.log("Reading package versions...");
  const versions = await getPackageVersions();
  console.log("Versions:", versions);

  const packagesToPublish = targetPackage
    ? [targetPackage]
    : packageOrder;

  for (const pkgName of packagesToPublish) {
    if (!packageOrder.includes(pkgName)) {
      console.error(`Unknown package: ${pkgName}`);
      console.error(`Available: ${packageOrder.join(", ")}`);
      Deno.exit(1);
    }

    await publishPackage(pkgName, versions);
  }

  console.log("\n✓ Publishing complete!");
}

main();
