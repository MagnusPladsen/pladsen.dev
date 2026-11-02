import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        site: {
          bg: 'var(--bg)',
          fg: 'var(--fg)',
          text2: 'var(--text2)',
          muted: 'var(--muted)',
          dim: 'var(--dim)',
          faint: 'var(--faint)',
          line: 'var(--line)',
          tile: 'var(--tile)',
          'tile-border': 'var(--tile-border)',
          panel: 'var(--panel)',
          hover: 'var(--hover)',
          pop: 'var(--pop-bg)',
          kw: 'var(--kw)',
          str: 'var(--str)',
          fn: 'var(--fn)',
          num: 'var(--num)',
          com: 'var(--com)',
          accent: 'var(--site-accent)',
          ok: '#4ade80',
          warn: '#fbbf24',
          err: '#f87171',
          info: '#60a5fa',
          violet: '#c084fc',
          indigo: '#6366f1',
          cyan: '#22d3ee',
          ink: '#0a0a0a',
          'mac-red': '#ff5f57',
          'mac-yellow': '#febc2e',
          'mac-green': '#28c840',
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
