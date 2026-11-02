# Home page "full editor" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the home page with prototype 15: hero, a VS Code–style editor whose `page.tsx` live-edits the page, featured apps, latest pushes, GitHub stats.

**Architecture:** The page is a server component that fetches one `GitHubSnapshot` (hourly ISR) and passes it to client components. All visitor-editable text, theme and accent live in one client `SiteContentProvider` (React context) wrapped around the page, so the hero, featured apps, footer and editor read and write the same state. Pure logic (GitHub transform, fuzzy match, terminal commands, commit typing) lives in plain `.ts` modules with unit tests.

**Tech Stack:** Next.js 15 (app router), React 19, TypeScript, Tailwind 3, lucide-react, Geist fonts; Vitest + @testing-library/react + jsdom for tests; bun as package manager.

**Spec:** `docs/superpowers/specs/2026-11-02-home-editor-design.md`. Visual reference: `HybridIdePro.dc.html` on the canvas artifact https://claude.ai/artifact/BhkytZFzP8mbBWbEj1GHjs (board 15). Copy every string, colour and animation from it unless this plan says otherwise.

## Global Constraints

- Package manager: bun (`bun add`, `bun run`). No npm lockfile.
- No "hire" wording anywhere. The sudo joke is `sudo ping magnus`.
- Work text: "Thrilled to be working as a full stack developer at Abaris Consulting AS." with `since: 2022`; School: "2 year frontend development course at Noroff. Graduated in 2024 with an A on the last exam."
- Featured apps in order: gamedev-studio, Proton-ish, cv-app-new, lane-kalkulator.
- Default accent `#f97316`; background `#07080b`; second aurora colour `#6366f1`; fonts Geist and Geist Mono (already loaded in `layout.tsx`).
- GitHub fetches are server-only, `next: { revalidate: 3600 }`, token from `process.env.GITHUB_TOKEN`. Never call GitHub from the browser.
- Visitor edits are not persisted. Theme and accent are saved in `localStorage` key `pladsen.settings`, every access wrapped in try/catch.
- File naming follows the repo: `Name.component.tsx` for components, kebab-case `.ts` for modules.
- Commits go through the `/commit` skill, staging specific files. No pushing without asking.

## Review Focus

1. **No token or GitHub down** — the page must still render: hero, editor, apps; pushes from the REST fallback or an empty state "couldn't reach GitHub"; no heatmap, no diff bars. (Task 2, Task 4)
2. **Visitor empties a field** — an empty `name` must not collapse the hero or make the input unclickable; input keeps a 2ch minimum. (Task 3)
3. **Invalid accent hex** (`#ff`, `orange`) — keep the last valid accent, never set an invalid CSS value. (Task 3)
4. **Repo with fewer than 6 commits** (claude-mods has 4) or an empty repo — show what exists, skip repos with no default branch. (Task 2)
5. **Phone width 375px** — no horizontal page scroll; the editor collapses. (Task 8)

---

## File Structure

```
src/lib/github/types.ts            GitHubSnapshot and related types
src/lib/github/transform.ts        pure: raw API → snapshot, commit type, relative time, timeline position
src/lib/github/fetch-snapshot.ts   server: GraphQL with token, REST fallback, never throws
src/lib/fuzzy.ts                   subsequence match
src/lib/site-content.ts            default editable content + types
src/lib/themes.ts                  Dark / Light / CRT CSS variable maps
src/components/site/SiteContentProvider.component.tsx   context: content, theme, accent, editor UI state
src/components/site/Backdrop.component.tsx               aurora blobs + cursor spotlight
src/components/site/Nav.component.tsx
src/components/home/Hero.component.tsx
src/components/home/FeaturedApps.component.tsx
src/components/home/LatestPushes.component.tsx
src/components/home/GitHubStats.component.tsx
src/components/home/HomeFooter.component.tsx
src/components/editor/Editor.component.tsx               window chrome, layout, status bar
src/components/editor/sidebar/*.component.tsx            Explorer, SearchPanel, SourceControl, Extensions
src/components/editor/tabs/*.component.tsx               PageTsx, JourneyMd, SettingsJson, EnvFile, GitGraph
src/components/editor/panel/*.component.tsx              Terminal, Problems, Output
src/components/editor/terminal-commands.ts               pure command runner
src/components/editor/{Minimap,LivePreview,ReleaseToast}.component.tsx
src/app/page.tsx, src/app/globals.css, src/app/layout.tsx (modify)
```

