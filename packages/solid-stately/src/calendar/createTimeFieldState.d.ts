/**
 * TimeFieldState for Solid-Stately
 *
 * Provides state management for time field components with segment-based editing.
 * Based on @react-stately/datepicker useTimeFieldState
 */
import { type Accessor } from 'solid-js';
import { type Time, type CalendarDateTime, type ZonedDateTime } from '@internationalized/date';
import { type MaybeAccessor } from '../utils';
import type { ValidationState } from './createCalendarState';
export type TimeValue = Time | CalendarDateTime | ZonedDateTime;
export type TimeSegmentType = 'hour' | 'minute' | 'second' | 'dayPeriod' | 'literal';
export interface TimeSegment {
    /** The type of segment. */
    type: TimeSegmentType;
    /** The text content of the segment. */
    text: string;
    /** The numeric value of the segment (if applicable). */
    value?: number;
    /** The minimum value for the segment. */
    minValue?: number;
    /** The maximum value for the segment. */
    maxValue?: number;
    /** Whether this segment is editable. */
    isEditable: boolean;
    /** Whether this segment is a placeholder. */
    isPlaceholder: boolean;
    /** A placeholder string for the segment. */
    placeholder: string;
}
export interface TimeFieldStateProps<T extends TimeValue = Time> {
    /** The current value (controlled). */
    value?: MaybeAccessor<T | null>;
    /** The default value (uncontrolled). */
    defaultValue?: T | null;
    /** Handler called when the value changes. */
    onChange?: (value: T | null) => void;
    /** The minimum allowed time. */
    minValue?: MaybeAccessor<TimeValue | undefined>;
    /** The maximum allowed time. */
    maxValue?: MaybeAccessor<TimeValue | undefined>;
    /** Whether the field is disabled. */
    isDisabled?: MaybeAccessor<boolean>;
    /** Whether the field is read-only. */
    isReadOnly?: MaybeAccessor<boolean>;
    /** Whether the field is required. */
    isRequired?: MaybeAccessor<boolean>;
    /** The locale to use for formatting. */
    locale?: string;
    /** The granularity (hour, minute, second). */
    granularity?: 'hour' | 'minute' | 'second';
    /** Whether to show 12 or 24 hour format. */
    hourCycle?: 12 | 24;
    /** Validation state. */
    validationState?: MaybeAccessor<ValidationState | undefined>;
    /** The placeholder value. */
    placeholderValue?: T;
}
export interface TimeFieldState<T extends TimeValue = Time> {
    /** The current value. */
    value: Accessor<T | null>;
    /** Sets the value. */
    setValue: (value: T | null) => void;
    /** The segments that make up the time. */
    segments: Accessor<TimeSegment[]>;
    /** Sets a segment value. */
    setSegment: (type: TimeSegmentType, value: number) => void;
    /** Increments a segment. */
    incrementSegment: (type: TimeSegmentType) => void;
    /** Decrements a segment. */
    decrementSegment: (type: TimeSegmentType) => void;
    /** Clears a segment. */
    clearSegment: (type: TimeSegmentType) => void;
    /** Whether the field is disabled. */
    isDisabled: Accessor<boolean>;
    /** Whether the field is read-only. */
    isReadOnly: Accessor<boolean>;
    /** Whether the field is required. */
    isRequired: Accessor<boolean>;
    /** The validation state. */
    validationState: Accessor<ValidationState | undefined>;
    /** The granularity. */
    granularity: 'hour' | 'minute' | 'second';
    /** Whether the value is invalid. */
    isInvalid: Accessor<boolean>;
    /** The locale. */
    locale: string;
    /** The hour cycle. */
    hourCycle: 12 | 24;
}
/**
 * Provides state management for a time field component.
 */
export declare function createTimeFieldState<T extends TimeValue = Time>(props?: TimeFieldStateProps<T>): TimeFieldState<T>;
//# sourceMappingURL=createTimeFieldState.d.ts.map