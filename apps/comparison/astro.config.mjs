import path from "node:path";
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import solid from "@astrojs/solid-js";

const repoRoot = path.resolve("./../..");
const appRoot = path.resolve("./");
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
        "../../packages/solid-stately/src/**/*",
        "../../packages/solidaria/src/**/*",
        "../../packages/solidaria-components/src/**/*",
        "../../packages/silapse/src/**/*",
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
