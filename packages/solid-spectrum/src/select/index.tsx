/**
 * Select component for proyecto-viviana-solid-spectrum
 *
 * Styled select component built on top of solidaria-components.
 * Inspired by Spectrum 2's Picker component patterns.
 */

import { type JSX, Show, splitProps, createContext, useContext, createUniqueId } from "solid-js";
import {
  Select as HeadlessSelect,
  SelectTrigger as HeadlessSelectTrigger,
  SelectValue as HeadlessSelectValue,
  SelectListBox as HeadlessSelectListBox,
  SelectOption as HeadlessSelectOption,
  type SelectProps as HeadlessSelectProps,
  type SelectTriggerProps as HeadlessSelectTriggerProps,
  type SelectValueProps as HeadlessSelectValueProps,
  type SelectListBoxProps as HeadlessSelectListBoxProps,
  type SelectOptionProps as HeadlessSelectOptionProps,
  type SelectRenderProps,
  type SelectTriggerRenderProps,
  type SelectValueRenderProps,
  type SelectListBoxRenderProps,
  type SelectOptionRenderProps,
} from "@proyecto-viviana/solidaria-components";
import type { Key } from "@proyecto-viviana/solid-stately";
import { useProviderProps } from "../provider";

// ============================================
// SIZE CONTEXT
// ============================================

export type SelectSize = "sm" | "md" | "lg";

const SelectSizeContext = createContext<SelectSize>("md");

// ============================================
// TYPES
// ============================================

export interface SelectProps<T> extends Omit<HeadlessSelectProps<T>, "class" | "style"> {
  /** The size of the select. */
  size?: SelectSize;
  /** Additional CSS class name. */
  class?: string;
  /** Label for the select. */
  label?: string;
  /** Description for the select. */
  description?: string;
  /** Error message when invalid. */
  errorMessage?: string;
  /** Whether the select is invalid. */
  isInvalid?: boolean;
}

export interface SelectTriggerProps extends Omit<HeadlessSelectTriggerProps, "class" | "style"> {
  /** Additional CSS class name. */
  class?: string;
}

export interface SelectValueProps<T> extends Omit<HeadlessSelectValueProps<T>, "class" | "style"> {
  /** Additional CSS class name. */
  class?: string;
}

export interface SelectListBoxProps<T> extends Omit<
  HeadlessSelectListBoxProps<T>,
  "class" | "style"
> {
  /** Additional CSS class name. */
  class?: string;
}

export interface SelectOptionProps<T> extends Omit<
  HeadlessSelectOptionProps<T>,
  "class" | "style"
> {
  /** Additional CSS class name. */
  class?: string;
}

// ============================================
// STYLES
// ============================================

const sizeStyles = {
  sm: {
    trigger: "h-8 text-sm px-3 gap-2",
    label: "text-sm",
    option: "text-sm py-1.5 px-3",
    icon: "h-4 w-4",
  },
  md: {
    trigger: "h-10 text-base px-4 gap-2",
    label: "text-base",
    option: "text-base py-2 px-4",
    icon: "h-5 w-5",
  },
  lg: {
    trigger: "h-12 text-lg px-5 gap-3",
    label: "text-lg",
    option: "text-lg py-2.5 px-5",
    icon: "h-6 w-6",
  },
};

// ============================================
// SELECT COMPONENT
// ============================================

/**
 * A select displays a collapsible list of options and allows a user to select one of them.
 *
 * Built on solidaria-components Select for full accessibility support.
 */
export function Select<T>(props: SelectProps<T>): JSX.Element {
  const mergedProps = useProviderProps(props);
  const descriptionId = createUniqueId();
  const errorId = createUniqueId();

  const [local, headlessProps] = splitProps(mergedProps, [
    "size",
    "class",
    "label",
    "description",
    "errorMessage",
    "isInvalid",
  ]);

  const size = local.size ?? "md";
  const customClass = local.class ?? "";

  const getClassName = (renderProps: SelectRenderProps): string => {
    const base = "relative inline-flex flex-col gap-1.5";
    const disabledClass = renderProps.isDisabled ? "opacity-50" : "";
    return [base, disabledClass, customClass].filter(Boolean).join(" ");
  };

  const mergedAriaLabel = (headlessProps as { "aria-label"?: string })["aria-label"];

  const styledLabel = () =>
    local.label ? (
      <span class={`text-primary-200 font-medium ${sizeStyles[size].label}`}>{local.label}</span>
    ) : undefined;

  const describedByIds =
    [
      (headlessProps as { "aria-describedby"?: string })["aria-describedby"],
      local.description && !local.isInvalid ? descriptionId : undefined,
      local.errorMessage && local.isInvalid ? errorId : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <SelectSizeContext.Provider value={size}>
      <HeadlessSelect
        {...headlessProps}
        label={styledLabel()}
        aria-label={mergedAriaLabel}
        aria-describedby={describedByIds}
        class={getClassName}
      >
        {props.children as JSX.Element}
        <Show when={local.description && !local.isInvalid}>
          <span id={descriptionId} class="text-primary-400 text-sm">
            {local.description}
          </span>
        </Show>
        <Show when={local.errorMessage && local.isInvalid}>
          <span id={errorId} class="text-danger-400 text-sm">
            {local.errorMessage}
          </span>
        </Show>
      </HeadlessSelect>
    </SelectSizeContext.Provider>
  );
}

// ============================================
// SELECT TRIGGER COMPONENT
// ============================================

/**
 * The trigger button for a select.
 * SSR-compatible - renders children and chevron icon directly without render props.
 */
