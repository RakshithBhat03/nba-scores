import { Game } from '../../types/game';
import { formatGameTime, cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MapPin } from 'lucide-react';

interface GameCardProps {
  game: Game;
  onCardClick: (gameId: string) => void;
}

export default function GameCard({ game, onCardClick }: GameCardProps) {
  const getStatusDisplay = () => {
    switch (game.status) {
      case 'scheduled':
        return (
          <Badge variant="scheduled" className="text-xs">
            {formatGameTime(game.date)}
          </Badge>
        );
      case 'in':
        return (
          <div className="text-center space-y-1">
            <Badge variant="live" className="text-xs font-semibold">
              ● LIVE
            </Badge>
            {game.displayClock && game.period && (
              <div className="text-xs text-muted-foreground">
                Q{game.period} {game.displayClock}
              </div>
            )}
          </div>
        );
      case 'final':
        return (
          <Badge variant="final" className="text-xs">
            FINAL
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {String(game.status).toUpperCase()}
          </Badge>
        );
    }
  };

  const getCardVariant = () => {
    switch (game.status) {
      case 'in':
        return 'game';
      case 'final':
        return 'final';
      default:
        return 'game';
    }
  };

  const getScoreColor = (isWinning: boolean) => {
    if (!game.score) return 'text-foreground';
    return isWinning
      ? 'text-nba-primary-600 dark:text-nba-primary-400 font-bold'
      : 'text-muted-foreground';
  };

  const isAwayWinning = game.score && game.score.away > game.score.home;
  const isHomeWinning = game.score && game.score.home > game.score.away;

  return (
    <Card
      variant={getCardVariant()}
      size="game"
      onClick={() => onCardClick(game.id)}
      className="cursor-pointer group"
    >
        <div className="space-y-3">
          {/* Teams Section */}
          <div className="flex items-center justify-between">
            {/* Away Team */}
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <Avatar className="h-8 w-8 border border-border flex-shrink-0 group-hover:border-primary/50 transition-colors duration-200">
                <AvatarImage
                  src={game.awayTeam.logo}
                  alt={game.awayTeam.name}
                  className="object-contain p-1"
                />
                <AvatarFallback className="text-xs font-bold bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-200">
                  {game.awayTeam.abbreviation}
                </AvatarFallback>
              </Avatar>
              <div className="text-xs font-semibold truncate min-w-0 group-hover:text-primary transition-colors duration-200">
                {game.awayTeam.name}
              </div>
            </div>

            {/* VS or Score */}
            <div className="text-center px-4 flex-shrink-0">
              {game.score ? (
                <div className="flex items-center space-x-2">
                  <div className={cn("text-sm font-bold", getScoreColor(!!isAwayWinning))}>
                    {game.score.away}
                  </div>
                  <div className="text-xs text-muted-foreground">-</div>
                  <div className={cn("text-sm font-bold", getScoreColor(!!isHomeWinning))}>
                    {game.score.home}
                  </div>
                </div>
              ) : (
                <div className="text-xs font-medium text-muted-foreground">
                  VS
                </div>
              )}
            </div>

            {/* Home Team */}
            <div className="flex items-center space-x-3 min-w-0 flex-1 justify-end">
              <div className="text-xs font-semibold truncate min-w-0 text-right group-hover:text-primary transition-colors duration-200">
                {game.homeTeam.name}
              </div>
              <Avatar className="h-8 w-8 border border-border flex-shrink-0 group-hover:border-primary/50 transition-colors duration-200">
                <AvatarImage
                  src={game.homeTeam.logo}
                  alt={game.homeTeam.name}
                  className="object-contain p-1"
                />
                <AvatarFallback className="text-xs font-bold bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-200">
                  {game.homeTeam.abbreviation}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Status */}
          <div className="text-center">
            {getStatusDisplay()}
          </div>
        </div>

        {game.venue && (
          <div className="flex items-center justify-center mt-4 pt-3 border-t border-border">
            <MapPin className="h-3 w-3 text-muted-foreground mr-1" />
            <span className="text-xs text-muted-foreground truncate">
              {game.venue}
            </span>
          </div>
        )}
      </Card>
  );
}