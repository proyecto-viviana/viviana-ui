import { createFileRoute } from "@tanstack/solid-router";
import { createSignal } from "solid-js";
import { Tree, TreeItem, TreeItemContent, TreeExpandButton } from "@proyecto-viviana/solidaria-components";
import type { Key } from "@proyecto-viviana/solid-stately";
import { DocPage, Example, PropsTable, AccessibilitySection } from "@/components/docs";

type FileNode = {
  id: string;
  name: string;
  children?: FileNode[];
};

const fileSystemData: FileNode[] = [
  {
    id: "src",
    name: "src",
    children: [
      {
        id: "components",
        name: "components",
        children: [
          { id: "Button.tsx", name: "Button.tsx" },
          { id: "Dialog.tsx", name: "Dialog.tsx" },
          { id: "Menu.tsx", name: "Menu.tsx" },
        ],
      },
      {
        id: "hooks",
        name: "hooks",
        children: [
          { id: "useAuth.ts", name: "useAuth.ts" },
          { id: "useTheme.ts", name: "useTheme.ts" },
        ],
      },
      { id: "index.ts", name: "index.ts" },
    ],
  },
  {
    id: "tests",
    name: "tests",
    children: [
      { id: "Button.test.tsx", name: "Button.test.tsx" },
      { id: "Dialog.test.tsx", name: "Dialog.test.tsx" },
    ],
  },
  { id: "package.json", name: "package.json" },
  { id: "tsconfig.json", name: "tsconfig.json" },
];

const orgChartData: FileNode[] = [
  {
    id: "ceo",
    name: "CEO - Maria Garcia",
    children: [
      {
        id: "cto",
        name: "CTO - James Chen",
        children: [
          { id: "lead-fe", name: "Frontend Lead - Anna Lee" },
          { id: "lead-be", name: "Backend Lead - Omar Hassan" },
          { id: "lead-infra", name: "Infra Lead - Kenji Tanaka" },
        ],
      },
      {
        id: "cfo",
        name: "CFO - Sarah Miller",
        children: [
          { id: "accounting", name: "Accounting - David Park" },
          { id: "finance", name: "Finance - Lisa Wong" },
        ],
      },
      {
        id: "cmo",
        name: "CMO - Robert Taylor",
        children: [
          { id: "marketing", name: "Marketing - Emily Davis" },
          { id: "sales", name: "Sales - Michael Brown" },
        ],
      },
    ],
  },
];

export const Route = createFileRoute("/docs/components/tree")({
  component: TreePage,
});

