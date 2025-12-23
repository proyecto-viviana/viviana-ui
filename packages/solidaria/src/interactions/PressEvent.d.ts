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
export declare class PressEvent implements IPressEvent {
    #private;
    type: PressEventType;
    pointerType: PointerType;
    target: Element;
    shiftKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    altKey: boolean;
    x: number;
    y: number;
    constructor(type: PressEventType, pointerType: PointerType, originalEvent: Event | null, target: Element);
    /**
     * Call this to allow the press event to propagate to parent elements.
     * By default, press events stop propagation.
     */
    continuePropagation(): void;
    /**
     * Whether the event should stop propagation.
     * Used internally by the press handler.
     */
    get shouldStopPropagation(): boolean;
}
/**
 * Creates a PressEvent from a native event.
 */
export declare function createPressEvent(type: PressEventType, pointerType: PointerType, originalEvent: Event | null, target: Element): PressEvent;
//# sourceMappingURL=PressEvent.d.ts.map