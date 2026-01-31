import { useSettings } from './useSettings';

export function useFavoriteTeam() {
  const { settings, updateSettings } = useSettings();

  const favoriteTeam = settings.favoriteTeams[0] || null;

  const setFavoriteTeam = (teamId: string | null) => {
    updateSettings({
      favoriteTeams: teamId ? [teamId] : []
    });
  };

  return { favoriteTeam, setFavoriteTeam };
}
