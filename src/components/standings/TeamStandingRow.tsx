import { TeamStanding } from '../../types/game';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TeamStandingRowProps {
  teamStanding: TeamStanding;
  rank: number;
}

export default function TeamStandingRow({ teamStanding, rank }: TeamStandingRowProps) {
  const { team, stats, note } = teamStanding;

  // Helper function to get stat value by name
  const getStatValue = (statName: string): string => {
    const stat = stats.find(s => s.name === statName);
    return stat?.displayValue || '0';
  };

  const wins = getStatValue('wins');
  const losses = getStatValue('losses');
  const winPercent = getStatValue('winPercent');
  const gamesBehind = getStatValue('gamesBehind');

  // Determine if this team is in playoff position (top 8)
  const isPlayoffPosition = rank <= 8;

  // Determine if this team is in play-in position (9-10)
  const isPlayInPosition = rank >= 9 && rank <= 10;

  return (
    <div className={cn(
      "flex items-center justify-between p-3 hover:bg-accent/20 transition-colors duration-200 group",
      isPlayoffPosition && "bg-green-50/50 dark:bg-green-950/20",
      isPlayInPosition && "bg-yellow-50/50 dark:bg-yellow-950/20"
    )}>
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        {/* Rank */}
        <div className={cn(
          "w-6 text-center text-sm font-semibold",
          isPlayoffPosition && "text-green-600 dark:text-green-400",
          isPlayInPosition && "text-yellow-600 dark:text-yellow-400"
        )}>
          {rank}
        </div>

        {/* Team Logo & Name */}
        <div className="flex items-center space-x-3 min-w-0">
          <Avatar className="h-8 w-8 border border-border flex-shrink-0">
            <AvatarImage
              src={team.logo}
              alt={team.name}
              className="object-contain p-1"
            />
            <AvatarFallback className="text-xs font-bold bg-muted">
              {team.abbreviation}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="font-semibold text-sm truncate group-hover:text-primary transition-colors duration-200">
              {team.name}
            </div>
            {note && (
              <Badge
                variant="outline"
                className="mt-1 text-xs"
                style={{
                  borderColor: `#${note.color}`,
                  color: `#${note.color}`
                }}
              >
                {note.description}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex space-x-6 text-center text-sm">
        <div className="w-8 font-semibold">{wins}</div>
        <div className="w-8 font-semibold">{losses}</div>
        <div className="w-12 font-medium">{winPercent}</div>
        <div className="w-8 font-medium text-muted-foreground">{gamesBehind}</div>
      </div>
    </div>
  );
}