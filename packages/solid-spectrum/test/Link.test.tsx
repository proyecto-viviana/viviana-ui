/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { Link } from '../src/link';
import { setupUser } from '@proyecto-viviana/solid-spectrum-test-utils';

describe('Link (solid-spectrum)', () => {
  it('should render a link with default styling', () => {
    render(() => <Link>Test</Link>);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveClass('text-accent');
    expect(link).toHaveClass('underline');
  });

  it('should render an anchor when href is provided', () => {
    render(() => <Link href="https://example.com">Test</Link>);
    const link = screen.getByRole('link');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('should support secondary variant', () => {
    render(() => <Link variant="secondary">Test</Link>);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('text-primary-300');
  });

  it('should support standalone style', () => {
    render(() => <Link isStandalone>Test</Link>);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('font-medium');
  });

  it('should support quiet style with standalone', async () => {
    const user = setupUser();
    render(() => <Link isStandalone isQuiet>Test</Link>);
    const link = screen.getByRole('link');

    // Initially no underline
    expect(link).toHaveClass('no-underline');

    // Underline on hover
    await user.hover(link);
    expect(link).toHaveClass('underline');
  });

  it('should support custom class', () => {
    render(() => <Link class="custom-class">Test</Link>);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('custom-class');
  });

  it('should support disabled state', () => {
    render(() => <Link isDisabled>Test</Link>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveClass('opacity-50');
    expect(link).toHaveClass('cursor-not-allowed');
  });

  it('should call onPress when clicked', async () => {
    const user = setupUser();
    const onPress = vi.fn();
    render(() => <Link onPress={onPress}>Test</Link>);
    const link = screen.getByRole('link');

    await user.click(link);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', async () => {
    const user = setupUser();
    const onPress = vi.fn();
    render(() => <Link isDisabled onPress={onPress}>Test</Link>);
    const link = screen.getByRole('link');

    await user.click(link);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('should support focus visible styling', async () => {
    const user = setupUser();
    render(() => <Link>Test</Link>);
    const link = screen.getByRole('link');

    await user.tab();
    expect(document.activeElement).toBe(link);
    expect(link).toHaveClass('ring-2');
    expect(link).toHaveClass('ring-accent-300');
  });

  it('should support hover events', async () => {
    const user = setupUser();
    const onHoverStart = vi.fn();
    const onHoverEnd = vi.fn();

    render(() => (
      <Link onHoverStart={onHoverStart} onHoverEnd={onHoverEnd}>
        Test
      </Link>
    ));
    const link = screen.getByRole('link');

    await user.hover(link);
    expect(onHoverStart).toHaveBeenCalledTimes(1);

    await user.unhover(link);
    expect(onHoverEnd).toHaveBeenCalledTimes(1);
  });

  it('should support aria-current', () => {
    render(() => <Link aria-current="page">Test</Link>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('aria-current', 'page');
  });
});
