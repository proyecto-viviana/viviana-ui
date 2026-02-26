/**
 * SharedElementTransition primitives for solidaria-components.
 *
 * Provides a scope for SharedElement instances and basic enter/exit state.
 * Parity target: react-aria-components/src/SharedElementTransition.tsx
 */

import {
  type JSX,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  splitProps,
  useContext,
  Show,
} from 'solid-js';
import {
  type ClassNameOrFunction,
  type StyleOrFunction,
  type RenderChildren,
  useRenderProps,
  filterDOMProps,
} from './utils';

type SharedElementLifecycle = 'hidden' | 'entering' | 'visible' | 'exiting';

interface SharedElementScope {
  names: Set<string>;
}

const SharedElementContext = createContext<SharedElementScope | null>(null);

export function useHasSharedElementTransitionScope(): boolean {
  return useContext(SharedElementContext) != null;
}

export interface SharedElementTransitionProps {
  children?: JSX.Element;
}

/**
 * A scope for SharedElement instances.
 */
export function SharedElementTransition(props: SharedElementTransitionProps): JSX.Element {
  const scope: SharedElementScope = {
    names: new Set<string>(),
  };

  return (
    <SharedElementContext.Provider value={scope}>
      {props.children}
    </SharedElementContext.Provider>
  );
}

export interface SharedElementRenderProps {
  isEntering: boolean;
  isExiting: boolean;
}

export interface SharedElementProps
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children' | 'class' | 'style'> {
  name: string;
  isVisible?: boolean;
  children?: RenderChildren<SharedElementRenderProps>;
  class?: ClassNameOrFunction<SharedElementRenderProps>;
  style?: StyleOrFunction<SharedElementRenderProps>;
}

/**
 * An element that can participate in shared element transition scopes.
 */
export function SharedElement(props: SharedElementProps): JSX.Element | null {
  const scope = useContext(SharedElementContext);
  if (!scope) {
    throw new Error('<SharedElement> must be rendered inside a <SharedElementTransition>');
  }

  const [local, domProps] = splitProps(props, ['name', 'isVisible', 'children', 'class', 'style']);
  const [lifecycle, setLifecycle] = createSignal<SharedElementLifecycle>(
    local.isVisible === false ? 'hidden' : 'visible'
  );

  let frame: number | undefined;

  createEffect(() => {
    const isVisible = local.isVisible !== false;
    const current = lifecycle();

    if (isVisible && current === 'hidden') {
      setLifecycle('entering');
      frame = requestAnimationFrame(() => {
        frame = undefined;
        setLifecycle('visible');
      });
      return;
    }

    if (!isVisible && (current === 'visible' || current === 'entering')) {
      setLifecycle('exiting');
      frame = requestAnimationFrame(() => {
        frame = undefined;
        setLifecycle('hidden');
      });
    }
  });

  createEffect(() => {
    scope.names.add(local.name);
    onCleanup(() => {
      scope.names.delete(local.name);
    });
  });

  onCleanup(() => {
    if (frame != null) {
      cancelAnimationFrame(frame);
    }
  });

  const renderProps = useRenderProps(
    {
      children: local.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-SharedElement',
    },
    () => ({
      isEntering: lifecycle() === 'entering',
      isExiting: lifecycle() === 'exiting',
    })
  );

  const filteredDomProps = createMemo(() => filterDOMProps(domProps, { global: true }));

  return (
    <Show when={lifecycle() !== 'hidden'}>
      <div
        {...filteredDomProps()}
        class={renderProps.class()}
        style={renderProps.style()}
        data-entering={lifecycle() === 'entering' || undefined}
        data-exiting={lifecycle() === 'exiting' || undefined}
      >
        {renderProps.renderChildren()}
      </div>
    </Show>
  );
}
