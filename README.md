# NBA Scores Chrome Extension

A modern Chrome extension for real-time NBA scores, detailed box scores, and conference standings — with light/dark theme support and a favorite-team shortcut.

Built as a Manifest V3 extension with React 18, TypeScript, TanStack Query, and Tailwind CSS. Data is sourced from public ESPN endpoints.

> **Popup size:** 540 × 600 px.

---

## Features

- 🏀 **Live game scores** — Real-time scoreboard that auto-refreshes every 30 seconds while games are in progress.
- 📋 **Box-score view** — Click any live game to open a full box score: team statistics, player stats tables, and game leaders. Press the back button to return to the scoreboard.
- 📊 **Conference standings** — Eastern and Western conference tables with win-loss records, winning percentage, and games-behind (including half-games).
- ⭐ **Favorite team** — Pin your team; its game is surfaced at the top of the list. Standings use the correct, dynamic season year.
- 📅 **Date navigation** — A carousel to browse games on past and future dates.
- 🌍 **Timezone-aware** — Queries the target date and the previous day to capture games that cross the UTC boundary, then filters by your local timezone so the list always matches your "today."
- ⚡ **Background refresh** — Data is pre-fetched in the background so the popup is fresh the moment you open it.
- 🌙 **Light/dark theme** — Toggleable, with your preference persisted in `chrome.storage`.
- 🛡️ **Resilient by design** — Client-side rate limiting (60 req/min) with exponential backoff and retry on HTTP 429, plus Zod runtime validation of every API response.

---

## Install

There are two ways to install the extension.

### Option A — Download a release (easiest)

1. Go to the [Releases page](https://github.com/RakshithBhat03/nba-scores/releases) and download **`nba-scores-v1.0.0.zip`** from the latest release.
2. Unzip it anywhere on your machine, e.g.:
   ```bash
   unzip nba-scores-v1.0.0.zip -d nba-scores
   ```
3. Open Chrome and go to `chrome://extensions/`.
4. Enable **Developer mode** (top-right toggle).
5. Click **Load unpacked** and select the unzipped folder (the one containing `manifest.json`).
6. Pin the **NBA Scores** icon to your toolbar and click it to open the popup.

### Option B — Build from source

1. Clone the repository:
   ```bash
   git clone https://github.com/RakshithBhat03/nba-scores.git
   cd nba-scores
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (see [Environment](#environment)):
   ```bash
   cp .env.example .env
   ```
4. Build the extension:
   ```bash
   npm run build
   ```
5. Load it in Chrome:
   - Go to `chrome://extensions/`
   - Enable **Developer mode**
   - Click **Load unpacked**
   - Select the `dist/` folder

> The extension works on any site and in new-tab contexts.

---

## Development

### Prerequisites

- Node.js 18+
- npm (or yarn / pnpm)

### Commands

```bash
npm run dev          # Start the Vite dev server with HMR
npm run build        # Type-check + production build into dist/
npm run preview      # Serve the built dist/ locally
npm run type-check   # TypeScript validation (no emit)
npm run lint         # ESLint (zero-warning policy)
```

### Environment

The extension reads its data sources from Vite environment variables. Copy the example file and edit if you need different endpoints:

```bash
cp .env.example .env
```

```env
# ESPN scoreboard / box-score / teams endpoints
VITE_API_BASE_URL=https://site.api.espn.com/apis/site/v2/sports/basketball/nba
# ESPN core endpoint used for standings
VITE_CORE_API_BASE_URL=https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba
```

> The defaults point at public ESPN endpoints. Rate limiting is enforced client-side to be respectful of those APIs.

---

## Architecture

### Tech stack

- **React 18 + TypeScript** (strict mode) — UI framework
- **TanStack Query v5** — server state, caching, and automatic refetch
- **Tailwind CSS + shadcn/ui** — styling and component library with dark-theme support
- **Vite** — build tool and dev server
- **Zod** — runtime validation of API responses
- **Chrome Extension Manifest V3** — extension framework (popup entry)

### Project structure

```
src/
├── components/
│   ├── common/        # Header, ErrorBoundary, LoadingSpinner
│   ├── scores/        # ScoresList, GameCard, GamePreview, DateCarousel
│   ├── standings/     # ConferenceStandings, StandingsList, TeamStandingRow
│   ├── settings/      # ThemeToggle, FavoriteTeamSelector
│   └── ui/            # shadcn/ui primitives (Button, Card, Badge, Tabs, etc.)
├── hooks/             # Data fetching & state (useScores, useStandings, useGamePreview, ...)
├── services/          # API service + chrome.storage integration
├── lib/               # utils, validation, rate limiter
├── schemas/           # Zod schemas for API responses
├── types/             # TypeScript interfaces (game, standings, settings)
├── utils/             # logger, standings utilities
└── data/              # Static NBA team data
```

### Data flow

1. **Hooks** in `src/hooks/` fetch data via TanStack Query with sensible `staleTime`s (live games: 30s refetch; box score: 30s; standings: 10 min).
2. **`services/api.ts`** centralizes all HTTP calls and runs them through a rate limiter.
3. **`lib/rateLimiter.ts`** caps throughput at 60 req/min with exponential backoff and retries on HTTP 429.
4. **Zod schemas** validate every external response before it reaches the UI.
5. **`services/storage.ts`** persists theme and favorite-team settings in `chrome.storage` (falling back to `localStorage` outside the extension context).

### Data sources

All data comes from public ESPN endpoints:

| Purpose | Endpoint base |
| --- | --- |
| Scoreboard, box scores, teams | `https://site.api.espn.com/apis/site/v2/sports/basketball/nba` |
| Standings | `https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba` |

These hosts are declared in `manifest.json` `host_permissions` and the Content Security Policy so the extension can call them cross-origin.

---

## Releases

Releases are published on the [GitHub Releases page](https://github.com/RakshithBhat03/nba-scores/releases). Each release ships a ready-to-load `dist/` build packaged as `nba-scores-v<version>.zip`. See [Install → Option A](#option-a--download-a-release-easiest) for how to load it.

See [CHANGELOG.md](CHANGELOG.md) for what changed in each version.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and test thoroughly
4. Run lint and type checks: `npm run lint && npm run type-check`
5. Commit using a clear, conventional message (e.g. `feat:`, `fix:`, `docs:`)
6. Push to your branch: `git push origin feature/your-feature`
7. Open a pull request against `main`

### Contributors

- **Rakshith Bhat** — [@RakshithBhat03](https://github.com/RakshithBhat03)

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Disclaimer

**ESPN disclaimer:** This project is an independent, open-source project and is not affiliated with, endorsed by, or supported by ESPN in any way. It uses unofficial ESPN endpoints, which may change, break, or be removed at any time without notice. All ESPN content — including names, logos, trademarks, and data — is the property of ESPN and/or its licensors. This code is provided for educational and personal use only.

**NBA disclaimer:** This is an unofficial NBA extension. All NBA-related trademarks and logos are the property of the National Basketball Association. This extension is not affiliated with or endorsed by the NBA.

## Support

If you encounter any issues or have suggestions, please [open an issue](https://github.com/RakshithBhat03/nba-scores/issues).
