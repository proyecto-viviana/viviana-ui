/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@solidjs/testing-library';
import { ContextualHelpTrigger } from '../src/ContextualHelpTrigger';

describe('ContextualHelpTrigger (headless)', () => {
  const defaultChildren: [any, any] = [
    <span>Help trigger</span>,
    <div>Help content goes here</div>,
  ];

  describe('basic rendering', () => {
    it('renders trigger as button', () => {
      render(() => <ContextualHelpTrigger>{defaultChildren}</ContextualHelpTrigger>);
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('Help trigger')).toBeInTheDocument();
    });

    it('does not show content initially', () => {
      render(() => <ContextualHelpTrigger>{defaultChildren}</ContextualHelpTrigger>);
      expect(screen.queryByText('Help content goes here')).not.toBeInTheDocument();
    });
  });

  describe('open/close behavior', () => {
    it('opens help popover on click', () => {
      render(() => <ContextualHelpTrigger>{defaultChildren}</ContextualHelpTrigger>);
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByText('Help content goes here')).toBeInTheDocument();
    });

    it('closes on Escape', () => {
      render(() => <ContextualHelpTrigger>{defaultChildren}</ContextualHelpTrigger>);
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('toggles on repeated click', () => {
      render(() => <ContextualHelpTrigger>{defaultChildren}</ContextualHelpTrigger>);
      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      fireEvent.click(trigger);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('trigger has aria-haspopup="dialog"', () => {
      render(() => <ContextualHelpTrigger>{defaultChildren}</ContextualHelpTrigger>);
      expect(screen.getByRole('button').getAttribute('aria-haspopup')).toBe('dialog');
    });

    it('trigger has aria-expanded when open', () => {
      render(() => <ContextualHelpTrigger>{defaultChildren}</ContextualHelpTrigger>);
      const trigger = screen.getByRole('button');
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      fireEvent.click(trigger);
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
    });

    it('content has role="dialog"', () => {
      render(() => <ContextualHelpTrigger>{defaultChildren}</ContextualHelpTrigger>);
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('states', () => {
    it('isUnavailable shows data attribute', () => {
      render(() => (
        <ContextualHelpTrigger isUnavailable>{defaultChildren}</ContextualHelpTrigger>
      ));
      expect(screen.getByRole('button').hasAttribute('data-unavailable')).toBe(true);
    });

    it('isDisabled sets disabled and prevents opening', () => {
      render(() => (
        <ContextualHelpTrigger isDisabled>{defaultChildren}</ContextualHelpTrigger>
      ));
      const trigger = screen.getByRole('button');
      expect(trigger).toBeDisabled();
      fireEvent.click(trigger);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
