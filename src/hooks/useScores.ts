import { useQuery } from '@tanstack/react-query';
import { sportsApi } from '../services/api';
import { Game, GameEvent, GameCompetitor } from '../types/game';
import { format, startOfDay, addDays } from 'date-fns';

export function useScores(date?: Date) {
  const targetDate = date || new Date();
  const normalizedDate = startOfDay(targetDate);

  // Calculate 5-day window centered on the target date (±2 days)
  const windowStart = addDays(normalizedDate, -2);
  const windowEnd = addDays(normalizedDate, 2);
  const windowKey = format(windowStart, 'yyyyMMdd');

  return useQuery({
    queryKey: ['scores', 'window', windowKey],
    queryFn: async () => {
      try {
        // Query for the 5-day window containing the target date
        const startDate = format(windowStart, 'yyyyMMdd');
        const endDate = format(windowEnd, 'yyyyMMdd');
        const dateRange = `${startDate}-${endDate}`;
        const data = await sportsApi.getScoreboard(dateRange);
        return data;
      } catch (error) {
        console.error('API error fetching scores:', error);
        throw error;
      }
    },
    select: (data): Game[] => {
      if (!data?.events) {
        return [];
      }

      return data.events
        .filter((event: GameEvent) => {
          if (!date) return true;
          // Filter games to only include those occurring on the selected date in user's timezone
          const gameDate = new Date(event.date);
          const gameInUserTimezone = new Date(gameDate.toLocaleString("en-US", {
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          }));
          return gameInUserTimezone.toDateString() === date.toDateString();
        })
        .map((event: GameEvent): Game | null => {
        const competition = event.competitions?.[0];
        if (!competition) {
          return null;
        }

        // Find home and away teams (home is typically homeAway: 'home')
        const homeTeam = competition.competitors.find((c: GameCompetitor) => c.homeAway === 'home') || competition.competitors[0];
        const awayTeam = competition.competitors.find((c: GameCompetitor) => c.homeAway === 'away') || competition.competitors[1];

        // Map status names to our format
        const statusMap: Record<string, 'scheduled' | 'in' | 'final'> = {
          'STATUS_SCHEDULED': 'scheduled',
          'STATUS_IN_PROGRESS': 'in',
          'STATUS_FINAL': 'final',
          'STATUS_FINAL_OT': 'final',
          'STATUS_HALFTIME': 'in',
          'STATUS_END_OF_PERIOD': 'in'
        };

        const status = statusMap[event.status?.type?.name] || 'scheduled';

        return {
          id: event.id,
          date: event.date,
          status,
          homeTeam: {
            id: homeTeam.team.id,
            name: homeTeam.team.name || homeTeam.team.displayName,
            displayName: homeTeam.team.displayName,
            abbreviation: homeTeam.team.abbreviation,
            logo: homeTeam.team.logo,
            color: homeTeam.team.color || '000000',
            alternateColor: homeTeam.team.alternateColor || 'ffffff',
            record: homeTeam.records?.[0] ? {
              wins: parseInt(homeTeam.records[0].summary.split('-')[0]) || 0,
              losses: parseInt(homeTeam.records[0].summary.split('-')[1]) || 0
            } : undefined
          },
          awayTeam: {
            id: awayTeam.team.id,
            name: awayTeam.team.name || awayTeam.team.displayName,
            displayName: awayTeam.team.displayName,
            abbreviation: awayTeam.team.abbreviation,
            logo: awayTeam.team.logo,
            color: awayTeam.team.color || '000000',
            alternateColor: awayTeam.team.alternateColor || 'ffffff',
            record: awayTeam.records?.[0] ? {
              wins: parseInt(awayTeam.records[0].summary.split('-')[0]) || 0,
              losses: parseInt(awayTeam.records[0].summary.split('-')[1]) || 0
            } : undefined
          },
          score: homeTeam.score !== undefined && awayTeam.score !== undefined ? {
            home: parseInt(homeTeam.score) || 0,
            away: parseInt(awayTeam.score) || 0
          } : undefined,
          period: event.status?.period,
          displayClock: event.status?.displayClock,
          venue: competition.venue?.fullName
        };
      }).filter(Boolean) as Game[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - reduced for fresher data
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchOnWindowFocus: true, // Refetch when extension popup opens
    refetchOnMount: true, // Always refetch when component mounts
    initialDataUpdatedAt: 0, // Force initial fetch if data is old
  });
}