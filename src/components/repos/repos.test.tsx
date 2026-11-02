import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { makeSnapshot } from '@/test/snapshot';
import { RepoBrowser } from './RepoBrowser.component';

const { repos } = makeSnapshot();
const renderBrowser = () => {
  const user = userEvent.setup();
  render(<RepoBrowser repos={repos} />);
  return user;
};
const repoNames = () => within(screen.getByRole('list', { name: 'Repositories' })).getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent);

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

  it('should group repos by the month they were last pushed', () => {
    renderBrowser();
    const months = within(screen.getByRole('list', { name: 'Repositories' })).getAllByRole('heading', { level: 2 });
    expect(months[0]).toHaveTextContent('Nov 2026 · 3 repos');
  });

  it('should sort by stars', async () => {
    const user = renderBrowser();
    await user.click(screen.getByRole('button', { name: 'Stars' }));
    expect(repoNames()[0]).toBe('Proton-ish');
  });

  it('should sort by creation date, newest first', async () => {
    const user = renderBrowser();
    await user.click(screen.getByRole('button', { name: 'Created' }));
    expect(repoNames()[0]).toBe('gamedev-studio');
  });

  it('should flip the direction when the active sort is clicked again', async () => {
    const user = renderBrowser();
    await user.click(screen.getByRole('button', { name: 'Created' }));
    await user.click(screen.getByRole('button', { name: /Created/ }));
    expect(repoNames()[0]).toBe('Portfolio');
  });

  it('should sort by name, A to Z, ignoring case', async () => {
    const user = renderBrowser();
    await user.click(screen.getByRole('button', { name: 'Name' }));
    expect(repoNames()[0]).toBe('cheatsheet-app');
  });

  it('should show an empty state when nothing matches', async () => {
    const user = renderBrowser();
    await user.type(screen.getByRole('searchbox', { name: 'Search repos' }), 'zzzzqq');
    expect(screen.getByText(/no repos match/i)).toBeInTheDocument();
  });

  it('should show an empty state when GitHub is unreachable', () => {
    render(<RepoBrowser repos={[]} />);
    expect(screen.getByText(/couldn.t reach GitHub/i)).toBeInTheDocument();
  });
});
