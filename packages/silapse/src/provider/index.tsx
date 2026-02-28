/**
 * Provider component for proyecto-viviana-silapse
 *
 * Compound provider wrapping locale, modal, and theme context.
 * Modeled after React Spectrum's <Provider> behavior.
 */

import {
  type JSX,
  type ParentProps,
  createContext,
  createMemo,
  mergeProps,
  splitProps,
  useContext,
} from 'solid-js';
import {
  I18nProvider,
  ModalProvider,
  isRTL,
  useLocale,
  useModalProvider,
  type Direction,
} from '@proyecto-viviana/solidaria';
import type { Theme } from '../theme/types';
import { lightTheme } from '../theme-light';
import { darkTheme } from '../theme-dark';

// ============================================
// TYPES
// ============================================

export type ColorScheme = 'light' | 'dark';
export type Scale = 'medium' | 'large';
export type ValidationState = 'valid' | 'invalid';

export interface ProviderInheritedProps {
  /** Whether controls should render in their quiet/subtle style. */
  isQuiet?: boolean;
  /** Whether controls should render in their emphasized style. */
  isEmphasized?: boolean;
  /** Whether controls should be disabled. */
  isDisabled?: boolean;
  /** Whether controls should be required. */
  isRequired?: boolean;
  /** Whether controls should be read only. */
  isReadOnly?: boolean;
  /** Shared validation state for descendant form fields. */
  validationState?: ValidationState;
}

export interface ThemeContextValue {
  /** The current color scheme. */
  colorScheme: ColorScheme;
  /** The UI scale. */
  scale: Scale;
  /** CSS class name for the active theme. */
  themeClass: string;
  /** The full resolved theme object. */
  theme: Theme;
}

export interface ProviderContextValue extends ThemeContextValue, ProviderInheritedProps {
  /** The locale applied by the provider. */
  locale: string;
  /** The writing direction applied by the provider. */
  direction: Direction;
}

export interface ProviderProps extends ParentProps, ProviderInheritedProps {
  /** The locale for i18n. If not provided, inherits the nearest locale. */
  locale?: string;
  /** The color scheme. Inherits from the nearest provider when omitted. */
  colorScheme?: ColorScheme;
  /** The UI scale. Inherits from the nearest provider when omitted. */
  scale?: Scale;
  /** The theme CSS class (string) or a full Theme object. */
  theme?: string | Theme;
  /** Additional CSS class name for the provider wrapper. */
  class?: string;
  /** Additional inline styles. */
  style?: JSX.CSSProperties;
}

interface InternalProviderContextValue extends ProviderContextValue {
  themeSource?: string | Theme;
}

// ============================================
// CONTEXT
// ============================================

const defaultThemeContext: ThemeContextValue = {
  colorScheme: 'light',
  scale: 'medium',
  themeClass: lightTheme.className,
  theme: lightTheme,
};

export const ThemeContext = createContext<ThemeContextValue>(defaultThemeContext);
const ProviderContext = createContext<InternalProviderContextValue | null>(null);

/**
 * Hook to access the current theme context.
 */
export function useTheme(): ThemeContextValue {
  const provider = useContext(ProviderContext);
  if (provider) {
    return provider;
  }

  return useContext(ThemeContext);
}

/**
 * Returns the settings applied by the nearest provider.
 */
export function useProvider(): ProviderContextValue {
  const context = useContext(ProviderContext);

  if (!context) {
    throw new Error('No root provider found. Wrap this subtree in <Provider>.');
  }

  return context;
}

/**
 * Merges inherited provider props with the component's explicit props.
 */
export function useProviderProps<T extends object>(props: T): T {
  const context = useContext(ProviderContext);

  if (!context) {
    return props;
  }

  return mergeProps(
    ({
      isQuiet: context.isQuiet,
      isEmphasized: context.isEmphasized,
      isDisabled: context.isDisabled,
      isRequired: context.isRequired,
      isReadOnly: context.isReadOnly,
      validationState: context.validationState,
    } as unknown as Partial<T>),
    props
  ) as T;
}

// ============================================
// THEME RESOLUTION
// ============================================

function getBuiltInTheme(colorScheme: ColorScheme): Theme {
  return colorScheme === 'dark' ? darkTheme : lightTheme;
}

function resolveTheme(
  themeInput: string | Theme | undefined,
  colorScheme: ColorScheme,
  inheritedThemeClass?: string
): { className: string; properties: Record<string, string>; themeObj: Theme } {
  if (themeInput && typeof themeInput === 'object') {
    return {
      className: themeInput.className,
      properties: themeInput.properties,
      themeObj: themeInput,
    };
  }

  const builtIn = getBuiltInTheme(colorScheme);

  if (typeof themeInput === 'string') {
    return {
      className: themeInput,
      properties: builtIn.properties,
      themeObj: builtIn,
    };
  }

  if (inheritedThemeClass && inheritedThemeClass !== builtIn.className) {
    return {
      className: inheritedThemeClass,
      properties: builtIn.properties,
      themeObj: builtIn,
    };
  }

  return {
    className: builtIn.className,
    properties: builtIn.properties,
    themeObj: builtIn,
  };
}

