import { Outlet, createFileRoute, Link, useMatches } from "@tanstack/solid-router";
import { For, createMemo } from "solid-js";
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

const navItems: NavEntry[] = [
  { label: "Getting Started", href: "/docs" },
  { label: "Installation", href: "/docs/installation" },
  {
    section: "Components",
    items: [
      { label: "Button", href: "/docs/components/button" },
      { label: "Checkbox", href: "/docs/components/checkbox" },
      { label: "Radio", href: "/docs/components/radio" },
      { label: "Switch", href: "/docs/components/switch" },
      { label: "TextField", href: "/docs/components/textfield" },
      { label: "NumberField", href: "/docs/components/numberfield" },
      { label: "SearchField", href: "/docs/components/searchfield" },
      { label: "Select", href: "/docs/components/select" },
      { label: "ComboBox", href: "/docs/components/combobox" },
      { label: "Menu", href: "/docs/components/menu" },
      { label: "ListBox", href: "/docs/components/listbox" },
      { label: "Tabs", href: "/docs/components/tabs" },
      { label: "Dialog", href: "/docs/components/dialog" },
      { label: "Popover", href: "/docs/components/popover" },
      { label: "Tooltip", href: "/docs/components/tooltip" },
      { label: "Toast", href: "/docs/components/toast" },
      { label: "Table", href: "/docs/components/table" },
      { label: "GridList", href: "/docs/components/gridlist" },
      { label: "Tree", href: "/docs/components/tree" },
      { label: "Calendar", href: "/docs/components/calendar" },
      { label: "DateField", href: "/docs/components/datefield" },
      { label: "DatePicker", href: "/docs/components/datepicker" },
      { label: "Slider", href: "/docs/components/slider" },
      { label: "ProgressBar", href: "/docs/components/progressbar" },
      { label: "Meter", href: "/docs/components/meter" },
      { label: "Badge", href: "/docs/components/badge" },
      { label: "Alert", href: "/docs/components/alert" },
      { label: "Avatar", href: "/docs/components/avatar" },
      { label: "Breadcrumbs", href: "/docs/components/breadcrumbs" },
      { label: "Disclosure", href: "/docs/components/disclosure" },
      { label: "TagGroup", href: "/docs/components/taggroup" },
      { label: "ColorPicker", href: "/docs/components/colorpicker" },
      { label: "Separator", href: "/docs/components/separator" },
      { label: "Link", href: "/docs/components/link" },
    ],
  },
  {
    section: "Hooks",
    items: [
      { label: "createButton", href: "/docs/hooks/create-button" },
      { label: "createPress", href: "/docs/hooks/create-press" },
      { label: "createHover", href: "/docs/hooks/create-hover" },
      { label: "createFocusRing", href: "/docs/hooks/create-focus-ring" },
      { label: "createTextField", href: "/docs/hooks/create-textfield" },
      { label: "createCheckbox", href: "/docs/hooks/create-checkbox" },
      { label: "createSelect", href: "/docs/hooks/create-select" },
      { label: "createMenu", href: "/docs/hooks/create-menu" },
      { label: "createDialog", href: "/docs/hooks/create-dialog" },
      { label: "createTooltip", href: "/docs/hooks/create-tooltip" },
    ],
  },
];

function DocsLayout() {
  const matches = useMatches();
  const currentPath = createMemo(() => {
    const match = matches();
    return match[match.length - 1]?.pathname || "/docs";
  });

  return (
    <PageLayout withHeader>
      <Header />
      <div class="flex flex-1">
        <aside class="w-64 shrink-0 border-r border-bg-300 bg-bg-200 overflow-y-auto">
          <div class="sticky top-0 p-6 bg-bg-200">
            <p class="text-sm font-semibold text-primary-300">Documentation</p>
          </div>

          <nav class="px-4 pb-6">
            <For each={navItems}>
              {(item) => {
                if ("section" in item) {
                  return (
                    <div class="mt-6">
                      <h3 class="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-primary-400">
                        {item.section}
                      </h3>
                      <For each={item.items}>
                        {(subItem) => (
                          <Link
                            to={subItem.href}
                            class="sidebar-link block w-full text-left"
                            activeProps={{ class: "active" }}
                            activeOptions={{ exact: true }}
                          >
                            {subItem.label}
                          </Link>
                        )}
                      </For>
                    </div>
                  );
                }
                return (
                  <Link
                    to={item.href}
                    class="sidebar-link block w-full text-left"
                    activeProps={{ class: "active" }}
                    activeOptions={{ exact: true }}
                  >
                    {item.label}
                  </Link>
                );
              }}
            </For>
          </nav>
        </aside>

        <main class="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </PageLayout>
  );
}
