import { type JSX, splitProps, Show } from "solid-js";

export interface HelpTextProps {
  /** The description text. */
  description?: string;
  /** The error message text. */
  errorMessage?: string;
  /** Whether the field is in an error state. */
  isInvalid?: boolean;
  /** Whether the help text is disabled (dimmed). */
  isDisabled?: boolean;
  /** Additional CSS class name. */
  class?: string;
}

/**
 * Displays description or error text below a form field.
 */
export function HelpText(props: HelpTextProps): JSX.Element {
  const [local] = splitProps(props, [
    "description",
    "errorMessage",
    "isInvalid",
    "isDisabled",
    "class",
  ]);

  const showError = () => local.isInvalid && local.errorMessage;

  return (
    <div class={`text-sm ${local.isDisabled ? "opacity-60" : ""} ${local.class ?? ""}`}>
      <Show when={showError()}>
        <p class="text-red-400" role="alert">
          {local.errorMessage}
        </p>
      </Show>
      <Show when={!showError() && local.description}>
        <p class="text-primary-400">{local.description}</p>
      </Show>
    </div>
  );
}
