/**
 * Calendar component for solidaria-components
 *
 * Pre-wired headless calendar component that combines aria hooks.
 * Port of react-aria-components/src/Calendar.tsx
 */

import {
  type JSX,
  createContext,
  createMemo,
  createSignal,
  splitProps,
  useContext,
  For,
  Index,
  Show,
} from 'solid-js';

import {
  createCalendar,
  createCalendarGrid,
  createCalendarCell,
  type AriaCalendarProps,
  type AriaCalendarGridProps,
} from '@proyecto-viviana/solidaria';
import {
  createCalendarState,
  type CalendarState,
  type CalendarStateProps,
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

// ============================================
// TYPES
// ============================================

export interface CalendarRenderProps {
  /** Whether the calendar is disabled. */
  isDisabled: boolean;
  /** Whether the calendar is read-only. */
  isReadOnly: boolean;
}

export interface CalendarProps<T extends DateValue = DateValue>
  extends Omit<AriaCalendarProps, 'id' | 'isDisabled' | 'isReadOnly'>,
    Omit<CalendarStateProps<T>, 'locale'>,
    SlotProps {
  /** The children of the component. */
  children?: JSX.Element;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<CalendarRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<CalendarRenderProps>;
  /** The locale to use for formatting. */
  locale?: string;
}

export interface CalendarGridRenderProps {
  /** Whether the grid is disabled. */
  isDisabled: boolean;
}

export interface CalendarGridProps extends Omit<AriaCalendarGridProps, 'startDate' | 'endDate'>, SlotProps {
  /** The children of the component (render function receiving weeks). */
  children?: (date: CalendarDate) => JSX.Element;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<CalendarGridRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<CalendarGridRenderProps>;
  /** Number of weeks to offset from the start. */
  offset?: { months?: number };
}

export interface CalendarCellRenderProps {
  /** Whether the cell is selected. */
  isSelected: boolean;
  /** Whether the cell is focused. */
  isFocused: boolean;
  /** Whether the cell is disabled. */
  isDisabled: boolean;
  /** Whether the cell is unavailable. */
  isUnavailable: boolean;
  /** Whether the cell is outside the visible month. */
  isOutsideMonth: boolean;
  /** Whether the cell represents today. */
  isToday: boolean;
  /** Whether the cell is pressed. */
  isPressed: boolean;
  /** The formatted date string. */
  formattedDate: string;
}

export interface CalendarCellProps extends SlotProps {
  /** The date for this cell. */
  date: CalendarDate;
  /** The children of the component. A function may be provided to receive render props. */
  children?: RenderChildren<CalendarCellRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<CalendarCellRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<CalendarCellRenderProps>;
}

export interface CalendarHeaderCellProps extends SlotProps {
  /** The children of the component. */
  children?: JSX.Element;
  /** The CSS className for the element. */
  class?: string;
  /** The inline style for the element. */
  style?: JSX.CSSProperties;
}

// ============================================
// CONTEXT
// ============================================

export const CalendarContext = createContext<CalendarState<DateValue> | null>(null);

export function useCalendarContext(): CalendarState<DateValue> {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('Calendar components must be used within a Calendar');
  }
  return context;
}

// ============================================
// CALENDAR COMPONENT
// ============================================

/**
 * A calendar displays a grid of days in a month and allows users to select a single date.
 *
 * @example
 * ```tsx
 * <Calendar aria-label="Event date">
 *   <header>
 *     <CalendarButton slot="previous">◀</CalendarButton>
 *     <CalendarHeading />
 *     <CalendarButton slot="next">▶</CalendarButton>
 *   </header>
 *   <CalendarGrid>
 *     {(date) => <CalendarCell date={date} />}
 *   </CalendarGrid>
 * </Calendar>
 * ```
 */
export function Calendar<T extends DateValue = CalendarDate>(
  props: CalendarProps<T>
): JSX.Element {
  // Use hydration-safe pattern for client-only rendering
  const isHydrated = useIsHydrated();

  return (
    <Show
      when={isHydrated()}
      fallback={<div class="solidaria-Calendar solidaria-Calendar--placeholder" aria-hidden="true" />}
    >
      <CalendarInner {...props} />
    </Show>
  );
}

/**
 * Internal Calendar component that renders after client mount.
 */
