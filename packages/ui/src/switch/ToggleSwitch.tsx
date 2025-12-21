/**
 * ToggleSwitch component for proyecto-viviana-ui
 *
 * A styled switch component built on top of solidaria-components.
 * This component only handles styling - all behavior and accessibility
 * is provided by the headless Switch from solidaria-components.
 *
 * Named "ToggleSwitch" to avoid conflict with SolidJS's built-in Switch component.
 */

import { type JSX, splitProps, mergeProps as solidMergeProps } from 'solid-js';
import { ToggleSwitch as HeadlessToggleSwitch, type ToggleSwitchProps as HeadlessToggleSwitchProps, type ToggleSwitchRenderProps } from '@proyecto-viviana/solidaria-components';

// ============================================
// TYPES
// ============================================

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface ToggleSwitchProps extends Omit<HeadlessToggleSwitchProps, 'class' | 'children'> {
  /** The size of the switch. */
  size?: SwitchSize;
  /** Additional CSS class name. */
  class?: string;
  /** Label text for the switch. */
  children?: JSX.Element;
}

// ============================================
// STYLES
// ============================================

const sizeStyles = {
  sm: {
    track: 'h-5 w-9',
    thumb: 'h-4 w-4',
    translate: 'translate-x-4',
  },
  md: {
    track: 'h-6 w-11',
    thumb: 'h-5 w-5',
    translate: 'translate-x-5',
  },
  lg: {
    track: 'h-7 w-14',
    thumb: 'h-6 w-6',
    translate: 'translate-x-7',
  },
};

// ============================================
// COMPONENT
// ============================================

/**
 * A switch allows users to toggle between two mutually exclusive states.
 *
 * Built on solidaria-components Switch for full accessibility support.
 * Named "ToggleSwitch" to avoid conflict with SolidJS's built-in Switch component.
 */
export function ToggleSwitch(props: ToggleSwitchProps): JSX.Element {
  const defaultProps: Partial<ToggleSwitchProps> = {
    size: 'md',
  };

  const merged = solidMergeProps(defaultProps, props);

  const [local, headlessProps] = splitProps(merged, [
    'size',
    'class',
    'children',
  ]);

  const size = () => sizeStyles[local.size!];

  // Generate class based on render props
  const getClassName = (renderProps: ToggleSwitchRenderProps): string => {
    const base = 'inline-flex items-center gap-2 cursor-pointer';
    const disabledClass = renderProps.isDisabled ? 'cursor-not-allowed opacity-50' : '';
    const custom = local.class || '';
    return [base, disabledClass, custom].filter(Boolean).join(' ');
  };

  return (
    <HeadlessToggleSwitch
      {...headlessProps}
      class={getClassName}
    >
      {(renderProps) => (
        <>
          <span
            class={[
              'relative rounded-full transition-colors duration-200',
              'focus-within:ring-2 focus-within:ring-accent-300 focus-within:ring-offset-2 focus-within:ring-offset-bg-400',
              size().track,
              renderProps.isSelected ? 'bg-accent' : 'bg-bg-300',
              renderProps.isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
            ].join(' ')}
          >
            <span
              class={[
                'absolute top-0.5 left-0.5 rounded-full bg-white shadow transition-transform duration-200',
                size().thumb,
                renderProps.isSelected ? size().translate : 'translate-x-0',
              ].join(' ')}
            />
          </span>
          {local.children && <span class="text-primary-200">{local.children}</span>}
        </>
      )}
    </HeadlessToggleSwitch>
  );
}
