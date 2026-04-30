/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { Tooltip, TooltipTrigger, SimpleTooltip } from '../src/tooltip';
import { Button } from '../src/button';

describe('Tooltip (solid-spectrum)', () => {
  describe('variant styles', () => {
    const variantCases = [
      { variant: 'default' as const, expected: 'bg-neutral-900' },
      { variant: 'neutral' as const, expected: 'bg-neutral-800' },
      { variant: 'info' as const, expected: 'bg-blue-600' },
    ];

    variantCases.forEach(({ variant, expected }) => {
      it(`applies ${variant} variant classes`, () => {
        render(() => (
          <TooltipTrigger isOpen>
            <Button>Trigger</Button>
            <Tooltip variant={variant}>Tip content</Tooltip>
          </TooltipTrigger>
        ));

        const tooltip = screen.getByRole('tooltip');
        expect(tooltip.className).toContain(expected);
      });
    });
  });

  describe('defaults', () => {
    it('uses default variant when none specified', () => {
      render(() => (
        <TooltipTrigger isOpen>
          <Button>Trigger</Button>
          <Tooltip>Tip content</Tooltip>
        </TooltipTrigger>
      ));

      const tooltip = screen.getByRole('tooltip');
      // default variant has bg-neutral-900
      expect(tooltip.className).toContain('bg-neutral-900');
    });

    it('uses top placement by default', () => {
      render(() => (
        <TooltipTrigger isOpen>
          <Button>Trigger</Button>
          <Tooltip>Tip content</Tooltip>
        </TooltipTrigger>
      ));

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveAttribute('data-placement', 'top');
    });
  });

  describe('placement', () => {
    const placements = ['top', 'bottom', 'left', 'right'] as const;

    placements.forEach((placement) => {
      it(`sets data-placement="${placement}"`, () => {
        render(() => (
          <TooltipTrigger isOpen>
            <Button>Trigger</Button>
            <Tooltip placement={placement}>Tip</Tooltip>
          </TooltipTrigger>
        ));

        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveAttribute('data-placement', placement);
      });
    });
  });

  describe('arrow', () => {
    it('renders arrow when showArrow={true}', () => {
      render(() => (
        <TooltipTrigger isOpen>
          <Button>Trigger</Button>
          <Tooltip showArrow>With arrow</Tooltip>
        </TooltipTrigger>
      ));

      const tooltip = screen.getByRole('tooltip');
      // Arrow is a div with border-4 class
      const arrow = tooltip.querySelector('.border-4');
      expect(arrow).toBeInTheDocument();
    });

    it('does not render arrow by default', () => {
      render(() => (
        <TooltipTrigger isOpen>
          <Button>Trigger</Button>
          <Tooltip>No arrow</Tooltip>
        </TooltipTrigger>
      ));

      const tooltip = screen.getByRole('tooltip');
      const arrow = tooltip.querySelector('.border-4');
      expect(arrow).not.toBeInTheDocument();
    });

    it('arrow has variant-specific border color for default variant', () => {
      render(() => (
        <TooltipTrigger isOpen>
          <Button>Trigger</Button>
          <Tooltip showArrow variant="default">Content</Tooltip>
        </TooltipTrigger>
      ));

      const tooltip = screen.getByRole('tooltip');
      const arrow = tooltip.querySelector('.border-4');
      expect(arrow!.className).toContain('border-neutral-900');
    });

    it('arrow has variant-specific border color for info variant', () => {
      render(() => (
        <TooltipTrigger isOpen>
          <Button>Trigger</Button>
          <Tooltip showArrow variant="info">Content</Tooltip>
        </TooltipTrigger>
      ));

      const tooltip = screen.getByRole('tooltip');
      const arrow = tooltip.querySelector('.border-4');
      expect(arrow!.className).toContain('border-blue-600');
    });
  });

  describe('animation classes', () => {
    it('includes animation base classes', () => {
      render(() => (
        <TooltipTrigger isOpen>
          <Button>Trigger</Button>
          <Tooltip>Animated</Tooltip>
        </TooltipTrigger>
      ));

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.className).toContain('animate-in');
      expect(tooltip.className).toContain('fade-in-0');
      expect(tooltip.className).toContain('zoom-in-95');
    });

    it('includes exit animation classes', () => {
      render(() => (
        <TooltipTrigger isOpen>
          <Button>Trigger</Button>
          <Tooltip>Animated</Tooltip>
        </TooltipTrigger>
      ));

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.className).toContain('data-[exiting]:animate-out');
      expect(tooltip.className).toContain('data-[exiting]:fade-out-0');
      expect(tooltip.className).toContain('data-[exiting]:zoom-out-95');
    });
  });

  describe('SimpleTooltip', () => {
    it('renders with vui-tooltip class', () => {
      const { container } = render(() => (
        <SimpleTooltip label="Help text">
          <button>Hover</button>
        </SimpleTooltip>
      ));

      expect(container.querySelector('.vui-tooltip')).toBeInTheDocument();
    });

    it('renders with default bottom position class', () => {
      const { container } = render(() => (
        <SimpleTooltip label="Help text">
          <button>Hover</button>
        </SimpleTooltip>
      ));

      expect(container.querySelector('.vui-tooltip__content--bottom')).toBeInTheDocument();
    });

    it('renders with top position class', () => {
      const { container } = render(() => (
        <SimpleTooltip label="Help text" position="top">
          <button>Hover</button>
        </SimpleTooltip>
      ));

      expect(container.querySelector('.vui-tooltip__content--top')).toBeInTheDocument();
    });

    it('renders label text', () => {
      render(() => (
        <SimpleTooltip label="Help text">
          <button>Hover</button>
        </SimpleTooltip>
      ));

      expect(screen.getByText('Help text')).toBeInTheDocument();
    });
  });
});
