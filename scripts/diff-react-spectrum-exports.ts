#!/usr/bin/env -S deno run -A

/**
 * Diff script for React Spectrum exports versus the SolidJS port.
 * Outputs a structured summary so the parity log can be kept up to date.
 */

const RAC_COMPONENTS_INDEX = 'react-spectrum/packages/react-aria-components/src/index.ts';
const SOLIDARIA_COMPONENTS_INDEX = 'packages/solidaria-components/src/index.ts';
const REACT_SPECTRUM_DIR = 'react-spectrum/packages/@react-spectrum';
const SILAPSE_SRC_DIR = 'packages/silapse/src';

type ExportSet = Set<string>;
type ParsedExports = {
  names: ExportSet;
  starRelativeSources: string[];
};

function parseNamedExports(source: string): ParsedExports {
  const names = new Set<string>();
  const starRelativeSources: string[] = [];

  // Limit matches to a single export statement so `export {X}; export {...} from ...`
  // does not get merged into one malformed clause.
  const exportRegex = /export\s*\{([^;]*?)\}\s*(?:from\s*['"]([^'"]+)['"])?\s*;?/g;
  let match: RegExpExecArray | null;

  while ((match = exportRegex.exec(source)) !== null) {
    const [, clause] = match;
    const cleaned = clause
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '')
      .trim();
    cleaned.split(',').forEach((part) => {
      const token = part.trim();
      if (!token || token.startsWith('type ')) return;
      const asSplit = token.split(/\s+as\s+/i);
      const exported = asSplit.length === 2 ? asSplit[1].trim() : asSplit[0].trim();
      if (exported && exported !== 'default') names.add(exported);
    });
  }

  // Capture value declarations exported directly from this module.
  const declarationRegex =
    /export\s+(?:async\s+)?function\s+([A-Za-z_$][\w$]*)|export\s+(?:const|let|var|class|enum)\s+([A-Za-z_$][\w$]*)/g;
  while ((match = declarationRegex.exec(source)) !== null) {
    const declared = match[1] ?? match[2];
    if (declared) names.add(declared);
  }

  // Collect relative export-star sources for recursive expansion.
  const starRegex = /export\s*\*\s*from\s*['"]([^'"]+)['"]\s*;?/g;
  while ((match = starRegex.exec(source)) !== null) {
    const fromPath = match[1];
    if (fromPath.startsWith('./') || fromPath.startsWith('../')) {
      starRelativeSources.push(fromPath);
    }
  }

  return { names, starRelativeSources };
}

function formatList(items: string[], limit = 25): string {
  if (items.length === 0) return '  - (none)';
  const slice = items.slice(0, limit);
  const lines = slice.map((item) => `  - ${item}`).join('\n');
  if (items.length > limit) {
    return `${lines}\n  - ... (${items.length - limit} more)`;
  }
  return lines;
}

async function readFile(path: string): Promise<string | undefined> {
  try {
    return await Deno.readTextFile(path);
  } catch {
    return undefined;
  }
}

function ensurePath(...segments: string[]): string {
  const cleaned = segments
    .map((segment) => segment.replace(/(^\/+|\/+$)/g, ''))
    .filter(Boolean);
  return cleaned.join('/');
}

function dirname(path: string): string {
  const idx = path.lastIndexOf('/');
  return idx >= 0 ? path.slice(0, idx) : '.';
}

function resolveRelativeModule(fromFile: string, relativeImport: string): string | undefined {
  const baseDir = dirname(fromFile);
  const normalized = ensurePath(baseDir, relativeImport);
  const candidates = [
    `${normalized}.ts`,
    `${normalized}.tsx`,
    `${normalized}.js`,
    `${normalized}/index.ts`,
    `${normalized}/index.tsx`,
    `${normalized}/index.js`,
  ];

  for (const candidate of candidates) {
    try {
      const stat = Deno.statSync(candidate);
      if (stat.isFile) return candidate;
    } catch {
      continue;
    }
  }

  return undefined;
}

