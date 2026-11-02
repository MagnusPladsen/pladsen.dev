export function fuzzyMatch(text: string, query: string): boolean {
  const haystack = text.toLowerCase();
  let position = 0;
  for (const character of query.toLowerCase().replace(/\s/g, '')) {
    position = haystack.indexOf(character, position);
    if (position === -1) return false;
    position += 1;
  }
  return true;
}
