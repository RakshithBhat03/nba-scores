import { useQuery } from '@tanstack/react-query';
import { sportsApi } from '../services/api';
import { Game } from '../types/game';
import { format } from 'date-fns';

export function useScores(date?: Date) {
  const dateString = date ? format(date, 'yyyyMMdd') : undefined;

  return useQuery({
    queryKey: ['scores', dateString],
    queryFn: () => sportsApi.getScoreboard(dateString),
    select: (data): Game[] => {
      if (!data?.events) {
        return [];
      }

      return data.events.map((event: any): Game | null => {
        const competition = event.competitions?.[0];
        if (!competition) {
          return null;
        }

        // Find home and away teams (home is typically homeAway: 'home')
        const homeTeam = competition.competitors.find((c: any) => c.homeAway === 'home') || competition.competitors[0];
        const awayTeam = competition.competitors.find((c: any) => c.homeAway === 'away') || competition.competitors[1];

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
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}