// ============================================
// INTERNAL COMPONENTS
// ============================================

interface ProviderRootProps {
  children: JSX.Element;
  class: string;
  style: JSX.CSSProperties;
  colorScheme: ColorScheme;
  rest: Record<string, unknown>;
}

function ProviderRoot(props: ProviderRootProps): JSX.Element {
  const locale = useLocale();
  const { modalProviderProps } = useModalProvider();

  return (
    <div
      {...props.rest}
      {...modalProviderProps}
      class={props.class}
      style={props.style}
      lang={locale().locale}
      dir={locale().direction}
      data-color-scheme={props.colorScheme}
    >
      {props.children}
    </div>
  );
}

// ============================================
// COMPONENT
// ============================================

/**
 * Root provider for proyecto-viviana UI.
 *
 * Wraps I18nProvider for locale management, provides inherited component props,
 * and applies theme CSS custom properties to a scoped wrapper element.
 */
export function Provider(props: ProviderProps): JSX.Element {
  const parentProvider = useContext(ProviderContext);
  const inheritedLocale = useLocale();

  const [local, rest] = splitProps(props, [
    'locale',
    'colorScheme',
    'scale',
    'theme',
    'class',
    'style',
    'children',
    'isQuiet',
    'isEmphasized',
    'isDisabled',
    'isRequired',
    'isReadOnly',
    'validationState',
  ]);

  const colorScheme = createMemo<ColorScheme>(() => local.colorScheme ?? parentProvider?.colorScheme ?? 'light');
  const scale = createMemo<Scale>(() => local.scale ?? parentProvider?.scale ?? 'medium');
  const locale = createMemo(() => local.locale ?? parentProvider?.locale ?? inheritedLocale().locale);

  const inheritedThemeClass = createMemo(() => {
    if (!parentProvider) {
      return undefined;
    }

    const builtInParentTheme = getBuiltInTheme(parentProvider.colorScheme);
    return parentProvider.themeClass !== builtInParentTheme.className ? parentProvider.themeClass : undefined;
  });

  const resolvedTheme = createMemo(() =>
    resolveTheme(
      local.theme ?? parentProvider?.themeSource,
      colorScheme(),
      inheritedThemeClass()
    )
  );

  const providerValue: InternalProviderContextValue = {
    get locale() {
      return locale();
    },
    get direction() {
      return local.locale ? (isRTL(local.locale) ? 'rtl' : 'ltr') : inheritedLocale().direction;
    },
    get colorScheme() {
      return colorScheme();
    },
    get scale() {
      return scale();
    },
    get themeClass() {
      return resolvedTheme().className;
    },
    get theme() {
      return resolvedTheme().themeObj;
    },
    get themeSource() {
      return local.theme ?? parentProvider?.themeSource;
    },
    get isQuiet() {
      return local.isQuiet ?? parentProvider?.isQuiet;
    },
    get isEmphasized() {
      return local.isEmphasized ?? parentProvider?.isEmphasized;
    },
    get isDisabled() {
      return local.isDisabled ?? parentProvider?.isDisabled;
    },
    get isRequired() {
      return local.isRequired ?? parentProvider?.isRequired;
    },
    get isReadOnly() {
      return local.isReadOnly ?? parentProvider?.isReadOnly;
    },
    get validationState() {
      return local.validationState ?? parentProvider?.validationState;
    },
  };

  const classes = createMemo(() => {
    const parts = [
      'vui-provider',
      `vui-provider--${colorScheme()}`,
      `vui-provider--${scale()}`,
      resolvedTheme().className,
      local.class,
    ];

    return parts.filter(Boolean).join(' ');
  });

  const mergedStyle = createMemo<JSX.CSSProperties>(() => ({
    ...resolvedTheme().properties,
    'color-scheme': colorScheme(),
    isolation: parentProvider ? undefined : 'isolate',
    ...(local.style ?? {}),
  }));

  return (
    <ProviderContext.Provider value={providerValue}>
      <ThemeContext.Provider value={providerValue}>
        <I18nProvider locale={locale()}>
          <ModalProvider>
            <ProviderRoot
              rest={rest as Record<string, unknown>}
              class={classes()}
              style={mergedStyle()}
              colorScheme={colorScheme()}
            >
              {local.children}
            </ProviderRoot>
          </ModalProvider>
        </I18nProvider>
      </ThemeContext.Provider>
    </ProviderContext.Provider>
  );
}
