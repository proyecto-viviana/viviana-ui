import { promises as fs } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const solidIconRoot = path.join(repoRoot, "packages/solid-spectrum/src/icon");
const uiSourceDir = path.join(solidIconRoot, "assets/ui-icons");
const wfSourceDir = path.join(solidIconRoot, "assets/s2wf-icons");
const uiOutDir = path.join(solidIconRoot, "ui-icons");
const wfOutDir = path.join(solidIconRoot, "s2wf-icons");

const license = `/*
 * Auto-generated from vendored React Spectrum S2 icon sources.
 * Do not edit by hand.
 */
`;

function pascalFromAssetName(name) {
  return name
    .replace(/^S2_Icon_/, "")
    .replace(/_20_N$/, "")
    .replace(/[^A-Za-z0-9]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");
}

function safeIdentifier(name) {
  return /^[A-Za-z_]/.test(name) ? name : `Icon${name}`;
}

function escapeText(text) {
  return text.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

function indent(text, spaces) {
  const pad = " ".repeat(spaces);
  return text
    .split("\n")
    .map((line) => (line.length ? pad + line : line))
    .join("\n");
}

const uiIconSpecs = [
  {
    name: "Add",
    variants: [
      { size: "XS", file: "S2_AddSize50.svg" },
      { size: "S", file: "S2_AddSize75.svg" },
      { size: "M", file: "S2_AddSize100.svg" },
      { size: "L", file: "S2_AddSize200.svg" },
      { size: "XL", file: "S2_AddSize300.svg" },
    ],
  },
  {
    name: "Arrow",
    variants: [
      { size: "M", file: "S2_ArrowSize100.svg" },
      { size: "XXL", file: "S2_ArrowSize400.svg" },
    ],
  },
  {
    name: "Asterisk",
    variants: [
      { size: "M", file: "S2_AsteriskSize100.svg" },
      { size: "L", file: "S2_AsteriskSize200.svg" },
      { size: "XL", file: "S2_AsteriskSize300.svg" },
    ],
  },
  {
    name: "Checkmark",
    variants: [
      { size: "XS", file: "S2_CheckmarkSize50.svg" },
      { size: "S", file: "S2_CheckmarkSize75.svg" },
      { size: "M", file: "S2_CheckmarkSize100.svg" },
      { size: "L", file: "S2_CheckmarkSize200.svg" },
      { size: "XL", file: "S2_CheckmarkSize300.svg" },
      { size: "XXL", file: "S2_CheckmarkSize400.svg" },
    ],
  },
  {
    name: "Chevron",
    variants: [
      { size: "XS", file: "S2_ChevronSize50.svg" },
      { size: "S", file: "S2_ChevronSize75.svg" },
      { size: "M", file: "S2_ChevronSize100.svg" },
      { size: "L", file: "S2_ChevronSize200.svg" },
      { size: "XL", file: "S2_ChevronSize300.svg" },
      { size: "XXL", file: "S2_ChevronSize400.svg" },
    ],
  },
  {
    name: "CornerTriangle",
    variants: [
      { size: "S", file: "S2_CornerTriangleSize75.svg" },
      { size: "M", file: "S2_CornerTriangleSize100.svg" },
      { size: "L", file: "S2_CornerTriangleSize200.svg" },
      { size: "XL", file: "S2_CornerTriangleSize300.svg" },
    ],
  },
  {
    name: "Cross",
    variants: [
      { size: "S", file: "S2_CrossSize75.svg" },
      { size: "M", file: "S2_CrossSize100.svg" },
      { size: "L", file: "S2_CrossSize200.svg" },
      { size: "XL", file: "S2_CrossSize300.svg" },
      { size: "XXL", file: "S2_CrossSize400.svg" },
      { size: "XXXL", file: "S2_CrossSize500.svg" },
      { size: "XXXXL", file: "S2_CrossSize600.svg" },
    ],
  },
  {
    name: "Dash",
    variants: [
      { size: "XS", file: "S2_DashSize50.svg" },
      { size: "S", file: "S2_DashSize75.svg" },
      { size: "M", file: "S2_DashSize100.svg" },
      { size: "L", file: "S2_DashSize200.svg" },
      { size: "XL", file: "S2_DashSize300.svg" },
    ],
  },
  {
    name: "DragHandle",
    variants: [
      { size: "S", file: "S2_DragHandleSize75.svg" },
      { size: "M", file: "S2_DragHandleSize100.svg" },
      { size: "L", file: "S2_DragHandleSize200.svg" },
      { size: "XL", file: "S2_DragHandleSize300.svg" },
    ],
  },
  { name: "Gripper", variants: [{ size: "M", file: "S2_GripperSize100.svg" }] },
  {
    name: "LinkOut",
    variants: [
      { size: "M", file: "S2_LinkOutSize100.svg" },
      { size: "L", file: "S2_LinkOutSize200.svg" },
      { size: "XL", file: "S2_LinkOutSize300.svg" },
      { size: "XXL", file: "S2_LinkOutSize400.svg" },
    ],
  },
];

async function readSvgSource(svgPath) {
  const raw = await fs.readFile(svgPath, "utf8");
  const match = raw.match(/<svg\b([^>]*)>([\s\S]*?)<\/svg>/i);
  if (!match) {
    throw new Error(`Unable to parse SVG file: ${svgPath}`);
  }

  return {
    attrs: match[1].trim(),
    inner: match[2].trim(),
  };
}

async function ensureCleanDir(dir) {
  await fs.rm(dir, { recursive: true, force: true });
  await fs.mkdir(dir, { recursive: true });
}

function extractUiImports(source) {
  const imports = [];
  const re = /^import\s+(\w+)\s+from\s+'\.\/(S2_[^']+\.svg)';$/gm;
  let match;
  while ((match = re.exec(source))) {
    imports.push({ localName: match[1], asset: match[2] });
  }
  return imports;
}

