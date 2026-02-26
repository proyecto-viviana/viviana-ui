import { describe, it, expect } from 'vitest';
import { render } from '@solidjs/testing-library';
import { Flex } from '../src/layout/Flex';
import { Grid } from '../src/layout/Grid';
import { fitContent, minmax, repeat } from '../src/layout/css-utils';
import { StoryErrorBoundary } from '../src/story-utils/ErrorBoundary';
import { generatePowerset } from '../src/story-utils/generatePowerset';

// ============================================
// Wave 5: Layout Utilities
// ============================================

describe('Flex', () => {
  it('renders with default flex class', () => {
    const { container } = render(() => <Flex>content</Flex>);
    const div = container.firstElementChild as HTMLElement;
    expect(div.className).toContain('flex');
    expect(div.textContent).toBe('content');
  });

  it('applies direction and gap', () => {
    const { container } = render(() => <Flex direction="column" gap={4}>items</Flex>);
    const div = container.firstElementChild as HTMLElement;
    expect(div.className).toContain('flex-col');
    expect(div.className).toContain('gap-4');
  });

  it('applies wrap and alignment', () => {
    const { container } = render(() => (
      <Flex wrap alignItems="center" justifyContent="between">wrapped</Flex>
    ));
    const div = container.firstElementChild as HTMLElement;
    expect(div.className).toContain('flex-wrap');
    expect(div.className).toContain('items-center');
    expect(div.className).toContain('justify-between');
  });

  it('renders inline-flex when inline', () => {
    const { container } = render(() => <Flex inline>inline</Flex>);
    const div = container.firstElementChild as HTMLElement;
    expect(div.className).toContain('inline-flex');
  });

  it('applies custom class', () => {
    const { container } = render(() => <Flex class="my-custom">c</Flex>);
    const div = container.firstElementChild as HTMLElement;
    expect(div.className).toContain('my-custom');
  });
});

describe('Grid', () => {
  it('renders with default grid class', () => {
    const { container } = render(() => <Grid>content</Grid>);
    const div = container.firstElementChild as HTMLElement;
    expect(div.className).toContain('grid');
    expect(div.textContent).toBe('content');
  });

  it('applies numeric columns as repeat', () => {
    const { container } = render(() => <Grid columns={3}>items</Grid>);
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.getPropertyValue('grid-template-columns')).toBe('repeat(3, 1fr)');
  });

  it('applies string columns directly', () => {
    const { container } = render(() => <Grid columns="1fr 2fr">items</Grid>);
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.getPropertyValue('grid-template-columns')).toBe('1fr 2fr');
  });

  it('applies gap and alignment classes', () => {
    const { container } = render(() => (
      <Grid gap={4} alignItems="center" justifyItems="end">items</Grid>
    ));
    const div = container.firstElementChild as HTMLElement;
    expect(div.className).toContain('gap-4');
    expect(div.className).toContain('items-center');
    expect(div.className).toContain('justify-items-end');
  });

  it('applies areas as grid-template-areas', () => {
    const { container } = render(() => (
      <Grid areas={['header header', 'sidebar main']}>items</Grid>
    ));
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.getPropertyValue('grid-template-areas')).toBe('"header header" "sidebar main"');
  });

  it('renders inline-grid when inline', () => {
    const { container } = render(() => <Grid inline>inline</Grid>);
    const div = container.firstElementChild as HTMLElement;
    expect(div.className).toContain('inline-grid');
  });
});

describe('CSS Utilities', () => {
  it('fitContent wraps value', () => {
    expect(fitContent('200px')).toBe('fit-content(200px)');
  });

  it('minmax wraps min and max', () => {
    expect(minmax('100px', '1fr')).toBe('minmax(100px, 1fr)');
  });

  it('repeat wraps count and track', () => {
    expect(repeat(3, '1fr')).toBe('repeat(3, 1fr)');
    expect(repeat('auto-fill', 'minmax(200px, 1fr)')).toBe('repeat(auto-fill, minmax(200px, 1fr))');
  });
});

// ============================================
// Wave 6: Story Utilities
// ============================================

describe('StoryErrorBoundary', () => {
  it('renders children when no error', () => {
    const { container } = render(() => (
      <StoryErrorBoundary>
        <span>hello</span>
      </StoryErrorBoundary>
    ));
    expect(container.textContent).toBe('hello');
  });

  it('renders error fallback on error', () => {
    const ThrowingComponent = () => {
      throw new Error('test error');
    };
    const { container } = render(() => (
      <StoryErrorBoundary>
        <ThrowingComponent />
      </StoryErrorBoundary>
    ));
    expect(container.textContent).toContain('test error');
    expect(container.querySelector('button')).toBeDefined();
  });

  it('renders custom fallback on error', () => {
    const ThrowingComponent = () => {
      throw new Error('custom error');
    };
    const { container } = render(() => (
      <StoryErrorBoundary fallback={(err) => <div>Custom: {err.message}</div>}>
        <ThrowingComponent />
      </StoryErrorBoundary>
    ));
    expect(container.textContent).toContain('Custom: custom error');
  });
});

describe('generatePowerset', () => {
  it('generates all combinations', () => {
    const result = generatePowerset({
      size: ['sm', 'lg'],
      variant: ['primary', 'secondary'],
    });
    expect(result).toHaveLength(4);
  });

  it('produces correct labels', () => {
    const result = generatePowerset({
      color: ['red', 'blue'],
    });
    expect(result[0].label).toBe('color=red');
    expect(result[1].label).toBe('color=blue');
  });

  it('produces correct props', () => {
    const result = generatePowerset({
      size: ['sm'],
      disabled: [true, false],
    });
    expect(result).toHaveLength(2);
    expect(result[0].props).toEqual({ size: 'sm', disabled: true });
    expect(result[1].props).toEqual({ size: 'sm', disabled: false });
  });

  it('handles single prop', () => {
    const result = generatePowerset({ x: [1, 2, 3] });
    expect(result).toHaveLength(3);
    expect(result.map(r => r.props.x)).toEqual([1, 2, 3]);
  });

  it('handles empty values array gracefully', () => {
    const result = generatePowerset({});
    expect(result).toHaveLength(1);
    expect(result[0].props).toEqual({});
  });
});