Deleted at the end of Task 4: `src/components/header/*`, `src/components/journey/*`, `src/components/tech/Technologies.component.tsx`, `src/components/footer/*`, `src/app/api/contactInfo/route.ts` (only the home page used them). `tech.data.ts` and `tech.types.ts` stay.

---

### Task 1: Test setup, env hygiene, fuzzy match

**Files:**
- Modify: `package.json` (add `"test": "vitest run"`), `.gitignore`
- Create: `vitest.config.ts`, `src/test/setup.ts`, `src/lib/fuzzy.ts`, `src/lib/fuzzy.test.ts`

**Interfaces:**
- Produces: `fuzzyMatch(text: string, query: string): boolean`

- [ ] **Step 1:** `bun add -d vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom`. Vitest config: jsdom environment, `@` alias → `src`, setup file imports `@testing-library/jest-dom/vitest`.
- [ ] **Step 2:** Add `.env*.local` to `.gitignore`; `git rm --cached .env.local` (file stays on disk).
- [ ] **Step 3: Write the failing test** `src/lib/fuzzy.test.ts`

```ts
it('matches subsequences case-insensitively', () => {
  expect(fuzzyMatch('claude-skills', 'clde')).toBe(true);
  expect(fuzzyMatch('Proton-ish', 'PRTN')).toBe(true);
});
it('rejects out-of-order letters', () => expect(fuzzyMatch('dotfiles', 'fd')).toBe(false));
it('ignores whitespace and matches everything on empty query', () => {
  expect(fuzzyMatch('gamedev-studio', 'game studio')).toBe(true);
  expect(fuzzyMatch('anything', '')).toBe(true);
});
```

