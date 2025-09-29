import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storage } from '../services/storage';
import { UserSettings } from '../types/settings';

export function useSettings() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: storage.getSettings,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (newSettings: Partial<UserSettings>) =>
      storage.saveSettings(newSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  return {
    settings: settings || {
      theme: 'system' as const,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      autoRefresh: true,
      refreshInterval: 30000,
      favoriteTeams: []
    },
    isLoading,
    updateSettings: updateSettingsMutation.mutate,
    isUpdating: updateSettingsMutation.isPending,
  };
}