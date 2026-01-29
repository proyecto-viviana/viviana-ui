/**
 * TimeField tests - Port of React Aria's TimeField.test.tsx
 *
 * Tests for TimeField component functionality including:
 * - Rendering
 * - Segments
 * - Value control
 * - Keyboard interactions
 * - Disabled/readonly states
 * - ARIA attributes
 */

import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@solidjs/testing-library';
import { Time } from '@internationalized/date';
import { TimeField, TimeInput, TimeSegment } from '../src/TimeField';
import { setupUser } from '@proyecto-viviana/solidaria-test-utils';

// setupUser is consolidated in solidaria-test-utils.

// Helper to wait for TimeField to hydrate (it uses client-only rendering)
async function waitForTimeFieldHydration() {
  await waitFor(() => {
    // TimeField should have rendered its inner content (not the placeholder)
    const field = document.querySelector('.solidaria-TimeField');
    expect(field).toBeInTheDocument();
    // Also check for segments to ensure hydration is complete
    const segments = document.querySelectorAll('.solidaria-TimeSegment');
    expect(segments.length).toBeGreaterThan(0);
  }, { timeout: 2000 });
}

// Helper component for testing
function TestTimeField(props: {
  fieldProps?: Partial<Parameters<typeof TimeField>[0]>;
}) {
  return (
    <TimeField aria-label="Test Time" {...props.fieldProps}>
      <TimeInput>
        {(segment) => <TimeSegment segment={segment} />}
      </TimeInput>
    </TimeField>
  );
}

