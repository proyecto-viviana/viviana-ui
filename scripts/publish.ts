/**
 * JSR publish script for releasable proyecto-viviana packages.
 *
 * Usage:
 *   deno run -A scripts/publish.ts [--dry-run] [package-name]
 */

import { dirname, fromFileUrl, join } from "https://deno.land/std@0.224.0/path/mod.ts";

const __dirname = dirname(fromFileUrl(import.meta.url));
const rootDir = join(__dirname, "..");

const packageOrder = [
  "solid-stately",
  "solidaria",
  "solidaria-components",
  "silapse",
] as const;

type PackageName = (typeof packageOrder)[number];

function isPackageName(value: string): value is PackageName {
  return packageOrder.includes(value as PackageName);
}

async function runCommand(cmd: string[], cwd: string): Promise<void> {
  const command = new Deno.Command(cmd[0], {
    args: cmd.slice(1),
    cwd,
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });

  const result = await command.output();
  if (!result.success) {
    Deno.exit(result.code);
  }
}

async function assertManifestSync(): Promise<void> {
  console.log("Validating mirrored package metadata...");
  await runCommand(["node", "scripts/manifest-versions.mjs", "--check"], rootDir);
}

async function publishPackage(pkgName: PackageName, dryRun: boolean): Promise<void> {
  const pkgDir = join(rootDir, "packages", pkgName);
  const jsrJsonPath = join(pkgDir, "jsr.json");

  try {
    await Deno.stat(jsrJsonPath);
  } catch {
    console.log(`\nSkipping ${pkgName}: no jsr.json found.`);
    return;
  }

  const args = ["publish"];
  if (dryRun) {
    args.push("--dry-run");
    args.push("--allow-dirty");
  }
  args.push("--allow-slow-types");

  console.log(`\nPublishing ${pkgName} to JSR${dryRun ? " (dry run)" : ""}...`);
  await runCommand(["deno", ...args], pkgDir);
}

async function main(): Promise<void> {
  const dryRun = Deno.args.includes("--dry-run");
  const positionalArgs = Deno.args.filter((arg) => arg !== "--dry-run");
  const targetPackage = positionalArgs[0];

  if (targetPackage && !isPackageName(targetPackage)) {
    console.error(`Unknown package: ${targetPackage}`);
    console.error(`Available: ${packageOrder.join(", ")}`);
    Deno.exit(1);
  }

  await assertManifestSync();

  const packagesToPublish: PackageName[] = targetPackage
    ? [targetPackage as PackageName]
    : [...packageOrder];

  for (const pkgName of packagesToPublish) {
    await publishPackage(pkgName, dryRun);
  }

  console.log(`\nJSR publish workflow complete${dryRun ? " (dry run)" : ""}.`);
}

main();
