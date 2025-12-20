import type { JSX } from 'solid-js';
import type { AriaButtonProps } from '@proyecto-viviana/solidaria';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'danger' | 'success' | 'ghost' | 'link' | 'negative';
export type ButtonStyle = 'fill' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type StaticColor = 'white' | 'black';

export interface ButtonProps extends AriaButtonProps {
  /** The content to display in the button. */
  children?: JSX.Element;
  /** The visual style of the button. */
  variant?: ButtonVariant;
  /** The background style of the button. */
  style?: ButtonStyle;
  /** The size of the button. */
  size?: ButtonSize;
  /** Whether the button should take up the full width of its container. */
  fullWidth?: boolean;
  /** The static color style to apply. Useful when the button appears over a color background. */
  staticColor?: StaticColor;
  /** Additional CSS class name. */
  class?: string;
  /** Ref to the button element. */
  ref?: HTMLButtonElement | ((el: HTMLButtonElement) => void);
}
