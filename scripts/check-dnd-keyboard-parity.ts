#!/usr/bin/env -S deno run -A

/**
 * Guard: non-virtualized DnD keyboard parity wiring.
 *
 * Ensures keyboardDelegate fallback support remains wired in:
 * - solidaria createDroppableCollection core
 * - collection component call-sites that pass useDroppableCollection options
 */

interface CheckResult {
  target: string;
  ok: boolean;
  detail: string;
}

function format(results: CheckResult[]): string {
  return results
    .map((result) => `${result.ok ? "✓" : "✗"} ${result.target}: ${result.detail}`)
    .join("\n");
}

function hasPattern(source: string, pattern: RegExp): boolean {
  return pattern.test(source);
}

const corePath = "packages/solidaria/src/dnd/createDroppableCollection.ts";
const componentPaths = [
  "packages/solidaria-components/src/ListBox.tsx",
  "packages/solidaria-components/src/Menu.tsx",
  "packages/solidaria-components/src/GridList.tsx",
  "packages/solidaria-components/src/Table.tsx",
  "packages/solidaria-components/src/Tree.tsx",
] as const;

const [coreSource, ...componentSources] = await Promise.all([
  Deno.readTextFile(corePath),
  ...componentPaths.map((path) => Deno.readTextFile(path)),
]);

const results: CheckResult[] = [];

results.push({
  target: corePath,
  ok:
    hasPattern(coreSource, /keyboardDelegate\?:\s*KeyboardDelegateLike/) &&
    hasPattern(coreSource, /const\s+resolveFallbackKeyboardTarget\s*=\s*\(/) &&
    hasPattern(coreSource, /\?\?\s*resolveFallbackKeyboardTarget\(e\.key(?:\s*,\s*target)?\)/) &&
    hasPattern(coreSource, /typeof\s+window\s*!==\s*['"]undefined['"]/) &&
    hasPattern(coreSource, /typeof\s+document\s*!==\s*['"]undefined['"]/),
  detail:
    "contains keyboardDelegate option type, keyboard fallback resolution, and SSR-safe direction guards",
});

for (let i = 0; i < componentPaths.length; i += 1) {
  const path = componentPaths[i];
  const source = componentSources[i];
  const hasUseDroppableCollectionCall = hasPattern(source, /useDroppableCollection\s*\(/);
  const hasKeyboardDelegateOption = hasPattern(source, /keyboardDelegate\s*:/);
  const hasHorizontalMethods =
    (path.endsWith("GridList.tsx") || path.endsWith("Table.tsx") || path.endsWith("Tree.tsx"))
    ? hasPattern(source, /getKeyLeftOf\s*:/) && hasPattern(source, /getKeyRightOf\s*:/)
    : true;

  results.push({
    target: path,
    ok: hasUseDroppableCollectionCall && hasKeyboardDelegateOption && hasHorizontalMethods,
    detail: (path.endsWith("GridList.tsx") || path.endsWith("Table.tsx") || path.endsWith("Tree.tsx"))
      ? "passes keyboardDelegate into useDroppableCollection options with horizontal key delegates"
      : "passes keyboardDelegate into useDroppableCollection options",
  });
}

console.log("DnD keyboard parity guard");
console.log(format(results));

const failed = results.filter((result) => !result.ok);
if (failed.length > 0) {
  console.log("");
  console.log(`Failed checks: ${failed.length}`);
  Deno.exit(1);
}
