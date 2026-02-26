import { defineConfig } from 'tsup';
import { solidPlugin } from 'esbuild-plugin-solid';
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Copy CSS files after build
function copyCssFiles() {
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
}

export default defineConfig([
  // DOM build
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: false, // Use tsc separately for better tsx support
    target: 'esnext',
    sourcemap: true,
    splitting: false,
    clean: true,
    outDir: 'dist',
    esbuildPlugins: [solidPlugin({ solid: { generate: 'dom', hydratable: true } })],
    external: ['solid-js', 'solid-js/web', 'solid-js/store', '@proyecto-viviana/solidaria-components'],
    onSuccess: async () => {
      copyCssFiles();
    },
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
    external: ['solid-js', 'solid-js/web', 'solid-js/store', '@proyecto-viviana/solidaria-components'],
  },
]);
