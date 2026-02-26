/**
 * Theme Dark module for proyecto-viviana-silapse
 *
 * Dark mode CSS custom properties. Apply the class to the root element
 * or use the Provider component with colorScheme="dark".
 */

import type { Theme } from '../theme/types';

export const themeDarkClass = 'vui-theme-dark';

export const darkTheme: Theme = {
  className: themeDarkClass,
  properties: {
    // Backgrounds
    '--vui-bg-100': '#0a0a0a',
    '--vui-bg-200': '#141414',
    '--vui-bg-300': '#1e1e1e',
    '--vui-bg-400': '#282828',
    '--vui-bg-500': '#333333',

    // Text / Primary
    '--vui-text-primary': '#f5f5f5',
    '--vui-text-secondary': '#a3a3a3',
    '--vui-text-tertiary': '#737373',
    '--vui-text-disabled': '#525252',

    // Accent
    '--vui-accent': '#818cf8',
    '--vui-accent-hover': '#a5b4fc',
    '--vui-accent-active': '#6366f1',
    '--vui-accent-subtle': 'rgba(129, 140, 248, 0.15)',

    // Border
    '--vui-border': '#374151',
    '--vui-border-hover': '#4b5563',
    '--vui-border-focus': '#818cf8',

    // Focus
    '--vui-focus-ring': 'rgba(129, 140, 248, 0.5)',

    // Status: Error/Danger
    '--vui-danger': '#f87171',
    '--vui-danger-subtle': 'rgba(248, 113, 113, 0.15)',

    // Status: Success
    '--vui-success': '#4ade80',
    '--vui-success-subtle': 'rgba(74, 222, 128, 0.15)',

    // Status: Warning
    '--vui-warning': '#fbbf24',
    '--vui-warning-subtle': 'rgba(251, 191, 36, 0.15)',

    // Status: Info
    '--vui-info': '#60a5fa',
    '--vui-info-subtle': 'rgba(96, 165, 250, 0.15)',

    // Overlay
    '--vui-overlay-bg': 'rgba(0, 0, 0, 0.6)',
    '--vui-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3)',
    '--vui-shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3)',
  },
};
