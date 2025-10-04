# NBA Scores Chrome Extension

A modern Chrome extension for real-time NBA scores, standings, and game information with dark theme support.

## Features

- 🏀 **Live Game Scores** - Real-time NBA game scores with automatic refresh
- 📊 **Conference Standings** - Eastern and Western conference standings
- 🌙 **Dark Theme** - Toggle between light and dark themes
- 📅 **Date Navigation** - Browse games by date with an intuitive carousel
- 📱 **Responsive Design** - Optimized for Chrome extension popup (400x600px)
- ⚡ **Real-time Updates** - Live games refresh every 30 seconds
- 🎨 **Modern UI** - Built with Tailwind CSS and shadcn/ui components

## Installation

### From Source

1. Clone this repository:
   ```bash
   git clone https://github.com/RakshithBhat03/nba-scores.git
   cd nba-scores
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your NBA API endpoints
   ```

4. Build the extension:
   ```bash
   npm run build
   ```

5. Load in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist/` folder

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Development Commands

```bash
npm run dev          # Development server (port 3000)
npm run build        # Build for production
npm run type-check   # TypeScript validation
npm run lint         # ESLint validation
npm run preview      # Preview built extension
```

### Environment Configuration

Create a `.env` file in the root directory by copying the example:

```bash
cp .env.example .env
```

Then edit `.env` with your NBA API endpoints:

```env
# NBA API Configuration
VITE_API_BASE_URL=https://your-nba-api-endpoint.com
VITE_CORE_API_BASE_URL=https://your-core-nba-api-endpoint.com
```

## Architecture

### Tech Stack

- **React 18 + TypeScript** - Component framework
- **TanStack Query v5** - Data fetching and state management
- **Tailwind CSS + shadcn/ui** - Styling and component library
- **Vite** - Build tool and development server
- **Chrome Extension Manifest V3** - Extension framework

### Project Structure

```
src/
├── components/          # React components
│   ├── common/         # Shared components
│   ├── scores/         # Score-related components
│   ├── standings/      # Standings components
│   ├── settings/       # Settings components
│   └── ui/            # Reusable UI components
├── hooks/             # Custom React hooks
├── services/          # API services
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── data/              # Static data files
```

### Data Flow

1. **Custom Hooks** handle data fetching via TanStack Query
2. **API Service** provides external API integration
3. **Type-safe interfaces** define data structures
4. **Chrome Storage** persists user settings

## Features in Detail

### Live Scores

- Real-time game scores with automatic refresh
- Game status indicators (scheduled, in progress, final)
- Team records and logos
- Venue information
- 3-column responsive grid layout

### Standings

- Eastern and Western conference standings
- Win-loss records and percentages
- Games behind calculation
- Sortable by conference

### Theme System

- Light and dark theme support
- Persistent theme preference
- Smooth transitions
- NBA-branded color palette

## API Integration

The extension uses external NBA APIs for live data:

- **Scoreboard API** - Game scores and schedules
- **Standings API** - Conference standings
- **Teams API** - Team information and logos

The API endpoints and data structures are based on the public ESPN API documentation available at https://github.com/pseudo-r/Public-ESPN-API.



## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Run linting and type checking: `npm run lint && npm run type-check`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

**ESPN Disclaimer:**
This project is an independent, open-source project and is not affiliated with, endorsed, or supported by ESPN in any way.

The extension uses unofficial ESPN endpoints, which may change, break, or be removed at any time without notice. Use at your own risk.

All ESPN content, including names, logos, trademarks, and data, are the property of ESPN and/or its licensors. This project does not include or distribute any such proprietary materials.

This code is provided for educational and personal use only. Do not use it for commercial purposes, and ensure you comply with ESPN's Terms of Service.

**NBA Disclaimer:**
This is an unofficial NBA extension. All NBA-related trademarks and logos are property of the National Basketball Association. This extension is not affiliated with or endorsed by the NBA.

## Support

If you encounter any issues or have suggestions, please open an issue on the GitHub repository.