async function collectModuleExports(
  modulePath: string,
  cache: Map<string, ExportSet>,
  visiting = new Set<string>()
): Promise<ExportSet> {
  const cached = cache.get(modulePath);
  if (cached) return new Set(cached);
  if (visiting.has(modulePath)) return new Set();
  visiting.add(modulePath);

  const source = await readFile(modulePath);
  if (!source) {
    visiting.delete(modulePath);
    return new Set();
  }

  const { names, starRelativeSources } = parseNamedExports(source);
  const aggregated = new Set<string>(names);

  for (const starSource of starRelativeSources) {
    const resolved = resolveRelativeModule(modulePath, starSource);
    if (!resolved) continue;
    const nested = await collectModuleExports(resolved, cache, visiting);
    for (const name of nested) aggregated.add(name);
  }

  visiting.delete(modulePath);
  cache.set(modulePath, new Set(aggregated));
  return aggregated;
}

function resolveLocalSilapseIndex(name: string): string | undefined {
  const base = ensurePath(SILAPSE_SRC_DIR, name);
  const candidates = [
    `${base}/index.ts`,
    `${base}/index.tsx`,
    `${base}.ts`,
    `${base}.tsx`,
  ];

  for (const candidate of candidates) {
    try {
      const stat = Deno.statSync(candidate);
      if (stat.isFile) return candidate;
    } catch {
      continue;
    }
  }

  return undefined;
}

async function listReactSpectrumPackages(): Promise<string[]> {
  const names: string[] = [];
  for await (const entry of Deno.readDir(REACT_SPECTRUM_DIR)) {
    if (entry.isDirectory) {
      names.push(entry.name);
    }
  }
  names.sort();
  return names;
}

async function run(): Promise<void> {
  const [racSource, solidariaSource] = await Promise.all([
    readFile(RAC_COMPONENTS_INDEX),
    readFile(SOLIDARIA_COMPONENTS_INDEX),
  ]);

  if (!racSource || !solidariaSource) {
    console.error('unable to read one of the base indexes');
    Deno.exit(1);
  }

  const racExports = parseNamedExports(racSource).names;
  const solidariaExports = parseNamedExports(solidariaSource).names;
  const missingInSolidaria = [...racExports].filter((name) => !solidariaExports.has(name)).sort();
  const extraInSolidaria = [...solidariaExports].filter((name) => !racExports.has(name)).sort();

  console.log('=== Solidaria headless export diff ===');
  console.log(`RAC exports: ${racExports.size}`);
  console.log(`Solidaria exports: ${solidariaExports.size}`);
  console.log(`Missing in Solidaria: ${missingInSolidaria.length}`);
  console.log(`Extra in Solidaria: ${extraInSolidaria.length}`);
  console.log('');
  console.log('Missing in Solidaria headless:');
  console.log(formatList(missingInSolidaria, 50));
  console.log('');

  const packages = await listReactSpectrumPackages();
  console.log('\n=== Silapse export diff per @react-spectrum package ===');
  const moduleCache = new Map<string, ExportSet>();
  for (const pkg of packages) {
    const upstreamPath = ensurePath(REACT_SPECTRUM_DIR, pkg, 'src', 'index.ts');
    const upstreamSource = await readFile(upstreamPath);
    if (!upstreamSource) continue;
    const upstreamExports = parseNamedExports(upstreamSource).names;

    const localIndex = resolveLocalSilapseIndex(pkg);
    if (!localIndex) {
      console.log(`- ${pkg}: missing local silapse entry`);
      continue;
    }

    const localExports = await collectModuleExports(localIndex, moduleCache);
    if (localExports.size === 0) {
      console.log(`- ${pkg}: cannot read local silapse index (${localIndex})`);
      continue;
    }

    const missing = [...upstreamExports].filter((name) => !localExports.has(name)).sort();
    const extra = [...localExports].filter((name) => !upstreamExports.has(name)).sort();

    console.log(`- ${pkg}: upstream ${upstreamExports.size}, local ${localExports.size}`);
    console.log(`  missing exports (${missing.length}):`);
    console.log(formatList(missing, 5));
    console.log(`  extra exports (${extra.length}):`);
    console.log(formatList(extra, 5));
  }
}

await run();
