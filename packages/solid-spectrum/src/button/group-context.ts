import { createContext, useContext } from "solid-js";
import type { StyleString } from "../s2-style";
import type { ButtonSize, StaticColor } from "./types";

export type ActionButtonSize = "XS" | "S" | "M" | "L" | "XL";
export type ActionButtonDensity = "regular" | "compact";
export type ActionButtonOrientation = "horizontal" | "vertical";

export interface ButtonGroupContextValue {
  size?: ButtonSize;
  isDisabled?: boolean;
  styles?: StyleString;
}

export interface ActionButtonGroupContextValue {
  size?: ActionButtonSize;
  density?: ActionButtonDensity;
  orientation?: ActionButtonOrientation;
  isQuiet?: boolean;
  isJustified?: boolean;
  isEmphasized?: boolean;
  staticColor?: StaticColor;
  isDisabled?: boolean;
}

export const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);
export const ActionButtonGroupContext = createContext<ActionButtonGroupContextValue | null>(null);

export function useButtonGroupContext(): ButtonGroupContextValue | null {
  return useContext(ButtonGroupContext);
}

export function useActionButtonGroupContext(): ActionButtonGroupContextValue | null {
  return useContext(ActionButtonGroupContext);
}