function CalendarInner<T extends DateValue = CalendarDate>(
  props: CalendarProps<T>
): JSX.Element {
  const [local, stateProps, rest] = splitProps(
    props,
    ['children', 'class', 'style', 'slot'],
    [
      'value',
      'defaultValue',
      'onChange',
      'minValue',
      'maxValue',
      'isDisabled',
      'isReadOnly',
      'autoFocus',
      'focusedValue',
      'defaultFocusedValue',
      'onFocusChange',
      'locale',
      'isDateUnavailable',
      'visibleMonths',
      'isDateDisabled',
      'validationState',
      'errorMessage',
      'firstDayOfWeek',
    ]
  );

  // Create calendar state
  const state = createCalendarState(stateProps);

  // Create calendar ARIA props
  const calendarAria = createCalendar(rest, state as unknown as CalendarState<DateValue>);

  // Render props values
  const renderValues = createMemo<CalendarRenderProps>(() => ({
    isDisabled: state.isDisabled(),
    isReadOnly: state.isReadOnly(),
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Calendar',
    },
    renderValues
  );

  return (
    <CalendarContext.Provider value={state as unknown as CalendarState<DateValue>}>
      <div
        {...calendarAria.calendarProps}
        class={renderProps.class()}
        style={renderProps.style()}
        data-disabled={dataAttr(state.isDisabled())}
        data-readonly={dataAttr(state.isReadOnly())}
      >
        {props.children}
      </div>
    </CalendarContext.Provider>
  );
}

// ============================================
// CALENDAR HEADING COMPONENT
// ============================================

export interface CalendarHeadingProps extends SlotProps {
  /** The CSS className for the element. */
  class?: string;
  /** The inline style for the element. */
  style?: JSX.CSSProperties;
}

/**
 * Displays the current month and year in the calendar.
 */
export function CalendarHeading(props: CalendarHeadingProps): JSX.Element {
  const state = useCalendarContext();

  return (
    <h2
      class={props.class ?? 'solidaria-CalendarHeading'}
      style={props.style}
      aria-live="polite"
    >
      {state.title()}
    </h2>
  );
}

// ============================================
// CALENDAR BUTTON COMPONENT
// ============================================

export interface CalendarButtonProps extends SlotProps {
  /** The slot for this button (previous or next). */
  slot?: 'previous' | 'next';
  /** The children of the component. */
  children?: JSX.Element;
  /** The CSS className for the element. */
  class?: string;
  /** The inline style for the element. */
  style?: JSX.CSSProperties;
  /** Whether the button is disabled. */
  isDisabled?: boolean;
}

/**
 * A button for navigating the calendar.
 */
export function CalendarButton(props: CalendarButtonProps): JSX.Element {
  const state = useCalendarContext();
  const calendarAria = createCalendar({}, state);

  const buttonProps = createMemo(() => {
    if (props.slot === 'previous') {
      return calendarAria.prevButtonProps;
    }
    return calendarAria.nextButtonProps;
  });

  return (
    <button
      {...buttonProps()}
      class={props.class ?? 'solidaria-CalendarButton'}
      style={props.style}
      disabled={props.isDisabled || state.isDisabled()}
    >
      {props.children}
    </button>
  );
}

// ============================================
// CALENDAR GRID COMPONENT
// ============================================

/**
 * Displays a grid of calendar cells.
 */
export function CalendarGrid(props: CalendarGridProps): JSX.Element {
  const state = useCalendarContext();
  const [gridRef, setGridRef] = createSignal<HTMLTableElement | null>(null);

  // Create grid ARIA props
  const gridAria = createCalendarGrid(
    {
      weekdayStyle: props.weekdayStyle,
    },
    state,
    gridRef
  );

  // Render props values
  const renderValues = createMemo<CalendarGridRenderProps>(() => ({
    isDisabled: state.isDisabled(),
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      class: props.class,
      style: props.style,
      defaultClassName: 'solidaria-CalendarGrid',
    },
    renderValues
  );

  // Memoize ALL dates for the grid at once to avoid reactive loops.
  // This breaks the cycle where accessing visibleRange() inside For loop
  // would cause infinite re-renders.
  const allDates = createMemo(() => {
    const numWeeks = state.getWeeksInMonth();
    const weekDates: (CalendarDate | null)[][] = [];

    for (let weekIndex = 0; weekIndex < numWeeks; weekIndex++) {
      weekDates.push(state.getDatesInWeek(weekIndex));
    }

    return weekDates;
  });

  return (
    <table
      ref={setGridRef}
      {...gridAria.gridProps}
      class={renderProps.class()}
      style={renderProps.style()}
    >
      <thead {...gridAria.headerProps}>
        <tr>
          <For each={gridAria.weekDays}>
            {(day) => (
              <th scope="col" class="solidaria-CalendarHeaderCell">
                {day}
              </th>
            )}
          </For>
        </tr>
      </thead>
      <tbody>
        <Index each={allDates()}>
          {(weekDates) => (
            <tr>
              <Index each={weekDates()}>
                {(date) => (
                  <Show when={date()}>
                    <td role="gridcell">
                      {props.children?.(date()!)}
                    </td>
                  </Show>
                )}
              </Index>
            </tr>
          )}
        </Index>
      </tbody>
    </table>
  );
}

// ============================================
// CALENDAR CELL COMPONENT
// ============================================

/**
 * A cell in the calendar grid representing a single day.
 */
export function CalendarCell(props: CalendarCellProps): JSX.Element {
  const state = useCalendarContext();
  const [cellRef, setCellRef] = createSignal<HTMLDivElement | null>(null);

  // Create cell ARIA props
  const cellAria = createCalendarCell(
    { date: props.date },
    state,
    cellRef
  );

  // Render props values
  const renderValues = createMemo<CalendarCellRenderProps>(() => ({
    isSelected: cellAria.isSelected,
    isFocused: cellAria.isFocused,
    isDisabled: cellAria.isDisabled,
    isUnavailable: cellAria.isUnavailable,
    isOutsideMonth: cellAria.isOutsideMonth,
    isToday: cellAria.isToday,
    isPressed: cellAria.isPressed,
    formattedDate: cellAria.formattedDate,
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: props.children,
      class: props.class,
      style: props.style,
      defaultClassName: 'solidaria-CalendarCell',
    },
    renderValues
  );

  // Determine children content - avoid Show for SSR hydration compatibility
  const getChildren = () => {
    if (typeof props.children === 'function') {
      return renderProps.renderChildren();
    }
    return cellAria.formattedDate;
  };

  return (
    <div
      ref={setCellRef}
      {...cellAria.buttonProps}
      class={renderProps.class()}
      style={renderProps.style()}
      data-selected={dataAttr(cellAria.isSelected)}
      data-focused={dataAttr(cellAria.isFocused)}
      data-disabled={dataAttr(cellAria.isDisabled)}
      data-unavailable={dataAttr(cellAria.isUnavailable)}
      data-outside-month={dataAttr(cellAria.isOutsideMonth)}
      data-today={dataAttr(cellAria.isToday)}
      data-pressed={dataAttr(cellAria.isPressed)}
    >
      {getChildren()}
    </div>
  );
}

// Re-export types
export type { CalendarState, CalendarDate, DateValue };
