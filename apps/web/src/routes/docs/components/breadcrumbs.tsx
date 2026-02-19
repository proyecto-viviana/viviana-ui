import { createFileRoute } from "@tanstack/solid-router";
import { createSignal } from "solid-js";
import { Breadcrumbs, BreadcrumbItem } from "@proyecto-viviana/ui";
import { DocPage, Example, PropsTable, AccessibilitySection } from "@/components/docs";

type BreadcrumbEntry = {
  id: string;
  label: string;
  href?: string;
};

const basicCrumbs: BreadcrumbEntry[] = [
  { id: "home", label: "Home", href: "#" },
  { id: "products", label: "Products", href: "#" },
  { id: "electronics", label: "Electronics", href: "#" },
  { id: "laptops", label: "Laptops" },
];

const dashboardCrumbs: BreadcrumbEntry[] = [
  { id: "dashboard", label: "Dashboard", href: "#" },
  { id: "settings", label: "Settings", href: "#" },
  { id: "profile", label: "Profile" },
];

const deepCrumbs: BreadcrumbEntry[] = [
  { id: "root", label: "Root", href: "#" },
  { id: "src", label: "src", href: "#" },
  { id: "components", label: "components", href: "#" },
  { id: "ui", label: "ui", href: "#" },
  { id: "button", label: "Button.tsx" },
];

export const Route = createFileRoute("/docs/components/breadcrumbs")({
  component: BreadcrumbsPage,
});

