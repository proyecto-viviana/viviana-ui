import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  // Use --mode ssr to trigger SSR build
  const isSSR = mode === 'ssr';

  return {
    plugins: [solidPlugin({ ssr: isSSR })],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        formats: ['es'],
        fileName: () => isSSR ? 'index.ssr.js' : 'index.js',
      },
      rollupOptions: {
        external: ['solid-js', 'solid-js/web', 'solid-js/store', '@proyecto-viviana/solid-stately'],
      },
      sourcemap: true,
      target: 'esnext',
      minify: false,
    },
  };
});
