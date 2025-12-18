const DOMPropNames = new Set([
  'id',
  'role',
  'tabIndex',
  'style',
  'class',
  'className',
  'title',
  'lang',
  'dir',
  'hidden',
  'draggable',
  'spellcheck',
  'translate',
  'contentEditable',
]);

const DOMEventNames = new Set([
  'onCopy',
  'onCut',
  'onPaste',
  'onCompositionEnd',
  'onCompositionStart',
  'onCompositionUpdate',
  'onKeyDown',
  'onKeyPress',
  'onKeyUp',
  'onFocus',
  'onBlur',
  'onChange',
  'onInput',
  'onSubmit',
  'onClick',
  'onContextMenu',
  'onDoubleClick',
  'onDrag',
  'onDragEnd',
  'onDragEnter',
  'onDragExit',
  'onDragLeave',
  'onDragOver',
  'onDragStart',
  'onDrop',
  'onMouseDown',
  'onMouseEnter',
  'onMouseLeave',
  'onMouseMove',
  'onMouseOut',
  'onMouseOver',
  'onMouseUp',
  'onPointerDown',
  'onPointerMove',
  'onPointerUp',
  'onPointerCancel',
  'onPointerEnter',
  'onPointerLeave',
  'onPointerOver',
  'onPointerOut',
  'onTouchCancel',
  'onTouchEnd',
  'onTouchMove',
  'onTouchStart',
  'onScroll',
  'onWheel',
  'onAnimationStart',
  'onAnimationEnd',
  'onAnimationIteration',
  'onTransitionEnd',
]);

export interface FilterDOMPropsOptions {
  labelable?: boolean;
  propNames?: Set<string>;
}

const labelablePropNames = new Set([
  'aria-label',
  'aria-labelledby',
  'aria-describedby',
  'aria-details',
]);

/**
 * Filters out props that are not valid DOM attributes.
 * Keeps aria-* and data-* attributes.
 */
export function filterDOMProps(
  props: Record<string, unknown>,
  options: FilterDOMPropsOptions = {}
): Record<string, unknown> {
  const { labelable = false, propNames } = options;
  const result: Record<string, unknown> = {};

  for (const key in props) {
    if (
      DOMPropNames.has(key) ||
      DOMEventNames.has(key) ||
      key.startsWith('aria-') ||
      key.startsWith('data-') ||
      propNames?.has(key) ||
      (labelable && labelablePropNames.has(key))
    ) {
      result[key] = props[key];
    }
  }

  return result;
}
