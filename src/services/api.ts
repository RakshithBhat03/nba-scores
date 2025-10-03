const ESPN_BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba';

import { ESPNApiResponse, ESPNBoxScoreResponse } from '../types/game';

// Mock data for development/fallback
const mockScoreboardData = {
  events: [
    {
      id: '401585516',
      date: new Date().toISOString(),
      status: {
        type: { name: 'STATUS_FINAL' },
        period: 4,
        displayClock: '0:00'
      },
      competitions: [{
        competitors: [
          {
            team: {
              id: '1610612747',
              name: 'Lakers',
              displayName: 'Los Angeles Lakers',
              abbreviation: 'LAL',
              logo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
              color: '552583',
              alternateColor: 'fdb927'
            },
            score: '112',
            homeAway: 'away' as const,
            records: [{ summary: '42-40' }]
          },
          {
            team: {
              id: '1610612744',
              name: 'Warriors',
              displayName: 'Golden State Warriors',
              abbreviation: 'GSW',
              logo: 'https://a.espncdn.com/i/teamlogos/nba/500/gsw.png',
              color: '1d428a',
              alternateColor: 'ffc72c'
            },
            score: '118',
            homeAway: 'home' as const,
            records: [{ summary: '44-38' }]
          }
        ],
        venue: { fullName: 'Chase Center' }
      }]
    },
    {
      id: '401585517',
      date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      status: {
        type: { name: 'STATUS_IN_PROGRESS' },
        period: 2,
        displayClock: '8:45'
      },
      competitions: [{
        competitors: [
          {
            team: {
              id: '1610612738',
              name: 'Celtics',
              displayName: 'Boston Celtics',
              abbreviation: 'BOS',
              logo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
              color: '007a33',
              alternateColor: 'ba9653'
            },
            score: '58',
            homeAway: 'away' as const,
            records: [{ summary: '48-34' }]
          },
          {
            team: {
              id: '1610612748',
              name: 'Heat',
              displayName: 'Miami Heat',
              abbreviation: 'MIA',
              logo: 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png',
              color: '98002e',
              alternateColor: 'f9a01b'
            },
            score: '62',
            homeAway: 'home' as const,
            records: [{ summary: '44-38' }]
          }
        ],
        venue: { fullName: 'FTX Arena' }
      }]
    }
  ]
};

export const espnApi = {
  getScoreboard: async (date?: string): Promise<ESPNApiResponse> => {
    try {
      const dateParam = date ? `?dates=${date}` : '';
      const response = await fetch(`${ESPN_BASE_URL}/scoreboard${dateParam}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn('ESPN API request failed, using mock data');
        return mockScoreboardData;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('ESPN API error, falling back to mock data:', error);
      return mockScoreboardData;
    }
  },

  getTeams: async (): Promise<unknown> => {
    try {
      const response = await fetch(`${ESPN_BASE_URL}/teams`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Failed to fetch teams:', error);
      throw error;
    }
  },

  getStandings: async (): Promise<unknown> => {
    try {
      const response = await fetch(`${ESPN_BASE_URL}/standings`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Failed to fetch standings:', error);
      throw error;
    }
  },

  getBoxScore: async (gameId: string): Promise<ESPNBoxScoreResponse> => {
    try {
      const response = await fetch(`${ESPN_BASE_URL}/summary?event=${gameId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Failed to fetch box score:', error);
      throw error;
    }
  }
};