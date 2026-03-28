/**
 * Theme Dark module for proyecto-viviana-silapse
 *
 * Dark theme CSS custom properties using the unified --color-* naming
 * that matches the Tailwind @theme tokens in theme.css.
 * Apply via Provider with colorScheme="dark".
 */

import type { Theme } from '../theme/types';

export const themeDarkClass = 'vui-theme-dark';

export const darkTheme: Theme = {
  className: themeDarkClass,
  properties: {
    // Backgrounds
    '--color-bg-100': '#404040',
    '--color-bg-200': '#252525',
    '--color-bg-300': '#1a1a1a',
    '--color-bg-400': '#111111',
    '--color-bg-light': '#515151',

    // Surfaces
    '--color-background': '#000000',
    '--color-surface': '#0a0a0a',
    '--color-surface-elevated': '#111111',

    // Text
    '--color-text': '#ffffff',
    '--color-text-secondary': '#a0a0a0',
    '--color-text-muted': '#606060',
    '--color-text-disabled': '#404040',
    '--color-on-color': '#ffffff',

    // Accent
    '--color-accent': '#DF5C9A',
    '--color-accent-highlight': '#e2a2be',

    // Primary
    '--color-primary': '#75ABC7',

    // Border
    '--color-border': '#1a1a1a',
    '--color-border-muted': '#141414',
    '--color-divider': '#141414',

    // Status
    '--color-success': '#3fb950',
    '--color-success-dim': '#238636',
    '--color-warning': '#d29922',
    '--color-warning-dim': '#966a13',
    '--color-danger': '#f85149',
    '--color-danger-dim': '#da3633',

    // Dim
    '--color-primary-dim': '#1a3040',
    '--color-accent-dim': '#301520',

    // Header
    '--color-header-bg': '#181818',

    // Cards
    '--color-cards-bg': '#373737',
    '--color-cards-bg-load': '#484848',
  },
};

export const theme = darkTheme;
