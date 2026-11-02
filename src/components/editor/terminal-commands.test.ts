import { describe, expect, it } from 'vitest';
import { DEFAULT_CONTENT } from '@/lib/site-content';
import { makeSnapshot } from '@/test/snapshot';
import { runTerminalCommand } from './terminal-commands';

const snapshot = makeSnapshot();
const context = { content: DEFAULT_CONTENT, snapshot, techNames: ['React', 'TypeScript'], history: ['whoami', 'ls'] };
const text = (input: string) => runTerminalCommand(input, context).lines.map((line) => line.text).join('\n');

describe('runTerminalCommand', () => {
  it('should list every everyday command for help', () => {
    for (const command of ['whoami', 'ls', 'cat journey.md', 'git log', 'code --list-extensions', 'neofetch', 'hire magnus', 'run', 'theme', 'history', 'clear']) {
      expect(text('help')).toContain(command);
    }
  });

  it('should hint at easter eggs in help without naming the secret commands', () => {
    const help = text('help');
    expect(help).toMatch(/\d+ easter eggs/);
    expect(help).not.toContain('sudo ping magnus');
    expect(help).not.toContain('make sandwich');
  });

  it('should use the edited name for whoami', () => {
    const edited = { ...context, content: { ...DEFAULT_CONTENT, developer: { ...DEFAULT_CONTENT.developer, name: 'Ada' } } };
    expect(runTerminalCommand('whoami', edited).lines[0].text).toContain('Ada');
  });

  it('should print the three newest pushes for git log', () => {
    const output = runTerminalCommand('git log', context).lines;
    expect(output).toHaveLength(3);
    expect(output[0].text).toContain(snapshot.recent[0].commits[0].shortSha);
  });

  it('should end sudo ping magnus on a success line', () => {
    const output = runTerminalCommand('sudo ping magnus', context).lines;
    expect(output.at(-1)).toMatchObject({ tone: 'success' });
    expect(output.at(-1)?.text).toContain('Magnus is online');
  });

  it('should return a theme effect for theme crt', () => {
    expect(runTerminalCommand('theme crt', context).effect).toEqual({ kind: 'theme', theme: 'CRT' });
  });

  it('should return effects for clear and run', () => {
    expect(runTerminalCommand('clear', context).effect).toEqual({ kind: 'clear' });
    expect(runTerminalCommand('run', context).effect).toEqual({ kind: 'run' });
    expect(runTerminalCommand('matrix', context).effect).toEqual({ kind: 'matrix' });
  });

  it('should list the stack for code --list-extensions', () => {
    expect(text('code --list-extensions')).toContain('React, TypeScript');
  });

  it('should joke about rm -rf / and vim', () => {
    expect(text('rm -rf /')).toContain('Nice try');
    expect(text('vim')).toContain(':q');
  });

  it('should report unknown commands as errors', () => {
    expect(runTerminalCommand('foo', context).lines[0]).toEqual({ text: 'zsh: command not found: foo', tone: 'error' });
  });

  it('should print nothing for blank input', () => {
    expect(runTerminalCommand('   ', context).lines).toEqual([]);
  });

  it.each([
    ['sudo ping magnus', 'sudo'],
    ['rm -rf /', 'rm-rf'],
    ['vim', 'vim'],
    ['cat .env', 'cat-env'],
    ['theme crt', 'crt'],
    ['run', 'run'],
    ['ls easter-eggs', 'egg-hunt'],
    ['help', 'help'],
    ['exit', 'exit'],
    [':q', 'vim-escape'],
    [':wq', 'vim-escape'],
    ['hire magnus', 'hire'],
    ['coffee', 'coffee'],
    ['brew coffee', 'coffee'],
    ['git blame', 'blame'],
    ['fortune', 'fortune'],
    ['cowsay hi', 'cowsay'],
    ['neofetch', 'neofetch'],
    ['matrix', 'matrix'],
    ['npm install', 'bun-house'],
    ['yarn', 'bun-house'],
    ['ping google.com', 'ping'],
    ['history', 'history'],
    ['sudo make sandwich', 'sandwich'],
  ])('should mark %s as the %s easter egg', (input, egg) => {
    expect(runTerminalCommand(input, context).egg).toBe(egg);
  });

  it('should answer an easter egg hunt instead of command not found', () => {
    expect(text('find . -name "*egg*"')).not.toContain('command not found');
  });

  it('should refuse a sandwich without sudo', () => {
    expect(text('make sandwich')).toContain('Make it yourself');
    expect(runTerminalCommand('make sandwich', context).egg).toBeUndefined();
  });

  it('should send ping on a trip that ends at the host', () => {
    const output = text('ping example.org');
    expect(output).toContain('example.org');
    expect(output.split('\n').length).toBeGreaterThan(4);
  });

  it('should tell plain ping magnus to use sudo', () => {
    expect(text('ping magnus')).toContain('sudo');
  });

  it('should put the text in the cow speech bubble', () => {
    expect(text('cowsay ship it')).toContain('ship it');
  });

  it('should list earlier commands for history', () => {
    expect(text('history')).toMatch(/1\s+whoami[\s\S]*2\s+ls/);
  });

  it('should show real repo numbers in neofetch', () => {
    expect(text('neofetch')).toContain(`${snapshot.totals.publicRepos}`);
  });

  it('should link contact details for hire magnus', () => {
    expect(text('hire magnus')).toContain('magnus_pladsen@hotmail.com');
  });

  it('should joke about other package managers', () => {
    expect(text('npm install')).toContain('bun');
  });
});
