import { createFileRoute, Link } from '@tanstack/solid-router'
import { createSignal, For, Show } from 'solid-js'
import { Button } from '@proyecto-viviana/ui'
import { createButton, createPress } from '@proyecto-viviana/solidaria'

export const Route = createFileRoute('/docs')({
  component: Docs,
})

type DocPage = 'getting-started' | 'installation' | 'button' | 'create-button' | 'create-press'

function Docs() {
  const [currentPage, setCurrentPage] = createSignal<DocPage>('getting-started')

  const navItems = [
    { label: 'Getting Started', id: 'getting-started' as DocPage },
    { label: 'Installation', id: 'installation' as DocPage },
    {
      section: 'Components',
      items: [{ label: 'Button', id: 'button' as DocPage }],
    },
    {
      section: 'Hooks',
      items: [
        { label: 'createButton', id: 'create-button' as DocPage },
        { label: 'createPress', id: 'create-press' as DocPage },
      ],
    },
  ]

  return (
    <div class="flex min-h-screen">
      <aside class="w-64 shrink-0 border-r border-bg-200 bg-white">
        <div class="sticky top-0 p-6">
          <Link to="/" class="flex items-center gap-2 text-xl font-bold text-bg-900">
            <span class="text-2xl gradient-text">V</span>
            <span>Viviana</span>
          </Link>
          <p class="mt-1 text-sm text-bg-500">Documentation</p>
        </div>

        <nav class="px-4 pb-6">
          <For each={navItems}>
            {(item) => {
              if ('section' in item) {
                return (
                  <div class="mt-6">
                    <h3 class="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-bg-400">
                      {item.section}
                    </h3>
                    <For each={item.items}>
                      {(subItem) => (
                        <button
                          onClick={() => setCurrentPage(subItem.id)}
                          class={`sidebar-link w-full text-left ${currentPage() === subItem.id ? 'active' : ''}`}
                        >
                          {subItem.label}
                        </button>
                      )}
                    </For>
                  </div>
                )
              }
              return (
                <button
                  onClick={() => setCurrentPage(item.id)}
                  class={`sidebar-link w-full text-left ${currentPage() === item.id ? 'active' : ''}`}
                >
                  {item.label}
                </button>
              )
            }}
          </For>
        </nav>
      </aside>

      <main class="flex-1 overflow-auto">
        <Show when={currentPage() === 'getting-started'}>
          <GettingStartedPage />
        </Show>
        <Show when={currentPage() === 'installation'}>
          <InstallationPage />
        </Show>
        <Show when={currentPage() === 'button'}>
          <ButtonPage />
        </Show>
        <Show when={currentPage() === 'create-button'}>
          <CreateButtonPage />
        </Show>
        <Show when={currentPage() === 'create-press'}>
          <CreatePressPage />
        </Show>
      </main>
    </div>
  )
}

function GettingStartedPage() {
  return (
    <div class="mx-auto max-w-3xl px-8 py-12">
      <article class="prose">
        <h1>Getting Started</h1>
        <p>
          Proyecto Viviana is a SolidJS component library inspired by Adobe's React Spectrum.
          It provides accessible, high-quality UI components built on top of solidaria - a port of React Aria for SolidJS.
        </p>

        <h2>Features</h2>
        <ul class="list-disc pl-6 space-y-2">
          <li>Accessible by default - built on WAI-ARIA patterns</li>
          <li>Keyboard navigation support</li>
          <li>Screen reader friendly</li>
          <li>SSR compatible with TanStack Start</li>
          <li>Tailwind CSS v4 styling</li>
        </ul>

        <h2>Quick Example</h2>
        <p>Here's a simple button component in action:</p>

        <div class="not-prose my-6 flex gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="accent">Accent</Button>
        </div>

        <pre><code>{`import { Button } from '@proyecto-viviana/ui';

function App() {
  return (
    <Button onPress={() => console.log('Clicked!')}>
      Click me
    </Button>
  );
}`}</code></pre>

        <h2>Architecture</h2>
        <p>The library is split into two packages:</p>
        <ul class="list-disc pl-6 space-y-2">
          <li><code>@proyecto-viviana/solidaria</code> - Headless accessibility primitives</li>
          <li><code>@proyecto-viviana/ui</code> - Styled components built on solidaria</li>
        </ul>
      </article>
    </div>
  )
}

