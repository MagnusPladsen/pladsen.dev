import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SiteContentProvider } from '@/components/site/SiteContentProvider.component';
import techData from '@/components/tech/tech.data';
import { TEST_NOW, makeSnapshot } from '@/test/snapshot';
import { Editor } from '../Editor.component';

const TECH_COUNT = techData.reduce((sum, group) => sum + group.techs.length, 0);

function renderEditor() {
  const user = userEvent.setup();
  render(
    <SiteContentProvider>
      <Editor snapshot={makeSnapshot()} now={TEST_NOW} />
    </SiteContentProvider>,
  );
  return user;
}

describe('Search panel', () => {
  it('should list fuzzy matches with a count', async () => {
    const user = renderEditor();
    await user.click(screen.getByRole('button', { name: 'Search' }));
    await user.type(screen.getByRole('searchbox', { name: /search repos/i }), 'clde');
    const results = screen.getByRole('list', { name: /search results/i });
    expect(within(results).getByRole('link', { name: /claude-mods/ })).toHaveAttribute('href', 'https://github.com/MagnusPladsen/claude-mods');
    expect(screen.getByText('1 of 8 repos')).toBeInTheDocument();
  });
});

describe('Source Control panel', () => {
  it('should expand a repo, show its commits and filter the Git Graph', async () => {
    const user = renderEditor();
    await user.click(screen.getByRole('button', { name: 'Source Control' }));
    await user.click(screen.getByRole('button', { name: /claude-mods/ }));
    const commits = screen.getByRole('list', { name: 'claude-mods commits' });
    expect(within(commits).getAllByRole('link')).toHaveLength(4);
    expect(screen.getByRole('tab', { name: 'Git Graph' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('$ git log --graph -6 claude-mods')).toBeInTheDocument();
  });

  it('should collapse and show all repos when clicked again', async () => {
    const user = renderEditor();
    await user.click(screen.getByRole('button', { name: 'Source Control' }));
    await user.click(screen.getByRole('button', { name: /claude-mods/ }));
    await user.click(screen.getByRole('button', { name: /claude-mods/ }));
    expect(screen.queryByRole('list', { name: 'claude-mods commits' })).not.toBeInTheDocument();
    expect(screen.getByText('$ git log --graph --all --author=magnus')).toBeInTheDocument();
  });

  it('should clear the filter from the graph header', async () => {
    const user = renderEditor();
    await user.click(screen.getByRole('button', { name: 'Source Control' }));
    await user.click(screen.getByRole('button', { name: /dotfiles/ }));
    await user.click(screen.getByRole('button', { name: /show all repos/ }));
    expect(screen.getByText('$ git log --graph --all --author=magnus')).toBeInTheDocument();
  });
});

describe('Extensions panel', () => {
  it('should badge the activity icon until opened', async () => {
    const user = renderEditor();
    const button = screen.getByRole('button', { name: 'Extensions' });
    expect(within(button).getByText(String(TECH_COUNT))).toBeInTheDocument();
    await user.click(button);
    expect(within(button).queryByText(String(TECH_COUNT))).not.toBeInTheDocument();
  });

  it('should list every tech as installed', async () => {
    const user = renderEditor();
    await user.click(screen.getByRole('button', { name: 'Extensions' }));
    expect(screen.getAllByText('Installed')).toHaveLength(TECH_COUNT);
    expect(screen.getByText('Agentic coding in the terminal')).toBeInTheDocument();
  });
});