export function SelectTrigger(props: SelectTriggerProps): JSX.Element {
  const mergedProps = useProviderProps(props);
  const [local, headlessProps] = splitProps(mergedProps, ["class"]);
  const size = useContext(SelectSizeContext);
  const sizeStyle = sizeStyles[size];
  const customClass = local.class ?? "";

  const getClassName = (renderProps: SelectTriggerRenderProps): string => {
    const base =
      "inline-flex items-center justify-between rounded-lg border-2 transition-all duration-200 w-full";
    const sizeClass = sizeStyle.trigger;

    let colorClass: string;
    if (renderProps.isDisabled) {
      colorClass = "border-bg-300 bg-bg-200 text-primary-500 cursor-not-allowed";
    } else if (renderProps.isOpen) {
      colorClass = "border-accent bg-bg-300 text-primary-100";
    } else if (renderProps.isHovered) {
      colorClass = "border-accent-300 bg-bg-300 text-primary-100 cursor-pointer";
    } else {
      colorClass = "border-primary-600 bg-bg-400 text-primary-200 cursor-pointer";
    }

    const focusClass = renderProps.isFocusVisible
      ? "ring-2 ring-accent-300 ring-offset-2 ring-offset-bg-400"
      : "";

    return [base, sizeClass, colorClass, focusClass, customClass].filter(Boolean).join(" ");
  };

  return (
    <HeadlessSelectTrigger {...headlessProps} class={getClassName}>
      {props.children as JSX.Element}
      {/* Chevron rotates via CSS based on data-open attribute from headless component */}
      <ChevronIcon
        class={`${sizeStyle.icon} transition-transform duration-200 data-open:rotate-180`}
      />
    </HeadlessSelectTrigger>
  );
}

// ============================================
// SELECT VALUE COMPONENT
// ============================================

/**
 * Displays the selected value in a select.
 */
export function SelectValue<T>(props: SelectValueProps<T>): JSX.Element {
  const [local, headlessProps] = splitProps(props, ["class"]);
  const customClass = local.class ?? "";

  const getClassName = (renderProps: SelectValueRenderProps<T>): string => {
    const base = "truncate flex-1 text-left";
    const placeholderClass = !renderProps.isSelected ? "text-primary-500" : "";
    return [base, placeholderClass, customClass].filter(Boolean).join(" ");
  };

  return <HeadlessSelectValue {...headlessProps} class={getClassName} children={props.children} />;
}

// ============================================
// SELECT LISTBOX COMPONENT
// ============================================

/**
 * The listbox popup for a select.
 */
export function SelectListBox<T>(props: SelectListBoxProps<T>): JSX.Element {
  const [local, headlessProps] = splitProps(props, ["class"]);
  const customClass = local.class ?? "";

  const getClassName = (_renderProps: SelectListBoxRenderProps): string => {
    const base =
      "absolute z-50 mt-1 w-full rounded-lg border-2 border-primary-600 bg-bg-400 py-1 shadow-lg max-h-60 overflow-auto";
    return [base, customClass].filter(Boolean).join(" ");
  };

  return (
    <HeadlessSelectListBox {...headlessProps} class={getClassName} children={props.children} />
  );
}

// ============================================
// SELECT OPTION COMPONENT
// ============================================

// Padding classes for when no check icon is shown (to maintain alignment)
const paddingStyles = {
  sm: "pl-6", // h-4 (1rem) + gap-2 (0.5rem) = 1.5rem = pl-6
  md: "pl-7", // h-5 (1.25rem) + gap-2 (0.5rem) = 1.75rem ≈ pl-7
  lg: "pl-9", // h-6 (1.5rem) + gap-3 (0.75rem) = 2.25rem = pl-9
};

/**
 * An option in a select listbox.
 * SSR-compatible - renders check icon and content directly without render props.
 */
export function SelectOption<T>(props: SelectOptionProps<T>): JSX.Element {
  const [local, headlessProps] = splitProps(props, ["class"]);
  const size = useContext(SelectSizeContext);
  const sizeStyle = sizeStyles[size];
  const customClass = local.class ?? "";

  const getClassName = (renderProps: SelectOptionRenderProps): string => {
    const base = "flex items-center gap-2 cursor-pointer transition-colors duration-150";
    const sizeClass = sizeStyle.option;

    let colorClass: string;
    if (renderProps.isDisabled) {
      colorClass = "text-primary-500 cursor-not-allowed";
    } else if (renderProps.isSelected) {
      colorClass = "bg-accent/20 text-accent";
    } else if (renderProps.isFocused || renderProps.isHovered) {
      colorClass = "bg-bg-300 text-primary-100";
    } else {
      colorClass = "text-primary-200";
    }

    const focusClass = renderProps.isFocusVisible ? "ring-2 ring-inset ring-accent-300" : "";

    return [base, sizeClass, colorClass, focusClass, customClass].filter(Boolean).join(" ");
  };

  const iconClass = `${sizeStyle.icon} text-accent shrink-0 hidden data-selected:block`;
  const paddingClass = paddingStyles[size];

  return (
    <HeadlessSelectOption {...headlessProps} class={getClassName}>
      {/* Check icon shows only when selected via data-selected attribute */}
      <CheckIcon class={iconClass} />
      <span class={`flex-1 data-selected:pl-0 ${paddingClass}`}>
        {props.children as JSX.Element}
      </span>
    </HeadlessSelectOption>
  );
}

// ============================================
// ICONS
// ============================================

function ChevronIcon(props: { class?: string }): JSX.Element {
  return (
    <svg class={props.class} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function CheckIcon(props: { class?: string }): JSX.Element {
  return (
    <svg class={props.class} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

// Attach sub-components for convenience
Select.Trigger = SelectTrigger;
Select.Value = SelectValue;
Select.ListBox = SelectListBox;
Select.Option = SelectOption;

// Re-export Key type for convenience
export type { Key };
