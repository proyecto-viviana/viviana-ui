/**
 * Deno build script for proyecto-viviana packages
 *
 * Usage: deno run -A scripts/build.ts <package-name>
 *
 * Builds both DOM and SSR versions using esbuild with solid plugin.
 */

import * as esbuild from "npm:esbuild@0.24.0";
import { solidPlugin } from "npm:esbuild-plugin-solid@0.6.0";
import { ensureDir, copy } from "https://deno.land/std@0.224.0/fs/mod.ts";
import { join, dirname, fromFileUrl } from "https://deno.land/std@0.224.0/path/mod.ts";

const __dirname = dirname(fromFileUrl(import.meta.url));
const rootDir = join(__dirname, "..");

interface PackageConfig {
  name: string;
  entry: string;
  outDir: string;
  external: string[];
  ssr: boolean;
  cssFiles?: string[];
}

const packages: Record<string, PackageConfig> = {
  "solid-stately": {
    name: "solid-stately",
    entry: "packages/solid-stately/src/index.ts",
    outDir: "packages/solid-stately/dist",
    external: ["solid-js", "solid-js/web", "solid-js/store", "@internationalized/date"],
    ssr: false,
  },
  solidaria: {
    name: "solidaria",
    entry: "packages/solidaria/src/index.ts",
    outDir: "packages/solidaria/dist",
    external: [
      "solid-js",
      "solid-js/web",
      "solid-js/store",
      "@proyecto-viviana/solid-stately",
      "@internationalized/string",
    ],
    ssr: true,
  },
  "solidaria-components": {
    name: "solidaria-components",
    entry: "packages/solidaria-components/src/index.ts",
    outDir: "packages/solidaria-components/dist",
    external: [
      "solid-js",
      "solid-js/web",
      "solid-js/store",
      "@proyecto-viviana/solid-stately",
      "@proyecto-viviana/solidaria",
    ],
    ssr: true,
  },
  ui: {
    name: "ui",
    entry: "packages/ui/src/index.ts",
    outDir: "packages/ui/dist",
    external: [
      "solid-js",
      "solid-js/web",
      "solid-js/store",
      "@proyecto-viviana/solid-stately",
      "@proyecto-viviana/solidaria",
      "@proyecto-viviana/solidaria-components",
    ],
    ssr: true,
    cssFiles: ["theme.css", "styles.css", "components.css"],
  },
};

async function buildPackage(config: PackageConfig) {
  const entryPath = join(rootDir, config.entry);
  const outDir = join(rootDir, config.outDir);

  // Ensure output directory exists
  await ensureDir(outDir);

  console.log(`Building ${config.name}...`);

  // DOM build (hydratable)
  console.log(`  → DOM build`);
  await esbuild.build({
    entryPoints: [entryPath],
    bundle: true,
    format: "esm",
    target: "esnext",
    outfile: join(outDir, "index.js"),
    external: config.external,
    plugins: [
      solidPlugin({
        solid: {
          generate: "dom",
          hydratable: true,
        },
      }),
    ],
    sourcemap: true,
    splitting: false,
  });

  // SSR build (if needed)
  if (config.ssr) {
    console.log(`  → SSR build`);
    await esbuild.build({
      entryPoints: [entryPath],
      bundle: true,
      format: "esm",
      target: "esnext",
      outfile: join(outDir, "index.ssr.js"),
      external: config.external,
      plugins: [
        solidPlugin({
          solid: {
            generate: "ssr",
          },
        }),
      ],
      sourcemap: true,
      splitting: false,
    });
  }

  // Copy CSS files (for ui package)
  if (config.cssFiles) {
    console.log(`  → Copying CSS files`);
    const srcDir = join(rootDir, "packages", config.name, "src");
    for (const cssFile of config.cssFiles) {
      const src = join(srcDir, cssFile);
      const dest = join(outDir, cssFile);
      try {
        await Deno.copyFile(src, dest);
        console.log(`    ✓ ${cssFile}`);
      } catch (err) {
        console.warn(`    ⚠ Could not copy ${cssFile}: ${err.message}`);
      }
    }
  }

  // Generate TypeScript declarations using tsc
  console.log(`  → Generating type declarations`);
  const tscCommand = new Deno.Command("npx", {
    args: ["tsc", "-p", "tsconfig.build.json"],
    cwd: join(rootDir, "packages", config.name),
    stdout: "piped",
    stderr: "piped",
  });

  const tscResult = await tscCommand.output();
  if (!tscResult.success) {
    const stderr = new TextDecoder().decode(tscResult.stderr);
    console.warn(`    ⚠ TypeScript declaration generation had issues: ${stderr}`);
  } else {
    console.log(`    ✓ Type declarations generated`);
  }

  console.log(`✓ ${config.name} built successfully\n`);
}

async function main() {
  const packageName = Deno.args[0];

  if (!packageName) {
    console.log("Building all packages...\n");
    // Build in dependency order
    for (const name of ["solid-stately", "solidaria", "solidaria-components", "ui"]) {
      await buildPackage(packages[name]);
    }
  } else if (packages[packageName]) {
    await buildPackage(packages[packageName]);
  } else {
    console.error(`Unknown package: ${packageName}`);
    console.error(`Available packages: ${Object.keys(packages).join(", ")}`);
    Deno.exit(1);
  }

  // Stop esbuild service
  esbuild.stop();
}

main();
