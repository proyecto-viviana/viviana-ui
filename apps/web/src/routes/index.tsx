import { createFileRoute, Link } from "@tanstack/solid-router";
import { createSignal, For } from "solid-js";
import { Button, Logo } from "@proyecto-viviana/ui";
import { createButton } from "@proyecto-viviana/solidaria";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div class="flex flex-col">
      <Header />
      <Hero />
      <Features />
      <ComponentShowcase />
      <CodeExample />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header class="fixed top-0 left-0 right-0 z-50 border-b-2 border-accent bg-bg-400/80 backdrop-blur-sm">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" class="flex items-center">
          <Logo size="sm" />
        </Link>
        <nav class="flex items-center gap-6">
          <Link to="/docs" class="text-sm font-medium text-primary-300 hover:text-primary-100">
            Docs
          </Link>
          <Link
            to="/playground"
            class="text-sm font-medium text-primary-300 hover:text-primary-100"
          >
            Playground
          </Link>
          <a
            href="https://github.com/proyecto-viviana/proyecto-viviana"
            class="text-sm font-medium text-primary-300 hover:text-primary-100"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <Link to="/docs">
            <Button variant="primary" style="fill">
              Get Started
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section class="hero-gradient pt-32 pb-20">
      <div class="mx-auto max-w-4xl px-6 text-center">
        <h1 class="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl text-primary-100">
          <span class="block">Beautiful, Accessible</span>
          <span class="block gradient-text">SolidJS Components</span>
        </h1>
        <p class="mx-auto mt-6 max-w-2xl text-xl text-primary-300">
          A carefully crafted component library for SolidJS, inspired by Adobe's React Spectrum.
          Built with accessibility-first patterns from React Aria.
        </p>
        <div class="mt-10 flex justify-center gap-4">
          <Link to="/docs">
            <Button variant="primary">Read the Docs</Button>
          </Link>
          <Link to="/playground">
            <Button variant="secondary" style="outline">
              Try the Playground
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      title: "Accessible by Default",
      description:
        "Built on WAI-ARIA patterns from React Aria. Screen reader friendly, keyboard navigable.",
      icon: "♿",
    },
    {
      title: "SolidJS Native",
      description:
        "Fine-grained reactivity with signals. No React overhead, pure SolidJS primitives.",
      icon: "⚡",
    },
    {
      title: "SSR Ready",
      description: "Works seamlessly with TanStack Start, Astro, and other SSR frameworks.",
      icon: "🌐",
    },
    {
      title: "Tailwind v4",
      description: "Modern CSS with the new @theme syntax. Easily customize with CSS variables.",
      icon: "🎨",
    },
    {
      title: "TypeScript First",
      description: "Full type safety with comprehensive TypeScript definitions out of the box.",
      icon: "📝",
    },
    {
      title: "Two-Layer Architecture",
      description: "Use styled components or headless hooks. Your choice, maximum flexibility.",
      icon: "🏗️",
    },
  ];

  return (
    <section class="py-20 bg-bg-400">
      <div class="mx-auto max-w-6xl px-6">
        <h2 class="text-center text-3xl font-bold text-primary-100">Why Viviana?</h2>
        <p class="mx-auto mt-4 max-w-2xl text-center text-lg text-primary-300">
          Everything you need to build accessible, beautiful applications
        </p>

        <div class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <For each={features}>
            {(feature) => (
              <div class="rounded-xl border border-bg-100 bg-bg-200 p-6 shadow-sm transition-shadow hover:shadow-md">
                <div class="mb-4 text-3xl">{feature.icon}</div>
                <h3 class="text-lg font-semibold text-primary-100">{feature.title}</h3>
                <p class="mt-2 text-primary-300">{feature.description}</p>
              </div>
            )}
          </For>
        </div>
      </div>
    </section>
  );
}

