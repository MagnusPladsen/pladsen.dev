import type { GitHubSnapshot } from '@/lib/github/types';
import type { SiteContent } from '@/lib/site-content';
import { THEME_NAMES, type ThemeName } from '@/lib/themes';

export type TerminalTone = 'muted' | 'success' | 'warning' | 'error' | 'plain';

export interface TerminalLine {
  text: string;
  tone: TerminalTone;
}

export type TerminalEffect = { kind: 'clear' } | { kind: 'run' } | { kind: 'theme'; theme: ThemeName };

export interface TerminalResult {
  lines: TerminalLine[];
  effect?: TerminalEffect;
}

export interface TerminalContext {
  content: SiteContent;
  snapshot: GitHubSnapshot;
  techNames: string[];
}

const line = (text: string, tone: TerminalTone = 'muted'): TerminalLine => ({ text, tone });

const HELP = 'help · ls · whoami · cat journey.md · git log · sudo ping magnus · code --list-extensions · run · theme dark|light|crt · clear';

function getStaticOutput(command: string, context: TerminalContext): TerminalLine[] | undefined {
  const { developer } = context.content;
  const outputs: Record<string, () => TerminalLine[]> = {
    help: () => [line(HELP)],
    ls: () => [line('page.tsx  journey.md  settings.json  .env  apps/  repos/')],
    whoami: () => [line(`${developer.name} — ${developer.role}, ${developer.location}`)],
    'cat journey.md': () => [
      line('## Work · 2022 – now'),
      line('Thrilled to be working as a full stack developer at Abaris Consulting AS.'),
      line('## School · 2022 – 2024'),
      line('2 year frontend development course at Noroff. Graduated in 2024 with an A on the last exam.'),
    ],
    'git log': () =>
      context.snapshot.recent.slice(0, 3).map((repo) => line(`${repo.commits[0].shortSha} ${repo.name}: ${repo.commits[0].subject}`)),
    'sudo ping magnus': () => [
      line('[sudo] password for visitor: ********'),
      line('PING magnus (Lillehammer): 64 bytes, time=1ms'),
      line('✓ Magnus is online. Say hi on Discord.', 'success'),
    ],
    'code --list-extensions': () => [line(context.techNames.join(', ')), line('→ or click the Extensions icon in the activity bar', 'plain')],
    'cat .env': () => [line('nice try.', 'warning')],
    'rm -rf /': () => [line('Nice try. This site is immutable (and on Vercel).', 'error')],
    vim: () => [line('You are already in an editor. :q', 'warning')],
  };
  return outputs[command]?.();
}

export function runTerminalCommand(input: string, context: TerminalContext): TerminalResult {
  const command = input.trim();
  if (!command) return { lines: [] };
  if (command === 'clear') return { lines: [], effect: { kind: 'clear' } };
  if (command === 'run' || command === 'bun run dev') return { lines: [], effect: { kind: 'run' } };

  const themeMatch = command.match(/^theme (dark|light|crt)$/i);
  if (themeMatch) {
    const theme = THEME_NAMES.find((name) => name.toLowerCase() === themeMatch[1].toLowerCase())!;
    return { lines: [line(`✓ theme set to ${theme}`, 'success')], effect: { kind: 'theme', theme } };
  }

  return { lines: getStaticOutput(command, context) ?? [line(`zsh: command not found: ${command}`, 'error')] };
}
