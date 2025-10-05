import { useQuery } from '@tanstack/react-query';
import type { Standings } from '../types/game';
import nbaTeamsData from '../data/nbaTeams.json';

// URL validation helper
function isValidApiUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    // Only allow HTTPS and specific domains
    return parsedUrl.protocol === 'https:' && 
           (parsedUrl.hostname.includes('espn') || 
            parsedUrl.hostname.includes('nba') ||
            parsedUrl.hostname.includes('cdn'));
  } catch {
    return false;
  }
}

interface TeamStandingWithStats {
  team: {
    id: string;
    name: string;
    displayName: string;
    abbreviation: string;
    logo: string;
    color: string;
    alternateColor: string;
  };
  conference: 'eastern' | 'western';
  stats: Array<{
    name: string;
    displayName: string;
    shortDisplayName: string;
    description: string;
    abbreviation: string;
    value: number;
    displayValue: string;
    type: string;
  }>;
}

async function fetchConferenceStandings(groupId: number): Promise<TeamStandingWithStats[]> {
  try {
    const coreApiUrl = import.meta.env.VITE_CORE_API_BASE_URL;
    const standingsResponse = await fetch(`${coreApiUrl}/seasons/2025/types/2/groups/${groupId}/standings/0?lang=en&region=us`);
    if (!standingsResponse.ok) {
      throw new Error(`Failed to fetch standings for group ${groupId}`);
    }
    const standingsData = await standingsResponse.json();

    const teamStandings: TeamStandingWithStats[] = [];

    if (standingsData.standings) {
      for (const entry of standingsData.standings) {
        try {
          // Validate team URL before fetching
          if (!entry.team?.$ref || !isValidApiUrl(entry.team.$ref)) {
          
            continue;
          }

          // Fetch team details with validated URL
          const teamResponse = await fetch(entry.team.$ref);
          if (!teamResponse.ok) continue;

          const team = await teamResponse.json();

          // Find team info from our static data
          const teamInfo = nbaTeamsData.teams.find(t => t.id === team.id);

          if (teamInfo && entry.records?.[0]) {
            const overallRecord = entry.records[0];

            teamStandings.push({
              team: {
                id: team.id,
                name: team.displayName || teamInfo.name,
                displayName: team.displayName || teamInfo.name,
                abbreviation: team.abbreviation || teamInfo.abbreviation,
                logo: team.logos?.[0]?.href || '',
                color: team.color || '000000',
                alternateColor: team.alternateColor || 'FFFFFF'
              },
              conference: teamInfo.conference as 'eastern' | 'western',
              stats: [
                {
                  name: 'wins',
                  displayName: 'Wins',
                  shortDisplayName: 'W',
                  description: 'Wins',
                  abbreviation: 'W',
                  value: overallRecord.stats.find((s: { name: string; value: number; displayValue: string }) => s.name === 'wins')?.value || 0,
                  displayValue: overallRecord.stats.find((s: { name: string; value: number; displayValue: string }) => s.name === 'wins')?.displayValue || '0',
                  type: 'total'
                },
                {
                  name: 'losses',
                  displayName: 'Losses',
                  shortDisplayName: 'L',
                  description: 'Losses',
                  abbreviation: 'L',
                  value: overallRecord.stats.find((s: { name: string; value: number; displayValue: string }) => s.name === 'losses')?.value || 0,
                  displayValue: overallRecord.stats.find((s: { name: string; value: number; displayValue: string }) => s.name === 'losses')?.displayValue || '0',
                  type: 'total'
                },
                {
                  name: 'winPercent',
                  displayName: 'Win Percentage',
                  shortDisplayName: 'PCT',
                  description: 'Win Percentage',
                  abbreviation: 'PCT',
                  value: overallRecord.stats.find((s: { name: string; value: number; displayValue: string }) => s.name === 'winPercent')?.value || 0,
                  displayValue: overallRecord.stats.find((s: { name: string; value: number; displayValue: string }) => s.name === 'winPercent')?.displayValue || '.000',
                  type: 'percentage'
                },
                {
                  name: 'gamesBehind',
                  displayName: 'Games Behind',
                  shortDisplayName: 'GB',
                  description: 'Games Behind',
                  abbreviation: 'GB',
                  value: overallRecord.stats.find((s: { name: string; value: number; displayValue: string }) => s.name === 'gamesBehind')?.value || 0,
                  displayValue: overallRecord.stats.find((s: { name: string; value: number; displayValue: string }) => s.name === 'gamesBehind')?.displayValue || '-',
                  type: 'total'
                }
              ]
            });
          }
        } catch (error) {
        
          continue;
        }
      }
    }

    return teamStandings;
  } catch (error) {

    return [];
  }
}

