import h from "solid-js/h";

type ComponentLike = string | ((props: never) => unknown);
type Props = Record<string, unknown>;
type Child = unknown;
type Children = readonly Child[];
type MarkedRenderProp<T> = ((item: T) => unknown) & {
  readonly __comparisonRenderProp: true;
};
const RENDER_PROP_MARKER = "__comparisonRenderProp";

/**
 * Comparison-app wrapper around `solid-js/h`.
 *
 * For Solid components, pass child thunks as arrays. A zero-argument function
 * child is ambiguous in `solid-js/h`: it can look like a render prop while also
 * being a normal child accessor, which can leave context/state readers stale.
 */
export function hc(
  component: ComponentLike,
  props?: Props | null,
  children?: Children | MarkedRenderProp<any>,
) {
  if (typeof children === "function") {
    if (children[RENDER_PROP_MARKER] === true) {
      return h(component as never, props ?? {}, children);
    }

    throw new TypeError("Use child arrays, or renderProp(fn) for intentional render props.");
  }

  return children === undefined
    ? h(component as never, props ?? {})
    : h(component as never, props ?? {}, [...children]);
}

export function renderProp<T>(fn: (item: T) => unknown) {
  Object.defineProperty(fn, RENDER_PROP_MARKER, {
    value: true,
    enumerable: false,
  });
  return fn as MarkedRenderProp<T>;
}
