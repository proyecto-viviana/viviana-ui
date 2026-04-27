import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import solid from "@astrojs/solid-js";

const appRoot = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(appRoot, "../..");
const localSolidPackages = [
  "@proyecto-viviana/solid-stately",
  "@proyecto-viviana/solidaria",
  "@proyecto-viviana/solidaria-components",
  "@proyecto-viviana/silapse",
];

export default defineConfig(({ command }) => ({
  integrations: [
    react({
      include: ["src/components/react/**/*"],
      exclude: [
        "src/components/solid/**/*",
        "../../packages/solid-stately/src/**/*",
        "../../packages/solidaria/src/**/*",
        "../../packages/solidaria-components/src/**/*",
        "../../packages/silapse/src/**/*",
      ],
    }),
    solid({
      include: [
        "src/components/solid/**/*",
      ],
      exclude: ["src/components/react/**/*"],
    }),
  ],
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
    resolve: {
      alias: [
        {
          find: "@comparison",
          replacement: path.resolve(appRoot, "src"),
        },
        {
          find: /^@proyecto-viviana\/solid-stately$/,
          replacement: path.resolve(repoRoot, "packages/solid-stately/dist/index.js"),
        },
        {
          find: /^@proyecto-viviana\/solidaria$/,
          replacement: path.resolve(repoRoot, "packages/solidaria/dist/index.js"),
        },
        {
          find: /^@proyecto-viviana\/solidaria-components$/,
          replacement: path.resolve(repoRoot, "packages/solidaria-components/dist/index.js"),
        },
        {
          find: /^@proyecto-viviana\/silapse$/,
          replacement: path.resolve(repoRoot, "packages/silapse/dist/index.js"),
        },
      ],
    },
    server: {
      fs: {
        allow: [repoRoot],
      },
    },
    optimizeDeps: {
      exclude: localSolidPackages,
      include: [
        "react",
        "react/jsx-runtime",
        "react-dom",
        "react-dom/client",
        "solid-js",
        "solid-js/web",
      ],
    },
    ssr: {
      noExternal: command === "build" ? true : localSolidPackages,
    },
  },
}));
