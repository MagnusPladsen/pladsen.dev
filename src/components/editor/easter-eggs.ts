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
} as const;

export type EasterEggId = keyof typeof EASTER_EGGS;

export const EASTER_EGG_COUNT = Object.keys(EASTER_EGGS).length;

export function isEggHunt(text: string): boolean {
  return /easter|\beggs?\b/i.test(text);
}
