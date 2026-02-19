import { describe, it, expect } from 'vitest';
import { render } from '@solidjs/testing-library';
import { Provider, useTheme } from '../src/provider';
import { themeDarkClass } from '../src/theme-dark';
import { themeDefaultClass } from '../src/theme-default';
import { themeLightClass } from '../src/theme-light';

describe('Provider', () => {
  it('renders children with default theme class', () => {
    const { container } = render(() => (
      <Provider>
        <span>hello</span>
      </Provider>
    ));
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain('vui-theme-light');
    expect(wrapper.textContent).toBe('hello');
  });

  it('applies dark theme class when colorScheme is dark', () => {
    const { container } = render(() => (
      <Provider colorScheme="dark">
        <span>dark</span>
      </Provider>
    ));
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain('vui-theme-dark');
  });

  it('applies custom theme class', () => {
    const { container } = render(() => (
      <Provider theme="my-custom-theme">
        <span>custom</span>
      </Provider>
    ));
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain('my-custom-theme');
  });

  it('provides theme context to children', () => {
    let themeValue: ReturnType<typeof useTheme> | undefined;

    function Consumer() {
      themeValue = useTheme();
      return <span>{themeValue.colorScheme}</span>;
    }

    render(() => (
      <Provider colorScheme="dark" scale="large">
        <Consumer />
      </Provider>
    ));

    expect(themeValue).toBeDefined();
    expect(themeValue!.colorScheme).toBe('dark');
    expect(themeValue!.scale).toBe('large');
  });
});

describe('Theme modules', () => {
  it('exports dark theme class', () => {
    expect(themeDarkClass).toBe('vui-theme-dark');
  });

  it('exports default theme class matching light', () => {
    expect(themeDefaultClass).toBe(themeLightClass);
  });

  it('exports light theme class', () => {
    expect(themeLightClass).toBe('vui-theme-light');
  });
});
