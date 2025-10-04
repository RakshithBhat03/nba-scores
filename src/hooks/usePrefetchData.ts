import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { sportsApi } from '../services/api';

export function usePrefetchData() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Pre-fetch today's scores when the extension loads
    const prefetchScores = async () => {
      try {
        await queryClient.prefetchQuery({
          queryKey: ['scores', 'window', new Date().toISOString().slice(0, 10)],
          queryFn: async () => {
            // Get current date and format for API
            const date = new Date();
            const startDate = new Date(date);
            startDate.setDate(date.getDate() - 2);
            const endDate = new Date(date);
            endDate.setDate(date.getDate() + 2);
            
            const formatDate = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, '');
            const dateRange = `${formatDate(startDate)}-${formatDate(endDate)}`;
            
            return sportsApi.getScoreboard(dateRange);
          },
          staleTime: 2 * 60 * 1000, // 2 minutes
        });
      } catch (error) {
        console.warn('Failed to pre-fetch scores:', error);
      }
    };

    // Pre-fetch standings when the extension loads
    const prefetchStandings = async () => {
      try {
        await queryClient.prefetchQuery({
          queryKey: ['standings'],
          queryFn: async () => {
            // Import the fetchStandings function directly
            const { fetchStandings } = await import('../hooks/useStandings');
            return fetchStandings();
          },
          staleTime: 10 * 60 * 1000, // 10 minutes
        });
      } catch (error) {
        console.warn('Failed to pre-fetch standings:', error);
      }
    };

    // Start pre-fetching immediately when extension opens
    prefetchScores();
    prefetchStandings();

    // Set up periodic background refresh
    const scoresInterval = setInterval(prefetchScores, 2 * 60 * 1000); // Every 2 minutes
    const standingsInterval = setInterval(prefetchStandings, 10 * 60 * 1000); // Every 10 minutes

    return () => {
      clearInterval(scoresInterval);
      clearInterval(standingsInterval);
    };
  }, [queryClient]);
}