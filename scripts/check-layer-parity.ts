#!/usr/bin/env -S deno run -A

/**
 * Layer module parity guard.
 *
 * Compares module directory coverage against local react-spectrum reference.
 * Fails only for @react-aria and @react-stately module gaps.
 * UI parity is reported but not gating.
 */

function listDirs(path: string): string[] {
  const out: string[] = [];
  for (const entry of Deno.readDirSync(path)) {
    if (entry.isDirectory) out.push(entry.name);
  }
  return out.sort();
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
const uiActual = listDirs('packages/ui/src').filter((name) => !['provider', 'utils', 'styles', 'types'].includes(name));
const uiDiff = diff(reactSpectrumUiExpected, uiActual);

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
console.log('@react-spectrum/* -> ui (report-only)');
console.log(`- missing: ${uiDiff.missing.length}`);
console.log(formatList(uiDiff.missing));
console.log(`- extra: ${uiDiff.extra.length}`);
console.log(formatList(uiDiff.extra));

if (reactAriaDiff.missing.length > 0 || reactStatelyDiff.missing.length > 0) {
  Deno.exit(1);
}
