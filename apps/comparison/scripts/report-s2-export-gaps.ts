import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

import { reactSpectrumCatalogue } from "../src/data/react-spectrum-catalogue";

interface ExportReport {
  namedValueExports: Set<string>;
  wildcardExports: string[];
}

const require = createRequire(import.meta.url);
const s2PackageJsonPath = require.resolve("@react-spectrum/s2/package.json");
const s2PackageRoot = dirname(s2PackageJsonPath);
const s2PackageJson = JSON.parse(readFileSync(s2PackageJsonPath, "utf8")) as {
  version?: string;
};

const s2TypesPath = join(s2PackageRoot, "dist/types/exports/index.d.ts");
const solidSpectrumIndexPath = fileURLToPath(
  new URL("../../../packages/solid-spectrum/src/index.ts", import.meta.url),
);

const s2Exports = readExports(s2TypesPath);
const solidExports = readExports(solidSpectrumIndexPath);
const reactValueExports = sorted(s2Exports.namedValueExports);
const solidValueExports = sorted(solidExports.namedValueExports);
const missingSolidExports = difference(reactValueExports, solidValueExports);
const extraSolidExports = difference(solidValueExports, reactValueExports);
const catalogueTitles = new Set(reactSpectrumCatalogue.map((entry) => entry.title));
const catalogueTitleExports = sorted(
  reactSpectrumCatalogue
    .map((entry) => entry.title)
    .filter((title) => s2Exports.namedValueExports.has(title)),
);
const catalogueTitlesWithoutS2ValueExport = reactSpectrumCatalogue
  .map((entry) => entry.title)
  .filter((title) => !s2Exports.namedValueExports.has(title));
const missingCatalogueRootExports = catalogueTitleExports.filter(
  (name) => !solidExports.namedValueExports.has(name),
);
const missingSupportExports = missingSolidExports.filter((name) => !catalogueTitles.has(name));
const s2ExportsOutsideCatalogue = reactValueExports.filter((name) => !catalogueTitles.has(name));

console.log(`React Spectrum S2 package: @react-spectrum/s2@${s2PackageJson.version ?? "unknown"}`);
console.log(`React Spectrum S2 value exports: ${reactValueExports.length}`);
console.log(`solid-spectrum public value exports: ${solidValueExports.length}`);
console.log(`solid-spectrum missing React S2 value exports: ${missingSolidExports.length}`);
console.log(`solid-spectrum extra value exports: ${extraSolidExports.length}`);
console.log(`solid-spectrum wildcard exports: ${solidExports.wildcardExports.length}`);
console.log(`Comparison catalogue entries: ${reactSpectrumCatalogue.length}`);
console.log(
  `Comparison catalogue entries with same-name S2 value export: ${catalogueTitleExports.length}`,
);
console.log(
  `Missing catalogue root exports in solid-spectrum: ${missingCatalogueRootExports.length}`,
);
console.log(
  `Missing non-root/support S2 exports in solid-spectrum: ${missingSupportExports.length}`,
);
console.log(`S2 value exports outside comparison catalogue: ${s2ExportsOutsideCatalogue.length}`);

printList("Missing catalogue root exports in solid-spectrum", missingCatalogueRootExports);
printGroupedExports("Missing non-root/support S2 exports in solid-spectrum", missingSupportExports);
printList("Extra solid-spectrum value exports", extraSolidExports);
printList("Wildcard exports in solid-spectrum public barrel", solidExports.wildcardExports);
printList(
  "Catalogue docs sections without a same-name S2 value export",
  catalogueTitlesWithoutS2ValueExport,
);
printGroupedExports("S2 value exports outside comparison catalogue", s2ExportsOutsideCatalogue);

function readExports(path: string): ExportReport {
  const sourceText = readFileSync(path, "utf8");
  const sourceFile = ts.createSourceFile(path, sourceText, ts.ScriptTarget.Latest, true);
  const namedValueExports = new Set<string>();
  const wildcardExports: string[] = [];

  sourceFile.forEachChild((node) => {
    if (ts.isExportDeclaration(node)) {
      if (node.isTypeOnly) {
        return;
      }

      const moduleSpecifier =
        node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)
          ? node.moduleSpecifier.text
          : "<local>";

      if (!node.exportClause) {
        wildcardExports.push(moduleSpecifier);
        return;
      }

      if (ts.isNamedExports(node.exportClause)) {
        for (const element of node.exportClause.elements) {
          if (!element.isTypeOnly) {
            namedValueExports.add(element.name.text);
          }
        }
        return;
      }

      namedValueExports.add(node.exportClause.name.text);
      return;
    }

    if (hasExportModifier(node) && isValueDeclaration(node)) {
      const name = getDeclarationName(node);
      if (name) {
        namedValueExports.add(name);
      }
    }
  });

  return { namedValueExports, wildcardExports };
}

function hasExportModifier(node: ts.Node): boolean {
  return ts.canHaveModifiers(node)
    ? (ts.getModifiers(node)?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) ??
        false)
    : false;
}

function isValueDeclaration(node: ts.Node): boolean {
  return (
    ts.isFunctionDeclaration(node) ||
    ts.isClassDeclaration(node) ||
    ts.isVariableStatement(node) ||
    ts.isEnumDeclaration(node)
  );
}

function getDeclarationName(node: ts.Node): string | undefined {
  if (ts.isVariableStatement(node)) {
    const declaration = node.declarationList.declarations[0];
    return declaration && ts.isIdentifier(declaration.name) ? declaration.name.text : undefined;
  }

  if ("name" in node && node.name && ts.isIdentifier(node.name)) {
    return node.name.text;
  }

  return undefined;
}

function sorted(values: Iterable<string>): string[] {
  return Array.from(values).sort((a, b) => a.localeCompare(b));
}

function difference(left: readonly string[], right: readonly string[]): string[] {
  const rightSet = new Set(right);
  return left.filter((value) => !rightSet.has(value));
}

function classifyExport(name: string): string {
  if (name.endsWith("Context")) {
    return "contexts";
  }

  if (/^use[A-Z]/.test(name)) {
    return "hooks";
  }

  if (
    !/^[A-Z]/.test(name) ||
    name.startsWith("create") ||
    name.startsWith("get") ||
    name.startsWith("merge") ||
    name.startsWith("parse") ||
    name.startsWith("press")
  ) {
    return "helpers";
  }

  if (
    name.endsWith("Data") ||
    name === "Collection" ||
    name === "EditableCell" ||
    name === "Key" ||
    name === "PressEvent" ||
    name === "RouterConfig"
  ) {
    return "support values";
  }

  return "slots/subcomponents";
}

function groupExports(values: readonly string[]): Map<string, string[]> {
  const groups = new Map<string, string[]>();

  for (const value of values) {
    const group = classifyExport(value);
    const groupValues = groups.get(group) ?? [];
    groupValues.push(value);
    groups.set(group, groupValues);
  }

  return new Map(Array.from(groups.entries()).sort(([left], [right]) => left.localeCompare(right)));
}

function printList(label: string, values: readonly string[]): void {
  if (values.length === 0) {
    return;
  }

  console.log(`\n${label}:`);
  for (const value of values) {
    console.log(`- ${value}`);
  }
}

function printGroupedExports(label: string, values: readonly string[]): void {
  if (values.length === 0) {
    return;
  }

  console.log(`\n${label}:`);
  for (const [group, groupValues] of groupExports(values)) {
    console.log(`\n${group}:`);
    for (const value of groupValues) {
      console.log(`- ${value}`);
    }
  }
}
