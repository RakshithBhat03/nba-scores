import { useState } from 'react';
import { useScores } from '../../hooks/useScores';
import GameCard from './GameCard';
import DateCarousel from './DateCarousel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, AlertCircle, Calendar } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

function GameCardSkeleton() {
  return (
    <div className="p-3 rounded-lg border bg-card">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="h-4 w-10" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
        <div className="text-center">
          <Skeleton className="h-6 w-16 mx-auto" />
        </div>
      </div>
    </div>
  );
}

export default function ScoresList() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { data: games, isLoading, error, isFetching } = useScores(selectedDate);
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    const dateString = format(selectedDate, 'yyyyMMdd');
    queryClient.invalidateQueries({ queryKey: ['scores', dateString] });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <DateCarousel
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <GameCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <DateCarousel
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        <div className="py-8 text-center space-y-4">
          <div className="flex items-center justify-center text-destructive mb-2">
            <AlertCircle className="h-6 w-6 mr-2" />
            <span className="font-semibold">Failed to load games</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Check your internet connection or try again later
          </p>
          <Button onClick={handleRefresh} variant="outline" className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DateCarousel
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">
            {format(selectedDate, 'EEEE, MMMM d')} Games
          </h3>
          {games && games.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {games.length}
            </Badge>
          )}
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isFetching}
          variant="ghost"
          size="icon"
          className="transition-all duration-200"
          title="Refresh scores"
        >
          <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
        </Button>
      </div>

      <div className="max-h-96 overflow-y-auto scrollbar-thin">
        {games && games.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onCardClick={() => {
                  // TODO: Open box score modal
                  console.log('Opening box score for game:', game.id);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏀</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No games scheduled
            </h3>
            <p className="text-muted-foreground">
              Try selecting a different date to see more games
            </p>
          </div>
        )}
      </div>

      {isFetching && !isLoading && (
        <div className="flex items-center justify-center py-2 text-muted-foreground">
          <RefreshCw className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm">Updating scores...</span>
        </div>
      )}
    </div>
  );
}