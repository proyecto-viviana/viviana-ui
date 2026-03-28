/**
 * Theme Light module for proyecto-viviana-silapse
 *
 * Light theme CSS custom properties using the unified --color-* naming
 * that matches the Tailwind @theme tokens in theme.css.
 * Apply via Provider with colorScheme="light".
 */

import type { Theme } from '../theme/types';

export const themeLightClass = 'vui-theme-light';

export const lightTheme: Theme = {
  className: themeLightClass,
  properties: {
    // Backgrounds
    '--color-bg-100': '#7096a8',
    '--color-bg-200': '#a8c5d4',
    '--color-bg-300': '#c8dce6',
    '--color-bg-400': '#dbe8ef',
    '--color-bg-light': '#ffffff',

    // Surfaces
    '--color-background': '#f2f7fa',
    '--color-surface': '#ffffff',
    '--color-surface-elevated': '#e6f0f5',

    // Text
    '--color-text': '#1a3040',
    '--color-text-secondary': '#405d70',
    '--color-text-muted': '#7096a8',
    '--color-text-disabled': '#a8c5d4',
    '--color-on-color': '#ffffff',

    // Accent
    '--color-accent': '#DF5C9A',
    '--color-accent-highlight': '#d4508a',

    // Primary
    '--color-primary': '#75ABC7',

    // Border
    '--color-border': '#c8dce6',
    '--color-border-muted': '#dbe8ef',
    '--color-divider': '#dbe8ef',

    // Status
    '--color-success': '#5BC96E',
    '--color-success-dim': '#559D87',
    '--color-warning': '#E5C462',
    '--color-warning-dim': '#9D8D55',
    '--color-danger': '#E56767',
    '--color-danger-dim': '#9D5555',

    // Dim
    '--color-primary-dim': '#b6d9eb',
    '--color-accent-dim': '#fcc7e0',

    // Header
    '--color-header-bg': '#d0e4ed',

    // Cards
    '--color-cards-bg': '#ecf2f5',
    '--color-cards-bg-load': '#dfeaef',
  },
};

export const theme = lightTheme;
