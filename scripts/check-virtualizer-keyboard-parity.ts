#!/usr/bin/env -S deno run -A

/**
 * Guard: virtualizer keyboard delegate parity invariants.
 *
 * Ensures keyboard and page navigation fallback semantics remain wired:
 * - opposite-direction fallback scan for keyboard navigation
 * - opposite-direction fallback scan for page navigation
 * - regression coverage for both paths in Virtualizer tests
 */

interface CheckResult {
  target: string;
  ok: boolean;
  detail: string;
}

function has(source: string, pattern: RegExp): boolean {
  return pattern.test(source);
}

function format(results: CheckResult[]): string {
  return results.map((r) => `${r.ok ? "✓" : "✗"} ${r.target}: ${r.detail}`).join("\n");
}

const virtualizerPath = "packages/solidaria-components/src/Virtualizer.tsx";
const testsPath = "packages/solidaria-components/test/Virtualizer.test.tsx";

const [virtualizerSource, testsSource] = await Promise.all([
  Deno.readTextFile(virtualizerPath),
  Deno.readTextFile(testsPath),
]);

const results: CheckResult[] = [
  {
    target: virtualizerPath,
    ok:
      has(virtualizerSource, /getKeyboardNavigationTarget\s*=\s*\(/) &&
      has(virtualizerSource, /const\s+oppositeDirection:\s*'next'\s*\|\s*'previous'/) &&
      has(virtualizerSource, /scanFromIndex\(clampedStart\s*-\s*delta,\s*-delta,\s*oppositeDirection\)/),
    detail: "keyboard navigation delegate includes opposite-direction fallback scan",
  },
  {
    target: virtualizerPath,
    ok:
      has(virtualizerSource, /getKeyboardPageNavigationTarget\s*=\s*\(/) &&
      has(virtualizerSource, /const\s+primaryTarget\s*=\s*scanFromIndex\(clampedStart,\s*delta\)/) &&
      has(virtualizerSource, /const\s+oppositeTarget\s*=\s*scanFromIndex\(clampedStart\s*-\s*delta,\s*-delta\)/),
    detail: "page navigation delegate includes opposite-direction fallback scan",
  },
  {
    target: testsPath,
    ok:
      has(testsSource, /keyboard delegate falls back to opposite direction when forward scan has no valid targets/) &&
      has(testsSource, /keyboard page delegate falls back to opposite direction when forward scan has no valid targets/),
    detail: "regression tests cover opposite-direction fallback for keyboard + page delegates",
  },
];

console.log("Virtualizer keyboard parity guard");
console.log(format(results));

if (results.some((r) => !r.ok)) {
  console.log("");
  console.log("One or more virtualizer keyboard parity checks failed.");
  Deno.exit(1);
}

