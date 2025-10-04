import { useEffect, useState } from 'react';
import { RateLimitMonitor, RateLimitStatus } from '@/lib/rateLimiter';

export function useRateLimitStatus(monitor: RateLimitMonitor) {
  const [status, setStatus] = useState<RateLimitStatus>(monitor.getStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(monitor.getStatus());
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [monitor]);

  return status;
}