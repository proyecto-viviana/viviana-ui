import { defineConfig } from 'tsup';
import { solidPlugin } from 'esbuild-plugin-solid';

export default defineConfig([
  // DOM build
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: false,
    target: 'esnext',
    sourcemap: true,
    splitting: false,
    clean: true,
    outDir: 'dist',
    esbuildPlugins: [solidPlugin({ solid: { generate: 'dom', hydratable: true } })],
    external: ['solid-js', 'solid-js/web', 'solid-js/store', '@proyecto-viviana/solid-stately'],
  },
  // SSR build
  {
    entry: { 'index.ssr': 'src/index.ts' },
    format: ['esm'],
    dts: false,
    target: 'esnext',
    sourcemap: true,
    splitting: false,
    outDir: 'dist',
    esbuildPlugins: [solidPlugin({ solid: { generate: 'ssr' } })],
    external: ['solid-js', 'solid-js/web', 'solid-js/store', '@proyecto-viviana/solid-stately'],
  },
]);