function extractSizeMap(source) {
  const widthMatch = source.match(/width:\s*\{\s*size:\s*\{([\s\S]*?)\}\s*\}\s*,\s*height:/);
  if (!widthMatch) {
    throw new Error("Unable to find ui-icon size map");
  }

  const entries = [];
  const re = /([A-Z]+):\s*(\d+)/g;
  let match;
  while ((match = re.exec(widthMatch[1]))) {
    entries.push({ size: match[1], value: Number(match[2]) });
  }
  return entries;
}

function sizeKeyFromImport(localName, asset) {
  const suffix = localName.slice(localName.lastIndexOf("_") + 1);
  if (suffix && /^[A-Z]+$/.test(suffix)) {
    return suffix;
  }

  const assetMatch = asset.match(/Size(\d+)/);
  if (assetMatch) {
    return assetMatch[1];
  }

  throw new Error(`Unable to infer size key for ${localName} (${asset})`);
}

function buildVariantComponent(name, sizeKey, svgAttrs, svgInner) {
  return `
function ${name}_${sizeKey}Svg(props: JSX.SvgSVGAttributes<SVGSVGElement>): JSX.Element {
  const { class: className, width: _width, height: _height, ...rest } = props;
  return (
    <svg ${svgAttrs} {...rest} class={className}>
${indent(svgInner, 6)}
    </svg>
  );
}
`.trim();
}

function buildWorkflowIconComponent(name, svgAttrs, svgInner) {
  return `
function ${name}Svg(props: JSX.SvgSVGAttributes<SVGSVGElement>): JSX.Element {
  const { class: className, ...rest } = props;
  return (
    <svg ${svgAttrs} {...rest} class={className}>
${indent(svgInner, 6)}
    </svg>
  );
}
`.trim();
}

