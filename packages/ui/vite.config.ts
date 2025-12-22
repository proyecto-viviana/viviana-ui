import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'node:url';
import solidPlugin from 'vite-plugin-solid';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Plugin to copy CSS files to dist
function copyCssPlugin() {
  return {
    name: 'copy-css',
    closeBundle() {
      const distDir = resolve(__dirname, 'dist');
      if (!existsSync(distDir)) {
        mkdirSync(distDir, { recursive: true });
      }

      const cssFiles = ['theme.css', 'styles.css', 'components.css'];
      for (const file of cssFiles) {
        const src = resolve(__dirname, 'src', file);
        const dest = resolve(distDir, file);
        if (existsSync(src)) {
          copyFileSync(src, dest);
        }
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  // Use --mode ssr to trigger SSR build
  const isSSR = mode === 'ssr';

  return {
    plugins: [
      solidPlugin({ ssr: isSSR }),
      copyCssPlugin(),
    ],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        formats: ['es'],
        fileName: () => isSSR ? 'index.ssr.js' : 'index.js',
      },
      rollupOptions: {
        external: ['solid-js', 'solid-js/web', 'solid-js/store', '@proyecto-viviana/solidaria', '@proyecto-viviana/solidaria-components'],
      },
      sourcemap: true,
      minify: false,
      target: 'esnext',
    },
  };
});
