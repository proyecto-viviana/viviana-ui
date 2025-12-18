import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.jsx',
    },
    rollupOptions: {
      external: ['solid-js', 'solid-js/web', 'solid-js/store', '@proyecto-viviana/solidaria'],
    },
    sourcemap: true,
    minify: false,
    target: 'esnext',
  },
  esbuild: {
    jsx: 'preserve',
  },
});
