'use client';

import { createContext, useContext, useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { DEFAULT_CONTENT, type SiteContent } from '@/lib/site-content';
import { DEFAULT_ACCENT, THEMES, getNextTheme, isValidAccent, type ThemeName } from '@/lib/themes';

const SETTINGS_KEY = 'pladsen.settings';

export type FieldPath =
  | ['developer', keyof SiteContent['developer']]
  | ['ctas', keyof SiteContent['ctas']]
  | ['copy', keyof SiteContent['copy']]
  | ['featured', number, 'name' | 'desc'];

interface SiteContentValue {
  content: SiteContent;
  setField: (path: FieldPath, value: string) => void;
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  cycleTheme: () => void;
  accent: string;
  accentDraft: string;
  setAccentDraft: (value: string) => void;
}

const SiteContentContext = createContext<SiteContentValue | null>(null);

function readSettings(): { theme?: ThemeName; accent?: string } {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(SETTINGS_KEY) ?? '{}');
    if (typeof parsed !== 'object' || parsed === null) return {};
    const { theme, accent } = parsed as Record<string, unknown>;
    return {
      theme: typeof theme === 'string' && theme in THEMES ? (theme as ThemeName) : undefined,
      accent: typeof accent === 'string' && isValidAccent(accent) ? accent : undefined,
    };
  } catch {
    return {};
  }
}

function writeSettings(settings: { theme: ThemeName; accent: string }): void {
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Storage blocked (private mode); settings stay in memory.
  }
}

export function applyField(content: SiteContent, path: FieldPath, value: string): SiteContent {
  if (path[0] === 'featured') {
    const [, index, key] = path;
    return { ...content, featured: content.featured.map((app, i) => (i === index ? { ...app, [key]: value } : app)) };
  }
  const [group, key] = path;
  return { ...content, [group]: { ...content[group], [key]: value } };
}

function toThemeStyle(theme: ThemeName, accent: string): CSSProperties {
  const variables = Object.fromEntries(Object.entries(THEMES[theme]).map(([key, value]) => [`--${key}`, value]));
  return { ...variables, '--site-accent': accent, colorScheme: THEMES[theme].scheme } as CSSProperties;
}

export function SiteContentProvider({ children }: { children: ReactNode }): ReactNode {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [theme, setThemeState] = useState<ThemeName>('Dark');
  const [accent, setAccent] = useState(DEFAULT_ACCENT);
  const [accentDraft, setAccentDraftState] = useState(DEFAULT_ACCENT);
  const [hasLoadedSettings, setHasLoadedSettings] = useState(false);

  useEffect(() => {
    const saved = readSettings();
    if (saved.theme) setThemeState(saved.theme);
    if (saved.accent) {
      setAccent(saved.accent);
      setAccentDraftState(saved.accent);
    }
    setHasLoadedSettings(true);
  }, []);

  useEffect(() => {
    if (hasLoadedSettings) writeSettings({ theme, accent });
  }, [hasLoadedSettings, theme, accent]);

  const value = useMemo<SiteContentValue>(
    () => ({
      content,
      setField: (path, fieldValue) => setContent((current) => applyField(current, path, fieldValue)),
      theme,
      setTheme: setThemeState,
      cycleTheme: () => setThemeState((current) => getNextTheme(current)),
      accent,
      accentDraft,
      setAccentDraft: (draft) => {
        setAccentDraftState(draft);
        if (isValidAccent(draft)) setAccent(draft);
      },
    }),
    [content, theme, accent, accentDraft],
  );

  return (
    <SiteContentContext.Provider value={value}>
      <div data-theme={theme} style={toThemeStyle(theme, accent)} className="site-root">
        {children}
      </div>
    </SiteContentContext.Provider>
  );
}

export function useSiteContent(): SiteContentValue {
  const value = useContext(SiteContentContext);
  if (!value) throw new Error('useSiteContent must be used inside SiteContentProvider');
  return value;
}