- [ ] **Step 4:** `bun run test src/lib/fuzzy.test.ts` → FAIL (module missing).
- [ ] **Step 5:** Implement `fuzzyMatch` (indexOf walk, as in the prototype's `fuzzy`).
- [ ] **Step 6:** `bun run test` → PASS. `bun run build` → succeeds.
- [ ] **Step 7:** Commit (`/commit`): test setup, `.gitignore`, untracked `.env.local`, fuzzy.

---

### Task 2: GitHub data layer

**Files:**
- Create: `src/lib/github/types.ts`, `transform.ts`, `transform.test.ts`, `fetch-snapshot.ts`, `fetch-snapshot.test.ts`, `src/lib/github/__fixtures__/graphql.json` (trimmed real response: 8 repos incl. one fork, one with 4 commits, one with null `defaultBranchRef`)

**Interfaces:**
- Produces (`types.ts`):

```ts
type CommitType = 'feat' | 'fix' | 'merge' | 'chore' | 'refactor' | 'docs';
interface Commit { sha: string; shortSha: string; message: string; subject: string; type: CommitType; date: string; url: string; additions: number | null; deletions: number | null }
interface Repo { name: string; url: string; description: string | null; language: string | null; languageColor: string | null; isFork: boolean; stars: number; createdAt: string; pushedAt: string }
interface RecentRepo extends Repo { commits: Commit[] }   // newest first, max 6
interface Release { repo: string; tag: string; publishedAt: string; url: string }
interface LanguageShare { name: string; color: string; count: number }
interface GitHubSnapshot {
  fetchedAt: string;                 // ISO
  source: 'graphql' | 'rest' | 'none';
  repos: Repo[];                     // all public, pushedAt desc
  recent: RecentRepo[];              // 6 most recently pushed, forks included
  latestRelease: Release | null;
  totals: { publicRepos: number; originals: number; forks: number };
  languages: LanguageShare[];        // top 4 + 'other'
  contributions: number[] | null;    // last 26 weeks × 4 buckets = 104 levels 0–4, null without token
}
```

- Produces (`transform.ts`): `getCommitType(message: string): CommitType`, `formatRelative(iso: string, now: Date): string` (`'15m'`, `'2h'`, `'3d'`, `'5w'`), `getTimelinePosition(iso: string, now: Date, days = 7): number` (0–100, clamped), `toSnapshot(raw: GraphQLUser, fetchedAt: Date): GitHubSnapshot`, `emptySnapshot(fetchedAt: Date): GitHubSnapshot`.
- Produces (`fetch-snapshot.ts`): `fetchGitHubSnapshot(): Promise<GitHubSnapshot>`, `GITHUB_LOGIN = 'MagnusPladsen'`.

- [ ] **Step 1: Write failing tests** `transform.test.ts`:

```ts
it.each([
  ['feat: 3D Pixel Art slice view', 'feat'],
  ['fix: tidy the account status', 'fix'],
  ['Merge pull request #112 from x', 'merge'],
  ['Update proton-ish to 1.0.40', 'chore'],
  ['Remove usage-warn and filetree-collapsible mods', 'refactor'],
  ['Add full new-Mac bootstrap guide and Brewfile', 'feat'],
  ['docs: README', 'docs'],
])('types %s as %s', (message, type) => expect(getCommitType(message)).toBe(type));
it('formats relative time', () => {
  const now = new Date('2026-11-02T10:00:00Z');
  expect(formatRelative('2026-11-02T09:45:00Z', now)).toBe('15m');
  expect(formatRelative('2026-11-02T07:00:00Z', now)).toBe('3h');
  expect(formatRelative('2026-10-30T10:00:00Z', now)).toBe('3d');
});
it('clamps timeline position', () => {
  const now = new Date('2026-11-02T00:00:00Z');
  expect(getTimelinePosition('2026-11-02T00:00:00Z', now)).toBe(100);
  expect(getTimelinePosition('2026-10-01T00:00:00Z', now)).toBe(0);
});
it('builds a snapshot from the fixture', () => {
  const s = toSnapshot(fixture.data.user, new Date('2026-11-02T10:00:00Z'));
  expect(s.recent).toHaveLength(6);
  expect(s.recent.some((r) => r.isFork)).toBe(true);
  expect(s.recent.find((r) => r.name === 'claude-mods')?.commits).toHaveLength(4);
  expect(s.repos.find((r) => r.name === '<repo with null defaultBranchRef>')).toBeDefined();
  expect(s.recent.find((r) => r.name === '<repo with null defaultBranchRef>')).toBeUndefined();
  expect(s.totals).toEqual({ publicRepos: 8, originals: 7, forks: 1 });
  expect(s.latestRelease?.tag).toBe('<newest tag in fixture>');
  expect(s.contributions).toHaveLength(104);
});
```

Commit type rule: conventional prefix wins; `Merge` → merge; `/^Update .+ to \d/` → chore; `/^(Remove|Delete|Rename|Move)\b/` → refactor; `/^(Add|Mention|Show)\b.*(guide|README|docs?)/i` → docs is not needed — anything else → feat.

- [ ] **Step 2:** `bun run test src/lib/github` → FAIL.
- [ ] **Step 3:** Implement `types.ts` and `transform.ts`. Contributions: take the last 26 weeks of the calendar, map each week's 7 days into 4 buckets (sum), then level = quartile of non-zero values (0 for zero).
- [ ] **Step 4:** Write `fetch-snapshot.test.ts` with `vi.stubGlobal('fetch', …)`:
  - token set + GraphQL 200 → `source: 'graphql'`, request has `Authorization: bearer <token>` and `next.revalidate === 3600`.
  - no token → calls REST `users/MagnusPladsen/repos?per_page=100&sort=pushed` plus `repos/MagnusPladsen/<name>/commits?per_page=6` for the 6 newest; `source: 'rest'`, `contributions: null`, commits have `additions: null`.
  - fetch rejects / non-200 → resolves to `emptySnapshot` with `source: 'none'`, never throws.
- [ ] **Step 5:** Implement `fetchGitHubSnapshot`. One GraphQL query: `user(login)` → `repositories(first: 100, privacy: PUBLIC, ownerAffiliations: OWNER, orderBy: {field: PUSHED_AT, direction: DESC})` with name, url, description, isFork, stargazerCount, createdAt, pushedAt, primaryLanguage {name color}, latestRelease {tagName publishedAt url}, `defaultBranchRef.target ... on Commit { history(first: 6) { nodes { oid abbreviatedOid message messageHeadline committedDate additions deletions url } } }`; plus `contributionsCollection.contributionCalendar.weeks.contributionDays { date contributionCount }`.
- [ ] **Step 6:** `bun run test` → PASS.
- [ ] **Step 7:** Commit.

---

### Task 3: Site content, themes and the provider

**Files:**
- Create: `src/lib/site-content.ts`, `src/lib/themes.ts`, `src/components/site/SiteContentProvider.component.tsx`, `SiteContentProvider.test.tsx`
- Modify: `src/components/tech/tech.types.ts` (add `blurb?: string`), `tech.data.ts` (blurbs copied from the prototype's `EXTENSIONS` list)

**Interfaces:**
- Produces (`site-content.ts`):

```ts
interface SiteContent {
  developer: { name: string; role: string; location: string; tagline: string; about: string };
  ctas: { primary: string; cv: string };
  featured: { name: string; desc: string }[];   // 4, in Global order
  copy: { featuredTitle: string; allApps: string; browseRepos: string; footer: string };
}
const DEFAULT_CONTENT: SiteContent;              // name/role/location from contactInfo; tagline/about from the prototype hero; footer 'deployed'
const FEATURED_APPS: { name: string; host: string; url: string; tint: string; screenshot?: string }[];  // from the prototype FEATURED const
```

- Produces (`themes.ts`): `type ThemeName = 'Dark' | 'Light' | 'CRT'`, `THEMES: Record<ThemeName, Record<string, string>>` (the prototype's THEMES, keys become CSS vars `--bg`, `--fg`, …), `isValidAccent(value: string): boolean` (`/^#[0-9a-f]{6}$/i`).
- Produces (provider): `useSiteContent()` returning `{ content, setField(path: FieldPath, value: string), theme, cycleTheme(), setTheme(name: ThemeName), accent, accentDraft, setAccentDraft(value: string) }` where `type FieldPath = ['developer' | 'ctas' | 'copy', string] | ['featured', number, 'name' | 'desc']`. The provider renders a wrapper `div` with the theme's CSS vars and `--accent` set, and `data-theme`.

- [ ] **Step 1: Write failing tests**:

```tsx
it('updates a developer field', …)            // setField(['developer','name'], 'Ada') → content.developer.name === 'Ada'
it('updates one featured app', …)             // setField(['featured', 1, 'desc'], 'x') → featured[1].desc === 'x', featured[0] unchanged
it('keeps the last valid accent', …)          // setAccentDraft('#22d3ee') → accent '#22d3ee'; setAccentDraft('#ff') → accentDraft '#ff', accent still '#22d3ee'
it('cycles Dark → Light → CRT → Dark', …)
it('survives localStorage throwing', …)       // stub getItem/setItem to throw → renders with Dark and #f97316
it('restores saved theme and accent', …)      // localStorage 'pladsen.settings' = {"theme":"CRT","accent":"#4ade80"}
```

- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS. **Step 5:** Commit.

---

### Task 4: Page shell and the server-rendered sections

**Files:**
- Create: `src/components/site/Backdrop.component.tsx`, `Nav.component.tsx`, `src/components/home/{Hero,FeaturedApps,LatestPushes,GitHubStats,HomeFooter}.component.tsx`, `src/components/home/home.test.tsx`
- Modify: `src/app/page.tsx`, `src/app/globals.css` (keyframes from the prototype helmet: drift1, drift2, rise, type, blink, shimmer, pulse, lineIn, grow, pop, slide, sweep, ripple, ghost, wander, viewport, toastIn), `src/app/layout.tsx` (metadata description "Full-stack developer building modern web apps", body bg `#07080b`)
- Delete: files listed under File Structure

**Interfaces:**
- Consumes: `fetchGitHubSnapshot`, `useSiteContent`, `DEFAULT_CONTENT`, `FEATURED_APPS`, `formatRelative`, `getTimelinePosition`.
- Produces: `page.tsx` exports `revalidate = 3600` and renders `<SiteContentProvider><Backdrop/><Nav/><Hero/><Editor snapshot/>` (Editor placeholder `div` until Task 5) `<FeaturedApps/><LatestPushes snapshot now/><GitHubStats snapshot/><HomeFooter snapshot/></SiteContentProvider>`. Each home component takes `{ snapshot: GitHubSnapshot; now: string }` where it needs data.

- [ ] **Step 1: Write failing tests** `home.test.tsx` (render inside the provider with a fixture snapshot):
  - Hero shows "Magnus Pladsen", "Full-stack developer", both taglines, "See my apps" linking to `/apps`, GitHub/LinkedIn/Discord with `contactInfo.socials` URLs.
  - Hero "Download CV" links to `/cv.pdf` (already in `public/`, from Magnus) with `download="Magnus-Pladsen-CV.pdf"`; it is hidden when the `cvAvailable` prop is false (page passes `fs.existsSync('public/cv.pdf')`).
  - LatestPushes renders 6 rows, first row has "HEAD", the type badge text, `+412 −38` when stats exist, no diff bar when `additions` is null, header "GET /repos?sort=pushed", "synced N min ago" from `fetchedAt`.
  - LatestPushes with `source: 'none'` shows "couldn't reach GitHub — showing nothing rather than stale data" and still renders "Browse all repos".
  - GitHubStats shows totals and omits the heatmap when `contributions` is null.
  - FeaturedApps renders gradient tint when `screenshot` missing; lane-kalkulator has no description line while its desc is empty.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement, matching the prototype's markup and Tailwind-equivalent styles (inline `style` for CSS-var colours is fine). **Step 4:** Run → PASS; `bun run build` succeeds; `bun run dev` and check the page in the browser pane at 1280px.
- [ ] **Step 5:** Commit.

---

### Task 5: Editor shell, tabs and status bar

**Files:**
- Create: `src/components/editor/Editor.component.tsx`, `tabs/{PageTsx,JourneyMd,SettingsJson,EnvFile}.component.tsx`, `Minimap.component.tsx`, `editor.test.tsx`
- Modify: `src/app/page.tsx` (replace the placeholder)

**Interfaces:**
- Consumes: `useSiteContent`, `GitHubSnapshot`.
- Produces: editor UI state in the provider (add to Task 3's context, same file): `tab: EditorTab`, `setTab`, `view: SidebarView`, `setView`, `panel: PanelTab`, `setPanel`, `selectedRepo: string | null`, `setSelectedRepo`, `isPreviewOpen`, `setPreviewOpen`. `type EditorTab = 'page.tsx' | 'journey.md' | 'settings.json' | '.env' | 'Git Graph'`, `type SidebarView = 'explorer' | 'search' | 'scm' | 'extensions'`, `type PanelTab = 'terminal' | 'problems' | 'output'`.

Content per tab is the prototype's, verbatim, including: IntelliSense popup on `developer`, ghost text `// TODO: ship gamedev-studio 1.0 this weekend`, wandering "visitor" cursor, `.env` lines (`SECRET_KEY=nice-try` clear; `GITHUB_TOKEN`, `DATABASE_URL`, `COFFEE_SUPPLY`, `NUCLEAR_LAUNCH_CODES=00000000 # same as my luggage` blurred), settings.json with clickable theme value and editable accent. page.tsx inputs use `size`-free inline width `${clamp(len, 2, 48)}ch` and `aria-label` = field key.

- [ ] **Step 1: Write failing tests**:
  - typing "Ada" into the `name` input (after clearing) changes the hero `h1` to "Ada".
  - typing into `featured[0].desc` changes the first app card text.
  - clearing `name` leaves the input in the document with width `2ch`.
  - status bar theme button cycles the wrapper's `data-theme`.
  - typing `#22d3ee` in settings accent sets `--accent` on the wrapper; typing `#22` leaves it.
  - `.env` tab shows "nice-try" and the blurred values have the blur class.
- [ ] **Step 2–4:** FAIL → implement → PASS.
- [ ] **Step 5:** Commit.

---

### Task 6: Sidebar panels and the Git Graph

**Files:**
- Create: `src/components/editor/sidebar/{ActivityBar,Explorer,SearchPanel,SourceControl,Extensions}.component.tsx`, `tabs/GitGraph.component.tsx`, `sidebar.test.tsx`

**Interfaces:**
- Consumes: `fuzzyMatch`, `snapshot.repos`, `snapshot.recent`, `techData` (with `blurb`), provider editor state.

- [ ] **Step 1: Write failing tests**:
  - Search: typing "clde" lists `claude-*` repos and shows "N of M repos"; links point to repo URLs.
  - Source Control: clicking `claude-mods` expands 4 commits with short sha and message, sets tab to "Git Graph", and the graph header reads `git log --graph -6 claude-mods`; clicking again collapses and the header reads `git log --graph --all --author=magnus`; "✕ show all repos" clears it.
  - Extensions: lists every tech in `techData` with "Installed"; the activity-bar badge shows the count until the Extensions view is opened.
- [ ] **Step 2–4:** FAIL → implement → PASS.
- [ ] **Step 5:** Commit.

---

### Task 7: Bottom panel, Run, preview and release toast

**Files:**
- Create: `src/components/editor/terminal-commands.ts`, `terminal-commands.test.ts`, `panel/{Terminal,Problems,Output}.component.tsx`, `LivePreview.component.tsx`, `ReleaseToast.component.tsx`, `panel.test.tsx`

**Interfaces:**
- Produces: `runTerminalCommand(input: string, context: { content: SiteContent; snapshot: GitHubSnapshot; techNames: string[] }): TerminalResult` where `type TerminalResult = { lines: { text: string; tone: 'muted' | 'success' | 'warning' | 'error' | 'plain' }[]; effect?: { kind: 'clear' } | { kind: 'run' } | { kind: 'theme'; theme: ThemeName } }`.

- [ ] **Step 1: Write failing tests** `terminal-commands.test.ts`: `help` lists every command; `whoami` uses the edited name; `git log` prints the 3 newest commits from `snapshot.recent`; `sudo ping magnus` ends with a success line containing "Magnus is online"; `theme crt` returns the theme effect; `clear` and `run` return effects; `rm -rf /` and `vim` give their jokes; unknown → `zsh: command not found: <cmd>` tone error; blank input → no lines.
- [ ] **Step 2: Write failing UI tests** `panel.test.tsx`: Enter in the terminal input runs the command and clears the input; ▶ Run prints "compiling" then (fake timers) opens the preview showing the current name; Problems tab shows "coffee level low"; toast shows `<repo>: <tag> released` from `snapshot.latestRelease`, View links to its URL, Later hides it, no toast when `latestRelease` is null.
- [ ] **Step 3–4:** FAIL → implement → PASS.
- [ ] **Step 5:** Commit.

---

### Task 8: Responsive layout and final verification

**Files:**
- Modify: editor and home components as needed; `src/components/home/responsive.test.tsx` is not useful in jsdom, so this task is verified in the browser.

- [ ] **Step 1:** Below 768px: activity bar becomes a horizontal row above the tabs, sidebar is a collapsible drawer toggled by the active activity icon, minimap and live preview hidden, hero CTA column stacks under the text, latest-pushes table drops the type and diff columns.
- [ ] **Step 2:** `bun run dev`; in the browser pane at 375×812 confirm `document.documentElement.scrollWidth === 375` and every section is usable; repeat at 768 and 1280. Fix any overflow (watch the page.tsx inputs and the stats heatmap).
- [ ] **Step 3:** `bun run lint && bun run test && bun run build` all pass.
- [ ] **Step 4:** Run without `GITHUB_TOKEN` and with `GITHUB_TOKEN` set locally (`.env.local`, now untracked); both render.
- [ ] **Step 5:** Commit.
