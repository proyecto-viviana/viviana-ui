/**
 * DatePicker component for proyecto-viviana-ui
 *
 * Styled date picker component that combines a date field with a calendar popup.
 */

import { type JSX, splitProps, Show } from 'solid-js';
import {
  DatePicker as HeadlessDatePicker,
  DatePickerButton,
  DateInput,
  DateSegment,
  useDatePickerContext,
  type DatePickerProps as HeadlessDatePickerProps,
  type CalendarDate,
  type DateValue,
} from '@proyecto-viviana/solidaria-components';
import { Calendar } from './index';

// Calendar icon component - use function to ensure consistent hydration
function CalendarIcon(): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="w-5 h-5"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

// ============================================
// TYPES
// ============================================

export type DatePickerSize = 'sm' | 'md' | 'lg';

export interface DatePickerProps<T extends DateValue = DateValue>
  extends Omit<HeadlessDatePickerProps<T>, 'class' | 'style' | 'children'> {
  /** The size of the picker. @default 'md' */
  size?: DatePickerSize;
  /** Additional CSS class name. */
  class?: string;
  /** Label for the field. */
  label?: string;
  /** Description text. */
  description?: string;
  /** Error message. */
  errorMessage?: string;
  /** Placeholder text. */
  placeholder?: string;
}

// ============================================
// STYLES
// ============================================

const sizeStyles = {
  sm: {
    container: 'text-sm',
    input: 'px-2 py-1 gap-0.5',
    segment: 'px-0.5',
    label: 'text-xs',
    button: 'w-7 h-7',
  },
  md: {
    container: 'text-base',
    input: 'px-3 py-2 gap-1',
    segment: 'px-1',
    label: 'text-sm',
    button: 'w-9 h-9',
  },
  lg: {
    container: 'text-lg',
    input: 'px-4 py-3 gap-1.5',
    segment: 'px-1.5',
    label: 'text-base',
    button: 'w-11 h-11',
  },
};

// ============================================
// DATE PICKER COMPONENT
// ============================================

/**
 * A date picker combines a date field and a calendar popup.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <DatePicker label="Event date" />
 *
 * // Controlled
 * const [date, setDate] = createSignal<CalendarDate | null>(null);
 * <DatePicker
 *   label="Appointment"
 *   value={date()}
 *   onChange={setDate}
 * />
 *
 * // With constraints
 * <DatePicker
 *   label="Future booking"
 *   minValue={today(getLocalTimeZone())}
 * />
 * ```
 */
export function DatePicker<T extends DateValue = CalendarDate>(
  props: DatePickerProps<T>
): JSX.Element {
  const [local, rest] = splitProps(props, [
    'size',
    'class',
    'label',
    'description',
    'errorMessage',
    'isInvalid',
    'placeholder',
  ]);

  const size = () => local.size ?? 'md';
  const sizeConfig = () => sizeStyles[size()];
  const isInvalid = () => local.isInvalid || !!local.errorMessage;

  return (
    <HeadlessDatePicker
      {...rest}
      isInvalid={isInvalid()}
      class={`
        flex flex-col gap-1 relative
        ${sizeConfig().container}
        ${local.class ?? ''}
      `}
    >
      {/* Label */}
      {local.label && (
        <label class={`font-medium text-primary-200 ${sizeConfig().label}`}>
          {local.label}
          {rest.isRequired && <span class="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {/* Input group */}
      <div class="relative flex items-center">
        {/* Date input */}
        <DateInput
          class={({ isFocused, isDisabled }) => {
            const base = `
              inline-flex items-center flex-1
              ${sizeConfig().input}
              bg-bg-400 rounded-l-md border-y border-l
              transition-colors duration-150
            `;

            let borderClass = 'border-primary-600';
            if (isInvalid()) {
              borderClass = 'border-red-500';
            } else if (isFocused) {
              borderClass = 'border-accent';
            }

            const disabledClass = isDisabled
              ? 'opacity-50 cursor-not-allowed'
              : '';

            const focusClass = isFocused
              ? 'ring-2 ring-accent/30'
              : '';

            return `${base} ${borderClass} ${disabledClass} ${focusClass}`.trim();
          }}
        >
          {(segment) => (
            <DateSegment
              segment={segment}
              class={({ isFocused, isPlaceholder, isEditable }) => {
                const base = `
                  ${sizeConfig().segment}
                  rounded
                  outline-none
                  tabular-nums
                `;

                let stateClass = '';
                if (segment.type === 'literal') {
                  stateClass = 'text-primary-400';
                } else if (isPlaceholder) {
                  stateClass = 'text-primary-500 italic';
                } else {
                  stateClass = 'text-primary-100';
                }

                const focusClass = isFocused && isEditable
                  ? 'bg-accent text-white'
                  : '';

                return `${base} ${stateClass} ${focusClass}`.trim();
              }}
            />
          )}
        </DateInput>

        {/* Calendar button */}
        <DatePickerButton
          class={({ isDisabled, isOpen }) => {
            const base = `
              ${sizeConfig().button}
              flex items-center justify-center
              bg-bg-400 border-y border-r rounded-r-md
              text-primary-200
              transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-accent/50
            `;

            let borderClass = 'border-primary-600';
            if (isInvalid()) {
              borderClass = 'border-red-500';
            } else if (isOpen) {
              borderClass = 'border-accent bg-bg-300';
            }

            const disabledClass = isDisabled
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-bg-300 cursor-pointer';

            return `${base} ${borderClass} ${disabledClass}`.trim();
          }}
        >
          <CalendarIcon />
        </DatePickerButton>

        {/* Calendar popup */}
        <DatePickerPopup size={size()} />
      </div>

      {/* Description */}
      {local.description && !isInvalid() && (
        <p class={`text-primary-400 ${sizeConfig().label}`}>
          {local.description}
        </p>
      )}

      {/* Error message */}
      {isInvalid() && local.errorMessage && (
        <p class={`text-red-500 ${sizeConfig().label}`}>
          {local.errorMessage}
        </p>
      )}
    </HeadlessDatePicker>
  );
}

// ============================================
// POPUP COMPONENT (uses context)
// ============================================

function DatePickerPopup(props: { size: DatePickerSize }): JSX.Element {
  const context = useDatePickerContext();

  return (
    <Show when={context.overlayState.isOpen}>
      <div
        class={`
          absolute top-full left-0 z-50 mt-1
          shadow-lg rounded-lg
        `}
      >
        <Calendar
          value={context.calendarState.value()}
          onChange={(date) => {
            context.fieldState.setValue(date as any);
            context.overlayState.close();
          }}
          minValue={context.calendarState.visibleRange().start}
          size={props.size}
        />
      </div>
      {/* Backdrop */}
      <div
        class="fixed inset-0 z-40"
        onClick={() => context.overlayState.close()}
      />
    </Show>
  );
}

// Re-export types
export type { CalendarDate, DateValue };
