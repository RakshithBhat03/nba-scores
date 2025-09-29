export interface Standings {
  conferences: Conference[];
}

export interface Conference {
  id: string;
  name: string;
  abbreviation: string;
  standings: Standing[];
}

export interface Standing {
  team: {
    id: string;
    name: string;
    displayName: string;
    abbreviation: string;
    logo: string;
  };
  stats: StandingStat[];
  note?: {
    description: string;
    color: string;
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
}