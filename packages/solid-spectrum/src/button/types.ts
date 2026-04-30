import type { JSX } from "solid-js";
import type { ButtonProps as HeadlessButtonProps } from "@proyecto-viviana/solidaria-components";

export type SpectrumButtonVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "negative"
  | "premium"
  | "genai";
export type LegacyButtonVariant = "positive" | "danger" | "success" | "ghost" | "link";
export type ButtonVariant = SpectrumButtonVariant | LegacyButtonVariant;
export type ButtonFillStyle = "fill" | "outline";
/** @deprecated Use ButtonFillStyle/fillStyle. */
export type ButtonStyle = ButtonFillStyle;
export type SpectrumButtonSize = "S" | "M" | "L" | "XL";
export type LegacyButtonSize = "sm" | "md" | "lg";
export type ButtonSize = SpectrumButtonSize | LegacyButtonSize;
export type StaticColor = "white" | "black" | "auto";

export interface ButtonProps extends Omit<HeadlessButtonProps, "class" | "children" | "style"> {
  /** The content to display in the button. */
  children?: JSX.Element;
  /** The visual style of the button. */
  variant?: ButtonVariant;
  /** The background style of the button. */
  fillStyle?: ButtonFillStyle;
  /** @deprecated Use fillStyle. */
  buttonStyle?: ButtonStyle;
  /** The size of the button. */
  size?: ButtonSize;
  /** Whether the button should take up the full width of its container. */
  fullWidth?: boolean;
  /** The static color style to apply. Useful when the button appears over a color background. */
  staticColor?: StaticColor;
  /** Additional CSS class name. */
  class?: string;
}
