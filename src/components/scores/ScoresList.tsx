import { useState, useEffect, useMemo } from "react";
import { useScores } from "../../hooks/useScores";
import { useGamePreview } from "@/hooks/useGamePreview";
import { useFavoriteTeam } from "@/hooks/useFavoriteTeam";
import { sortGamesByPriority } from "@/utils/gameUtils";
import { BoxScore } from "@/types/game";
import GameCard from "./GameCard";
import GamePreview from "./GamePreview";
import DateCarousel from "./DateCarousel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, AlertCircle, CalendarOff } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { sportsApi } from "../../services/api";
import { format, startOfDay, addDays } from "date-fns";
import nbaLogo48 from "/icons/icon48.png";

function GameCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
      <div className="flex items-center justify-center pt-2.5 pb-1.5">
        <Skeleton className="h-4 w-14 rounded-full" />
      </div>
      <div className="space-y-1.5 px-3 pb-3 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-2 w-8" />
            </div>
          </div>
          <Skeleton className="h-6 w-7" />
        </div>
        <div className="flex items-center gap-3 py-0.5">
          <div className="h-px flex-1 bg-border/40" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-2 w-8" />
            </div>
          </div>
          <Skeleton className="h-6 w-7" />
        </div>
      </div>
    </div>
  );
}

interface ScoresListProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function ScoresList({
  selectedDate,
  onDateChange,
}: ScoresListProps) {
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const { data: games, isLoading, error, isFetching } = useScores(selectedDate);
  const { favoriteTeam } = useFavoriteTeam();
  const {
    boxScore,
    isLoading: isPreviewLoading,
    openPreview,
    closePreview,
  } = useGamePreview();
  const queryClient = useQueryClient();

  const sortedGames = useMemo(() => {
    if (!games) return games;
    return sortGamesByPriority(games, favoriteTeam);
  }, [games, favoriteTeam]);

  useEffect(() => {
    const prefetchWindow = (date: Date) => {
      const normalizedDate = startOfDay(date);
      const windowStart = addDays(normalizedDate, -2);
      const windowKey = format(windowStart, "yyyyMMdd");
      queryClient.prefetchQuery({
        queryKey: ["scores", "window", windowKey],
        queryFn: async () => {
          const startDate = format(windowStart, "yyyyMMdd");
          const endDate = format(addDays(windowStart, 4), "yyyyMMdd");
          const dateRange = `${startDate}-${endDate}`;
          return await sportsApi.getScoreboard(dateRange);
        },
        staleTime: 5 * 60 * 1000,
      });
    };

    prefetchWindow(addDays(selectedDate, -5));
    prefetchWindow(addDays(selectedDate, 5));
  }, [selectedDate, queryClient]);

  const handleRefresh = () => {
    const normalizedDate = startOfDay(selectedDate);
    const windowStart = addDays(normalizedDate, -2);
    const windowKey = format(windowStart, "yyyyMMdd");
    queryClient.invalidateQueries({
      queryKey: ["scores", "window", windowKey],
    });
  };

  const handleGameClick = (gameId: string) => {
    try {
      setSelectedGameId(gameId);
      openPreview(gameId);
    } catch (error) {
      console.error("Failed to open game preview:", error);
      setSelectedGameId(null);
    }
  };

  const handleBackToScores = () => {
    setSelectedGameId(null);
    closePreview();
  };

  if (isLoading || (isFetching && !games)) {
    return (
      <div className="space-y-3">
        <DateCarousel selectedDate={selectedDate} onDateChange={onDateChange} />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <GameCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <DateCarousel selectedDate={selectedDate} onDateChange={onDateChange} />
        <div className="py-10 text-center space-y-3">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="h-6 w-6" />
          </div>
          <span className="block font-semibold">Failed to load games</span>
          <p className="text-muted-foreground text-sm">
            Check your internet connection or try again later
          </p>
          <Button onClick={handleRefresh} variant="outline" size="sm" className="mt-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 w-full">
      <DateCarousel selectedDate={selectedDate} onDateChange={onDateChange} />

      {isFetching && games && (
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-muted-foreground py-1">
          <RefreshCw className="h-3 w-3 animate-spin" />
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
        ) : sortedGames && sortedGames.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 w-full">
            {sortedGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onCardClick={() => {
                  if (game.status === "in" || game.status === "final") {
                    handleGameClick(game.id);
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-muted/60 ring-1 ring-border/60">
              <CalendarOff className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">
              No games scheduled
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try selecting a different date to see more games
            </p>
            <img
              src={nbaLogo48}
              alt="NBA Logo"
              className="mt-5 h-8 w-8 opacity-30"
            />
          </div>
        )}
      </div>
    </div>
  );
}
