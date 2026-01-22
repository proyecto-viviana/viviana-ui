import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/docs/installation")({
  component: InstallationPage,
});

function InstallationPage() {
  return (
    <div class="mx-auto max-w-3xl px-8 py-12">
      <article class="prose">
        <h1>Installation</h1>
        <p>Install Proyecto Viviana packages using your preferred package manager or registry.</p>

        <h2>From JSR (Recommended for Deno)</h2>
        <pre>
          <code>{`deno add jsr:@proyecto-viviana/ui jsr:@proyecto-viviana/solidaria`}</code>
        </pre>

        <h2>From npm</h2>
        <pre>
          <code>{`npm install @proyecto-viviana/ui @proyecto-viviana/solidaria`}</code>
        </pre>

        <h2>Using bun</h2>
        <pre>
          <code>{`bun add @proyecto-viviana/ui @proyecto-viviana/solidaria`}</code>
        </pre>

        <h2>Using pnpm</h2>
        <pre>
          <code>{`pnpm add @proyecto-viviana/ui @proyecto-viviana/solidaria`}</code>
        </pre>

        <h2>Peer Dependencies</h2>
        <p>Make sure you have SolidJS installed:</p>
        <pre>
          <code>{`npm install solid-js`}</code>
        </pre>

        <h2>Package Overview</h2>
        <p>Choose which packages to install based on your needs:</p>

        <div class="not-prose my-6 overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-bg-200">
                <th class="py-2 pr-4 text-left font-semibold">Package</th>
                <th class="py-2 pr-4 text-left font-semibold">Use Case</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-bg-100">
              <tr>
                <td class="py-2 pr-4">
                  <code>@proyecto-viviana/ui</code>
                </td>
                <td class="py-2">Pre-styled components, ready to use</td>
              </tr>
              <tr>
                <td class="py-2 pr-4">
                  <code>@proyecto-viviana/solidaria</code>
                </td>
                <td class="py-2">ARIA hooks for custom components</td>
              </tr>
              <tr>
                <td class="py-2 pr-4">
                  <code>@proyecto-viviana/solidaria-components</code>
                </td>
                <td class="py-2">Headless components with render props</td>
              </tr>
              <tr>
                <td class="py-2 pr-4">
                  <code>@proyecto-viviana/solid-stately</code>
                </td>
                <td class="py-2">State management hooks only</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Tailwind CSS Setup</h2>
        <p>
          The UI components use Tailwind CSS v4. Add the theme variables to your CSS:
        </p>
        <pre>
          <code>{`@import "tailwindcss";

@theme {
  /* Primary colors */
  --color-primary-50: #eef2ff;
  --color-primary-100: #e0e7ff;
  --color-primary-200: #c7d2fe;
  --color-primary-300: #a5b4fc;
  --color-primary-400: #818cf8;
  --color-primary-500: #6366f1;
  --color-primary-600: #4f46e5;
  --color-primary-700: #4338ca;
  --color-primary-800: #3730a3;
  --color-primary-900: #312e81;

  /* Background colors */
  --color-bg-50: #fafafa;
  --color-bg-100: #f4f4f5;
  --color-bg-200: #e4e4e7;
  --color-bg-300: #d4d4d8;
  --color-bg-400: #a1a1aa;
  --color-bg-500: #71717a;
  --color-bg-600: #52525b;

  /* Accent colors */
  --color-accent-500: #06b6d4;
  --color-accent-600: #0891b2;

  /* Negative colors */
  --color-negative-500: #ef4444;
  --color-negative-600: #dc2626;
}`}</code>
        </pre>

        <h2>TypeScript Configuration</h2>
        <p>For SolidJS JSX support, ensure your tsconfig includes:</p>
        <pre>
          <code>{`{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "types": ["vite/client"]
  }
}`}</code>
        </pre>

        <h2>Deno Configuration</h2>
        <p>For Deno projects, add to your deno.json:</p>
        <pre>
          <code>{`{
  "imports": {
    "solid-js": "npm:solid-js@^1.9.0",
    "@proyecto-viviana/ui": "jsr:@proyecto-viviana/ui@^0.1.8",
    "@proyecto-viviana/solidaria": "jsr:@proyecto-viviana/solidaria@^0.0.7"
  },
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "solid-js"
  }
}`}</code>
        </pre>
      </article>
    </div>
  );
}
