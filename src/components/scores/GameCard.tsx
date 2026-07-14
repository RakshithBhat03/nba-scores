import { Game } from '../../types/game';
import { formatGameTime, cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

interface GameCardProps {
  game: Game;
  onCardClick: (gameId: string) => void;
}

/** Normalize a team color (hex without #, or "ffffff") to an rgba string. */
function teamColor(color: string | undefined, alpha: number = 1): string {
  if (!color) return `hsl(var(--foreground) / ${alpha})`;
  const hex = color.replace('#', '');
  if (hex.length !== 6) return `hsl(var(--foreground) / ${alpha})`;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function GameCard({ game, onCardClick }: GameCardProps) {
  const isLive = game.status === 'in';
  const isFinal = game.status === 'final';
  const isScheduled = game.status === 'scheduled';

  const variant = isLive ? 'live' : isFinal ? 'final' : 'game';

  const hasScore = !!game.score;
  const awayScore = game.score?.away;
  const homeScore = game.score?.home;
  const isAwayWinning = hasScore && awayScore !== undefined && homeScore !== undefined && awayScore > homeScore;
  const isHomeWinning = hasScore && awayScore !== undefined && homeScore !== undefined && homeScore > awayScore;

  const renderStatus = () => {
    if (isLive) {
      return (
        <div className="flex items-center justify-center gap-1.5">
          <Badge variant="live" className="gap-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live-foreground opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live-foreground" />
            </span>
            LIVE
          </Badge>
          {game.displayClock && game.period && (
            <span className="tabular-nums text-[11px] font-bold text-live">
              Q{game.period} · {game.displayClock}
            </span>
          )}
        </div>
      );
    }
    if (isFinal) {
      const ot = game.period && game.period > 4;
      return <Badge variant="final">{ot ? 'FINAL/OT' : 'FINAL'}</Badge>;
    }
    return (
      <Badge variant="scheduled">
        {formatGameTime(game.date)}
      </Badge>
    );
  };

  const renderTeamRow = (team: Game['awayTeam'], isHome: boolean, winning: boolean) => {
    const score = isHome ? homeScore : awayScore;
    return (
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <Avatar
            className={cn(
              'h-9 w-9 flex-shrink-0 border bg-background/60 ring-1 ring-border/50',
              isLive && 'border-live/40'
            )}
          >
            <AvatarImage src={team.logo} alt={team.name} className="object-contain p-1" />
            <AvatarFallback className="text-[10px] font-extrabold">{team.abbreviation}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-bold leading-tight">
              {team.abbreviation}
            </div>
            {team.record ? (
              <div className="text-[10px] font-medium text-muted-foreground tabular-nums">
                {team.record.wins}-{team.record.losses}
              </div>
            ) : null}
          </div>
        </div>
        {hasScore && score !== undefined ? (
          <span
            className={cn(
              'tabular-nums text-2xl font-extrabold leading-none',
              winning ? 'text-foreground' : 'text-muted-foreground/70'
            )}
          >
            {score}
          </span>
        ) : isScheduled ? (
          <span className="text-xs font-medium text-muted-foreground/60">vs</span>
        ) : null}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        variant={variant}
        size="game"
        onClick={() => onCardClick(game.id)}
        className="group relative cursor-pointer overflow-hidden"
      >
        {/* Team-color accent strip */}
        {!isLive && (
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-1"
            style={{
              background: `linear-gradient(90deg, ${teamColor(game.awayTeam?.color, 0.95)} 0%, ${teamColor(game.awayTeam?.color, 0.5)} 50%, ${teamColor(game.homeTeam?.color, 0.95)} 100%)`,
            }}
          />
        )}

        {/* Status header */}
        <div className="flex items-center justify-center pt-2.5 pb-1.5">
          {renderStatus()}
        </div>

        {/* Teams */}
        <div className="space-y-1.5 px-3 pb-3 pt-1">
          {renderTeamRow(game.awayTeam, false, !!isAwayWinning)}
          <div className="flex items-center gap-3 py-0.5">
            <div className="h-px flex-1 bg-border/60" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">
              {isLive ? 'In Progress' : isFinal ? 'Final' : 'Matchup'}
            </span>
            <div className="h-px flex-1 bg-border/60" />
          </div>
          {renderTeamRow(game.homeTeam, true, !!isHomeWinning)}
        </div>
      </Card>
    </motion.div>
  );
}
