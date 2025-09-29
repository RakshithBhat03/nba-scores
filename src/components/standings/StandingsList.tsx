import { useState } from 'react';
import { useStandings } from '../../hooks/useStandings';
import ConferenceStandings from './ConferenceStandings';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

function StandingsSkeletonRow() {
  return (
    <div className="flex items-center justify-between px-2 py-2 border-b border-border">
      <div className="flex items-center space-x-2 flex-1">
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-7 w-7 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex space-x-6">
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-8" />
      </div>
    </div>
  );
}

function StandingsSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-10 w-full rounded-lg" />
      <div className="bg-card rounded-lg border">
        <div className="px-2 py-2 border-b border-border">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <div className="flex space-x-6">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-8" />
            </div>
          </div>
        </div>
        <div className="space-y-0">
          {Array.from({ length: 15 }).map((_, i) => (
            <StandingsSkeletonRow key={i} />
          ))}
        </div>
      </div>
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
      <div className="py-8 text-center space-y-4">
        <div className="flex items-center justify-center text-destructive mb-2">
          <AlertCircle className="h-6 w-6 mr-2" />
          <span className="font-semibold">Failed to load standings</span>
        </div>
        <p className="text-muted-foreground text-sm">
          Check your internet connection or try again later
        </p>
        <Button onClick={handleRefresh} variant="outline" className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (!standings || !standings.conferences.length) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No standings available
        </h3>
        <p className="text-muted-foreground">
          Standings data is currently unavailable
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 w-full">
      <Tabs value={selectedConference} onValueChange={setSelectedConference} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="eastern">Eastern Conference</TabsTrigger>
          <TabsTrigger value="western">Western Conference</TabsTrigger>
        </TabsList>

        {standings.conferences.map((conference) => (
          <TabsContent key={conference.id} value={conference.id} className="w-full mt-2">
            <ConferenceStandings conference={conference} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}