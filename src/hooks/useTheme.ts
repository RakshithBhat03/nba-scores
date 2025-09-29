import { useEffect } from 'react';
import { useSettings } from './useSettings';

export function useTheme() {
  const { settings, updateSettings } = useSettings();

  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  const getEffectiveTheme = (): 'light' | 'dark' => {
    if (settings.theme === 'system') {
      return getSystemTheme();
    }
    return settings.theme === 'dark' ? 'dark' : 'light';
  };

  const toggleTheme = () => {
    const currentTheme = settings.theme;
    const newTheme = currentTheme === 'light' ? 'dark' : currentTheme === 'dark' ? 'system' : 'light';
    updateSettings({ theme: newTheme });
  };

  useEffect(() => {
    const effectiveTheme = getEffectiveTheme();
    const html = document.documentElement;
    const body = document.body;

    if (effectiveTheme === 'dark') {
      html.classList.add('dark');
      body.classList.add('dark');
    } else {
      html.classList.remove('dark');
      body.classList.remove('dark');
    }

    // Listen for system theme changes when in system mode
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const newSystemTheme = getSystemTheme();
        if (newSystemTheme === 'dark') {
          html.classList.add('dark');
          body.classList.add('dark');
        } else {
          html.classList.remove('dark');
          body.classList.remove('dark');
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.theme]);

  return {
    theme: settings.theme,
    effectiveTheme: getEffectiveTheme(),
    toggleTheme,
  };
}