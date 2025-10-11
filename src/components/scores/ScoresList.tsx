import { useState, useEffect } from 'react';
import { useScores } from '../../hooks/useScores';
import { useGamePreview } from '@/hooks/useGamePreview';
import { BoxScore } from '@/types/game';
import GameCard from './GameCard';
import GamePreview from './GamePreview';
import DateCarousel from './DateCarousel';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { sportsApi } from '../../services/api';
import { format, startOfDay, addDays } from 'date-fns';
import nbaLogo48 from '/icons/icon48.png';

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
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const { data: games, isLoading, error, isFetching } = useScores(selectedDate);
  const { boxScore, isLoading: isPreviewLoading, openPreview, closePreview } = useGamePreview();
  const queryClient = useQueryClient();

  // Prefetch adjacent windows for smoother navigation
  useEffect(() => {
    const prefetchWindow = (date: Date) => {
      const normalizedDate = startOfDay(date);
      const windowStart = addDays(normalizedDate, -2);
      const windowKey = format(windowStart, 'yyyyMMdd');
      queryClient.prefetchQuery({
        queryKey: ['scores', 'window', windowKey],
        queryFn: async () => {
          const startDate = format(windowStart, 'yyyyMMdd');
          const endDate = format(addDays(windowStart, 4), 'yyyyMMdd');
          const dateRange = `${startDate}-${endDate}`;
          return await sportsApi.getScoreboard(dateRange);
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    };

    // Prefetch previous and next windows
    prefetchWindow(addDays(selectedDate, -5)); // Previous window
    prefetchWindow(addDays(selectedDate, 5));  // Next window
  }, [selectedDate, queryClient]);

  const handleRefresh = () => {
    // Calculate the window key for the current selected date
    const normalizedDate = startOfDay(selectedDate);
    const windowStart = addDays(normalizedDate, -2);
    const windowKey = format(windowStart, 'yyyyMMdd');
    queryClient.invalidateQueries({ queryKey: ['scores', 'window', windowKey] });
  };

  const handleGameClick = (gameId: string) => {
    try {
      setSelectedGameId(gameId);
      openPreview(gameId);
    } catch (error) {
      console.error('Failed to open game preview:', error);
      // Reset selected game ID on error
      setSelectedGameId(null);
    }
  };

  const handleBackToScores = () => {
    setSelectedGameId(null);
    closePreview();
  };

  if (isLoading || (isFetching && !games)) {
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
    <div className="space-y-2 w-full">
      <DateCarousel
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {/* Background refresh indicator */}
      {isFetching && games && (
        <div className="flex items-center justify-center text-xs text-muted-foreground py-1">
          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
          Updating scores...
        </div>
      )}

      <div className="w-full">
        {selectedGameId ? (
          <GamePreview
            boxScore={boxScore as BoxScore | null}
            isLoading={isPreviewLoading}
            onClose={handleBackToScores}
          />
        ) : games && games.length > 0 ? (
          <div className="w-full">
            <div className="grid grid-cols-3 gap-3 w-full">
              {games.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onCardClick={() => {
                    if (game.status === 'in' || game.status === 'final') {
                      handleGameClick(game.id);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <img
              src={nbaLogo48}
              alt="NBA Logo"
              className="w-24 h-24 mb-4 mx-auto"
            />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No games scheduled
            </h3>
            <p className="text-muted-foreground">
              Try selecting a different date to see more games
            </p>
          </div>
        )}
      </div>

    </div>
  );
}