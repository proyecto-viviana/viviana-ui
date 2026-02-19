import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@solidjs/testing-library';
import { Pressable } from '../src/Pressable';

describe('Pressable', () => {
  it('renders its child element', () => {
    const { getByTestId } = render(() => (
      <Pressable onPress={() => {}}>
        <div data-testid="child" role="button" tabIndex={0}>Pressable</div>
      </Pressable>
    ));
    expect(getByTestId('child')).toBeDefined();
    expect(getByTestId('child').textContent).toBe('Pressable');
  });

  it('can be exported from index', async () => {
    const mod = await import('../src/index');
    expect(mod.Pressable).toBeDefined();
  });

  it('renders without errors when disabled', () => {
    const { getByTestId } = render(() => (
      <Pressable isDisabled onPress={() => {}}>
        <div data-testid="child" role="button" tabIndex={0}>Disabled</div>
      </Pressable>
    ));
    expect(getByTestId('child')).toBeDefined();
  });

  it('forwards ref via callback', () => {
    let capturedRef: HTMLElement | undefined;
    render(() => (
      <Pressable ref={(el) => { capturedRef = el; }} onPress={() => {}}>
        <div role="button" tabIndex={0}>Content</div>
      </Pressable>
    ));
    expect(capturedRef).toBeInstanceOf(HTMLElement);
  });
});
