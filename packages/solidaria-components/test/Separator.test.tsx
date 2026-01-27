/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { Separator } from '../src/Separator';

describe('Separator', () => {
  it('should render with default class', () => {
    render(() => <Separator />);
    const separator = screen.getByRole('separator');
    expect(separator.tagName).toBe('HR');
    expect(separator).toHaveClass('solidaria-Separator');
  });

  it('should render with custom class', () => {
    render(() => <Separator class="test" />);
    const separator = screen.getByRole('separator');
    expect(separator).toHaveClass('test');
  });

  it('should support function class', () => {
    render(() => (
      <Separator class={(props) => `separator-${props.orientation}`} />
    ));
    const separator = screen.getByRole('separator');
    expect(separator).toHaveClass('separator-horizontal');
  });

  it('should support DOM props', () => {
    render(() => <Separator id="my-separator" />);
    const separator = screen.getByRole('separator');
    expect(separator).toHaveAttribute('id', 'my-separator');
  });

  it('should support slot', () => {
    render(() => <Separator slot="test" />);
    const separator = screen.getByRole('separator');
    expect(separator).toHaveAttribute('slot', 'test');
  });

  it('should support aria-label', () => {
    render(() => <Separator aria-label="Divider" />);
    const separator = screen.getByRole('separator');
    expect(separator).toHaveAttribute('aria-label', 'Divider');
  });

  it('should render as div for vertical orientation', () => {
    render(() => <Separator orientation="vertical" />);
    const separator = screen.getByRole('separator');
    expect(separator.tagName).toBe('DIV');
    expect(separator).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('should use custom elementType', () => {
    render(() => <Separator elementType="span" />);
    const separator = screen.getByRole('separator');
    expect(separator.tagName).toBe('SPAN');
  });

  it('should default to horizontal orientation', () => {
    render(() => <Separator />);
    const separator = screen.getByRole('separator');
    // Horizontal is default, so aria-orientation may not be explicitly set
    expect(separator).toBeTruthy();
    expect(separator.tagName).toBe('HR');
  });

  it('should support style as an object', () => {
    render(() => <Separator style={{ 'border-color': 'red' }} />);
    const separator = screen.getByRole('separator') as HTMLElement;
    expect(separator.style.borderColor).toBe('red');
  });

  it('should support style as a function', () => {
    render(() => (
      <Separator
        orientation="vertical"
        style={(props) => ({
          height: props.orientation === 'vertical' ? '100%' : '1px',
        })}
      />
    ));
    const separator = screen.getByRole('separator') as HTMLElement;
    expect(separator.style.height).toBe('100%');
  });

  it('should support aria-labelledby', () => {
    render(() => (
      <>
        <span id="sep-label">Section break</span>
        <Separator aria-labelledby="sep-label" />
      </>
    ));
    const separator = screen.getByRole('separator');
    expect(separator).toHaveAttribute('aria-labelledby', 'sep-label');
  });

  it('should keep custom elementType for vertical orientation', () => {
    render(() => <Separator orientation="vertical" elementType="span" />);
    const separator = screen.getByRole('separator');
    expect(separator.tagName).toBe('SPAN');
  });
});
