import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeSnapshot } from '@/test/snapshot';
import { Nav } from './Nav.component';
import { getPaletteItems } from './palette-items';

const push = vi.fn();
vi.mock('next/navigation', () => ({ usePathname: () => '/repos', useRouter: () => ({ push }) }));

const { repos } = makeSnapshot();

function renderNav() {
  const user = userEvent.setup();
  render(<Nav repos={repos} />);
  return user;
}

beforeEach(() => push.mockClear());

describe('Nav', () => {
  it('should mark the current page', () => {
    renderNav();
    expect(screen.getByRole('link', { name: 'Repos' })).toHaveAttribute('aria-current', 'page');
  });

  it('should not mark other pages as current', () => {
    renderNav();
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });
});

describe('Command palette', () => {
  it('should open with cmd+k', async () => {
    const user = renderNav();
    await user.keyboard('{Meta>}k{/Meta}');
    expect(screen.getByRole('dialog', { name: 'Search' })).toBeInTheDocument();
  });

  it('should open with ctrl+k', async () => {
    const user = renderNav();
    await user.keyboard('{Control>}k{/Control}');
    expect(screen.getByRole('dialog', { name: 'Search' })).toBeInTheDocument();
  });

  it('should open when the top bar is clicked', async () => {
    const user = renderNav();
    await user.click(screen.getByRole('banner'));
    expect(screen.getByRole('dialog', { name: 'Search' })).toBeInTheDocument();
  });

  it('should not open when a nav link is clicked', async () => {
    const user = renderNav();
    await user.click(screen.getByRole('link', { name: 'Apps' }));
    expect(screen.queryByRole('dialog', { name: 'Search' })).not.toBeInTheDocument();
  });

  it('should fuzzy search apps and repos', async () => {
    const user = renderNav();
    await user.click(screen.getByRole('button', { name: /Search/ }));
    await user.type(screen.getByRole('combobox', { name: 'Search pages, apps and repos' }), 'gmdv');
    const options = within(screen.getByRole('listbox')).getAllByRole('option');
    expect(options.every((option) => /gamedev/i.test(option.textContent ?? ''))).toBe(true);
  });

  it('should list every app when the query is empty', async () => {
    const user = renderNav();
    await user.click(screen.getByRole('button', { name: /Search/ }));
    const listedLabels = within(screen.getByRole('listbox')).getAllByRole('option').map((option) => option.textContent ?? '');
    const appNames = getPaletteItems(repos).filter((item) => item.group === 'Apps').map((item) => item.label);
    expect(appNames.every((name) => listedLabels.some((label) => label.includes(name)))).toBe(true);
  });

  it('should go to a page on Enter', async () => {
    const user = renderNav();
    await user.click(screen.getByRole('button', { name: /Search/ }));
    await user.type(screen.getByRole('combobox', { name: 'Search pages, apps and repos' }), 'apps{Enter}');
    expect(push).toHaveBeenCalledWith('/apps');
  });

  it('should close on Escape', async () => {
    const user = renderNav();
    await user.click(screen.getByRole('button', { name: /Search/ }));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Search' })).not.toBeInTheDocument();
  });
});
