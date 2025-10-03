const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import { ApiResponse, BoxScoreResponse } from '../types/game';


export const sportsApi = {
  getScoreboard: async (date?: string): Promise<ApiResponse> => {
    const dateParam = date ? `?dates=${date}` : '';
    const response = await fetch(`${API_BASE_URL}/scoreboard${dateParam}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  },

  getTeams: async (): Promise<unknown> => {
    try {
      const response = await fetch(`${API_BASE_URL}/teams`);
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
      const response = await fetch(`${API_BASE_URL}/standings`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Failed to fetch standings:', error);
      throw error;
    }
  },

  getBoxScore: async (gameId: string): Promise<BoxScoreResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/summary?event=${gameId}`);
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