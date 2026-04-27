import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_COMPONENTS = [
  "Button",
  "TextField",
  "Select",
  "Menu",
  "Dialog",
  "Checkbox",
  "Radio",
  "ComboBox",
  "ListBox",
  "Table",
];

const LOCAL_TEST_DIR = "packages/solidaria-components/test";
const UPSTREAM_TEST_DIR = "react-spectrum/packages/react-aria-components/test";
const TEST_EXTENSIONS = [".test.tsx", ".test.ts", ".test.jsx", ".test.js"];

interface TestCase {
  name: string;
  line: number;
}

function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (match) => "\n".repeat(match.split("\n").length - 1))
    .replace(/\/\/.*$/gm, "");
}

function unquote(value: string): string {
  const quote = value[0];
  const body = value.slice(1, -1);
  if (quote === "`") {
    return body.replace(/\$\{[^}]*\}/g, "${...}").replace(/\\`/g, "`");
  }

  return body
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");
}

function extractItBlocks(source: string): TestCase[] {
  const cleanSource = stripComments(source);
  const lineStarts: number[] = [0];
  for (let i = 0; i < cleanSource.length; i++) {
    if (cleanSource[i] === "\n") lineStarts.push(i + 1);
  }

  const getLine = (index: number) => {
    let low = 0;
    let high = lineStarts.length - 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (lineStarts[mid] <= index) low = mid + 1;
      else high = mid - 1;
    }
    return high + 1;
  };

  const tests: TestCase[] = [];
  const testRegex = /(?:^|[^\w$])it(?:\.(?:only|skip|todo|each\s*\([^)]*\)))?\s*\(\s*(['"`])((?:\\.|(?!\1)[\s\S])*?)\1/g;
  let match: RegExpExecArray | null;

  while ((match = testRegex.exec(cleanSource)) !== null) {
    const rawName = `${match[1]}${match[2]}${match[1]}`;
    tests.push({
      name: unquote(rawName).replace(/\s+/g, " ").trim(),
      line: getLine(match.index),
    });
  }

  return tests;
}

function resolveTestFile(directory: string, component: string): string | undefined {
  for (const extension of TEST_EXTENSIONS) {
    const filePath = path.join(directory, `${component}${extension}`);
    if (existsSync(filePath)) return filePath;
  }
}

function formatTest(test: TestCase): string {
  return `  - line ${test.line}: ${test.name}`;
}

const components = process.argv.slice(2);
const targetComponents = components.length > 0 ? components : DEFAULT_COMPONENTS;

console.log("RAC component test parity report");
console.log(`- local: ${LOCAL_TEST_DIR}/<Name>.test.*`);
console.log(`- upstream: ${UPSTREAM_TEST_DIR}/<Name>.test.*`);
console.log("");

for (const component of targetComponents) {
  const localPath = resolveTestFile(LOCAL_TEST_DIR, component);
  const upstreamPath = resolveTestFile(UPSTREAM_TEST_DIR, component);

  console.log(`## ${component}`);

  if (!localPath) {
    console.log(`- local test file missing`);
  } else {
    console.log(`- local: ${localPath}`);
  }

  if (!upstreamPath) {
    console.log(`- upstream test file missing`);
  } else {
    console.log(`- upstream: ${upstreamPath}`);
  }

  if (!localPath || !upstreamPath) {
    console.log("");
    continue;
  }

  const [localSource, upstreamSource] = await Promise.all([
    readFile(localPath, "utf8"),
    readFile(upstreamPath, "utf8"),
  ]);

  const localTests = extractItBlocks(localSource);
  const upstreamTests = extractItBlocks(upstreamSource);
  const localNames = new Set(localTests.map((test) => test.name));
  const missing = upstreamTests.filter((test) => !localNames.has(test.name));

  console.log(`- local it() blocks: ${localTests.length}`);
  console.log(`- upstream it() blocks: ${upstreamTests.length}`);
  console.log(`- missing upstream it() blocks: ${missing.length}`);

  if (missing.length > 0) {
    console.log("Missing:");
    console.log(missing.map(formatTest).join("\n"));
  }

  console.log("");
}
