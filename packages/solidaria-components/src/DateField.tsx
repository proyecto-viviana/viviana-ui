/**
 * DateField component for solidaria-components
 *
 * Pre-wired headless date field component with segment-based editing.
 * Port of react-aria-components/src/DateField.tsx
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
  createDateField,
  createDateSegment,
  type AriaDateFieldProps,
} from '@proyecto-viviana/solidaria';
import {
  createDateFieldState,
  type DateFieldState,
  type DateFieldStateProps,
  type DateSegment as DateSegmentType,
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

export interface DateFieldRenderProps {
  /** Whether the field is disabled. */
  isDisabled: boolean;
  /** Whether the field is read-only. */
  isReadOnly: boolean;
  /** Whether the field is required. */
  isRequired: boolean;
  /** Whether the field is invalid. */
  isInvalid: boolean;
}

export interface DateFieldProps<T extends DateValue = DateValue>
  extends Omit<AriaDateFieldProps, 'id' | 'isDisabled' | 'isReadOnly' | 'isRequired'>,
    Omit<DateFieldStateProps<T>, 'locale'>,
    SlotProps {
  /** The children of the component. */
  children?: JSX.Element | ((segment: DateSegmentType) => JSX.Element);
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<DateFieldRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<DateFieldRenderProps>;
  /** The locale to use for formatting. */
  locale?: string;
}

export interface DateInputRenderProps {
  /** Whether the input is disabled. */
  isDisabled: boolean;
  /** Whether the input is focused. */
  isFocused: boolean;
}

export interface DateInputProps extends SlotProps {
  /** The children of the component (render function receiving segments). */
  children?: (segment: DateSegmentType) => JSX.Element;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<DateInputRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<DateInputRenderProps>;
}

export interface DateSegmentRenderProps {
  /** Whether the segment is focused. */
  isFocused: boolean;
  /** Whether the segment is editable. */
  isEditable: boolean;
  /** Whether the segment is a placeholder. */
  isPlaceholder: boolean;
  /** The segment type. */
  type: DateSegmentType['type'];
  /** The text to display. */
  text: string;
}

export interface DateSegmentProps extends SlotProps {
  /** The segment data. */
  segment: DateSegmentType;
  /** The children of the component. A function may be provided to receive render props. */
  children?: RenderChildren<DateSegmentRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<DateSegmentRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<DateSegmentRenderProps>;
}

// ============================================
// CONTEXT
// ============================================

export const DateFieldContext = createContext<DateFieldState<DateValue> | null>(null);

export function useDateFieldContext(): DateFieldState<DateValue> {
  const context = useContext(DateFieldContext);
  if (!context) {
    throw new Error('DateField components must be used within a DateField');
  }
  return context;
}

// ============================================
// DATE FIELD COMPONENT
// ============================================

/**
 * A date field allows users to enter and edit date values using a keyboard.
 *
 * @example
 * ```tsx
 * <DateField label="Date">
 *   <Label>Date</Label>
 *   <DateInput>
 *     {(segment) => <DateSegment segment={segment} />}
 *   </DateInput>
 * </DateField>
 * ```
 */
export function DateField<T extends DateValue = CalendarDate>(
  props: DateFieldProps<T>
): JSX.Element {
  // Use hydration-safe pattern for client-only rendering
  const isHydrated = useIsHydrated();

  return (
    <Show
      when={isHydrated()}
      fallback={<div class="solidaria-DateField solidaria-DateField--placeholder" aria-hidden="true" />}
    >
      <DateFieldInner {...props} />
    </Show>
  );
}

/**
 * Internal DateField component that renders after client mount.
 */
function DateFieldInner<T extends DateValue = CalendarDate>(
  props: DateFieldProps<T>
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

  const [fieldRef, setFieldRef] = createSignal<HTMLDivElement | null>(null);

  // Create date field state
  const state = createDateFieldState(stateProps);

  // Create date field ARIA props
  const fieldAria = createDateField(rest, state as unknown as DateFieldState<DateValue>, fieldRef);

  // Render props values
  const renderValues = createMemo<DateFieldRenderProps>(() => ({
    isDisabled: state.isDisabled(),
    isReadOnly: state.isReadOnly(),
    isRequired: state.isRequired(),
    isInvalid: state.isInvalid(),
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-DateField',
    },
    renderValues
  );

  return (
    <DateFieldContext.Provider value={state as unknown as DateFieldState<DateValue>}>
      <div
        ref={setFieldRef}
        {...fieldAria.fieldProps}
        class={renderProps.class()}
        style={renderProps.style()}
        data-disabled={dataAttr(state.isDisabled())}
        data-readonly={dataAttr(state.isReadOnly())}
        data-required={dataAttr(state.isRequired())}
        data-invalid={dataAttr(state.isInvalid())}
      >
        {props.children as JSX.Element}
      </div>
    </DateFieldContext.Provider>
  );
}

// ============================================
// DATE INPUT COMPONENT
// ============================================

/**
 * The input area containing date segments.
 */
export function DateInput(props: DateInputProps): JSX.Element {
  const state = useDateFieldContext();
  const [isFocused, setIsFocused] = createSignal(false);

  // Render props values
  const renderValues = createMemo<DateInputRenderProps>(() => ({
    isDisabled: state.isDisabled(),
    isFocused: isFocused(),
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      class: props.class,
      style: props.style,
      defaultClassName: 'solidaria-DateInput',
    },
    renderValues
  );

  return (
    <div
      role="presentation"
      class={renderProps.class()}
      style={renderProps.style()}
      data-disabled={dataAttr(state.isDisabled())}
      data-focused={dataAttr(isFocused())}
      onFocusIn={() => setIsFocused(true)}
      onFocusOut={() => setIsFocused(false)}
    >
      <For each={state.segments()}>
        {(segment) => props.children?.(segment)}
      </For>
    </div>
  );
}

// ============================================
// DATE SEGMENT COMPONENT
// ============================================

/**
 * A segment of a date field (year, month, day, etc.).
 */
export function DateSegment(props: DateSegmentProps): JSX.Element {
  const state = useDateFieldContext();
  const [segmentRef, setSegmentRef] = createSignal<HTMLDivElement | null>(null);

  // Create segment ARIA props
  const segmentAria = createDateSegment(
    { segment: props.segment },
    state,
    segmentRef
  );

  // Render props values
  const renderValues = createMemo<DateSegmentRenderProps>(() => ({
    isFocused: segmentAria.isFocused,
    isEditable: segmentAria.isEditable,
    isPlaceholder: segmentAria.isPlaceholder,
    type: props.segment.type,
    text: segmentAria.text,
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: props.children,
      class: props.class,
      style: props.style,
      defaultClassName: 'solidaria-DateSegment',
    },
    renderValues
  );

  // Determine children content - avoid Show for SSR hydration compatibility
  const getChildren = () => {
    if (typeof props.children === 'function') {
      return renderProps.renderChildren();
    }
    return segmentAria.text;
  };

  return (
    <div
      ref={setSegmentRef}
      {...segmentAria.segmentProps}
      class={renderProps.class()}
      style={renderProps.style()}
      data-focused={dataAttr(segmentAria.isFocused)}
      data-editable={dataAttr(segmentAria.isEditable)}
      data-placeholder={dataAttr(segmentAria.isPlaceholder)}
      data-type={props.segment.type}
    >
      {getChildren()}
    </div>
  );
}

// Re-export types
export type { DateFieldState, DateSegmentType };