function TreePage() {
  const [selectedKeys, setSelectedKeys] = createSignal<Set<Key>>(new Set());
  const [expandedKeys, setExpandedKeys] = createSignal<Set<Key>>(
    new Set(["src", "components"])
  );

  function renderTreeItems(items: FileNode[]) {
    return items.map((item) => (
      <TreeItem id={item.id} textValue={item.name}>
        <TreeItemContent>
          {(renderProps) => (
            <div
              class="flex items-center gap-2 py-1 px-2 rounded cursor-default select-none"
              style={{ "padding-left": `${(renderProps.level ?? 0) * 16 + 8}px` }}
              data-selected={renderProps.isSelected || undefined}
              data-focused={renderProps.isFocused || undefined}
            >
              {item.children && item.children.length > 0 ? (
                <TreeExpandButton class="w-4 h-4 flex items-center justify-center text-bg-400 hover:text-bg-600 transition-transform">
                  <svg
                    class="w-3 h-3"
                    classList={{ "rotate-90": renderProps.isExpanded }}
                    viewBox="0 0 12 12"
                    fill="currentColor"
                  >
                    <path d="M4.5 2l4 4-4 4" />
                  </svg>
                </TreeExpandButton>
              ) : (
                <span class="w-4" />
              )}
              <span class="text-sm">
                {item.children ? "\u{1F4C1}" : "\u{1F4C4}"} {item.name}
              </span>
            </div>
          )}
        </TreeItemContent>
        {item.children && renderTreeItems(item.children)}
      </TreeItem>
    ));
  }

  return (
    <DocPage
      title="Tree"
      description="Tree displays hierarchical data in an expandable and collapsible structure. It supports keyboard navigation, selection, and accessible tree patterns for file browsers, org charts, and nested data."
      importCode={`import { Tree, TreeItem, TreeItemContent, TreeExpandButton } from '@proyecto-viviana/solidaria-components';`}
    >
      <Example
        title="Basic Tree View"
        description="A file system tree with expand/collapse functionality. Click the arrow icons to expand or collapse folders."
        code={`const fileSystemData = [
  {
    id: "src", name: "src",
    children: [
      { id: "components", name: "components", children: [...] },
      { id: "hooks", name: "hooks", children: [...] },
      { id: "index.ts", name: "index.ts" },
    ],
  },
  { id: "package.json", name: "package.json" },
];

<Tree
  aria-label="File system"
  items={fileSystemData}
  expandedKeys={expandedKeys()}
  onExpandedChange={setExpandedKeys}
>
  {renderTreeItems(fileSystemData)}
</Tree>`}
      >
        <div class="border border-bg-200 rounded-lg p-3 bg-white max-w-md">
          <Tree
            aria-label="File system"
            items={fileSystemData}
            expandedKeys={expandedKeys()}
            onExpandedChange={(keys) => setExpandedKeys(new Set(keys))}
          >
            {renderTreeItems(fileSystemData)}
          </Tree>
        </div>
      </Example>

      <Example
        title="With Selection"
        description="Enable selection mode to allow users to select tree items. Selected items are tracked and displayed below the tree."
        code={`<Tree
  aria-label="Organization chart"
  items={orgChartData}
  selectionMode="multiple"
  selectedKeys={selectedKeys()}
  onSelectionChange={setSelectedKeys}
>
  {renderTreeItems(orgChartData)}
</Tree>`}
      >
        <div class="border border-bg-200 rounded-lg p-3 bg-white max-w-md">
          <Tree
            aria-label="Organization chart"
            items={orgChartData}
            selectionMode="multiple"
            selectedKeys={selectedKeys()}
            onSelectionChange={(keys) => {
              if (keys === "all") {
                const allKeys = new Set<Key>();
                function collectKeys(nodes: FileNode[]) {
                  for (const node of nodes) {
                    allKeys.add(node.id);
                    if (node.children) collectKeys(node.children);
                  }
                }
                collectKeys(orgChartData);
                setSelectedKeys(allKeys);
              } else {
                setSelectedKeys(new Set(keys));
              }
            }}
            defaultExpandedKeys={new Set(["ceo", "cto", "cfo", "cmo"])}
          >
            {renderTreeItems(orgChartData)}
          </Tree>
          <p class="mt-3 text-sm text-bg-500">
            Selected: {selectedKeys().size > 0 ? [...selectedKeys()].join(", ") : "None"}
          </p>
        </div>
      </Example>

      <h2>Tree Props</h2>
      <PropsTable
        props={[
          {
            name: "items",
            type: "T[]",
            description: "The data items rendered as tree nodes",
          },
          {
            name: "selectionMode",
            type: "'none' | 'single' | 'multiple'",
            default: "'none'",
            description: "How tree items can be selected",
          },
          {
            name: "selectedKeys",
            type: "Set<Key> | 'all'",
            description: "Currently selected item keys (controlled)",
          },
          {
            name: "onSelectionChange",
            type: "(keys: Set<Key> | 'all') => void",
            description: "Handler called when selection changes",
          },
          {
            name: "expandedKeys",
            type: "Set<Key>",
            description: "Currently expanded item keys (controlled)",
          },
          {
            name: "onExpandedChange",
            type: "(keys: Set<Key>) => void",
            description: "Handler called when expanded state changes",
          },
          {
            name: "defaultExpandedKeys",
            type: "Set<Key>",
            description: "Default expanded keys (uncontrolled)",
          },
          {
            name: "aria-label",
            type: "string",
            description: "Accessible label for the tree",
          },
        ]}
      />

      <h2>TreeItem Props</h2>
      <PropsTable
        props={[
          {
            name: "id",
            type: "string",
            description: "Unique identifier for the tree item",
          },
          {
            name: "textValue",
            type: "string",
            description: "Text value for typeahead and accessibility",
          },
          {
            name: "children",
            type: "JSX.Element",
            description: "TreeItemContent and nested TreeItem children",
          },
        ]}
      />

      <h2>TreeExpandButton Props</h2>
      <PropsTable
        props={[
          {
            name: "children",
            type: "JSX.Element",
            description: "Expand/collapse indicator content (e.g. an arrow icon)",
          },
          {
            name: "class",
            type: "string",
            description: "CSS class for the expand button",
          },
        ]}
      />

      <AccessibilitySection>
        <ul class="list-disc pl-5 space-y-1 text-sm">
          <li>
            Uses <code>role="tree"</code> and <code>role="treeitem"</code> ARIA patterns
          </li>
          <li>Arrow keys navigate between visible tree items</li>
          <li>Left arrow collapses an expanded node or moves to parent</li>
          <li>Right arrow expands a collapsed node or moves to first child</li>
          <li>Home/End keys jump to first/last visible item</li>
          <li>Type-ahead search to quickly find items by text</li>
          <li>
            <code>aria-expanded</code> state is announced for expandable items
          </li>
          <li>
            Selection state is communicated via <code>aria-selected</code>
          </li>
          <li>Nested level is exposed via <code>aria-level</code></li>
        </ul>
      </AccessibilitySection>
    </DocPage>
  );
}
