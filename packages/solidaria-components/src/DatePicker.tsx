/**
 * DatePicker component for solidaria-components
 *
 * Pre-wired headless date picker component that combines a date field with a calendar popup.
 * Port of react-aria-components/src/DatePicker.tsx
 */

import {
  type JSX,
  createContext,
  createMemo,
  createSignal,
  splitProps,
  useContext,
  Show,
} from 'solid-js';
import {
  createDatePicker,
  type AriaDatePickerProps,
  type DatePickerState as AriaDatePickerState,
} from '@proyecto-viviana/solidaria';
import {
  createDateFieldState,
  createCalendarState,
  type DateFieldState,
  type CalendarState,
  type DateFieldStateProps,
  type CalendarDate,
  type DateValue,
} from '@proyecto-viviana/solid-stately';
import {
  type RenderChildren,
  type ClassNameOrFunction,
  type StyleOrFunction,
  type SlotProps,
  useRenderProps,
  dataAttr,
  useIsHydrated,
} from './utils';
import { DateFieldContext } from './DateField';
import { CalendarContext } from './Calendar';

// ============================================
// TYPES
// ============================================

export interface DatePickerRenderProps {
  /** Whether the picker is disabled. */
  isDisabled: boolean;
  /** Whether the picker is read-only. */
  isReadOnly: boolean;
  /** Whether the picker is required. */
  isRequired: boolean;
  /** Whether the picker is invalid. */
  isInvalid: boolean;
  /** Whether the calendar is open. */
  isOpen: boolean;
}

export interface DatePickerContextValue {
  fieldState: DateFieldState<DateValue>;
  calendarState: CalendarState<DateValue>;
  overlayState: {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
  };
  pickerAria: ReturnType<typeof createDatePicker>;
}

export interface DatePickerProps<T extends DateValue = DateValue>
  extends Omit<AriaDatePickerProps, 'id' | 'isDisabled' | 'isReadOnly' | 'isRequired'>,
    Omit<DateFieldStateProps<T>, 'locale'>,
    SlotProps {
  /** The children of the component. */
  children?: JSX.Element;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<DatePickerRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<DatePickerRenderProps>;
  /** The locale to use for formatting. */
  locale?: string;
  /** Whether the calendar should close when a date is selected. */
  shouldCloseOnSelect?: boolean;
}

export interface DatePickerButtonRenderProps {
  /** Whether the button is disabled. */
  isDisabled: boolean;
  /** Whether the calendar is open. */
  isOpen: boolean;
}

export interface DatePickerButtonProps extends SlotProps {
  /** The children of the component. */
  children?: RenderChildren<DatePickerButtonRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<DatePickerButtonRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<DatePickerButtonRenderProps>;
  /** Whether the button is disabled. */
  isDisabled?: boolean;
}

// ============================================
// CONTEXT
// ============================================

export const DatePickerContext = createContext<DatePickerContextValue | null>(null);

export function useDatePickerContext(): DatePickerContextValue {
  const context = useContext(DatePickerContext);
  if (!context) {
    throw new Error('DatePicker components must be used within a DatePicker');
  }
  return context;
}

// ============================================
// DATE PICKER COMPONENT
// ============================================

/**
 * A date picker combines a DateField and a Calendar popover.
 *
 * @example
 * ```tsx
 * <DatePicker label="Event date">
 *   <Label>Event date</Label>
 *   <Group>
 *     <DateInput>
 *       {(segment) => <DateSegment segment={segment} />}
 *     </DateInput>
 *     <DatePickerButton>📅</DatePickerButton>
 *   </Group>
 *   <Popover>
 *     <Dialog>
 *       <Calendar>
 *         <CalendarGrid>
 *           {(date) => <CalendarCell date={date} />}
 *         </CalendarGrid>
 *       </Calendar>
 *     </Dialog>
 *   </Popover>
 * </DatePicker>
 * ```
 */
export function DatePicker<T extends DateValue = CalendarDate>(
  props: DatePickerProps<T>
): JSX.Element {
  // Use hydration-safe pattern for client-only rendering
  const isHydrated = useIsHydrated();

  return (
    <Show
      when={isHydrated()}
      fallback={<div class="solidaria-DatePicker solidaria-DatePicker--placeholder" aria-hidden="true" />}
    >
      <DatePickerInner {...props} />
    </Show>
  );
}

/**
 * Internal DatePicker component that renders after client mount.
 */
