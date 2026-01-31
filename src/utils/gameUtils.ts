import type { Game } from '../types/game';

/**
 * Determines the sorting tier for a game based on favorite team and game status.
 * Lower tier = higher priority.
 *
 * Tier 1: Favorite team + LIVE
 * Tier 2: Favorite team + SCHEDULED
 * Tier 3: Favorite team + FINAL
 * Tier 4: Other LIVE games
 * Tier 5: Other SCHEDULED games
 * Tier 6: Other FINAL games
 */
function getGameSortTier(game: Game, favoriteTeamId: string | null): number {
  const hasFavorite = favoriteTeamId !== null && (
    game.homeTeam.id === favoriteTeamId ||
    game.awayTeam.id === favoriteTeamId
  );
  const isLive = game.status === 'in';
  const isScheduled = game.status === 'scheduled';

  if (hasFavorite && isLive) return 1;
  if (hasFavorite && isScheduled) return 2;
  if (hasFavorite) return 3; // final
  if (isLive) return 4;
  if (isScheduled) return 5;
  return 6; // final, no favorite
}

/**
 * Sorts games by priority: favorite team games first, then by status (live > scheduled > final),
 * and within each tier by game start time.
 */
export function sortGamesByPriority(
  games: Game[],
  favoriteTeamId: string | null
): Game[] {
  return [...games].sort((a, b) => {
    const tierA = getGameSortTier(a, favoriteTeamId);
    const tierB = getGameSortTier(b, favoriteTeamId);

    if (tierA !== tierB) return tierA - tierB;

    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
}
