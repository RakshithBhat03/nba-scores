const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import { ApiResponse, BoxScoreResponse } from '../types/game';
import { RateLimitMonitor, logger } from '@/lib/rateLimiter';

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxRequests: 60,           // Maximum requests per window
  windowMs: 60000,          // 1 minute window
  retryDelay: 1000,         // 1 second base delay for retries
  maxRetries: 3,            // Maximum retry attempts
};

// Create rate limiter instance
const rateLimiter = new RateLimitMonitor(RATE_LIMIT_CONFIG);

// Export rate limiter for monitoring
export { rateLimiter, RATE_LIMIT_CONFIG };


// Rate limiting wrapper for API calls
async function makeRequest<T>(
  requestFn: () => Promise<T>,
  endpoint: string
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= RATE_LIMIT_CONFIG.maxRetries + 1; attempt++) {
    try {
      // Wait if we're rate limited
      await rateLimiter.waitForAvailability();
      
      // Record this request
      rateLimiter.recordRequest();
      
      // Make the actual request
      const response = await requestFn();
      
      // Reset retry counter on success
      rateLimiter.resetRetry();
      
      logger.log(`API request successful for ${endpoint}`, {
        attempt,
        rateLimitStatus: rateLimiter.getHumanReadableStatus()
      });
      
      return response;
    } catch (error) {
      lastError = error as Error;
      
      // Check if it's a rate limit error (HTTP 429)
      const errorMsg = error instanceof Error ? error.message : String(error);
      if (errorMsg.includes('429') || errorMsg.includes('rate limit')) {
        
        if (attempt <= RATE_LIMIT_CONFIG.maxRetries) {
          const delay = rateLimiter.getRetryDelay();
          logger.warn(`Rate limit hit for ${endpoint}, retry ${attempt}/${RATE_LIMIT_CONFIG.maxRetries} in ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
          rateLimiter.incrementRetry();
          continue;
        }
      }
      
      // For non-rate-limit errors, don't retry on subsequent attempts
      if (!errorMsg.includes('429') && !errorMsg.includes('rate limit')) {
        logger.error(`Non-rate-limit error for ${endpoint}:`, error);
        break;
      }
    }
  }
  
  logger.error(`API request failed for ${endpoint} after ${RATE_LIMIT_CONFIG.maxRetries + 1} attempts:`, lastError);
  throw lastError;
}

export const sportsApi = {
  getScoreboard: async (date?: string): Promise<ApiResponse> => {
    return makeRequest(async () => {
      const dateParam = date ? `?dates=${date}` : '';
      const response = await fetch(`${API_BASE_URL}/scoreboard${dateParam}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(`API rate limit exceeded: ${response.status} ${response.statusText}`);
        }
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    }, 'scoreboard');
  },

  getTeams: async (): Promise<unknown> => {
    return makeRequest(async () => {
      const response = await fetch(`${API_BASE_URL}/teams`);
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(`API rate limit exceeded: ${response.status} ${response.statusText}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    }, 'teams');
  },

  getStandings: async (): Promise<unknown> => {
    return makeRequest(async () => {
      const response = await fetch(`${API_BASE_URL}/standings`);
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(`API rate limit exceeded: ${response.status} ${response.statusText}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    }, 'standings');
  },

  getBoxScore: async (gameId: string): Promise<BoxScoreResponse> => {
    return makeRequest(async () => {
      const response = await fetch(`${API_BASE_URL}/summary?event=${gameId}`);
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(`API rate limit exceeded: ${response.status} ${response.statusText}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    }, 'boxscore');
  }
};