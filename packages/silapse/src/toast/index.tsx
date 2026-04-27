/**
 * Toast components for proyecto-viviana-silapse
 *
 * Toast notifications with auto-dismiss, animations, and variants.
 * Built on top of solidaria-components for accessibility.
 */

import { type JSX, splitProps, For, Show } from 'solid-js';
import {
  Toast as HeadlessToast,
  ToastRegion as HeadlessToastRegion,
  ToastProvider as HeadlessToastProvider,
  ToastContext,
  ToastTitle as HeadlessToastTitle,
  ToastDescription as HeadlessToastDescription,
  ToastCloseButton as HeadlessToastCloseButton,
  globalToastQueue,
  addToast as headlessAddToast,
  useToastContext,
  type ToastContent,
  type ToastProps as HeadlessToastProps,
  type ToastRegionProps as HeadlessToastRegionProps,
  type ToastProviderProps as HeadlessToastProviderProps,
  type ToastRenderProps,
  type ToastRegionRenderProps,
} from '@proyecto-viviana/solidaria-components';
import { ToastQueue, type QueuedToast, type ToastOptions } from '@proyecto-viviana/solid-stately';

// ============================================
// TYPES
// ============================================

export type ToastPlacement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end';
export type ToastVariant = 'info' | 'success' | 'warning' | 'error' | 'neutral';

export interface ToastProviderProps extends HeadlessToastProviderProps {}

export interface ToastRegionProps extends Omit<HeadlessToastRegionProps, 'class' | 'style' | 'children'> {
  /** The placement of the toast region. */
  placement?: ToastPlacement;
  /** Additional CSS class name. */
  class?: string;
}

export interface ToastProps extends Omit<HeadlessToastProps, 'class' | 'style'> {
  /** Additional CSS class name. */
  class?: string;
}

// ============================================
// STYLES
// ============================================

const regionStyles = [
  'flex flex-col gap-3',
  'p-4',
].join(' ');

const toastBaseStyles = [
  'flex items-start gap-3',
  'px-4 py-3',
  'rounded-lg shadow-lg',
  'min-w-[300px] max-w-[400px]',
  'border',
  // Animations
  'data-[animation=entering]:animate-in data-[animation=entering]:fade-in-0 data-[animation=entering]:slide-in-from-right-5',
  'data-[animation=exiting]:animate-out data-[animation=exiting]:fade-out-0 data-[animation=exiting]:slide-out-to-right-5',
].join(' ');

const variantStyles: Record<ToastVariant, string> = {
  info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200',
  success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-200',
  error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200',
  neutral: 'bg-neutral-50 border-neutral-200 text-neutral-800 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200',
};

const iconStyles: Record<ToastVariant, string> = {
  info: 'text-blue-500 dark:text-blue-400',
  success: 'text-green-500 dark:text-green-400',
  warning: 'text-yellow-500 dark:text-yellow-400',
  error: 'text-red-500 dark:text-red-400',
  neutral: 'text-neutral-500 dark:text-neutral-400',
};

const closeButtonStyles = [
  'ml-auto -mr-1 -mt-1',
  'p-1 rounded-md',
  'text-current opacity-60 hover:opacity-100',
  'transition-opacity',
  'focus:outline-none focus:ring-2 focus:ring-offset-2',
].join(' ');

// ============================================
// ICONS
// ============================================

