/**
 * Provider component for proyecto-viviana-silapse
 *
 * Compound provider wrapping I18nProvider + theme context.
 * Equivalent to React Spectrum's <Provider> component.
 */

import { type JSX, type ParentProps, createContext, useContext, splitProps } from 'solid-js';
import { I18nProvider } from '@proyecto-viviana/solidaria';
import type { Theme } from '../theme/types';
import { lightTheme } from '../theme-light';
import { darkTheme } from '../theme-dark';

// ============================================
// TYPES
// ============================================

export type ColorScheme = 'light' | 'dark';
export type Scale = 'medium' | 'large';

export interface ThemeContextValue {
  /** The current color scheme. */
  colorScheme: ColorScheme;
  /** The UI scale. */
  scale: Scale;
  /** CSS class name for the active theme. */
  themeClass: string;
  /** The full theme object (if available). */
  theme?: Theme;
}

export interface ProviderProps extends ParentProps {
  /** The locale for i18n. If not provided, uses browser default. */
  locale?: string;
  /** The color scheme. @default 'light' */
  colorScheme?: ColorScheme;
  /** The UI scale. @default 'medium' */
  scale?: Scale;
  /** The theme CSS class (string) or a full Theme object. */
  theme?: string | Theme;
  /** Additional CSS class name for the provider wrapper. */
  class?: string;
  /** Additional inline styles. */
  style?: JSX.CSSProperties;
}

// ============================================
// CONTEXT
// ============================================

const defaultThemeContext: ThemeContextValue = {
  colorScheme: 'light',
  scale: 'medium',
  themeClass: 'vui-theme-light',
  theme: lightTheme,
};

export const ThemeContext = createContext<ThemeContextValue>(defaultThemeContext);

/**
 * Hook to access the current theme context.
 */
export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

// ============================================
// THEME RESOLUTION
// ============================================

function resolveTheme(
  themeInput: string | Theme | undefined,
  colorScheme: ColorScheme
): { className: string; properties: Record<string, string>; themeObj?: Theme } {
  // If a full Theme object is passed, use it directly
  if (themeInput && typeof themeInput === 'object') {
    return {
      className: themeInput.className,
      properties: themeInput.properties,
      themeObj: themeInput,
    };
  }

  // If a string class name is passed, use built-in theme by color scheme
  if (typeof themeInput === 'string') {
    const builtIn = colorScheme === 'dark' ? darkTheme : lightTheme;
    return {
      className: themeInput,
      properties: builtIn.properties,
      themeObj: builtIn,
    };
  }

  // Default: resolve from color scheme
  const resolved = colorScheme === 'dark' ? darkTheme : lightTheme;
  return {
    className: resolved.className,
    properties: resolved.properties,
    themeObj: resolved,
  };
}

// ============================================
// COMPONENT
// ============================================

/**
 * Root provider for proyecto-viviana UI.
 *
 * Wraps I18nProvider for locale management and provides theme context
 * for color scheme, scale, and theme class. Applies CSS custom properties
 * from the resolved theme.
 *
 * @example
 * ```tsx
 * <Provider locale="en-US" colorScheme="dark">
 *   <App />
 * </Provider>
 * ```
 */
export function Provider(props: ProviderProps): JSX.Element {
  const [local, rest] = splitProps(props, [
    'locale', 'colorScheme', 'scale', 'theme', 'class', 'style', 'children',
  ]);

  const colorScheme = (): ColorScheme => local.colorScheme ?? 'light';

  const resolved = () => resolveTheme(local.theme, colorScheme());

  const themeValue = (): ThemeContextValue => ({
    colorScheme: colorScheme(),
    scale: local.scale ?? 'medium',
    themeClass: resolved().className,
    theme: resolved().themeObj,
  });

  const classes = (): string => {
    const parts = [resolved().className];
    if (local.class) parts.push(local.class);
    return parts.join(' ');
  };

  const mergedStyle = (): JSX.CSSProperties => {
    const themeProps = resolved().properties;
    return {
      ...themeProps,
      ...(local.style || {}),
    } as JSX.CSSProperties;
  };

  return (
    <I18nProvider locale={local.locale}>
      <ThemeContext.Provider value={themeValue()}>
        <div {...rest} class={classes()} style={mergedStyle()}>
          {local.children}
        </div>
      </ThemeContext.Provider>
    </I18nProvider>
  );
}