async function generateUiIcon(spec, outPath) {
  const baseName = spec.name;
  const propsType = `${baseName}Props`;
  const sizeUnion = spec.variants.map((entry) => `'${entry.size}'`).join(" | ");

  const svgVariants = [];
  for (const { size, file } of spec.variants) {
    const svgPath = path.join(uiSourceDir, file);
    const { attrs, inner } = await readSvgSource(svgPath);
    svgVariants.push({ size, attrs, inner });
  }

  const variantComponents = svgVariants
    .map((variant) => buildVariantComponent(baseName, variant.size, variant.attrs, variant.inner))
    .join("\n\n");

  const cases = svgVariants
    .map(
      (variant) => `    case '${variant.size}':
      return <${baseName}_${variant.size} {...rest} class={className} />;`,
    )
    .join("\n");

  const defaultSize = spec.variants.some((entry) => entry.size === "M")
    ? "M"
    : spec.variants[0].size;

  const file = `${license}
import { type JSX } from "solid-js";
import { createIcon } from "../spectrum-icon";

export type ${propsType} = JSX.SvgSVGAttributes<SVGSVGElement> & {
  size?: ${sizeUnion};
};

${variantComponents}

${svgVariants
  .map(
    (variant) => `const ${baseName}_${variant.size} = createIcon(${baseName}_${variant.size}Svg);`,
  )
  .join("\n")}

export default function ${baseName}(props: ${propsType}): JSX.Element {
  const { size = '${defaultSize}', class: className, width: _width, height: _height, ...rest } = props;
  switch (size) {
${cases}
    default:
      return <${baseName}_${defaultSize} {...rest} class={className} />;
  }
}

export const ${baseName}Icon = ${baseName};
`;

  await fs.writeFile(outPath, file);
}

async function generateWorkflowIcon(sourcePath, outPath) {
  const baseName = path.basename(sourcePath, ".svg");
  const iconName = safeIdentifier(`${pascalFromAssetName(baseName) || baseName}Icon`);
  const { attrs, inner } = await readSvgSource(sourcePath);

  const file = `${license}
import { type JSX } from "solid-js";
import { createIcon } from "../spectrum-icon";

function ${iconName}Svg(props: JSX.SvgSVGAttributes<SVGSVGElement>): JSX.Element {
  const { class: className, ...rest } = props;
  return (
    <svg ${attrs} {...rest} class={className}>
${indent(inner, 6)}
    </svg>
  );
}

export type ${iconName}Props = JSX.SvgSVGAttributes<SVGSVGElement>;
export const ${iconName} = createIcon(${iconName}Svg);
export default ${iconName};
`;

  await fs.writeFile(outPath, file);
  return iconName;
}

async function writeUiBarrel(files) {
  const lines = [license];
  for (const file of files) {
    const name = path.basename(file, ".tsx");
    lines.push(`export { default as ${name}, ${name}Icon } from "./${name}";`);
    lines.push(`export type { ${name}Props } from "./${name}";`);
  }
  await fs.writeFile(path.join(uiOutDir, "index.ts"), `${lines.join("\n")}\n`);
}

async function writeWorkflowBarrel(names) {
  const lines = [license];
  for (const name of names) {
    lines.push(`export { default as ${name} } from "./${name}";`);
    lines.push(`export type { ${name}Props } from "./${name}";`);
  }
  await fs.writeFile(path.join(wfOutDir, "index.ts"), `${lines.join("\n")}\n`);
}

async function main() {
  await ensureCleanDir(uiOutDir);
  await ensureCleanDir(wfOutDir);

  for (const spec of uiIconSpecs) {
    await generateUiIcon(spec, path.join(uiOutDir, `${spec.name}.tsx`));
  }

  const wfFiles = (await fs.readdir(wfSourceDir)).filter((file) => file.endsWith(".svg")).sort();
  const wfNames = [];
  for (const file of wfFiles) {
    const outName = `${safeIdentifier(`${pascalFromAssetName(path.basename(file, ".svg")) || path.basename(file, ".svg")}Icon`)}.tsx`;
    wfNames.push(
      await generateWorkflowIcon(path.join(wfSourceDir, file), path.join(wfOutDir, outName)),
    );
  }

  await writeUiBarrel(uiIconSpecs.map((spec) => `${spec.name}.tsx`));
  await writeWorkflowBarrel(wfNames);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
