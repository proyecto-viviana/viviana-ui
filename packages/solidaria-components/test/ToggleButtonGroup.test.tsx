/**
 * Tests for solidaria-components ToggleButtonGroup
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { setupUser } from '@proyecto-viviana/solidaria-test-utils';
import { ToggleButton } from '../src/ToggleButton';
import { ToggleButtonGroup } from '../src/ToggleButtonGroup';

describe('ToggleButtonGroup', () => {
  it('renders group container and default class', () => {
    render(() => (
      <ToggleButtonGroup>
        {() => <ToggleButton toggleKey="a" aria-label="A">A</ToggleButton>}
      </ToggleButtonGroup>
    ));

    const group = document.querySelector('[role="group"]') as HTMLElement;
    expect(group).toHaveClass('solidaria-ToggleButtonGroup');
    expect(group).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('supports single selection mode', async () => {
    const user = setupUser();
    render(() => (
      <ToggleButtonGroup selectionMode="single">
        {() => (
          <>
            <ToggleButton toggleKey="a" aria-label="A">A</ToggleButton>
            <ToggleButton toggleKey="b" aria-label="B">B</ToggleButton>
          </>
        )}
      </ToggleButtonGroup>
    ));

    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');
    expect(buttons[1]).toHaveAttribute('aria-pressed', 'false');

    await user.click(buttons[1]);
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'false');
    expect(buttons[1]).toHaveAttribute('aria-pressed', 'true');
  });

  it('supports multiple selection mode', async () => {
    const user = setupUser();
    render(() => (
      <ToggleButtonGroup selectionMode="multiple">
        {() => (
          <>
            <ToggleButton toggleKey="a" aria-label="A">A</ToggleButton>
            <ToggleButton toggleKey="b" aria-label="B">B</ToggleButton>
          </>
        )}
      </ToggleButtonGroup>
    ));

    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);
    await user.click(buttons[1]);
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');
    expect(buttons[1]).toHaveAttribute('aria-pressed', 'true');
  });

  it('supports controlled selectedKeys', async () => {
    const user = setupUser();
    const onSelectionChange = vi.fn();
    render(() => (
      <ToggleButtonGroup
        selectionMode="multiple"
        selectedKeys={new Set(['a'])}
        onSelectionChange={onSelectionChange}
      >
        {() => (
          <>
            <ToggleButton toggleKey="a" aria-label="A">A</ToggleButton>
            <ToggleButton toggleKey="b" aria-label="B">B</ToggleButton>
          </>
        )}
      </ToggleButtonGroup>
    ));

    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');
    expect(buttons[1]).toHaveAttribute('aria-pressed', 'false');

    await user.click(buttons[1]);
    expect(onSelectionChange).toHaveBeenCalled();
  });
});
