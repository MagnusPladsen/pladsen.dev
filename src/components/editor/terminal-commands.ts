import contactInfo from '@/lib/contactInfo';
import type { GitHubSnapshot } from '@/lib/github/types';
import type { SiteContent } from '@/lib/site-content';
import { THEME_NAMES, type ThemeName } from '@/lib/themes';
import { EASTER_EGG_COUNT, isEggHunt, type EasterEggId } from './easter-eggs';

export type TerminalTone = 'muted' | 'success' | 'warning' | 'error' | 'plain';

export interface TerminalLine {
  text: string;
  tone: TerminalTone;
}

export type TerminalEffect = { kind: 'clear' } | { kind: 'run' } | { kind: 'matrix' } | { kind: 'theme'; theme: ThemeName };

export interface TerminalResult {
  lines: TerminalLine[];
  effect?: TerminalEffect;
  egg?: EasterEggId;
}

export interface TerminalContext {
  content: SiteContent;
  snapshot: GitHubSnapshot;
  techNames: string[];
  history: string[];
}

type CommandOutput = { lines: TerminalLine[]; egg?: EasterEggId };

const line = (text: string, tone: TerminalTone = 'muted'): TerminalLine => ({ text, tone });

const HELP: TerminalLine[] = [
  line('pladsen.dev terminal · zsh-ish · ↑ recalls your last command', 'plain'),
  line('  whoami                   who built this'),
  line("  ls                       what's in here"),
  line('  cat journey.md           work and school'),
  line('  git log                  latest real pushes'),
  line('  code --list-extensions   the stack'),
  line('  neofetch                 the whole picture'),
  line('  contact magnus           get in touch'),
  line('  run                      build and preview page.tsx'),
  line('  theme dark|light|crt     change the look'),
  line('  history · clear          housekeeping'),
  line(`🥚 ${EASTER_EGG_COUNT} easter eggs are hidden on this page. hints:`, 'success'),
  line("  · type what you'd type on a bad day, then try to leave", 'plain'),
  line('  · developers run on caffeine, and on bun', 'plain'),
  line('  · the editor rewards the curious: hover, edit, open the dotfile', 'plain'),
  line("  · there's always someone to blame, and always someone hungry", 'plain'),
  line('  · old gamers still know the code', 'plain'),
  line('  · this site was pair-programmed with an AI. it left traces, and slash commands', 'plain'),
];

const FORTUNES = [
  'It works on my machine. — every developer, ever',
  'There are two hard things in computer science: cache invalidation, naming things, and off-by-one errors.',
  'Weeks of coding can save you hours of planning.',
  'The best code is no code at all.',
  'First, solve the problem. Then, write the code.',
  'Deleted code is debugged code.',
  'A ship in port is safe, but that is not what ships are built for. Ship it.',
];

const COFFEE: TerminalLine[] = [
  line('      ( (', 'plain'),
  line('       ) )', 'plain'),
  line('    ........', 'plain'),
  line('    |      |]', 'plain'),
  line('    \\      /', 'plain'),
  line("     `----'", 'plain'),
  line('☕ brewed. productivity +40%, sleep -2h', 'success'),
];

function getCowsay(text: string): TerminalLine[] {
  const border = '-'.repeat(text.length + 2);
  return [` ${border}`, `< ${text} >`, ` ${border}`, '        \\   ^__^', '         \\  (oo)\\_______', '            (__)\\       )\\/\\', '                ||----w |', '                ||     ||'].map((row) =>
    line(row, 'plain'),
  );
}

function getPing(host: string): TerminalLine[] {
  return [
    line(`PING ${host}: following one brave packet around the world…`, 'plain'),
    line("64 bytes from a router in Lillehammer: time=1ms (it's -14°C, the packet wore a jacket)"),
    line('64 bytes from an Oslo exchange: time=6ms (stopped for a brown cheese sandwich)'),
    line('64 bytes from a North Sea cable: time=19ms (a curious seal tapped the fibre)'),
    line('64 bytes from a server rack in a field of cows: time=27ms (moo)'),
    line(`64 bytes from ${host}: time=31ms (it asked who sent you)`),
    line(`--- ${host} ping statistics ---`, 'plain'),
    line('5 packets transmitted, 5 received, 0% loss, 1 seal, 3 cows', 'success'),
  ];
}

