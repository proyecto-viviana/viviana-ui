/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@solidjs/testing-library';
import { ContextualHelpTrigger } from '../src/menu/ContextualHelpTrigger';

describe('ContextualHelpTrigger (ui)', () => {
  const defaultChildren: [any, any] = [
    <span>Need help?</span>,
    <div>This is the help content.</div>,
  ];

  it('renders styled trigger', () => {
    render(() => <ContextualHelpTrigger>{defaultChildren}</ContextualHelpTrigger>);
    expect(screen.getByRole('menuitem')).toBeInTheDocument();
    expect(screen.getByText('Need help?')).toBeInTheDocument();
  });

  it('popover has styled content', () => {
    render(() => <ContextualHelpTrigger>{defaultChildren}</ContextualHelpTrigger>);
    fireEvent.click(screen.getByRole('menuitem'));
    expect(screen.getByText('This is the help content.')).toBeInTheDocument();
  });

  it('applies custom class', () => {
    const { container } = render(() => (
      <ContextualHelpTrigger class="my-help-trigger">{defaultChildren}</ContextualHelpTrigger>
    ));
    const wrapper = container.querySelector('.solidaria-ContextualHelpTrigger');
    expect(wrapper?.className).toContain('my-help-trigger');
  });

  it('opens and closes correctly', () => {
    render(() => <ContextualHelpTrigger>{defaultChildren}</ContextualHelpTrigger>);
    const trigger = screen.getByRole('menuitem');

    // Open
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Close via Escape
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
