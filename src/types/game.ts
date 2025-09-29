export interface Game {
  id: string;
  date: string;
  status: 'scheduled' | 'in' | 'final';
  homeTeam: Team;
  awayTeam: Team;
  score?: {
    home: number;
    away: number;
  };
  period?: number;
  displayClock?: string;
  venue?: string;
}

export interface Team {
  id: string;
  name: string;
  displayName: string;
  abbreviation: string;
  logo: string;
  color: string;
  alternateColor: string;
  record?: {
    wins: number;
    losses: number;
  };
}

export interface BoxScore {
  gameId: string;
  homeTeam: TeamStats;
  awayTeam: TeamStats;
  leaders?: GameLeaders;
}

export interface TeamStats {
  team: Team;
  score: number;
  statistics: Statistic[];
  players: Player[];
}

export interface Player {
  id: string;
  displayName: string;
  jersey: string;
  position: string;
  statistics: Statistic[];
}

export interface Statistic {
  name: string;
  abbreviation: string;
  displayValue: string;
  value: number;
}

export interface GameLeaders {
  points: Leader;
  rebounds: Leader;
  assists: Leader;
}

export interface Leader {
  displayValue: string;
  leaders: {
    athlete: {
      id: string;
      displayName: string;
      headshot: string;
    };
    team: Team;
  }[];
}

export interface Standings {
  season: {
    year: number;
    type: number;
  };
  conferences: Conference[];
}

export interface Conference {
  id: string;
  name: string;
  abbreviation: string;
  standings: TeamStanding[];
}

export interface TeamStanding {
  team: Team;
  stats: StandingStat[];
  note?: {
    color: string;
    description: string;
    rank: number;
  };
}

export interface StandingStat {
  name: string;
  displayName: string;
  shortDisplayName: string;
  description: string;
  abbreviation: string;
  value: number;
  displayValue: string;
  type: string;
}