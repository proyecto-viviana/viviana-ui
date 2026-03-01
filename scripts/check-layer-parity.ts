/**
 * Layer module parity guard.
 *
 * Compares module directory coverage against local react-spectrum reference.
 * Fails only for @react-aria and @react-stately module gaps.
 * UI parity is reported but not gating.
 */

import { readdirSync } from "node:fs";

function listDirs(path: string): string[] {
  return readdirSync(path, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function diff(expected: string[], actual: string[]) {
  const missing = expected.filter((name) => !actual.includes(name));
  const extra = actual.filter((name) => !expected.includes(name));
  return { missing, extra };
}

function formatList(values: string[]): string {
  return values.length ? values.map((value) => `  - ${value}`).join('\n') : '  - (none)';
}

const reactAriaExpected = listDirs('react-spectrum/packages/@react-aria').filter((name) =>
  !['aria-modal-polyfill', 'example-theme', 'test-utils', 'spinbutton', 'virtualizer', 'steplist'].includes(name)
);
const solidariaActual = listDirs('packages/solidaria/src');
const reactAriaDiff = diff(reactAriaExpected, solidariaActual);

const reactStatelyExpected = listDirs('react-spectrum/packages/@react-stately').filter((name) =>
  !['data', 'flags', 'layout', 'list', 'virtualizer', 'steplist'].includes(name)
);
const solidStatelyActual = listDirs('packages/solid-stately/src');
const reactStatelyDiff = diff(reactStatelyExpected, solidStatelyActual);

const reactSpectrumUiExpected = listDirs('react-spectrum/packages/@react-spectrum').filter((name) =>
  !['provider', 'utils', 's2', 'theme-dark', 'theme-default', 's2-icon', 's2-illustrations'].includes(name)
);
const silapseActual = listDirs('packages/silapse/src').filter((name) => !['provider', 'utils', 'styles', 'types'].includes(name));
const silapseDiff = diff(reactSpectrumUiExpected, silapseActual);

console.log('4-layer module parity check');
console.log('');
console.log('@react-aria/* -> solidaria');
console.log(`- missing: ${reactAriaDiff.missing.length}`);
console.log(formatList(reactAriaDiff.missing));
console.log(`- extra: ${reactAriaDiff.extra.length}`);
console.log(formatList(reactAriaDiff.extra));
console.log('');
console.log('@react-stately/* -> solid-stately');
console.log(`- missing: ${reactStatelyDiff.missing.length}`);
console.log(formatList(reactStatelyDiff.missing));
console.log(`- extra: ${reactStatelyDiff.extra.length}`);
console.log(formatList(reactStatelyDiff.extra));
console.log('');
console.log('@react-spectrum/* -> silapse (report-only)');
console.log(`- missing: ${silapseDiff.missing.length}`);
console.log(formatList(silapseDiff.missing));
console.log(`- extra: ${silapseDiff.extra.length}`);
console.log(formatList(silapseDiff.extra));

if (reactAriaDiff.missing.length > 0 || reactStatelyDiff.missing.length > 0) {
  process.exit(1);
}
