import { useState } from 'react';
import { useStandings } from '../../hooks/useStandings';
import ConferenceStandings from './ConferenceStandings';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, AlertCircle, Trophy } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

function StandingsSkeletonRow() {
  return (
    <div className="flex items-center justify-between gap-2 border-l-2 border-l-transparent px-2.5 py-2">
      <div className="flex items-center gap-2.5 flex-1">
        <Skeleton className="h-6 w-6 rounded-md" />
        <Skeleton className="h-7 w-7 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-6" />
        <Skeleton className="h-4 w-6" />
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-4 w-6" />
      </div>
    </div>
  );
}

function StandingsSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full rounded-lg" />
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-2.5 py-2">
          <Skeleton className="h-4 w-24" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-6" />
            <Skeleton className="h-4 w-6" />
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-6" />
          </div>
        </div>
        <div className="divide-y divide-border/50">
          {Array.from({ length: 15 }).map((_, i) => (
            <StandingsSkeletonRow key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex items-center justify-center gap-4 text-[10px] font-medium text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-playoff" />
        Playoff
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-playin" />
        Play-In
      </span>
    </div>
  );
}

export default function StandingsList() {
  const [selectedConference, setSelectedConference] = useState('eastern');
  const { data: standings, isLoading, error, isFetching } = useStandings();
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['standings'] });
  };

  if (isLoading || (isFetching && !standings)) {
    return <StandingsSkeleton />;
  }

  if (error) {
    return (
      <div className="py-10 text-center space-y-3">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="h-6 w-6" />
        </div>
        <span className="block font-semibold">Failed to load standings</span>
        <p className="text-muted-foreground text-sm">
          Check your internet connection or try again later
        </p>
        <Button onClick={handleRefresh} variant="outline" size="sm" className="mt-2">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (!standings || !standings.conferences.length) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-muted/60 ring-1 ring-border/60">
          <Trophy className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">
          No standings available
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Standings data is currently unavailable
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 w-full">
      {isFetching && standings && (
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-muted-foreground py-1">
          <RefreshCw className="h-3 w-3 animate-spin" />
          Updating standings...
        </div>
      )}

      <Tabs value={selectedConference} onValueChange={setSelectedConference} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="eastern" className="text-xs font-semibold">Eastern</TabsTrigger>
          <TabsTrigger value="western" className="text-xs font-semibold">Western</TabsTrigger>
        </TabsList>

        {standings.conferences.map((conference) => (
          <TabsContent key={conference.id} value={conference.id} className="w-full mt-2">
            <ConferenceStandings conference={conference} />
          </TabsContent>
        ))}
      </Tabs>

      <Legend />
    </div>
  );
}
