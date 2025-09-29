import { useQuery } from '@tanstack/react-query';
import type { Standings } from '../types/game';

const MOCK_STANDINGS: Standings = {
  season: {
    year: 2024,
    type: 2
  },
  conferences: [
    {
      id: 'eastern',
      name: 'Eastern Conference',
      abbreviation: 'East',
      standings: [
        {
          team: {
            id: '1',
            name: 'Celtics',
            displayName: 'Boston Celtics',
            abbreviation: 'BOS',
            logo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
            color: '007A33',
            alternateColor: 'BA9653'
          },
          stats: [
            { name: 'wins', displayName: 'Wins', shortDisplayName: 'W', description: 'Wins', abbreviation: 'W', value: 64, displayValue: '64', type: 'total' },
            { name: 'losses', displayName: 'Losses', shortDisplayName: 'L', description: 'Losses', abbreviation: 'L', value: 18, displayValue: '18', type: 'total' },
            { name: 'winPercent', displayName: 'Win Percentage', shortDisplayName: 'PCT', description: 'Win Percentage', abbreviation: 'PCT', value: 0.780, displayValue: '.780', type: 'percentage' },
            { name: 'gamesBehind', displayName: 'Games Behind', shortDisplayName: 'GB', description: 'Games Behind', abbreviation: 'GB', value: 0, displayValue: '-', type: 'total' }
          ]
        },
        {
          team: {
            id: '2',
            name: 'Knicks',
            displayName: 'New York Knicks',
            abbreviation: 'NYK',
            logo: 'https://a.espncdn.com/i/teamlogos/nba/500/ny.png',
            color: '006BB6',
            alternateColor: 'F58426'
          },
          stats: [
            { name: 'wins', displayName: 'Wins', shortDisplayName: 'W', description: 'Wins', abbreviation: 'W', value: 50, displayValue: '50', type: 'total' },
            { name: 'losses', displayName: 'Losses', shortDisplayName: 'L', description: 'Losses', abbreviation: 'L', value: 32, displayValue: '32', type: 'total' },
            { name: 'winPercent', displayName: 'Win Percentage', shortDisplayName: 'PCT', description: 'Win Percentage', abbreviation: 'PCT', value: 0.610, displayValue: '.610', type: 'percentage' },
            { name: 'gamesBehind', displayName: 'Games Behind', shortDisplayName: 'GB', description: 'Games Behind', abbreviation: 'GB', value: 14, displayValue: '14', type: 'total' }
          ]
        },
        {
          team: {
            id: '3',
            name: 'Bucks',
            displayName: 'Milwaukee Bucks',
            abbreviation: 'MIL',
            logo: 'https://a.espncdn.com/i/teamlogos/nba/500/mil.png',
            color: '00471B',
            alternateColor: 'EEE1C6'
          },
          stats: [
            { name: 'wins', displayName: 'Wins', shortDisplayName: 'W', description: 'Wins', abbreviation: 'W', value: 49, displayValue: '49', type: 'total' },
            { name: 'losses', displayName: 'Losses', shortDisplayName: 'L', description: 'Losses', abbreviation: 'L', value: 33, displayValue: '33', type: 'total' },
            { name: 'winPercent', displayName: 'Win Percentage', shortDisplayName: 'PCT', description: 'Win Percentage', abbreviation: 'PCT', value: 0.598, displayValue: '.598', type: 'percentage' },
            { name: 'gamesBehind', displayName: 'Games Behind', shortDisplayName: 'GB', description: 'Games Behind', abbreviation: 'GB', value: 15, displayValue: '15', type: 'total' }
          ]
        }
      ]
    },
    {
      id: 'western',
      name: 'Western Conference',
      abbreviation: 'West',
      standings: [
        {
          team: {
            id: '4',
            name: 'Thunder',
            displayName: 'Oklahoma City Thunder',
            abbreviation: 'OKC',
            logo: 'https://a.espncdn.com/i/teamlogos/nba/500/okc.png',
            color: '007AC1',
            alternateColor: 'EF3B24'
          },
          stats: [
            { name: 'wins', displayName: 'Wins', shortDisplayName: 'W', description: 'Wins', abbreviation: 'W', value: 57, displayValue: '57', type: 'total' },
            { name: 'losses', displayName: 'Losses', shortDisplayName: 'L', description: 'Losses', abbreviation: 'L', value: 25, displayValue: '25', type: 'total' },
            { name: 'winPercent', displayName: 'Win Percentage', shortDisplayName: 'PCT', description: 'Win Percentage', abbreviation: 'PCT', value: 0.695, displayValue: '.695', type: 'percentage' },
            { name: 'gamesBehind', displayName: 'Games Behind', shortDisplayName: 'GB', description: 'Games Behind', abbreviation: 'GB', value: 0, displayValue: '-', type: 'total' }
          ]
        },
        {
          team: {
            id: '5',
            name: 'Nuggets',
            displayName: 'Denver Nuggets',
            abbreviation: 'DEN',
            logo: 'https://a.espncdn.com/i/teamlogos/nba/500/den.png',
            color: '0E2240',
            alternateColor: 'FEC524'
          },
          stats: [
            { name: 'wins', displayName: 'Wins', shortDisplayName: 'W', description: 'Wins', abbreviation: 'W', value: 57, displayValue: '57', type: 'total' },
            { name: 'losses', displayName: 'Losses', shortDisplayName: 'L', description: 'Losses', abbreviation: 'L', value: 25, displayValue: '25', type: 'total' },
            { name: 'winPercent', displayName: 'Win Percentage', shortDisplayName: 'PCT', description: 'Win Percentage', abbreviation: 'PCT', value: 0.695, displayValue: '.695', type: 'percentage' },
            { name: 'gamesBehind', displayName: 'Games Behind', shortDisplayName: 'GB', description: 'Games Behind', abbreviation: 'GB', value: 0, displayValue: '-', type: 'total' }
          ]
        },
        {
          team: {
            id: '6',
            name: 'Timberwolves',
            displayName: 'Minnesota Timberwolves',
            abbreviation: 'MIN',
            logo: 'https://a.espncdn.com/i/teamlogos/nba/500/min.png',
            color: '0C2340',
            alternateColor: '236192'
          },
          stats: [
            { name: 'wins', displayName: 'Wins', shortDisplayName: 'W', description: 'Wins', abbreviation: 'W', value: 56, displayValue: '56', type: 'total' },
            { name: 'losses', displayName: 'Losses', shortDisplayName: 'L', description: 'Losses', abbreviation: 'L', value: 26, displayValue: '26', type: 'total' },
            { name: 'winPercent', displayName: 'Win Percentage', shortDisplayName: 'PCT', description: 'Win Percentage', abbreviation: 'PCT', value: 0.683, displayValue: '.683', type: 'percentage' },
            { name: 'gamesBehind', displayName: 'Games Behind', shortDisplayName: 'GB', description: 'Games Behind', abbreviation: 'GB', value: 1, displayValue: '1', type: 'total' }
          ]
        }
      ]
    }
  ]
};

async function fetchStandings(): Promise<Standings> {
  try {
    const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/nba/standings');

    if (!response.ok) {
      throw new Error('Failed to fetch standings');
    }

    const data = await response.json();

    // Transform ESPN API response to our format
    const standings: Standings = {
      season: data.season,
      conferences: data.children?.map((conference: any) => ({
        id: conference.id,
        name: conference.name,
        abbreviation: conference.abbreviation,
        standings: conference.standings?.entries?.map((entry: any) => ({
          team: {
            id: entry.team.id,
            name: entry.team.name,
            displayName: entry.team.displayName,
            abbreviation: entry.team.abbreviation,
            logo: entry.team.logos?.[0]?.href || '',
            color: entry.team.color || '000000',
            alternateColor: entry.team.alternateColor || 'FFFFFF'
          },
          stats: entry.stats || []
        })) || []
      })) || []
    };

    return standings;
  } catch (error) {
    console.warn('Failed to fetch standings from ESPN API, using mock data:', error);
    return MOCK_STANDINGS;
  }
}

export function useStandings() {
  return useQuery({
    queryKey: ['standings'],
    queryFn: fetchStandings,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}