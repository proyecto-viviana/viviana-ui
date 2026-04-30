import { type JSX, splitProps } from "solid-js";
import {
  Text as HeadlessText,
  type TextProps as HeadlessTextProps,
} from "@proyecto-viviana/solidaria-components";

export type TextVariant = "default" | "muted" | "success" | "danger";
export type TextSize = "sm" | "md" | "lg";

export interface TextProps extends Omit<HeadlessTextProps, "class"> {
  variant?: TextVariant;
  size?: TextSize;
  class?: string;
}

const variantStyles: Record<TextVariant, string> = {
  default: "text-primary-100",
  muted: "text-primary-400",
  success: "text-green-500",
  danger: "text-danger-400",
};

const sizeStyles: Record<TextSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export function Text(props: TextProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ["variant", "size", "class"]);
  const variant = () => local.variant ?? "default";
  const size = () => local.size ?? "md";
  return (
    <HeadlessText
      {...headlessProps}
      class={`${variantStyles[variant()]} ${sizeStyles[size()]} ${local.class ?? ""}`}
    />
  );
}

// Sub-component re-exports
export { Heading } from "./Heading";
export type { HeadingProps, HeadingLevel } from "./Heading";
export { StyledKeyboard } from "./Keyboard";
export { StyledKeyboard as Keyboard } from "./Keyboard";
export type { KeyboardProps as StyledKeyboardProps } from "./Keyboard";
