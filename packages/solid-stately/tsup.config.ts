import { defineConfig } from 'tsup';
import { solidPlugin } from 'esbuild-plugin-solid';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  target: 'esnext',
  sourcemap: true,
  splitting: false,
  clean: true,
  outDir: 'dist',
  esbuildPlugins: [solidPlugin({ solid: { generate: 'dom', hydratable: true } })],
  external: ['solid-js', 'solid-js/web', 'solid-js/store'],
});

