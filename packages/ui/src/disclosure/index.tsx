/**
 * Disclosure and Accordion components for proyecto-viviana-ui
 *
 * Styled disclosure/accordion components built on top of solidaria-components.
 * Inspired by Spectrum 2's disclosure patterns.
 */

import { type JSX, splitProps, createContext, useContext, Show } from 'solid-js';
import {
  Disclosure as HeadlessDisclosure,
  DisclosureGroup as HeadlessDisclosureGroup,
  DisclosureTrigger as HeadlessDisclosureTrigger,
  DisclosurePanel as HeadlessDisclosurePanel,
  type DisclosureProps as HeadlessDisclosureProps,
  type DisclosureGroupProps as HeadlessDisclosureGroupProps,
  type DisclosureTriggerProps as HeadlessDisclosureTriggerProps,
  type DisclosurePanelProps as HeadlessDisclosurePanelProps,
  type DisclosureRenderProps,
  type DisclosureGroupRenderProps,
} from '@proyecto-viviana/solidaria-components';

// ============================================
// SIZE AND VARIANT CONTEXT
// ============================================

export type DisclosureSize = 'sm' | 'md' | 'lg';
export type DisclosureVariant = 'default' | 'bordered' | 'filled' | 'ghost';

interface DisclosureContextValue {
  size: DisclosureSize;
  variant: DisclosureVariant;
}

const DisclosureSizeContext = createContext<DisclosureContextValue>({
  size: 'md',
  variant: 'default',
});

// ============================================
// TYPES
// ============================================

export interface DisclosureGroupProps extends Omit<HeadlessDisclosureGroupProps, 'class' | 'style'> {
  /** The size of all disclosures in the group. */
  size?: DisclosureSize;
  /** The visual variant of all disclosures in the group. */
  variant?: DisclosureVariant;
  /** Additional CSS class name. */
  class?: string;
}

export interface DisclosureProps extends Omit<HeadlessDisclosureProps, 'class' | 'style'> {
  /** The size of the disclosure. Overrides group size if set. */
  size?: DisclosureSize;
  /** The visual variant. Overrides group variant if set. */
  variant?: DisclosureVariant;
  /** Additional CSS class name. */
  class?: string;
}

export interface DisclosureTriggerProps extends Omit<HeadlessDisclosureTriggerProps, 'class' | 'style'> {
  /** Additional CSS class name. */
  class?: string;
  /** Optional icon to show (defaults to chevron). */
  hideIcon?: boolean;
}

export interface DisclosurePanelProps extends Omit<HeadlessDisclosurePanelProps, 'class' | 'style'> {
  /** Additional CSS class name. */
  class?: string;
}

// ============================================
// STYLES
// ============================================

const sizeStyles = {
  sm: {
    trigger: 'px-3 py-2 text-sm',
    panel: 'px-3 py-2 text-sm',
    icon: 'w-4 h-4',
    gap: 'gap-1',
  },
  md: {
    trigger: 'px-4 py-3 text-base',
    panel: 'px-4 py-3 text-base',
    icon: 'w-5 h-5',
    gap: 'gap-2',
  },
  lg: {
    trigger: 'px-5 py-4 text-lg',
    panel: 'px-5 py-4 text-lg',
    icon: 'w-6 h-6',
    gap: 'gap-3',
  },
};

const variantStyles = {
  default: {
    container: 'border-b border-primary-700',
    trigger: {
      base: 'w-full flex items-center justify-between text-left transition-colors duration-200',
      default: 'text-primary-200 hover:text-primary-100 hover:bg-bg-400/50',
      disabled: 'text-primary-500 cursor-not-allowed',
    },
    panel: 'text-primary-300',
  },
  bordered: {
    container: 'border border-primary-600 rounded-lg mb-2 overflow-hidden',
    trigger: {
      base: 'w-full flex items-center justify-between text-left transition-colors duration-200',
      default: 'text-primary-200 hover:bg-bg-400/50',
      disabled: 'text-primary-500 cursor-not-allowed',
    },
    panel: 'text-primary-300 border-t border-primary-600',
  },
  filled: {
    container: 'bg-bg-400 rounded-lg mb-2 overflow-hidden',
    trigger: {
      base: 'w-full flex items-center justify-between text-left transition-colors duration-200',
      default: 'text-primary-200 hover:bg-bg-300',
      disabled: 'text-primary-500 cursor-not-allowed',
    },
    panel: 'text-primary-300 bg-bg-300/50',
  },
  ghost: {
    container: '',
    trigger: {
      base: 'w-full flex items-center justify-between text-left transition-colors duration-200 rounded-md',
      default: 'text-primary-200 hover:bg-bg-400/50',
      disabled: 'text-primary-500 cursor-not-allowed',
    },
    panel: 'text-primary-300',
  },
};

