/**
 * PressEvent class that matches React-Aria's PressEvent interface.
 * Wraps native events with press-specific data.
 */

export type PointerType = 'mouse' | 'pen' | 'touch' | 'keyboard' | 'virtual';
export type PressEventType = 'pressstart' | 'pressend' | 'pressup' | 'press';

export interface IPressEvent {
  /** The type of press event being fired. */
  type: PressEventType;
  /** The pointer type that triggered the press event. */
  pointerType: PointerType;
  /** The target element of the press event. */
  target: Element;
  /** Whether the shift keyboard modifier was held during the press event. */
  shiftKey: boolean;
  /** Whether the ctrl keyboard modifier was held during the press event. */
  ctrlKey: boolean;
  /** Whether the meta keyboard modifier was held during the press event. */
  metaKey: boolean;
  /** Whether the alt keyboard modifier was held during the press event. */
  altKey: boolean;
  /** X position of the press relative to the target element. */
  x: number;
  /** Y position of the press relative to the target element. */
  y: number;
  /**
   * By default, press events stop propagation to parent elements.
   * Call continuePropagation() to allow the event to bubble up.
   */
  continuePropagation(): void;
}

/**
 * PressEvent class that provides all press event data.
 * Based on React-Aria's PressEvent implementation.
 */
export class PressEvent implements IPressEvent {
  type: PressEventType;
  pointerType: PointerType;
  target: Element;
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  x: number;
  y: number;

  #shouldStopPropagation = true;

  constructor(
    type: PressEventType,
    pointerType: PointerType,
    originalEvent: Event | null,
    target: Element
  ) {
    this.type = type;
    this.pointerType = pointerType;
    this.target = target;

    // Extract modifier keys from the original event
    const e = originalEvent as MouseEvent | KeyboardEvent | null;
    this.shiftKey = e?.shiftKey ?? false;
    this.ctrlKey = e?.ctrlKey ?? false;
    this.metaKey = e?.metaKey ?? false;
    this.altKey = e?.altKey ?? false;

    // Calculate position relative to target
    this.x = 0;
    this.y = 0;

    if (originalEvent && 'clientX' in originalEvent && target) {
      const rect = target.getBoundingClientRect();
      this.x = (originalEvent as MouseEvent).clientX - rect.left;
      this.y = (originalEvent as MouseEvent).clientY - rect.top;
    } else if (target) {
      // For keyboard events, use center of element
      const rect = target.getBoundingClientRect();
      this.x = rect.width / 2;
      this.y = rect.height / 2;
    }
  }

  /**
   * Call this to allow the press event to propagate to parent elements.
   * By default, press events stop propagation.
   */
  continuePropagation(): void {
    this.#shouldStopPropagation = false;
  }

  /**
   * Whether the event should stop propagation.
   * Used internally by the press handler.
   */
  get shouldStopPropagation(): boolean {
    return this.#shouldStopPropagation;
  }
}

/**
 * Creates a PressEvent from a native event.
 */
export function createPressEvent(
  type: PressEventType,
  pointerType: PointerType,
  originalEvent: Event | null,
  target: Element
): PressEvent {
  return new PressEvent(type, pointerType, originalEvent, target);
}
