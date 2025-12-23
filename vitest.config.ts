import { defineConfig } from 'vitest/config';
import solidPlugin from 'vite-plugin-solid';
import { resolve } from 'path';

export default defineConfig({
  plugins: [solidPlugin()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['packages/**/test/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['packages/*/src/**/*.{ts,tsx}'],
      exclude: ['**/*.test.{ts,tsx}', '**/index.ts'],
    },
  },
  resolve: {
    conditions: ['development', 'browser'],
    alias: {
      '@proyecto-viviana/solid-stately': resolve(__dirname, 'packages/solid-stately/src/index.ts'),
      '@proyecto-viviana/solidaria': resolve(__dirname, 'packages/solidaria/src/index.ts'),
      '@proyecto-viviana/solidaria-components': resolve(__dirname, 'packages/solidaria-components/src/index.ts'),
      '@proyecto-viviana/ui': resolve(__dirname, 'packages/ui/src/index.ts'),
    },
  },
});
