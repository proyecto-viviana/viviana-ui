import { createFileRoute } from "@tanstack/solid-router";
import { createSignal } from "solid-js";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  TableSelectionCheckbox,
  TableSelectAllCheckbox,
} from "@proyecto-viviana/ui";
import { DocPage, Example, PropsTable, AccessibilitySection } from "@/components/docs";

export const Route = createFileRoute("/docs/components/table")({
  component: TablePage,
});

const sampleData = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "Admin" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "Editor" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "Viewer" },
  { id: "4", name: "Alice Brown", email: "alice@example.com", role: "Editor" },
];

function TablePage() {
  const [selectedKeys, setSelectedKeys] = createSignal<Set<string>>(new Set());

  return (
    <DocPage
      title="Table"
      description="Tables display data in rows and columns. They support sorting, selection, and custom rendering."
      importCode={`import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from '@proyecto-viviana/ui';`}
    >
      <Example
        title="Basic Table"
        description="A simple table displaying data in rows and columns."
        code={`<Table aria-label="Users">
  <TableHeader>
    <TableColumn>Name</TableColumn>
    <TableColumn>Email</TableColumn>
    <TableColumn>Role</TableColumn>
  </TableHeader>
  <TableBody>
    <TableRow id="1">
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
      <TableCell>Admin</TableCell>
    </TableRow>
    ...
  </TableBody>
</Table>`}
      >
        <Table aria-label="Users table">
          <TableHeader>
            <TableColumn>Name</TableColumn>
            <TableColumn>Email</TableColumn>
            <TableColumn>Role</TableColumn>
          </TableHeader>
          <TableBody>
            {sampleData.map((user) => (
              <TableRow id={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Example>

      <Example
        title="Selectable Rows"
        description="Enable row selection with checkboxes."
        code={`<Table
  aria-label="Selectable table"
  selectionMode="multiple"
  selectedKeys={selectedKeys()}
  onSelectionChange={setSelectedKeys}
>
  <TableHeader>
    <TableColumn><TableSelectAllCheckbox /></TableColumn>
    <TableColumn>Name</TableColumn>
    ...
  </TableHeader>
  <TableBody>
    <TableRow id="1">
      <TableCell><TableSelectionCheckbox /></TableCell>
      <TableCell>John Doe</TableCell>
      ...
    </TableRow>
  </TableBody>
</Table>`}
      >
        <div>
          <Table
            aria-label="Selectable users table"
            selectionMode="multiple"
            selectedKeys={selectedKeys()}
            onSelectionChange={(keys) => setSelectedKeys(keys as Set<string>)}
          >
            <TableHeader>
              <TableColumn>
                <TableSelectAllCheckbox />
              </TableColumn>
              <TableColumn>Name</TableColumn>
              <TableColumn>Email</TableColumn>
              <TableColumn>Role</TableColumn>
            </TableHeader>
            <TableBody>
              {sampleData.map((user) => (
                <TableRow id={user.id}>
                  <TableCell>
                    <TableSelectionCheckbox />
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p class="mt-2 text-sm text-bg-500">
            Selected: {selectedKeys().size > 0 ? [...selectedKeys()].join(", ") : "None"}
          </p>
        </div>
      </Example>

      <Example
        title="Sortable Columns"
        description="Enable sorting by clicking column headers."
        code={`<Table
  aria-label="Sortable table"
  sortDescriptor={sortDescriptor()}
  onSortChange={setSortDescriptor}
>
  <TableHeader>
    <TableColumn id="name" allowsSorting>Name</TableColumn>
    <TableColumn id="email" allowsSorting>Email</TableColumn>
  </TableHeader>
  ...
</Table>`}
      >
        <Table aria-label="Sortable users table">
          <TableHeader>
            <TableColumn id="name" allowsSorting>
              Name
            </TableColumn>
            <TableColumn id="email" allowsSorting>
              Email
            </TableColumn>
            <TableColumn id="role" allowsSorting>
              Role
            </TableColumn>
          </TableHeader>
          <TableBody>
            {sampleData.map((user) => (
              <TableRow id={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Example>

      <h2>Table Props</h2>
      <PropsTable
        props={[
          {
            name: "aria-label",
            type: "string",
            description: "Accessible label for the table",
          },
          {
            name: "selectionMode",
            type: "'none' | 'single' | 'multiple'",
            default: "'none'",
            description: "How rows can be selected",
          },
          {
            name: "selectedKeys",
            type: "Set<string>",
            description: "Currently selected row keys",
          },
          {
            name: "onSelectionChange",
            type: "(keys: Set<string>) => void",
            description: "Handler for selection changes",
          },
          {
            name: "sortDescriptor",
            type: "{ column: string, direction: 'ascending' | 'descending' }",
            description: "Current sort state",
          },
          {
            name: "onSortChange",
            type: "(descriptor: SortDescriptor) => void",
            description: "Handler for sort changes",
          },
          {
            name: "disabledKeys",
            type: "Set<string>",
            description: "Keys of disabled rows",
          },
        ]}
      />

      <h2>TableColumn Props</h2>
      <PropsTable
        props={[
          {
            name: "id",
            type: "string",
            description: "Unique column identifier (required for sorting)",
          },
          {
            name: "allowsSorting",
            type: "boolean",
            default: "false",
            description: "Whether column is sortable",
          },
          {
            name: "width",
            type: "string | number",
            description: "Column width",
          },
          {
            name: "children",
            type: "JSX.Element",
            description: "Column header content",
          },
        ]}
      />

      <h2>TableRow Props</h2>
      <PropsTable
        props={[
          {
            name: "id",
            type: "string",
            description: "Unique row identifier",
          },
          {
            name: "children",
            type: "JSX.Element",
            description: "TableCell components",
          },
        ]}
      />

      <AccessibilitySection>
        <ul class="list-disc pl-5 space-y-1 text-sm">
          <li>
            Uses native <code>&lt;table&gt;</code> elements with proper ARIA roles
          </li>
          <li>Keyboard navigation: Arrow keys to move between cells</li>
          <li>Row selection announced to screen readers</li>
          <li>Sort state announced when columns are sorted</li>
          <li>Focus indicator clearly shows current cell</li>
          <li>Supports both single and multiple selection modes</li>
        </ul>
      </AccessibilitySection>
    </DocPage>
  );
}
