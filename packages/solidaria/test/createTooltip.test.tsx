import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, screen } from '@solidjs/testing-library';
import { createSignal, Show } from 'solid-js';
import { createTooltipTriggerState, resetTooltipState } from '@proyecto-viviana/solid-stately';
import { createTooltip, createTooltipTrigger } from '../src/tooltip';

describe('createTooltipTrigger', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetTooltipState();
  });

  afterEach(() => {
    vi.useRealTimers();
    resetTooltipState();
  });

  it('should provide aria-describedby when tooltip is open', () => {
    function TestComponent() {
      let ref: HTMLButtonElement | undefined;
      const state = createTooltipTriggerState({ isOpen: true });
      const { triggerProps, tooltipProps } = createTooltipTrigger(
        {},
        state,
        () => ref
      );

      return (
        <>
          <button ref={ref} {...triggerProps} data-testid="trigger">
            Hover me
          </button>
          <div {...tooltipProps} data-testid="tooltip">
            Tooltip content
          </div>
        </>
      );
    }

    render(() => <TestComponent />);
    const trigger = screen.getByTestId('trigger');
    const tooltip = screen.getByTestId('tooltip');

    expect(trigger.getAttribute('aria-describedby')).toBe(tooltip.id);
  });

  it('should not have aria-describedby when tooltip is closed', () => {
    function TestComponent() {
      let ref: HTMLButtonElement | undefined;
      const state = createTooltipTriggerState({ isOpen: false });
      const { triggerProps, tooltipProps } = createTooltipTrigger(
        {},
        state,
        () => ref
      );

      return (
        <>
          <button ref={ref} {...triggerProps} data-testid="trigger">
            Hover me
          </button>
          <div {...tooltipProps} data-testid="tooltip">
            Tooltip content
          </div>
        </>
      );
    }

    render(() => <TestComponent />);
    const trigger = screen.getByTestId('trigger');

    expect(trigger.getAttribute('aria-describedby')).toBeNull();
  });

  it('should assign unique id to tooltip', () => {
    function TestComponent() {
      let ref: HTMLButtonElement | undefined;
      const state = createTooltipTriggerState();
      const { tooltipProps } = createTooltipTrigger({}, state, () => ref);

      return <div {...tooltipProps} data-testid="tooltip">Content</div>;
    }

    render(() => <TestComponent />);
    const tooltip = screen.getByTestId('tooltip');

    expect(tooltip.id).toBeTruthy();
    expect(tooltip.id.length).toBeGreaterThan(0);
  });

  it('should close tooltip on Escape key when open', async () => {
    function TestComponent() {
      let ref: HTMLButtonElement | undefined;
      const state = createTooltipTriggerState({ defaultOpen: true });
      const { triggerProps, tooltipProps } = createTooltipTrigger(
        {},
        state,
        () => ref
      );

      return (
        <>
          <button ref={ref} {...triggerProps} data-testid="trigger">
            Hover me
          </button>
          <Show when={state.isOpen()}>
            <div {...tooltipProps} data-testid="tooltip">
              Tooltip content
            </div>
          </Show>
        </>
      );
    }

    render(() => <TestComponent />);

    // Tooltip should be visible
    expect(screen.queryByTestId('tooltip')).not.toBeNull();

    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape' });

    // Tooltip should be hidden
    expect(screen.queryByTestId('tooltip')).toBeNull();
  });

  it('should respect isDisabled prop', () => {
    function TestComponent() {
      let ref: HTMLButtonElement | undefined;
      const state = createTooltipTriggerState();
      const { triggerProps } = createTooltipTrigger(
        { isDisabled: true },
        state,
        () => ref
      );

      return (
        <button ref={ref} {...triggerProps} data-testid="trigger">
          Hover me
        </button>
      );
    }

    render(() => <TestComponent />);
    const trigger = screen.getByTestId('trigger');

    // Hover should not open tooltip when disabled
    fireEvent.pointerEnter(trigger);
    vi.advanceTimersByTime(2000);

    // State should still be closed (we can't check state directly, but aria-describedby should be null)
    expect(trigger.getAttribute('aria-describedby')).toBeNull();
  });
});

describe('createTooltip', () => {
  it('should add role="tooltip" to the element', () => {
    function TestComponent() {
      const { tooltipProps } = createTooltip();

      return (
        <div {...tooltipProps} data-testid="tooltip">
          Tooltip content
        </div>
      );
    }

    render(() => <TestComponent />);
    const tooltip = screen.getByTestId('tooltip');

    expect(tooltip.getAttribute('role')).toBe('tooltip');
  });

  it('should keep tooltip open when hovering over it', async () => {
    function TestComponent() {
      const [isOpen, setIsOpen] = createSignal(true);
      const state = {
        isOpen,
        open: (immediate?: boolean) => setIsOpen(true),
        close: (immediate?: boolean) => setIsOpen(false),
      };
      const { tooltipProps } = createTooltip({}, state);

      return (
        <Show when={isOpen()}>
          <div {...tooltipProps} data-testid="tooltip">
            Tooltip content
          </div>
        </Show>
      );
    }

    render(() => <TestComponent />);
    const tooltip = screen.getByTestId('tooltip');

    // Hover over tooltip
    fireEvent.pointerEnter(tooltip);

    // Tooltip should remain visible
    expect(screen.queryByTestId('tooltip')).not.toBeNull();
  });

  it('should pass through aria labeling props', () => {
    function TestComponent() {
      const { tooltipProps } = createTooltip({
        'aria-label': 'Custom label',
      });

      return (
        <div {...tooltipProps} data-testid="tooltip">
          Content
        </div>
      );
    }

    render(() => <TestComponent />);
    const tooltip = screen.getByTestId('tooltip');

    expect(tooltip.getAttribute('aria-label')).toBe('Custom label');
  });
});
