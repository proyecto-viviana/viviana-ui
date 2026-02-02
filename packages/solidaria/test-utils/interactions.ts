/**
 * User interaction utilities for testing
 *
 * Higher-level helpers for simulating user interactions in tests.
 */

import userEvent, { type UserEvent, PointerEventsCheckLevel } from '@testing-library/user-event';
import { pointerMap } from './pointer';

/**
 * Type for the userEvent instance
 */
export type UserEventInstance = UserEvent;

// Type for userEvent v14+ setup function
type UserEventSetup = (options?: {
  delay?: number | null;
  pointerMap?: readonly unknown[];
  pointerEventsCheck?: PointerEventsCheckLevel;
}) => UserEvent;

/**
 * Setup userEvent with recommended configuration for solidaria components.
 *
 * @example
 * ```ts
 * const user = setupUser();
 * await user.click(button);
 * ```
 */
export function setupUser(): UserEventInstance {
  // userEvent.setup exists in v14+ but types may not expose it correctly
  const setup = (userEvent as unknown as { setup: UserEventSetup }).setup;
  return setup({
    delay: null,
    pointerMap: pointerMap,
    pointerEventsCheck: PointerEventsCheckLevel.Never,
  });
}

/**
 * Options for the press helper
 */
export interface PressOptions {
  /** Pointer type to use */
  pointerType?: 'mouse' | 'touch' | 'pen';
  /** Button to press (for mouse) */
  button?: 'left' | 'right' | 'middle';
  /** Whether to hold shift key */
  shift?: boolean;
  /** Whether to hold ctrl/cmd key */
  ctrlOrCmd?: boolean;
  /** Whether to hold alt key */
  alt?: boolean;
}

/**
 * Simulate a press interaction on an element.
 *
 * @example
 * ```ts
 * const user = setupUser();
 * await press(user, button);
 * await press(user, button, { pointerType: 'touch' });
 * ```
 */
export async function press(
  user: UserEventInstance,
  element: Element,
  options: PressOptions = {}
): Promise<void> {
  const { pointerType = 'mouse', button = 'left', shift, ctrlOrCmd, alt } = options;

  const modifiers: string[] = [];
  if (shift) modifiers.push('Shift');
  if (ctrlOrCmd) modifiers.push('Control'); // Or Meta on Mac
  if (alt) modifiers.push('Alt');

  const keyName =
    pointerType === 'mouse'
      ? button === 'left'
        ? 'MouseLeft'
        : button === 'right'
          ? 'MouseRight'
          : 'MouseMiddle'
      : pointerType === 'touch'
        ? 'TouchA'
        : 'PenA';

  // Hold modifier keys if specified
  for (const mod of modifiers) {
    await user.keyboard(`[${mod}>]`);
  }

  await user.pointer({ target: element, keys: `[${keyName}]` });

  // Release modifier keys
  for (const mod of modifiers.reverse()) {
    await user.keyboard(`[/${mod}]`);
  }
}

/**
 * Options for long press helper
 */
export interface LongPressOptions extends PressOptions {
  /** Duration of the long press in ms */
  duration?: number;
}

/**
 * Simulate a long press interaction on an element.
 *
 * @example
 * ```ts
 * const user = setupUser();
 * await longPress(user, button, { duration: 500 });
 * ```
 */
export async function longPress(
  user: UserEventInstance,
  element: Element,
  options: LongPressOptions = {}
): Promise<void> {
  const { duration = 500, pointerType = 'mouse', button = 'left' } = options;

  const keyName =
    pointerType === 'mouse'
      ? button === 'left'
        ? 'MouseLeft'
        : button === 'right'
          ? 'MouseRight'
          : 'MouseMiddle'
      : pointerType === 'touch'
        ? 'TouchA'
        : 'PenA';

  // Press down
  await user.pointer({ target: element, keys: `[${keyName}>]` });

  // Wait for long press duration
  await new Promise((resolve) => setTimeout(resolve, duration));

  // Release
  await user.pointer({ target: element, keys: `[/${keyName}]` });
}

