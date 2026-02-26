import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@solidjs/testing-library';
import { createRoot } from 'solid-js';
import { createToast, createToastRegion } from '../src/toast';

describe('createToast', () => {
  afterEach(() => {
    cleanup();
  });

  it('returns alertdialog semantics and labeled content props', () => {
    createRoot((dispose) => {
      const toast = {
        key: 'toast-1',
        animation: 'entering',
      } as any;

      const state = {
        close: vi.fn(),
      } as any;

      const aria = createToast({ toast, state });

      expect(aria.toastProps.role).toBe('alertdialog');
      expect(aria.toastProps['aria-modal']).toBe('false');
      expect(aria.contentProps.role).toBe('alert');
      expect(aria.contentProps['aria-live']).toBe('assertive');
      expect(aria.titleProps.id).toBeTruthy();
      expect(aria.descriptionProps.id).toBeTruthy();
      expect(aria.closeButtonProps['aria-label']).toBe('Close');
      dispose();
    });
  });

  it('calls state.close with the toast key when close button is pressed', () => {
    createRoot((dispose) => {
      const close = vi.fn();
      const toast = {
        key: 'toast-2',
        animation: 'entering',
      } as any;

      const aria = createToast({
        toast,
        state: { close } as any,
      });

      const onClick = aria.closeButtonProps.onClick as (() => void) | undefined;
      onClick?.();

      expect(close).toHaveBeenCalledWith('toast-2');
      dispose();
    });
  });

  it('omits aria-describedby when hasDescription is false', () => {
    createRoot((dispose) => {
      const toast = {
        key: 'toast-3',
        animation: 'entering',
      } as any;

      const aria = createToast({
        toast,
        state: { close: vi.fn() } as any,
        hasDescription: false,
      });

      expect(aria.toastProps['aria-describedby']).toBeUndefined();
      expect(aria.toastProps['aria-labelledby']).toBeTruthy();
      dispose();
    });
  });
});

describe('createToastRegion', () => {
  afterEach(() => {
    cleanup();
  });

  it('pauses and resumes timers on hover', () => {
    const pauseAll = vi.fn();
    const resumeAll = vi.fn();

    render(() => (
      (() => {
        const aria = createToastRegion({
          state: { pauseAll, resumeAll } as any,
          'aria-label': 'Notifications',
        });
        return (
          <div {...aria.regionProps} data-testid="region">
            Region
          </div>
        );
      })()
    ));

    const region = screen.getByTestId('region');
    fireEvent.pointerEnter(region, { pointerType: 'mouse' });
    fireEvent.pointerLeave(region, { pointerType: 'mouse' });

    expect(pauseAll).toHaveBeenCalled();
    expect(resumeAll).toHaveBeenCalled();
    expect(region).toHaveAttribute('role', 'region');
    expect(region).toHaveAttribute('aria-label', 'Notifications');
  });

  it('pauses on focus-in and resumes when focus leaves the region', () => {
    const pauseAll = vi.fn();
    const resumeAll = vi.fn();

    render(() => (
      (() => {
        const aria = createToastRegion({
          state: { pauseAll, resumeAll } as any,
        });
        return (
          <div {...aria.regionProps} data-testid="region">
            <button data-testid="inside">Inside</button>
          </div>
        );
      })()
    ));

    const region = screen.getByTestId('region');

    fireEvent.focusIn(region);
    expect(pauseAll).toHaveBeenCalled();

    fireEvent.focusOut(region, { relatedTarget: null });
    expect(resumeAll).toHaveBeenCalled();
  });
});
