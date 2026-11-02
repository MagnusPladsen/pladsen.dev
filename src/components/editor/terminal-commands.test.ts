import { describe, expect, it } from 'vitest';
import { DEFAULT_CONTENT } from '@/lib/site-content';
import { makeSnapshot } from '@/test/snapshot';
import { runTerminalCommand } from './terminal-commands';

const snapshot = makeSnapshot();
const context = { content: DEFAULT_CONTENT, snapshot, techNames: ['React', 'TypeScript'] };
const text = (input: string) => runTerminalCommand(input, context).lines.map((line) => line.text).join('\n');

describe('runTerminalCommand', () => {
  it('should list every command for help', () => {
    for (const command of ['ls', 'whoami', 'cat journey.md', 'git log', 'sudo ping magnus', 'code --list-extensions', 'run', 'theme', 'clear']) {
      expect(text('help')).toContain(command);
    }
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
  ])('should mark %s as the %s easter egg', (input, egg) => {
    expect(runTerminalCommand(input, context).egg).toBe(egg);
  });

  it('should answer an easter egg hunt instead of command not found', () => {
    expect(text('find . -name "*egg*"')).not.toContain('command not found');
  });
});
