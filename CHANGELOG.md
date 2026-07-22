# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-22

First public release of the NBA Scores Chrome extension.

### Added
- **Live game scores** with automatic 30-second refresh while games are in progress.
- **Detailed box-score view** for live games: team statistics, player stats tables, and game leaders, shown in place of the scorecard when a live game is selected.
- **Conference standings** (Eastern and Western) with win-loss records, winning percentage, and games-behind calculation.
- **Favorite team selector** that prioritizes the chosen team's game at the top of the list and uses a dynamic season year for standings.
- **Background data refresh** with pre-fetching so the popup shows fresh data immediately on open.
- **Date navigation carousel** to browse games on past and future dates.
- **Timezone-aware game display** that queries the target date and the previous day to correctly capture games that cross the UTC boundary, then filters by the user's local timezone.
- **Light/dark theme toggle** with persistent preference stored in `chrome.storage`.
- **NBA-branded icons** at 16/32/48/128 px used throughout the extension and the toolbar.
- **Client-side rate limiting** (60 requests/minute) with exponential backoff and retry logic for HTTP 429 responses.
- **Runtime validation** of API responses with Zod schemas.
- **Security hardening**: input validation, URL sanitization, and a strict Content Security Policy scoped to the ESPN API hosts.

### Changed
- Redesigned UI with an elevated header, refined game cards, and zoned standings, backed by a themed design-token system with live/playoff accents and motion primitives.
- Consolidated standings utilities into a dedicated module for cleaner API integration.

### Fixed
- Corrected the ESPN Core API endpoint for standings (removed the `/v2` prefix) so standings data loads reliably.
- Fixed games-behind rendering to display half-games (e.g., `0.5`) correctly.
- Removed placeholder `host_permissions` so the extension works on any site and in new-tab contexts.
- Resolved the Vite dynamic-import warning.
- Restored `npm run dev` by removing a stray `public/popup.html` that shadowed the real Vite entry.

[1.0.0]: https://github.com/RakshithBhat03/nba-scores/releases/tag/v1.0.0
