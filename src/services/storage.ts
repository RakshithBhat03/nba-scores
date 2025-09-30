import { UserSettings } from '../types/settings';
import { logger } from '../utils/logger';

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  autoRefresh: true,
  refreshInterval: 30000, // 30 seconds
  favoriteTeams: []
};

const isProduction = import.meta.env.MODE === 'production';

export const storage = {
  async getSettings(): Promise<UserSettings> {
    try {
      // Check if chrome.storage is available
      if (typeof chrome !== 'undefined' && chrome.storage) {
        const result = await chrome.storage.sync.get('settings');
        return { ...DEFAULT_SETTINGS, ...result.settings };
      } else if (!isProduction) {
        // Fallback to localStorage for development only
        const stored = localStorage.getItem('nba-settings');
        return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
      } else {
        // In production, chrome.storage must be available
        logger.error('Chrome storage API not available in production');
        return DEFAULT_SETTINGS;
      }
    } catch (error) {
      logger.error('Failed to get settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  async saveSettings(settings: Partial<UserSettings>): Promise<void> {
    try {
      const currentSettings = await this.getSettings();
      const updatedSettings = { ...currentSettings, ...settings };

      if (typeof chrome !== 'undefined' && chrome.storage) {
        await chrome.storage.sync.set({ settings: updatedSettings });
      } else if (!isProduction) {
        // Fallback to localStorage for development only
        localStorage.setItem('nba-settings', JSON.stringify(updatedSettings));
      } else {
        logger.error('Chrome storage API not available in production');
      }
    } catch (error) {
      logger.error('Failed to save settings:', error);
    }
  },

  async clearSettings(): Promise<void> {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        await chrome.storage.sync.remove('settings');
      } else if (!isProduction) {
        // Fallback to localStorage for development only
        localStorage.removeItem('nba-settings');
      } else {
        logger.error('Chrome storage API not available in production');
      }
    } catch (error) {
      logger.error('Failed to clear settings:', error);
    }
  }
};