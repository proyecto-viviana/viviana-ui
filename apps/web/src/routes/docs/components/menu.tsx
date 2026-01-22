import { createFileRoute } from "@tanstack/solid-router";
import { Menu, MenuItem, MenuTrigger, MenuButton, MenuSeparator, Button } from "@proyecto-viviana/ui";
import { DocPage, Example, PropsTable, AccessibilitySection } from "@/components/docs";

export const Route = createFileRoute("/docs/components/menu")({
  component: MenuPage,
});

function MenuPage() {
  return (
    <DocPage
      title="Menu"
      description="Menus display a list of actions or options that a user can choose. They're triggered by a button and appear as a popover."
      importCode={`import {
  Menu,
  MenuItem,
  MenuTrigger,
  MenuButton,
  MenuSeparator
} from '@proyecto-viviana/ui';`}
    >
      <Example
        title="Basic Usage"
        description="A simple menu with action items."
        code={`<MenuTrigger>
  <MenuButton>Actions</MenuButton>
  <Menu onAction={(key) => console.log(key)}>
    <MenuItem id="new">New file</MenuItem>
    <MenuItem id="open">Open</MenuItem>
    <MenuItem id="save">Save</MenuItem>
  </Menu>
</MenuTrigger>`}
      >
        <MenuTrigger>
          <MenuButton>Actions</MenuButton>
          <Menu onAction={(key) => alert(`Action: ${key}`)}>
            <MenuItem id="new">New file</MenuItem>
            <MenuItem id="open">Open</MenuItem>
            <MenuItem id="save">Save</MenuItem>
          </Menu>
        </MenuTrigger>
      </Example>

      <Example
        title="With Separators"
        description="Use separators to group related menu items."
        code={`<Menu>
  <MenuItem id="cut">Cut</MenuItem>
  <MenuItem id="copy">Copy</MenuItem>
  <MenuItem id="paste">Paste</MenuItem>
  <MenuSeparator />
  <MenuItem id="delete">Delete</MenuItem>
</Menu>`}
      >
        <MenuTrigger>
          <MenuButton>Edit</MenuButton>
          <Menu onAction={(key) => alert(`Action: ${key}`)}>
            <MenuItem id="cut">Cut</MenuItem>
            <MenuItem id="copy">Copy</MenuItem>
            <MenuItem id="paste">Paste</MenuItem>
            <MenuSeparator />
            <MenuItem id="selectAll">Select All</MenuItem>
            <MenuSeparator />
            <MenuItem id="delete">Delete</MenuItem>
          </Menu>
        </MenuTrigger>
      </Example>

      <Example
        title="Disabled Items"
        description="Individual menu items can be disabled."
        code={`<MenuItem id="paste" isDisabled>
  Paste (clipboard empty)
</MenuItem>`}
      >
        <MenuTrigger>
          <MenuButton>Edit</MenuButton>
          <Menu onAction={(key) => alert(`Action: ${key}`)}>
            <MenuItem id="cut">Cut</MenuItem>
            <MenuItem id="copy">Copy</MenuItem>
            <MenuItem id="paste" isDisabled>
              Paste (clipboard empty)
            </MenuItem>
          </Menu>
        </MenuTrigger>
      </Example>

      <Example
        title="Custom Trigger"
        description="Use any button as the menu trigger."
        code={`<MenuTrigger>
  <Button variant="accent">Open Menu</Button>
  <Menu>...</Menu>
</MenuTrigger>`}
      >
        <MenuTrigger>
          <Button variant="accent">More Options</Button>
          <Menu onAction={(key) => alert(`Action: ${key}`)}>
            <MenuItem id="settings">Settings</MenuItem>
            <MenuItem id="help">Help</MenuItem>
            <MenuItem id="about">About</MenuItem>
          </Menu>
        </MenuTrigger>
      </Example>

      <Example
        title="Destructive Actions"
        description="Use the negative variant for destructive actions."
        code={`<MenuItem id="delete" variant="negative">
  Delete permanently
</MenuItem>`}
      >
        <MenuTrigger>
          <MenuButton>File Options</MenuButton>
          <Menu onAction={(key) => alert(`Action: ${key}`)}>
            <MenuItem id="rename">Rename</MenuItem>
            <MenuItem id="duplicate">Duplicate</MenuItem>
            <MenuItem id="archive">Archive</MenuItem>
            <MenuSeparator />
            <MenuItem id="delete">Delete permanently</MenuItem>
          </Menu>
        </MenuTrigger>
      </Example>

      <h2>MenuTrigger Props</h2>
      <PropsTable
        props={[
          {
            name: "isOpen",
            type: "boolean",
            description: "Whether the menu is open (controlled)",
          },
          {
            name: "defaultOpen",
            type: "boolean",
            default: "false",
            description: "Whether the menu is open by default",
          },
          {
            name: "onOpenChange",
            type: "(isOpen: boolean) => void",
            description: "Handler called when open state changes",
          },
          {
            name: "children",
            type: "JSX.Element",
            description: "Trigger button and Menu component",
          },
        ]}
      />

      <h2>Menu Props</h2>
      <PropsTable
        props={[
          {
            name: "onAction",
            type: "(key: string) => void",
            description: "Handler called when an item is selected",
          },
          {
            name: "onClose",
            type: "() => void",
            description: "Handler called when menu closes",
          },
          {
            name: "disabledKeys",
            type: "Iterable<string>",
            description: "Keys of disabled items",
          },
          {
            name: "autoFocus",
            type: "boolean | 'first' | 'last'",
            default: "'first'",
            description: "Where to focus when menu opens",
          },
          {
            name: "children",
            type: "JSX.Element",
            description: "MenuItem and MenuSeparator components",
          },
        ]}
      />

      <h2>MenuItem Props</h2>
      <PropsTable
        props={[
          {
            name: "id",
            type: "string",
            description: "Unique identifier for the item",
          },
          {
            name: "textValue",
            type: "string",
            description: "Text value for typeahead",
          },
          {
            name: "isDisabled",
            type: "boolean",
            default: "false",
            description: "Whether the item is disabled",
          },
          {
            name: "onAction",
            type: "() => void",
            description: "Handler called when item is selected",
          },
          {
            name: "children",
            type: "JSX.Element",
            description: "Item content",
          },
        ]}
      />

      <AccessibilitySection>
        <ul class="list-disc pl-5 space-y-1 text-sm">
          <li>
            Uses <code>menu</code> and <code>menuitem</code> ARIA roles
          </li>
          <li>Full keyboard navigation: Arrow keys, Home, End</li>
          <li>Type-ahead search to quickly find items</li>
          <li>Escape key closes the menu and returns focus to trigger</li>
          <li>Focus is automatically moved to the first item when opened</li>
          <li>Screen readers announce item count and current position</li>
        </ul>
      </AccessibilitySection>
    </DocPage>
  );
}
