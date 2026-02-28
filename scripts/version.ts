/**
 * Legacy version entrypoint kept only to block the old lockstep workflow.
 *
 * This repository now uses independent package versioning via Changesets.
 */

const message = [
  "scripts/version.ts is deprecated.",
  "Proyecto Viviana uses independent package versioning via Changesets.",
  "Use `npm run changeset:version` to apply pending version bumps,",
  "then `npm run sync:manifest-versions` to mirror metadata into Deno/JSR manifests.",
].join("\n");

if (Deno.args.includes("--help") || Deno.args.includes("-h")) {
  console.log(message);
  Deno.exit(0);
}

console.error(message);
Deno.exit(1);
