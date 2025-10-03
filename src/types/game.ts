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
  header?: unknown;
  boxscore: {
    teams: BoxScoreTeam[];
    players: BoxScorePlayer[];
  };
  leaders: BoxScoreLeader[];
  gameInfo?: unknown;
}

export interface BoxScoreTeam {
  team: Team;
  statistics: BoxScoreStatistic[];
  score?: number;
  homeAway: 'home' | 'away';
  displayOrder: number;
}

export interface BoxScorePlayer {
  team: Team;
  statistics: PlayerStats[];
}

export interface PlayerStats {
  names: string[];
  keys: string[];
  labels: string[];
  descriptions: string[];
  athletes: PlayerAthlete[];
}

export interface PlayerAthlete {
  active: boolean;
  athlete: {
    id: string;
    displayName: string;
    shortName: string;
    headshot: { href: string };
    jersey: string;
    position: { abbreviation: string };
  };
  starter: boolean;
  didNotPlay: boolean;
  reason: string;
  ejected: boolean;
  stats: string[];
}

export interface BoxScoreStatistic {
  name: string;
  displayValue: string;
  abbreviation: string;
  label: string;
}

export interface BoxScoreLeader {
  team: Team;
  leaders: LeaderCategory[];
}

export interface LeaderCategory {
  name: string;
  displayName: string;
  leaders: LeaderEntry[];
}

export interface LeaderEntry {
  displayValue: string;
  athlete: {
    id: string;
    displayName: string;
    headshot: { href: string };
    jersey: string;
    position: { abbreviation: string };
  };
  statistics: {
    name: string;
    displayName: string;
    abbreviation: string;
    value: number;
    displayValue: string;
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

// API Response Types
export interface GameEvent {
  id: string;
  date: string;
  status: {
    type: { name: string };
    period?: number;
    displayClock?: string;
  };
  competitions: GameCompetition[];
}

export interface GameCompetition {
  competitors: GameCompetitor[];
  venue?: { fullName: string };
}

export interface GameCompetitor {
  team: GameTeam;
  score?: string;
  homeAway: 'home' | 'away';
  records?: Array<{ summary: string }>;
}

export interface GameTeam {
  id: string;
  name?: string;
  displayName: string;
  abbreviation: string;
  logo: string;
  color?: string;
  alternateColor?: string;
}

export interface ApiResponse {
  events: GameEvent[];
}

export interface BoxScoreResponse {
  header: unknown;
  boxscore: {
    teams: BoxScoreTeam[];
    players: BoxScorePlayer[];
  };
  leaders: BoxScoreLeader[];
  gameInfo: unknown;
}

export interface StandingsResponse {
  standings: Array<{
    team: { $ref: string };
    records: Array<{
      stats: Array<{
        name: string;
        value: number;
        displayValue: string;
      }>;
    }>;
  }>;
}

export interface TeamResponse {
  id: string;
  displayName: string;
  abbreviation?: string;
  color?: string;
  alternateColor?: string;
  logos?: Array<{ href: string }>;
}