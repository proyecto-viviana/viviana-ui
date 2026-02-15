/**
 * RangeCalendar component for solidaria-components
 *
 * Pre-wired headless range calendar component that combines aria hooks.
 * Port of react-aria-components/src/RangeCalendar.tsx
 */

import {
  type JSX,
  createContext,
  createMemo,
  createSignal,
  splitProps,
  useContext,
  For,
  Show,
} from 'solid-js';
import {
  createRangeCalendar,
  createCalendarGrid,
  createRangeCalendarCell,
  type AriaRangeCalendarProps,
  type AriaCalendarGridProps,
} from '@proyecto-viviana/solidaria';
import {
  createRangeCalendarState,
  type RangeCalendarState,
  type RangeCalendarStateProps,
  type CalendarDate,
  type DateValue,
  type RangeValue,
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

export interface RangeCalendarRenderProps {
  /** Whether the calendar is disabled. */
  isDisabled: boolean;
  /** Whether the calendar is read-only. */
  isReadOnly: boolean;
  /** Whether the user is currently selecting a range. */
  isDragging: boolean;
}

export interface RangeCalendarProps<T extends DateValue = DateValue>
  extends Omit<AriaRangeCalendarProps, 'id' | 'isDisabled' | 'isReadOnly'>,
    Omit<RangeCalendarStateProps<T>, 'locale'>,
    SlotProps {
  /** The children of the component. */
  children?: JSX.Element;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<RangeCalendarRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<RangeCalendarRenderProps>;
  /** The locale to use for formatting. */
  locale?: string;
}

export interface RangeCalendarGridRenderProps {
  /** Whether the grid is disabled. */
  isDisabled: boolean;
}

export interface RangeCalendarGridProps extends Omit<AriaCalendarGridProps, 'startDate' | 'endDate'>, SlotProps {
  /** The children of the component (render function receiving dates). */
  children?: (date: CalendarDate) => JSX.Element;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<RangeCalendarGridRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<RangeCalendarGridRenderProps>;
}

export interface RangeCalendarCellRenderProps {
  /** Whether the cell is within the selected range. */
  isSelected: boolean;
  /** Whether the cell is the start of the selection. */
  isSelectionStart: boolean;
  /** Whether the cell is the end of the selection. */
  isSelectionEnd: boolean;
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

export interface RangeCalendarCellProps extends SlotProps {
  /** The date for this cell. */
  date: CalendarDate;
  /** The children of the component. A function may be provided to receive render props. */
  children?: RenderChildren<RangeCalendarCellRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<RangeCalendarCellRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<RangeCalendarCellRenderProps>;
}

// ============================================
// CONTEXT
// ============================================

export const RangeCalendarContext = createContext<RangeCalendarState<DateValue> | null>(null);
export const RangeCalendarStateContext = createContext<RangeCalendarState<DateValue> | null>(null);

export function useRangeCalendarContext(): RangeCalendarState<DateValue> {
  const context = useContext(RangeCalendarContext);
  if (!context) {
    throw new Error('RangeCalendar components must be used within a RangeCalendar');
  }
  return context;
}

// ============================================
// RANGE CALENDAR COMPONENT
// ============================================

/**
 * A range calendar displays a grid of days and allows users to select a contiguous range of dates.
 *
 * @example
 * ```tsx
 * <RangeCalendar aria-label="Date range">
 *   <header>
 *     <RangeCalendarButton slot="previous">◀</RangeCalendarButton>
 *     <RangeCalendarHeading />
 *     <RangeCalendarButton slot="next">▶</RangeCalendarButton>
 *   </header>
 *   <RangeCalendarGrid>
 *     {(date) => <RangeCalendarCell date={date} />}
 *   </RangeCalendarGrid>
 * </RangeCalendar>
 * ```
 */
export function RangeCalendar<T extends DateValue = CalendarDate>(
  props: RangeCalendarProps<T>
): JSX.Element {
  // Use hydration-safe pattern for client-only rendering
  const isHydrated = useIsHydrated();

  return (
    <Show
      when={isHydrated()}
      fallback={<div class="solidaria-RangeCalendar solidaria-RangeCalendar--placeholder" aria-hidden="true" />}
    >
      <RangeCalendarInner {...props} />
    </Show>
  );
}

/**
 * Internal RangeCalendar component that renders after client mount.
 */
function RangeCalendarInner<T extends DateValue = CalendarDate>(
  props: RangeCalendarProps<T>
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
      'focusedValue',
      'defaultFocusedValue',
      'onFocusChange',
      'locale',
      'isDateUnavailable',
      'visibleMonths',
      'isDateDisabled',
      'validationState',
      'allowsNonContiguousRanges',
      'firstDayOfWeek',
    ]
  );

  // Create range calendar state
  const state = createRangeCalendarState(stateProps);

  // Create range calendar ARIA props
  const calendarAria = createRangeCalendar(rest, state as unknown as RangeCalendarState<DateValue>);

  // Render props values
  const renderValues = createMemo<RangeCalendarRenderProps>(() => ({
    isDisabled: state.isDisabled(),
    isReadOnly: state.isReadOnly(),
    isDragging: state.isDragging(),
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-RangeCalendar',
    },
    renderValues
  );

  return (
    <RangeCalendarStateContext.Provider value={state as unknown as RangeCalendarState<DateValue>}>
      <RangeCalendarContext.Provider value={state as unknown as RangeCalendarState<DateValue>}>
        <div
          {...calendarAria.calendarProps}
          class={renderProps.class()}
          style={renderProps.style()}
          data-disabled={dataAttr(state.isDisabled())}
          data-readonly={dataAttr(state.isReadOnly())}
          data-dragging={dataAttr(state.isDragging())}
        >
          {props.children}
        </div>
      </RangeCalendarContext.Provider>
    </RangeCalendarStateContext.Provider>
  );
}

// ============================================
// RANGE CALENDAR HEADING COMPONENT
// ============================================

export interface RangeCalendarHeadingProps extends SlotProps {
  /** The CSS className for the element. */
  class?: string;
  /** The inline style for the element. */
  style?: JSX.CSSProperties;
}

/**
 * Displays the current month and year in the range calendar.
 */
export function RangeCalendarHeading(props: RangeCalendarHeadingProps): JSX.Element {
  const state = useRangeCalendarContext();

  return (
    <h2
      class={props.class ?? 'solidaria-RangeCalendarHeading'}
      style={props.style}
      aria-live="polite"
    >
      {state.title()}
    </h2>
  );
}

// ============================================
// RANGE CALENDAR BUTTON COMPONENT
// ============================================

export interface RangeCalendarButtonProps extends SlotProps {
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
 * A button for navigating the range calendar.
 */
export function RangeCalendarButton(props: RangeCalendarButtonProps): JSX.Element {
  const state = useRangeCalendarContext();
  const calendarAria = createRangeCalendar({}, state);

  const buttonProps = createMemo(() => {
    if (props.slot === 'previous') {
      return calendarAria.prevButtonProps;
    }
    return calendarAria.nextButtonProps;
  });

  return (
    <button
      {...buttonProps()}
      class={props.class ?? 'solidaria-RangeCalendarButton'}
      style={props.style}
      disabled={props.isDisabled || state.isDisabled()}
    >
      {props.children}
    </button>
  );
}

// ============================================
// RANGE CALENDAR GRID COMPONENT
// ============================================

/**
 * Displays a grid of range calendar cells.
 */
export function RangeCalendarGrid(props: RangeCalendarGridProps): JSX.Element {
  const state = useRangeCalendarContext();
  const [gridRef, setGridRef] = createSignal<HTMLTableElement | null>(null);

  // Create grid ARIA props
  const gridAria = createCalendarGrid(
    {
      weekdayStyle: props.weekdayStyle,
    },
    state as unknown as Parameters<typeof createCalendarGrid>[1],
    gridRef
  );

  // Render props values
  const renderValues = createMemo<RangeCalendarGridRenderProps>(() => ({
    isDisabled: state.isDisabled(),
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      class: props.class,
      style: props.style,
      defaultClassName: 'solidaria-RangeCalendarGrid',
    },
    renderValues
  );

  // Get weeks to render
  const weeks = createMemo(() => {
    const numWeeks = state.getWeeksInMonth();
    return Array.from({ length: numWeeks }, (_, i) => i);
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
              <th scope="col" class="solidaria-RangeCalendarHeaderCell">
                {day}
              </th>
            )}
          </For>
        </tr>
      </thead>
      <tbody>
        <For each={weeks()}>
          {(weekIndex) => (
            <tr>
              <For each={state.getDatesInWeek(weekIndex)}>
                {(date) => (
                  <Show when={date}>
                    <td>
                      {props.children?.(date!)}
                    </td>
                  </Show>
                )}
              </For>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  );
}

// ============================================
// RANGE CALENDAR CELL COMPONENT
// ============================================

/**
 * A cell in the range calendar grid representing a single day.
 */
export function RangeCalendarCell(props: RangeCalendarCellProps): JSX.Element {
  const state = useRangeCalendarContext();
  const [cellRef, setCellRef] = createSignal<HTMLDivElement | null>(null);

  // Create cell ARIA props
  const cellAria = createRangeCalendarCell(
    { date: props.date },
    state,
    cellRef
  );

  // Render props values
  const renderValues = createMemo<RangeCalendarCellRenderProps>(() => ({
    isSelected: cellAria.isSelected,
    isSelectionStart: cellAria.isSelectionStart,
    isSelectionEnd: cellAria.isSelectionEnd,
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
      defaultClassName: 'solidaria-RangeCalendarCell',
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
      data-selection-start={dataAttr(cellAria.isSelectionStart)}
      data-selection-end={dataAttr(cellAria.isSelectionEnd)}
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
export type { RangeCalendarState, RangeValue };
