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
export function areRectanglesOverlapping(a: Rect, b: Rect): boolean {
  // Check if one rectangle is to the left of the other
  if (a.left > b.right || b.left > a.right) {
    return false;
  }

  // Check if one rectangle is above the other
  if (a.top > b.bottom || b.top > a.bottom) {
    return false;
  }

  return true;
}

/**
 * Gets the bounding rectangle for an event point (touch/pointer).
 * Takes into account the size of the touch point.
 */
export function getPointClientRect(point: EventPoint): Rect {
  let offsetX = 0;
  let offsetY = 0;

  // Use width/height if available (PointerEvent)
  if (point.width !== undefined && point.width > 0) {
    offsetX = point.width / 2;
  } else if (point.radiusX !== undefined && point.radiusX > 0) {
    // Fallback to radiusX/radiusY (Touch)
    offsetX = point.radiusX;
  }

  if (point.height !== undefined && point.height > 0) {
    offsetY = point.height / 2;
  } else if (point.radiusY !== undefined && point.radiusY > 0) {
    offsetY = point.radiusY;
  }

  return {
    top: point.clientY - offsetY,
    right: point.clientX + offsetX,
    bottom: point.clientY + offsetY,
    left: point.clientX - offsetX,
  };
}

/**
 * Checks if a pointer/touch point is over an element.
 */
export function isPointOverTarget(point: EventPoint, target: Element): boolean {
  const rect = target.getBoundingClientRect();
  const pointRect = getPointClientRect(point);

  return areRectanglesOverlapping(
    {
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
    },
    pointRect,
  );
}

/**
 * Gets the first touch from a TouchEvent's targetTouches.
 */
export function getTouchFromEvent(event: TouchEvent): Touch | null {
  const { targetTouches } = event;
  if (targetTouches.length > 0) {
    return targetTouches[0];
  }
  return null;
}

/**
 * Finds a touch by its identifier in changedTouches.
 */
export function getTouchById(event: TouchEvent, pointerId: number | null): Touch | null {
  if (pointerId == null) {
    return null;
  }

  const { changedTouches } = event;
  for (let i = 0; i < changedTouches.length; i++) {
    const touch = changedTouches[i];
    if (touch.identifier === pointerId) {
      return touch;
    }
  }

  return null;
}