describe('TimeField', () => {
  let user: ReturnType<typeof setupUser>;

  beforeEach(() => {
    user = setupUser();
  });

  afterEach(() => {
    cleanup();
  });

  // ============================================
  // RENDERING
  // ============================================

  describe('rendering', () => {
    it('should render with default class', async () => {
      render(() => <TestTimeField />);
      await waitForTimeFieldHydration();

      const field = document.querySelector('.solidaria-TimeField');
      expect(field).toBeInTheDocument();
    });

    it('should render time input', async () => {
      render(() => <TestTimeField />);
      await waitForTimeFieldHydration();

      const input = document.querySelector('.solidaria-TimeInput');
      expect(input).toBeInTheDocument();
    });

    it('should render segments', async () => {
      render(() => <TestTimeField />);
      await waitForTimeFieldHydration();

      const segments = document.querySelectorAll('.solidaria-TimeSegment');
      expect(segments.length).toBeGreaterThan(0);
    });

    it('should render with custom class', async () => {
      render(() => <TestTimeField fieldProps={{ class: 'my-time-field' }} />);

      // Wait for segments since custom class overrides default class
      await waitFor(() => {
        const segments = document.querySelectorAll('.solidaria-TimeSegment');
        expect(segments.length).toBeGreaterThan(0);
      }, { timeout: 2000 });

      const field = document.querySelector('.my-time-field');
      expect(field).toBeInTheDocument();
    });
  });

  // ============================================
  // SEGMENTS
  // ============================================

  describe('segments', () => {
    it('should render hour segment', async () => {
      render(() => <TestTimeField />);
      await waitForTimeFieldHydration();

      const hourSegment = document.querySelector('[data-type="hour"]');
      expect(hourSegment).toBeInTheDocument();
    });

    it('should render minute segment', async () => {
      render(() => <TestTimeField />);
      await waitForTimeFieldHydration();

      const minuteSegment = document.querySelector('[data-type="minute"]');
      expect(minuteSegment).toBeInTheDocument();
    });

    it('should render spinbutton role on editable segments', async () => {
      render(() => <TestTimeField />);
      await waitForTimeFieldHydration();

      const spinbuttons = screen.getAllByRole('spinbutton');
      expect(spinbuttons.length).toBeGreaterThan(0);
    });

    it('should render literal segments as separators', async () => {
      render(() => <TestTimeField />);
      await waitForTimeFieldHydration();

      const literalSegment = document.querySelector('[data-type="literal"]');
      expect(literalSegment).toBeInTheDocument();
    });
  });

  // ============================================
  // VALUE CONTROL
  // ============================================

  describe('value control', () => {
    it('should display defaultValue', async () => {
      render(() => (
        <TestTimeField fieldProps={{ defaultValue: new Time(14, 30) }} />
      ));
      await waitForTimeFieldHydration();

      const hourSegment = document.querySelector('[data-type="hour"]');
      expect(hourSegment).toBeInTheDocument();
    });

    it('should display controlled value', async () => {
      render(() => (
        <TestTimeField fieldProps={{ value: new Time(9, 15) }} />
      ));
      await waitForTimeFieldHydration();

      const hourSegment = document.querySelector('[data-type="hour"]');
      expect(hourSegment).toBeInTheDocument();
    });

    it('should fire onChange when value changes', async () => {
      const onChange = vi.fn();
      render(() => (
        <TestTimeField fieldProps={{ defaultValue: new Time(10, 0), onChange }} />
      ));
      await waitForTimeFieldHydration();

      const spinbuttons = screen.getAllByRole('spinbutton');
      expect(spinbuttons.length).toBeGreaterThan(0);

      const hourSegment = spinbuttons[0];
      hourSegment.focus();
      await user.keyboard('{ArrowUp}');

      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
      });
    });

    it('should show placeholder when empty', async () => {
      render(() => <TestTimeField />);
      await waitForTimeFieldHydration();

      // data-placeholder is an empty string attribute when true (standard data attribute pattern)
      const placeholderSegment = document.querySelector('[data-placeholder]');
      expect(placeholderSegment).toBeInTheDocument();
    });
  });

  // ============================================
  // KEYBOARD INTERACTIONS
  // ============================================

  describe('keyboard interactions', () => {
    it('should increment with ArrowUp', async () => {
      const onChange = vi.fn();
      render(() => (
        <TestTimeField fieldProps={{ defaultValue: new Time(10, 30), onChange }} />
      ));
      await waitForTimeFieldHydration();

      const spinbuttons = screen.getAllByRole('spinbutton');
      expect(spinbuttons.length).toBeGreaterThan(0);

      const hourSegment = spinbuttons[0];
      hourSegment.focus();
      await user.keyboard('{ArrowUp}');

      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
      });
    });

    it('should decrement with ArrowDown', async () => {
      const onChange = vi.fn();
      render(() => (
        <TestTimeField fieldProps={{ defaultValue: new Time(10, 30), onChange }} />
      ));
      await waitForTimeFieldHydration();

      const spinbuttons = screen.getAllByRole('spinbutton');
      expect(spinbuttons.length).toBeGreaterThan(0);

      const hourSegment = spinbuttons[0];
      hourSegment.focus();
      await user.keyboard('{ArrowDown}');

      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
      });
    });

    it('should accept numeric input', async () => {
      const onChange = vi.fn();
      render(() => (
        <TestTimeField fieldProps={{ defaultValue: new Time(10, 30), onChange }} />
      ));
      await waitForTimeFieldHydration();

      const spinbuttons = screen.getAllByRole('spinbutton');
      expect(spinbuttons.length).toBeGreaterThan(0);

      const hourSegment = spinbuttons[0];
      hourSegment.focus();
      await user.keyboard('5');

      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
      });
    });
  });

  // ============================================
  // DISABLED STATE
  // ============================================

  describe('disabled state', () => {
    it('should support isDisabled', async () => {
      render(() => <TestTimeField fieldProps={{ isDisabled: true }} />);
      await waitForTimeFieldHydration();

      const field = document.querySelector('.solidaria-TimeField');
      expect(field).toHaveAttribute('data-disabled');
    });

    it('should have aria-disabled on segments when disabled', async () => {
      render(() => (
        <TestTimeField fieldProps={{ isDisabled: true, defaultValue: new Time(10, 30) }} />
      ));
      await waitForTimeFieldHydration();

      const hourSegment = document.querySelector('[data-type="hour"]');
      expect(hourSegment).toHaveAttribute('aria-disabled', 'true');
    });

    it('should not respond to keyboard when disabled', async () => {
      const onChange = vi.fn();
      render(() => (
        <TestTimeField fieldProps={{ isDisabled: true, defaultValue: new Time(10, 30), onChange }} />
      ));
      await waitForTimeFieldHydration();

      const hourSegment = document.querySelector('[data-type="hour"]') as HTMLElement;
      expect(hourSegment).toBeInTheDocument();

      hourSegment.focus();
      await user.keyboard('{ArrowUp}');

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // READ ONLY STATE
  // ============================================

  describe('read only state', () => {
    it('should support isReadOnly', async () => {
      render(() => <TestTimeField fieldProps={{ isReadOnly: true }} />);
      await waitForTimeFieldHydration();

      const field = document.querySelector('.solidaria-TimeField');
      expect(field).toHaveAttribute('data-readonly');
    });

    it('should have aria-readonly on segments when read-only', async () => {
      render(() => (
        <TestTimeField fieldProps={{ isReadOnly: true, defaultValue: new Time(10, 30) }} />
      ));
      await waitForTimeFieldHydration();

      const hourSegment = document.querySelector('[data-type="hour"]');
      expect(hourSegment).toHaveAttribute('aria-readonly', 'true');
    });
  });

  // ============================================
  // REQUIRED STATE
  // ============================================

  describe('required state', () => {
    it('should support isRequired', async () => {
      render(() => <TestTimeField fieldProps={{ isRequired: true }} />);
      await waitForTimeFieldHydration();

      const field = document.querySelector('.solidaria-TimeField');
      expect(field).toHaveAttribute('data-required');
    });
  });

  // ============================================
  // ARIA ATTRIBUTES
  // ============================================

  describe('aria attributes', () => {
    it('should have spinbutton role on editable segments', async () => {
      render(() => <TestTimeField fieldProps={{ defaultValue: new Time(10, 30) }} />);
      await waitForTimeFieldHydration();

      const spinbuttons = screen.getAllByRole('spinbutton');
      expect(spinbuttons.length).toBeGreaterThan(0);
    });

    it('should have aria-label on segments', async () => {
      render(() => <TestTimeField fieldProps={{ defaultValue: new Time(10, 30) }} />);
      await waitForTimeFieldHydration();

      const hourSegment = document.querySelector('[data-type="hour"]');
      expect(hourSegment).toHaveAttribute('aria-label', 'Hour');
    });

    it('should have aria-valuenow on segments', async () => {
      render(() => <TestTimeField fieldProps={{ defaultValue: new Time(10, 30) }} />);
      await waitForTimeFieldHydration();

      const hourSegment = document.querySelector('[data-type="hour"]');
      expect(hourSegment).toHaveAttribute('aria-valuenow');
    });
  });

  // ============================================
  // DATA ATTRIBUTES
  // ============================================

  describe('data attributes', () => {
    it('should have data-type on segments', async () => {
      render(() => <TestTimeField />);
      await waitForTimeFieldHydration();

      const hourSegment = document.querySelector('[data-type="hour"]');
      expect(hourSegment).toBeInTheDocument();

      const minuteSegment = document.querySelector('[data-type="minute"]');
      expect(minuteSegment).toBeInTheDocument();
    });

    it('should have data-editable on editable segments', async () => {
      render(() => <TestTimeField fieldProps={{ defaultValue: new Time(10, 30) }} />);
      await waitForTimeFieldHydration();

      const hourSegment = document.querySelector('[data-type="hour"]');
      expect(hourSegment).toHaveAttribute('data-editable');
    });

    it('should have data-placeholder on placeholder segments', async () => {
      render(() => <TestTimeField />);
      await waitForTimeFieldHydration();

      // data-placeholder is an empty string attribute when true
      const placeholder = document.querySelector('[data-placeholder]');
      expect(placeholder).toBeInTheDocument();
    });
  });
});