const InfoIcon = () => (
  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SuccessIcon = () => (
  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const WarningIcon = () => (
  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const ErrorIcon = () => (
  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CloseIcon = () => (
  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const getVariantIcon = (variant: ToastVariant) => {
  switch (variant) {
    case 'success': return <SuccessIcon />;
    case 'warning': return <WarningIcon />;
    case 'error': return <ErrorIcon />;
    case 'info':
    case 'neutral':
    default: return <InfoIcon />;
  }
};

// ============================================
// COMPONENTS
// ============================================

/**
 * ToastProvider creates a toast queue context for descendant components.
 * Wrap your app or a section that needs toast notifications.
 *
 * @example
 * ```tsx
 * <ToastProvider>
 *   <App />
 *   <ToastRegion placement="bottom-end" />
 * </ToastProvider>
 * ```
 */
export function ToastProvider(props: ToastProviderProps): JSX.Element {
  return <HeadlessToastProvider {...props} />;
}

/**
 * ToastRegion displays all visible toasts in a fixed position.
 *
 * @example
 * ```tsx
 * <ToastRegion placement="bottom-end" />
 * ```
 */
export function ToastRegion(props: ToastRegionProps): JSX.Element {
  const [local, rest] = splitProps(props, ['placement', 'class']);

  return (
    <HeadlessToastRegion
      {...rest}
      placement={local.placement ?? 'bottom-end'}
      class={(_renderProps: ToastRegionRenderProps) => {
        return [regionStyles, local.class ?? ''].filter(Boolean).join(' ');
      }}
    >
      {(regionProps: ToastRegionRenderProps) => (
        <For each={regionProps.visibleToasts()}>
          {(toast) => <Toast toast={toast} />}
        </For>
      )}
    </HeadlessToastRegion>
  );
}

export const ToastContainer = ToastRegion;

/**
 * Toast displays an individual notification with icon, content, and close button.
 *
 * Usually you don't need to use this directly - ToastRegion renders toasts automatically.
 */
export function Toast(props: ToastProps): JSX.Element {
  const [local, rest] = splitProps(props, ['toast', 'class']);

  const content = () => local.toast.content;
  const variant = (): ToastVariant => content().type ?? 'neutral';

  return (
    <HeadlessToast
      {...rest}
      toast={local.toast}
      class={(_renderProps: ToastRenderProps) => {
        return [
          toastBaseStyles,
          variantStyles[variant()],
          local.class ?? '',
        ].filter(Boolean).join(' ');
      }}
    >
      {/* Icon */}
      <div class={`flex-shrink-0 ${iconStyles[variant()]}`}>
        {getVariantIcon(variant())}
      </div>

      {/* Content */}
      <div class="flex-1 min-w-0">
        <Show when={content().title}>
          <HeadlessToastTitle class="font-semibold text-sm">{content().title}</HeadlessToastTitle>
        </Show>
        <Show when={content().description}>
          <HeadlessToastDescription class="text-sm opacity-90 mt-1">
            {content().description}
          </HeadlessToastDescription>
        </Show>
        <Show when={content().action}>
          <button
            type="button"
            class="mt-2 text-sm font-medium underline hover:no-underline"
            onClick={content().action?.onAction}
          >
            {content().action?.label}
          </button>
        </Show>
      </div>

      {/* Close Button */}
      <HeadlessToastCloseButton
        toast={local.toast}
        class={closeButtonStyles}
        aria-label="Dismiss"
      >
        <CloseIcon />
      </HeadlessToastCloseButton>
    </HeadlessToast>
  );
}

// ============================================
// GLOBAL TOAST API
// ============================================

/**
 * Add a toast to the global queue.
 * Use this to show toasts from anywhere in your app.
 *
 * @example
 * ```tsx
 * // Show a success toast
 * addToast({
 *   title: 'Success!',
 *   description: 'Your changes have been saved.',
 *   type: 'success',
 * });
 *
 * // Show an error toast with auto-dismiss
 * addToast({
 *   title: 'Error',
 *   description: 'Something went wrong.',
 *   type: 'error',
 * }, { timeout: 5000 });
 *
 * // Show a toast with action
 * addToast({
 *   title: 'File deleted',
 *   type: 'info',
 *   action: {
 *     label: 'Undo',
 *     onAction: () => restoreFile(),
 *   },
 * }, { timeout: 10000 });
 * ```
 */
export function addToast(
  content: ToastContent,
  options?: ToastOptions
): string {
  return headlessAddToast(content, options);
}

/**
 * Convenience function to show a success toast.
 */
export function toastSuccess(message: string, options?: Omit<ToastOptions, 'priority'>): string {
  return addToast({ title: message, type: 'success' }, { timeout: 5000, ...options });
}

/**
 * Convenience function to show an error toast.
 */
export function toastError(message: string, options?: Omit<ToastOptions, 'priority'>): string {
  return addToast({ title: message, type: 'error' }, { timeout: 8000, ...options });
}

/**
 * Convenience function to show a warning toast.
 */
export function toastWarning(message: string, options?: Omit<ToastOptions, 'priority'>): string {
  return addToast({ title: message, type: 'warning' }, { timeout: 6000, ...options });
}

/**
 * Convenience function to show an info toast.
 */
export function toastInfo(message: string, options?: Omit<ToastOptions, 'priority'>): string {
  return addToast({ title: message, type: 'info' }, { timeout: 5000, ...options });
}

// Re-exports
export {
  ToastContext,
  globalToastQueue,
  ToastQueue,
  useToastContext,
  type ToastContent,
  type ToastRenderProps,
  type ToastRegionRenderProps,
  type QueuedToast,
  type ToastOptions,
};
