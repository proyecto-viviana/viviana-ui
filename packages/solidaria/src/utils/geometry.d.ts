/**
 * Geometry utilities for pointer/touch hit testing.
 * Based on @react-aria/interactions geometry utilities.
 */
export interface Rect {
    top: number;
    right: number;
    bottom: number;
    left: number;
}
export interface EventPoint {
    clientX: number;
    clientY: number;
    width?: number;
    height?: number;
    radiusX?: number;
    radiusY?: number;
}
/**
 * Checks if two rectangles overlap.
 */
export declare function areRectanglesOverlapping(a: Rect, b: Rect): boolean;
/**
 * Gets the bounding rectangle for an event point (touch/pointer).
 * Takes into account the size of the touch point.
 */
export declare function getPointClientRect(point: EventPoint): Rect;
/**
 * Checks if a pointer/touch point is over an element.
 */
export declare function isPointOverTarget(point: EventPoint, target: Element): boolean;
/**
 * Gets the first touch from a TouchEvent's targetTouches.
 */
export declare function getTouchFromEvent(event: TouchEvent): Touch | null;
/**
 * Finds a touch by its identifier in changedTouches.
 */
export declare function getTouchById(event: TouchEvent, pointerId: number | null): Touch | null;
//# sourceMappingURL=geometry.d.ts.map