function BreadcrumbsPage() {
  const [currentPage, setCurrentPage] = createSignal("Laptops");
  const [crumbs, setCrumbs] = createSignal<BreadcrumbEntry[]>(basicCrumbs);

  function handleNavigate(key: string) {
    const idx = crumbs().findIndex((c) => c.id === key);
    if (idx >= 0) {
      const trimmed = crumbs().slice(0, idx + 1);
      const last = trimmed[trimmed.length - 1];
      setCrumbs(
        trimmed.map((c, i) =>
          i === trimmed.length - 1 ? { ...c, href: undefined } : c
        )
      );
      setCurrentPage(last.label);
    }
  }

  return (
    <DocPage
      title="Breadcrumbs"
      description="Breadcrumbs show a navigational hierarchy of pages, helping users understand where they are within a site and navigate back to parent sections."
      importCode={`import { Breadcrumbs, BreadcrumbItem } from '@proyecto-viviana/ui';`}
    >
      <Example
        title="Basic Breadcrumbs"
        description="A simple breadcrumb trail showing page hierarchy. The last item is the current page and is not a link."
        code={`<Breadcrumbs>
  <BreadcrumbItem id="home" href="#">Home</BreadcrumbItem>
  <BreadcrumbItem id="products" href="#">Products</BreadcrumbItem>
  <BreadcrumbItem id="electronics" href="#">Electronics</BreadcrumbItem>
  <BreadcrumbItem id="laptops">Laptops</BreadcrumbItem>
</Breadcrumbs>`}
      >
        <Breadcrumbs>
          <BreadcrumbItem id="home" href="#">
            Home
          </BreadcrumbItem>
          <BreadcrumbItem id="products" href="#">
            Products
          </BreadcrumbItem>
          <BreadcrumbItem id="electronics" href="#">
            Electronics
          </BreadcrumbItem>
          <BreadcrumbItem id="laptops">Laptops</BreadcrumbItem>
        </Breadcrumbs>
      </Example>

      <Example
        title="Interactive Navigation"
        description="Click any breadcrumb to navigate back to that level. The trail updates to reflect the new location."
        code={`<Breadcrumbs onAction={handleNavigate}>
  {crumbs().map((crumb) => (
    <BreadcrumbItem id={crumb.id} href={crumb.href}>
      {crumb.label}
    </BreadcrumbItem>
  ))}
</Breadcrumbs>`}
      >
        <div>
          <Breadcrumbs onAction={(key) => handleNavigate(String(key))}>
            {crumbs().map((crumb) => (
              <BreadcrumbItem id={crumb.id} href={crumb.href}>
                {crumb.label}
              </BreadcrumbItem>
            ))}
          </Breadcrumbs>
          <p class="mt-2 text-sm text-bg-500">
            Current page: <strong>{currentPage()}</strong>
          </p>
          <button
            class="mt-2 text-xs px-2 py-1 rounded bg-bg-100 text-bg-600 hover:bg-bg-200"
            onClick={() => {
              setCrumbs(basicCrumbs);
              setCurrentPage("Laptops");
            }}
          >
            Reset
          </button>
        </div>
      </Example>

      <Example
        title="Size Variants"
        description="Breadcrumbs support different sizes to match surrounding content."
        code={`<Breadcrumbs size="S">...</Breadcrumbs>
<Breadcrumbs size="M">...</Breadcrumbs>
<Breadcrumbs size="L">...</Breadcrumbs>`}
      >
        <div class="space-y-4">
          <div>
            <p class="text-xs text-bg-400 mb-1">Small</p>
            <Breadcrumbs size="S">
              <BreadcrumbItem id="home" href="#">Home</BreadcrumbItem>
              <BreadcrumbItem id="settings" href="#">Settings</BreadcrumbItem>
              <BreadcrumbItem id="profile">Profile</BreadcrumbItem>
            </Breadcrumbs>
          </div>
          <div>
            <p class="text-xs text-bg-400 mb-1">Medium (default)</p>
            <Breadcrumbs size="M">
              <BreadcrumbItem id="home" href="#">Home</BreadcrumbItem>
              <BreadcrumbItem id="settings" href="#">Settings</BreadcrumbItem>
              <BreadcrumbItem id="profile">Profile</BreadcrumbItem>
            </Breadcrumbs>
          </div>
          <div>
            <p class="text-xs text-bg-400 mb-1">Large</p>
            <Breadcrumbs size="L">
              <BreadcrumbItem id="home" href="#">Home</BreadcrumbItem>
              <BreadcrumbItem id="settings" href="#">Settings</BreadcrumbItem>
              <BreadcrumbItem id="profile">Profile</BreadcrumbItem>
            </Breadcrumbs>
          </div>
        </div>
      </Example>

      <Example
        title="File Path Breadcrumbs"
        description="Breadcrumbs work well for displaying file or folder navigation paths."
        code={`<Breadcrumbs>
  <BreadcrumbItem id="root" href="#">Root</BreadcrumbItem>
  <BreadcrumbItem id="src" href="#">src</BreadcrumbItem>
  <BreadcrumbItem id="components" href="#">components</BreadcrumbItem>
  <BreadcrumbItem id="ui" href="#">ui</BreadcrumbItem>
  <BreadcrumbItem id="button">Button.tsx</BreadcrumbItem>
</Breadcrumbs>`}
      >
        <Breadcrumbs>
          {deepCrumbs.map((crumb) => (
            <BreadcrumbItem id={crumb.id} href={crumb.href}>
              {crumb.label}
            </BreadcrumbItem>
          ))}
        </Breadcrumbs>
      </Example>

      <h2>Breadcrumbs Props</h2>
      <PropsTable
        props={[
          {
            name: "children",
            type: "JSX.Element",
            description: "BreadcrumbItem elements representing the navigation trail",
          },
          {
            name: "size",
            type: "'S' | 'M' | 'L'",
            default: "'M'",
            description: "Size variant affecting font size and spacing",
          },
          {
            name: "isDisabled",
            type: "boolean",
            default: "false",
            description: "Whether all breadcrumb links are disabled",
          },
          {
            name: "onAction",
            type: "(key: Key) => void",
            description: "Handler called when a breadcrumb item is pressed",
          },
        ]}
      />

      <h2>BreadcrumbItem Props</h2>
      <PropsTable
        props={[
          {
            name: "id",
            type: "string",
            description: "Unique identifier for the breadcrumb item",
          },
          {
            name: "href",
            type: "string",
            description: "URL for the breadcrumb link. Omit for the current page.",
          },
          {
            name: "children",
            type: "JSX.Element",
            description: "Label content of the breadcrumb",
          },
          {
            name: "isDisabled",
            type: "boolean",
            default: "false",
            description: "Whether this breadcrumb link is disabled",
          },
        ]}
      />

      <AccessibilitySection>
        <ul class="list-disc pl-5 space-y-1 text-sm">
          <li>
            Uses <code>nav</code> element with <code>aria-label="Breadcrumbs"</code>
          </li>
          <li>
            Items use an <code>ol</code> list structure for proper semantics
          </li>
          <li>
            Current page is marked with <code>aria-current="page"</code>
          </li>
          <li>Separator characters are hidden from screen readers</li>
          <li>Links are focusable and activatable via keyboard</li>
          <li>Screen readers announce the full trail context</li>
        </ul>
      </AccessibilitySection>
    </DocPage>
  );
}
