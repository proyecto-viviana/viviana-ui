import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@solidjs/testing-library';
import { createRoot, createSignal } from 'solid-js';
import {
  createDisclosureState,
  createDisclosureGroupState,
} from '@proyecto-viviana/solid-stately';
import { firePointerClick } from '@proyecto-viviana/solidaria-test-utils';
import { createDisclosure, createDisclosureGroup } from '../src/disclosure';

describe('createDisclosure', () => {
  afterEach(() => {
    cleanup();
  });

  it('wires trigger and panel ARIA attributes', () => {
    function TestComponent() {
      let panelRef: HTMLDivElement | undefined;
      const state = createDisclosureState();
      const aria = createDisclosure(
        {},
        state,
        () => panelRef ?? null
      );

      return (
        <>
          <button {...aria.buttonProps} data-testid="trigger">
            Toggle
          </button>
          <div ref={panelRef} {...aria.panelProps} data-testid="panel">
            Content
          </div>
        </>
      );
    }

    render(() => <TestComponent />);
    const trigger = screen.getByTestId('trigger');
    const panel = screen.getByTestId('panel');

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveAttribute('aria-labelledby', trigger.id);
    expect(panel).toHaveAttribute('role', 'region');
  });

  it('toggles panel visibility when pressed', () => {
    function TestComponent() {
      let panelRef: HTMLDivElement | undefined;
      const state = createDisclosureState();
      const aria = createDisclosure(
        {},
        state,
        () => panelRef ?? null
      );

      return (
        <>
          <button {...aria.buttonProps} data-testid="trigger">
            Toggle
          </button>
          <div ref={panelRef} {...aria.panelProps} data-testid="panel">
            Content
          </div>
        </>
      );
    }

    render(() => <TestComponent />);
    const trigger = screen.getByTestId('trigger');
    const panel = screen.getByTestId('panel');

    expect(panel).toHaveAttribute('hidden');
    firePointerClick(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(panel).not.toHaveAttribute('hidden');
  });

  it('does not toggle when disabled', () => {
    function TestComponent() {
      let panelRef: HTMLDivElement | undefined;
      const state = createDisclosureState();
      const aria = createDisclosure(
        { isDisabled: true },
        state,
        () => panelRef ?? null
      );

      return (
        <button {...aria.buttonProps} data-testid="trigger">
          Toggle
        </button>
      );
    }

    render(() => <TestComponent />);
    const trigger = screen.getByTestId('trigger');

    firePointerClick(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toBeDisabled();
  });
});

describe('createDisclosureGroup', () => {
  it('sets aria-disabled from group state', () => {
    createRoot((dispose) => {
      const state = createDisclosureGroupState({ isDisabled: true });
      const aria = createDisclosureGroup({}, state);

      expect(aria.groupProps.role).toBe('group');
      expect(aria.groupProps['aria-disabled']).toBe(true);
      dispose();
    });
  });

  it('reacts to isDisabled prop updates', () => {
    createRoot((dispose) => {
      const [isDisabled, setIsDisabled] = createSignal(false);
      const state = createDisclosureGroupState(() => ({ isDisabled: isDisabled() }));
      const aria = createDisclosureGroup(() => ({ isDisabled: isDisabled() }), state);

      expect(aria.groupProps['aria-disabled']).toBeUndefined();

      setIsDisabled(true);
      expect(aria.groupProps['aria-disabled']).toBe(true);
      dispose();
    });
  });
});