// ============================================
// DISCLOSURE GROUP COMPONENT
// ============================================

/**
 * DisclosureGroup manages a group of Disclosure components.
 * Use this to create an accordion where only one item can be expanded at a time.
 *
 * @example
 * ```tsx
 * <DisclosureGroup>
 *   <Disclosure id="item1">
 *     <DisclosureTrigger>Section 1</DisclosureTrigger>
 *     <DisclosurePanel>Content 1</DisclosurePanel>
 *   </Disclosure>
 *   <Disclosure id="item2">
 *     <DisclosureTrigger>Section 2</DisclosureTrigger>
 *     <DisclosurePanel>Content 2</DisclosurePanel>
 *   </Disclosure>
 * </DisclosureGroup>
 * ```
 */
export function DisclosureGroup(props: DisclosureGroupProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, [
    'size',
    'variant',
    'class',
    'children',
  ]);

  const size = local.size ?? 'md';
  const variant = local.variant ?? 'default';
  const customClass = local.class ?? '';

  const getClassName = (_renderProps: DisclosureGroupRenderProps): string => {
    const base = 'flex flex-col';
    const gapClass = sizeStyles[size].gap;
    return [base, gapClass, customClass].filter(Boolean).join(' ');
  };

  return (
    <DisclosureSizeContext.Provider value={{ size, variant }}>
      <HeadlessDisclosureGroup
        {...headlessProps}
        class={getClassName}
        children={local.children}
      />
    </DisclosureSizeContext.Provider>
  );
}

// ============================================
// DISCLOSURE COMPONENT
// ============================================

/**
 * Disclosure is a widget that can be toggled to show or hide content.
 *
 * @example
 * ```tsx
 * <Disclosure>
 *   <DisclosureTrigger>Show more</DisclosureTrigger>
 *   <DisclosurePanel>Hidden content here...</DisclosurePanel>
 * </Disclosure>
 * ```
 */
export function Disclosure(props: DisclosureProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, [
    'size',
    'variant',
    'class',
    'children',
  ]);

  const parentCtx = useContext(DisclosureSizeContext);
  const size = local.size ?? parentCtx.size;
  const variant = local.variant ?? parentCtx.variant;
  const customClass = local.class ?? '';

  const getClassName = (_renderProps: DisclosureRenderProps): string => {
    const variantClass = variantStyles[variant].container;
    return [variantClass, customClass].filter(Boolean).join(' ');
  };

  return (
    <DisclosureSizeContext.Provider value={{ size, variant }}>
      <HeadlessDisclosure
        {...headlessProps}
        class={getClassName}
      >
        {local.children}
      </HeadlessDisclosure>
    </DisclosureSizeContext.Provider>
  );
}

// ============================================
// DISCLOSURE TRIGGER COMPONENT
// ============================================

/**
 * DisclosureTrigger is the button that toggles the disclosure.
 * The chevron rotates based on the data-expanded attribute using Tailwind's group class.
 */
export function DisclosureTrigger(props: DisclosureTriggerProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class', 'children', 'hideIcon']);
  const ctx = useContext(DisclosureSizeContext);
  const customClass = local.class ?? '';

  return (
    <HeadlessDisclosureTrigger
      {...headlessProps}
      class={[
        'group', // Enable Tailwind group selector for chevron rotation
        variantStyles[ctx.variant].trigger.base,
        sizeStyles[ctx.size].trigger,
        customClass,
      ].filter(Boolean).join(' ')}
    >
      {local.children}
      <Show when={!local.hideIcon}>
        <svg
          class={[
            sizeStyles[ctx.size].icon,
            'transition-transform duration-200',
            'group-data-[expanded=true]:rotate-180', // Rotate when expanded
          ].filter(Boolean).join(' ')}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          style={{ "flex-shrink": 0 }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </Show>
    </HeadlessDisclosureTrigger>
  );
}

// ============================================
// DISCLOSURE PANEL COMPONENT
// ============================================

/**
 * DisclosurePanel contains the content that is shown/hidden.
 */
export function DisclosurePanel(props: DisclosurePanelProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class', 'children']);
  const ctx = useContext(DisclosureSizeContext);
  const customClass = local.class ?? '';

  const getClassName = (_renderProps: DisclosureRenderProps): string => {
    const base = variantStyles[ctx.variant].panel;
    const sizeClass = sizeStyles[ctx.size].panel;
    return [base, sizeClass, customClass].filter(Boolean).join(' ');
  };

  return (
    <HeadlessDisclosurePanel
      {...headlessProps}
      class={getClassName}
      children={local.children}
    />
  );
}

// Attach sub-components for convenience
Disclosure.Trigger = DisclosureTrigger;
Disclosure.Panel = DisclosurePanel;
DisclosureGroup.Item = Disclosure;
