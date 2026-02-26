/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { ProgressBar } from '../src/progress-bar';

describe('ProgressBar (silapse)', () => {
  it('should render with role="progressbar"', () => {
    render(() => <ProgressBar value={25} aria-label="Progress" />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toBeInTheDocument();
  });

  it('should have correct aria attributes', () => {
    render(() => <ProgressBar value={25} aria-label="Progress" />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '25');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '100');
    // The format may vary by locale (e.g., "25%" or "25 %")
    expect(progressbar.getAttribute('aria-valuetext')).toMatch(/25\s?%/);
  });

  it('should render label', () => {
    render(() => <ProgressBar value={50} label="Loading..." />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render value text for determinate progress', () => {
    render(() => <ProgressBar value={50} label="Progress" />);
    // The format may vary by locale (e.g., "50%" or "50 %")
    const valueText = screen.getByRole('progressbar').parentElement?.querySelector('.text-primary-300');
    expect(valueText?.textContent).toMatch(/50\s?%/);
  });

  it('should hide value text for indeterminate progress', () => {
    render(() => <ProgressBar isIndeterminate label="Loading..." />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).not.toHaveAttribute('aria-valuenow');
    expect(screen.queryByText('%')).not.toBeInTheDocument();
  });

  it('should support custom valueLabel', () => {
    render(() => <ProgressBar value={25} valueLabel="Step 1 of 4" aria-label="Progress" />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuetext', 'Step 1 of 4');
  });

  it('should support size prop', () => {
    const { container } = render(() => <ProgressBar value={50} size="lg" aria-label="Progress" />);
    // Large size should have h-3 class on track
    expect(container.querySelector('.h-3')).toBeInTheDocument();
  });

  it('should support variant prop', () => {
    const { container } = render(() => <ProgressBar value={50} variant="success" aria-label="Progress" />);
    // Success variant should have green background
    expect(container.querySelector('.bg-green-500')).toBeInTheDocument();
  });

  it('should support custom class', () => {
    render(() => <ProgressBar value={50} class="my-custom-class" aria-label="Progress" />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveClass('my-custom-class');
  });

  it('should support aria-label', () => {
    render(() => <ProgressBar value={50} aria-label="Download progress" />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-label', 'Download progress');
  });

  it('should clamp value between min and max', () => {
    render(() => <ProgressBar value={150} minValue={0} maxValue={100} aria-label="Progress" />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '100');
  });

  it('should allow hiding value label', () => {
    render(() => <ProgressBar value={50} label="Progress" showValueLabel={false} />);
    expect(screen.getByText('Progress')).toBeInTheDocument();
    // The format may vary by locale, so check for absence of value span
    const progressbar = screen.getByRole('progressbar');
    const valueSpan = progressbar.querySelector('.text-primary-300');
    expect(valueSpan).not.toBeInTheDocument();
  });

  it('should handle equal min and max without NaN', () => {
    render(() => <ProgressBar value={10} minValue={10} maxValue={10} aria-label="Progress" />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuetext');
    expect(progressbar.getAttribute('aria-valuetext')).not.toContain('NaN');
  });
});
