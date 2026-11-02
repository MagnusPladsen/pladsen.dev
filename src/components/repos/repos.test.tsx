import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { TEST_NOW, makeSnapshot } from '@/test/snapshot';
import { RepoBrowser } from './RepoBrowser.component';

const { repos } = makeSnapshot();
const renderBrowser = () => {
  const user = userEvent.setup();
  render(<RepoBrowser repos={repos} now={TEST_NOW} />);
  return user;
};
const repoNames = () => within(screen.getByRole('list', { name: 'Repositories' })).getAllByRole('heading').map((heading) => heading.textContent);

describe('RepoBrowser', () => {
  it('should list every repo, newest push first', () => {
    renderBrowser();
    expect(repoNames()).toEqual(repos.map((repo) => repo.name));
  });

  it('should fuzzy search repo names', async () => {
    const user = renderBrowser();
    await user.type(screen.getByRole('searchbox', { name: 'Search repos' }), 'gmdv');
    expect(repoNames()).toEqual(['gamedev-studio']);
  });

  it('should hide forks when showing originals only', async () => {
    const user = renderBrowser();
    await user.click(screen.getByRole('checkbox', { name: 'Originals only' }));
    expect(repoNames()).not.toContain('Proton-ish');
  });

  it('should filter by language', async () => {
    const user = renderBrowser();
    await user.click(screen.getByRole('button', { name: 'Shell' }));
    expect(repoNames()).toEqual(['dotfiles']);
  });

  it('should sort by stars', async () => {
    const user = renderBrowser();
    await user.selectOptions(screen.getByRole('combobox', { name: 'Sort by' }), 'stars');
    expect(repoNames()[0]).toBe('Proton-ish');
  });

  it('should show an empty state when nothing matches', async () => {
    const user = renderBrowser();
    await user.type(screen.getByRole('searchbox', { name: 'Search repos' }), 'zzzzqq');
    expect(screen.getByText(/no repos match/i)).toBeInTheDocument();
  });

  it('should show an empty state when GitHub is unreachable', () => {
    render(<RepoBrowser repos={[]} now={TEST_NOW} />);
    expect(screen.getByText(/couldn.t reach GitHub/i)).toBeInTheDocument();
  });
});