function InstallationPage() {
  return (
    <div class="mx-auto max-w-3xl px-8 py-12">
      <article class="prose">
        <h1>Installation</h1>
        <p>Install Proyecto Viviana packages using your preferred package manager.</p>

        <h2>Using bun</h2>
        <pre><code>{`bun add @proyecto-viviana/ui @proyecto-viviana/solidaria`}</code></pre>

        <h2>Using npm</h2>
        <pre><code>{`npm install @proyecto-viviana/ui @proyecto-viviana/solidaria`}</code></pre>

        <h2>Using pnpm</h2>
        <pre><code>{`pnpm add @proyecto-viviana/ui @proyecto-viviana/solidaria`}</code></pre>

        <h2>Peer Dependencies</h2>
        <p>Make sure you have SolidJS installed:</p>
        <pre><code>{`bun add solid-js`}</code></pre>

        <h2>Tailwind CSS Setup</h2>
        <p>The UI components use Tailwind CSS v4. Add the theme to your CSS:</p>
        <pre><code>{`@import "tailwindcss";

@theme {
  --color-primary-500: #6366f1;
  --color-primary-600: #4f46e5;
  /* ... more colors */
}`}</code></pre>
      </article>
    </div>
  )
}

function ButtonPage() {
  const [count, setCount] = createSignal(0)

  return (
    <div class="mx-auto max-w-3xl px-8 py-12">
      <article class="prose">
        <h1>Button</h1>
        <p>Buttons allow users to perform actions with a single click or tap.</p>

        <h2>Import</h2>
        <pre><code>{`import { Button } from '@proyecto-viviana/ui';`}</code></pre>

        <h2>Variants</h2>
        <div class="not-prose my-6 flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="negative">Negative</Button>
        </div>

        <h2>Styles</h2>
        <div class="not-prose my-6 space-y-4">
          <div class="flex flex-wrap gap-3">
            <Button style="fill">Fill (default)</Button>
            <Button style="outline">Outline</Button>
          </div>
        </div>

        <h2>Disabled State</h2>
        <div class="not-prose my-6 flex gap-3">
          <Button isDisabled>Disabled</Button>
        </div>

        <h2>Press Events</h2>
        <div class="not-prose my-6">
          <Button onPress={() => setCount(c => c + 1)}>
            Clicked {count()} times
          </Button>
        </div>

        <h2>Props</h2>
        <div class="not-prose my-6 overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-bg-200">
                <th class="py-2 pr-4 text-left font-semibold">Prop</th>
                <th class="py-2 pr-4 text-left font-semibold">Type</th>
                <th class="py-2 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-bg-100">
              <tr>
                <td class="py-2 pr-4"><code>variant</code></td>
                <td class="py-2 pr-4 text-bg-500">'primary' | 'secondary' | 'accent' | 'negative'</td>
                <td class="py-2">Visual style variant</td>
              </tr>
              <tr>
                <td class="py-2 pr-4"><code>style</code></td>
                <td class="py-2 pr-4 text-bg-500">'fill' | 'outline'</td>
                <td class="py-2">Background style</td>
              </tr>
              <tr>
                <td class="py-2 pr-4"><code>isDisabled</code></td>
                <td class="py-2 pr-4 text-bg-500">boolean</td>
                <td class="py-2">Whether the button is disabled</td>
              </tr>
              <tr>
                <td class="py-2 pr-4"><code>onPress</code></td>
                <td class="py-2 pr-4 text-bg-500">(e: PressEvent) =&gt; void</td>
                <td class="py-2">Handler called when pressed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </div>
  )
}

function CreateButtonPage() {
  return (
    <div class="mx-auto max-w-3xl px-8 py-12">
      <article class="prose">
        <h1>createButton</h1>
        <p>
          Provides the behavior and accessibility implementation for a button component.
          Use this hook when you need full control over the button's appearance.
        </p>

        <h2>Import</h2>
        <pre><code>{`import { createButton } from '@proyecto-viviana/solidaria';`}</code></pre>

        <h2>Usage</h2>
        <pre><code>{`function CustomButton(props) {
  const { buttonProps, isPressed } = createButton({
    onPress: props.onPress,
    isDisabled: props.isDisabled,
  });

  return (
    <button
      {...buttonProps}
      class={isPressed() ? 'pressed' : ''}
    >
      {props.children}
    </button>
  );
}`}</code></pre>

        <h2>Example</h2>
        <div class="not-prose my-6">
          <CustomGradientButton onPress={() => alert('Custom button pressed!')}>
            Custom Gradient Button
          </CustomGradientButton>
        </div>

        <h2>Return Value</h2>
        <div class="not-prose my-6 overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-bg-200">
                <th class="py-2 pr-4 text-left font-semibold">Property</th>
                <th class="py-2 pr-4 text-left font-semibold">Type</th>
                <th class="py-2 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-bg-100">
              <tr>
                <td class="py-2 pr-4"><code>buttonProps</code></td>
                <td class="py-2 pr-4 text-bg-500">JSX.HTMLAttributes</td>
                <td class="py-2">Props to spread on the button element</td>
              </tr>
              <tr>
                <td class="py-2 pr-4"><code>isPressed</code></td>
                <td class="py-2 pr-4 text-bg-500">Accessor&lt;boolean&gt;</td>
                <td class="py-2">Signal indicating pressed state</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </div>
  )
}

