import userEvent from '@testing-library/user-event';
import { PointerEventsCheckLevel } from '@testing-library/user-event';

/**
 * Pointer map matching react-spectrum's test setup.
 * Ensures pointer events have realistic dimensions so they aren't mistaken for virtual clicks.
 */
export const pointerMap = [
  { name: 'MouseLeft', pointerType: 'mouse', button: 'primary', height: 1, width: 1, pressure: 0.5 },
  { name: 'MouseRight', pointerType: 'mouse', button: 'secondary' },
  { name: 'MouseMiddle', pointerType: 'mouse', button: 'auxiliary' },
  { name: 'TouchA', pointerType: 'touch', height: 1, width: 1 },
  { name: 'TouchB', pointerType: 'touch' },
  { name: 'TouchC', pointerType: 'touch' },
];

/**
 * Set up userEvent with react-spectrum's configuration.
 * - delay: null - No artificial delays between actions
 * - pointerMap - Realistic pointer event dimensions
 * - pointerEventsCheck: Never - Skip pointer-events CSS check (jsdom doesn't handle this well)
 */
export function setupUser() {
  return userEvent.setup({
    delay: null,
    pointerMap: pointerMap as any,
    pointerEventsCheck: PointerEventsCheckLevel.Never,
  });
}

export { render, screen, fireEvent, cleanup } from '@solidjs/testing-library';
export { userEvent };