/**
 * Options for hover helper
 */
export interface HoverOptions {
  /** Duration to hover in ms (0 = instant) */
  duration?: number;
}

/**
 * Simulate a hover interaction on an element.
 *
 * @example
 * ```ts
 * const user = setupUser();
 * await hover(user, button);
 * await hover(user, button, { duration: 100 });
 * ```
 */
export async function hover(
  user: UserEventInstance,
  element: Element,
  options: HoverOptions = {}
): Promise<void> {
  const { duration = 0 } = options;

  await user.hover(element);

  if (duration > 0) {
    await new Promise((resolve) => setTimeout(resolve, duration));
  }
}

/**
 * Simulate leaving/unhovering an element.
 */
export async function unhover(user: UserEventInstance, element: Element): Promise<void> {
  await user.unhover(element);
}

/**
 * Simulate keyboard navigation with Tab.
 *
 * @example
 * ```ts
 * const user = setupUser();
 * await tabTo(user, 3); // Tab 3 times
 * await tabTo(user, -2); // Shift+Tab 2 times
 * ```
 */
export async function tabTo(user: UserEventInstance, count: number = 1): Promise<void> {
  const isBackward = count < 0;
  const iterations = Math.abs(count);

  for (let i = 0; i < iterations; i++) {
    await user.tab({ shift: isBackward });
  }
}

/**
 * Simulate typing text into an element.
 *
 * @example
 * ```ts
 * const user = setupUser();
 * await typeText(user, input, 'Hello World');
 * ```
 */
export async function typeText(
  user: UserEventInstance,
  element: Element,
  text: string
): Promise<void> {
  await user.click(element);
  await user.keyboard(text);
}

/**
 * Simulate clearing an input and typing new text.
 */
export async function clearAndType(
  user: UserEventInstance,
  element: Element,
  text: string
): Promise<void> {
  await user.click(element);
  await user.clear(element);
  await user.keyboard(text);
}

/**
 * Simulate pressing a specific key.
 *
 * @example
 * ```ts
 * await pressKey(user, 'Enter');
 * await pressKey(user, 'Escape');
 * await pressKey(user, 'ArrowDown');
 * ```
 */
export async function pressKey(user: UserEventInstance, key: string): Promise<void> {
  await user.keyboard(`{${key}}`);
}

/**
 * Simulate pressing multiple keys in sequence.
 *
 * @example
 * ```ts
 * await pressKeys(user, ['ArrowDown', 'ArrowDown', 'Enter']);
 * ```
 */
export async function pressKeys(user: UserEventInstance, keys: string[]): Promise<void> {
  for (const key of keys) {
    await pressKey(user, key);
  }
}

/**
 * Simulate a key combination (e.g., Ctrl+C).
 *
 * @example
 * ```ts
 * await pressKeyCombo(user, ['Control', 'c']);
 * await pressKeyCombo(user, ['Shift', 'Tab']);
 * ```
 */
export async function pressKeyCombo(
  user: UserEventInstance,
  keys: string[]
): Promise<void> {
  if (keys.length === 0) return;

  // Build the key sequence
  const modifiers = keys.slice(0, -1);
  const finalKey = keys[keys.length - 1];

  // Press modifiers
  for (const mod of modifiers) {
    await user.keyboard(`[${mod}>]`);
  }

  // Press final key
  await user.keyboard(`{${finalKey}}`);

  // Release modifiers in reverse
  for (const mod of modifiers.reverse()) {
    await user.keyboard(`[/${mod}]`);
  }
}

/**
 * Simulate a virtual click (screen reader interaction).
 * Virtual clicks have zero dimensions and detail=0.
 */
export function createVirtualClick(target: Element): MouseEvent {
  return new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window,
    detail: 0,
    clientX: 0,
    clientY: 0,
  });
}
