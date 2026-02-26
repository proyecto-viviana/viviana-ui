import type { JSX } from 'solid-js';
import type { ButtonProps as HeadlessButtonProps } from '@proyecto-viviana/solidaria-components';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'positive' | 'negative' | 'ghost' | 'link';
export type ButtonStyle = 'fill' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type StaticColor = 'white' | 'black';

export interface ButtonProps extends Omit<HeadlessButtonProps, 'class' | 'children' | 'style'> {
  /** The content to display in the button. */
  children?: JSX.Element;
  /** The visual style of the button. */
  variant?: ButtonVariant;
  /** The background style of the button. */
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
