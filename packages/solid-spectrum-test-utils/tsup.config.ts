import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: {
    resolve: true,
  },
  target: 'esnext',
  sourcemap: true,
  splitting: false,
  clean: true,
  outDir: 'dist',
});