function ComponentShowcase() {
  const [count, setCount] = createSignal(0);

  return (
    <section class="bg-bg-300 py-20">
      <div class="mx-auto max-w-6xl px-6">
        <h2 class="text-center text-3xl font-bold text-primary-100">Component Preview</h2>
        <p class="mx-auto mt-4 max-w-2xl text-center text-lg text-primary-300">
          Beautifully styled, fully interactive components
        </p>

        <div class="mt-12 rounded-2xl border border-bg-100 bg-bg-200 p-8 shadow-lg">
          <h3 class="mb-6 text-xl font-semibold text-primary-100">Button Variants</h3>

          <div class="space-y-6">
            <div>
              <p class="mb-3 text-sm font-medium text-primary-400">Filled Buttons</p>
              <div class="flex flex-wrap gap-3">
                <Button variant="primary" onPress={() => setCount((c) => c + 1)}>
                  Count: {count()}
                </Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="accent">Accent</Button>
                <Button variant="negative">Negative</Button>
                <Button isDisabled>Disabled</Button>
              </div>
            </div>

            <div>
              <p class="mb-3 text-sm font-medium text-primary-400">Outline Buttons</p>
              <div class="flex flex-wrap gap-3">
                <Button variant="primary" style="outline">
                  Primary
                </Button>
                <Button variant="secondary" style="outline">
                  Secondary
                </Button>
                <Button variant="accent" style="outline">
                  Accent
                </Button>
                <Button variant="negative" style="outline">
                  Negative
                </Button>
              </div>
            </div>

            <div>
              <p class="mb-3 text-sm font-medium text-primary-400">Custom with createButton Hook</p>
              <CustomGradientButton onPress={() => alert("Custom button works!")}>
                Gradient Button
              </CustomGradientButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CustomGradientButton(props: { onPress?: () => void; children: string }) {
  const { buttonProps, isPressed } = createButton({
    onPress: props.onPress,
  });

  return (
    <button
      {...buttonProps}
      class={`rounded-lg bg-gradient-to-r from-primary-500 to-accent px-6 py-3 font-medium text-white shadow-md transition-all hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        isPressed() ? "scale-[0.98] shadow-sm" : ""
      }`}
    >
      {props.children}
    </button>
  );
}

function CodeExample() {
  const code = `import { Button } from 'proyecto-viviana-ui';
import { createButton } from 'solidaria';

// Use the styled component
function App() {
  return (
    <Button variant="primary" onPress={() => console.log('Clicked!')}>
      Click me
    </Button>
  );
}

// Or use the headless hook for full control
function CustomButton(props) {
  const { buttonProps, isPressed } = createButton({
    onPress: props.onPress,
  });

  return (
    <button {...buttonProps} class={isPressed() ? 'pressed' : ''}>
      {props.children}
    </button>
  );
}`;

  return (
    <section class="py-20 bg-bg-400">
      <div class="mx-auto max-w-4xl px-6">
        <h2 class="text-center text-3xl font-bold text-primary-100">Simple to Use</h2>
        <p class="mx-auto mt-4 max-w-2xl text-center text-lg text-primary-300">
          Two packages, one goal: making accessible UIs easy
        </p>

        <div class="mt-12 overflow-hidden rounded-xl border border-bg-100 bg-bg-300 shadow-2xl">
          <div class="flex items-center gap-2 border-b border-bg-200 px-4 py-3">
            <div class="h-3 w-3 rounded-full bg-danger-400" />
            <div class="h-3 w-3 rounded-full bg-warning-400" />
            <div class="h-3 w-3 rounded-full bg-success-400" />
            <span class="ml-4 text-sm text-primary-400">example.tsx</span>
          </div>
          <pre class="overflow-x-auto p-6 text-sm leading-relaxed">
            <code class="text-primary-200">{code}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer class="border-t border-bg-300 bg-bg-400 py-12">
      <div class="mx-auto max-w-6xl px-6">
        <div class="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Logo size="sm" />
          <div class="flex gap-6 text-sm text-primary-300">
            <Link to="/docs" class="hover:text-primary-100">
              Documentation
            </Link>
            <Link to="/playground" class="hover:text-primary-100">
              Playground
            </Link>
            <a
              href="https://github.com/proyecto-viviana/proyecto-viviana"
              class="hover:text-primary-100"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
        <p class="mt-8 text-center text-sm text-primary-400">
          Built with SolidJS and love. Inspired by React Spectrum.
        </p>
      </div>
    </footer>
  );
}