function DatePickerInner<T extends DateValue = CalendarDate>(
  props: DatePickerProps<T>
): JSX.Element {
  const [local, stateProps, rest] = splitProps(
    props,
    ['children', 'class', 'style', 'slot', 'shouldCloseOnSelect'],
    [
      'value',
      'defaultValue',
      'onChange',
      'minValue',
      'maxValue',
      'isDisabled',
      'isReadOnly',
      'isRequired',
      'locale',
      'granularity',
      'hourCycle',
      'hideTimeZone',
      'placeholderValue',
      'validationState',
      'description',
      'errorMessage',
    ]
  );

  // Create overlay trigger state
  const [isOpen, setIsOpen] = createSignal(false);

  const overlayState = {
    get isOpen() { return isOpen(); },
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };

  // Create date field state
  const fieldState = createDateFieldState({
    ...stateProps,
    onChange: (value) => {
      stateProps.onChange?.(value);
      if (local.shouldCloseOnSelect !== false && value) {
        overlayState.close();
      }
    },
  });

  // Create calendar state that syncs with field
  const calendarState = createCalendarState({
    value: () => fieldState.value(),
    onChange: (value) => {
      fieldState.setValue(value as T | null);
      if (local.shouldCloseOnSelect !== false) {
        overlayState.close();
      }
    },
    minValue: stateProps.minValue,
    maxValue: stateProps.maxValue,
    isDisabled: stateProps.isDisabled,
    isReadOnly: stateProps.isReadOnly,
    locale: stateProps.locale,
  });

  // Create date picker ARIA props
  const pickerAria = createDatePicker(
    () => ({
      ...(rest as Record<string, unknown>),
      description: stateProps.description,
      errorMessage: stateProps.errorMessage,
    }),
    fieldState as unknown as DateFieldState<DateValue>,
    overlayState as AriaDatePickerState,
    calendarState as unknown as CalendarState<DateValue>
  );

  // Context value
  const contextValue: DatePickerContextValue = {
    fieldState: fieldState as unknown as DateFieldState<DateValue>,
    calendarState: calendarState as unknown as CalendarState<DateValue>,
    overlayState,
    pickerAria,
  };

  // Render props values
  const renderValues = createMemo<DatePickerRenderProps>(() => ({
    isDisabled: fieldState.isDisabled(),
    isReadOnly: fieldState.isReadOnly(),
    isRequired: fieldState.isRequired(),
    isInvalid: fieldState.isInvalid(),
    isOpen: overlayState.isOpen,
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-DatePicker',
    },
    renderValues
  );

  return (
    <DatePickerContext.Provider value={contextValue}>
      {/* Also provide DateFieldContext so DateInput/DateSegment work inside DatePicker */}
      <DateFieldContext.Provider
        value={{
          state: fieldState as unknown as DateFieldState<DateValue>,
          aria: {
            labelProps: pickerAria.labelProps,
            inputProps: pickerAria.fieldProps,
            descriptionProps: pickerAria.descriptionProps,
            errorMessageProps: pickerAria.errorMessageProps,
          },
        }}
      >
        <CalendarContext.Provider value={calendarState as unknown as CalendarState<DateValue>}>
          <div
            {...pickerAria.groupProps}
            class={renderProps.class()}
            style={renderProps.style()}
            data-disabled={dataAttr(fieldState.isDisabled())}
            data-readonly={dataAttr(fieldState.isReadOnly())}
            data-required={dataAttr(fieldState.isRequired())}
            data-invalid={dataAttr(fieldState.isInvalid())}
            data-open={dataAttr(overlayState.isOpen)}
          >
            {props.children}
          </div>
        </CalendarContext.Provider>
      </DateFieldContext.Provider>
    </DatePickerContext.Provider>
  );
}

// ============================================
// DATE PICKER BUTTON COMPONENT
// ============================================

/**
 * A button that opens the date picker calendar.
 */
export function DatePickerButton(props: DatePickerButtonProps): JSX.Element {
  const context = useDatePickerContext();

  // Render props values
  const renderValues = createMemo<DatePickerButtonRenderProps>(() => ({
    isDisabled: context.fieldState.isDisabled() || (props.isDisabled ?? false),
    isOpen: context.overlayState.isOpen,
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: props.children,
      class: props.class,
      style: props.style,
      defaultClassName: 'solidaria-DatePickerButton',
    },
    renderValues
  );

  // Determine children content - avoid Show for SSR hydration compatibility
  const getChildren = () => {
    if (typeof props.children === 'function') {
      return renderProps.renderChildren();
    }
    return props.children ?? '📅';
  };

  return (
    <button
      {...context.pickerAria.buttonProps}
      class={renderProps.class()}
      style={renderProps.style()}
      disabled={context.fieldState.isDisabled() || props.isDisabled}
      data-disabled={dataAttr(context.fieldState.isDisabled() || props.isDisabled)}
      data-open={dataAttr(context.overlayState.isOpen)}
    >
      {getChildren()}
    </button>
  );
}

// ============================================
// DATE PICKER CONTENT COMPONENT
// ============================================

export interface DatePickerContentProps extends SlotProps {
  /** The children of the component. */
  children?: JSX.Element;
  /** The CSS className for the element. */
  class?: string;
  /** The inline style for the element. */
  style?: JSX.CSSProperties;
}

/**
 * The content area of the date picker (typically contains a Calendar).
 */
export function DatePickerContent(props: DatePickerContentProps): JSX.Element {
  const context = useDatePickerContext();

  return (
    <Show when={context.overlayState.isOpen}>
      <div
        {...context.pickerAria.dialogProps}
        class={props.class ?? 'solidaria-DatePickerContent'}
        style={props.style}
      >
        {props.children}
      </div>
    </Show>
  );
}

// DatePickerContextValue is already exported at declaration
