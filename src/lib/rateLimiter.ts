import { logger } from '@/utils/logger';

// Re-export logger for other modules
export { logger };

export interface RateLimitStatus {
  isLimited: boolean;
  requestsInWindow: number;
  maxRequests: number;
  windowMs: number;
  timeUntilReset: number;
  totalRetries: number;
}

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  retryDelay: number;
  maxRetries: number;
}

export class RateLimitMonitor {
  private config: RateLimitConfig;
  private requests: number[] = [];
  private retryAttempts = 0;
  private totalRetries = 0;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  isRateLimited(): boolean {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    
    // Remove old requests outside the window
    this.requests = this.requests.filter(timestamp => timestamp > windowStart);
    
    return this.requests.length >= this.config.maxRequests;
  }

  recordRequest(): void {
    this.requests.push(Date.now());
  }

  async waitForAvailability(): Promise<void> {
    if (this.isRateLimited()) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = oldestRequest + this.config.windowMs - Date.now();
      
      if (waitTime > 0) {
        logger.warn(`Rate limited, waiting ${waitTime}ms before next request`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  shouldRetry(): boolean {
    return this.retryAttempts < this.config.maxRetries;
  }

  incrementRetry(): void {
    this.retryAttempts++;
    this.totalRetries++;
  }

  resetRetry(): void {
    this.retryAttempts = 0;
  }

  getRetryDelay(): number {
    return this.config.retryDelay * Math.pow(2, this.retryAttempts - 1); // Exponential backoff
  }

  getStatus(): RateLimitStatus {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    const recentRequests = this.requests.filter(timestamp => timestamp > windowStart);
    
    const oldestRequest = recentRequests.length > 0 ? Math.min(...recentRequests) : now;
    const timeUntilReset = Math.max(0, oldestRequest + this.config.windowMs - now);

    return {
      isLimited: this.isRateLimited(),
      requestsInWindow: recentRequests.length,
      maxRequests: this.config.maxRequests,
      windowMs: this.config.windowMs,
      timeUntilReset,
      totalRetries: this.totalRetries,
    };
  }

  reset(): void {
    this.requests = [];
    this.retryAttempts = 0;
    this.totalRetries = 0;
  }

  // Get human readable status
  getHumanReadableStatus(): string {
    const status = this.getStatus();
    
    if (status.isLimited) {
      const secondsUntilReset = Math.ceil(status.timeUntilReset / 1000);
      return `Rate limited (${secondsUntilReset}s until reset)`;
    }
    
    const requestsRemaining = status.maxRequests - status.requestsInWindow;
    return `${requestsRemaining} requests remaining in window`;
  }
}