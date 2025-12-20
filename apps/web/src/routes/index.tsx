import { createFileRoute, Link } from "@tanstack/solid-router";
import { createSignal, For } from "solid-js";
import { Button, GitHubIcon, Icon } from "@proyecto-viviana/ui";
import { createButton } from "@proyecto-viviana/solidaria";
import { Header } from "@/components";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div class="vui-landing">
      <Header />
      <Hero />
      <Features />
      <ComponentShowcase />
      <CodeExample />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section class="vui-hero">
      <div class="vui-hero__container">
        <h1 class="vui-hero__title">
          <span>Beautiful, Accessible</span>
          <br />
          <span class="vui-gradient-text">SolidJS Components</span>
        </h1>
        <p class="vui-hero__subtitle">
          A carefully crafted component library for SolidJS, inspired by Adobe's React Spectrum.
          Built with accessibility-first patterns from React Aria.
        </p>
        <div class="vui-hero__actions">
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
    <section class="vui-section">
      <div class="vui-section__container">
        <div class="vui-section__header">
          <h2 class="vui-section__title">Why should I use Proyecto Viviana?</h2>
          <p class="vui-section__description">
            Everything you need to build accessible, beautiful applications
          </p>
        </div>

        <div class="vui-feature-grid">
          <For each={features}>
            {(feature) => (
              <div class="vui-feature-card">
                <div class="vui-feature-card__icon">{feature.icon}</div>
                <h3 class="vui-feature-card__title">{feature.title}</h3>
                <p class="vui-feature-card__description">{feature.description}</p>
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
    <section class="vui-section vui-section--alt">
      <div class="vui-section__container">
        <div class="vui-section__header">
          <h2 class="vui-section__title">Component Preview</h2>
          <p class="vui-section__description">Beautifully styled, fully interactive components</p>
        </div>

        <div class="vui-feature-card" style={{ "max-width": "48rem", margin: "0 auto" }}>
          <h3 class="vui-feature-card__title" style={{ "margin-bottom": "1.5rem" }}>
            Button Variants
          </h3>

          <div style={{ display: "flex", "flex-direction": "column", gap: "1.5rem" }}>
            <div>
              <p
                class="vui-feature-card__description"
                style={{ "margin-bottom": "0.75rem", "font-weight": "500" }}
              >
                Filled Buttons
              </p>
              <div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.75rem" }}>
                <Button variant="primary" onPress={() => setCount((c) => c + 1)}>
                  Count: {count()}
                </Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="accent">Accent</Button>
                <Button variant="positive">Positive</Button>
                <Button variant="negative">Negative</Button>
                <Button isDisabled>Disabled</Button>
              </div>
            </div>

            <div>
              <p
                class="vui-feature-card__description"
                style={{ "margin-bottom": "0.75rem", "font-weight": "500" }}
              >
                Outline Buttons
              </p>
              <div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.75rem" }}>
                <Button variant="primary" style="outline">
                  Primary
                </Button>
                <Button variant="secondary" style="outline">
                  Secondary
                </Button>
                <Button variant="accent" style="outline">
                  Accent
                </Button>
                <Button variant="positive" style="outline">
                  Positive
                </Button>
                <Button variant="negative" style="outline">
                  Negative
                </Button>
              </div>
            </div>

            <div>
              <p
                class="vui-feature-card__description"
                style={{ "margin-bottom": "0.75rem", "font-weight": "500" }}
              >
                Custom with createButton Hook
              </p>
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
      class={`rounded-lg bg-linear-to-r from-primary-500 to-accent px-6 py-3 font-medium text-white shadow-md transition-all hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
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
    <section class="vui-section">
      <div class="vui-section__container vui-section__container--narrow">
        <div class="vui-section__header">
          <h2 class="vui-section__title">Simple to Use</h2>
          <p class="vui-section__description">Two packages, one goal: making accessible UIs easy</p>
        </div>

        <div class="vui-code-block">
          <div class="vui-code-block__header">
            <div class="vui-code-block__dot vui-code-block__dot--red" />
            <div class="vui-code-block__dot vui-code-block__dot--yellow" />
            <div class="vui-code-block__dot vui-code-block__dot--green" />
            <span class="vui-code-block__filename">example.tsx</span>
          </div>
          <div class="vui-code-block__content">
            <pre>
              <code class="vui-code-block__code">{code}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer class="vui-footer">
      <div class="vui-footer__container">
        <p class="vui-footer__text">The Accessible and Performant Web Toolkit</p>
        <div class="vui-footer__links">
          <Link to="/docs" class="vui-footer__link">
            Documentation
          </Link>
          <Link to="/playground" class="vui-footer__link">
            Playground
          </Link>
          <a
            href="https://github.com/proyecto-viviana/proyecto-viviana"
            class="vui-header__link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <Icon icon={GitHubIcon} size={20} withShadow />
          </a>
        </div>
      </div>
    </footer>
  );
}
