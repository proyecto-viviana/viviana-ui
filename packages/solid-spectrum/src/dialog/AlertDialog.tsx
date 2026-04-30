import { type JSX, splitProps, Show } from "solid-js";
import {
  Dialog as HeadlessDialog,
  DialogTrigger as HeadlessDialogTrigger,
  Heading as HeadlessHeading,
  Modal as HeadlessModal,
  ModalOverlay as HeadlessModalOverlay,
  type DialogRenderProps,
} from "@proyecto-viviana/solidaria-components";
import { Button } from "../button";

export type AlertDialogVariant =
  | "confirmation"
  | "information"
  | "destructive"
  | "error"
  | "warning";

export interface AlertDialogProps {
  /** The title of the alert dialog. */
  title: string;
  /** The content/message of the alert dialog. */
  children: JSX.Element;
  /** The trigger element that opens the dialog. */
  trigger?: JSX.Element;
  /** The variant of the alert dialog. @default 'confirmation' */
  variant?: AlertDialogVariant;
  /** Label for the primary action button. @default 'Confirm' */
  primaryActionLabel?: string;
  /** Label for the secondary/cancel button. @default 'Cancel' */
  cancelLabel?: string;
  /** Handler called when the primary action is triggered. */
  onPrimaryAction?: () => void;
  /** Handler called when canceled. */
  onCancel?: () => void;
  /** Whether the dialog is open. */
  isOpen?: boolean;
  /** Handler called when open state changes. */
  onOpenChange?: (isOpen: boolean) => void;
  /** Whether the primary action button should auto-focus. @default true */
  autoFocusButton?: "primary" | "cancel";
  /** Additional CSS class name. */
  class?: string;
  /** Whether the dialog is dismissable by clicking outside. @default false */
  isDismissable?: boolean;
}

const variantStyles: Record<AlertDialogVariant, { icon: string; buttonVariant: string }> = {
  confirmation: { icon: "text-accent", buttonVariant: "" },
  information: { icon: "text-blue-400", buttonVariant: "" },
  destructive: { icon: "text-red-400", buttonVariant: "destructive" },
  error: { icon: "text-red-400", buttonVariant: "" },
  warning: { icon: "text-yellow-400", buttonVariant: "" },
};

/**
 * A dialog that requires user acknowledgement before proceeding.
 */
export function AlertDialog(props: AlertDialogProps): JSX.Element {
  const [local] = splitProps(props, [
    "title",
    "children",
    "trigger",
    "variant",
    "primaryActionLabel",
    "cancelLabel",
    "onPrimaryAction",
    "onCancel",
    "isOpen",
    "onOpenChange",
    "autoFocusButton",
    "class",
    "isDismissable",
  ]);

  const variant = () => local.variant ?? "confirmation";
  const styles = () => variantStyles[variant()];

  return (
    <HeadlessDialogTrigger isOpen={local.isOpen} onOpenChange={local.onOpenChange}>
      {local.trigger}
      <HeadlessModalOverlay
        isDismissable={local.isDismissable ?? false}
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <HeadlessModal class="w-full max-w-md">
          <HeadlessDialog
            role="alertdialog"
            class={`bg-bg-300 rounded-lg shadow-xl border border-primary-700 p-6 ${local.class ?? ""}`}
          >
            {({ close }: DialogRenderProps) => (
              <>
                <HeadlessHeading
                  slot="title"
                  class={`text-lg font-semibold text-primary-100 mb-3 ${styles().icon}`}
                >
                  {local.title}
                </HeadlessHeading>

                <div class="text-primary-300 text-sm mb-6">{local.children}</div>

                <div class="flex justify-end gap-3">
                  <Show when={local.cancelLabel !== undefined || local.onCancel}>
                    <Button
                      variant="secondary"
                      onPress={() => {
                        local.onCancel?.();
                        close();
                      }}
                      autoFocus={local.autoFocusButton === "cancel"}
                    >
                      {local.cancelLabel ?? "Cancel"}
                    </Button>
                  </Show>

                  <Button
                    variant={variant() === "destructive" ? "negative" : "accent"}
                    onPress={() => {
                      local.onPrimaryAction?.();
                      close();
                    }}
                    autoFocus={local.autoFocusButton !== "cancel"}
                  >
                    {local.primaryActionLabel ?? "Confirm"}
                  </Button>
                </div>
              </>
            )}
          </HeadlessDialog>
        </HeadlessModal>
      </HeadlessModalOverlay>
    </HeadlessDialogTrigger>
  );
}
