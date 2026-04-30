/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { Skeleton, SkeletonCollection } from '../src/skeleton';

describe('Skeleton (solid-spectrum)', () => {
  it('should render with shimmer classes when loading', () => {
    const { container } = render(() => <Skeleton />);
    const el = container.querySelector('.skeleton-shimmer');
    expect(el).toBeInTheDocument();
  });

  it('should have aria-busy attribute', () => {
    render(() => <Skeleton />);
    const el = screen.getByRole('status', { hidden: true });
    expect(el).toHaveAttribute('aria-busy', 'true');
  });

  it('should have aria-hidden attribute', () => {
    render(() => <Skeleton />);
    const el = screen.getByRole('status', { hidden: true });
    expect(el).toHaveAttribute('aria-hidden', 'true');
  });

  it('should show children when isLoading is false', () => {
    render(() => (
      <Skeleton isLoading={false}>
        <span data-testid="content">Loaded</span>
      </Skeleton>
    ));
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('should hide children when isLoading is true', () => {
    render(() => (
      <Skeleton isLoading>
        <span data-testid="content">Loaded</span>
      </Skeleton>
    ));
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
  });

  it('should default to text shape with rounded-md', () => {
    const { container } = render(() => <Skeleton />);
    expect(container.querySelector('.rounded-md')).toBeInTheDocument();
  });

  it('should render circle shape', () => {
    const { container } = render(() => <Skeleton shape="circle" />);
    expect(container.querySelector('.rounded-full')).toBeInTheDocument();
  });

  it('should render rectangle shape', () => {
    const { container } = render(() => <Skeleton shape="rectangle" />);
    expect(container.querySelector('.rounded-none')).toBeInTheDocument();
  });

  it('should apply size classes', () => {
    const { container: sm } = render(() => <Skeleton size="sm" />);
    expect(sm.querySelector('.h-4')).toBeInTheDocument();

    const { container: md } = render(() => <Skeleton size="md" />);
    expect(md.querySelector('.h-6')).toBeInTheDocument();

    const { container: lg } = render(() => <Skeleton size="lg" />);
    expect(lg.querySelector('.h-8')).toBeInTheDocument();
  });

  it('should apply custom width and height', () => {
    render(() => <Skeleton width={200} height="3rem" />);
    const el = screen.getByRole('status', { hidden: true });
    expect(el.style.width).toBe('200px');
    expect(el.style.height).toBe('3rem');
  });

  it('should support custom class', () => {
    const { container } = render(() => <Skeleton class="my-custom" />);
    expect(container.querySelector('.my-custom')).toBeInTheDocument();
  });

  it('should have shimmer animation style', () => {
    render(() => <Skeleton />);
    const el = screen.getByRole('status', { hidden: true });
    expect(el.style.animation).toContain('skeleton-shimmer');
    expect(el.style.backgroundSize).toBe('300% 100%');
  });
});

describe('SkeletonCollection (solid-spectrum)', () => {
  it('should render default 3 items', () => {
    render(() => <SkeletonCollection />);
    const items = screen.getAllByRole('status', { hidden: true });
    expect(items).toHaveLength(3);
  });

  it('should render custom count', () => {
    render(() => <SkeletonCollection count={5} />);
    const items = screen.getAllByRole('status', { hidden: true });
    expect(items).toHaveLength(5);
  });

  it('should apply gap classes', () => {
    const { container: sm } = render(() => <SkeletonCollection gap="sm" />);
    expect(sm.querySelector('.gap-2')).toBeInTheDocument();

    const { container: lg } = render(() => <SkeletonCollection gap="lg" />);
    expect(lg.querySelector('.gap-4')).toBeInTheDocument();
  });

  it('should pass itemProps to each skeleton', () => {
    const { container } = render(() => (
      <SkeletonCollection count={2} itemProps={{ shape: 'circle' }} />
    ));
    const circles = container.querySelectorAll('.rounded-full');
    expect(circles).toHaveLength(2);
  });

  it('should render in a flex column container', () => {
    const { container } = render(() => <SkeletonCollection />);
    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveClass('flex');
    expect(wrapper).toHaveClass('flex-col');
  });

  it('should support custom class', () => {
    const { container } = render(() => <SkeletonCollection class="my-list" />);
    expect(container.querySelector('.my-list')).toBeInTheDocument();
  });
});
