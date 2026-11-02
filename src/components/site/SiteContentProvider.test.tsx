import { act, render, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SiteContentProvider, useSiteContent } from './SiteContentProvider.component';

const wrapper = ({ children }: { children: ReactNode }) => <SiteContentProvider>{children}</SiteContentProvider>;

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe('SiteContentProvider', () => {
  it('updates a developer field', () => {
    const { result } = renderHook(() => useSiteContent(), { wrapper });
    act(() => result.current.setField(['developer', 'name'], 'Ada'));
    expect(result.current.content.developer.name).toBe('Ada');
  });

  it('updates one featured app', () => {
    const { result } = renderHook(() => useSiteContent(), { wrapper });
    act(() => result.current.setField(['featured', 1, 'desc'], 'x'));
    expect(result.current.content.featured[1].desc).toBe('x');
    expect(result.current.content.featured[0].name).toBe('gamedev-studio');
  });

  it('keeps the last valid accent', () => {
    const { result } = renderHook(() => useSiteContent(), { wrapper });
    act(() => result.current.setAccentDraft('#22d3ee'));
    expect(result.current.accent).toBe('#22d3ee');
    act(() => result.current.setAccentDraft('#ff'));
    expect(result.current.accentDraft).toBe('#ff');
    expect(result.current.accent).toBe('#22d3ee');
  });

  it('cycles Dark → Light → CRT → Dark', () => {
    const { result } = renderHook(() => useSiteContent(), { wrapper });
    const seen = [result.current.theme];
    for (let i = 0; i < 3; i += 1) {
      act(() => result.current.cycleTheme());
      seen.push(result.current.theme);
    }
    expect(seen).toEqual(['Dark', 'Light', 'CRT', 'Dark']);
  });

  it('survives localStorage throwing', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const { result } = renderHook(() => useSiteContent(), { wrapper });
    act(() => result.current.cycleTheme());
    expect(result.current.theme).toBe('Light');
    expect(result.current.accent).toBe('#f97316');
  });

  it('restores saved theme and accent', () => {
    window.localStorage.setItem('pladsen.settings', JSON.stringify({ theme: 'CRT', accent: '#4ade80' }));
    const { result } = renderHook(() => useSiteContent(), { wrapper });
    expect(result.current.theme).toBe('CRT');
    expect(result.current.accent).toBe('#4ade80');
  });

  it('exposes theme and accent as CSS variables on its wrapper', () => {
    const { container } = render(<SiteContentProvider>child</SiteContentProvider>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.theme).toBe('Dark');
    expect(root.style.getPropertyValue('--accent')).toBe('#f97316');
    expect(root.style.getPropertyValue('--bg')).toBe('#07080b');
  });
});
