/**
 * Focus flow recorder (INFRA-5)
 *
 * Records focusin events to capture the sequential focus flow through a UI.
 * Complements the existing `assertFocusTrap` in focus.ts with sequential
 * focus recording and focus-restore assertions.
 */

export interface FocusRecord {
  element: Element;
  tagName: string;
  role: string | null;
  label: string | null;
  timestamp: number;
}

export interface FocusFlowRecorder {
  /** All recorded focus transitions */
  records: FocusRecord[];
  /** Stop recording */
  stop(): void;
  /** Clear recorded focus transitions */
  clear(): void;
  /** Get tag name sequence (e.g. ['BUTTON', 'INPUT', 'BUTTON']) */
  getTagSequence(): string[];
  /** Get role sequence (e.g. ['button', 'textbox', 'button']) */
  getRoleSequence(): string[];
}

function getAccessibleLabel(element: Element): string | null {
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labels = labelledBy
      .split(/\s+/)
      .map((id) => document.getElementById(id)?.textContent)
      .filter(Boolean);
    if (labels.length > 0) return labels.join(' ');
  }

  if (element instanceof HTMLButtonElement || element instanceof HTMLAnchorElement) {
    return element.textContent?.trim() || null;
  }

  return null;
}

/**
 * Create a focus flow recorder that captures focusin events.
 *
 * @example
 * ```ts
 * const recorder = createFocusFlowRecorder();
 * await user.tab();
 * await user.tab();
 * expect(recorder.getTagSequence()).toEqual(['BUTTON', 'INPUT']);
 * recorder.stop();
 * ```
 */
export function createFocusFlowRecorder(
  target: EventTarget = document,
): FocusFlowRecorder {
  const records: FocusRecord[] = [];

  function handleFocusIn(event: Event) {
    const element = event.target;
    if (!(element instanceof Element)) return;

    records.push({
      element,
      tagName: element.tagName,
      role: element.getAttribute('role'),
      label: getAccessibleLabel(element),
      timestamp: Date.now(),
    });
  }

  target.addEventListener('focusin', handleFocusIn);

  return {
    records,

    stop() {
      target.removeEventListener('focusin', handleFocusIn);
    },

    clear() {
      records.length = 0;
    },

    getTagSequence() {
      return records.map((r) => r.tagName);
    },

    getRoleSequence() {
      return records
        .map((r) => r.role)
        .filter((role): role is string => role !== null);
    },
  };
}

/**
 * Assert that the last N focus transitions match the expected sequence.
 *
 * @example
 * ```ts
 * expectFocusOrder(recorder, [
 *   { role: 'button' },
 *   { role: 'textbox' },
 *   { role: 'button' },
 * ]);
 * ```
 */
export function expectFocusOrder(
  recorder: FocusFlowRecorder,
  expected: Array<{ tagName?: string; role?: string | null; label?: string | null }>,
): void {
  const { records } = recorder;
  const lastN = records.slice(-expected.length);

  if (lastN.length < expected.length) {
    throw new Error(
      `Expected ${expected.length} focus transitions, but only ${lastN.length} recorded`,
    );
  }

  for (let i = 0; i < expected.length; i++) {
    const exp = expected[i];
    const actual = lastN[i];

    if (exp.tagName && actual.tagName !== exp.tagName) {
      throw new Error(
        `Focus transition ${i}: expected tagName "${exp.tagName}", got "${actual.tagName}"`,
      );
    }
    if (exp.role !== undefined && actual.role !== exp.role) {
      throw new Error(
        `Focus transition ${i}: expected role "${exp.role}", got "${actual.role}"`,
      );
    }
    if (exp.label !== undefined && actual.label !== exp.label) {
      throw new Error(
        `Focus transition ${i}: expected label "${exp.label}", got "${actual.label}"`,
      );
    }
  }
}

/**
 * Assert that focus returns to the trigger element after an overlay open/close cycle.
 *
 * @example
 * ```ts
 * await expectFocusRestore(triggerButton, () => user.click(triggerButton), () => user.keyboard('{Escape}'));
 * ```
 */
export async function expectFocusRestore(
  trigger: Element,
  openFn: () => Promise<void>,
  closeFn: () => Promise<void>,
): Promise<void> {
  // Focus the trigger first
  if (trigger instanceof HTMLElement) {
    trigger.focus();
  }

  await openFn();

  // Focus should have moved away from trigger
  if (document.activeElement === trigger) {
    // Some components keep focus on trigger — that's fine, just verify after close
  }

  await closeFn();

  // Allow microtasks to settle
  await new Promise((r) => setTimeout(r, 0));

  if (document.activeElement !== trigger) {
    const actual = document.activeElement;
    const actualDesc = actual
      ? `${actual.tagName}${actual.id ? '#' + actual.id : ''}${actual.getAttribute('role') ? '[role="' + actual.getAttribute('role') + '"]' : ''}`
      : 'null';
    throw new Error(
      `Expected focus to return to trigger (${trigger.tagName}), ` +
        `but focus is on ${actualDesc}`,
    );
  }
}
