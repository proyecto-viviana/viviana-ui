import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@solidjs/testing-library';
import { createDateSegment } from '../src/datepicker/createDateSegment';
import { I18nProvider } from '../src/i18n';

type MockState = {
  isDisabled: () => boolean;
  isReadOnly: () => boolean;
  isInvalid: () => boolean;
  incrementSegment: ReturnType<typeof vi.fn>;
  decrementSegment: ReturnType<typeof vi.fn>;
  clearSegment: ReturnType<typeof vi.fn>;
  setSegment: ReturnType<typeof vi.fn>;
  confirmPlaceholder: ReturnType<typeof vi.fn>;
};

function renderSegment(options?: {
  locale?: string;
  segment?: {
    type: 'day' | 'month' | 'year';
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
    confirmPlaceholder: vi.fn(),
  };

  const segment = options?.segment ?? {
    type: 'day' as const,
    text: '15',
    value: 15,
    minValue: 1,
    maxValue: 31,
    isEditable: true,
    isPlaceholder: false,
    placeholder: 'dd',
  };

  function Inner() {
    const aria = createDateSegment(
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

describe('createDateSegment', () => {
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
        type: 'day',
        text: 'dd',
        minValue: 1,
        maxValue: 31,
        isEditable: true,
        isPlaceholder: true,
        placeholder: 'dd',
      },
    });

    const segment = screen.getByTestId('segment');
    const prev = screen.getByTestId('prev');

    segment.focus();
    fireEvent.keyDown(segment, { key: 'Backspace' });
    expect(prev).toHaveFocus();
  });

  it('resets numeric buffer when next digit would exceed segment max', () => {
    const state = renderSegment({
      segment: {
        type: 'day',
        text: 'dd',
        minValue: 1,
        maxValue: 31,
        isEditable: true,
        isPlaceholder: true,
        placeholder: 'dd',
      },
    });

    const segment = screen.getByTestId('segment');
    fireEvent.keyDown(segment, { key: '4' });
    fireEvent.keyDown(segment, { key: '2' });

    expect(state.setSegment).toHaveBeenNthCalledWith(1, 'day', 4);
    expect(state.setSegment).toHaveBeenNthCalledWith(2, 'day', 2);
  });

  it('auto-advances to next segment when numeric entry completes segment', () => {
    renderSegment({
      segment: {
        type: 'day',
        text: 'dd',
        minValue: 1,
        maxValue: 31,
        isEditable: true,
        isPlaceholder: true,
        placeholder: 'dd',
      },
    });

    const segment = screen.getByTestId('segment');
    const next = screen.getByTestId('next');

    segment.focus();
    fireEvent.keyDown(segment, { key: '1' });
    fireEvent.keyDown(segment, { key: '2' });

    expect(next).toHaveFocus();
  });

  it('handles composition input and commits normalized digits', () => {
    const state = renderSegment({
      segment: {
        type: 'day',
        text: 'dd',
        minValue: 1,
        maxValue: 31,
        isEditable: true,
        isPlaceholder: true,
        placeholder: 'dd',
      },
    });

    const segment = screen.getByTestId('segment');
    const next = screen.getByTestId('next');

    segment.focus();
    fireEvent.compositionStart(segment);
    fireEvent.compositionEnd(segment, { data: '12' });

    expect(state.setSegment).toHaveBeenNthCalledWith(1, 'day', 1);
    expect(state.setSegment).toHaveBeenNthCalledWith(2, 'day', 12);
    expect(next).toHaveFocus();
  });

  it('accepts full-width digits in typed input', () => {
    const state = renderSegment({
      segment: {
        type: 'day',
        text: 'dd',
        minValue: 1,
        maxValue: 31,
        isEditable: true,
        isPlaceholder: true,
        placeholder: 'dd',
      },
    });

    const segment = screen.getByTestId('segment');
    fireEvent.keyDown(segment, { key: '１' });
    fireEvent.keyDown(segment, { key: '２' });

    expect(state.setSegment).toHaveBeenNthCalledWith(1, 'day', 1);
    expect(state.setSegment).toHaveBeenNthCalledWith(2, 'day', 12);
  });
});
