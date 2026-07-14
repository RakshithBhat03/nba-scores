import { TeamStanding } from '../../types/game';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useFavoriteTeam } from '@/hooks/useFavoriteTeam';

interface TeamStandingRowProps {
  teamStanding: TeamStanding;
  rank: number;
}

export default function TeamStandingRow({ teamStanding, rank }: TeamStandingRowProps) {
  const { team, stats, note } = teamStanding;
  const { favoriteTeam } = useFavoriteTeam();

  const getStatValue = (statName: string): string => {
    const stat = stats.find(s => s.name === statName);
    return stat?.displayValue || '0';
  };

  const wins = getStatValue('wins');
  const losses = getStatValue('losses');
  const winPercent = getStatValue('winPercent');
  const gamesBehind = getStatValue('gamesBehind');

  const isPlayoffPosition = rank <= 8;
  const isPlayInPosition = rank >= 9 && rank <= 10;
  const isFavorite = favoriteTeam === team.id;

  const zoneClass = isPlayoffPosition
    ? 'border-l-playoff'
    : isPlayInPosition
    ? 'border-l-playin'
    : 'border-l-transparent';

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-2 border-l-2 px-2.5 py-2 transition-colors duration-200 group hover:bg-accent/40',
        zoneClass,
        isFavorite && 'bg-primary/5'
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        {/* Rank chip */}
        <div
          className={cn(
            'grid h-6 w-6 flex-shrink-0 place-items-center rounded-md text-xs font-bold tabular-nums',
            isPlayoffPosition && 'bg-playoff/15 text-playoff',
            isPlayInPosition && 'bg-playin/15 text-playin',
            !isPlayoffPosition && !isPlayInPosition && 'bg-muted text-muted-foreground'
          )}
        >
          {rank}
        </div>

        {/* Team logo & name */}
        <div className="flex min-w-0 items-center gap-2">
          <Avatar className="h-7 w-7 flex-shrink-0 border border-border/60 bg-background/60">
            <AvatarImage src={team.logo} alt={team.name} className="object-contain p-1" />
            <AvatarFallback className="text-[9px] font-extrabold">{team.abbreviation}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-[13px] font-semibold leading-tight group-hover:text-primary transition-colors">
                {team.name}
              </span>
              {isFavorite && <span className="text-[10px] text-primary">★</span>}
            </div>
            {note && (
              <span
                className="mt-0.5 inline-block text-[10px] font-medium leading-none"
                style={{ color: `#${note.color}` }}
              >
                {note.description}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center text-center text-sm tabular-nums">
        <div className="w-8 font-semibold">{wins}</div>
        <div className="w-8 font-semibold">{losses}</div>
        <div className="w-12 font-bold">{winPercent}</div>
        <div className="w-8 text-xs font-medium text-muted-foreground">{gamesBehind}</div>
      </div>
    </div>
  );
}
