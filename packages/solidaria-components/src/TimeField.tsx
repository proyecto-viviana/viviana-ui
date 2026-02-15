/**
 * TimeField component for solidaria-components
 *
 * Pre-wired headless time field component with segment-based editing.
 * Port of react-aria-components/src/TimeField.tsx
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
  createTimeField,
  type AriaTimeFieldProps,
} from '@proyecto-viviana/solidaria';
import {
  createTimeFieldState,
  type TimeFieldState,
  type TimeFieldStateProps,
  type TimeSegment as TimeSegmentType,
  type TimeValue,
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

export interface TimeFieldRenderProps {
  /** Whether the field is disabled. */
  isDisabled: boolean;
  /** Whether the field is read-only. */
  isReadOnly: boolean;
  /** Whether the field is required. */
  isRequired: boolean;
  /** Whether the field is invalid. */
  isInvalid: boolean;
}

export interface TimeFieldProps<T extends TimeValue = TimeValue>
  extends Omit<AriaTimeFieldProps, 'id' | 'isDisabled' | 'isReadOnly' | 'isRequired'>,
    Omit<TimeFieldStateProps<T>, 'locale'>,
    SlotProps {
  /** The children of the component. */
  children?: JSX.Element | ((segment: TimeSegmentType) => JSX.Element);
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<TimeFieldRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<TimeFieldRenderProps>;
  /** The locale to use for formatting. */
  locale?: string;
}

export interface TimeInputRenderProps {
  /** Whether the input is disabled. */
  isDisabled: boolean;
  /** Whether the input is focused. */
  isFocused: boolean;
}

export interface TimeInputProps extends SlotProps {
  /** The children of the component (render function receiving segments). */
  children?: (segment: TimeSegmentType) => JSX.Element;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<TimeInputRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<TimeInputRenderProps>;
}

export interface TimeSegmentRenderProps {
  /** Whether the segment is focused. */
  isFocused: boolean;
  /** Whether the segment is editable. */
  isEditable: boolean;
  /** Whether the segment is a placeholder. */
  isPlaceholder: boolean;
  /** The segment type. */
  type: TimeSegmentType['type'];
  /** The text to display. */
  text: string;
}

export interface TimeSegmentProps extends SlotProps {
  /** The segment data. */
  segment: TimeSegmentType;
  /** The children of the component. A function may be provided to receive render props. */
  children?: RenderChildren<TimeSegmentRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<TimeSegmentRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<TimeSegmentRenderProps>;
}

// ============================================
// CONTEXT
// ============================================

export const TimeFieldContext = createContext<TimeFieldState<TimeValue> | null>(null);
export const TimeFieldStateContext = TimeFieldContext;

export function useTimeFieldContext(): TimeFieldState<TimeValue> {
  const context = useContext(TimeFieldContext);
  if (!context) {
    throw new Error('TimeField components must be used within a TimeField');
  }
  return context;
}

// ============================================
// TIME FIELD COMPONENT
// ============================================

/**
 * A time field allows users to enter and edit time values using a keyboard.
 *
 * @example
 * ```tsx
 * <TimeField label="Time">
 *   <Label>Time</Label>
 *   <TimeInput>
 *     {(segment) => <TimeSegment segment={segment} />}
 *   </TimeInput>
 * </TimeField>
 * ```
 */
export function TimeField<T extends TimeValue = TimeValue>(
  props: TimeFieldProps<T>
): JSX.Element {
  // Use hydration-safe pattern for client-only rendering
  const isHydrated = useIsHydrated();

  return (
    <Show
      when={isHydrated()}
      fallback={<div class="solidaria-TimeField solidaria-TimeField--placeholder" aria-hidden="true" />}
    >
      <TimeFieldInner {...props} />
    </Show>
  );
}

/**
 * Internal TimeField component that renders after client mount.
 */
function TimeFieldInner<T extends TimeValue = TimeValue>(
  props: TimeFieldProps<T>
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
      'validationState',
      'placeholderValue',
    ]
  );

  const [fieldRef, setFieldRef] = createSignal<HTMLDivElement | null>(null);

  // Create time field state
  const state = createTimeFieldState(stateProps);

  // Create time field ARIA props
  const fieldAria = createTimeField(rest, state as unknown as TimeFieldState<TimeValue>, fieldRef);

  // Render props values
  const renderValues = createMemo<TimeFieldRenderProps>(() => ({
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
      defaultClassName: 'solidaria-TimeField',
    },
    renderValues
  );

  return (
    <TimeFieldContext.Provider value={state as unknown as TimeFieldState<TimeValue>}>
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
    </TimeFieldContext.Provider>
  );
}

// ============================================
// TIME INPUT COMPONENT
// ============================================

/**
 * The input area containing time segments.
 */