function getNeofetch({ snapshot, techNames }: TerminalContext): TerminalLine[] {
  const stars = snapshot.repos.reduce((total, repo) => total + repo.stars, 0);
  const languages = snapshot.languages.map((language) => language.name).join(', ') || 'TypeScript';
  return [
    line('   ▄▄▄▄▄▄     magnus@pladsen.dev', 'success'),
    line('  █ ▄▄▄ █    ------------------', 'success'),
    line(`  █ █▄█ █    OS: pladsen.dev on Vercel · ${contactInfo.location}`, 'plain'),
    line(`  █▄▄▄▄▄█    Uptime: ${new Date().getFullYear() - 2022} years of shipping (since 2022)`, 'plain'),
    line(`             Repos: ${snapshot.totals.publicRepos} public · ${snapshot.totals.originals} originals · ${stars} ★`, 'plain'),
    line(`             Languages: ${languages}`, 'plain'),
    line(`             Packages: ${techNames.length} (code --list-extensions)`, 'plain'),
    line('             Shell: zsh-ish · Editor: this one · Fuel: coffee', 'plain'),
  ];
}

function getContact(): TerminalLine[] {
  const [github, linkedin] = contactInfo.socials;
  return [
    line('$ bun add magnus', 'plain'),
    line('resolving magnus@latest…'),
    line('[████████████████████] 100%  installed in 0.4s'),
    line('+ magnus@2022.0.0  full-stack · coffee-powered · ships on Fridays', 'success'),
    line(`  email     ${contactInfo.email}`, 'plain'),
    line(`  linkedin  ${linkedin.link}`, 'plain'),
    line(`  github    ${github.link}`, 'plain'),
  ];
}

const CLAUDE_WELCOME: TerminalLine[] = [
  line('╭──────────────────────────────────────────╮', 'plain'),
  line('│ ✻ Welcome to Claude Code!                │', 'success'),
  line('│                                          │', 'plain'),
  line('│   /help for help, /cost for the bill     │', 'plain'),
  line('│   cwd: ~/pladsen.dev                     │', 'plain'),
  line('╰──────────────────────────────────────────╯', 'plain'),
  line('> build me a portfolio with too many easter eggs'),
  line(`⏺ On it. Adding easter egg #${EASTER_EGG_COUNT + 1}…`, 'success'),
];

const SLASH_COMMANDS: Record<string, TerminalLine[]> = {
  '/init': [line('Analyzing codebase…'), line('✓ created CLAUDE.md: "# pladsen.dev: mostly easter eggs, some portfolio"', 'success')],
  '/compact': [line('Compacting conversation…'), line('✓ Magnus, summarised: ships web apps, drinks coffee, hides eggs.', 'success')],
  '/cost': [line('Total cost:      1 coffee', 'plain'), line('Total duration:  since 2022', 'plain'), line('Total code changes: yes', 'plain')],
  '/help': [line('wrong terminal, but nice instinct. try plain help.', 'warning')],
};

function getHistory(history: string[]): TerminalLine[] {
  if (history.length === 0) return [line('no history yet. you are a blank slate.')];
  return history.map((command, index) => line(`${String(index + 1).padStart(4)}  ${command}`));
}

