import { useQuery } from '@tanstack/react-query';
import { fetchStandings } from '../utils/standingsUtils';

export function useStandings() {
  return useQuery({
    queryKey: ['standings'],
    queryFn: fetchStandings,
    staleTime: 10 * 60 * 1000, // 10 minutes - standings change less frequently
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: true, // Refetch when extension popup opens
    refetchOnMount: true, // Always refetch when component mounts
    initialDataUpdatedAt: 0, // Force initial fetch if data is old
  });
}