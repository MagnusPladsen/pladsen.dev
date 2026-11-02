# pladsen.dev home page — "full editor" redesign (prototype 15)

## Intent

Replace the current home page with prototype 15 from the design canvas
(https://claude.ai/artifact/BhkytZFzP8mbBWbEj1GHjs, board "15 · Hybrid + full editor").
The site should look cool and clean to everyone (recruiters, clients, developers), and be
clearly code-inspired, with easter eggs developers can find. Magnus is not job hunting: no
"hire me" wording anywhere.

## Goals

- Home page = hero, then a VS Code–style editor window, then featured apps, latest pushes,
  GitHub stats, footer.
- The hero text is editable from `page.tsx` inside the editor and updates live.
- Latest pushes, per-repo commits, GitHub stats and the notification toast come from the
  GitHub API, refreshed hourly (ISR), with the sync status shown in the UI.
- Keep all existing text and links (contact info, journey, tech list).

## Non-goals (this build)

- The Apps page, Repos page, `/uses`, ⌘K palette, OG images, project detail pages. They are
  planned and get their own designs; this build only links to `/apps` and `/repos`.
- Persisting visitor edits. Edits live in React state and reset on reload.

## Anti-goals

- Anything that breaks on a phone. The editor must collapse to something usable at 375px.
- A slow page: the editor is client-side, but the first paint must be server-rendered
  content (hero, apps, pushes), not a spinner.
- Calling the GitHub API from the browser.

## Page, top to bottom

1. **Nav pill** (glass): `~/pladsen.dev`, Home, Apps, Repos, Uses (Apps/Repos/Uses can 404
   for now or be hidden; builder's call), ⌘K chip (decorative until the palette exists).
2. **Hero** (13's layout): typed `$ curl pladsen.dev/api/me`, shimmering name, role in
   accent, two tagline paragraphs, hint "psst — this text is live. Edit it in page.tsx
   below." Right column: See my apps → (`/apps`), Download CV .pdf, GitHub / LinkedIn /
   Discord (URLs from `src/lib/contactInfo.ts`).
3. **Editor window** (traffic lights, title `pladsen.dev — <file>`):
   - **Activity bar**: Explorer, Search, Source Control, Extensions. Extensions shows a
     pulsing count badge until opened.
   - **Explorer**: `page.tsx`, `journey.md`, `settings.json`, `.env`, plus github / linkedin /
     discord links.
   - **Search**: fuzzy (subsequence) search over all public repos, links to GitHub.
   - **Source Control**: the 6 most recently pushed repos. Clicking one expands its 6 latest
     commits underneath (timeline, sha, message, relative time, link to commit) and opens the
     Git Graph tab filtered to that repo; "✕ show all repos" clears the filter.
   - **Extensions**: the tech stack from `tech.data.ts` as installed extensions (icon, name,
     one-line blurb, "Installed").
   - **Tabs**: page.tsx, journey.md, settings.json, .env, Git Graph. Breadcrumbs under tabs.
   - **page.tsx**: `developer` object (name, role, location, tagline, about as editable
     string inputs), `work: { at: 'Abaris Consulting AS', since: 2022 }`, `ctas`,
     `featured` (name + desc per app) and `copy` (featured heading, "All apps",
     "Browse all N repos", footer status) — all editable and live on the page. Hovering
     `developer` shows an IntelliSense popup. AI ghost-text comment types and fades. A
     "visitor" cursor wanders. ▶ Run prints a build in the terminal then opens a split live
     preview of the hero.
   - **journey.md**: existing journey text (Work · 2022 – now at Abaris; School, Noroff,
     graduated 2024 with an A).
   - **settings.json**: theme value cycles Dark / Light / CRT; `pladsen.accent` is an editable
     hex that recolours the whole site.
   - **.env**: `SECRET_KEY=nice-try`, other values blurred (incl.
     `NUCLEAR_LAUNCH_CODES=00000000 # same as my luggage`).
   - **Git Graph**: animated lanes and nodes, latest push per repo (or one repo's commits).
   - **Minimap** with an animated viewport box.
   - **Bottom panel**: TERMINAL (working input: help, ls, whoami, cat journey.md, git log,
     sudo ping magnus, code --list-extensions, run, theme dark|light|crt, clear, plus
     rm -rf / and vim jokes), PROBLEMS (0 errors, ⚠ coffee level low), OUTPUT (sync log).
   - **Status bar** (accent): `⎇ main` opens Git Graph, problem counts open Problems,
     language, UTF-8, theme switcher.
   - **Toast**: newest GitHub Release across public repos ("<repo>: <tag> released",
     time ago), Later / View (View opens the release on GitHub).
4. **Featured apps**: gamedev-studio, Proton-ish, cv-app-new, lane-kalkulator (that order),
   screenshot slot, live dot, description, host.
5. **Latest pushes** (13's API-table look): `GET /repos?sort=pushed` header, 7-day timeline
   strip, rows with lang dot, repo, commit-type badge, message, +/− diff bar, time; HEAD on
   the newest. "Browse all N repos →".
6. **GitHub stats**: `GET /github/stats`, public repos, originals · forks, language bar,
   contribution-style heatmap.
7. **Footer**: `⎇ main · ✓ deployed <time>`, GitHub, LinkedIn.

Theme: background `#07080b`, drifting aurora blobs (accent + `#6366f1`), cursor spotlight,
glass tiles, Geist + Geist Mono, default accent `#f97316`. Light and CRT themes as in the
prototype.

## Data

- Server-side fetches with `next: { revalidate: 3600 }`, authenticated with a `GITHUB_TOKEN`
  env var (fine-grained, read-only, public repos) that Magnus adds on Vercel. Prefer one
  GraphQL query for repos, recent commits, releases and the contribution calendar; REST only
  where GraphQL lacks the data. Locally, without a token, the page must still render with
  fallbacks (no heatmap, no diff bars).
- Needed: user repos (all public, for search, counts, languages), latest commit + diff stats
  for the 6 most recently pushed repos, 6 latest commits per those repos, newest release
  across repos, contribution heatmap (needs GraphQL + token; fall back to a commit-date
  heatmap or hide if no token).
- "synced N min ago / next refresh in M min" computed from the fetch time.
- Commit type badge: parsed from conventional-commit prefix, else inferred (Merge → merge,
  "Update … to x.y.z" → chore, else the default).
- Replace the fragile client fetch of `/api/contactInfo` with direct imports.

## Decided by Magnus

- Prototype 15 is the home page; 13's hero; 13-style latest pushes table; no journey or stack
  sections on the page (they live in journey.md and Extensions).
- Featured apps and their order; discontinued apps list (for the later Apps page).
- `sudo ping magnus` instead of anything "hire".

## My calls (check these)

- Toast shows the newest GitHub Release across all repos, not a hardcoded tap commit.
- Visitor edits are not persisted.
- Mobile: activity bar becomes a top tab row, sidebar and minimap hide, terminal stays.
- Theme and accent choice saved in localStorage.
- `location` comes from `contactInfo.location` (already 'Lillehammer, Norway').
- Forks count everywhere (Source Control, latest pushes, search); Proton-ish is a fork and
  must show. Stats still split originals and forks.
- Extensions: add an optional `blurb` to the tech type in `tech.data.ts`, filled from the
  prototype's blurbs. The existing tech list stays the source of truth.
- Placeholders ship with fallbacks: "Download CV" is hidden until `public/cv.pdf` exists,
  app cards use the gradient tint until a screenshot exists, lane-kalkulator shows no
  description line until one is written.
- `.env.local` is tracked in git; untrack it and add `.env*.local` to `.gitignore` before
  any token is added.

## Left to the builder

Component split, animation implementation, how the editor state is structured, testing
approach, how screenshots are stored.

## Open placeholders

CV PDF file, app screenshots, lane-kalkulator description.