function getStaticOutput(command: string, context: TerminalContext): CommandOutput | undefined {
  const { developer } = context.content;
  const outputs: Record<string, () => CommandOutput> = {
    help: () => ({ lines: HELP, egg: 'help' }),
    ls: () => ({ lines: [line('page.tsx  journey.md  settings.json  .env  apps/  repos/')] }),
    whoami: () => ({ lines: [line(`${developer.name} — ${developer.role}, ${developer.location}`)] }),
    'cat journey.md': () => ({
      lines: [
        line('## Work · 2022 – now'),
        line('Thrilled to be working as a full stack developer at Abaris Consulting AS.'),
        line('## School · 2022 – 2024'),
        line('2 year frontend development course at Noroff. Graduated in 2024 with an A on the last exam.'),
      ],
    }),
    'git log': () => ({
      lines: context.snapshot.recent.slice(0, 3).map((repo) => line(`${repo.commits[0].shortSha} ${repo.name}: ${repo.commits[0].subject}`)),
    }),
    'git blame': () => ({ lines: [line("it was Magnus. it's always Magnus.", 'warning'), line("(a1b2c3d · Fri 02:47 · 'quick fix, will clean up later')")], egg: 'blame' }),
    'sudo ping magnus': () => ({
      lines: [line('[sudo] password for visitor: ********'), line('PING magnus (Lillehammer): 64 bytes, time=1ms'), line('✓ Magnus is online. Say hi on Discord.', 'success')],
      egg: 'sudo',
    }),
    'ping magnus': () => ({ lines: [line('ping: permission denied. Magnus only answers to sudo.', 'warning')] }),
    'code --list-extensions': () => ({ lines: [line(context.techNames.join(', ')), line('→ or click the Extensions icon in the activity bar', 'plain')] }),
    'cat .env': () => ({ lines: [line('nice try.', 'warning')], egg: 'cat-env' }),
    'rm -rf /': () => ({ lines: [line('Nice try. This site is immutable (and on Vercel).', 'error')], egg: 'rm-rf' }),
    vim: () => ({ lines: [line('You are already in an editor. :q', 'warning')], egg: 'vim' }),
    exit: () => ({ lines: [line('There is no escape. You live here now.', 'warning')], egg: 'exit' }),
    'contact magnus': () => ({ lines: getContact(), egg: 'contact' }),
    coffee: () => ({ lines: COFFEE, egg: 'coffee' }),
    'brew coffee': () => ({ lines: COFFEE, egg: 'coffee' }),
    fortune: () => ({ lines: [line(FORTUNES[Math.floor(Math.random() * FORTUNES.length)], 'plain')], egg: 'fortune' }),
    neofetch: () => ({ lines: getNeofetch(context), egg: 'neofetch' }),
    history: () => ({ lines: getHistory(context.history), egg: 'history' }),
    claude: () => ({ lines: CLAUDE_WELCOME, egg: 'claude' }),
    'claude --dangerously-skip-permissions': () => ({
      lines: [line('Nice try. Even Claude asks before touching prod.', 'warning'), line('Permission denied. Permission to deny: granted.', 'error')],
      egg: 'yolo',
    }),
    'claude-code': () => ({
      lines: [
        line('zsh: command not found: claude-code', 'error'),
        line('Did you mean: claude', 'warning'),
        line('(the package is @anthropic-ai/claude-code. the command is just claude. everyone types it once.)', 'plain'),
      ],
      egg: 'claude-code',
    }),
    ultrathink: () => ({
      lines: [line('✻ Thinking…'), line('✻ Thinking harder…'), line('✻ Thinking really, really hard…'), line('⏺ Conclusion: the answer was more easter eggs.', 'success')],
      egg: 'ultrathink',
    }),
    'make sandwich': () => ({ lines: [line('What? Make it yourself.', 'error')] }),
    'sudo make sandwich': () => ({ lines: [line('Okay. 🥪', 'success')], egg: 'sandwich' }),
  };
  return outputs[command]?.();
}

const VIM_EXITS = [':q', ':q!', ':wq', ':x'];
const OTHER_PACKAGE_MANAGERS = /^(npm|yarn|pnpm)(\s+(i|install|add)\b.*)?$/;

function getPatternOutput(command: string): CommandOutput | undefined {
  if (command in SLASH_COMMANDS) return { lines: SLASH_COMMANDS[command], egg: 'slash' };
  if (VIM_EXITS.includes(command)) return { lines: [line('Congratulations. You escaped vim. Few ever do.', 'success')], egg: 'vim-escape' };
  if (OTHER_PACKAGE_MANAGERS.test(command)) return { lines: [line('this house uses bun. ran `bun install` instead: done in 0.4s 🐇', 'warning')], egg: 'bun-house' };
  const cowsay = command.match(/^cowsay(?:\s+(.+))?$/);
  if (cowsay) return { lines: getCowsay(cowsay[1] ?? 'moo'), egg: 'cowsay' };
  const brew = command.match(/^brew install\s+(.+)$/);
  if (brew) return { lines: [line(`Error: no formula for "${brew[1]}". Did you mean: brew coffee`, 'error')] };
  const ping = command.match(/^ping\s+(\S+)$/);
  if (ping) return { lines: getPing(ping[1]), egg: 'ping' };
  if (isEggHunt(command)) {
    return {
      lines: [line('searching for easter eggs…'), line('found 1: a developer, looking for easter eggs.', 'success'), line("hint: the good ones are never listed. try 'help'.", 'plain')],
      egg: 'egg-hunt',
    };
  }
  return undefined;
}

export function runTerminalCommand(input: string, context: TerminalContext): TerminalResult {
  const command = input.trim();
  if (!command) return { lines: [] };
  if (command === 'clear') return { lines: [], effect: { kind: 'clear' } };
  if (command === 'run' || command === 'bun run dev') return { lines: [], effect: { kind: 'run' }, egg: 'run' };
  if (command === 'matrix') return { lines: [line('wake up, visitor…', 'success')], effect: { kind: 'matrix' }, egg: 'matrix' };

  const themeMatch = command.match(/^theme (dark|light|crt)$/i);
  if (themeMatch) {
    const theme = THEME_NAMES.find((name) => name.toLowerCase() === themeMatch[1].toLowerCase())!;
    return { lines: [line(`✓ theme set to ${theme}`, 'success')], effect: { kind: 'theme', theme }, egg: theme === 'CRT' ? 'crt' : undefined };
  }

  return getStaticOutput(command, context) ?? getPatternOutput(command) ?? { lines: [line(`zsh: command not found: ${command}`, 'error')] };
}
