/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { lightTheme } from '../src/theme-light';
import { darkTheme } from '../src/theme-dark';
import { defaultTheme } from '../src/theme-default';
import { Provider, useTheme, ThemeContext } from '../src/provider';
import { useContext } from 'solid-js';

describe('Theme System', () => {
  describe('lightTheme', () => {
    it('has all required background tokens', () => {
      expect(lightTheme.properties['--vui-bg-100']).toBeDefined();
      expect(lightTheme.properties['--vui-bg-200']).toBeDefined();
      expect(lightTheme.properties['--vui-bg-300']).toBeDefined();
    });

    it('has all required text tokens', () => {
      expect(lightTheme.properties['--vui-text-primary']).toBeDefined();
      expect(lightTheme.properties['--vui-text-secondary']).toBeDefined();
    });

    it('has accent tokens', () => {
      expect(lightTheme.properties['--vui-accent']).toBeDefined();
      expect(lightTheme.properties['--vui-accent-hover']).toBeDefined();
    });

    it('has status tokens', () => {
      expect(lightTheme.properties['--vui-danger']).toBeDefined();
      expect(lightTheme.properties['--vui-success']).toBeDefined();
      expect(lightTheme.properties['--vui-warning']).toBeDefined();
      expect(lightTheme.properties['--vui-info']).toBeDefined();
    });

    it('has className set', () => {
      expect(lightTheme.className).toBe('vui-theme-light');
    });
  });

  describe('darkTheme', () => {
    it('has all required background tokens', () => {
      expect(darkTheme.properties['--vui-bg-100']).toBeDefined();
      expect(darkTheme.properties['--vui-bg-200']).toBeDefined();
      expect(darkTheme.properties['--vui-bg-300']).toBeDefined();
    });

    it('has all required text tokens', () => {
      expect(darkTheme.properties['--vui-text-primary']).toBeDefined();
      expect(darkTheme.properties['--vui-text-secondary']).toBeDefined();
    });

    it('has className set', () => {
      expect(darkTheme.className).toBe('vui-theme-dark');
    });

    it('has different bg values than light theme', () => {
      expect(darkTheme.properties['--vui-bg-100']).not.toBe(lightTheme.properties['--vui-bg-100']);
    });
  });

  describe('defaultTheme', () => {
    it('equals light theme', () => {
      expect(defaultTheme).toEqual(lightTheme);
    });
  });

  describe('Provider', () => {
    it('applies theme CSS properties via style attribute', () => {
      const { container } = render(() => (
        <Provider>
          <span>Content</span>
        </Provider>
      ));
      const wrapper = container.firstElementChild as HTMLElement;
      // Should have CSS custom properties applied
      expect(wrapper.style.getPropertyValue('--vui-accent')).toBeTruthy();
    });

    it('applies theme class name', () => {
      const { container } = render(() => (
        <Provider>
          <span>Content</span>
        </Provider>
      ));
      const wrapper = container.firstElementChild as HTMLElement;
      expect(wrapper.className).toContain('vui-theme-light');
    });

    it('applies dark theme when colorScheme is dark', () => {
      const { container } = render(() => (
        <Provider colorScheme="dark">
          <span>Content</span>
        </Provider>
      ));
      const wrapper = container.firstElementChild as HTMLElement;
      expect(wrapper.className).toContain('vui-theme-dark');
    });

    it('nested providers override theme', () => {
      let innerTheme: string | undefined;

      function ThemeDisplay() {
        const theme = useTheme();
        innerTheme = theme.colorScheme;
        return <span>{theme.colorScheme}</span>;
      }

      render(() => (
        <Provider colorScheme="light">
          <Provider colorScheme="dark">
            <ThemeDisplay />
          </Provider>
        </Provider>
      ));

      expect(innerTheme).toBe('dark');
    });

    it('accepts a custom Theme object', () => {
      const customTheme = {
        className: 'my-custom-theme',
        properties: {
          '--vui-accent': '#ff0000',
          '--vui-bg-100': '#ffffff',
        },
      };

      const { container } = render(() => (
        <Provider theme={customTheme}>
          <span>Content</span>
        </Provider>
      ));
      const wrapper = container.firstElementChild as HTMLElement;
      expect(wrapper.className).toContain('my-custom-theme');
      expect(wrapper.style.getPropertyValue('--vui-accent')).toBe('#ff0000');
    });
  });
});