function CustomGradientButton(props: { onPress?: () => void; children: string }) {
  const { buttonProps, isPressed } = createButton({
    onPress: props.onPress,
  })

  return (
    <button
      {...buttonProps}
      class={`rounded-lg bg-linear-to-r from-purple-500 to-pink-500 px-6 py-3 font-medium text-white shadow-md transition-all hover:shadow-lg ${
        isPressed() ? 'scale-[0.98] shadow-sm' : ''
      }`}
    >
      {props.children}
    </button>
  )
}

function CreatePressPage() {
  const [pressCount, setPressCount] = createSignal(0)
  const [lastPointerType, setLastPointerType] = createSignal('none')

  const { pressProps, isPressed } = createPress({
    onPress: (e) => {
      setPressCount(c => c + 1)
      setLastPointerType(e.pointerType)
    },
  })

  return (
    <div class="mx-auto max-w-3xl px-8 py-12">
      <article class="prose">
        <h1>createPress</h1>
        <p>
          Handles press interactions across mouse, touch, keyboard, and virtual clicks.
          This is the foundation for <code>createButton</code>.
        </p>

        <h2>Import</h2>
        <pre><code>{`import { createPress } from '@proyecto-viviana/solidaria';`}</code></pre>

        <h2>Usage</h2>
        <pre><code>{`function PressableCard(props) {
  const { pressProps, isPressed } = createPress({
    onPress: props.onPress,
  });

  return (
    <div
      {...pressProps}
      class={isPressed() ? 'bg-gray-100' : 'bg-white'}
    >
      {props.children}
    </div>
  );
}`}</code></pre>

        <h2>Example</h2>
        <div class="not-prose my-6">
          <div
            {...pressProps}
            tabIndex={0}
            role="button"
            class={`cursor-pointer rounded-xl border-2 p-6 transition-all select-none ${
              isPressed()
                ? 'border-primary-500 bg-primary-50 scale-[0.98]'
                : 'border-bg-200 bg-white hover:border-bg-300'
            }`}
          >
            <p class="text-lg font-medium">Press count: {pressCount()}</p>
            <p class="text-sm text-bg-500">Last input: {lastPointerType()}</p>
            <p class="mt-2 text-xs text-bg-400">Try clicking, touching, or pressing Enter/Space</p>
          </div>
        </div>

        <h2>Parameters</h2>
        <div class="not-prose my-6 overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-bg-200">
                <th class="py-2 pr-4 text-left font-semibold">Prop</th>
                <th class="py-2 pr-4 text-left font-semibold">Type</th>
                <th class="py-2 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-bg-100">
              <tr>
                <td class="py-2 pr-4"><code>isDisabled</code></td>
                <td class="py-2 pr-4 text-bg-500">boolean</td>
                <td class="py-2">Whether press is disabled</td>
              </tr>
              <tr>
                <td class="py-2 pr-4"><code>onPress</code></td>
                <td class="py-2 pr-4 text-bg-500">(e: PressEvent) =&gt; void</td>
                <td class="py-2">Handler for completed press</td>
              </tr>
              <tr>
                <td class="py-2 pr-4"><code>onPressStart</code></td>
                <td class="py-2 pr-4 text-bg-500">(e: PressEvent) =&gt; void</td>
                <td class="py-2">Handler when press starts</td>
              </tr>
              <tr>
                <td class="py-2 pr-4"><code>onPressEnd</code></td>
                <td class="py-2 pr-4 text-bg-500">(e: PressEvent) =&gt; void</td>
                <td class="py-2">Handler when press ends</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </div>
  )
}
