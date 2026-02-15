const componentsDir = "apps/web/src/routes/docs/components";
const hooksDir = "apps/web/src/routes/docs/hooks";
const routeTreeFile = "apps/web/src/routeTree.gen.ts";

async function listRouteSlugs(dir: string): Promise<string[]> {
  const slugs: string[] = [];
  for await (const entry of Deno.readDir(dir)) {
    if (!entry.isFile || !entry.name.endsWith(".tsx")) continue;
    slugs.push(entry.name.replace(".tsx", ""));
  }
  return slugs.sort();
}

const componentSlugs = await listRouteSlugs(componentsDir);
const hookSlugs = await listRouteSlugs(hooksDir);
const routeTree = await Deno.readTextFile(routeTreeFile);

const expectedPaths = [
  ...componentSlugs.map((slug) => `/docs/components/${slug}`),
  ...hookSlugs.map((slug) => `/docs/hooks/${slug}`),
];

const missingPaths = expectedPaths.filter((path) => !routeTree.includes(`'${path}'`));

if (missingPaths.length > 0) {
  console.error("Docs routeTree is missing discovered route files:");
  for (const path of missingPaths) {
    console.error(`- ${path}`);
  }
  console.error("Run the router generator/build step so routeTree.gen.ts is up to date.");
  Deno.exit(1);
}

console.log(`OK: docs routeTree covers ${expectedPaths.length} docs routes.`);
