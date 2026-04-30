import type { Key } from "@proyecto-viviana/solid-stately";

export interface InvalidationContext<O = unknown> {
  contentChanged?: boolean;
  offsetChanged?: boolean;
  sizeChanged?: boolean;
  itemSizeChanged?: boolean;
  layoutOptionsChanged?: boolean;
  layoutOptions?: O;
}

export class Point {
  constructor(
    public x = 0,
    public y = 0,
  ) {}
  copy(): Point {
    return new Point(this.x, this.y);
  }
  equals(point: Point): boolean {
    return this.x === point.x && this.y === point.y;
  }
  isOrigin(): boolean {
    return this.x === 0 && this.y === 0;
  }
}

export class Size {
  width: number;
  height: number;

  constructor(width = 0, height = 0) {
    this.width = Math.max(0, width);
    this.height = Math.max(0, height);
  }

  copy(): Size {
    return new Size(this.width, this.height);
  }

  equals(other: Size): boolean {
    return this.width === other.width && this.height === other.height;
  }

  get area(): number {
    return this.width * this.height;
  }
}

export class Rect {
  constructor(
    public x = 0,
    public y = 0,
    public width = 0,
    public height = 0,
  ) {}

  get maxX(): number {
    return this.x + this.width;
  }

  get maxY(): number {
    return this.y + this.height;
  }

  get area(): number {
    return this.width * this.height;
  }

  get topLeft(): Point {
    return new Point(this.x, this.y);
  }

  get topRight(): Point {
    return new Point(this.maxX, this.y);
  }

  get bottomLeft(): Point {
    return new Point(this.x, this.maxY);
  }

  get bottomRight(): Point {
    return new Point(this.maxX, this.maxY);
  }

  intersects(rect: Rect): boolean {
    return this.x <= rect.maxX && rect.x <= this.maxX && this.y <= rect.maxY && rect.y <= this.maxY;
  }

  containsRect(rect: Rect): boolean {
    return this.x <= rect.x && this.y <= rect.y && this.maxX >= rect.maxX && this.maxY >= rect.maxY;
  }

  containsPoint(point: Point): boolean {
    return this.x <= point.x && this.y <= point.y && this.maxX >= point.x && this.maxY >= point.y;
  }

  union(other: Rect): Rect {
    const x = Math.min(this.x, other.x);
    const y = Math.min(this.y, other.y);
    const width = Math.max(this.maxX, other.maxX) - x;
    const height = Math.max(this.maxY, other.maxY) - y;
    return new Rect(x, y, width, height);
  }

  intersection(other: Rect): Rect {
    if (!this.intersects(other)) {
      return new Rect(0, 0, 0, 0);
    }
    const x = Math.max(this.x, other.x);
    const y = Math.max(this.y, other.y);
    const width = Math.min(this.maxX, other.maxX) - x;
    const height = Math.min(this.maxY, other.maxY) - y;
    return new Rect(x, y, width, height);
  }

  copy(): Rect {
    return new Rect(this.x, this.y, this.width, this.height);
  }

  equals(rect: Rect): boolean {
    return (
      this.x === rect.x &&
      this.y === rect.y &&
      this.width === rect.width &&
      this.height === rect.height
    );
  }
}

export class LayoutInfo {
  parentKey: Key | null = null;
  content: unknown = null;
  estimatedSize = false;
  isSticky = false;
  opacity = 1;
  transform: string | null = null;
  zIndex = 0;
  allowOverflow = false;

  constructor(
    public type: string,
    public key: Key,
    public rect: Rect,
  ) {}

  copy(): LayoutInfo {
    const copy = new LayoutInfo(this.type, this.key, this.rect.copy());
    copy.parentKey = this.parentKey;
    copy.content = this.content;
    copy.estimatedSize = this.estimatedSize;
    copy.isSticky = this.isSticky;
    copy.opacity = this.opacity;
    copy.transform = this.transform;
    copy.zIndex = this.zIndex;
    copy.allowOverflow = this.allowOverflow;
    return copy;
  }
}

interface VirtualizerLike {
  visibleRect: Rect;
}

export abstract class Layout<T extends object = object, O = unknown> {
  virtualizer: VirtualizerLike | null = null;

  abstract getVisibleLayoutInfos(rect: Rect): LayoutInfo[];
  abstract getLayoutInfo(key: Key): LayoutInfo | null;
  abstract getContentSize(): Size;

  shouldInvalidate(newRect: Rect, oldRect: Rect): boolean {
    return newRect.width !== oldRect.width || newRect.height !== oldRect.height;
  }

  shouldInvalidateLayoutOptions(newOptions: O, oldOptions: O): boolean {
    return newOptions !== oldOptions;
  }

  update(_context: InvalidationContext<O>): void {}

  updateItemSize?(_key: Key, _size: Size): boolean;
  getDropTargetLayoutInfo?(_target: unknown): LayoutInfo | null;

  protected getItemRect(key: Key): Rect | null {
    return this.getLayoutInfo(key)?.rect ?? null;
  }

  getVisibleRect(): Rect {
    return this.virtualizer?.visibleRect ?? new Rect();
  }
}
