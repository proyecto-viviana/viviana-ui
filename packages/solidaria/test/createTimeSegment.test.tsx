import { describe, it, expect, afterEach, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@solidjs/testing-library';
import { I18nProvider } from '../src/i18n';
import { createTimeSegment } from '../src/datepicker/createTimeSegment';

type MockState = {
  isDisabled: () => boolean;
  isReadOnly: () => boolean;
  isInvalid: () => boolean;
  incrementSegment: ReturnType<typeof vi.fn>;
  decrementSegment: ReturnType<typeof vi.fn>;
  clearSegment: ReturnType<typeof vi.fn>;
  setSegment: ReturnType<typeof vi.fn>;
};

function renderSegment(options?: {
  locale?: string;
  segment?: {
    type: 'hour' | 'minute' | 'dayPeriod';
    text: string;
    value?: number;
    minValue?: number;
    maxValue?: number;
    isEditable: boolean;
    isPlaceholder: boolean;
    placeholder: string;
  };
}) {
  let segmentRef: HTMLElement | null = null;
  const state: MockState = {
    isDisabled: () => false,
    isReadOnly: () => false,
    isInvalid: () => false,
    incrementSegment: vi.fn(),
    decrementSegment: vi.fn(),
    clearSegment: vi.fn(),
    setSegment: vi.fn(),
  };

  const segment = options?.segment ?? {
    type: 'hour' as const,
    text: '10',
    value: 10,
    minValue: 1,
    maxValue: 12,
    isEditable: true,
    isPlaceholder: false,
    placeholder: 'hh',
  };

  function Inner() {
    const aria = createTimeSegment(
      () => ({ segment }),
      state as any,
      () => segmentRef
    );

    return (
      <div>
        <div role="spinbutton" tabIndex={0} data-testid="prev">prev</div>
        <div ref={(el) => (segmentRef = el)} data-testid="segment" {...(aria.segmentProps as any)}>
          {aria.text}
        </div>
        <div role="spinbutton" tabIndex={0} data-testid="next">next</div>
      </div>
    );
  }

  render(() => (
    <I18nProvider locale={options?.locale ?? 'en-US'}>
      <Inner />
    </I18nProvider>
  ));

  return state;
}

describe('createTimeSegment', () => {
  afterEach(() => {
    cleanup();
  });

  it('moves focus to next segment on ArrowRight in LTR', () => {
    renderSegment({ locale: 'en-US' });
    const segment = screen.getByTestId('segment');
    const next = screen.getByTestId('next');

    segment.focus();
    fireEvent.keyDown(segment, { key: 'ArrowRight' });
    expect(next).toHaveFocus();
  });

  it('moves focus to previous segment on ArrowRight in RTL', () => {
    renderSegment({ locale: 'he-IL' });
    const segment = screen.getByTestId('segment');
    const prev = screen.getByTestId('prev');

    segment.focus();
    fireEvent.keyDown(segment, { key: 'ArrowRight' });
    expect(prev).toHaveFocus();
  });

  it('moves to previous segment on Backspace when current segment is placeholder', () => {
    renderSegment({
      segment: {
        type: 'hour',
        text: 'hh',
        minValue: 1,
        maxValue: 12,
        isEditable: true,
        isPlaceholder: true,
        placeholder: 'hh',
      },
    });

    const segment = screen.getByTestId('segment');
    const prev = screen.getByTestId('prev');

    segment.focus();
    fireEvent.keyDown(segment, { key: 'Backspace' });
    expect(prev).toHaveFocus();
  });

  it('auto-advances to next segment when numeric entry completes segment', () => {
    const state = renderSegment({
      segment: {
        type: 'hour',
        text: 'hh',
        minValue: 1,
        maxValue: 12,
        isEditable: true,
        isPlaceholder: true,
        placeholder: 'hh',
      },
    });

    const segment = screen.getByTestId('segment');
    const next = screen.getByTestId('next');

    segment.focus();
    fireEvent.keyDown(segment, { key: '1' });
    fireEvent.keyDown(segment, { key: '2' });

    expect(state.setSegment).toHaveBeenNthCalledWith(1, 'hour', 1);
    expect(state.setSegment).toHaveBeenNthCalledWith(2, 'hour', 12);
    expect(next).toHaveFocus();
  });

  it('accepts full-width digits in typed input', () => {
    const state = renderSegment({
      segment: {
        type: 'hour',
        text: 'hh',
        minValue: 1,
        maxValue: 12,
        isEditable: true,
        isPlaceholder: true,
        placeholder: 'hh',
      },
    });

    const segment = screen.getByTestId('segment');
    fireEvent.keyDown(segment, { key: '１' });
    fireEvent.keyDown(segment, { key: '２' });

    expect(state.setSegment).toHaveBeenNthCalledWith(1, 'hour', 1);
    expect(state.setSegment).toHaveBeenNthCalledWith(2, 'hour', 12);
  });
});
