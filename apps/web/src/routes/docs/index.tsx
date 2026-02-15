import { Link, createFileRoute } from "@tanstack/solid-router";
import { Button } from "@proyecto-viviana/ui";

export const Route = createFileRoute("/docs/")({
  component: GettingStartedPage,
});

function GettingStartedPage() {
  return (
    <div class="mx-auto max-w-3xl px-8 py-12">
      <article class="prose">
        <h1>Getting Started</h1>
        <p>
          Proyecto Viviana is a SolidJS component library inspired by Adobe's React Spectrum. It
          provides accessible, high-quality UI components built on top of solidaria - a port of
          React Aria for SolidJS.
        </p>

        <h2>Features</h2>
        <ul class="list-disc pl-6 space-y-2">
          <li>
            <strong>Accessible by default</strong> - Built on WAI-ARIA patterns with full keyboard
            navigation
          </li>
          <li>
            <strong>60+ Components</strong> - From buttons to data tables, calendars to color
            pickers
          </li>
          <li>
            <strong>100+ ARIA Hooks</strong> - Low-level hooks for building custom accessible
            components
          </li>
          <li>
            <strong>SSR Compatible</strong> - Works with TanStack Start and other SSR frameworks
          </li>
          <li>
            <strong>Tailwind CSS v4</strong> - Modern styling with CSS variables
          </li>
        </ul>

        <h2>Quick Example</h2>
        <p>Here's a simple button component in action:</p>

        <div class="not-prose my-6 flex gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="accent">Accent</Button>
        </div>

        <pre>
          <code>{`import { Button } from '@proyecto-viviana/ui';

function App() {
  const [pressed, setPressed] = createSignal(false);

  return (
    <Button onPress={() => setPressed(true)}>
      {pressed() ? 'Pressed' : 'Click me'}
    </Button>
  );
}`}</code>
        </pre>

        <h2>Package Architecture</h2>
        <p>The library is organized into four packages:</p>

        <div class="not-prose my-6 space-y-4">
          <div class="rounded-lg border border-bg-200 p-4">
            <h4 class="font-semibold text-primary-400">@proyecto-viviana/solid-stately</h4>
            <p class="text-sm text-bg-500 mt-1">
              State management hooks (createToggleState, createListState, etc.)
            </p>
          </div>
          <div class="rounded-lg border border-bg-200 p-4">
            <h4 class="font-semibold text-primary-400">@proyecto-viviana/solidaria</h4>
            <p class="text-sm text-bg-500 mt-1">
              ARIA hooks for accessibility (createButton, createMenu, etc.)
            </p>
          </div>
          <div class="rounded-lg border border-bg-200 p-4">
            <h4 class="font-semibold text-primary-400">@proyecto-viviana/solidaria-components</h4>
            <p class="text-sm text-bg-500 mt-1">
              Headless components with render props (Button, Menu, Dialog, etc.)
            </p>
          </div>
          <div class="rounded-lg border border-bg-200 p-4">
            <h4 class="font-semibold text-primary-400">@proyecto-viviana/ui</h4>
            <p class="text-sm text-bg-500 mt-1">
              Styled components ready to use (Button, Select, Table, etc.)
            </p>
          </div>
        </div>

        <h2>Next Steps</h2>
        <ul class="list-disc pl-6 space-y-2">
          <li>
            <Link to="/docs/installation" class="text-primary-400 hover:underline">
              Installation
            </Link>{" "}
            - Set up the packages in your project
          </li>
          <li>
            <Link to="/docs/components/button" class="text-primary-400 hover:underline">
              Components
            </Link>{" "}
            - Explore the component library
          </li>
          <li>
            <Link to="/docs/hooks/create-button" class="text-primary-400 hover:underline">
              Hooks
            </Link>{" "}
            - Build custom components with ARIA hooks
          </li>
        </ul>
      </article>
    </div>
  );
}