export function TimeInput(props: TimeInputProps): JSX.Element {
  const state = useTimeFieldContext();
  const [isFocused, setIsFocused] = createSignal(false);

  // Render props values
  const renderValues = createMemo<TimeInputRenderProps>(() => ({
    isDisabled: state.isDisabled(),
    isFocused: isFocused(),
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      class: props.class,
      style: props.style,
      defaultClassName: 'solidaria-TimeInput',
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
// TIME SEGMENT COMPONENT
// ============================================

/**
 * A segment of a time field (hour, minute, second, AM/PM).
 */
export function TimeSegment(props: TimeSegmentProps): JSX.Element {
  const state = useTimeFieldContext();
  const [_segmentRef, setSegmentRef] = createSignal<HTMLDivElement | null>(null);

  // Create segment ARIA props
  // We use a simplified version for time segments
  const [isFocused, setIsFocused] = createSignal(false);
  const [enteredKeys, setEnteredKeys] = createSignal('');

  const isEditable = createMemo(() => {
    const seg = props.segment;
    return seg.isEditable && !state.isDisabled() && !state.isReadOnly();
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isEditable()) return;

    const seg = props.segment;
    const type = seg.type;

    if (type === 'literal') return;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        state.incrementSegment(type);
        break;
      case 'ArrowDown':
        e.preventDefault();
        state.decrementSegment(type);
        break;
      case 'Backspace':
      case 'Delete':
        e.preventDefault();
        state.clearSegment(type);
        setEnteredKeys('');
        break;
      default:
        if (/^\d$/.test(e.key)) {
          e.preventDefault();
          const newKeys = enteredKeys() + e.key;
          const numValue = parseInt(newKeys, 10);
          const maxValue = seg.maxValue ?? 59;
          const minValue = seg.minValue ?? 0;

          if (numValue <= maxValue) {
            state.setSegment(type, numValue);
            if (numValue * 10 > maxValue || newKeys.length >= 2) {
              setEnteredKeys('');
            } else {
              setEnteredKeys(newKeys);
            }
          } else {
            const singleValue = parseInt(e.key, 10);
            if (singleValue >= minValue && singleValue <= maxValue) {
              state.setSegment(type, singleValue);
            }
            setEnteredKeys(e.key);
          }
        }
        break;
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setEnteredKeys('');
  };

  const handleBlur = () => {
    setIsFocused(false);
    setEnteredKeys('');
  };

  // Segment props
  const segmentProps = createMemo(() => {
    const seg = props.segment;
    const type = seg.type;

    if (type === 'literal') {
      return {
        'aria-hidden': true,
      };
    }

    return {
      role: 'spinbutton' as const,
      tabIndex: isEditable() ? 0 : -1,
      'aria-label': getTimeSegmentLabel(type),
      'aria-valuenow': seg.value,
      'aria-valuemin': seg.minValue,
      'aria-valuemax': seg.maxValue,
      'aria-valuetext': seg.isPlaceholder ? seg.placeholder : seg.text,
      'aria-readonly': state.isReadOnly() || undefined,
      'aria-disabled': state.isDisabled() || undefined,
      'aria-invalid': state.isInvalid() || undefined,
      contentEditable: isEditable(),
      inputMode: 'numeric' as const,
      autoCorrect: 'off',
      enterKeyHint: 'next' as const,
      spellCheck: false,
      onKeyDown: handleKeyDown,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onMouseDown: (e: MouseEvent) => {
        e.preventDefault();
      },
    };
  });

  const text = createMemo(() => {
    const seg = props.segment;
    return seg.isPlaceholder ? seg.placeholder : seg.text;
  });

  // Render props values
  const renderValues = createMemo<TimeSegmentRenderProps>(() => ({
    isFocused: isFocused(),
    isEditable: isEditable(),
    isPlaceholder: props.segment.isPlaceholder,
    type: props.segment.type,
    text: text(),
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: props.children,
      class: props.class,
      style: props.style,
      defaultClassName: 'solidaria-TimeSegment',
    },
    renderValues
  );

  // Determine children content - avoid Show for SSR hydration compatibility
  const getChildren = () => {
    if (typeof props.children === 'function') {
      return renderProps.renderChildren();
    }
    return text();
  };

  return (
    <div
      ref={setSegmentRef}
      {...segmentProps()}
      class={renderProps.class()}
      style={renderProps.style()}
      data-focused={dataAttr(isFocused())}
      data-editable={dataAttr(isEditable())}
      data-placeholder={dataAttr(props.segment.isPlaceholder)}
      data-type={props.segment.type}
    >
      {getChildren()}
    </div>
  );
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getTimeSegmentLabel(type: TimeSegmentType['type']): string {
  switch (type) {
    case 'hour':
      return 'Hour';
    case 'minute':
      return 'Minute';
    case 'second':
      return 'Second';
    case 'dayPeriod':
      return 'AM/PM';
    default:
      return '';
  }
}

// Re-export types
export type { TimeFieldState, TimeSegmentType, TimeValue };
