/**
 * RadioGroup and Radio components for proyecto-viviana-solid-spectrum
 *
 * Styled radio components built on top of solidaria-components.
 */

import { type JSX, Show, createContext, useContext, splitProps, createUniqueId } from "solid-js";
import {
  RadioGroup as HeadlessRadioGroup,
  Radio as HeadlessRadio,
  type RadioGroupProps as HeadlessRadioGroupProps,
  type RadioProps as HeadlessRadioProps,
  type RadioGroupRenderProps,
  type RadioRenderProps,
} from "@proyecto-viviana/solidaria-components";
import { useProviderProps } from "../provider";

// ============================================
// SIZE CONTEXT
// ============================================

export type RadioGroupOrientation = "horizontal" | "vertical";
export type RadioGroupSize = "sm" | "md" | "lg";

const RadioSizeContext = createContext<RadioGroupSize>("md");

// ============================================
// TYPES
// ============================================

export interface RadioGroupProps extends Omit<HeadlessRadioGroupProps, "class" | "style"> {
  /** The size of the radio buttons. */
  size?: RadioGroupSize;
  /** Additional CSS class name. */
  class?: string;
  /** Label for the group. */
  label?: string;
  /** Description for the group. */
  description?: string;
  /** Error message when invalid. */
  errorMessage?: string;
}

export interface RadioProps extends Omit<HeadlessRadioProps, "class" | "style"> {
  /** Additional CSS class name. */
  class?: string;
}

// ============================================
// STYLES
// ============================================

const sizeStyles = {
  sm: {
    circle: "h-4 w-4",
    dot: "h-2 w-2",
    label: "text-sm",
  },
  md: {
    circle: "h-5 w-5",
    dot: "h-2.5 w-2.5",
    label: "text-base",
  },
  lg: {
    circle: "h-6 w-6",
    dot: "h-3 w-3",
    label: "text-lg",
  },
};

// ============================================
// RADIO GROUP COMPONENT
// ============================================

/**
 * A radio group allows users to select a single option from a list of mutually exclusive options.
 *
 * Built on solidaria-components RadioGroup for full accessibility support.
 */
export function RadioGroup(props: RadioGroupProps): JSX.Element {
  const mergedProps = useProviderProps(props);
  // Split out our custom styling props from the rest
  const [local, headlessProps] = splitProps(mergedProps, [
    "size",
    "class",
    "label",
    "description",
    "errorMessage",
  ]);

  const size = local.size ?? "md";
  const customClass = local.class ?? "";
  const idBase = createUniqueId();
  const labelId = `${idBase}-label`;
  const descriptionId = `${idBase}-description`;
  const errorId = `${idBase}-error`;

  // Generate class based on render props
  const getClassName = (renderProps: RadioGroupRenderProps): string => {
    const base = "flex gap-2";
    const orientationClass =
      renderProps.orientation === "horizontal" ? "flex-row flex-wrap" : "flex-col";
    const disabledClass = renderProps.isDisabled ? "opacity-50" : "";
    return [base, orientationClass, disabledClass, customClass].filter(Boolean).join(" ");
  };

  const ariaDescribedBy = () => {
    const ids = [
      headlessProps["aria-describedby"],
      local.description ? descriptionId : undefined,
      local.errorMessage && headlessProps.isInvalid ? errorId : undefined,
    ].filter(Boolean);
    return ids.length > 0 ? ids.join(" ") : undefined;
  };

  // Pass remaining props through to headless component
  // headlessProps maintains reactivity for controlled values like value/onChange
  return (
    <RadioSizeContext.Provider value={size}>
      <HeadlessRadioGroup
        {...headlessProps}
        aria-labelledby={headlessProps["aria-labelledby"] ?? (local.label ? labelId : undefined)}
        aria-describedby={ariaDescribedBy()}
        class={getClassName}
        data-size={size}
      >
        <Show when={local.label}>
          <span id={labelId} class="text-primary-200 font-medium mb-1">
            {local.label}
          </span>
        </Show>
        {props.children as JSX.Element}
        <Show when={local.description}>
          <span id={descriptionId} class="text-primary-400 text-sm [&:has(~[data-invalid])]:hidden">
            {local.description}
          </span>
        </Show>
        <Show when={local.errorMessage}>
          <span id={errorId} class="text-danger-400 text-sm hidden [[data-invalid]_&]:block">
            {local.errorMessage}
          </span>
        </Show>
      </HeadlessRadioGroup>
    </RadioSizeContext.Provider>
  );
}

// ============================================
// RADIO COMPONENT
// ============================================

/**
 * A radio button allows users to select a single option from a list.
 * Must be used within a RadioGroup.
 *
 * Built on solidaria-components Radio for full accessibility support.
 */
export function Radio(props: RadioProps): JSX.Element {
  const mergedProps = useProviderProps(props);
  const [local, headlessProps] = splitProps(mergedProps, ["class"]);
  const sizeFromContext = useContext(RadioSizeContext);
  const sizeStyle = sizeStyles[sizeFromContext];
  const customClass = local.class ?? "";

  // Generate class based on render props
  const getClassName = (renderProps: RadioRenderProps): string => {
    const base = "inline-flex items-center gap-2";
    const cursorClass = renderProps.isDisabled ? "cursor-not-allowed" : "cursor-pointer";
    const disabledClass = renderProps.isDisabled ? "opacity-50" : "";
    return [base, cursorClass, disabledClass, customClass].filter(Boolean).join(" ");
  };

  // Use data-selected attribute from headless Radio for conditional dot visibility via CSS
  const circleClass = `relative flex items-center justify-center rounded-full border-2 transition-all duration-200 pointer-events-none ${sizeStyle.circle} border-primary-600 bg-transparent hover:border-accent-300 [[data-selected]_&]:border-accent`;
  const dotClass = `rounded-full bg-accent transition-all duration-200 pointer-events-none ${sizeStyle.dot} scale-0 [[data-selected]_&]:scale-100`;
  const labelClass = `text-primary-200 ${sizeStyle.label}`;

  return (
    <HeadlessRadio {...headlessProps} class={getClassName}>
      {(renderProps) => (
        <>
          <span class={circleClass} style={{ "pointer-events": "none" }}>
            <span class={dotClass} style={{ "pointer-events": "none" }} />
          </span>
          <Show when={props.children}>
            <span class={labelClass}>
              {typeof props.children === "function" ? props.children(renderProps) : props.children}
            </span>
          </Show>
        </>
      )}
    </HeadlessRadio>
  );
}
