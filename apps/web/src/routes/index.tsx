import { createFileRoute, Link } from "@tanstack/solid-router";
import { createSignal, For, onMount, Show } from "solid-js";
import {
  Button,
  GitHubIcon,
  PageLayout,
  TextField,
  Checkbox,
  ProgressBar,
  Slider as StyledSlider,
  Separator,
  Tooltip,
  TooltipTrigger,
  ToastProvider,
  ToastRegion,
  toastSuccess,
  Tabs as StyledTabs,
  TabList as StyledTabList,
  Tab as StyledTab,
  TabPanel as StyledTabPanel,
} from "@proyecto-viviana/ui";
import { createButton } from "@proyecto-viviana/solidaria";
import { Header } from "@/components";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <ToastProvider useGlobalQueue>
    <PageLayout>
      <Header />
      <main class="relative overflow-hidden">
        <Hero />
        <Features />
        <ComponentShowcase />
        <ComponentShowcaseExpanded />
        <CodeExample />
        <CallToAction />
        <Footer />
      </main>
      <ToastRegion placement="bottom-end" />
    </PageLayout>
    </ToastProvider>
  );
}

/* ============================================
   HERO SECTION - Crystalline Gateway
   ============================================ */
function Hero() {
  const [mounted, setMounted] = createSignal(false);

  onMount(() => {
    // Trigger entrance animations after mount
    setTimeout(() => setMounted(true), 100);
  });

  return (
    <section class="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated gradient mesh background */}
      <div class="absolute inset-0 gradient-mesh-animated" />

      {/* Floating crystal shapes */}
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingCrystal
          class="absolute top-[15%] left-[10%] w-32 h-32 opacity-20"
          delay={0}
        />
        <FloatingCrystal
          class="absolute top-[60%] right-[8%] w-24 h-24 opacity-15"
          delay={2}
        />
        <FloatingCrystal
          class="absolute bottom-[20%] left-[15%] w-20 h-20 opacity-10"
          delay={4}
        />
        <FloatingCrystal
          class="absolute top-[30%] right-[20%] w-16 h-16 opacity-20"
          delay={1}
        />

        {/* Glowing orbs */}
        <div class="absolute top-[20%] right-[15%] w-64 h-64 rounded-full bg-accent/10 blur-[100px] animate-pulse-glow" />
        <div class="absolute bottom-[30%] left-[10%] w-48 h-48 rounded-full bg-primary-500/15 blur-[80px] animate-pulse-glow delay-500" />
      </div>

      {/* Grid pattern overlay */}
      <div class="absolute inset-0 pattern-grid opacity-50" />

      {/* Content */}
      <div class="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div
          class={`inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 transition-all duration-700 ${
            mounted() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span class="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          <span class="text-sm font-medium text-primary-300">
            3600+ Tests Passing
          </span>
        </div>

        {/* Main title with animated gradient */}
        <h1
          class={`font-jost text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 transition-all duration-700 delay-100 ${
            mounted() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span class="gradient-text-animated">
            Accessible Components
          </span>
          <br />
          <span class="text-primary-100">
            for{" "}
            <span class="relative inline-block">
              SolidJS
              <svg
                class="absolute -bottom-2 left-0 w-full h-3 text-accent"
                viewBox="0 0 200 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 10C50 4 150 4 198 10"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  class="animate-[lattice-draw_1s_ease-out_0.8s_forwards]"
                  style={{ "stroke-dasharray": "200", "stroke-dashoffset": "200" }}
                />
              </svg>
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p
          class={`text-lg sm:text-xl text-primary-300 max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-200 ${
            mounted() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          A meticulously crafted component library inspired by Adobe's React Spectrum.
          Built with{" "}
          <span class="text-accent-200 font-medium">accessibility-first patterns</span>{" "}
          and fine-grained reactivity.
        </p>

        {/* CTA Buttons */}
        <div
          class={`flex flex-wrap justify-center gap-4 transition-all duration-700 delay-300 ${
            mounted() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Link to="/docs">
            <Button variant="accent" size="lg" class="hover-lift glow-accent">
              Get Started
            </Button>
          </Link>
          <Link to="/playground">
            <Button variant="secondary" buttonStyle="outline" size="lg" class="hover-lift">
              Try Playground
            </Button>
          </Link>
        </div>

        {/* Tech stack badges */}
        <div
          class={`flex flex-wrap justify-center gap-3 mt-12 transition-all duration-700 delay-400 ${
            mounted() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <TechBadge>TypeScript</TechBadge>
          <TechBadge>Tailwind v4</TechBadge>
          <TechBadge>SSR Ready</TechBadge>
          <TechBadge>WAI-ARIA</TechBadge>
        </div>
      </div>

      {/* Scroll indicator */}
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div class="w-6 h-10 rounded-full border-2 border-primary-500/50 flex justify-center pt-2">
          <div class="w-1.5 h-3 rounded-full bg-primary-500/50 animate-[fade-in-up_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
}

function FloatingCrystal(props: { class?: string; delay?: number }) {
  return (
    <div
      class={`${props.class} animate-float`}
      style={{ "animation-delay": `${props.delay || 0}s` }}
    >
      <svg viewBox="0 0 100 100" fill="none" class="w-full h-full">
        <polygon
          points="50,5 95,35 80,90 20,90 5,35"
          fill="url(#crystal-gradient)"
          stroke="rgba(173, 204, 220, 0.3)"
          stroke-width="1"
        />
        <polygon
          points="50,5 50,90 20,90 5,35"
          fill="rgba(117, 171, 199, 0.1)"
        />
        <defs>
          <linearGradient id="crystal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(223, 92, 154, 0.2)" />
            <stop offset="100%" stop-color="rgba(117, 171, 199, 0.2)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function TechBadge(props: { children: string }) {
  return (
    <span class="px-3 py-1.5 text-xs font-medium text-primary-400 bg-bg-300/50 rounded-full border border-primary-700/50 hover:border-accent/50 hover:text-accent-200 transition-colors">
      {props.children}
    </span>
  );
}

/* ============================================
   FEATURES SECTION - Feature Prisms
   ============================================ */
function Features() {
  const features = [
    {
      title: "Accessible by Default",
      description:
        "Built on WAI-ARIA patterns from React Aria. Screen reader friendly, keyboard navigable, and WCAG compliant.",
      icon: AccessibilityIcon,
      gradient: "from-accent to-accent-300",
    },
    {
      title: "Fine-Grained Reactivity",
      description:
        "Leverages SolidJS signals for surgical DOM updates. No virtual DOM overhead, just pure performance.",
      icon: ReactivityIcon,
      gradient: "from-primary-400 to-primary-500",
    },
    {
      title: "SSR & Hydration",
      description:
        "Works seamlessly with TanStack Start, Astro, and other SSR frameworks. Proper hydration out of the box.",
      icon: ServerIcon,
      gradient: "from-success-400 to-success-600",
    },
    {
      title: "Modern Styling",
      description:
        "Tailwind CSS v4 with the new @theme syntax. CSS variables make customization a breeze.",
      icon: PaletteIcon,
      gradient: "from-accent-200 to-accent",
    },
    {
      title: "Type Safe",
      description:
        "Comprehensive TypeScript definitions with strict types. Full IntelliSense support in your IDE.",
      icon: TypeScriptIcon,
      gradient: "from-primary-300 to-primary-600",
    },
    {
      title: "Flexible Architecture",
      description:
        "Use styled components or headless hooks. Four architectural layers give you maximum control.",
      icon: LayersIcon,
      gradient: "from-warning-400 to-warning-600",
    },
  ];

  return (
    <section class="relative py-24 overflow-hidden">
      {/* Background */}
      <div class="absolute inset-0 bg-bg-200" />
      <div class="absolute inset-0 pattern-crystal" />

      <div class="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div class="text-center mb-16">
          <h2 class="font-jost text-3xl sm:text-4xl font-bold text-primary-100 mb-4">
            Why Choose{" "}
            <span class="text-accent">Proyecto Viviana</span>?
          </h2>
          <p class="text-primary-300 max-w-xl mx-auto">
            Everything you need to build accessible, beautiful applications with SolidJS
          </p>
        </div>

        {/* Feature grid */}
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <For each={features}>
            {(feature, index) => (
              <FeatureCard feature={feature} index={index()} />
            )}
          </For>
        </div>
      </div>
    </section>
  );
}

function FeatureCard(props: {
  feature: {
    title: string;
    description: string;
    icon: (props: { class?: string }) => any;
    gradient: string;
  };
  index: number;
}) {
  return (
    <div
      class="group relative p-6 rounded-xl glass hover-lift cursor-default"
      style={{ "animation-delay": `${props.index * 0.1}s` }}
    >
      {/* Hover glow effect */}
      <div
        class={`absolute inset-0 rounded-xl bg-linear-to-br ${props.feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
      />

      {/* Icon */}
      <div
        class={`relative w-12 h-12 rounded-lg bg-linear-to-br ${props.feature.gradient} p-2.5 mb-4 transition-transform duration-300 group-hover:scale-110`}
      >
        <props.feature.icon class="w-full h-full text-white" />
      </div>

      {/* Content */}
      <h3 class="font-jost text-lg font-semibold text-primary-100 mb-2 group-hover:text-accent-200 transition-colors">
        {props.feature.title}
      </h3>
      <p class="text-sm text-primary-400 leading-relaxed">
        {props.feature.description}
      </p>

      {/* Corner accent */}
      <div class="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-xl">
        <div
          class={`absolute -top-8 -right-8 w-16 h-16 bg-linear-to-br ${props.feature.gradient} opacity-0 group-hover:opacity-20 rotate-45 transition-opacity duration-300`}
        />
      </div>
    </div>
  );
}

/* ============================================
   COMPONENT SHOWCASE - Living Demo
   ============================================ */
function ComponentShowcase() {
  const [count, setCount] = createSignal(0);
  const [activeVariant, setActiveVariant] = createSignal<"fill" | "outline">("fill");

  return (
    <section class="relative py-24 overflow-hidden">
      {/* Background */}
      <div class="absolute inset-0 bg-bg-300" />
      <div class="absolute inset-0 pattern-dots opacity-30" />

      {/* Decorative gradients */}
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
      <div class="absolute bottom-0 right-1/4 w-80 h-80 bg-primary-500/10 rounded-full blur-[100px]" />

      <div class="relative z-10 max-w-5xl mx-auto px-6">
        {/* Section header */}
        <div class="text-center mb-12">
          <h2 class="font-jost text-3xl sm:text-4xl font-bold text-primary-100 mb-4">
            See It in Action
          </h2>
          <p class="text-primary-300 max-w-xl mx-auto">
            Interactive components that feel alive. Hover, click, and explore.
          </p>
        </div>

        {/* Showcase panel */}
        <div class="relative">
          {/* Main showcase card */}
          <div class="relative rounded-2xl glass-strong overflow-hidden">
            {/* Header bar */}
            <div class="flex items-center justify-between px-6 py-4 border-b border-primary-700/30">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-danger-400" />
                <div class="w-3 h-3 rounded-full bg-warning-400" />
                <div class="w-3 h-3 rounded-full bg-success-400" />
              </div>
              <div class="flex gap-2">
                <button
                  class={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                    activeVariant() === "fill"
                      ? "bg-accent text-white"
                      : "text-primary-400 hover:text-primary-200"
                  }`}
                  onClick={() => setActiveVariant("fill")}
                >
                  Filled
                </button>
                <button
                  class={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                    activeVariant() === "outline"
                      ? "bg-accent text-white"
                      : "text-primary-400 hover:text-primary-200"
                  }`}
                  onClick={() => setActiveVariant("outline")}
                >
                  Outline
                </button>
              </div>
            </div>

            {/* Component demo area */}
            <div class="p-8 pattern-grid">
              <div class="flex flex-col gap-8">
                {/* Button row */}
                <div>
                  <p class="text-xs font-semibold uppercase tracking-wider text-primary-500 mb-4">
                    Button Variants
                  </p>
                  <div class="flex flex-wrap gap-3">
                    <Show when={activeVariant() === "fill"}>
                      <Button
                        variant="primary"
                        onPress={() => setCount((c) => c + 1)}
                      >
                        Count: {count()}
                      </Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="accent">Accent</Button>
                      <Button variant="positive">Positive</Button>
                      <Button variant="negative">Negative</Button>
                    </Show>
                    <Show when={activeVariant() === "outline"}>
                      <Button
                        variant="primary"
                        buttonStyle="outline"
                        onPress={() => setCount((c) => c + 1)}
                      >
                        Count: {count()}
                      </Button>
                      <Button variant="secondary" buttonStyle="outline">
                        Secondary
                      </Button>
                      <Button variant="accent" buttonStyle="outline">
                        Accent
                      </Button>
                      <Button variant="positive" buttonStyle="outline">
                        Positive
                      </Button>
                      <Button variant="negative" buttonStyle="outline">
                        Negative
                      </Button>
                    </Show>
                  </div>
                </div>

                {/* Size row */}
                <div>
                  <p class="text-xs font-semibold uppercase tracking-wider text-primary-500 mb-4">
                    Size Variants
                  </p>
                  <div class="flex flex-wrap items-center gap-3">
                    <Button variant="accent" size="sm" buttonStyle={activeVariant()}>
                      Small
                    </Button>
                    <Button variant="accent" size="md" buttonStyle={activeVariant()}>
                      Medium
                    </Button>
                    <Button variant="accent" size="lg" buttonStyle={activeVariant()}>
                      Large
                    </Button>
                  </div>
                </div>

                {/* Custom hook demo */}
                <div>
                  <p class="text-xs font-semibold uppercase tracking-wider text-primary-500 mb-4">
                    Custom with createButton Hook
                  </p>
                  <CustomGradientButton onPress={() => setCount((c) => c + 1)}>
                    Gradient Button
                  </CustomGradientButton>
                </div>
              </div>
            </div>
          </div>

          {/* Floating decoration */}
          <div class="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-accent/10 blur-2xl animate-pulse-glow" />
        </div>
      </div>
    </section>
  );
}

/* ============================================
   COMPONENT SHOWCASE EXPANDED - More Components
   ============================================ */
function ComponentShowcaseExpanded() {
  const [textValue, setTextValue] = createSignal("");
  const [checked, setChecked] = createSignal(false);
  const [sliderVal, setSliderVal] = createSignal(60);
  const [activeTab, setActiveTab] = createSignal<string | number>("overview");

  const tabItems = [
    { id: "overview", label: "Overview" },
    { id: "features", label: "Features" },
    { id: "api", label: "API" },
  ];

  return (
    <section class="relative py-24 overflow-hidden">
      <div class="absolute inset-0 bg-bg-300" />
      <div class="absolute inset-0 pattern-dots opacity-20" />
      <div class="absolute top-0 right-1/3 w-80 h-80 bg-primary-500/5 rounded-full blur-[120px]" />

      <div class="relative z-10 max-w-5xl mx-auto px-6">
        <div class="text-center mb-12">
          <h2 class="font-jost text-3xl sm:text-4xl font-bold text-primary-100 mb-4">
            60+ Components, One Library
          </h2>
          <p class="text-primary-300 max-w-xl mx-auto">
            From form controls to data display — every component is accessible, keyboard navigable, and production-ready.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Row 1: Form Components */}
          <ShowcaseCard title="Form Controls" accent="from-accent to-primary-500">
            <div class="space-y-3">
              <TextField
                label="Email"
                placeholder="you@example.com"
                value={textValue()}
                onChange={setTextValue}
                size="sm"
              />
              <div class="flex items-center gap-2">
                <Checkbox isSelected={checked()} onChange={setChecked} size="sm">
                  Subscribe to updates
                </Checkbox>
              </div>
              <Button
                variant="accent"
                size="sm"
                isDisabled={!textValue() || !checked()}
                onPress={() => {}}
              >
                {textValue() && checked() ? "Ready!" : "Fill form first"}
              </Button>
            </div>
          </ShowcaseCard>

          {/* Row 1: Slider */}
          <ShowcaseCard title="Slider" accent="from-primary-400 to-primary-600">
            <div class="space-y-3">
              <StyledSlider
                label="Volume"
                value={sliderVal()}
                onChange={setSliderVal}
                minValue={0}
                maxValue={100}
              />
              <div class="flex items-center gap-2">
                <div
                  class="h-6 rounded-full bg-linear-to-r from-primary-700 to-accent transition-all duration-200"
                  style={{ width: `${sliderVal()}%` }}
                />
                <span class="text-xs text-primary-400">{sliderVal()}%</span>
              </div>
            </div>
          </ShowcaseCard>

          {/* Row 1: Tooltip + Toast */}
          <ShowcaseCard title="Overlay Components" accent="from-success-400 to-success-600">
            <div class="space-y-3">
              <div>
                <p class="text-xs text-primary-400 mb-2">Tooltip on hover/focus</p>
                <TooltipTrigger>
                  <Button variant="secondary" size="sm">Hover or focus me</Button>
                  <Tooltip placement="top" showArrow>
                    I'm a tooltip!
                  </Tooltip>
                </TooltipTrigger>
              </div>
              <Separator />
              <div>
                <p class="text-xs text-primary-400 mb-2">Toast notifications</p>
                <Button
                  variant="positive"
                  size="sm"
                  onPress={() => toastSuccess("Action completed!")}
                >
                  Trigger Toast
                </Button>
              </div>
            </div>
          </ShowcaseCard>

          {/* Row 2: Progress */}
          <ShowcaseCard title="Progress & Feedback" accent="from-warning-400 to-warning-600">
            <div class="space-y-3">
              <ProgressBar value={25} label="Uploading" variant="primary" />
              <ProgressBar value={65} label="Processing" variant="accent" />
              <ProgressBar value={90} label="Almost done" variant="success" />
              <ProgressBar isIndeterminate label="Loading..." />
            </div>
          </ShowcaseCard>

          {/* Row 2: Tabs */}
          <ShowcaseCard title="Tabs" accent="from-accent-200 to-accent" class="sm:col-span-2">
            <StyledTabs<{ id: string; label: string }>
              items={tabItems}
              getKey={(item) => item.id}
              getTextValue={(item) => item.label}
              selectedKey={activeTab()}
              onSelectionChange={setActiveTab}
              variant="pill"
            >
              <StyledTabList>
                {(item: { id: string; label: string }) => (
                  <StyledTab id={item.id}>{item.label}</StyledTab>
                )}
              </StyledTabList>
              <StyledTabPanel>
                <div class="pt-3 text-sm text-primary-400">
                  <Show when={activeTab() === "overview"}>
                    <p>Full-featured accessible component library for SolidJS, with 3677+ tests.</p>
                  </Show>
                  <Show when={activeTab() === "features"}>
                    <p>WAI-ARIA compliant, keyboard navigable, SSR ready, fine-grained reactivity.</p>
                  </Show>
                  <Show when={activeTab() === "api"}>
                    <p>Four layers: solid-stately → solidaria → solidaria-components → ui.</p>
                  </Show>
                </div>
              </StyledTabPanel>
            </StyledTabs>
          </ShowcaseCard>
        </div>

        <div class="mt-8 text-center">
          <Link to="/playground">
            <Button variant="accent" buttonStyle="outline" size="lg" class="hover-lift">
              Explore All Components →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ShowcaseCard(props: {
  title: string;
  accent: string;
  children: any;
  class?: string;
}) {
  return (
    <div class={`relative p-5 rounded-xl glass hover-lift group ${props.class ?? ""}`}>
      <div class={`absolute top-0 left-0 right-0 h-0.5 rounded-t-xl bg-linear-to-r ${props.accent} opacity-60`} />
      <h3 class="font-jost text-sm font-semibold text-primary-300 mb-3 uppercase tracking-wider">
        {props.title}
      </h3>
      {props.children}
    </div>
  );
}

function CustomGradientButton(props: { onPress?: () => void; children: string }) {
  const { buttonProps, isPressed } = createButton({
    onPress: props.onPress,
  });

  return (
    <button
      {...buttonProps}
      class={`relative overflow-hidden rounded-lg bg-linear-to-r from-primary-500 via-accent to-primary-400 px-6 py-3 font-jost font-medium text-white shadow-lg transition-all hover:shadow-xl hover:shadow-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-400 ${
        isPressed() ? "scale-[0.98] shadow-md" : ""
      }`}
    >
      {/* Shimmer effect */}
      <div class="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/20 to-transparent" />
      <span class="relative">{props.children}</span>
    </button>
  );
}

/* ============================================
   CODE EXAMPLE - Terminal Window
   ============================================ */
function CodeExample() {
  const [copied, setCopied] = createSignal(false);

  const code = `import { Button } from '@proyecto-viviana/ui';
import { createButton } from '@proyecto-viviana/solidaria';

// Use the styled component
function App() {
  const [count, setCount] = createSignal(0);

  return (
    <Button variant="accent" onPress={() => setCount((n) => n + 1)}>
      Clicked {count()} times
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

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section class="relative py-24 overflow-hidden">
      {/* Background */}
      <div class="absolute inset-0 bg-bg-200" />

      <div class="relative z-10 max-w-4xl mx-auto px-6">
        {/* Section header */}
        <div class="text-center mb-12">
          <h2 class="font-jost text-3xl sm:text-4xl font-bold text-primary-100 mb-4">
            Simple to Use
          </h2>
          <p class="text-primary-300 max-w-xl mx-auto">
            Two packages, one goal: making accessible UIs easy
          </p>
        </div>

        {/* Code window */}
        <div class="relative rounded-xl overflow-hidden shadow-2xl shadow-black/30">
          {/* Window chrome */}
          <div class="flex items-center justify-between px-4 py-3 bg-bg-400 border-b border-primary-700/30">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-danger-400 hover:bg-danger-100 transition-colors" />
              <div class="w-3 h-3 rounded-full bg-warning-400 hover:bg-warning-100 transition-colors" />
              <div class="w-3 h-3 rounded-full bg-success-400 hover:bg-success-100 transition-colors" />
            </div>
            <span class="text-xs text-primary-500 font-mono">example.tsx</span>
            <button
              onClick={copyCode}
              class="flex items-center gap-1.5 px-2 py-1 text-xs text-primary-400 hover:text-primary-200 hover:bg-bg-300 rounded transition-colors"
            >
              <Show when={copied()} fallback={<CopyIcon class="w-3.5 h-3.5" />}>
                <CheckIcon class="w-3.5 h-3.5 text-success-400" />
              </Show>
              {copied() ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Code content */}
          <div class="relative bg-bg-400/80 p-6 overflow-x-auto custom-scrollbar">
            {/* Scanline effect */}
            <div class="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.05)_50%)] bg-size-[100%_4px]" />

            <pre class="relative">
              <code class="text-sm leading-relaxed font-mono">
                <CodeHighlight code={code} />
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

function CodeHighlight(props: { code: string }) {
  // Simple syntax highlighting
  const highlightCode = (code: string) => {
    return code
      .split("\n")
      .map((line, i) => {
        let highlighted = line
          // Keywords
          .replace(
            /\b(import|from|export|function|return|const|class)\b/g,
            '<span class="text-accent-300">$1</span>'
          )
          // Strings
          .replace(
            /(["'`])([^"'`]*)\1/g,
            '<span class="text-success-400">$1$2$1</span>'
          )
          // Comments
          .replace(
            /(\/\/.*$)/gm,
            '<span class="text-primary-600 italic">$1</span>'
          )
          // JSX tags
          .replace(
            /(&lt;\/?[A-Z][a-zA-Z]*)/g,
            '<span class="text-primary-300">$1</span>'
          )
          // Function calls
          .replace(
            /\b([a-z][a-zA-Z]*)\(/g,
            '<span class="text-primary-200">$1</span>('
          )
          // Props/attributes
          .replace(
            /\s([a-zA-Z]+)=/g,
            ' <span class="text-accent-200">$1</span>='
          );

        return `<span class="text-primary-600 select-none mr-4">${String(i + 1).padStart(2, " ")}</span>${highlighted}`;
      })
      .join("\n");
  };

  return <span innerHTML={highlightCode(props.code)} />;
}

/* ============================================
   CALL TO ACTION
   ============================================ */
function CallToAction() {
  return (
    <section class="relative py-24 overflow-hidden">
      {/* Background with gradient mesh */}
      <div class="absolute inset-0 gradient-mesh-animated" />
      <div class="absolute inset-0 pattern-crystal opacity-50" />

      {/* Glowing orbs */}
      <div class="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 rounded-full bg-accent/20 blur-[100px] animate-pulse-glow" />
      <div class="absolute top-1/2 right-1/4 -translate-y-1/2 w-48 h-48 rounded-full bg-primary-500/20 blur-[80px] animate-pulse-glow delay-500" />

      <div class="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h2 class="font-jost text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-100 mb-6">
          Ready to Build Something{" "}
          <span class="gradient-text-animated">Amazing</span>?
        </h2>
        <p class="text-lg text-primary-300 mb-10 max-w-xl mx-auto">
          Join developers building accessible applications with Proyecto Viviana.
          Get started in minutes.
        </p>

        <div class="flex flex-wrap justify-center gap-4">
          <Link to="/docs">
            <Button variant="accent" size="lg" class="hover-lift glow-accent">
              Read the Docs
            </Button>
          </Link>
          <a
            href="https://github.com/proyecto-viviana/proyecto-viviana"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary" buttonStyle="outline" size="lg" class="hover-lift">
              <span class="mr-2 inline-flex">
                <GitHubIcon size={18} />
              </span>
              View on GitHub
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   FOOTER
   ============================================ */
function Footer() {
  return (
    <footer class="relative py-12 border-t border-primary-700/30">
      <div class="absolute inset-0 bg-bg-400" />

      <div class="relative z-10 max-w-6xl mx-auto px-6">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Branding */}
          <div class="flex items-center gap-3">
            <span class="font-jost text-lg font-bold">
              <span class="text-primary-600">Proyecto</span>
              <span class="text-primary-400">Viviana</span>
            </span>
            <span class="text-sm text-primary-500">
              The Accessible Web Toolkit
            </span>
          </div>

          {/* Links */}
          <nav class="flex items-center gap-6">
            <Link
              to="/docs"
              class="text-sm text-primary-400 hover:text-primary-200 transition-colors"
            >
              Documentation
            </Link>
            <Link
              to="/playground"
              class="text-sm text-primary-400 hover:text-primary-200 transition-colors"
            >
              Playground
            </Link>
            <Link
              to="/ecosystem"
              class="text-sm text-primary-400 hover:text-primary-200 transition-colors"
            >
              Ecosystem
            </Link>
            <a
              href="https://github.com/proyecto-viviana/proyecto-viviana"
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary-400 hover:text-primary-200 transition-colors"
              aria-label="GitHub"
            >
              <GitHubIcon size={20} />
            </a>
          </nav>
        </div>

        <div class="mt-8 pt-8 border-t border-primary-700/20 text-center">
          <p class="text-xs text-primary-600">
            Built with SolidJS and love. Inspired by React Spectrum.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ============================================
   ICONS
   ============================================ */
function AccessibilityIcon(props: { class?: string }) {
  return (
    <svg class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="4" r="2" />
      <path d="M12 6v6m0 0l-4 8m4-8l4 8M6 10h12" />
    </svg>
  );
}

function ReactivityIcon(props: { class?: string }) {
  return (
    <svg class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function ServerIcon(props: { class?: string }) {
  return (
    <svg class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="2" y="3" width="20" height="6" rx="1" />
      <rect x="2" y="15" width="20" height="6" rx="1" />
      <path d="M6 6h.01M6 18h.01" />
    </svg>
  );
}

function PaletteIcon(props: { class?: string }) {
  return (
    <svg class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.78-.07 2.58-.2.4-.07.74-.3.96-.63.22-.33.3-.74.21-1.13-.13-.56-.07-1.16.17-1.69.3-.67.94-1.15 1.68-1.26.12-.02.25-.03.37-.03.46 0 .91.14 1.29.41.54.39 1.21.53 1.85.39.54-.12 1-.5 1.23-1.03.22-.52.22-1.11-.01-1.62A10 10 0 0012 2z" />
      <circle cx="7.5" cy="11.5" r="1.5" />
      <circle cx="12" cy="7.5" r="1.5" />
      <circle cx="16.5" cy="11.5" r="1.5" />
    </svg>
  );
}

function TypeScriptIcon(props: { class?: string }) {
  return (
    <svg class={props.class} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 3h18v18H3V3zm10.71 14.86c.5.98 1.51 1.73 3.09 1.73 1.6 0 2.8-.83 2.8-2.36 0-1.41-.81-2.04-2.25-2.66l-.42-.18c-.73-.31-1.04-.52-1.04-1.02 0-.41.31-.73.81-.73.48 0 .8.21 1.09.73l1.31-.87c-.55-.96-1.33-1.33-2.4-1.33-1.51 0-2.48.96-2.48 2.23 0 1.38.81 2.03 2.03 2.55l.42.18c.78.34 1.24.55 1.24 1.13 0 .48-.45.84-1.15.84-.83 0-1.31-.43-1.67-1.03l-1.38.8zM14 11.25H9.5v1.41h1.56v5.34h1.69v-5.34H14v-1.41z" />
    </svg>
  );
}

function LayersIcon(props: { class?: string }) {
  return (
    <svg class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}

function CopyIcon(props: { class?: string }) {
  return (
    <svg class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function CheckIcon(props: { class?: string }) {
  return (
    <svg class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
