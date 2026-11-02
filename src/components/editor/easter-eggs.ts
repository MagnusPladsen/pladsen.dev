export const EASTER_EGGS = {
  sudo: 'sudo ping magnus',
  'rm-rf': 'rm -rf /',
  vim: 'vim inside an editor',
  'cat-env': 'cat .env',
  'env-tab': 'opened .env',
  crt: 'CRT mode',
  run: 'ran page.tsx',
  'live-edit': 'edited page.tsx',
  accent: 'custom accent colour',
  'type-hint': 'peeked at the developer type',
  'egg-hunt': 'hunted for easter eggs',
  help: 'asked for help',
  exit: 'tried to exit',
  'vim-escape': 'escaped vim',
  hire: 'hired Magnus',
  coffee: 'brewed coffee',
  blame: 'git blame',
  fortune: 'read a fortune',
  cowsay: 'made the cow talk',
  neofetch: 'neofetch',
  matrix: 'entered the matrix',
  'bun-house': 'reached for npm',
  ping: 'pinged the world',
  history: 'checked history',
  sandwich: 'sudo make sandwich',
  konami: 'Konami code',
} as const;

export type EasterEggId = keyof typeof EASTER_EGGS;

export const EASTER_EGG_COUNT = Object.keys(EASTER_EGGS).length;

export function isEggHunt(text: string): boolean {
  return /easter|\beggs?\b/i.test(text);
}
