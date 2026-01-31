import { UserSettings } from '../types/settings';
import { z } from 'zod';

// Schema validation for stored settings
const settingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  timezone: z.string().optional(),
  autoRefresh: z.boolean().optional(),
  refreshInterval: z.number().optional(),
  favoriteTeams: z.array(z.string()).optional()
});

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  autoRefresh: true,
  refreshInterval: 30000, // 30 seconds
  favoriteTeams: []
};

export const storage = {
  async getSettings(): Promise<UserSettings> {
    try {
      // Check if chrome.storage is available
      if (typeof chrome !== 'undefined' && chrome.storage) {
        const result = await chrome.storage.sync.get('settings');
        const storedSettings = result.settings as Partial<UserSettings> | undefined;
        return { ...DEFAULT_SETTINGS, ...storedSettings };
      } else {
        // Fallback to localStorage for development with validation
        const stored = localStorage.getItem('nba-settings');
        if (!stored) {
          return DEFAULT_SETTINGS;
        }
        
        try {
          const parsed = JSON.parse(stored);
          const validated = settingsSchema.parse(parsed);
          return { ...DEFAULT_SETTINGS, ...validated };
        } catch (parseError) {
          localStorage.removeItem('nba-settings');
          return DEFAULT_SETTINGS;
        }
      }
    } catch (error) {
      console.error('Failed to get settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  async saveSettings(settings: Partial<UserSettings>): Promise<void> {
    try {
      const currentSettings = await this.getSettings();
      const updatedSettings = { ...currentSettings, ...settings };

      if (typeof chrome !== 'undefined' && chrome.storage) {
        await chrome.storage.sync.set({ settings: updatedSettings });
      } else {
        localStorage.setItem('nba-settings', JSON.stringify(updatedSettings));
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },

  async clearSettings(): Promise<void> {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        await chrome.storage.sync.remove('settings');
      } else {
        localStorage.removeItem('nba-settings');
      }
    } catch (error) {
      console.error('Failed to clear settings:', error);
    }
  }
};