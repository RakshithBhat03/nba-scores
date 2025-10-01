import { logger } from '../utils/logger';
import { ScoreboardResponseSchema, StandingsResponseSchema } from '../schemas/api';
import { z } from 'zod';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

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
               logo: '/icons/lal.png',
              color: '552583',
              alternateColor: 'fdb927'
            },
            score: '112',
            records: [{ summary: '42-40' }]
          },
          {
            team: {
              id: '1610612744',
              name: 'Warriors',
              displayName: 'Golden State Warriors',
              abbreviation: 'GSW',
               logo: '/icons/gsw.png',
              color: '1d428a',
              alternateColor: 'ffc72c'
            },
            score: '118',
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
               logo: '/icons/bos.png',
              color: '007a33',
              alternateColor: 'ba9653'
            },
            score: '58',
            records: [{ summary: '48-34' }]
          },
          {
            team: {
              id: '1610612748',
              name: 'Heat',
              displayName: 'Miami Heat',
              abbreviation: 'MIA',
               logo: '/icons/mia.png',
              color: '98002e',
              alternateColor: 'f9a01b'
            },
            score: '62',
            records: [{ summary: '44-38' }]
          }
        ],
        venue: { fullName: 'FTX Arena' }
      }]
    }
  ]
};

export const sportsApi = {
  getScoreboard: async (date?: string): Promise<any> => {
    try {
      const dateParam = date ? `?dates=${date}` : '';
      const response = await fetch(`${API_BASE_URL}/scoreboard${dateParam}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        logger.warn('API request failed, using mock data');
        return mockScoreboardData;
      }

      const data = await response.json();

      // Validate response data
      try {
        const validatedData = ScoreboardResponseSchema.parse(data);
        return validatedData;
      } catch (validationError) {
        logger.error('API response validation failed:', validationError);
        if (validationError instanceof z.ZodError) {
          logger.error('Validation errors:', validationError.issues);
        }
        // Return original data if validation fails to avoid breaking the app
        return data;
      }
    } catch (error) {
      logger.warn('API error, falling back to mock data:', error);
      return mockScoreboardData;
    }
  },

  getTeams: async (): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/teams`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      logger.error('Failed to fetch teams:', error);
      throw error;
    }
  },

  getStandings: async (): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/standings`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Validate response data
      try {
        const validatedData = StandingsResponseSchema.parse(data);
        return validatedData;
      } catch (validationError) {
        logger.error('Standings validation failed:', validationError);
        if (validationError instanceof z.ZodError) {
          logger.error('Validation errors:', validationError.issues);
        }
        // Return original data if validation fails
        return data;
      }
    } catch (error) {
      logger.error('Failed to fetch standings:', error);
      throw error;
    }
  },

  getBoxScore: async (gameId: string): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/summary?event=${gameId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      logger.error('Failed to fetch box score:', error);
      throw error;
    }
  }
};