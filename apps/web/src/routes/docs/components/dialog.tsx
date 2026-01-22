import { createFileRoute } from "@tanstack/solid-router";
import { createSignal } from "solid-js";
import { Dialog, DialogTrigger, DialogFooter, Button, TextField } from "@proyecto-viviana/ui";
import { DocPage, Example, PropsTable, AccessibilitySection } from "@/components/docs";

export const Route = createFileRoute("/docs/components/dialog")({
  component: DialogPage,
});

function DialogPage() {
  const [isOpen, setIsOpen] = createSignal(false);

  return (
    <DocPage
      title="Dialog"
      description="Dialogs are modal windows that appear over the main content. They're used for important messages, confirmations, or collecting user input."
      importCode={`import { Dialog, DialogTrigger, DialogFooter } from '@proyecto-viviana/ui';`}
    >
      <Example
        title="Basic Dialog"
        description="A simple dialog with a title and content."
        code={`<DialogTrigger>
  <Button>Open Dialog</Button>
  <Dialog title="Welcome">
    <p>This is a basic dialog with some content.</p>
  </Dialog>
</DialogTrigger>`}
      >
        <DialogTrigger>
          <Button>Open Dialog</Button>
          <Dialog title="Welcome">
            <p class="text-bg-600">
              This is a basic dialog with some content. Click outside or press Escape to close.
            </p>
          </Dialog>
        </DialogTrigger>
      </Example>

      <Example
        title="Confirmation Dialog"
        description="Dialogs commonly used to confirm destructive actions."
        code={`<DialogTrigger>
  <Button variant="negative">Delete Item</Button>
  <Dialog title="Confirm Delete">
    <p>Are you sure you want to delete this item?</p>
    <DialogFooter>
      <Button variant="secondary" slot="cancel">Cancel</Button>
      <Button variant="negative" slot="confirm">Delete</Button>
    </DialogFooter>
  </Dialog>
</DialogTrigger>`}
      >
        <DialogTrigger>
          <Button variant="negative">Delete Item</Button>
          <Dialog title="Confirm Delete">
            <p class="text-bg-600">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <DialogFooter>
              <Button variant="secondary">Cancel</Button>
              <Button variant="negative">Delete</Button>
            </DialogFooter>
          </Dialog>
        </DialogTrigger>
      </Example>

      <Example
        title="Form Dialog"
        description="Collect user input within a dialog."
        code={`<DialogTrigger>
  <Button>Edit Profile</Button>
  <Dialog title="Edit Profile">
    <TextField label="Name" defaultValue="John Doe" />
    <TextField label="Email" defaultValue="john@example.com" />
    <DialogFooter>
      <Button variant="secondary">Cancel</Button>
      <Button variant="primary">Save</Button>
    </DialogFooter>
  </Dialog>
</DialogTrigger>`}
      >
        <DialogTrigger>
          <Button>Edit Profile</Button>
          <Dialog title="Edit Profile">
            <div class="space-y-4">
              <TextField label="Name" defaultValue="John Doe" />
              <TextField label="Email" defaultValue="john@example.com" />
            </div>
            <DialogFooter>
              <Button variant="secondary">Cancel</Button>
              <Button variant="primary">Save</Button>
            </DialogFooter>
          </Dialog>
        </DialogTrigger>
      </Example>

      <Example
        title="Controlled Dialog"
        description="Control the dialog's open state programmatically."
        code={`const [isOpen, setIsOpen] = createSignal(false);

<Button onPress={() => setIsOpen(true)}>Open</Button>

<DialogTrigger isOpen={isOpen()} onOpenChange={setIsOpen}>
  <Dialog title="Controlled Dialog">
    <p>This dialog is controlled by state.</p>
  </Dialog>
</DialogTrigger>`}
      >
        <div class="flex gap-3">
          <Button onPress={() => setIsOpen(true)}>Open Controlled Dialog</Button>
          <DialogTrigger isOpen={isOpen()} onOpenChange={setIsOpen}>
            <Dialog title="Controlled Dialog">
              <p class="text-bg-600">This dialog is controlled by state.</p>
              <DialogFooter>
                <Button variant="primary" onPress={() => setIsOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </Dialog>
          </DialogTrigger>
        </div>
      </Example>

      <Example
        title="Sizes"
        description="Dialogs come in different sizes to fit various content needs."
        code={`<Dialog title="Small Dialog" size="sm">...</Dialog>
<Dialog title="Medium Dialog" size="md">...</Dialog>
<Dialog title="Large Dialog" size="lg">...</Dialog>`}
      >
        <div class="flex gap-3">
          <DialogTrigger>
            <Button variant="secondary">Small</Button>
            <Dialog title="Small Dialog" size="sm">
              <p class="text-bg-600">A compact dialog for simple messages.</p>
            </Dialog>
          </DialogTrigger>
          <DialogTrigger>
            <Button variant="secondary">Medium</Button>
            <Dialog title="Medium Dialog" size="md">
              <p class="text-bg-600">The default size for most use cases.</p>
            </Dialog>
          </DialogTrigger>
          <DialogTrigger>
            <Button variant="secondary">Large</Button>
            <Dialog title="Large Dialog" size="lg">
              <p class="text-bg-600">A larger dialog for complex content or forms.</p>
            </Dialog>
          </DialogTrigger>
        </div>
      </Example>

      <h2>DialogTrigger Props</h2>
      <PropsTable
        props={[
          {
            name: "isOpen",
            type: "boolean",
            description: "Whether the dialog is open (controlled)",
          },
          {
            name: "defaultOpen",
            type: "boolean",
            default: "false",
            description: "Whether the dialog is open by default",
          },
          {
            name: "onOpenChange",
            type: "(isOpen: boolean) => void",
            description: "Handler called when open state changes",
          },
          {
            name: "children",
            type: "JSX.Element",
            description: "Trigger button and Dialog component",
          },
        ]}
      />

      <h2>Dialog Props</h2>
      <PropsTable
        props={[
          {
            name: "title",
            type: "string",
            description: "Dialog title (required for accessibility)",
          },
          {
            name: "size",
            type: "'sm' | 'md' | 'lg'",
            default: "'md'",
            description: "Dialog width",
          },
          {
            name: "isDismissable",
            type: "boolean",
            default: "true",
            description: "Whether clicking outside closes the dialog",
          },
          {
            name: "isKeyboardDismissDisabled",
            type: "boolean",
            default: "false",
            description: "Whether Escape key is disabled",
          },
          {
            name: "onClose",
            type: "() => void",
            description: "Handler called when dialog is closed",
          },
          {
            name: "children",
            type: "JSX.Element",
            description: "Dialog content",
          },
        ]}
      />

      <AccessibilitySection>
        <ul class="list-disc pl-5 space-y-1 text-sm">
          <li>
            Uses <code>dialog</code> role with <code>aria-modal="true"</code>
          </li>
          <li>Focus is trapped within the dialog while open</li>
          <li>Focus moves to first focusable element when opened</li>
          <li>Escape key closes the dialog</li>
          <li>Focus returns to trigger element when closed</li>
          <li>Background content is hidden from screen readers</li>
          <li>Page scroll is prevented while dialog is open</li>
        </ul>
      </AccessibilitySection>
    </DocPage>
  );
}
