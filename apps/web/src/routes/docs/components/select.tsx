import { createFileRoute } from "@tanstack/solid-router";
import { createSignal } from "solid-js";
import { Select, SelectTrigger, SelectValue, SelectListBox, SelectOption } from "@proyecto-viviana/ui";
import { DocPage, Example, PropsTable, AccessibilitySection } from "@/components/docs";

export const Route = createFileRoute("/docs/components/select")({
  component: SelectPage,
});

function SelectPage() {
  const [selected, setSelected] = createSignal<string | null>(null);

  const options = [
    { id: "apple", name: "Apple" },
    { id: "banana", name: "Banana" },
    { id: "cherry", name: "Cherry" },
    { id: "date", name: "Date" },
    { id: "elderberry", name: "Elderberry" },
  ];

  return (
    <DocPage
      title="Select"
      description="Select allows users to choose a single option from a dropdown list. It's ideal for forms where space is limited."
      importCode={`import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectListBox,
  SelectOption
} from '@proyecto-viviana/ui';`}
    >
      <Example
        title="Basic Usage"
        description="A simple select with static options."
        code={`const [selected, setSelected] = createSignal(null);

<Select
  label="Favorite fruit"
  selectedKey={selected()}
  onSelectionChange={setSelected}
>
  <SelectTrigger>
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectListBox>
    <SelectOption id="apple">Apple</SelectOption>
    <SelectOption id="banana">Banana</SelectOption>
    <SelectOption id="cherry">Cherry</SelectOption>
  </SelectListBox>
</Select>`}
      >
        <div class="max-w-xs">
          <Select
            label="Favorite fruit"
            selectedKey={selected()}
            onSelectionChange={(key) => setSelected(key as string)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectListBox>
              <SelectOption id="apple">Apple</SelectOption>
              <SelectOption id="banana">Banana</SelectOption>
              <SelectOption id="cherry">Cherry</SelectOption>
              <SelectOption id="date">Date</SelectOption>
              <SelectOption id="elderberry">Elderberry</SelectOption>
            </SelectListBox>
          </Select>
          <p class="mt-2 text-sm text-bg-500">Selected: {selected() || "None"}</p>
        </div>
      </Example>

      <Example
        title="With Description"
        description="Add a description to provide additional context."
        code={`<Select
  label="Country"
  description="Select your country of residence"
>
  ...
</Select>`}
      >
        <div class="max-w-xs">
          <Select
            label="Country"
            description="Select your country of residence"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectListBox>
              <SelectOption id="us">United States</SelectOption>
              <SelectOption id="uk">United Kingdom</SelectOption>
              <SelectOption id="ca">Canada</SelectOption>
              <SelectOption id="au">Australia</SelectOption>
            </SelectListBox>
          </Select>
        </div>
      </Example>

      <Example
        title="Disabled Options"
        description="Individual options can be disabled."
        code={`<SelectOption id="premium" isDisabled>
  Premium (Unavailable)
</SelectOption>`}
      >
        <div class="max-w-xs">
          <Select label="Plan">
            <SelectTrigger>
              <SelectValue placeholder="Select a plan" />
            </SelectTrigger>
            <SelectListBox>
              <SelectOption id="free">Free</SelectOption>
              <SelectOption id="basic">Basic - $9/mo</SelectOption>
              <SelectOption id="pro">Pro - $29/mo</SelectOption>
              <SelectOption id="enterprise" isDisabled>
                Enterprise (Contact Sales)
              </SelectOption>
            </SelectListBox>
          </Select>
        </div>
      </Example>

      <Example
        title="Disabled State"
        description="The entire select can be disabled."
        code={`<Select label="Disabled select" isDisabled>
  ...
</Select>`}
      >
        <div class="max-w-xs">
          <Select label="Disabled select" isDisabled>
            <SelectTrigger>
              <SelectValue placeholder="Cannot select" />
            </SelectTrigger>
            <SelectListBox>
              <SelectOption id="opt1">Option 1</SelectOption>
            </SelectListBox>
          </Select>
        </div>
      </Example>

      <Example
        title="Required Field"
        description="Mark the select as required for form validation."
        code={`<Select label="Required field" isRequired>
  ...
</Select>`}
      >
        <div class="max-w-xs">
          <Select label="Required field" isRequired>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectListBox>
              <SelectOption id="opt1">Option 1</SelectOption>
              <SelectOption id="opt2">Option 2</SelectOption>
            </SelectListBox>
          </Select>
        </div>
      </Example>

      <h2>Select Props</h2>
      <PropsTable
        props={[
          {
            name: "label",
            type: "string",
            description: "Label for the select field",
          },
          {
            name: "description",
            type: "string",
            description: "Help text below the select",
          },
          {
            name: "errorMessage",
            type: "string",
            description: "Error message to display",
          },
          {
            name: "selectedKey",
            type: "string | null",
            description: "Currently selected key (controlled)",
          },
          {
            name: "defaultSelectedKey",
            type: "string",
            description: "Default selected key (uncontrolled)",
          },
          {
            name: "onSelectionChange",
            type: "(key: string | null) => void",
            description: "Handler called when selection changes",
          },
          {
            name: "isDisabled",
            type: "boolean",
            default: "false",
            description: "Whether the select is disabled",
          },
          {
            name: "isRequired",
            type: "boolean",
            default: "false",
            description: "Whether a selection is required",
          },
          {
            name: "placeholder",
            type: "string",
            description: "Placeholder text when no selection",
          },
          {
            name: "children",
            type: "JSX.Element",
            description: "SelectTrigger and SelectListBox",
          },
        ]}
      />

      <h2>SelectOption Props</h2>
      <PropsTable
        props={[
          {
            name: "id",
            type: "string",
            description: "Unique identifier for the option",
          },
          {
            name: "textValue",
            type: "string",
            description: "Text value for typeahead (defaults to children text)",
          },
          {
            name: "isDisabled",
            type: "boolean",
            default: "false",
            description: "Whether the option is disabled",
          },
          {
            name: "children",
            type: "JSX.Element",
            description: "Option content",
          },
        ]}
      />

      <AccessibilitySection>
        <ul class="list-disc pl-5 space-y-1 text-sm">
          <li>
            Uses <code>listbox</code> pattern with proper ARIA roles
          </li>
          <li>Full keyboard navigation: Arrow keys, Home, End, Page Up/Down</li>
          <li>Type-ahead search to quickly find options</li>
          <li>
            Announces selection changes to screen readers
          </li>
          <li>Focus trapped within popover when open</li>
          <li>Escape key closes the popover and returns focus to trigger</li>
        </ul>
      </AccessibilitySection>
    </DocPage>
  );
}
