export type ThemeName = 'Dark' | 'Light' | 'CRT';

export const THEME_NAMES: ThemeName[] = ['Dark', 'Light', 'CRT'];
export const DEFAULT_ACCENT = '#f97316';

export const THEMES: Record<ThemeName, Record<string, string>> = {
  Dark: { bg: '#07080b', fg: '#fafafa', text2: '#d4d4d8', muted: '#a1a1aa', dim: '#71717a', faint: '#52525b', line: '#1c1c20', tile: 'rgba(17,17,20,.72)', 'tile-border': 'rgba(255,255,255,.08)', panel: 'rgba(10,10,12,.5)', hover: 'rgba(255,255,255,.05)', 'pop-bg': '#141418', kw: '#c084fc', str: '#86efac', fn: '#93c5fd', num: '#fdba74', com: '#52525b', blob: '.26', 'theme-font': 'var(--font-geist-sans), system-ui, sans-serif', scheme: 'dark' },
  Light: { bg: '#f5f5f3', fg: '#18181b', text2: '#3f3f46', muted: '#52525b', dim: '#71717a', faint: '#a1a1aa', line: '#e4e4e7', tile: 'rgba(255,255,255,.78)', 'tile-border': 'rgba(0,0,0,.09)', panel: 'rgba(244,244,245,.85)', hover: 'rgba(0,0,0,.04)', 'pop-bg': '#ffffff', kw: '#7e22ce', str: '#15803d', fn: '#1d4ed8', num: '#c2410c', com: '#a1a1aa', blob: '.16', 'theme-font': 'var(--font-geist-sans), system-ui, sans-serif', scheme: 'light' },
  CRT: { bg: '#020802', fg: '#7dff9b', text2: '#6be38a', muted: '#55c873', dim: '#3f9a58', faint: '#2a6b3b', line: '#0f2a14', tile: 'rgba(4,18,7,.82)', 'tile-border': 'rgba(125,255,155,.2)', panel: 'rgba(3,14,5,.85)', hover: 'rgba(125,255,155,.07)', 'pop-bg': '#041206', kw: '#b4ffc6', str: '#7dff9b', fn: '#a8ffbd', num: '#d8ffe1', com: '#2a6b3b', blob: '.08', 'theme-font': 'var(--font-geist-mono), monospace', scheme: 'dark' },
};

export function isValidAccent(value: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(value);
}

export function getNextTheme(theme: ThemeName): ThemeName {
  return THEME_NAMES[(THEME_NAMES.indexOf(theme) + 1) % THEME_NAMES.length];
}