async function fetchStandingsFromApi(): Promise<TeamStandingWithStats[]> {
  try {
    // Fetch both Eastern (group 5) and Western (group 6) conference standings
    const [easternStandings, westernStandings] = await Promise.all([
      fetchConferenceStandings(5), // Eastern Conference
      fetchConferenceStandings(6)  // Western Conference
    ]);

    // Combine both conferences
    return [...easternStandings, ...westernStandings];
  } catch (error) {
  
    return [];
  }
}

export async function fetchStandings(): Promise<Standings> {
  try {
    const allTeams = await fetchStandingsFromApi();

    if (allTeams.length === 0) {
      throw new Error('No teams fetched');
    }

    // Separate teams by conference
    const easternTeams = allTeams.filter(team => team.conference === 'eastern');
    const westernTeams = allTeams.filter(team => team.conference === 'western');

    // Sort by win percentage (descending)
    const sortTeams = (teams: TeamStandingWithStats[]) => {
      return teams.sort((a, b) => {
        const aWinPct = a.stats.find((s) => s.name === 'winPercent')?.value || 0;
        const bWinPct = b.stats.find((s) => s.name === 'winPercent')?.value || 0;
        return bWinPct - aWinPct;
      });
    };

    // Calculate games behind for each conference
    const addGamesBehind = (teams: TeamStandingWithStats[]): TeamStandingWithStats[] => {
      if (teams.length === 0) return teams;

      const topWins = teams[0].stats.find((s) => s.name === 'wins')?.value || 0;
      const topLosses = teams[0].stats.find((s) => s.name === 'losses')?.value || 0;

      return teams.map(team => {
        const wins = team.stats.find((s) => s.name === 'wins')?.value || 0;
        const losses = team.stats.find((s) => s.name === 'losses')?.value || 0;
        const gamesBehind = ((topWins - wins) + (losses - topLosses)) / 2;

        // Update games behind stat
        const gbStat = team.stats.find((s) => s.name === 'gamesBehind');
        if (gbStat) {
          gbStat.value = gamesBehind;
          gbStat.displayValue = gamesBehind === 0 ? '-' : gamesBehind % 1 === 0 ? gamesBehind.toString() : gamesBehind.toFixed(1);
        }

        return team;
      });
    };

    const sortedEastern = addGamesBehind(sortTeams(easternTeams));
    const sortedWestern = addGamesBehind(sortTeams(westernTeams));

    const standings: Standings = {
      season: {
        year: 2025,
        type: 2
      },
      conferences: [
        {
          id: 'eastern',
          name: 'Eastern Conference',
          abbreviation: 'East',
          standings: sortedEastern.map(team => ({
            team: team.team,
            stats: team.stats
          }))
        },
        {
          id: 'western',
          name: 'Western Conference',
          abbreviation: 'West',
          standings: sortedWestern.map(team => ({
            team: team.team,
            stats: team.stats
          }))
        }
      ]
    };

    return standings;
  } catch (error) {
  
    // Return empty standings as fallback
    return {
      season: { year: 2025, type: 2 },
      conferences: []
    };
  }
}

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