export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  timezone: string;
  autoRefresh: boolean;
  refreshInterval: number;
  favoriteTeams: string[];
}

export interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
}