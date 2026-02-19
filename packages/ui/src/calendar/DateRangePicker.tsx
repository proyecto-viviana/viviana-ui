/**
 * DateRangePicker component for proyecto-viviana-ui
 *
 * Styled date range picker with calendar popup.
 * Uses the range calendar for date selection and displays formatted dates.
 */

import { type JSX, splitProps, Show, createMemo } from 'solid-js'
import {
  DateRangePicker as HeadlessDateRangePicker,
  DateRangePickerButton,
  DateRangePickerContent,
  useDateRangePickerContext,
  type DateRangePickerProps as HeadlessDateRangePickerProps,
  type CalendarDate,
  type DateValue,
} from '@proyecto-viviana/solidaria-components'
import { RangeCalendar } from './RangeCalendar'

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
  )
}

// ============================================
// TYPES
// ============================================

export type DateRangePickerSize = 'sm' | 'md' | 'lg'

export interface DateRangePickerProps<T extends DateValue = DateValue>
  extends Omit<HeadlessDateRangePickerProps<T>, 'class' | 'style' | 'children'> {
  /** The size of the picker. @default 'md' */
  size?: DateRangePickerSize
  /** Additional CSS class name. */
  class?: string
  /** Label for the field. */
  label?: string
  /** Description text. */
  description?: string
  /** Error message. */
  errorMessage?: string
}

// ============================================
// STYLES
// ============================================

const sizeStyles = {
  sm: {
    container: 'text-sm',
    field: 'px-2 py-1',
    label: 'text-xs',
    button: 'w-7 h-7',
  },
  md: {
    container: 'text-base',
    field: 'px-3 py-2',
    label: 'text-sm',
    button: 'w-9 h-9',
  },
  lg: {
    container: 'text-lg',
    field: 'px-4 py-3',
    label: 'text-base',
    button: 'w-11 h-11',
  },
}

/**
 * Inner component that uses the DateRangePicker context to display formatted dates.
 */
function DateRangeDisplay(props: {
  size: DateRangePickerSize
  isInvalid: boolean
  label?: string
  description?: string
  errorMessage?: string
  isRequired?: boolean
}): JSX.Element {
  const context = useDateRangePickerContext()
  const sizeConfig = () => sizeStyles[props.size]

  const startDisplay = createMemo(() => {
    const state = context.calendarState
    const start = state.value?.()?.start ?? state.anchorDate?.()
    if (!start) return 'Start date'
    return `${start.month}/${start.day}/${start.year}`
  })

  const endDisplay = createMemo(() => {
    const state = context.calendarState
    const end = state.value?.()?.end
    if (!end) return 'End date'
    return `${end.month}/${end.day}/${end.year}`
  })

  const hasValue = createMemo(() => {
    const state = context.calendarState
    return !!state.value?.()?.start
  })

  return (
    <>
      <Show when={props.label}>
        <span
          {...context.pickerAria.labelProps}
          class={`font-medium text-primary-200 ${sizeConfig().label}`}
        >
          {props.label}
          <Show when={props.isRequired}>
            <span class="text-red-500 ml-0.5">*</span>
          </Show>
        </span>
      </Show>

      <div class="relative flex items-center" role="group">
        <div
          {...context.pickerAria.startFieldProps}
          class={`
            inline-flex items-center flex-1
            ${sizeConfig().field}
            bg-bg-400 rounded-l-md border-y border-l
            transition-colors duration-150
            ${props.isInvalid ? 'border-red-500' : 'border-primary-600'}
            ${hasValue() ? 'text-primary-100' : 'text-primary-500 italic'}
          `}
        >
          {startDisplay()}
        </div>

        <span class="px-1 text-primary-400 bg-bg-400 border-y border-primary-600" aria-hidden="true">–</span>

        <div
          {...context.pickerAria.endFieldProps}
          class={`
            inline-flex items-center flex-1
            ${sizeConfig().field}
            bg-bg-400 border-y
            transition-colors duration-150
            ${props.isInvalid ? 'border-red-500' : 'border-primary-600'}
            ${hasValue() ? 'text-primary-100' : 'text-primary-500 italic'}
          `}
        >
          {endDisplay()}
        </div>

        <DateRangePickerButton
          class={({ isDisabled, isOpen }) => {
            const base = `
              ${sizeConfig().button}
              flex items-center justify-center
              bg-bg-400 border-y border-r rounded-r-md
              text-primary-200
              transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-accent/50
            `
            let borderClass = 'border-primary-600'
            if (props.isInvalid) {
              borderClass = 'border-red-500'
            } else if (isOpen) {
              borderClass = 'border-accent bg-bg-300'
            }
            const disabledClass = isDisabled
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-bg-300 cursor-pointer'
            return `${base} ${borderClass} ${disabledClass}`.trim()
          }}
        >
          <CalendarIcon />
        </DateRangePickerButton>

        <DateRangePickerContent class="z-50 shadow-lg rounded-lg">
          <RangeCalendar size={props.size} />
        </DateRangePickerContent>
      </div>

      <Show when={props.description && !props.isInvalid}>
        <p
          {...context.pickerAria.descriptionProps}
          class={`text-primary-400 ${sizeConfig().label}`}
        >
          {props.description}
        </p>
      </Show>

      <Show when={props.isInvalid && props.errorMessage}>
        <p
          {...context.pickerAria.errorMessageProps}
          class={`text-red-500 ${sizeConfig().label}`}
        >
          {props.errorMessage}
        </p>
      </Show>
    </>
  )
}

// ============================================
// DATE RANGE PICKER COMPONENT
// ============================================

/**
 * A date range picker combines two date display fields with a range calendar popup.
 */
export function DateRangePicker<T extends DateValue = CalendarDate>(
  props: DateRangePickerProps<T>
): JSX.Element {
  const [local, rest] = splitProps(props, [
    'size',
    'class',
    'label',
    'description',
    'errorMessage',
    'isInvalid',
  ])

  const size = () => local.size ?? 'md'
  const sizeConfig = () => sizeStyles[size()]
  const isInvalid = () => local.isInvalid || !!local.errorMessage

  return (
    <HeadlessDateRangePicker
      {...rest}
      label={local.label}
      description={local.description}
      errorMessage={local.errorMessage}
      isInvalid={isInvalid()}
      class={`flex flex-col gap-1 relative ${sizeConfig().container} ${local.class ?? ''}`}
    >
      <DateRangeDisplay
        size={size()}
        isInvalid={isInvalid()}
        label={local.label}
        description={local.description}
        errorMessage={local.errorMessage}
      />
    </HeadlessDateRangePicker>
  )
}
