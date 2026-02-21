/**
 * Landmark component for proyecto-viviana-ui
 *
 * Styled landmark component built on top of solidaria-components.
 * Landmarks help screen reader users navigate between major sections of a page.
 * Press F6 to cycle through landmarks, or Shift+F6 to go backwards.
 */

import { type JSX, splitProps, Show } from 'solid-js'
import {
  Landmark as HeadlessLandmark,
  useLandmarkController,
  type LandmarkProps as HeadlessLandmarkProps,
  type AriaLandmarkRole,
  type LandmarkController,
} from '@proyecto-viviana/solidaria-components'

// ============================================
// TYPES
// ============================================

export interface LandmarkProps extends Omit<HeadlessLandmarkProps, 'class' | 'style'> {
  /** Additional CSS class name. */
  class?: string
  /** Whether to show a visual indicator (for development). */
  showLabel?: boolean
}

export type { AriaLandmarkRole, LandmarkController }

// ============================================
// STYLES
// ============================================

const roleLabels: Record<AriaLandmarkRole, string> = {
  main: 'Main',
  navigation: 'Navigation',
  search: 'Search',
  banner: 'Banner',
  contentinfo: 'Footer',
  complementary: 'Aside',
  form: 'Form',
  region: 'Region',
}

const roleColors: Record<AriaLandmarkRole, string> = {
  main: 'bg-accent/10 border-accent-300',
  navigation: 'bg-primary-500/10 border-primary-400',
  search: 'bg-warning-400/10 border-warning-400',
  banner: 'bg-success-400/10 border-success-400',
  contentinfo: 'bg-danger-400/10 border-danger-400',
  complementary: 'bg-primary-300/10 border-primary-300',
  form: 'bg-accent-200/10 border-accent-200',
  region: 'bg-bg-200/50 border-bg-300',
}

// ============================================
// LANDMARK COMPONENT
// ============================================

/**
 * A landmark is a region of the page that helps screen reader users navigate.
 * Press F6 to cycle through landmarks, or Shift+F6 to go backwards.
 *
 * @example
 * ```tsx
 * // Main content area
 * <Landmark role="main" aria-label="Main content">
 *   <h1>Welcome</h1>
 *   <p>Page content here...</p>
 * </Landmark>
 *
 * // Navigation
 * <Landmark role="navigation" aria-label="Primary navigation">
 *   <nav>...</nav>
 * </Landmark>
 *
 * // With development label visible
 * <Landmark role="main" aria-label="Main content" showLabel>
 *   ...
 * </Landmark>
 * ```
 */
export function Landmark(props: LandmarkProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['class', 'showLabel'])
  const customClass = local.class ?? ''

  const role = () => headlessProps.role

  const getClassName = (): string => {
    const base = 'relative'
    const debugClass = local.showLabel
      ? `border-2 border-dashed ${roleColors[role()]}`
      : ''
    return [base, debugClass, customClass].filter(Boolean).join(' ')
  }

  return (
    <HeadlessLandmark {...headlessProps} class={getClassName()}>
      <Show when={local.showLabel}>
        <div
          class={`absolute -top-3 left-2 px-2 py-0.5 text-xs font-medium rounded ${roleColors[role()]} text-primary-200`}
        >
          {roleLabels[role()]}
          <Show when={headlessProps['aria-label']}>
            <span class="text-primary-400"> - {headlessProps['aria-label']}</span>
          </Show>
        </div>
      </Show>
      {props.children}
    </HeadlessLandmark>
  )
}

// ============================================
// SKIP LINK COMPONENT
// ============================================

export interface SkipLinkProps {
  /** The ID of the element to skip to (usually the main landmark). */
  href: string
  /** The text to display in the skip link. */
  children?: JSX.Element
  /** Additional CSS class name. */
  class?: string
}

/**
 * A skip link allows keyboard users to bypass repetitive navigation and jump directly to main content.
 * The link is visually hidden until focused.
 *
 * @example
 * ```tsx
 * <SkipLink href="#main-content">Skip to main content</SkipLink>
 *
 * <Landmark role="navigation">...</Landmark>
 *
 * <Landmark role="main" id="main-content">
 *   ...
 * </Landmark>
 * ```
 */
export function SkipLink(props: SkipLinkProps): JSX.Element {
  const customClass = props.class ?? ''

  const className = [
    // Visually hidden by default
    'absolute left-0 top-0 -translate-y-full',
    // Show when focused
    'focus:translate-y-0',
    // Styling
    'z-50 px-4 py-2 bg-accent text-bg-400 font-medium rounded-br-lg',
    'transition-transform duration-200',
    'focus:outline-none focus:ring-2 focus:ring-accent-300 focus:ring-offset-2',
    customClass,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <a href={props.href} class={className}>
      {props.children ?? 'Skip to main content'}
    </a>
  )
}

// ============================================
// LANDMARK NAVIGATOR COMPONENT
// ============================================

export interface LandmarkNavigatorProps {
  /** Additional CSS class name. */
  class?: string
  /** Whether to show the navigator (for development/accessibility testing). */
  isVisible?: boolean
}

/**
 * A floating navigator for landmarks, useful for development and accessibility testing.
 * Provides buttons to navigate between landmarks programmatically.
 *
 * @example
 * ```tsx
 * // Show in development only
 * <LandmarkNavigator isVisible={import.meta.env.DEV} />
 * ```
 */
export function LandmarkNavigator(props: LandmarkNavigatorProps): JSX.Element {
  const controller = useLandmarkController()

  return (
    <Show when={props.isVisible}>
      <div
        class={`fixed bottom-4 right-4 z-50 flex flex-col gap-2 p-3 bg-bg-400 border border-bg-300 rounded-lg shadow-lg ${props.class ?? ''}`}
      >
        <span class="text-xs font-medium text-primary-400 uppercase tracking-wider">
          Landmarks (F6)
        </span>
        <div class="flex gap-1">
          <button
            type="button"
            onClick={() => controller.focusPrevious()}
            class="px-2 py-1 text-sm bg-bg-300 hover:bg-bg-200 text-primary-200 rounded transition-colors"
            title="Previous landmark (Shift+F6)"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => controller.focusMain()}
            class="px-3 py-1 text-sm bg-accent hover:bg-accent-200 text-white rounded transition-colors"
            title="Go to main content"
          >
            Main
          </button>
          <button
            type="button"
            onClick={() => controller.focusNext()}
            class="px-2 py-1 text-sm bg-bg-300 hover:bg-bg-200 text-primary-200 rounded transition-colors"
            title="Next landmark (F6)"
          >
            →
          </button>
        </div>
      </div>
    </Show>
  )
}

// Export controller hook for convenience
export { useLandmarkController }
