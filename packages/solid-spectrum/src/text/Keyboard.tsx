import { type JSX, splitProps } from "solid-js";
import {
  Keyboard as HeadlessKeyboard,
  type KeyboardProps as HeadlessKeyboardProps,
} from "@proyecto-viviana/solidaria-components";

export interface KeyboardProps extends Omit<HeadlessKeyboardProps, "class"> {
  /** Additional CSS class name. */
  class?: string;
}

/**
 * Displays a keyboard shortcut or key combination in a styled <kbd> tag.
 */
export function StyledKeyboard(props: KeyboardProps): JSX.Element {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <HeadlessKeyboard
      {...rest}
      class={`inline-block px-1.5 py-0.5 text-xs font-mono rounded border border-primary-600 bg-bg-300 text-primary-200 ${local.class ?? ""}`}
    />
  );
}
