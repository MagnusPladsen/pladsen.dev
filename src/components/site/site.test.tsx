import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Nav } from './Nav.component';

vi.mock('next/navigation', () => ({ usePathname: () => '/repos' }));

describe('Nav', () => {
  it('should mark the current page', () => {
    render(<Nav />);
    expect(screen.getByRole('link', { name: 'Repos' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });
});
