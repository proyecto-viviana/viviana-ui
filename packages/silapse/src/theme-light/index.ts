/**
 * Theme Light module for proyecto-viviana-silapse
 *
 * Light theme CSS custom properties. Apply the class to the root element
 * or use the Provider component with colorScheme="light".
 */

import type { Theme } from '../theme/types';

export const themeLightClass = 'vui-theme-light';

export const lightTheme: Theme = {
  className: themeLightClass,
  properties: {
    // Backgrounds
    '--vui-bg-100': '#ffffff',
    '--vui-bg-200': '#fafafa',
    '--vui-bg-300': '#f5f5f5',
    '--vui-bg-400': '#eeeeee',
    '--vui-bg-500': '#e0e0e0',

    // Text / Primary
    '--vui-text-primary': '#1a1a1a',
    '--vui-text-secondary': '#666666',
    '--vui-text-tertiary': '#999999',
    '--vui-text-disabled': '#bdbdbd',

    // Accent
    '--vui-accent': '#6366f1',
    '--vui-accent-hover': '#5558e6',
    '--vui-accent-active': '#4f46e5',
    '--vui-accent-subtle': 'rgba(99, 102, 241, 0.1)',

    // Border
    '--vui-border': '#e5e7eb',
    '--vui-border-hover': '#d1d5db',
    '--vui-border-focus': '#6366f1',

    // Focus
    '--vui-focus-ring': 'rgba(99, 102, 241, 0.5)',

    // Status: Error/Danger
    '--vui-danger': '#ef4444',
    '--vui-danger-subtle': 'rgba(239, 68, 68, 0.1)',

    // Status: Success
    '--vui-success': '#22c55e',
    '--vui-success-subtle': 'rgba(34, 197, 94, 0.1)',

    // Status: Warning
    '--vui-warning': '#f59e0b',
    '--vui-warning-subtle': 'rgba(245, 158, 11, 0.1)',

    // Status: Info
    '--vui-info': '#3b82f6',
    '--vui-info-subtle': 'rgba(59, 130, 246, 0.1)',

    // Overlay
    '--vui-overlay-bg': 'rgba(0, 0, 0, 0.4)',
    '--vui-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    '--vui-shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  },
};
