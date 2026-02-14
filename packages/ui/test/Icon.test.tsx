/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { setupUser } from '@proyecto-viviana/ui-test-utils';
import { Icon } from '../src/icon';
import { GitHubIcon } from '../src/icon/icons/GitHubIcon';

describe('Icon (ui)', () => {
  it('renders as non-interactive content by default', () => {
    const { container } = render(() => <Icon icon={GitHubIcon} />);
    expect(container.querySelector('span.vui-icon')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders as a semantic button when onClick is provided', async () => {
    const user = setupUser();
    const onClick = vi.fn();

    render(() => <Icon icon={GitHubIcon} onClick={onClick} aria-label="Open GitHub" />);

    const button = screen.getByRole('button', { name: 'Open GitHub' });
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
