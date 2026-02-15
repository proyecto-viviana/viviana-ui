import { Outlet, createFileRoute, Link } from "@tanstack/solid-router";
import { For, createSignal, Show } from "solid-js";
import { PageLayout } from "@proyecto-viviana/ui";
import { Header } from "@/components";

export const Route = createFileRoute("/docs")({
  component: DocsLayout,
});

type NavItem = {
  label: string;
  href: string;
};

type NavSection = {
  section: string;
  items: NavItem[];
};

type NavEntry = NavItem | NavSection;

const componentPages = import.meta.glob("./components/*.tsx");
const hookPages = import.meta.glob("./hooks/*.tsx");

const componentOrder = ["button", "checkbox", "dialog", "menu", "select", "table", "tabs", "textfield", "toast"];
const hookOrder = ["create-button", "create-press"];

const labelOverrides: Record<string, string> = {
  textfield: "TextField",
};

function filePathToSlug(filePath: string) {
  return filePath.split("/").at(-1)?.replace(".tsx", "") ?? "";
}

function toTitleCase(slug: string) {
  if (slug in labelOverrides) return labelOverrides[slug];
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function toCamelCase(slug: string) {
  const [first, ...rest] = slug.split("-");
  return `${first}${rest.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("")}`;
}

function buildSectionItems(
  pages: Record<string, unknown>,
  basePath: "/docs/components" | "/docs/hooks",
  order: string[],
  labelFormatter: (slug: string) => string
): NavItem[] {
  const routeItems = Object.keys(pages).map((filePath) => {
    const slug = filePathToSlug(filePath);
    return { slug, item: { label: labelFormatter(slug), href: `${basePath}/${slug}` } };
  });

  return routeItems
    .sort((a, b) => {
      const aIndex = order.indexOf(a.slug);
      const bIndex = order.indexOf(b.slug);
      const aRank = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex;
      const bRank = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex;
      return aRank === bRank ? a.item.label.localeCompare(b.item.label) : aRank - bRank;
    })
    .map((entry) => entry.item);
}

const navItems: NavEntry[] = [
  { label: "Getting Started", href: "/docs" },
  { label: "Installation", href: "/docs/installation" },
  {
    section: "Components",
    items: buildSectionItems(componentPages, "/docs/components", componentOrder, toTitleCase),
  },
  {
    section: "Hooks",
    items: buildSectionItems(hookPages, "/docs/hooks", hookOrder, toCamelCase),
  },
];

function DocsLayout() {
  const [expandedSections, setExpandedSections] = createSignal<Set<string>>(
    new Set(["Components", "Hooks"])
  );

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  return (
    <PageLayout>
      <Header />
      <div class="flex flex-1 pt-16 h-screen">
        {/* Sidebar */}
        <aside class="w-72 shrink-0 border-r border-primary-700/30 bg-bg-300/50 backdrop-blur-sm overflow-y-auto custom-scrollbar h-[calc(100vh-4rem)] sticky top-16">
          {/* Sidebar header with gradient accent */}
          <div class="sticky top-0 z-10 p-4 bg-bg-300/90 backdrop-blur-md border-b border-primary-700/20">
            <div class="flex items-center gap-3">
              <div class="w-2 h-8 rounded-full bg-linear-to-b from-accent to-primary-500" />
              <div>
                <p class="font-jost text-sm font-semibold text-primary-200">
                  Documentation
                </p>
                <p class="text-xs text-primary-500">v0.1.7</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav class="px-4 py-6" aria-label="Documentation navigation">
            <For each={navItems}>
              {(item) => {
                if ("section" in item) {
                  const isExpanded = () => expandedSections().has(item.section);
                  const contentId = `docs-section-${item.section.toLowerCase()}`;

                  return (
                    <div class="mt-6 first:mt-0">
                      {/* Section header */}
                      <button
                        class="w-full flex items-center justify-between px-3 py-2 mb-1 text-xs font-semibold uppercase tracking-wider text-primary-500 hover:text-primary-300 transition-colors rounded-lg hover:bg-primary-700/10"
                        onClick={() => toggleSection(item.section)}
                        aria-expanded={isExpanded()}
                        aria-controls={contentId}
                      >
                        <span>{item.section}</span>
                        <ChevronIcon
                          class={`w-4 h-4 transition-transform duration-200 ${
                            isExpanded() ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Section items */}
                      <Show when={isExpanded()}>
                        <div id={contentId} class="space-y-0.5 animate-fade-in-up">
                          <For each={item.items}>
                            {(subItem) => (
                              <Link
                                to={subItem.href}
                                class="sidebar-link"
                                activeProps={{ class: "active" }}
                                activeOptions={{ exact: true }}
                              >
                                {subItem.label}
                              </Link>
                            )}
                          </For>
                        </div>
                      </Show>
                    </div>
                  );
                }

                return (
                  <Link
                    to={item.href}
                    class="sidebar-link"
                    activeProps={{ class: "active" }}
                    activeOptions={{ exact: true }}
                  >
                    {item.label}
                  </Link>
                );
              }}
            </For>
          </nav>

          {/* Sidebar footer */}
          <div class="sticky bottom-0 p-4 bg-linear-to-t from-bg-300 to-transparent">
            <a
              href="https://github.com/proyecto-viviana/proyecto-viviana"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 px-3 py-2 text-sm text-primary-500 hover:text-primary-300 hover:bg-primary-700/10 rounded-lg transition-colors"
            >
              <GitHubIcon class="w-4 h-4" />
              <span>View on GitHub</span>
            </a>
          </div>
        </aside>

        {/* Main content */}
        <main class="flex-1 overflow-auto custom-scrollbar h-[calc(100vh-4rem)]">
          <div class="max-w-4xl mx-auto px-8 py-10">
            <Outlet />
          </div>
        </main>
      </div>
    </PageLayout>
  );
}

function ChevronIcon(props: { class?: string }) {
  return (
    <svg
      class={props.class}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function GitHubIcon(props: { class?: string }) {
  return (
    <svg class={props.class} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}
