/**
 * TimeField component for proyecto-viviana-solid-spectrum
 *
 * Styled time field component with segment-based editing.
 */

import { type JSX, splitProps } from "solid-js";
import {
  TimeField as HeadlessTimeField,
  TimeFieldLabel,
  TimeFieldDescription,
  TimeFieldErrorMessage,
  TimeInput,
  TimeSegment,
  type TimeFieldProps as HeadlessTimeFieldProps,
  type TimeValue,
} from "@proyecto-viviana/solidaria-components";
import { useProviderProps } from "../provider";

// ============================================
// TYPES
// ============================================

export type TimeFieldSize = "sm" | "md" | "lg";

export interface TimeFieldProps<T extends TimeValue = TimeValue> extends Omit<
  HeadlessTimeFieldProps<T>,
  "class" | "style" | "children"
> {
  /** The size of the field. @default 'md' */
  size?: TimeFieldSize;
  /** Additional CSS class name. */
  class?: string;
  /** Label for the field. */
  label?: string;
  /** Description text. */
  description?: string;
  /** Error message. */
  errorMessage?: string;
}

// ============================================
// STYLES
// ============================================

const sizeStyles = {
  sm: {
    container: "text-sm",
    input: "px-2 py-1 gap-0.5",
    segment: "px-0.5",
    label: "text-xs",
  },
  md: {
    container: "text-base",
    input: "px-3 py-2 gap-1",
    segment: "px-1",
    label: "text-sm",
  },
  lg: {
    container: "text-lg",
    input: "px-4 py-3 gap-1.5",
    segment: "px-1.5",
    label: "text-base",
  },
};

// ============================================
// TIME FIELD COMPONENT
// ============================================

/**
 * A time field allows users to enter and edit time values using a keyboard.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <TimeField label="Start time" />
 *
 * // With 24-hour format
 * <TimeField
 *   label="Meeting time"
 *   hourCycle={24}
 * />
 *
 * // With seconds
 * <TimeField
 *   label="Precise time"
 *   granularity="second"
 * />
 * ```
 */
export function TimeField<T extends TimeValue = TimeValue>(props: TimeFieldProps<T>): JSX.Element {
  const mergedProps = useProviderProps(props);
  const [local, rest] = splitProps(mergedProps, [
    "size",
    "class",
    "label",
    "description",
    "errorMessage",
    "isInvalid",
  ]);

  const size = () => local.size ?? "md";
  const sizeConfig = () => sizeStyles[size()];
  const isInvalid = () => local.isInvalid || !!local.errorMessage;

  return (
    <HeadlessTimeField
      {...rest}
      label={local.label}
      description={local.description}
      errorMessage={local.errorMessage}
      isInvalid={isInvalid()}
      class={`
        flex flex-col gap-1
        ${sizeConfig().container}
        ${local.class ?? ""}
      `}
    >
      {/* Label */}
      {local.label && (
        <TimeFieldLabel class={`font-medium text-primary-200 ${sizeConfig().label}`}>
          {local.label}
          {rest.isRequired && <span class="text-red-500 ml-0.5">*</span>}
        </TimeFieldLabel>
      )}

      {/* Input container */}
      <TimeInput
        class={({ isFocused, isDisabled }) => {
          const base = `
            inline-flex items-center
            ${sizeConfig().input}
            bg-bg-400 rounded-md border
            transition-colors duration-150
          `;

          let borderClass = "border-primary-600";
          if (isInvalid()) {
            borderClass = "border-red-500";
          } else if (isFocused) {
            borderClass = "border-accent";
          }

          const disabledClass = isDisabled ? "opacity-50 cursor-not-allowed" : "";

          const focusClass = isFocused ? "ring-2 ring-accent/30" : "";

          return `${base} ${borderClass} ${disabledClass} ${focusClass}`.trim();
        }}
      >
        {(segment) => (
          <TimeSegment
            segment={segment}
            class={({ isFocused, isPlaceholder, isEditable }) => {
              const base = `
                ${sizeConfig().segment}
                rounded
                outline-none
                tabular-nums
              `;

              let stateClass = "";
              if (segment.type === "literal") {
                stateClass = "text-primary-400";
              } else if (isPlaceholder) {
                stateClass = "text-primary-500 italic";
              } else {
                stateClass = "text-primary-100";
              }

              const focusClass = isFocused && isEditable ? "bg-accent text-bg-400" : "";

              return `${base} ${stateClass} ${focusClass}`.trim();
            }}
          />
        )}
      </TimeInput>

      {/* Description */}
      {local.description && !isInvalid() && (
        <TimeFieldDescription class={`text-primary-400 ${sizeConfig().label}`}>
          {local.description}
        </TimeFieldDescription>
      )}

      {/* Error message */}
      {isInvalid() && local.errorMessage && (
        <TimeFieldErrorMessage class={`text-red-500 ${sizeConfig().label}`}>
          {local.errorMessage}
        </TimeFieldErrorMessage>
      )}
    </HeadlessTimeField>
  );
}

// Re-export types
export type { TimeValue };
